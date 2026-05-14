import { Search } from 'lucide-react';

interface SearchBarProps {
  onClick?: () => void;
}

export function SearchBar({ onClick }: SearchBarProps) {
  return (
    <div className="bg-white px-3 py-2 border-b border-wechat-border/30 cursor-pointer" onClick={onClick}>
      <div className="bg-wechat-bg rounded-md flex items-center justify-center py-1.5 px-3 gap-2 text-wechat-text-secondary">
        <Search className="w-4 h-4" />
        <span className="text-sm">Search</span>
      </div>
    </div>
  );
}
