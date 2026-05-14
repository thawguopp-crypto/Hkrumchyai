import { LucideIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  iconColor?: string;
  onClick?: () => void;
  badge?: string | number;
}

interface ListMenuProps {
  items: MenuItem[];
  className?: string;
}

export function ListMenu({ items, className }: ListMenuProps) {
  return (
    <div className={cn("bg-white border-y border-wechat-border/50", className)}>
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            onClick={item.onClick}
            className={cn(
              "flex items-center p-4 gap-4 active:bg-wechat-bg transition-colors cursor-pointer",
              idx !== items.length - 1 && "border-b border-wechat-border/30"
            )}
          >
            <div className={cn("p-2 rounded-lg", item.iconColor || "bg-blue-500 text-white")}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 text-wechat-text-primary font-medium">
              {item.label}
            </div>
            <div className="flex items-center gap-2">
              {item.badge && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
              <span className="text-wechat-text-secondary/40 text-xl font-light">›</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
