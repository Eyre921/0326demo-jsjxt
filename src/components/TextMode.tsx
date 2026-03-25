import { useState, useEffect } from 'react';
import { textToBigInt, bigIntToText } from '../utils';

export default function TextMode() {
  const [text, setText] = useState('I Love Hunan University!');
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <div className="flex flex-col gap-4">
        <label className="font-mono text-[#00FF00] uppercase text-sm tracking-widest">Text Input</label>
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 min-h-[300px] bg-transparent border border-white/20 p-6 font-sans text-3xl focus:border-[#00FF00] focus:outline-none resize-none transition-colors"
          placeholder="Type anything..."
        />
      </div>
      <div className="flex flex-col gap-4">
        <label className="font-mono text-[#00FF00] uppercase text-sm tracking-widest">Numeric Representation (Base 10)</label>
        <textarea 
          value={numberStr}
          onChange={(e) => handleNumberChange(e.target.value)}
          className="flex-1 min-h-[300px] bg-transparent border border-white/20 p-6 font-mono text-xl focus:border-[#00FF00] focus:outline-none resize-none break-all transition-colors"
          placeholder="Enter a large number..."
        />
      </div>
    </div>
  );
}
