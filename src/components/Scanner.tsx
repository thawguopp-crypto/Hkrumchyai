import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Camera, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export function Scanner({ onScan, onClose }: ScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // delay initialization slightly to allow animation to complete
    const timeout = setTimeout(() => {
      try {
        scannerRef.current = new Html5QrcodeScanner(
          "reader",
          { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            rememberLastUsedCamera: true,
            supportedScanTypes: [0] // Camera only
          },
          /* verbose= */ false
        );

        scannerRef.current.render(
          (decodedText) => {
            onScan(decodedText);
          },
          (errorMessage) => {
            // ignore common scan errors
          }
        );
      } catch (err) {
        console.error("Scanner error:", err);
        setError("Could not access camera. Please check permissions.");
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error("Error clearing scanner", e));
      }
    };
  }, [onScan]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-[200] flex flex-col"
    >
      <header className="h-14 bg-black/50 text-white flex items-center justify-between px-4 absolute top-0 left-0 right-0 z-10">
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>
        <h2 className="font-medium">Scan QR Code</h2>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-white pt-20">
        {error ? (
          <div className="text-center space-y-4">
            <ShieldAlert className="w-16 h-16 text-yellow-500 mx-auto" />
            <p className="text-sm opacity-80 max-w-[250px] mx-auto">{error}</p>
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="relative w-full aspect-square max-w-[400px]">
             {/* The html5-qrcode library injects into this div */}
            <div id="reader" className="w-full h-full overflow-hidden rounded-2xl border-2 border-white/20"></div>
            
            {/* Scan Overlay UI */}
             <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                <div className="w-[250px] h-[250px] border-2 border-wechat-green rounded-lg relative overflow-hidden">
                   <div className="absolute inset-x-0 h-[2px] bg-wechat-green/50 animate-scan-line shadow-[0_0_15px_#07C160]" />
                </div>
                <p className="mt-10 text-sm font-medium text-white/70">Align QR code within the frame</p>
             </div>
          </div>
        )}
      </div>

      <footer className="h-24 bg-black/50 flex items-center justify-around px-8 pb-4 absolute bottom-0 left-0 right-0">
         <div className="flex flex-col items-center gap-1 opacity-50 cursor-not-allowed">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
               <Camera className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] text-white">Album</span>
         </div>
      </footer>
      
      <style>{`
        @keyframes scan-line {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan-line {
          animation: scan-line 2s linear infinite;
        }
        #reader__dashboard, #reader__status_span, #reader__header_tag {
          display: none !important;
        }
        #reader video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
    </motion.div>
  );
}
