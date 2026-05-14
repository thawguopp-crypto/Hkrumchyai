import { useState, useMemo } from 'react';
import { Search, ArrowLeft, X, MessageSquare, User, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Chat, User as UserType, Moment } from '../types';
import { cn } from '../lib/utils';

interface SearchScreenProps {
  chats: Chat[];
  contacts: UserType[];
  moments: Moment[];
  onBack: () => void;
  onChatSelect: (id: string) => void;
  onContactSelect: (contact: UserType) => void;
}

export function SearchScreen({ chats, contacts, moments, onBack, onChatSelect, onContactSelect }: SearchScreenProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return { chats: [], contacts: [], moments: [] };
    
    const lowerQuery = query.toLowerCase();
    
    return {
      chats: chats.filter(c => c.name.toLowerCase().includes(lowerQuery)),
      contacts: contacts.filter(c => c.name.toLowerCase().includes(lowerQuery) || c.hkrumchyId.toLowerCase().includes(lowerQuery)),
      moments: moments.filter(m => m.content.toLowerCase().includes(lowerQuery) || m.authorName.toLowerCase().includes(lowerQuery)),
    };
  }, [query, chats, contacts, moments]);

  const hasResults = results.chats.length > 0 || results.contacts.length > 0 || results.moments.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#f7f7f7] z-[500] flex flex-col h-screen"
    >
      <header className="bg-white px-4 pt-4 pb-2 border-b border-wechat-border/30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-wechat-bg rounded-md flex items-center px-3 gap-2">
            <Search className="w-4 h-4 text-wechat-text-secondary" />
            <input 
              autoFocus
              type="text"
              className="flex-1 py-1.5 bg-transparent outline-none text-sm text-wechat-text-primary placeholder:text-gray-400"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-gray-400 p-1 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button 
            onClick={onBack}
            className="text-wechat-green text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {!query ? (
          <div className="p-10 flex flex-col items-center">
            <div className="text-xs text-gray-400 uppercase font-semibold mb-6">Search for</div>
            <div className="grid grid-cols-3 gap-y-8 gap-x-12 w-full max-w-xs">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-xs text-gray-400">Chats</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-xs text-gray-400">Contacts</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="text-xs text-gray-400">Moments</span>
              </div>
            </div>
          </div>
        ) : !hasResults ? (
          <div className="flex flex-col items-center justify-center pt-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">No results found for "{query}"</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {results.chats.length > 0 && (
              <section className="bg-white">
                <div className="px-4 py-2 text-[10px] text-gray-400 uppercase font-bold bg-gray-50/50">Chats</div>
                {results.chats.map(chat => (
                  <div 
                    key={chat.id}
                    onClick={() => {
                      onChatSelect(chat.id);
                      onBack();
                    }}
                    className="p-4 flex items-center gap-3 active:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <img src={chat.avatar} className="w-10 h-10 rounded-md" alt="" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{chat.name}</div>
                      <div className="text-xs text-wechat-text-secondary truncate">{chat.lastMessage}</div>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {results.contacts.length > 0 && (
              <section className="bg-white">
                <div className="px-4 py-2 text-[10px] text-gray-400 uppercase font-bold bg-gray-50/50">Contacts</div>
                {results.contacts.map(contact => (
                  <div 
                    key={contact.id}
                    onClick={() => {
                      onContactSelect(contact);
                      // Don't call onBack here, let the profile screen show over the search screen or handle it in App
                    }}
                    className="p-4 flex items-center gap-3 active:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <img src={contact.avatar} className="w-10 h-10 rounded-md" alt="" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{contact.name}</div>
                      <div className="text-xs text-wechat-text-secondary">ID: {contact.hkrumchyId}</div>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {results.moments.length > 0 && (
              <section className="bg-white">
                <div className="px-4 py-2 text-[10px] text-gray-400 uppercase font-bold bg-gray-50/50">Moments</div>
                {results.moments.map(moment => (
                  <div 
                    key={moment.id}
                    className="p-4 flex items-start gap-3 active:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <img src={moment.authorAvatar} className="w-10 h-10 rounded-md" alt="" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{moment.authorName}</div>
                      <div className="text-xs text-wechat-text-secondary line-clamp-2 mt-0.5">{moment.content}</div>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
