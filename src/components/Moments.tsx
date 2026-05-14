import { Heart, MessageCircle, Camera, ArrowLeft, Share2 } from 'lucide-react';
import { Moment, User } from '@/src/types';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useState } from 'react';
import { CreateMoment } from './CreateMoment';

interface MomentsProps {
  user: User;
  moments: Moment[];
  onLike: (momentId: string) => void;
  onComment: (momentId: string) => void;
  onPostMoment: (moment: Moment) => void;
  onShare: (moment: Moment) => void;
  onBack: () => void;
}

export function Moments({ user, moments, onLike, onComment, onPostMoment, onShare, onBack }: MomentsProps) {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="bg-white absolute inset-0 z-50 flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <header className="h-14 bg-white/80 backdrop-blur-md text-wechat-text-primary flex items-center justify-between px-4 sticky top-0 z-[60] border-b border-wechat-border/30">
        <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="font-semibold">Moments</span>
        <button onClick={() => setShowCreate(true)} className="p-2 hover:bg-black/5 rounded-full transition-colors text-wechat-text-primary">
          <Camera className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-20">
        {/* Cover Header */}
        <div className="relative h-64 w-full mb-12">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000"
            alt="Moments Cover"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-8 right-6 flex items-end gap-3 translate-y-3">
            <span className="text-white font-bold text-lg mb-4 drop-shadow-md">{user.name}</span>
            <img
              src={user.avatar}
              alt="My Profile"
              className="w-20 h-20 rounded-lg border-4 border-white object-cover bg-white shadow-lg"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

      {/* Feed */}
      <div className="flex flex-col">
        {moments.map((moment) => (
          <div key={moment.id} className="flex p-4 gap-3 border-b border-wechat-border/30 last:border-0">
            <img
              src={moment.authorAvatar}
              alt={moment.authorName}
              className="w-12 h-12 rounded-md object-cover bg-wechat-bg"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#576B95] mb-1">{moment.authorName}</h3>
              <p className="text-wechat-text-primary mb-3 leading-relaxed">{moment.content}</p>
              
              {moment.images && moment.images.length > 0 && (
                <div className={cn(
                  "grid gap-1 mb-3 max-w-[280px]",
                  moment.images.length === 1 ? "grid-cols-1" : 
                  moment.images.length <= 4 ? "grid-cols-2" : "grid-cols-3"
                )}>
                  {moment.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Moment"
                      className="w-full aspect-square object-cover rounded-sm"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center text-sm text-wechat-text-secondary mt-2">
                <span>{formatDistanceToNow(moment.timestamp, { addSuffix: true })}</span>
                <div className="flex gap-4">
                  <button onClick={() => onLike(moment.id)} className="flex items-center gap-1 hover:text-wechat-green">
                    <Heart className="w-4 h-4" />
                    <span>{moment.likes.length}</span>
                  </button>
                  <button onClick={() => onComment(moment.id)} className="flex items-center gap-1 hover:text-wechat-green">
                    <MessageCircle className="w-4 h-4" />
                    <span>{moment.comments.length}</span>
                  </button>
                  <button onClick={() => onShare(moment)} className="flex items-center gap-1 hover:text-wechat-green">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Like/Comment Box */}
              {(moment.likes.length > 0 || moment.comments.length > 0) && (
                <div className="mt-3 bg-wechat-bg/50 rounded-sm p-2 text-sm">
                  {moment.likes.length > 0 && (
                    <div className="flex items-center gap-2 text-[#576B95] px-1 py-1 border-b border-black/5 last:border-0">
                      <Heart className="w-3 h-3 fill-current" />
                      <span className="font-medium">{moment.likes.length} people liked this</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-1 mt-1">
                    {moment.comments.map(comment => (
                      <div key={comment.id} className="px-1 py-0.5">
                        <span className="font-bold text-[#576B95]">{comment.userName}: </span>
                        <span className="text-wechat-text-primary">{comment.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>

    <AnimatePresence>
        {showCreate && (
          <CreateMoment 
            user={user}
            onPost={(m) => {
              onPostMoment(m);
              setShowCreate(false);
            }}
            onClose={() => setShowCreate(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
