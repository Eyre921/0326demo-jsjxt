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
import { Image as ImageIcon, Music, Type, BookOpen, Sun, Moon, Palette, Activity, Hexagon, Smile, Dna, AudioLines, Menu, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('theory');
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300 overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-card z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold tracking-tight">数字炼金术</h1>
        </div>
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 shrink-0 bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground hidden lg:block">数字炼金术</h1>
              <p className="text-xs text-muted-foreground mt-1 hidden lg:block">万物皆数 —— 探索数据在不同维度的转换与呈现。</p>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto space-y-1 pr-2 -mr-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground hover:scale-[1.02]'
                }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-primary-foreground' : 'text-muted-foreground'} />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-border hidden lg:flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">主题设置</span>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              title="切换主题"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden pt-16 lg:pt-0 relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="max-w-5xl mx-auto h-full">
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
          </div>
        </div>
      </main>
    </div>
  )
}

