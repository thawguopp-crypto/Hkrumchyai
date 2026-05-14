import { motion } from 'motion/react';
import { ArrowLeft, Search, MoreHorizontal, Image as ImageIcon, FileText, Link, MapPin, Music } from 'lucide-react';

interface FavoritesProps {
  onBack: () => void;
}

const ITEMS = [
  { id: '1', type: 'image', content: 'Vacation Photo', timestamp: '2 days ago', icon: ImageIcon, color: 'text-blue-500' },
  { id: '2', type: 'link', content: 'How to build a WeChat Clone', timestamp: '1 week ago', icon: Link, color: 'text-green-500' },
  { id: '3', type: 'file', content: 'Project_Proposal.pdf', timestamp: 'May 10', icon: FileText, color: 'text-orange-500' },
  { id: '4', type: 'location', content: 'Central Park, NY', timestamp: 'April 20', icon: MapPin, color: 'text-red-500' },
];

export function Favorites({ onBack }: FavoritesProps) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-[#f7f7f7] z-[270] flex flex-col h-screen overflow-hidden"
    >
      <header className="h-14 bg-white flex items-center justify-between px-4 border-b border-wechat-border/20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-1 -ml-1 text-wechat-text-primary">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="font-semibold text-wechat-text-primary">Favorites</h2>
        </div>
        <div className="flex items-center gap-4">
          <Search className="w-5 h-5 text-wechat-text-secondary" />
          <MoreHorizontal className="w-5 h-5 text-wechat-text-secondary" />
        </div>
      </header>

      <div className="bg-white flex items-center p-3 gap-6 overflow-x-auto border-b border-gray-100 shrink-0 no-scrollbar">
        {['All', 'Images', 'Links', 'Files', 'Music', 'Location'].map(filter => (
          <button key={filter} className={filter === 'All' ? "text-wechat-green font-medium text-sm" : "text-wechat-text-secondary text-sm"}>
            {filter}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto mt-2">
        <div className="bg-white divide-y divide-gray-50 border-y border-gray-100">
          {ITEMS.map(item => (
            <div key={item.id} className="p-4 flex gap-4 active:bg-gray-50 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h4 className="text-sm font-medium text-wechat-text-primary">{item.content}</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-wechat-text-secondary">{item.type.toUpperCase()}</span>
                  <span className="text-[10px] text-gray-400">{item.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
