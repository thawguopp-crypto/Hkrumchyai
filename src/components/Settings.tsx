import { ArrowLeft, Shield, Bell, HardDrive, Info, LogOut, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ListMenu } from './ListMenu';
import { useState } from 'react';
import { BackgroundPicker } from './BackgroundPicker';

interface SettingsProps {
  chatBackground: string;
  onUpdateBackground: (bg: string) => void;
  onBack: () => void;
}

export function SettingsScreen({ chatBackground, onUpdateBackground, onBack }: SettingsProps) {
  const [showBgPicker, setShowBgPicker] = useState(false);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-[#EDEDED] z-[150] flex flex-col h-screen overflow-hidden"
    >
      <header className="h-14 bg-[#f3f3f3] border-b border-[#e0e0e0] flex items-center px-4 shrink-0">
        <button onClick={onBack} className="p-1 -ml-1 text-[#666] hover:bg-black/5 rounded-full transition-colors mr-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="font-semibold text-wechat-text-primary">Settings</h2>
      </header>

      <div className="flex-1 overflow-y-auto pb-10 space-y-4 pt-4">
        <ListMenu 
          items={[
            { id: 'account', label: 'Account & Security', icon: Shield, iconColor: 'bg-blue-600 text-white' },
          ]}
        />

        <ListMenu 
          items={[
            { id: 'notifications', label: 'Notifications', icon: Bell, iconColor: 'bg-orange-500 text-white' },
            { id: 'background', label: 'Chat Background', icon: Palette, iconColor: 'bg-purple-500 text-white', onClick: () => setShowBgPicker(true) },
            { id: 'general', label: 'General', icon: HardDrive, iconColor: 'bg-green-600 text-white' },
          ]}
        />

        <ListMenu 
          items={[
            { id: 'about', label: 'About', icon: Info, iconColor: 'bg-blue-400 text-white' },
          ]}
        />

        <div className="mt-8 space-y-1">
          <button className="w-full bg-white py-4 flex items-center justify-center text-wechat-text-primary font-medium active:bg-gray-100 transition-colors border-y border-wechat-border/50">
            Switch Account
          </button>
          <button className="w-full bg-white py-4 flex items-center justify-center text-wechat-text-primary font-medium active:bg-gray-100 transition-colors border-b border-wechat-border/50">
            Log Out
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showBgPicker && (
          <BackgroundPicker 
            currentBackground={chatBackground}
            onUpdate={onUpdateBackground}
            onBack={() => setShowBgPicker(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
