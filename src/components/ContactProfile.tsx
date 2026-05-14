import { ArrowLeft, MessageSquare, Video, Phone, Star, MoreHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../types';

interface ContactProfileProps {
  contact: User;
  onBack: () => void;
  onSendMessage: (id: string) => void;
  onVideoCall: (id: string) => void;
  onVoiceCall: (id: string) => void;
}

export function ContactProfileScreen({ contact, onBack, onSendMessage, onVideoCall, onVoiceCall }: ContactProfileProps) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-[#f1f1f1] z-[600] flex flex-col h-screen overflow-hidden"
    >
      <header className="h-14 bg-white flex items-center justify-between px-4 shrink-0 transition-colors">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-500 hover:bg-black/5 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button className="p-2 text-gray-500 hover:bg-black/5 rounded-full transition-colors">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white p-6 flex items-start gap-4 mb-2">
          <img src={contact.avatar} className="w-16 h-16 rounded-xl object-cover shadow-sm bg-gray-50" alt="" />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 truncate">{contact.name}</h2>
            <div className="text-sm text-gray-500 mt-1">ID: {contact.hkrumchyId}</div>
            <div className="text-sm text-gray-500">Region: United States</div>
          </div>
          <button className="p-2 text-gray-300 hover:text-yellow-400 transition-colors">
            <Star className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white px-6 py-4 mb-2 space-y-4">
          <div className="flex items-center text-sm">
            <span className="w-24 text-gray-400 shrink-0">Moments</span>
            <div className="flex gap-2">
               <div className="w-12 h-12 bg-gray-100 rounded" />
               <div className="w-12 h-12 bg-gray-100 rounded" />
            </div>
          </div>
          <div className="flex items-center text-sm border-t border-gray-50 pt-4">
            <span className="w-24 text-gray-400 shrink-0">More</span>
            <span className="text-gray-900 truncate">{contact.bio || "What's up!"}</span>
          </div>
        </div>

        <div className="bg-white divide-y divide-gray-50">
          <button 
            onClick={() => onSendMessage(contact.id)}
            className="w-full py-4 flex items-center justify-center gap-2 text-[#576b95] font-semibold active:bg-gray-50 transition-colors"
          >
            <MessageSquare className="w-5 h-5 fill-current" />
            Messages
          </button>
          <button 
            onClick={() => onVoiceCall(contact.id)}
            className="w-full py-4 flex items-center justify-center gap-2 text-gray-900 font-semibold active:bg-gray-50 transition-colors"
          >
            <Phone className="w-5 h-5" />
            Voice Call
          </button>
          <button 
            onClick={() => onVideoCall(contact.id)}
            className="w-full py-4 flex items-center justify-center gap-2 text-gray-900 font-semibold active:bg-gray-50 transition-colors"
          >
            <Video className="w-5 h-5" />
            Video Call
          </button>
        </div>
      </div>
    </motion.div>
  );
}
