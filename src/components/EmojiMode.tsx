import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete } from 'lucide-react';

const EMOJIS = ['🌍','🌕','🌑','🔥','💧','🌬️','✨','⚡','❄️','🌈','☀️','☁️','🍎','🍋','🍉','🍇','🍓','🍒','🍑','🍍','🥥','🥝','🍅','🥑','🍔','🍟','🍕','🌭','🍿','🍩','🍪','🍫','🍬','🍭','☕','🍵','🥤','🧃','⚽','🏀','🏈','⚾','🎾','🏐','🏉','🎱','🪀','🏓','🏸','🏒','🏑','🥍','🏏','🪃','🥅','⛳','🪁','🏹','🎣','🤿','🥊','🥋','🎽','🛹'];

export default function EmojiMode() {
  const [numberStr, setNumberStr] = useState('0');
  const [emojiArray, setEmojiArray] = useState<string[]>(['🌍']);

  useEffect(() => {
    try {
      if (!numberStr) {
        setEmojiArray([]);
        return;
      }
      let num = BigInt(numberStr);
      if (num === 0n) {
        setEmojiArray([EMOJIS[0]]);
        return;
      }
      const res = [];
      while (num > 0n) {
        const rem = Number(num % 64n);
        res.unshift(EMOJIS[rem]);
        num = num / 64n;
      }
      setEmojiArray(res);
    } catch (e) {
      // ignore
    }
  }, [numberStr]);

  const appendEmoji = (emoji: string) => {
    const idx = BigInt(EMOJIS.indexOf(emoji));
    let num = numberStr ? BigInt(numberStr) : 0n;
    num = num * 64n + idx;
    setNumberStr(num.toString());
  };

  const backspace = () => {
    let num = numberStr ? BigInt(numberStr) : 0n;
    num = num / 64n;
    setNumberStr(num.toString());
  };

  const clear = () => setNumberStr('0');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-start max-w-6xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-muted-foreground">64进制表情密码</label>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clear}
            className="text-xs px-3 py-1.5 bg-secondary text-secondary-foreground hover:bg-accent rounded-md transition-colors shadow-sm"
          >
            清空
          </motion.button>
        </div>
        
        <div className="min-h-[120px] bg-input border border-border rounded-xl p-6 text-4xl flex flex-wrap content-start gap-2 shadow-sm relative overflow-hidden">
          <AnimatePresence mode="popLayout">
            {emojiArray.map((emoji, i) => (
              <motion.span
                layout
                key={`${i}-${emoji}`}
                initial={{ opacity: 0, scale: 0, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="inline-block"
              >
                {emoji}
              </motion.span>
            ))}
          </AnimatePresence>
          {emojiArray.length === 0 && <span className="text-muted-foreground/30 text-2xl">点击下方表情输入...</span>}
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-muted-foreground">表情键盘 (Base64)</span>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={backspace} 
              className="p-1.5 bg-secondary text-secondary-foreground rounded hover:bg-accent transition-colors"
            >
              <Delete size={16} />
            </motion.button>
          </div>
          <div className="grid grid-cols-8 sm:grid-cols-8 gap-1 sm:gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            {EMOJIS.map((emoji, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.2, zIndex: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => appendEmoji(emoji)}
                className="text-2xl sm:text-3xl hover:bg-accent rounded-lg p-1 transition-colors"
                title={`Value: ${i}`}
              >
                {emoji}
              </motion.button>
            ))}
          </div>
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
          <p>我们将 64 个表情符号映射为 0 到 63 的数字，构建了一个 <strong>Base-64 表情编码系统</strong>。</p>
          <p>任何一串表情，在底层都只是一串庞大的十进制数字。试着用表情写一段“密码”吧！</p>
        </motion.div>
      </div>
    </div>
  )
}
