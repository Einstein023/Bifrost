import React from 'react';
import { Attendee } from '../types';
import { sound } from '../utils/audio';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onOpenPass: () => void;
  currentUser: Attendee | null;
  onOpenAuthModal: (mode: 'signin' | 'register') => void;
  onSignOut: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenPass,
  currentUser,
  onOpenAuthModal,
  onSignOut,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity"
      />

      <div className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-[#121214] border-r border-[#2D2D2E] z-50 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-[#2D2D2E] pb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-white tracking-tighter">
                BIFROST
              </h2>
              <span className="font-mono text-[10px] text-[#F6F930] bg-[#F6F930]/10 px-2 py-0.5 rounded border border-[#F6F930]/30 font-bold">
                2024
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#1A1A1B] text-[#C4C7C8] hover:text-white flex items-center justify-center border border-[#2D2D2E]"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Current User Card */}
          {currentUser ? (
            <div className="bg-[#1A1A1B] rounded-2xl p-4 border border-[#2D2D2E] flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-11 h-11 rounded-xl object-cover border border-[#F6F930]/40 flex-shrink-0"
              />
              <div className="truncate flex-1">
                <p className="font-bold text-white text-sm truncate">{currentUser.name}</p>
                <p className="font-mono text-[10px] text-[#F6F930]">{currentUser.passType}</p>
                <p className="font-mono text-[9px] text-[#8E9192] truncate">{currentUser.id}</p>
              </div>
            </div>
          ) : (
            <div className="bg-[#1A1A1B] rounded-2xl p-4 border border-[#2D2D2E] text-center space-y-2">
              <p className="text-xs text-[#C4C7C8]">Not signed in</p>
              <button
                onClick={() => {
                  onClose();
                  onOpenAuthModal('signin');
                }}
                className="w-full py-2 bg-[#F6F930] text-[#0F0F10] rounded-xl font-mono text-xs font-bold uppercase"
              >
                Sign In / Claim Pass
              </button>
            </div>
          )}

          {/* Quick Navigation Links */}
          <nav className="space-y-1.5 font-mono text-xs">
            <button
              onClick={() => {
                sound.playClick();
                onNavigate('landing');
                onClose();
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-[#1A1A1B] text-white flex items-center gap-3 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-[#F6F930]">home</span>
              SUMMIT HOME (LANDING)
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onNavigate('dashboard');
                onClose();
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-[#1A1A1B] text-white flex items-center gap-3 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
              DASHBOARD & PASS
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onNavigate('agenda');
                onClose();
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-[#1A1A1B] text-[#C4C7C8] hover:text-white flex items-center gap-3 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">event_note</span>
              AGENDA TIMELINE
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onNavigate('network');
                onClose();
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-[#1A1A1B] text-[#C4C7C8] hover:text-white flex items-center gap-3 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">group</span>
              PEER NETWORK
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onNavigate('profile');
                onClose();
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-[#1A1A1B] text-[#C4C7C8] hover:text-white flex items-center gap-3 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
              MY PROFILE & PASS
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onNavigate('console');
                onClose();
              }}
              className="w-full text-left p-3 rounded-xl bg-[#F6F930]/10 border border-[#F6F930]/30 text-[#F6F930] hover:bg-[#F6F930] hover:text-[#0F0F10] flex items-center gap-3 transition-colors font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">badge</span>
              STAFF CONSOLE (OP)
            </button>
          </nav>

          {/* Venue Info Box */}
          <div className="bg-[#1A1A1B] rounded-2xl p-4 border border-[#2D2D2E] space-y-3">
            <span className="font-mono text-[10px] text-[#8E9192] uppercase tracking-wider block">
              SUMMIT ESSENTIALS
            </span>

            <div className="space-y-1 text-xs">
              <p className="text-white font-semibold">Wi-Fi: BIFROST_5G</p>
              <p className="text-[#8E9192] font-mono text-[11px]">Pass: BifrostSummit#2024</p>
            </div>

            <div className="space-y-1 text-xs pt-2 border-t border-[#2D2D2E]">
              <p className="text-white font-semibold">Venue Helpdesk</p>
              <p className="text-[#8E9192] font-mono text-[11px]">Main Atrium Desk 01</p>
            </div>
          </div>
        </div>

        {/* Footer info & Account actions */}
        <div className="pt-6 border-t border-[#2D2D2E] space-y-3">
          {currentUser && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenAuthModal('signin');
                }}
                className="flex-1 py-2 bg-[#201F20] hover:bg-[#2A2A2B] text-[#C4C7C8] hover:text-white rounded-xl font-mono text-[11px] uppercase transition-colors"
              >
                Switch User
              </button>
              <button
                onClick={() => {
                  onClose();
                  onSignOut();
                }}
                className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-mono text-[11px] uppercase transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}

          <p className="font-mono text-[10px] text-[#8E9192] uppercase text-center">
            Bifrost Engine v2.4 • Offline Ready
          </p>
        </div>
      </div>
    </>
  );
};
