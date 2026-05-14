import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../types';
import { cn } from '../lib/utils';

interface GroupSelectProps {
  contacts: User[];
  onCancel: () => void;
  onCreate: (selectedIds: string[]) => void;
}

export function GroupSelect({ contacts, onCancel, onCreate }: GroupSelectProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (selectedIds.length === 0) return;
    onCreate(selectedIds);
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="fixed inset-0 bg-[#EDEDED] z-[300] flex flex-col h-screen"
    >
      <header className="h-14 bg-[#f3f3f3] border-b border-[#e0e0e0] flex items-center justify-between px-4 shrink-0">
        <button onClick={onCancel} className="text-wechat-text-primary text-sm font-medium">
          Cancel
        </button>
        <h2 className="font-semibold text-wechat-text-primary">Select Contacts</h2>
        <button 
          onClick={handleCreate}
          disabled={selectedIds.length === 0}
          className="bg-wechat-green text-white px-4 py-1.5 rounded-md text-sm font-medium disabled:opacity-50 transition-opacity"
        >
          Done({selectedIds.length})
        </button>
      </header>

      <div className="flex-1 overflow-y-auto bg-white">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex gap-2 overflow-x-auto min-h-[64px]">
          {selectedIds.map(id => {
            const contact = contacts.find(c => c.id === id);
            return contact ? (
              <img key={id} src={contact.avatar} className="w-10 h-10 rounded shadow-sm shrink-0 border border-white" alt="" />
            ) : null;
          })}
        </div>

        <div className="divide-y divide-gray-100">
          {contacts.map((contact) => (
            <div 
              key={contact.id}
              onClick={() => toggleSelection(contact.id)}
              className="flex items-center p-4 gap-4 active:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                selectedIds.includes(contact.id) 
                  ? "bg-wechat-green border-wechat-green" 
                  : "border-gray-300 bg-white"
              )}>
                {selectedIds.includes(contact.id) && <Check className="w-4 h-4 text-white" />}
              </div>
              <img src={contact.avatar} className="w-10 h-10 rounded" alt="" />
              <span className="flex-1 font-medium text-wechat-text-primary">{contact.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
