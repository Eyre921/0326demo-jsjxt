import { useState, useEffect } from 'react';

export default function ColorMode() {
  const [colors, setColors] = useState<string[]>(['#FAF9F5', '#3D3D3A', '#F0EEE6', '#141413']);
  const [numberStr, setNumberStr] = useState('');

  // Update number when colors change
  useEffect(() => {
    const hexString = colors.map(c => c.replace('#', '')).join('');
    setNumberStr(BigInt('0x' + hexString).toString(10));
  }, [colors]);

  const handleNumberChange = (val: string) => {
    setNumberStr(val);
    try {
      if (val) {
        let hex = BigInt(val).toString(16).padStart(24, '0');
        if (hex.length > 24) hex = hex.slice(-24); // truncate if too large
        
        const newColors = [
          '#' + hex.slice(0, 6),
          '#' + hex.slice(6, 12),
          '#' + hex.slice(12, 18),
          '#' + hex.slice(18, 24)
        ];
        setColors(newColors);
      } else {
        setColors(['#000000', '#000000', '#000000', '#000000']);
      }
    } catch (e) {
      // invalid
    }
  };

  const handleColorChange = (index: number, newColor: string) => {
    const newColors = [...colors];
    newColors[index] = newColor;
    setColors(newColors);
  };

  const randomizeColors = () => {
    const randomHex = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setColors([randomHex(), randomHex(), randomHex(), randomHex()]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-start max-w-6xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-muted-foreground">96位色彩调色盘 (4个24位颜色)</label>
          <button 
            onClick={randomizeColors}
            className="text-xs px-3 py-1.5 bg-secondary text-secondary-foreground hover:bg-accent rounded-md transition-colors shadow-sm"
          >
            随机生成
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {colors.map((color, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div 
                className="h-32 rounded-xl shadow-sm border border-border flex items-end p-3 transition-colors duration-300 relative overflow-hidden group"
                style={{ backgroundColor: color }}
              >
                <input 
                  type="color" 
                  value={color}
                  onChange={(e) => handleColorChange(i, e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono text-foreground shadow-sm group-hover:bg-background transition-colors">
                  {color.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
         <label className="text-sm font-medium text-muted-foreground">数字表示 (十进制)</label>
         <textarea 
          value={numberStr}
          onChange={(e) => handleNumberChange(e.target.value)}
          className="h-48 bg-input border border-border rounded-xl p-6 font-mono text-xl text-foreground focus:ring-2 focus:ring-ring focus:outline-none resize-none break-all transition-all shadow-sm"
          placeholder="输入一个巨大的数字..."
        />
        <div className="text-sm text-muted-foreground border-l-4 border-primary pl-4 mt-4 py-1 space-y-2 bg-card p-4 rounded-r-xl shadow-sm transition-colors duration-300">
          <p>4 个 RGB 颜色，每个颜色 24 位，组合起来就是一个 <strong>96 位整数</strong>。</p>
          <p>你可以输入一个最大为 <code className="bg-muted px-1.5 py-0.5 rounded text-foreground break-all">79228162514264337593543950335</code> 的数字，它将决定这四个颜色的命运。</p>
        </div>
      </div>
    </div>
  )
}
