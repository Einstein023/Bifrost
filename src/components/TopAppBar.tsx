import React, { useState } from 'react';
import { Attendee } from '../types';
import { sound } from '../utils/audio';

interface TopAppBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenPassModal: () => void;
  onToggleConsole: () => void;
  isConsoleMode: boolean;
  onOpenMenuDrawer: () => void;
  currentUser: Attendee | null;
  onOpenAuthModal: (mode: 'signin' | 'register') => void;
  onSignOut: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  activeTab,
  setActiveTab,
  unreadCount,
  onOpenNotifications,
  onOpenPassModal,
  onToggleConsole,
  isConsoleMode,
  onOpenMenuDrawer,
  currentUser,
  onOpenAuthModal,
  onSignOut,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <>
      {/* Desktop TopAppBar */}
      <header className="hidden md:flex w-full top-0 sticky bg-[#0F0F10]/90 backdrop-blur-xl justify-between items-center px-8 lg:px-12 py-3.5 z-40 border-b border-[#2D2D2E]">
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenMenuDrawer}
            className="text-white hover:bg-[#201F20] p-2 rounded-full transition-colors active:scale-95 cursor-pointer"
            title="Menu & Event Info"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>

          <div
            onClick={() => {
              sound.playClick();
              setActiveTab('landing');
            }}
            className="cursor-pointer flex items-center gap-3 group"
          >
            <h1 className="font-extrabold text-2xl tracking-tighter text-white group-hover:text-[#F6F930] transition-colors">
              BIFROST
            </h1>
            <span className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded bg-[#201F20] border border-[#2D2D2E] text-[#C4C7C8]">
              SUMMIT '24
            </span>
          </div>
        </div>

        {/* Center Nav */}
        <nav className="flex gap-1.5 items-center bg-[#1A1A1B] p-1.5 rounded-full border border-[#2D2D2E]">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('landing');
            }}
            className={`font-mono text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'landing'
                ? 'bg-white text-[#0F0F10] font-semibold shadow-sm'
                : 'text-[#C4C7C8] hover:text-white hover:bg-[#2A2A2B]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            HOME
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('dashboard');
            }}
            className={`font-mono text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-white text-[#0F0F10] font-semibold shadow-sm'
                : 'text-[#C4C7C8] hover:text-white hover:bg-[#2A2A2B]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
            DASHBOARD
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('agenda');
            }}
            className={`font-mono text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'agenda'
                ? 'bg-white text-[#0F0F10] font-semibold shadow-sm'
                : 'text-[#C4C7C8] hover:text-white hover:bg-[#2A2A2B]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">event_note</span>
            AGENDA
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('network');
            }}
            className={`font-mono text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer relative ${
              activeTab === 'network'
                ? 'bg-white text-[#0F0F10] font-semibold shadow-sm'
                : 'text-[#C4C7C8] hover:text-white hover:bg-[#2A2A2B]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">group</span>
            FRIENDS
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse"></span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('profile');
            }}
            className={`font-mono text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-[#0F0F10] font-semibold shadow-sm'
                : 'text-[#C4C7C8] hover:text-white hover:bg-[#2A2A2B]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">person</span>
            PROFILE
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('console');
            }}
            className={`font-mono text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'console'
                ? 'bg-[#F6F930] text-[#0F0F10] font-bold shadow-[0_0_15px_rgba(246,249,48,0.3)]'
                : 'text-[#C4C7C8] hover:text-white hover:bg-[#2A2A2B]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">badge</span>
            CONSOLE (OP)
          </button>
        </nav>

        {/* Right side user & auth actions */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full bg-[#1A1A1B] border border-[#2D2D2E] hover:border-[#F6F930]/60 transition-all cursor-pointer"
              >
                <div className="text-right hidden lg:block">
                  <p className="text-xs font-bold text-white truncate max-w-[120px]">
                    {currentUser.name}
                  </p>
                  <p className="font-mono text-[9px] text-[#F6F930]">
                    {currentUser.passType}
                  </p>
                </div>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-[#F6F930]/40"
                />
              </button>

              {/* User Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 top-12 w-64 bg-[#141415] border border-[#2D2D2E] rounded-2xl p-2.5 shadow-2xl space-y-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 font-mono text-xs">
                  <div className="p-2 border-b border-[#2D2D2E]">
                    <p className="font-bold text-white text-sm">{currentUser.name}</p>
                    <p className="text-[10px] text-[#8E9192] truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded bg-[#201F20] text-[#F6F930] font-bold">
                      {currentUser.id} • {currentUser.passType}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenPassModal();
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-[#201F20] text-white flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#F6F930]">qr_code</span>
                    Show My Pass
                  </button>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      setActiveTab('profile');
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-[#201F20] text-white flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    Edit Profile
                  </button>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenAuthModal('signin');
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-[#201F20] text-[#C4C7C8] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">switch_account</span>
                    Switch Persona / Account
                  </button>

                  <div className="pt-1 border-t border-[#2D2D2E]">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onSignOut();
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-red-500/10 text-red-400 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenAuthModal('signin');
                }}
                className="font-mono text-xs text-[#C4C7C8] hover:text-white px-3 py-1.5"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenAuthModal('register');
                }}
                className="bg-[#F6F930] text-[#0F0F10] font-mono text-xs font-bold px-4 py-2 rounded-full uppercase hover:bg-white transition-all shadow-md"
              >
                Claim Pass
              </button>
            </div>
          )}

          {/* Pass modal trigger badge */}
          {currentUser && (
            <button
              onClick={onOpenPassModal}
              className="hidden xl:flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border border-[#2D2D2E] hover:border-[#F6F930]/60 hover:text-[#F6F930] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">qr_code</span>
              {currentUser.id}
            </button>
          )}

          {/* Notification bell */}
          <button
            onClick={onOpenNotifications}
            className="relative text-white hover:bg-[#201F20] p-2 rounded-full transition-colors active:scale-95 border border-transparent hover:border-[#2D2D2E] cursor-pointer"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#D7263D] text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center border-2 border-[#0F0F10] animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile TopAppBar */}
      <header className="md:hidden w-full top-0 sticky bg-[#0F0F10]/95 backdrop-blur-xl flex justify-between items-center px-4 py-3 z-40 border-b border-[#2D2D2E]">
        <button
          onClick={onOpenMenuDrawer}
          className="text-white hover:bg-[#201F20] p-1.5 rounded-full transition-colors active:scale-90"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div
          onClick={() => {
            sound.playClick();
            setActiveTab('landing');
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <h1 className="font-extrabold text-xl uppercase tracking-tight text-white">
            {activeTab === 'console' ? (
              <span className="flex items-center gap-2">
                CONSOLE <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-[#201F20] text-[#F6F930] rounded border border-[#F6F930]/30">OP</span>
              </span>
            ) : (
              'BIFROST'
            )}
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          {currentUser ? (
            <button
              onClick={onOpenPassModal}
              className="w-8 h-8 rounded-full overflow-hidden border border-[#F6F930]/50"
            >
              <img src={currentUser.avatar} alt="Me" className="w-full h-full object-cover" />
            </button>
          ) : (
            <button
              onClick={() => onOpenAuthModal('signin')}
              className="font-mono text-[10px] uppercase font-bold px-3 py-1 bg-[#F6F930] text-[#0F0F10] rounded-full"
            >
              Sign In
            </button>
          )}

          <button
            onClick={onOpenNotifications}
            className="relative text-white hover:bg-[#201F20] p-1.5 rounded-full transition-colors active:scale-90"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#D7263D] text-white text-[8px] font-mono font-bold rounded-full flex items-center justify-center border border-[#0F0F10]">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>
    </>
  );
};
