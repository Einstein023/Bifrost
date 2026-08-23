import React, { useState, useEffect, useRef } from 'react';
import { Attendee } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (scannedAttendee: Attendee) => void;
  peerDirectory: Attendee[];
  mode?: 'peer_swap' | 'staff_checkin';
  onStaffScanResult?: (status: 'GRANTED' | 'DENIED', name: string, type: string) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  peerDirectory,
  mode = 'peer_swap',
  onStaffScanResult,
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen && cameraActive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, cameraActive]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      setCameraError('Camera access unavailable. Use simulated high-speed badge scanner below.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  if (!isOpen) return null;

  const handleSimulateScanPeer = (peer: Attendee) => {
    sound.playGranted();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F6F930', '#FFFFFF', '#1A1A1B']
    });

    if (mode === 'staff_checkin' && onStaffScanResult) {
      onStaffScanResult('GRANTED', peer.name, peer.passType);
    }

    onScanSuccess(peer);
  };

  const handleSimulateInvalid = () => {
    sound.playDenied();
    if (mode === 'staff_checkin' && onStaffScanResult) {
      onStaffScanResult('DENIED', 'Invalid Tag #EX-9912', 'INVALID ID');
    }
    alert('⚠️ Invalid or Expired Badge: Access Denied');
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative max-w-md w-full bg-[#121214] border border-[#2D2D2E] rounded-[32px] p-6 md:p-8 space-y-6 shadow-2xl my-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#2D2D2E] pb-4">
          <div>
            <span className="font-mono text-[10px] text-[#F6F930] tracking-widest uppercase block">
              {mode === 'staff_checkin' ? 'OPERATOR SCANNER' : 'CONTACT SWAP SCANNER'}
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {mode === 'staff_checkin' ? 'Validate Attendee Badge' : 'Scan Peer QR Code'}
            </h3>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-[#201F20] text-[#C4C7C8] hover:text-white flex items-center justify-center border border-[#2D2D2E]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Viewfinder Frame */}
        <div className="relative aspect-square w-full max-w-[280px] mx-auto bg-[#0A0A0C] rounded-3xl border-2 border-[#2D2D2E] overflow-hidden flex flex-col items-center justify-center shadow-inner">
          {cameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            /* Futuristic Laser Grid / HUD */
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="w-40 h-40 border-2 border-dashed border-[#F6F930]/60 rounded-2xl relative flex items-center justify-center">
                {/* Laser Sweep Beam */}
                <div className="absolute left-0 right-0 h-1 bg-[#F6F930] shadow-[0_0_15px_#F6F930] scan-laser"></div>
                <span className="material-symbols-outlined text-4xl text-[#8E9192] opacity-40">
                  qr_code_scanner
                </span>
              </div>
              <p className="font-mono text-[10px] text-[#8E9192] uppercase mt-4 tracking-wider">
                Align QR badge inside frame
              </p>
            </div>
          )}

          {/* Corner target reticles */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#F6F930] pointer-events-none"></div>
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#F6F930] pointer-events-none"></div>
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#F6F930] pointer-events-none"></div>
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#F6F930] pointer-events-none"></div>
        </div>

        {/* Camera toggle */}
        <div className="flex justify-center">
          <button
            onClick={() => setCameraActive(!cameraActive)}
            className="font-mono text-xs text-[#C4C7C8] hover:text-white flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-[#1A1A1B] border border-[#2D2D2E]"
          >
            <span className="material-symbols-outlined text-[16px]">
              {cameraActive ? 'videocam_off' : 'videocam'}
            </span>
            {cameraActive ? 'Turn Off Real Camera' : 'Try Real Camera Stream'}
          </button>
        </div>

        {cameraError && (
          <p className="text-xs text-[#8E9192] text-center font-mono">{cameraError}</p>
        )}

        {/* Quick Instant Scan Targets for seamless interaction */}
        <div className="space-y-2 pt-2 border-t border-[#2D2D2E]">
          <span className="font-mono text-[10px] text-[#8E9192] uppercase tracking-wider block text-center">
            Tap to test instant scan:
          </span>

          <div className="grid grid-cols-2 gap-2">
            {peerDirectory.slice(0, 4).map((peer) => (
              <button
                key={peer.id}
                onClick={() => handleSimulateScanPeer(peer)}
                className="p-2.5 bg-[#1A1A1B] hover:bg-[#201F20] border border-[#2D2D2E] hover:border-[#F6F930] rounded-xl text-left transition-all group flex items-center gap-2"
              >
                <img
                  src={peer.avatar}
                  alt={peer.name}
                  className="w-7 h-7 rounded-lg object-cover flex-shrink-0"
                />
                <div className="truncate">
                  <p className="text-xs font-bold text-white group-hover:text-[#F6F930] truncate">
                    {peer.name}
                  </p>
                  <p className="font-mono text-[9px] text-[#8E9192] truncate">
                    {peer.company}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleSimulateInvalid}
            className="w-full py-2 bg-[#201F20] hover:bg-[#2A2A2B] text-[#FFB4AB] border border-[#C61633]/40 rounded-xl font-mono text-[11px] uppercase tracking-wider transition-colors text-center"
          >
            Simulate Invalid / Fake Badge
          </button>
        </div>
      </div>
    </div>
  );
};
