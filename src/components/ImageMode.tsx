import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-start max-w-6xl mx-auto">
      <div className="flex flex-col gap-4">
        <label className="text-sm font-medium text-muted-foreground">8x8 像素网格 (64位)</label>
        <div className="grid grid-cols-8 gap-1 w-fit border border-border p-2 bg-card rounded-xl shadow-sm transition-colors duration-300">
          {grid.map((isActive, i) => (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.005, type: 'spring', stiffness: 300 }}
              key={i} 
              onClick={() => togglePixel(i)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-10 h-10 sm:w-12 sm:h-12 cursor-pointer rounded-sm transition-colors duration-200 ${
                isActive 
                  ? 'bg-primary shadow-sm' 
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setGrid(Array(64).fill(false))}
          className="mt-4 px-6 py-2.5 bg-secondary text-secondary-foreground hover:bg-accent rounded-lg text-sm font-medium transition-colors w-fit shadow-sm"
        >
          清空网格
        </motion.button>
      </div>
      <div className="flex flex-col gap-4">
         <label className="text-sm font-medium text-muted-foreground">数字表示 (十进制)</label>
         <textarea 
          value={numberStr}
          onChange={(e) => handleNumberChange(e.target.value)}
          className="h-48 bg-input border border-border rounded-xl p-6 font-mono text-xl text-foreground focus:ring-2 focus:ring-ring focus:outline-none resize-none break-all transition-all shadow-sm"
        />
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground border-l-4 border-primary pl-4 mt-4 py-1 space-y-2 bg-card p-4 rounded-r-xl shadow-sm transition-colors duration-300"
        >
          <p>每一个 8x8 的黑白图像，本质上都只是一个 <strong>64 位整数</strong>。</p>
          <p>尝试输入一个最大为 <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">18446744073709551615</code> 的随机数，看看它会生成什么图案。</p>
        </motion.div>
      </div>
    </div>
  )
}
