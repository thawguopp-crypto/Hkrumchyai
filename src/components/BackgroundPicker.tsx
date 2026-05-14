import { ArrowLeft, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export interface BackgroundPickerProps {
  currentBackground: string;
  onUpdate: (bg: string) => void;
  onBack: () => void;
  title?: string;
}

const PRESET_BGS = [
  { id: 'default', value: '#EDEDED', label: 'Default' },
  { id: 'white', value: '#FFFFFF', label: 'White' },
  { id: 'cream', value: '#F5F5DC', label: 'Cream' },
  { id: 'blue', value: '#E3F2FD', label: 'Light Blue' },
  { id: 'green', value: '#E8F5E9', label: 'Light Green' },
  { id: 'dark', value: '#263238', label: 'Slate' },
];

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1554034483-04fac7c4691c?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=400',
];

export function BackgroundPicker({ currentBackground, onUpdate, onBack, title = 'Chat Background' }: BackgroundPickerProps) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-[#EDEDED] z-[300] flex flex-col h-screen overflow-hidden"
    >
      <header className="h-14 bg-[#f3f3f3] border-b border-[#e0e0e0] flex items-center px-4 shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 text-[#666] hover:bg-black/5 rounded-full transition-colors mr-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="font-semibold text-wechat-text-primary">{title}</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        <section>
          <h3 className="text-xs text-wechat-text-secondary uppercase px-2 mb-3 tracking-wider font-bold">Solid Colors</h3>
          <div className="bg-white rounded-xl border border-wechat-border/50 divide-y divide-gray-50 shadow-sm">
            {PRESET_BGS.map(bg => (
              <button 
                key={bg.id}
                onClick={() => onUpdate(bg.value)}
                className="w-full p-4 flex items-center justify-between active:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-8 h-8 rounded-lg border border-gray-200 shadow-sm transition-transform group-active:scale-95" 
                    style={{ backgroundColor: bg.value }} 
                  />
                  <span className="text-sm font-medium text-wechat-text-primary">{bg.label}</span>
                </div>
                {currentBackground === bg.value && <div className="w-4 h-4 rounded-full bg-wechat-green flex items-center justify-center">
                   <Check className="w-3 h-3 text-white" />
                </div>}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs text-wechat-text-secondary uppercase px-2 mb-3 tracking-wider font-bold">Background Images</h3>
          <div className="grid grid-cols-2 gap-4">
            {PRESET_IMAGES.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => onUpdate(`url(${img})`)}
                className={cn(
                  "aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all relative group shadow-md",
                  currentBackground === `url(${img})` ? "border-wechat-green ring-4 ring-wechat-green/20" : "border-white"
                )}
              >
                <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="" />
                {currentBackground === `url(${img})` && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-wechat-green flex items-center justify-center shadow-lg">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
