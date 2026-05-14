import { useState } from 'react';
import { ArrowLeft, ChevronRight, Camera } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onUpdate: (user: User) => void;
  onBack: () => void;
}

export function ProfileScreen({ user, onUpdate, onBack }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editId, setEditId] = useState(user.hkrumchyId || '');
  const [editAvatar, setEditAvatar] = useState(user.avatar);

  const handleSave = () => {
    onUpdate({
      ...user,
      name: editName,
      hkrumchyId: editId,
      avatar: editAvatar,
    });
    setIsEditing(false);
  };

  const handleAvatarChange = () => {
    const newSeed = Math.random().toString(36).substring(7);
    setEditAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`);
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-[#EDEDED] z-[160] flex flex-col h-screen overflow-hidden"
    >
      <header className="h-14 bg-[#f3f3f3] border-b border-[#e0e0e0] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center">
          <button onClick={onBack} className="p-1 -ml-1 text-[#666] hover:bg-black/5 rounded-full transition-colors mr-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="font-semibold text-wechat-text-primary">
            {isEditing ? 'Edit Profile' : 'My Information'}
          </h2>
        </div>
        {isEditing && (
          <button 
            onClick={handleSave}
            className="bg-wechat-green text-white px-4 py-1 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Save
          </button>
        )}
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-wechat-green text-sm font-medium"
          >
            Edit
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto pt-4 space-y-4">
        {isEditing ? (
          <div className="bg-white border-y border-wechat-border/50 divide-y divide-wechat-border/20">
            <div className="p-4 flex items-center justify-between">
              <span className="text-wechat-text-primary">Profile Photo</span>
              <div className="relative group cursor-pointer" onClick={handleAvatarChange}>
                <img src={editAvatar} className="w-16 h-16 rounded-lg" alt="Avatar" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="p-4 flex items-center">
              <span className="w-24 text-wechat-text-primary">Name</span>
              <input 
                type="text" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1 outline-none text-wechat-text-secondary"
                placeholder="Enter your name"
              />
            </div>
            <div className="p-4 flex items-center">
              <span className="w-24 text-wechat-text-primary">HKRUMCHYAI ID</span>
              <input 
                type="text" 
                value={editId}
                onChange={(e) => setEditId(e.target.value)}
                className="flex-1 outline-none text-wechat-text-secondary"
                placeholder="Enter your ID"
              />
            </div>
          </div>
        ) : (
          <div className="bg-white border-y border-wechat-border/50 divide-y divide-wechat-border/20">
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setIsEditing(true)}>
              <span className="text-wechat-text-primary">Profile Photo</span>
              <div className="flex items-center gap-2">
                <img src={user.avatar} className="w-16 h-16 rounded-lg" alt="Avatar" />
                <ChevronRight className="w-5 h-5 text-wechat-text-secondary/50" />
              </div>
            </div>
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setIsEditing(true)}>
              <span className="text-wechat-text-primary">Name</span>
              <div className="flex items-center gap-2">
                <span className="text-wechat-text-secondary">{user.name}</span>
                <ChevronRight className="w-5 h-5 text-wechat-text-secondary/50" />
              </div>
            </div>
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setIsEditing(true)}>
              <span className="text-wechat-text-primary">HKRUMCHYAI ID</span>
              <div className="flex items-center gap-2">
                <span className="text-wechat-text-secondary">{user.hkrumchyId}</span>
                <ChevronRight className="w-5 h-5 text-wechat-text-secondary/50" />
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="text-wechat-text-primary">More</span>
              <ChevronRight className="w-5 h-5 text-wechat-text-secondary/50" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
