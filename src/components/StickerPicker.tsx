import { motion } from 'motion/react';
import { Smile, Gift, Star, Clock } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

interface StickerPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const EMOJIS = ['😊', '😂', '🤣', '😍', '😒', '😭', '😘', '👍', '🙏', '🔥', '🎉', '💔', '🙄', '🤔', '😎', '😴', '😷', '😡', '😱', '💩'];
const STICKERS = [
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG54YnhueG54YnhueG54YnhueG54YnhueG54YnhueG54YngmZXA9djFfaW50ZXJuYWxfZ2lmX2J5X2lkJmN0PWc/3o7TKVUn7iM8FMEU24/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG54YnhueG54YnhueG54YnhueG54YnhueG54YnhueG54YnhueG54YngmZXA9djFfaW50ZXJuYWxfZ2lmX2J5X2lkJmN0PWc/l41lTfuxy6X62dI8U/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG54YnhueG54YnhueG54YnhueG54YnhueG54YnhueG54YnhueG54YngmZXA9djFfaW50ZXJuYWxfZ2lmX2J5X2lkJmN0PWc/3o7TKMG7X2l7v4Dq9O/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueG54YnhueG54YnhueG54YnhueG54YnhueG54YnhueG54YnhueG54YngmZXA9djFfaW50ZXJuYWxfZ2lmX2J5X2lkJmN0PWc/l0Hlx0YhS0xL8v96M/giphy.gif',
];

export function StickerPicker({ onSelect, onClose }: StickerPickerProps) {
  const [activeTab, setActiveTab] = useState<'emoji' | 'sticker'>('emoji');

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="bg-[#f7f7f7] border-t border-wechat-border/50 h-72 flex flex-col overflow-hidden"
    >
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'emoji' ? (
          <div className="grid grid-cols-7 gap-4">
            {EMOJIS.map((emoji, idx) => (
              <button 
                key={idx}
                onClick={() => onSelect(emoji)}
                className="text-2xl hover:bg-gray-200 p-2 rounded transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {STICKERS.map((sticker, idx) => (
              <button 
                key={idx}
                onClick={() => onSelect(sticker)}
                className="aspect-square bg-gray-100 rounded overflow-hidden hover:opacity-80 transition-opacity"
              >
                <img src={sticker} alt="Sticker" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-12 bg-white flex items-center px-4 border-t border-wechat-border/30 gap-6">
        <button 
          onClick={() => setActiveTab('emoji')}
          className={cn("p-1 transition-colors", activeTab === 'emoji' ? "text-wechat-green" : "text-gray-400")}
        >
          <Smile className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setActiveTab('sticker')}
          className={cn("p-1 transition-colors", activeTab === 'sticker' ? "text-wechat-green" : "text-gray-400")}
        >
          <Gift className="w-6 h-6" />
        </button>
        <button className="p-1 text-gray-300">
          <Star className="w-6 h-6" />
        </button>
        <button className="p-1 text-gray-300">
          <Clock className="w-6 h-6" />
        </button>
        <div className="flex-1" />
        <button 
          onClick={onClose}
          className="text-wechat-text-secondary text-sm font-medium pr-2"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}
