import { useState, useEffect } from 'react';
import TextMode from './components/TextMode';
import ImageMode from './components/ImageMode';
import SoundMode from './components/SoundMode';
import TheoryMode from './components/TheoryMode';
import ColorMode from './components/ColorMode';
import RhythmMode from './components/RhythmMode';
import { Image as ImageIcon, Music, Type, BookOpen, Sun, Moon, Palette, Activity } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('text');
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
    { id: 'text', label: '文本 ↔ 数字', icon: Type },
    { id: 'image', label: '图像 ↔ 数字', icon: ImageIcon },
    { id: 'color', label: '色彩 ↔ 数字', icon: Palette },
    { id: 'rhythm', label: '节奏 ↔ 数字', icon: Activity },
    { id: 'sound', label: '旋律 ↔ 数字', icon: Music },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <header className="border-b border-border p-6 md:p-8 flex flex-col xl:flex-row gap-8 justify-between items-start xl:items-center bg-card sticky top-0 z-10 transition-colors duration-300">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">数字炼金术</h1>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              title="切换主题"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">万物皆数 —— 探索数据在不同维度的转换与呈现。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </header>
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {activeTab === 'theory' && <TheoryMode />}
        {activeTab === 'text' && <TextMode />}
        {activeTab === 'image' && <ImageMode />}
        {activeTab === 'color' && <ColorMode />}
        {activeTab === 'rhythm' && <RhythmMode />}
        {activeTab === 'sound' && <SoundMode />}
      </main>
    </div>
  )
}

