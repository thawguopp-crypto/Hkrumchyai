/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { ChatList } from './components/ChatList';
import { Moments } from './components/Moments';
import { ChatRoom } from './components/ChatRoom';
import { ListMenu } from './components/ListMenu';
import { SearchBar } from './components/SearchBar';
import { NavRail } from './components/NavRail';
import { CallScreen } from './components/CallScreen';
import { Scanner } from './components/Scanner';
import { SettingsScreen } from './components/Settings';
import { ProfileScreen } from './components/Profile';
import { GroupSelect } from './components/GroupSelect';
import { Favorites } from './components/Favorites';
import { SearchScreen } from './components/SearchScreen';
import { BackgroundPicker } from './components/BackgroundPicker';
import { ShareModal } from './components/ShareModal';
import { ContactProfileScreen } from './components/ContactProfile';
import { TabType, Chat, Moment, Message, User } from './types';
import { AnimatePresence, motion } from 'motion/react';
import socket from './lib/socket';
import { 
  UserPlus, 
  Users as UsersIcon, 
  Tag, 
  CircleUser, 
  Camera, 
  Scan, 
  Smartphone, 
  ShoppingBag, 
  Gamepad2, 
  AppWindow,
  Wallet,
  Settings,
  Star,
  Image as PhotoIcon,
  QrCode,
  Search
} from 'lucide-react';

const MOCK_USER: User = {
  id: 'me',
  name: 'John Doe',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Me',
  hkrumchyId: 'johndoe123',
};

const MOCK_CHATS: Chat[] = [
  { id: '1', name: 'Alun', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alun', isGroup: false, lastMessage: 'Dinner tonight?', lastTimestamp: Date.now() - 1000 * 60 * 15, unreadCount: 2 },
  { id: '2', name: 'Mom', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mom', isGroup: false, lastMessage: 'Call me when you are free.', lastTimestamp: Date.now() - 1000 * 60 * 60, unreadCount: 0 },
  { id: '3', name: 'Work Group', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Work', isGroup: true, lastMessage: 'Meeting at 10 AM.', lastTimestamp: Date.now() - 1000 * 60 * 60 * 5, unreadCount: 5 },
];

const MOCK_MOMENTS: Moment[] = [
  {
    id: 'm1',
    authorId: '1',
    authorName: 'Alun',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alun',
    content: 'Just finished a great hike at Yellow Mountain! The view was breathtaking. ⛰️',
    images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800'],
    timestamp: Date.now() - 1000 * 60 * 120,
    likes: ['me', '2'],
    comments: [{ id: 'c1', userId: 'me', userName: 'John Doe', text: 'Amazing view!' }],
  },
];

const MOCK_CONTACTS: User[] = [
  { id: '1', name: 'Alun', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alun', hkrumchyId: 'alun_99' },
  { id: '2', name: 'Mom', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mom', hkrumchyId: 'best_mom' },
  { id: '3', name: 'Charlie', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie', hkrumchyId: 'charlie_123' },
  { id: '4', name: 'David', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', hkrumchyId: 'david_dev' },
];

export default function App() {
  const [user, setUser] = useState<User>(MOCK_USER);
  const [activeTab, setActiveTab] = useState<TabType>('chats');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showMoments, setShowMoments] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showGroupSelect, setShowGroupSelect] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedContactProfile, setSelectedContactProfile] = useState<User | null>(null);
  const [sharingMoment, setSharingMoment] = useState<Moment | null>(null);
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [activeCall, setActiveCall] = useState<{
    type: 'voice' | 'video';
    chatId: string;
    isIncoming: boolean;
    offer?: any;
  } | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      { id: 'msg1', text: 'Hey!', senderId: '1', timestamp: Date.now() - 3600000, type: 'text' },
      { id: 'msg2', text: 'How are you?', senderId: '1', timestamp: Date.now() - 3500000, type: 'text' },
      { id: 'msg3', text: 'I am good. You?', senderId: 'me', timestamp: Date.now() - 3400000, type: 'text' },
      { id: 'msg4', text: 'Dinner tonight?', senderId: '1', timestamp: Date.now() - 900000, type: 'text' },
    ]
  });
  const [moments, setMoments] = useState<Moment[]>(MOCK_MOMENTS);
  const [chatBackgrounds, setChatBackgrounds] = useState<Record<string, string>>({
    'default': '#EDEDED'
  });
  const [backgroundPickerTarget, setBackgroundPickerTarget] = useState<string | null>(null);

  useEffect(() => {
    socket.connect();
    
    socket.on('receive-message', (msg: Message) => {
      console.log('Received message:', msg);
      const chatId = msg.senderId === 'me' ? '1' : msg.senderId; 
      setMessages(prev => {
        const chatMessages = prev[chatId] || [];
        if (chatMessages.some(m => m.id === msg.id)) return prev;
        return {
          ...prev,
          [chatId]: [...chatMessages, msg]
        };
      });
    });

    socket.on('incoming-call', (data: { chatId: string, offer: any, from: string, callType: 'voice' | 'video' }) => {
      setActiveCall({
        type: data.callType || 'video', 
        chatId: data.chatId,
        isIncoming: true,
        offer: data.offer
      });
    });

    return () => {
      socket.off('receive-message');
      socket.off('incoming-call');
      socket.disconnect();
    };
  }, []);

  const activeChat = MOCK_CHATS.find(c => c.id === selectedChatId);

  const handleSendMessage = (text: string, type: Message['type'] = 'text') => {
    if (!selectedChatId) return;
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      senderId: 'me',
      timestamp: Date.now(),
      type
    };
    
    // Send to socket
    socket.emit('send-message', { chatId: selectedChatId, message: newMessage });
    
    // Update locally (optimistic)
    setMessages(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMessage]
    }));

    setChats(prev => prev.map(c => 
      c.id === selectedChatId 
        ? { ...c, lastMessage: type === 'voice' ? `[Voice] ${text}` : type === 'moment_share' ? '[Moment Share]' : text, lastTimestamp: newMessage.timestamp } 
        : c
    ));
  };

  const handleShareMoment = (moment: Moment, chatIds: string[]) => {
    chatIds.forEach(chatId => {
      const newMessage: Message = {
        id: `share-${Date.now()}-${Math.random()}`,
        text: `[Shared Moment by ${moment.authorName}]`,
        senderId: 'me',
        timestamp: Date.now(),
        type: 'moment_share',
        sharedMoment: moment
      };

      // In a real app we'd emit this too
      socket.emit('send-message', { chatId, message: newMessage });

      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), newMessage]
      }));

      setChats(prev => prev.map(c => 
        c.id === chatId 
          ? { ...c, lastMessage: '[Moment Share]', lastTimestamp: newMessage.timestamp } 
          : c
      ));
    });
    setSharingMoment(null);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setShowMoments(false);
  };

  const handleScan = (result: string) => {
    setShowScanner(false);
    console.log('Scanned result:', result);
    
    // Find contact by HKRUMCHYAI ID
    const contact = MOCK_CONTACTS.find(c => c.hkrumchyId === result);
    
    if (contact) {
      setSelectedContactProfile(contact);
    } else if (result.startsWith('http')) {
      alert(`Scanned URL: ${result}\nIn a real app, this would open in a browser or mini-program.`);
    } else {
      alert(`Scanned ID: ${result}\nNo contact found with this HKRUMCHYAI ID.`);
    }
  };

  const handleAdd = () => {
    if (showMoments) return;
    setShowGroupSelect(true);
  };

  return (
    <div className="flex h-screen w-full max-w-[1024px] mx-auto bg-[#EDEDED] overflow-hidden md:shadow-2xl md:border-x border-wechat-border/50">
      {/* Desktop Sidebar */}
      <NavRail activeTab={activeTab} onTabChange={handleTabChange} avatar={user.avatar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative bg-wechat-bg overflow-hidden border-l border-wechat-border/50">
        <Header 
          title={showMoments ? 'Moments' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} 
          showSearch={!showMoments && activeTab !== 'me'}
          showAdd={activeTab === 'chats' || activeTab === 'contacts' || showMoments}
          showScan={!showMoments && activeTab !== 'me'}
          onBack={showMoments ? () => setShowMoments(false) : undefined}
          onAdd={handleAdd}
          onScan={() => setShowScanner(true)}
        />
        
        <main className="flex-1 overflow-y-auto mt-14 pb-16 md:pb-0">
          {activeTab === 'chats' && (
            <>
              <SearchBar onClick={() => setShowSearch(true)} />
              <ChatList chats={chats} onChatClick={(id) => setSelectedChatId(id)} />
            </>
          )}
          
          {activeTab === 'contacts' && (
            <div className="flex flex-col">
              <SearchBar onClick={() => setShowSearch(true)} />
              <ListMenu 
                items={[
                  { id: 'new', label: 'New Friends', icon: UserPlus, iconColor: 'bg-orange-500 text-white' },
                  { id: 'group', label: 'Group Chats', icon: UsersIcon, iconColor: 'bg-green-600 text-white' },
                  { id: 'tags', label: 'Tags', icon: Tag, iconColor: 'bg-blue-600 text-white' },
                  { id: 'scan', label: 'Scan', icon: Scan, iconColor: 'bg-blue-500 text-white', onClick: () => setShowScanner(true) },
                ]}
              />
              <div className="px-4 py-2 text-xs text-wechat-text-secondary uppercase">All Contacts</div>
              <div className="bg-white border-y border-wechat-border/50">
                 {MOCK_CONTACTS.map(contact => (
                   <div 
                    key={contact.id} 
                    onClick={() => setSelectedContactProfile(contact)}
                    className="flex items-center p-3 gap-3 active:bg-wechat-bg transition-colors cursor-pointer border-b border-wechat-border/20 last:border-0"
                   >
                      <img src={contact.avatar} className="w-10 h-10 rounded-md" />
                      <span className="font-medium">{contact.name}</span>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {activeTab === 'discover' && !showMoments && (
            <div className="space-y-4 py-4">
              <ListMenu 
                items={[
                  { id: 'moments', label: 'Moments', icon: Camera, iconColor: 'bg-orange-400 text-white', badge: '1', onClick: () => setShowMoments(true) },
                ]}
              />
              <ListMenu 
                items={[
                  { id: 'search', label: 'Search', icon: Search, iconColor: 'bg-red-500 text-white' },
                ]}
              />
            </div>
          )}

          {activeTab === 'discover' && showMoments && (
            <Moments 
              user={user}
              moments={moments} 
              onBack={() => setShowMoments(false)}
              onPostMoment={(m) => setMoments([m, ...moments])}
              onShare={(m) => setSharingMoment(m)}
              onLike={(momentId) => {
                setMoments(prev => prev.map(m => 
                  m.id === momentId 
                    ? { ...m, likes: m.likes.includes('me') ? m.likes.filter(id => id !== 'me') : [...m.likes, 'me'] } 
                    : m
                ));
              }}
              onComment={(momentId) => {
                const text = prompt('Enter your comment:');
                if (!text) return;
                setMoments(prev => prev.map(m => 
                  m.id === momentId 
                    ? { ...m, comments: [...m.comments, { id: Date.now().toString(), userId: 'me', userName: user.name, text }] } 
                    : m
                ));
              }}
            />
          )}

          {activeTab === 'me' && (
            <div className="space-y-4 py-0">
              <div 
                onClick={() => setShowProfile(true)}
                className="bg-white flex items-center p-6 gap-4 border-b border-wechat-border/50 cursor-pointer active:bg-gray-50 transition-colors"
              >
                 <img src={user.avatar} alt="Me" className="w-16 h-16 rounded-xl border-4 border-white shadow-sm" />
                 <div className="flex-1">
                   <h2 className="text-xl font-bold">{user.name}</h2>
                   <p className="text-wechat-text-secondary text-xs mt-0.5">HKRUMCHYAI ID: {user.hkrumchyId}</p>
                   <div className="flex gap-2 mt-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMoments(true);
                          setActiveTab('discover'); // Ensure we are on discover logic for Moments if needed, or just let Moments render
                        }}
                        className="text-[10px] bg-wechat-bg px-2 py-0.5 rounded border border-wechat-border/50 text-wechat-text-secondary font-medium hover:bg-gray-100 transition-colors"
                      >
                        + Status
                      </button>
                   </div>
                 </div>
                 <div className="flex flex-col items-end gap-2 text-wechat-text-secondary">
                   <QrCode className="w-5 h-5" />
                   <span className="text-lg">›</span>
                 </div>
              </div>
              
              <ListMenu 
                items={[
                  { id: 'favs', label: 'Favorites', icon: Star, iconColor: 'bg-orange-500 text-white', onClick: () => setShowFavorites(true) },
                  { id: 'photos', label: 'My Moments', icon: PhotoIcon, iconColor: 'bg-blue-500 text-white', onClick: () => {
                    setActiveTab('discover');
                    setShowMoments(true);
                  }},
                  { id: 'stickers', label: 'Stickers', icon: Smartphone, iconColor: 'bg-orange-400 text-white' },
                ]}
              />

              <ListMenu 
                items={[
                  { id: 'settings', label: 'Settings', icon: Settings, iconColor: 'bg-blue-600 text-white', onClick: () => setShowSettings(true) },
                ]}
              />
            </div>
          )}
        </main>

        <div className="md:hidden">
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        <AnimatePresence>
          {showSettings && (
            <SettingsScreen 
              chatBackground={chatBackgrounds['default'] || '#EDEDED'}
              onUpdateBackground={(bg) => setChatBackgrounds(prev => ({ ...prev, default: bg }))}
              onBack={() => setShowSettings(false)}
            />
          )}
          {showScanner && (
            <Scanner 
              onScan={handleScan}
              onClose={() => setShowScanner(false)}
            />
          )}
          {activeCall && (
            <CallScreen 
              chatId={activeCall.chatId}
              currentUser={user}
              otherUser={MOCK_CHATS.find(c => c.id === activeCall.chatId) || { name: 'Unknown', avatar: '' }}
              type={activeCall.type}
              isIncoming={activeCall.isIncoming}
              offer={activeCall.offer}
              onClose={() => setActiveCall(null)}
            />
          )}
          {selectedChatId && activeChat && (
            <ChatRoom 
              chatId={selectedChatId}
              chatName={activeChat.name}
              messages={messages[selectedChatId] || []}
              currentUser={user}
              background={chatBackgrounds[selectedChatId] || chatBackgrounds['default'] || '#EDEDED'}
              isGroup={activeChat.isGroup}
              onBack={() => setSelectedChatId(null)}
              onSendMessage={handleSendMessage}
              onCallInitiated={(type) => setActiveCall({ type, chatId: selectedChatId, isIncoming: false })}
              onSetBackground={() => setBackgroundPickerTarget(selectedChatId)}
            />
          )}
          {showProfile && (
            <ProfileScreen 
              user={user}
              onUpdate={setUser}
              onBack={() => setShowProfile(false)}
            />
          )}
          {showGroupSelect && (
            <GroupSelect 
              contacts={MOCK_CONTACTS}
              onCancel={() => setShowGroupSelect(false)}
              onCreate={(selectedIds) => {
                const newGroup: Chat = {
                  id: `group-${Date.now()}`,
                  name: `Group (${selectedIds.length + 1})`,
                  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Group${Date.now()}`,
                  isGroup: true,
                  lastMessage: 'You created a group chat',
                  lastTimestamp: Date.now(),
                };
                setChats([newGroup, ...chats]);
                setShowGroupSelect(false);
                setSelectedChatId(newGroup.id);
              }}
            />
          )}
          {showFavorites && (
            <Favorites onBack={() => setShowFavorites(false)} />
          )}
          {showSearch && (
            <SearchScreen 
              chats={chats}
              contacts={MOCK_CONTACTS} 
              moments={moments}
              onBack={() => setShowSearch(false)}
              onChatSelect={(id) => setSelectedChatId(id)}
              onContactSelect={(contact) => setSelectedContactProfile(contact)}
            />
          )}
          {backgroundPickerTarget && (
            <BackgroundPicker 
              title={backgroundPickerTarget === 'default' ? 'Default Background' : 'Chat Background'}
              currentBackground={chatBackgrounds[backgroundPickerTarget] || chatBackgrounds['default'] || '#EDEDED'}
              onUpdate={(bg) => setChatBackgrounds(prev => ({ ...prev, [backgroundPickerTarget]: bg }))}
              onBack={() => setBackgroundPickerTarget(null)}
            />
          )}
          {sharingMoment && (
            <ShareModal 
              moment={sharingMoment}
              chats={chats}
              onShare={(ids) => handleShareMoment(sharingMoment, ids)}
              onClose={() => setSharingMoment(null)}
            />
          )}
          {selectedContactProfile && (
            <ContactProfileScreen 
              contact={selectedContactProfile}
              onBack={() => setSelectedContactProfile(null)}
              onSendMessage={(id) => {
                setSelectedChatId(id);
                setSelectedContactProfile(null);
                setShowSearch(false);
              }}
              onVideoCall={(id) => {
                setActiveCall({ type: 'video', chatId: id, isIncoming: false });
                setSelectedContactProfile(null);
              }}
              onVoiceCall={(id) => {
                setActiveCall({ type: 'voice', chatId: id, isIncoming: false });
                setSelectedContactProfile(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
