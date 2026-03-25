import { useState, useEffect, useRef } from 'react';
import { Play, Square } from 'lucide-react';
import { motion } from 'motion/react';

// 15 notes + 1 rest (0)
const SCALE = [
  0, // Rest
  261.63, // C4
  293.66, // D4
  329.63, // E4
  349.23, // F4
  392.00, // G4
  440.00, // A4
  493.88, // B4
  523.25, // C5
  587.33, // D5
  659.25, // E5
  698.46, // F5
  783.99, // G5
  880.00, // A5
  987.77, // B5
  1046.50 // C6
];

const NOTE_NAMES = [
  '-', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'
];

export default function MelodyMode() {
  // 16 steps, each step is a value from 0 to 15 (4 bits)
  const [melody, setMelody] = useState<number[]>(Array(16).fill(0));
  const [numberStr, setNumberStr] = useState('0');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0);
  const currentStepRef = useRef(0);
  const timerIDRef = useRef<number | null>(null);

  // Sync melody to number
  useEffect(() => {
    let bin = '';
    for (let i = 0; i < 16; i++) {
      bin += melody[i].toString(2).padStart(4, '0');
    }
    setNumberStr(BigInt('0b' + bin).toString(10));
  }, [melody]);

  // Sync number to melody
  const handleNumberChange = (val: string) => {
    setNumberStr(val);
    try {
      if (val) {
        let bin = BigInt(val).toString(2).padStart(64, '0');
        if (bin.length > 64) bin = bin.slice(-64);
        
        const newMelody = Array(16).fill(0);
        for (let i = 0; i < 16; i++) {
          const chunk = bin.slice(i * 4, i * 4 + 4);
          newMelody[i] = parseInt(chunk, 2);
        }
        setMelody(newMelody);
      } else {
        setMelody(Array(16).fill(0));
      }
    } catch (e) {
      // invalid
    }
  };

  const updateNote = (index: number, value: number) => {
    const newMelody = [...melody];
    newMelody[index] = value;
    setMelody(newMelody);
  };

  // --- Audio Synthesis ---
  const playNote = (ctx: AudioContext, time: number, freq: number) => {
    if (freq === 0) return; // Rest
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(freq, time);
    
    // Envelope
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.3, time + 0.05); // Attack
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3); // Decay/Release
    
    osc.start(time);
    osc.stop(time + 0.4);
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

      // Play sound
      playNote(ctx, nextNoteTimeRef.current, SCALE[melody[step]]);

      // Advance
      nextNoteTimeRef.current += secondsPerBeat / 2; // 8th notes
      currentStepRef.current = (step + 1) % 16;
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

  const generateRandomMelody = () => {
    const max = 18446744073709551615n; // 64-bit max
    // Generate a random 64-bit number
    let rand = '';
    for (let i = 0; i < 64; i++) {
      rand += Math.random() > 0.5 ? '1' : '0';
    }
    handleNumberChange(BigInt('0b' + rand).toString(10));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-start max-w-6xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-muted-foreground">64位八音盒 (16个音符)</label>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateRandomMelody}
            className="text-xs px-3 py-1.5 bg-secondary text-secondary-foreground hover:bg-accent rounded-md transition-colors shadow-sm"
          >
            随机旋律
          </motion.button>
        </div>
        
        <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
          <div className="grid grid-cols-8 gap-2">
            {melody.map((noteIndex, i) => (
              <motion.div 
                key={i}
                animate={{ 
                  scale: currentStep === i ? 1.1 : 1,
                  y: currentStep === i ? -5 : 0,
                }}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors ${
                  currentStep === i 
                    ? 'bg-primary/10 border-primary ring-2 ring-primary ring-offset-1 ring-offset-card z-10' 
                    : 'bg-muted border-transparent hover:bg-accent z-0'
                }`}
              >
                <div className="text-xs font-mono text-muted-foreground mb-1">{i + 1}</div>
                <input 
                  type="range" 
                  min="0" 
                  max="15" 
                  value={noteIndex}
                  onChange={(e) => updateNote(i, parseInt(e.target.value))}
                  className="w-full h-24 appearance-none bg-transparent [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-border [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                  style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                />
                <div className="text-xs font-bold mt-1 min-h-[16px]">
                  {noteIndex > 0 ? NOTE_NAMES[noteIndex] : '-'}
                </div>
              </motion.div>
            ))}
          </div>
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
          {isPlaying ? <><Square size={20} /> 停止播放</> : <><Play size={20} /> 播放旋律</>}
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
          <p>16 个音符，每个音符有 16 种音高（包含休止符），每个音符占 4 位，总共可以被压缩成一个 <strong>64 位整数</strong>。</p>
          <p>尝试输入一个最大为 <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">18446744073709551615</code> 的数字，听听它蕴含的旋律。</p>
        </motion.div>
      </div>
    </div>
  )
}
