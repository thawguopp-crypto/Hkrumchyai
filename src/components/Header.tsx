import { Search, Plus, ArrowLeft, Camera, Scan } from 'lucide-react';

interface HeaderProps {
  title: string;
  showSearch?: boolean;
  showAdd?: boolean;
  showScan?: boolean;
  onBack?: () => void;
  onAdd?: () => void;
  onScan?: () => void;
}

export function Header({ title, showSearch = true, showAdd = true, showScan = true, onBack, onAdd, onScan }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-wechat-bg h-14 flex items-center justify-between px-6 z-50 border-b border-wechat-border shrink-0">
      <div className="flex items-center gap-2">
        {onBack && (
          <button onClick={onBack} className="p-1 -ml-2 text-wechat-text-primary hover:opacity-70 transition-opacity">
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-base font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-5">
        {showSearch && (
          <button id="header-search-btn" className="text-[#666] hover:opacity-70 transition-opacity">
            <Search className="w-5 h-5" />
          </button>
        )}
        {showScan && onScan && (
          <button 
            id="header-scan-btn" 
            onClick={onScan}
            className="text-[#666] hover:opacity-70 transition-opacity"
          >
            <Scan className="w-5 h-5" />
          </button>
        )}
        {showAdd && (
          <button 
            id="header-add-btn" 
            onClick={onAdd}
            className="flex items-center justify-center bg-[#e2e2e2] rounded w-8 h-8 hover:bg-[#d8d8d8] transition-colors"
          >
            {title === 'Moments' ? <Camera className="w-5 h-5" /> : <Plus className="w-6 h-6" />}
          </button>
        )}
      </div>
    </header>
  );
}
