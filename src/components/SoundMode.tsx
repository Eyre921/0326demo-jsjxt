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
    <div className="flex flex-col gap-8 h-full max-w-4xl">
      <div className="flex flex-col gap-4">
        <label className="font-mono text-[#00FF00] uppercase text-sm tracking-widest">Numeric Sequence</label>
        <div className="relative">
          <textarea 
            value={numberStr}
            onChange={(e) => setNumberStr(e.target.value)}
            className="w-full h-64 bg-transparent border border-white/20 p-6 font-mono text-2xl focus:border-[#00FF00] focus:outline-none resize-none break-all transition-colors"
            placeholder="Enter a number..."
            disabled={isPlaying}
          />
          {isPlaying && currentDigitIndex !== null && (
            <div className="absolute top-0 left-0 w-full h-full p-6 pointer-events-none font-mono text-2xl break-all">
              <span className="text-transparent">{numberStr.substring(0, currentDigitIndex)}</span>
              <span className="bg-[#00FF00] text-black">{numberStr[currentDigitIndex]}</span>
              <span className="text-transparent">{numberStr.substring(currentDigitIndex + 1)}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-4">
        <button 
          onClick={isPlaying ? stopSound : playSound}
          className={`flex items-center gap-3 px-8 py-4 font-mono uppercase text-xl border transition-all ${isPlaying ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' : 'bg-[#00FF00] text-black border-[#00FF00] hover:bg-transparent hover:text-[#00FF00]'}`}
        >
          {isPlaying ? <><Square size={24} /> Stop</> : <><Play size={24} /> Play as Sound</>}
        </button>
      </div>
      
      <div className="font-mono text-sm text-white/60 border-l-2 border-[#00FF00] pl-4 space-y-2">
        <p>Every digit (0-9) is mapped to a specific frequency in a pentatonic scale.</p>
        <p>A number is not just a value; it can be a melody.</p>
      </div>
    </div>
  )
}
