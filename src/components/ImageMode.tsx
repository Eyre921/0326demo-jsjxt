import { useState, useEffect } from 'react';

export default function ImageMode() {
  const [grid, setGrid] = useState<boolean[]>(Array(64).fill(false));
  const [numberStr, setNumberStr] = useState('0');

  // Update number when grid changes
  useEffect(() => {
    let bin = '';
    for (let i = 0; i < 64; i++) {
      bin += grid[i] ? '1' : '0';
    }
    setNumberStr(BigInt('0b' + bin).toString());
  }, [grid]);

  const handleNumberChange = (val: string) => {
    setNumberStr(val);
    try {
      if (val) {
        let bin = BigInt(val).toString(2).padStart(64, '0');
        if (bin.length > 64) bin = bin.slice(-64); // truncate if too large
        const newGrid = bin.split('').map(c => c === '1');
        setGrid(newGrid);
      } else {
        setGrid(Array(64).fill(false));
      }
    } catch (e) {
      // invalid
    }
  };

  const togglePixel = (index: number) => {
    const newGrid = [...grid];
    newGrid[index] = !newGrid[index];
    setGrid(newGrid);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-start">
      <div className="flex flex-col gap-4">
        <label className="font-mono text-[#00FF00] uppercase text-sm tracking-widest">8x8 Pixel Grid (64-bit)</label>
        <div className="grid grid-cols-8 gap-1 w-fit border border-white/20 p-2 bg-white/5">
          {grid.map((isActive, i) => (
            <div 
              key={i} 
              onClick={() => togglePixel(i)}
              className={`w-10 h-10 sm:w-12 sm:h-12 cursor-pointer transition-colors duration-75 ${isActive ? 'bg-[#00FF00] shadow-[0_0_10px_#00FF00]' : 'bg-[#1a1a1a] hover:bg-white/20'}`}
            />
          ))}
        </div>
        <button 
          onClick={() => setGrid(Array(64).fill(false))}
          className="mt-4 px-6 py-3 border border-white/20 font-mono text-sm hover:bg-white/10 hover:border-white/50 w-fit transition-all uppercase tracking-widest"
        >
          Clear Grid
        </button>
      </div>
      <div className="flex flex-col gap-4">
         <label className="font-mono text-[#00FF00] uppercase text-sm tracking-widest">Numeric Representation (Base 10)</label>
         <textarea 
          value={numberStr}
          onChange={(e) => handleNumberChange(e.target.value)}
          className="h-48 bg-transparent border border-white/20 p-6 font-mono text-2xl focus:border-[#00FF00] focus:outline-none resize-none break-all transition-colors"
        />
        <div className="font-mono text-sm text-white/60 border-l-2 border-[#00FF00] pl-4 mt-4 space-y-2">
          <p>Every 8x8 black-and-white image is just a 64-bit integer.</p>
          <p>Try typing a random number up to <strong>18446744073709551615</strong>.</p>
        </div>
      </div>
    </div>
  )
}
