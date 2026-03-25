import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Square, SkipForward, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

const GRID_SIZE = 16;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

export default function LifeMode() {
  const [grid, setGrid] = useState<boolean[]>(Array(TOTAL_CELLS).fill(false));
  const [numberStr, setNumberStr] = useState('0');
  const [isPlaying, setIsPlaying] = useState(false);
  const [generation, setGeneration] = useState(0);
  
  const timerRef = useRef<number | null>(null);

  // Sync grid to number
  useEffect(() => {
    let bin = '';
    for (let i = 0; i < TOTAL_CELLS; i++) {
      bin += grid[i] ? '1' : '0';
    }
    setNumberStr(BigInt('0b' + bin).toString(10));
  }, [grid]);

  // Sync number to grid
  const handleNumberChange = (val: string) => {
    setNumberStr(val);
    try {
      if (val) {
        let bin = BigInt(val).toString(2).padStart(TOTAL_CELLS, '0');
        if (bin.length > TOTAL_CELLS) bin = bin.slice(-TOTAL_CELLS);
        
        const newGrid = Array(TOTAL_CELLS).fill(false);
        for (let i = 0; i < TOTAL_CELLS; i++) {
          newGrid[i] = bin[i] === '1';
        }
        setGrid(newGrid);
        setGeneration(0);
        setIsPlaying(false);
      } else {
        setGrid(Array(TOTAL_CELLS).fill(false));
        setGeneration(0);
        setIsPlaying(false);
      }
    } catch (e) {
      // invalid
    }
  };

  const toggleCell = (index: number) => {
    const newGrid = [...grid];
    newGrid[index] = !newGrid[index];
    setGrid(newGrid);
    setGeneration(0);
    setIsPlaying(false);
  };

  const computeNextGeneration = useCallback(() => {
    setGrid((currentGrid) => {
      const newGrid = [...currentGrid];
      for (let i = 0; i < TOTAL_CELLS; i++) {
        const row = Math.floor(i / GRID_SIZE);
        const col = i % GRID_SIZE;
        let neighbors = 0;

        // Check 8 neighbors
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = row + dr;
            const nc = col + dc;
            // Wrap around (toroidal array)
            const wrappedRow = (nr + GRID_SIZE) % GRID_SIZE;
            const wrappedCol = (nc + GRID_SIZE) % GRID_SIZE;
            const neighborIndex = wrappedRow * GRID_SIZE + wrappedCol;
            if (currentGrid[neighborIndex]) neighbors++;
          }
        }

        if (currentGrid[i]) {
          newGrid[i] = neighbors === 2 || neighbors === 3;
        } else {
          newGrid[i] = neighbors === 3;
        }
      }
      return newGrid;
    });
    setGeneration((g) => g + 1);
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(computeNextGeneration, 200);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, computeNextGeneration]);

  const generateRandom = () => {
    let bin = '';
    for (let i = 0; i < TOTAL_CELLS; i++) {
      bin += Math.random() > 0.7 ? '1' : '0'; // 30% fill rate for better patterns
    }
    handleNumberChange(BigInt('0b' + bin).toString(10));
  };

  const clearGrid = () => {
    handleNumberChange('0');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-start max-w-6xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-muted-foreground">256位细胞自动机 (16x16)</label>
          <div className="flex gap-2">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearGrid}
              className="text-xs px-3 py-1.5 bg-secondary text-secondary-foreground hover:bg-accent rounded-md transition-colors shadow-sm"
            >
              清空
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateRandom}
              className="text-xs px-3 py-1.5 bg-secondary text-secondary-foreground hover:bg-accent rounded-md transition-colors shadow-sm"
            >
              随机初始态
            </motion.button>
          </div>
        </div>
        
        <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex justify-center">
          <div 
            className="grid gap-[2px] bg-border p-[2px] rounded-lg"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
          >
            {grid.map((isAlive, index) => (
              <motion.div 
                key={index}
                onClick={() => toggleCell(index)}
                animate={{ 
                  backgroundColor: isAlive ? 'var(--primary)' : 'var(--card)',
                  scale: isAlive ? 1 : 0.95,
                  borderRadius: isAlive ? '2px' : '4px'
                }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.1, zIndex: 10 }}
                className="w-4 h-4 sm:w-6 sm:h-6 cursor-pointer"
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="text-sm font-mono text-muted-foreground">
            世代: {generation}
          </div>
          <div className="flex gap-2">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={computeNextGeneration}
              disabled={isPlaying}
              className="flex items-center gap-1 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-accent rounded-lg font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SkipForward size={16} /> 下一代
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all shadow-sm ${
                isPlaying 
                  ? 'bg-foreground text-background hover:bg-foreground/90' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {isPlaying ? <><Square size={16} /> 暂停</> : <><Play size={16} /> 演化</>}
            </motion.button>
          </div>
        </div>
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
          <p>16x16 的网格包含 256 个细胞，每个细胞的存活状态（0 或 1）可以组合成一个 <strong>256 位整数</strong>。</p>
          <p>这个数字代表了康威生命游戏（Conway's Game of Life）的一个初始状态。点击“演化”观察这个数字如何随时间“生长”和“变化”。</p>
        </motion.div>
      </div>
    </div>
  )
}
