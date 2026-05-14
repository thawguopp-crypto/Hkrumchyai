import { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Video, VideoOff, PhoneOff, Phone, AlertCircle } from 'lucide-react';
import Peer from 'simple-peer';
import socket from '@/src/lib/socket';
import { User } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface CallScreenProps {
  chatId: string;
  currentUser: User;
  otherUser: { name: string, avatar: string };
  type: 'voice' | 'video';
  isIncoming?: boolean;
  offer?: any;
  onClose: () => void;
}

export function CallScreen({ chatId, currentUser, otherUser, type, isIncoming, offer, onClose }: CallScreenProps) {
  const [isCalling, setIsCalling] = useState(!isIncoming);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(type === 'voice');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer.Instance | null>(null);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("MediaDevices not supported");
      setError("Camera and microphone access are not supported in this browser or context.");
      return;
    }

    // Get user media
    navigator.mediaDevices.getUserMedia({
      video: type === 'video',
      audio: true
    }).then(s => {
      setStream(s);
      if (myVideoRef.current) myVideoRef.current.srcObject = s;
      
      if (!isIncoming) {
        initiateCall(s);
      } else {
        // If it's an incoming video call, we might want to see the local preview before answering
        // but for now let's just wait for answerCall to be triggered
      }
    }).catch(err => {
      console.error("Media Error:", err);
      setError("Could not access camera/microphone. Please ensure you have given permission.");
    });

    // Handle incoming signals
    socket.on('call-answered', (data: { answer: any }) => {
      peerRef.current?.signal(data.answer);
    });

    socket.on('receive-ice-candidate', (data: { candidate: any }) => {
      peerRef.current?.signal(data.candidate);
    });

    socket.on('call-ended', () => {
      handleEndCall();
    });

    return () => {
      socket.off('call-answered');
      socket.off('receive-ice-candidate');
      socket.off('call-ended');
      stream?.getTracks().forEach(track => track.stop());
      peerRef.current?.destroy();
    };
  }, [chatId]);

  const initiateCall = (currentStream: MediaStream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: currentStream,
    });

    peer.on('signal', data => {
      socket.emit('call-user', { chatId, offer: data, from: currentUser.id, callType: type });
    });

    peer.on('stream', s => {
      setRemoteStream(s);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = s;
      setIsAccepted(true);
      setIsCalling(false);
    });

    peer.on('error', err => {
      console.error('Peer Error:', err);
      setError("Call connection failed.");
    });

    peerRef.current = peer;
  };

  const answerCall = () => {
    if (!stream) {
      setError("Cannot answer call without media access.");
      return;
    }
    
    setIsAccepted(true);
    setIsCalling(false);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', data => {
      socket.emit('answer-call', { chatId, answer: data, from: currentUser.id });
    });

    peer.on('stream', s => {
      setRemoteStream(s);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = s;
    });

    peer.on('error', err => {
      console.error('Peer Error:', err);
      setError("Failed to establish connection.");
    });

    peer.signal(offer);
    peerRef.current = peer;
  };

  const handleEndCall = () => {
    stream?.getTracks().forEach(track => track.stop());
    peerRef.current?.destroy();
    socket.emit('end-call', chatId);
    onClose();
  };

  const toggleMute = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleCamera = () => {
    if (stream && type === 'video') {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOff(!videoTrack.enabled);
      }
    }
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="fixed inset-0 bg-zinc-900 z-[200] flex flex-col text-white overflow-hidden"
    >
      {/* Remote Content (Fullscreen) */}
      <div className="absolute inset-0 bg-black flex items-center justify-center">
        {error ? (
          <div className="text-center p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 max-w-sm z-50">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-sm">{error}</p>
            <button 
              onClick={onClose}
              className="mt-6 px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (remoteStream && type === 'video') ? (
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="flex flex-col items-center gap-6">
            <motion.div
              animate={isIncoming && !isAccepted ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              className="relative"
            >
              <img 
                src={otherUser.avatar} 
                alt={otherUser.name} 
                className="w-32 h-32 rounded-full border-4 border-white/20 shadow-2xl relative z-10" 
              />
              <div className="absolute inset-0 bg-wechat-green/20 rounded-full blur-2xl animate-pulse" />
            </motion.div>
            <div className="text-center">
              <h2 className="text-2xl font-bold">{otherUser.name}</h2>
              <p className="text-white/60 mt-2 flex items-center justify-center gap-2">
                {isCalling ? 'Calling...' : isIncoming && !isAccepted ? (type === 'video' ? 'Invitation to Video Call' : 'Incoming Video Call...') : isAccepted && !remoteStream ? 'Connecting...' : (type === 'voice' ? 'Voice Call' : 'Video Call')}
                {isAccepted && remoteStream && <span className="w-2 h-2 rounded-full bg-wechat-green animate-pulse" />}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* My Video (Picture-in-Picture) */}
      {type === 'video' && stream && (
        <motion.div 
          drag
          dragMomentum={false}
          className="absolute top-10 right-6 w-32 h-44 bg-zinc-800 rounded-xl overflow-hidden shadow-2xl border border-white/10 z-20"
        >
          {isCameraOff ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 gap-2">
               <VideoOff className="w-6 h-6 text-white/40" />
               <span className="text-[10px] text-white/40">Camera Off</span>
            </div>
          ) : (
            <video 
              ref={myVideoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover scale-x-[-1]" 
            />
          )}
        </motion.div>
      )}

      {/* Controls Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-10 flex flex-col items-center gap-8 bg-gradient-to-t from-black/90 to-transparent z-30">
        <div className="flex items-center gap-6">
          {isIncoming && !isAccepted ? (
            <div className="flex gap-16">
              <button 
                onClick={handleEndCall}
                className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-transform active:scale-90 shadow-lg"
              >
                <PhoneOff className="w-8 h-8" />
              </button>
              <button 
                onClick={answerCall}
                className="w-16 h-16 bg-wechat-green rounded-full flex items-center justify-center hover:bg-wechat-green-dark transition-transform active:scale-90 shadow-lg animate-[pulse_2s_infinite]"
              >
                <Phone className="w-8 h-8" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6 bg-black/40 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-2xl">
               <button 
                onClick={toggleMute}
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90",
                  isMuted ? "bg-red-500 text-white" : "bg-white/10 hover:bg-white/20 text-white"
                )}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              
              {type === 'video' && (
                <button 
                  onClick={toggleCamera}
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90",
                    isCameraOff ? "bg-red-500 text-white" : "bg-white/10 hover:bg-white/20 text-white"
                  )}
                >
                  {isCameraOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </button>
              )}

              <button 
                onClick={handleEndCall}
                className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-all active:scale-90 text-white shadow-lg"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
