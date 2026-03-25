import { useState, useRef } from 'react';
import { Play, Square } from 'lucide-react';

export default function SoundMode() {
  const [numberStr, setNumberStr] = useState('31415926535897932384626433832795');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDigitIndex, setCurrentDigitIndex] = useState<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const stopFlagRef = useRef(false);

  const playSound = async () => {
    if (!numberStr) return;
    if (isPlaying) return;
    
    setIsPlaying(true);
    stopFlagRef.current = false;
    
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') await ctx.resume();

    const digits = numberStr.replace(/\D/g, '').split('').map(Number);
    
    for (let i = 0; i < digits.length; i++) {
      if (stopFlagRef.current) break;
      
      setCurrentDigitIndex(i);
      const digit = digits[i];
      // Pentatonic scale: C4, D4, E4, G4, A4, C5, D5, E5, G5, A5
      const freqs = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
      const freq = freqs[digit];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);
      osc.stop(ctx.currentTime + 0.3);
      
      await new Promise(r => setTimeout(r, 250));
    }
    
    setCurrentDigitIndex(null);
    setIsPlaying(false);
  };

  const stopSound = () => {
    stopFlagRef.current = true;
    setIsPlaying(false);
    setCurrentDigitIndex(null);
  };

  return (
    <div className="flex flex-col gap-8 h-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-muted-foreground">数字序列</label>
        <div className="relative">
          <textarea 
            value={numberStr}
            onChange={(e) => setNumberStr(e.target.value)}
            className="w-full h-64 bg-input border border-border rounded-xl p-6 font-mono text-xl text-foreground focus:ring-2 focus:ring-ring focus:outline-none resize-none break-all transition-all shadow-sm"
            placeholder="输入一串数字..."
            disabled={isPlaying}
          />
          {isPlaying && currentDigitIndex !== null && (
            <div className="absolute top-0 left-0 w-full h-full p-6 pointer-events-none font-mono text-xl break-all">
              <span className="text-transparent">{numberStr.substring(0, currentDigitIndex)}</span>
              <span className="bg-primary text-primary-foreground rounded-sm px-[1px]">{numberStr[currentDigitIndex]}</span>
              <span className="text-transparent">{numberStr.substring(currentDigitIndex + 1)}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-4">
        <button 
          onClick={isPlaying ? stopSound : playSound}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all shadow-sm ${
            isPlaying 
              ? 'bg-foreground text-background hover:bg-foreground/90' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {isPlaying ? <><Square size={20} /> 停止</> : <><Play size={20} /> 播放声音</>}
        </button>
      </div>
      
      <div className="text-sm text-muted-foreground border-l-4 border-primary pl-4 py-1 space-y-2 bg-card p-4 rounded-r-xl shadow-sm transition-colors duration-300">
        <p>每个数字 (0-9) 都映射到五声音阶中的特定频率。</p>
        <p>数字不仅仅是一个数学值；它也可以是一段旋律，一种声音的表达。</p>
      </div>
    </div>
  )
}
