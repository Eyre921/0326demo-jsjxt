import { useState } from 'react';
import TextMode from './components/TextMode';
import ImageMode from './components/ImageMode';
import SoundMode from './components/SoundMode';
import TheoryMode from './components/TheoryMode';
import { Image as ImageIcon, Music, Type, BookOpen } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('text');

  const tabs = [
    { id: 'theory', label: 'Theory', icon: BookOpen },
    { id: 'text', label: 'Text ↔ Number', icon: Type },
    { id: 'image', label: 'Image ↔ Number', icon: ImageIcon },
    { id: 'sound', label: 'Sound ↔ Number', icon: Music },
  ];

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#00FF00] selection:text-black">
      <header className="border-b border-white/20 p-6 md:p-8 flex flex-col xl:flex-row gap-8 justify-between items-start xl:items-center bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div>
          <h1 className="font-display text-5xl tracking-wider uppercase">Digital Alchemy</h1>
          <p className="font-mono text-sm text-[#00FF00] mt-2 tracking-widest uppercase">Everything is a Number.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-5 py-3 font-mono uppercase text-sm border transition-all ${
                activeTab === tab.id 
                  ? 'bg-[#00FF00] text-black border-[#00FF00] shadow-[0_0_15px_rgba(0,255,0,0.3)]' 
                  : 'border-white/30 hover:border-[#00FF00] hover:text-[#00FF00] bg-black/50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </header>
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {activeTab === 'theory' && <TheoryMode />}
        {activeTab === 'text' && <TextMode />}
        {activeTab === 'image' && <ImageMode />}
        {activeTab === 'sound' && <SoundMode />}
      </main>
    </div>
  )
}

