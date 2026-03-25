import { useState, useEffect } from 'react';
import { textToBigInt, bigIntToText } from '../utils';

export default function TextMode() {
  const [text, setText] = useState('我爱湖南大学！');
  const [numberStr, setNumberStr] = useState('');

  useEffect(() => {
    try {
      setNumberStr(textToBigInt(text).toString());
    } catch (e) {
      // ignore
    }
  }, [text]);

  const handleNumberChange = (val: string) => {
    setNumberStr(val);
    try {
      if (val) {
        setText(bigIntToText(BigInt(val)));
      } else {
        setText('');
      }
    } catch (e) {
      // invalid number, don't update text
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full max-w-6xl mx-auto">
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-muted-foreground">文本输入</label>
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 min-h-[300px] bg-input border border-border rounded-xl p-6 font-sans text-2xl text-foreground focus:ring-2 focus:ring-ring focus:outline-none resize-none transition-all shadow-sm"
          placeholder="输入任何内容..."
        />
      </div>
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-muted-foreground">数字表示 (十进制)</label>
        <textarea 
          value={numberStr}
          onChange={(e) => handleNumberChange(e.target.value)}
          className="flex-1 min-h-[300px] bg-input border border-border rounded-xl p-6 font-mono text-lg text-foreground focus:ring-2 focus:ring-ring focus:outline-none resize-none break-all transition-all shadow-sm"
          placeholder="输入一个大数字..."
        />
      </div>
    </div>
  );
}
