import { X, Search, Check } from 'lucide-react';
import { Chat, Moment } from '../types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface ShareModalProps {
  moment: Moment;
  chats: Chat[];
  onShare: (selectedChatIds: string[]) => void;
  onClose: () => void;
}

export function ShareModal({ moment, chats, onShare, onClose }: ShareModalProps) {
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleChat = (id: string) => {
    setSelectedChatIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleShare = () => {
    if (selectedChatIds.length > 0) {
      onShare(selectedChatIds);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col h-[600px] max-h-[80vh] overflow-hidden"
      >
        <header className="p-4 border-b flex items-center justify-between shrink-0">
          <button onClick={onClose} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-lg">Send to</h2>
          <button 
            onClick={handleShare}
            disabled={selectedChatIds.length === 0}
            className={cn(
              "px-4 py-1.5 rounded-full font-medium text-sm transition-all",
              selectedChatIds.length > 0 
                ? "bg-wechat-green text-white shadow-md active:scale-95" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            Send ({selectedChatIds.length})
          </button>
        </header>

        <div className="p-4 border-b shrink-0">
          <div className="bg-gray-100 rounded-lg flex items-center px-3 gap-2 py-1.5">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-transparent text-sm w-full outline-none"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filteredChats.map(chat => (
            <button 
              key={chat.id}
              onClick={() => toggleChat(chat.id)}
              className="w-full flex items-center p-3 gap-4 hover:bg-gray-50 rounded-xl transition-colors group"
            >
              <div className="relative">
                <img src={chat.avatar} className="w-12 h-12 rounded-lg object-cover" alt="" />
                <div className={cn(
                  "absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center transition-all",
                  selectedChatIds.includes(chat.id) ? "bg-wechat-green scale-110" : "bg-gray-200"
                )}>
                  {selectedChatIds.includes(chat.id) && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <div className="flex-1 text-left">
                <div className="font-bold text-sm text-gray-900">{chat.name}</div>
                {chat.isGroup && <div className="text-[10px] text-gray-400 uppercase tracking-tighter">Group Chat</div>}
              </div>
            </button>
          ))}
          {filteredChats.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Search className="w-12 h-12 mb-2 opacity-20" />
              <p>No contacts found</p>
            </div>
          )}
        </div>

        {/* Selected preview */}
        <AnimatePresence>
          {selectedChatIds.length > 0 && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="p-4 bg-gray-50 border-t shrink-0 flex gap-2 overflow-x-auto no-scrollbar"
            >
              {selectedChatIds.map(id => {
                const chat = chats.find(c => c.id === id);
                return (
                  <div key={id} className="relative shrink-0">
                    <img src={chat?.avatar} className="w-8 h-8 rounded-md" alt="" />
                    <button 
                      onClick={() => toggleChat(id)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4 bg-gray-50 border-t shrink-0 flex items-start gap-3">
          <div className="text-xs font-bold text-gray-400 uppercase pt-1">Sharing</div>
          <div className="flex-1 bg-white border rounded-lg p-2 flex gap-3 items-center">
             {moment.images?.[0] ? (
               <img src={moment.images[0]} className="w-10 h-10 rounded object-cover" alt="" />
             ) : (
                <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                  <span className="text-[8px] text-gray-400">T</span>
                </div>
             )}
             <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate">Moment by {moment.authorName}</div>
                <div className="text-[10px] text-gray-500 truncate">{moment.content}</div>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
