import { ArrowLeft, MoreHorizontal, Send, Image as ImageIcon, Mic, Video, Phone, Smile, Plus, Wifi } from 'lucide-react';
import { Message, User } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useRef, useEffect } from 'react';
import socket from '@/src/lib/socket';
import { StickerPicker } from './StickerPicker';

interface ChatRoomProps {
  chatId: string;
  chatName: string;
  messages: Message[];
  currentUser: User;
  background?: string;
  isGroup?: boolean;
  onBack: () => void;
  onSendMessage: (text: string, type?: 'text' | 'image' | 'voice') => void;
  onCallInitiated?: (type: 'voice' | 'video') => void;
  onSetBackground?: () => void;
}

export function ChatRoom({ chatId, chatName, messages, currentUser, background = '#EDEDED', isGroup, onBack, onSendMessage, onCallInitiated, onSetBackground }: ChatRoomProps) {
  const [inputText, setInputText] = useState('');
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [isVoiceInput, setIsVoiceInput] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [lastReadMessageId, setLastReadMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOtherTyping]);

  useEffect(() => {
    socket.emit('join-chat', chatId);

    socket.on('user-typing', (data: { chatId: string, userId: string, isTyping: boolean }) => {
      if (data.chatId === chatId && data.userId !== currentUser.id) {
        setIsOtherTyping(data.isTyping);
      }
    });

    socket.on('message-read', (data: { chatId: string, userId: string, lastMessageId: string }) => {
      if (data.chatId === chatId && data.userId !== currentUser.id) {
        setLastReadMessageId(data.lastMessageId);
      }
    });

    return () => {
      socket.off('user-typing');
      socket.off('message-read');
    };
  }, [chatId]);

  // Mark as read when entering or receiving new messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.senderId !== currentUser.id) {
        socket.emit('read-receipt', { chatId, userId: currentUser.id, lastMessageId: lastMsg.id });
      }
    }
  }, [messages, chatId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      setRecordingTime(0);
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleInputChange = (text: string) => {
    setInputText(text);

    // Emit typing event
    socket.emit('typing', { chatId, userId: currentUser.id, isTyping: true });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { chatId, userId: currentUser.id, isTyping: false });
    }, 2000);
  };

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText, 'text');
      setInputText('');
      socket.emit('typing', { chatId, userId: currentUser.id, isTyping: false });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        onSendMessage(base64, 'image');
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] flex flex-col h-screen overflow-hidden"
      style={{ 
        backgroundColor: background.startsWith('url') ? undefined : background,
        backgroundImage: background.startsWith('url') ? background : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Header */}
      <header className="h-14 bg-[#f3f3f3] border-b border-[#e0e0e0] flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 -ml-2 text-[#666] hover:bg-black/5 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col">
            <h2 className="font-semibold text-wechat-text-primary h-5 flex items-center">{chatName}</h2>
            {isOtherTyping && (
              <span className="text-[10px] text-wechat-green animate-pulse">Typing...</span>
            )}
          </div>
        </div>
        <div className="text-[#666] flex items-center gap-6">
          {!isGroup && (
            <>
              <button onClick={() => onCallInitiated?.('voice')} className="hover:text-wechat-green transition-colors">
                <Phone className="w-5 h-5" />
              </button>
              <button onClick={() => onCallInitiated?.('video')} className="hover:text-wechat-green transition-colors">
                <Video className="w-5 h-5" />
              </button>
            </>
          )}
          <div className="relative">
            <MoreHorizontal 
              className="w-5 h-5 cursor-pointer hover:text-wechat-green transition-colors" 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
            />
            <AnimatePresence>
              {showMoreMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMoreMenu(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-20 py-1 overflow-hidden"
                  >
                    <button 
                      onClick={() => {
                        onSetBackground?.();
                        setShowMoreMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                    >
                      <ImageIcon className="w-4 h-4 text-purple-500" />
                      Chat Background
                    </button>
                    <button className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center gap-3">
                      <Plus className="w-4 h-4 text-blue-500" />
                      Mute Notifications
                    </button>
                    <button className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center gap-3 border-t border-gray-50 text-red-500">
                      Clear Chat History
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === currentUser.id;
          const isLastMessage = idx === messages.length - 1;
          const isRead = lastReadMessageId && msg.id === lastReadMessageId || (messages.find(m => m.id === lastReadMessageId)?.timestamp || 0) >= msg.timestamp;
          
          return (
            <div
              key={msg.id}
              className={cn(
                "flex items-start max-w-[85%]",
                isMe ? "ml-auto flex-row-reverse" : "mr-auto flex-row"
              )}
            >
              <div className="w-9 h-9 rounded-md overflow-hidden bg-gray-200 shrink-0">
                <img
                  src={isMe ? currentUser.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderId}`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className={cn("flex flex-col", isMe ? "mr-3 items-end" : "ml-3")}>
                {!isMe && (
                   <span className="text-[10px] text-[#999] mb-1 block">Friend</span>
                )}
                <div
                  className={cn(
                    "rounded-lg shadow-sm text-sm break-words relative overflow-hidden",
                    isMe 
                      ? "bg-wechat-green text-white rounded-tr-none" 
                      : "bg-white text-wechat-text-primary rounded-tl-none",
                    msg.type === 'image' ? "p-1" : (msg.type === 'moment_share' ? "p-0 bg-white" : "px-3 py-2"),
                    msg.type === 'voice' && "flex items-center gap-2 min-w-[100px]"
                  )}
                >
                  {msg.type === 'image' ? (
                    <img 
                      src={msg.text} 
                      alt="Shared Image" 
                      className="max-w-full max-h-60 rounded object-contain cursor-pointer transition-transform active:scale-95" 
                      referrerPolicy="no-referrer"
                      onClick={() => window.open(msg.text, '_blank')}
                    />
                  ) : msg.type === 'voice' ? (
                    <div className={cn("flex flex-1 items-center justify-between", isMe ? "flex-row-reverse" : "flex-row")}>
                      <div className="flex items-center gap-1">
                        <Wifi className={cn("w-4 h-4", isMe ? "rotate-[-90deg]" : "rotate-90")} />
                        <span className="text-xs font-medium">{msg.text}</span>
                      </div>
                      <div 
                        className="bg-current/10 rounded-full" 
                        style={{ width: `${Math.min(100, 20 + parseInt(msg.text) * 5)}px`, height: '2px' }} 
                      />
                    </div>
                  ) : msg.type === 'moment_share' && msg.sharedMoment ? (
                    <div className="w-[180px] bg-white text-wechat-text-primary p-2 flex flex-col gap-2">
                       <div className="flex items-center gap-2">
                          <img src={msg.sharedMoment.authorAvatar} className="w-5 h-5 rounded-full" alt="" />
                          <span className="text-[10px] font-bold text-gray-500">{msg.sharedMoment.authorName}</span>
                       </div>
                       <div className="flex gap-2">
                          {msg.sharedMoment.images?.[0] && (
                            <img src={msg.sharedMoment.images[0]} className="w-12 h-12 rounded object-cover" alt="" />
                          )}
                          <div className="flex-1 text-[10px] line-clamp-3 leading-tight opacity-80">
                             {msg.sharedMoment.content}
                          </div>
                       </div>
                       <div className="border-t border-gray-100 pt-1 text-[8px] text-gray-400 uppercase tracking-widest font-bold">
                          Moments Post
                       </div>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
                {isMe && isLastMessage && (
                  <span className="text-[10px] text-[#999] mt-1">
                    {isRead ? 'Read' : 'Sent'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        {isOtherTyping && (
          <div className="flex items-start mr-auto flex-row max-w-[85%]">
            <div className="w-9 h-9 rounded-md overflow-hidden bg-gray-200 shrink-0 flex items-center justify-center">
              <div className="flex gap-1">
                <span className="w-1 h-1 bg-wechat-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-1 bg-wechat-text-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-1 bg-wechat-text-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar */}
      <footer className="bg-white border-t border-[#e0e0e0] p-4 flex flex-col safe-area-bottom shrink-0">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleImageUpload} 
        />
        <div className="flex items-center space-x-4 text-[#666] mb-3">
           <ImageIcon 
             onClick={() => fileInputRef.current?.click()}
             className="w-6 h-6 cursor-pointer hover:text-wechat-green transition-colors" 
           />
           <Mic 
              onClick={() => setIsVoiceInput(!isVoiceInput)}
              className={cn("w-6 h-6 cursor-pointer transition-colors", isVoiceInput ? "text-wechat-green" : "hover:text-wechat-green")} 
           />
           <Smile 
             onClick={() => setShowStickers(!showStickers)}
             className={cn("w-6 h-6 cursor-pointer transition-colors", showStickers ? "text-wechat-green" : "hover:text-wechat-green")} 
           />
           <Plus className="w-6 h-6 cursor-pointer hover:text-wechat-green transition-colors" />
           <div className="flex-1" />
           {inputText.trim() && (
             <button 
               onClick={handleSend}
               className="bg-wechat-green text-white px-6 py-1.5 rounded text-sm font-medium border border-wechat-green hover:opacity-90 transition-all"
             >
               Send
             </button>
           )}
        </div>
        {isVoiceInput ? (
          <button 
            onMouseDown={() => setIsRecording(true)}
            onMouseUp={() => {
              setIsRecording(false);
              onSendMessage(`${Math.max(1, recordingTime)}"`, 'voice');
            }}
            onTouchStart={() => setIsRecording(true)}
            onTouchEnd={() => {
              setIsRecording(false);
              onSendMessage(`${Math.max(1, recordingTime)}"`, 'voice');
            }}
            className={cn(
              "w-full py-3 rounded-md font-bold text-base transition-colors select-none",
              isRecording ? "bg-gray-300 text-gray-700" : "bg-white border border-gray-300 text-wechat-text-primary active:bg-gray-100"
            )}
          >
            {isRecording ? 'Release to Send' : 'Hold to Talk'}
          </button>
        ) : (
          <textarea 
            className="w-full h-20 resize-none focus:outline-none text-sm bg-transparent" 
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
        )}
      </footer>
      <AnimatePresence>
        {showStickers && (
          <StickerPicker 
            onSelect={(val) => {
              if (val.startsWith('http')) {
                onSendMessage(val, 'image');
                setShowStickers(false);
              } else {
                setInputText(prev => prev + val);
              }
            }}
            onClose={() => setShowStickers(false)}
          />
        )}
      </AnimatePresence>

      {/* Recording Overlay */}
      <AnimatePresence>
        {isRecording && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-[400] pointer-events-none"
          >
            <div className="bg-black/60 backdrop-blur-md p-8 rounded-2xl flex flex-col items-center gap-4 text-white">
               <div className="flex gap-1 items-end h-12">
                  {[...Array(5)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [10, 40, 10] }}
                      transition={{ 
                        duration: 0.8, 
                        repeat: Infinity, 
                        delay: i * 0.1,
                        ease: "easeInOut"
                      }}
                      className="w-1.5 bg-wechat-green rounded-full"
                    />
                  ))}
               </div>
               <span className="text-sm font-medium">Recording... {recordingTime}s</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
