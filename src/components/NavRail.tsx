import { MessageSquare, Users, Compass, User, Globe } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { TabType } from '@/src/types';

interface NavRailProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  avatar: string;
}

export function NavRail({ activeTab, onTabChange, avatar }: NavRailProps) {
  const tabs = [
    { id: 'chats', label: 'Chats', icon: MessageSquare },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'me', label: 'Me', icon: User },
  ] as const;

  return (
    <nav className="w-[72px] bg-wechat-dark flex flex-col items-center py-6 space-y-8 shrink-0 hidden md:flex">
      <div className="w-10 h-10 bg-wechat-green rounded-lg flex items-center justify-center mb-4">
         <Globe className="w-6 h-6 text-white" />
      </div>
      
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "transition-colors hover:text-white cursor-pointer p-2 rounded-lg",
              isActive ? "text-white bg-white/10" : "text-[#999]"
            )}
          >
            <Icon className="w-7 h-7" />
          </button>
        );
      })}

      <div className="mt-auto mb-4">
        <div className="w-9 h-9 rounded-md bg-gray-600 border border-gray-500 overflow-hidden">
          <img src={avatar} alt="Me" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
      </div>
    </nav>
  );
}
