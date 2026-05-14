import { useState } from 'react';
import { X, Camera, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { User, Moment } from '../types';

interface CreateMomentProps {
  user: User;
  onPost: (moment: Moment) => void;
  onClose: () => void;
}

export function CreateMoment({ user, onPost, onClose }: CreateMomentProps) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handlePost = () => {
    if (!content && images.length === 0) return;

    const newMoment: Moment = {
      id: `m-${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      content,
      images: images.length > 0 ? images : undefined,
      timestamp: Date.now(),
      likes: [],
      comments: [],
    };

    onPost(newMoment);
    onClose();
  };

  const addImage = () => {
    // Mock adding an image
    const randomImage = `https://picsum.photos/seed/${Math.random()}/800/800`;
    setImages([...images, randomImage]);
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="fixed inset-0 bg-[#EDEDED] z-[210] flex flex-col h-screen"
    >
      <header className="h-14 bg-[#f3f3f3] border-b border-[#e0e0e0] flex items-center justify-between px-4 shrink-0">
        <button onClick={onClose} className="text-wechat-text-primary text-sm font-medium">
          Cancel
        </button>
        <h2 className="font-semibold text-wechat-text-primary">Post Moment</h2>
        <button 
          onClick={handlePost}
          disabled={!content && images.length === 0}
          className="bg-wechat-green text-white px-4 py-1.5 rounded-md text-sm font-medium disabled:opacity-50 transition-opacity"
        >
          Post
        </button>
      </header>

      <div className="flex-1 bg-white p-4">
        <textarea
          autoFocus
          className="w-full h-40 resize-none outline-none text-wechat-text-primary text-base placeholder:text-gray-400"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="grid grid-cols-3 gap-2 mt-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-square">
              <img src={img} alt="Moment" className="w-full h-full object-cover rounded-md" />
              <button 
                onClick={() => setImages(images.filter((_, i) => i !== idx))}
                className="absolute -top-2 -right-2 bg-black/50 text-white rounded-full p-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {images.length < 9 && (
            <button 
              onClick={addImage}
              className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-md flex flex-col items-center justify-center text-gray-400 hover:text-wechat-green hover:border-wechat-green transition-colors"
            >
              <Camera className="w-8 h-8 mb-1" />
              <span className="text-[10px]">Add Photo</span>
            </button>
          )}
        </div>
      </div>

      <footer className="p-4 flex items-center gap-6 text-wechat-text-secondary border-t border-wechat-border/30 bg-white">
        <button className="flex items-center gap-2 text-sm">
          <ImageIcon className="w-5 h-5" />
          Album
        </button>
        <button className="flex items-center gap-2 text-sm">
          <Camera className="w-5 h-5" />
          Camera
        </button>
      </footer>
    </motion.div>
  );
}
