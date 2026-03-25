import { useState, useEffect, useRef } from 'react';
import { Play, Square } from 'lucide-react';
import { motion } from 'motion/react';

const INSTRUMENTS = ['底鼓 (Kick)', '军鼓 (Snare)', '踩镲 (Hi-hat)', '打击乐 (Perc)'];

export default function RhythmMode() {
  // 4 rows (instruments), 8 columns (steps) = 32 bits
  const [grid, setGrid] = useState<boolean[][]>(
    Array(4).fill(null).map(() => Array(8).fill(false))
  );
  const [numberStr, setNumberStr] = useState('0');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0);
  const currentStepRef = useRef(0);
  const timerIDRef = useRef<number | null>(null);

  // Sync grid to number
  useEffect(() => {
    let bin = '';
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 8; col++) {
        bin += grid[row][col] ? '1' : '0';
      }
    }
    setNumberStr(BigInt('0b' + bin).toString(10));
  }, [grid]);

  // Sync number to grid
  const handleNumberChange = (val: string) => {
    setNumberStr(val);
    try {
      if (val) {
        let bin = BigInt(val).toString(2).padStart(32, '0');
        if (bin.length > 32) bin = bin.slice(-32);
        
        const newGrid = Array(4).fill(null).map(() => Array(8).fill(false));
        let i = 0;
        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < 8; col++) {
            newGrid[row][col] = bin[i] === '1';
            i++;
          }
        }
        setGrid(newGrid);
      } else {
        setGrid(Array(4).fill(null).map(() => Array(8).fill(false)));
      }
    } catch (e) {
      // invalid
    }
  };

  const toggleCell = (row: number, col: number) => {
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = !newGrid[row][col];
    setGrid(newGrid);
  };

  // --- Audio Synthesis ---
  const playKick = (ctx: AudioContext, time: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
    osc.start(time);
    osc.stop(time + 0.5);
  };

  const playSnare = (ctx: AudioContext, time: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(250, time);
    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
    osc.start(time);
    osc.stop(time + 0.2);

    // Noise
    const bufferSize = ctx.sampleRate * 0.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(time);
  };

  const playHihat = (ctx: AudioContext, time: number) => {
    const bufferSize = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 10000;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);
    noise.start(time);
  };

  const playPerc = (ctx: AudioContext, time: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(600, time);
    osc.frequency.exponentialRampToValueAtTime(100, time + 0.1);
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    osc.start(time);
    osc.stop(time + 0.1);
  };

  const scheduleNote = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    const secondsPerBeat = 60.0 / 120.0; // 120 BPM
    const timeToSchedule = 0.1; // lookahead
    
    while (nextNoteTimeRef.current < ctx.currentTime + timeToSchedule) {
      const step = currentStepRef.current;
      
      // Schedule UI update
      setTimeout(() => {
        if (isPlaying) setCurrentStep(step);
      }, (nextNoteTimeRef.current - ctx.currentTime) * 1000);

      // Play sounds
      if (grid[0][step]) playKick(ctx, nextNoteTimeRef.current);
      if (grid[1][step]) playSnare(ctx, nextNoteTimeRef.current);
      if (grid[2][step]) playHihat(ctx, nextNoteTimeRef.current);
      if (grid[3][step]) playPerc(ctx, nextNoteTimeRef.current);

      // Advance
      nextNoteTimeRef.current += secondsPerBeat / 2; // 8th notes
      currentStepRef.current = (step + 1) % 8;
    }
    
    timerIDRef.current = requestAnimationFrame(scheduleNote);
  };

  const togglePlay = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      setCurrentStep(null);
      if (timerIDRef.current) cancelAnimationFrame(timerIDRef.current);
    } else {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') await ctx.resume();
      
      setIsPlaying(true);
      currentStepRef.current = 0;
      nextNoteTimeRef.current = ctx.currentTime + 0.05;
      scheduleNote();
    }
  };

  useEffect(() => {
    return () => {
      if (timerIDRef.current) cancelAnimationFrame(timerIDRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  const generateRandomBeat = () => {
    const max = 4294967295; // 32-bit max
    handleNumberChange(Math.floor(Math.random() * max).toString());
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-start max-w-6xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-muted-foreground">32位鼓机 (4轨道 x 8步进)</label>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateRandomBeat}
            className="text-xs px-3 py-1.5 bg-secondary text-secondary-foreground hover:bg-accent rounded-md transition-colors shadow-sm"
          >
            随机节奏
          </motion.button>
        </div>
        
        <div className="flex flex-col gap-2 bg-card border border-border p-4 rounded-xl shadow-sm">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-3">
              <div className="w-24 text-xs font-mono text-muted-foreground">{INSTRUMENTS[rowIndex]}</div>
              <div className="flex gap-1 flex-1">
                {row.map((isActive, colIndex) => (
                  <motion.div 
                    key={colIndex}
                    onClick={() => toggleCell(rowIndex, colIndex)}
                    animate={{ 
                      scale: currentStep === colIndex ? 1.1 : 1,
                      backgroundColor: isActive ? 'var(--primary)' : 'var(--muted)',
                      borderColor: isActive ? 'var(--primary)' : 'transparent'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 aspect-square rounded-sm cursor-pointer border shadow-sm ${currentStep === colIndex ? 'ring-2 ring-ring ring-offset-1 ring-offset-card z-10' : 'z-0'}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={togglePlay}
          className={`mt-2 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all shadow-sm w-full ${
            isPlaying 
              ? 'bg-foreground text-background hover:bg-foreground/90' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {isPlaying ? <><Square size={20} /> 停止播放</> : <><Play size={20} /> 播放节奏</>}
        </motion.button>
      </div>
      
      <div className="flex flex-col gap-4">
         <label className="text-sm font-medium text-muted-foreground">数字表示 (十进制)</label>
         <textarea 
          value={numberStr}
          onChange={(e) => handleNumberChange(e.target.value)}
          className="h-48 bg-input border border-border rounded-xl p-6 font-mono text-xl text-foreground focus:ring-2 focus:ring-ring focus:outline-none resize-none break-all transition-all shadow-sm"
          placeholder="输入一个数字..."
        />
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground border-l-4 border-primary pl-4 mt-4 py-1 space-y-2 bg-card p-4 rounded-r-xl shadow-sm transition-colors duration-300"
        >
          <p>4 个乐器轨道，每个轨道 8 个节拍，总共 32 个状态，可以被压缩成一个 <strong>32 位整数</strong>。</p>
          <p>尝试输入一个最大为 <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">4294967295</code> 的数字，听听它蕴含的节奏。</p>
        </motion.div>
      </div>
    </div>
  )
}
