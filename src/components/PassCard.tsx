import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Attendee } from '../types';
import { sound } from '../utils/audio';

interface PassCardProps {
  user: Attendee;
  onOpenPassModal: () => void;
  onOpenScanner: () => void;
}

export const PassCard: React.FC<PassCardProps> = ({
  user,
  onOpenPassModal,
  onOpenScanner,
}) => {
  const [copiedWifi, setCopiedWifi] = useState(false);

  const handleCopyWifi = () => {
    sound.playClick();
    navigator.clipboard.writeText('BifrostSummit#2024');
    setCopiedWifi(true);
    setTimeout(() => setCopiedWifi(false), 2000);
  };

  return (
    <div className="space-y-4 w-full">
      {/* Main High-Contrast Digital Pass (Bento Card matching Image 3 & Image 7) */}
      <div className="bg-[#1A1A1B] rounded-[24px] p-6 md:p-8 relative overflow-hidden border border-[#2D2D2E] hover:border-[#F6F930]/40 transition-all duration-300 shadow-xl group">
        {/* Subtle atmospheric glow */}
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-[#F6F930]/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#F6F930]/15 transition-all"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none"></div>

        <div className="relative z-10">
          {/* Header Row: Attendee ID + VIP ACCESS */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="font-mono text-[11px] text-[#C4C7C8] tracking-widest uppercase block mb-1">
                ATTENDEE ID
              </span>
              <span className="font-mono text-xl md:text-2xl font-bold text-white tracking-wider">
                {user.id}
              </span>
            </div>

            <div className="border border-[#F6F930] bg-[#F6F930]/10 px-3 py-1 rounded-sm text-[#F6F930] font-mono text-xs font-bold tracking-widest uppercase shadow-[0_0_12px_rgba(246,249,48,0.2)]">
              {user.passType}
            </div>
          </div>

          {/* User Info Row */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <span className="font-mono text-[10px] text-[#8E9192] tracking-widest uppercase block mb-1">
                NAME
              </span>
              <p className="text-lg md:text-xl font-bold text-white truncate">
                {user.name}
              </p>
            </div>
            <div>
              <span className="font-mono text-[10px] text-[#8E9192] tracking-widest uppercase block mb-1">
                COMPANY
              </span>
              <p className="text-lg md:text-xl font-bold text-white truncate">
                {user.company}
              </p>
            </div>
          </div>

          {/* QR Code Container with crisp dashed border frame */}
          <div className="flex flex-col items-center justify-center my-6">
            <div 
              onClick={onOpenPassModal}
              className="bg-white p-5 rounded-2xl border-2 border-dashed border-[#8E9192] hover:border-[#F6F930] cursor-pointer transition-transform hover:scale-105 shadow-2xl relative group/qr flex flex-col items-center justify-center"
              title="Click to expand pass"
            >
              <QRCodeSVG
                value={user.qrPayload}
                size={160}
                bgColor="#FFFFFF"
                fgColor="#0F0F10"
                level="Q"
                className="w-36 h-36 md:w-44 md:h-44"
              />
              <div className="absolute inset-0 bg-black/70 rounded-2xl opacity-0 group-hover/qr:opacity-100 flex flex-col items-center justify-center transition-opacity text-white font-mono text-xs gap-1 backdrop-blur-[2px]">
                <span className="material-symbols-outlined text-2xl text-[#F6F930]">fullscreen</span>
                <span>TAP TO EXPAND</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: SHOW PASS & SCAN PEER */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#2D2D2E]/80">
            <button
              onClick={onOpenPassModal}
              className="flex-1 min-w-[140px] bg-white text-[#0F0F10] font-mono text-xs font-bold py-3 px-5 rounded-full hover:bg-[#F6F930] transition-colors uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">qr_code</span>
              SHOW PASS
            </button>

            <button
              onClick={onOpenScanner}
              className="flex-1 min-w-[140px] bg-[#2A2A2B] text-white hover:text-[#F6F930] hover:bg-[#353436] font-mono text-xs font-semibold py-3 px-5 rounded-full border border-[#444748] transition-colors uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
              SWAP CONTACT
            </button>
          </div>
        </div>
      </div>

      {/* Quick Info Bento Row (Venue WiFi & Current Location from Image 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Venue WiFi */}
        <div 
          onClick={handleCopyWifi}
          className="bg-[#1A1A1B] p-5 rounded-2xl border border-[#2D2D2E] hover:border-[#444748] flex justify-between items-center transition-all cursor-pointer group"
        >
          <div>
            <span className="font-mono text-[10px] text-[#8E9192] tracking-widest uppercase block mb-1">
              VENUE WIFI
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white group-hover:text-[#F6F930] transition-colors">
                BIFROST_5G
              </span>
              {copiedWifi && (
                <span className="font-mono text-[10px] text-[#F6F930] bg-[#F6F930]/10 px-2 py-0.5 rounded border border-[#F6F930]/30 animate-pulse">
                  Password Copied!
                </span>
              )}
            </div>
            <span className="font-mono text-[10px] text-[#8E9192] block mt-0.5">
              Pass: BifrostSummit#2024
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#201F20] flex items-center justify-center text-white group-hover:text-[#F6F930] transition-colors">
            <span className="material-symbols-outlined text-xl">wifi</span>
          </div>
        </div>

        {/* Current Location */}
        <div className="bg-[#1A1A1B] p-5 rounded-2xl border border-[#2D2D2E] flex justify-between items-center">
          <div>
            <span className="font-mono text-[10px] text-[#8E9192] tracking-widest uppercase block mb-1">
              CURRENT LOCATION
            </span>
            <p className="font-bold text-white">
              {user.location || 'Main Hall Atrium'}
            </p>
            <span className="font-mono text-[10px] text-[#8E9192] block mt-0.5">
              Floor 1 • Near Keynote Hall
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#201F20] flex items-center justify-center text-[#F6F930]">
            <span className="material-symbols-outlined text-xl">near_me</span>
          </div>
        </div>
      </div>
    </div>
  );
};
