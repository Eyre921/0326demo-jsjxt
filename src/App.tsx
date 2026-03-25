import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import TextMode from './components/TextMode';
import ImageMode from './components/ImageMode';
import SoundMode from './components/SoundMode';
import TheoryMode from './components/TheoryMode';
import ColorMode from './components/ColorMode';
import RhythmMode from './components/RhythmMode';
import ShapeMode from './components/ShapeMode';
import EmojiMode from './components/EmojiMode';
import LifeMode from './components/LifeMode';
import MelodyMode from './components/MelodyMode';
import { Image as ImageIcon, Music, Type, BookOpen, Sun, Moon, Palette, Activity, Hexagon, Smile, Dna, AudioLines } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('theory');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const tabs = [
    { id: 'theory', label: '理论探讨', icon: BookOpen },
    { id: 'text', label: '文本', icon: Type },
    { id: 'image', label: '图像', icon: ImageIcon },
    { id: 'color', label: '色彩', icon: Palette },
    { id: 'rhythm', label: '节奏', icon: Activity },
    { id: 'melody', label: '八音盒', icon: AudioLines },
    { id: 'sound', label: '旋律', icon: Music },
    { id: 'shape', label: '形态', icon: Hexagon },
    { id: 'emoji', label: '表情', icon: Smile },
    { id: 'life', label: '生命', icon: Dna },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'theory': return <TheoryMode />;
      case 'text': return <TextMode />;
      case 'image': return <ImageMode />;
      case 'color': return <ColorMode />;
      case 'rhythm': return <RhythmMode />;
      case 'melody': return <MelodyMode />;
      case 'sound': return <SoundMode />;
      case 'shape': return <ShapeMode />;
      case 'emoji': return <EmojiMode />;
      case 'life': return <LifeMode />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <header className="border-b border-border p-6 md:p-8 flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center bg-card sticky top-0 z-10 transition-colors duration-300 shadow-sm">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">数字炼金术</h1>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              title="切换主题"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">万物皆数 —— 探索数据在不同维度的转换与呈现。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </motion.button>
          ))}
        </div>
      </header>
      <main className="flex-1 p-6 md:p-12 overflow-y-auto overflow-x-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

