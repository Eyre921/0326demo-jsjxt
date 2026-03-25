import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function ShapeMode() {
  const [numberStr, setNumberStr] = useState('1234567890123456789');
  const [radii, setRadii] = useState<number[]>(Array(8).fill(50));
  const [colors, setColors] = useState<string[]>(['#141413', '#F0EEE6']);

  useEffect(() => {
    try {
      if (!numberStr) return;
      let hex = BigInt(numberStr).toString(16).padStart(16, '0');
      if (hex.length > 16) hex = hex.slice(-16);
      
      const newRadii = [];
      for (let i = 0; i < 8; i++) {
        const val = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
        // Map 0-255 to 20-100 for border radius
        newRadii.push(20 + Math.floor((val / 255) * 80));
      }
      setRadii(newRadii);
      
      setColors(['#' + hex.slice(0, 6).padEnd(6, '0'), '#' + hex.slice(-6).padStart(6, '0')]);
    } catch (e) {
      // ignore
    }
  }, [numberStr]);

  const borderRadius = `${radii[0]}% ${radii[1]}% ${radii[2]}% ${radii[3]}% / ${radii[4]}% ${radii[5]}% ${radii[6]}% ${radii[7]}%`;

  const randomize = () => {
    let hex = '';
    for(let i=0; i<16; i++) hex += Math.floor(Math.random()*16).toString(16);
    setNumberStr(BigInt('0x' + hex).toString(10));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-start max-w-6xl mx-auto">
      <div className="flex flex-col gap-4 items-center justify-center min-h-[400px]">
        <div className="flex justify-between items-center w-full mb-4">
          <label className="text-sm font-medium text-muted-foreground">64位形态 (有机生命体)</label>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={randomize}
            className="text-xs px-3 py-1.5 bg-secondary text-secondary-foreground hover:bg-accent rounded-md transition-colors shadow-sm"
          >
            随机变异
          </motion.button>
        </div>
        
        <div className="relative w-64 h-64 flex items-center justify-center">
          <motion.div 
            animate={{
              borderRadius,
              background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
              rotate: [0, 360]
            }}
            transition={{
              borderRadius: { duration: 0.8, ease: "easeInOut" },
              background: { duration: 0.8, ease: "easeInOut" },
              rotate: { duration: 20, repeat: Infinity, ease: "linear" }
            }}
            className="absolute inset-0 shadow-lg border-4 border-card/50 backdrop-blur-sm"
          />
          <motion.div 
            animate={{
              borderRadius: `${radii[7]}% ${radii[6]}% ${radii[5]}% ${radii[4]}% / ${radii[3]}% ${radii[2]}% ${radii[1]}% ${radii[0]}%`,
              background: `linear-gradient(135deg, ${colors[1]}, ${colors[0]})`,
              rotate: [360, 0]
            }}
            transition={{
              borderRadius: { duration: 0.8, ease: "easeInOut" },
              background: { duration: 0.8, ease: "easeInOut" },
              rotate: { duration: 25, repeat: Infinity, ease: "linear" }
            }}
            className="absolute inset-4 shadow-inner opacity-60 mix-blend-overlay"
          />
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
         <label className="text-sm font-medium text-muted-foreground">数字表示 (十进制)</label>
         <textarea 
          value={numberStr}
          onChange={(e) => setNumberStr(e.target.value)}
          className="h-48 bg-input border border-border rounded-xl p-6 font-mono text-xl text-foreground focus:ring-2 focus:ring-ring focus:outline-none resize-none break-all transition-all shadow-sm"
          placeholder="输入一个数字..."
        />
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground border-l-4 border-primary pl-4 mt-4 py-1 space-y-2 bg-card p-4 rounded-r-xl shadow-sm transition-colors duration-300"
        >
          <p>一个 <strong>64 位整数</strong> 可以被解析为 8 个圆角半径参数和 2 个颜色值。</p>
          <p>数字的微小改变，都会导致这个“有机体”形态和颜色的变异，仿佛数字赋予了它生命。</p>
        </motion.div>
      </div>
    </div>
  )
}
