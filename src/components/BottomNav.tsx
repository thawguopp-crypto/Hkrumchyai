import { MessageSquare, Users, Compass, User } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { TabType } from '@/src/types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'chats', label: 'Chats', icon: MessageSquare },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'me', label: 'Me', icon: User },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-wechat-bg border-t border-wechat-border flex items-center justify-around h-16 safe-area-bottom z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full transition-colors",
              isActive ? "text-wechat-green" : "text-wechat-text-primary/60"
            )}
          >
            <div className="relative">
              <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
              {tab.id === 'discover' && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-wechat-bg" />
              )}
            </div>
            <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
