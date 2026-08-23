import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Attendee } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface PassModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Attendee;
}

export const PassModal: React.FC<PassModalProps> = ({ isOpen, onClose, user }) => {
  const [isMaxBrightness, setIsMaxBrightness] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleNfcBeep = () => {
    sound.playGranted();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#F6F930', '#FFFFFF', '#1A1A1B']
    });
  };

  const handleSharePass = () => {
    sound.playClick();
    navigator.clipboard.writeText(`https://bifrostsummit.org/pass/${user.id.replace('#', '')}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative max-w-sm w-full space-y-4 my-auto">
        {/* Controls top bar */}
        <div className="flex justify-between items-center px-2">
          <button
            onClick={() => setIsMaxBrightness(!isMaxBrightness)}
            className={`font-mono text-xs px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1.5 ${
              isMaxBrightness
                ? 'bg-white text-black border-white font-bold'
                : 'bg-[#1A1A1B] text-[#C4C7C8] border-[#2D2D2E] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isMaxBrightness ? 'brightness_high' : 'brightness_medium'}
            </span>
            {isMaxBrightness ? 'MAX BRIGHT' : 'BOOST BRIGHTNESS'}
          </button>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#1A1A1B] border border-[#2D2D2E] text-[#C4C7C8] hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Digital Pass Card */}
        <div
          className={`rounded-[28px] p-7 md:p-8 border shadow-2xl transition-all duration-300 relative overflow-hidden ${
            isMaxBrightness
              ? 'bg-white text-black border-black'
              : 'bg-[#121214] text-white border-[#353436]'
          }`}
        >
          {/* Subtle VIP Aura */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#F6F930]/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Pass Meta */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className={`font-mono text-[10px] tracking-widest uppercase block ${isMaxBrightness ? 'text-gray-600' : 'text-[#8E9192]'}`}>
                ATTENDEE ID
              </span>
              <span className="font-mono text-2xl font-bold tracking-wider">
                {user.id}
              </span>
            </div>

            <div className="border border-[#F6F930] bg-[#F6F930]/20 px-3 py-1 rounded text-[#F6F930] font-mono text-xs font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(246,249,48,0.3)]">
              {user.passType}
            </div>
          </div>

          {/* Name & Company */}
          <div className="space-y-1 mb-6">
            <span className={`font-mono text-[10px] tracking-widest uppercase block ${isMaxBrightness ? 'text-gray-600' : 'text-[#8E9192]'}`}>
              PASS HOLDER
            </span>
            <h3 className="text-2xl font-extrabold tracking-tight truncate">
              {user.name}
            </h3>
            <p className={`text-sm font-medium ${isMaxBrightness ? 'text-gray-700' : 'text-[#C4C7C8]'}`}>
              {user.role} • <span className="font-semibold">{user.company}</span>
            </p>
          </div>

          {/* Centered High Contrast QR Code */}
          <div className="my-6 flex flex-col items-center justify-center">
            <div className="p-5 bg-white rounded-2xl border-2 border-dashed border-gray-400 shadow-inner flex items-center justify-center">
              <QRCodeSVG
                value={user.qrPayload}
                size={210}
                bgColor="#FFFFFF"
                fgColor="#0F0F10"
                level="H"
                includeMargin={false}
                className="w-48 h-48 md:w-52 md:h-52"
              />
            </div>
            <span className={`font-mono text-[10px] mt-3 uppercase tracking-widest ${isMaxBrightness ? 'text-gray-600' : 'text-[#8E9192]'}`}>
              SCAN AT ENTRANCE & PEER SWAP
            </span>
          </div>

          {/* Bottom Security Bar */}
          <div className={`pt-4 border-t flex items-center justify-between font-mono text-[11px] ${isMaxBrightness ? 'border-gray-200 text-gray-700' : 'border-[#2D2D2E] text-[#8E9192]'}`}>
            <span>ACCESS: LEVEL ALPHA</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              ACTIVE
            </span>
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleSharePass}
            className="py-3 bg-[#1A1A1B] hover:bg-[#201F20] text-white border border-[#2D2D2E] rounded-2xl font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">share</span>
            {copiedLink ? 'Link Copied!' : 'Share Pass'}
          </button>

          <button
            onClick={handleNfcBeep}
            className="py-3 bg-[#F6F930] hover:bg-white text-[#0F0F10] rounded-2xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(246,249,48,0.2)]"
          >
            <span className="material-symbols-outlined text-[16px]">contactless</span>
            Tap NFC Sim
          </button>
        </div>
      </div>
    </div>
  );
};
