import React from 'react';
import { Chat } from '@/src/types';
import { format } from 'date-fns';

interface ChatItemProps {
  chat: Chat;
  onClick: (id: string) => void;
  key?: React.Key;
}

export function ChatItem({ chat, onClick }: ChatItemProps) {
  return (
    <div
      id={`chat-item-${chat.id}`}
      onClick={() => onClick(chat.id)}
      className="flex items-center p-4 gap-3 bg-[#fcfcfc] active:bg-[#e7e7e7] hover:bg-[#f2f2f2] transition-colors cursor-pointer border-b border-[#f5f5f5] last:border-0"
    >
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-200">
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        {chat.unreadCount ? (
          <span className="absolute -top-1 -right-1 bg-[#07c160] text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 border-2 border-white font-bold">
            {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
          </span>
        ) : null}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <h3 className="font-medium text-sm text-wechat-text-primary truncate">{chat.name}</h3>
          {chat.lastTimestamp && (
            <span className="text-[10px] text-wechat-text-secondary whitespace-nowrap">
              {format(chat.lastTimestamp, 'HH:mm')}
            </span>
          )}
        </div>
        <p className="text-wechat-text-secondary text-xs truncate">
          {chat.lastMessage || 'No messages yet'}
        </p>
      </div>
    </div>
  );
}

export function ChatList({ chats, onChatClick }: { chats: Chat[], onChatClick: (id: string) => void }) {
  return (
    <div className="bg-[#fcfcfc]">
      {chats.map((chat) => (
        <ChatItem key={chat.id} chat={chat} onClick={onChatClick} />
      ))}
    </div>
  );
}
