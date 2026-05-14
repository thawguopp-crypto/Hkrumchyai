export type TabType = 'chats' | 'contacts' | 'discover' | 'me';

export interface User {
  id: string;
  name: string;
  avatar: string;
  hkrumchyId?: string;
  bio?: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: number;
  type: 'text' | 'image' | 'voice' | 'moment_share';
  sharedMoment?: Moment;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  isGroup: boolean;
  lastMessage?: string;
  lastTimestamp?: number;
  unreadCount?: number;
}

export interface Moment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  images?: string[];
  timestamp: number;
  likes: string[]; // user IDs
  comments: {
    id: string;
    userId: string;
    userName: string;
    text: string;
  }[];
}
