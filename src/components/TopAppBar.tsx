import React from 'react';

interface TopAppBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenPassModal: () => void;
  onToggleConsole: () => void;
  isConsoleMode: boolean;
  onOpenMenuDrawer: () => void;
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
}) => {
  return (
    <>
      {/* Desktop TopAppBar */}
      <header className="hidden md:flex w-full top-0 sticky bg-[#0F0F10]/90 backdrop-blur-xl justify-between items-center px-8 lg:px-16 py-4 z-40 border-b border-[#2D2D2E]">
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenMenuDrawer}
            className="text-white hover:bg-[#201F20] p-2 rounded-full transition-colors active:scale-95"
            title="Menu & Event Info"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <div 
            onClick={() => setActiveTab('dashboard')}
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
        <nav className="flex gap-2 items-center bg-[#1A1A1B] p-1.5 rounded-full border border-[#2D2D2E]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`font-mono text-xs px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
              activeTab === 'dashboard'
                ? 'bg-white text-[#0F0F10] font-semibold shadow-sm'
                : 'text-[#C4C7C8] hover:text-white hover:bg-[#2A2A2B]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
            DASHBOARD
          </button>

          <button
            onClick={() => setActiveTab('agenda')}
            className={`font-mono text-xs px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
              activeTab === 'agenda'
                ? 'bg-white text-[#0F0F10] font-semibold shadow-sm'
                : 'text-[#C4C7C8] hover:text-white hover:bg-[#2A2A2B]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">event_note</span>
            AGENDA
          </button>

          <button
            onClick={() => setActiveTab('network')}
            className={`font-mono text-xs px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
              activeTab === 'network'
                ? 'bg-white text-[#0F0F10] font-semibold shadow-sm'
                : 'text-[#C4C7C8] hover:text-white hover:bg-[#2A2A2B]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">group</span>
            NETWORK
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`font-mono text-xs px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
              activeTab === 'profile'
                ? 'bg-white text-[#0F0F10] font-semibold shadow-sm'
                : 'text-[#C4C7C8] hover:text-white hover:bg-[#2A2A2B]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">person</span>
            PROFILE
          </button>

          <button
            onClick={() => setActiveTab('console')}
            className={`font-mono text-xs px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
              activeTab === 'console'
                ? 'bg-[#F6F930] text-[#0F0F10] font-bold shadow-[0_0_15px_rgba(246,249,48,0.3)]'
                : 'text-[#C4C7C8] hover:text-white hover:bg-[#2A2A2B]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">badge</span>
            CONSOLE (OP)
          </button>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPassModal}
            className="hidden lg:flex items-center gap-2 font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-[#2D2D2E] hover:border-[#F6F930]/60 hover:text-[#F6F930] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">qr_code</span>
            #BF-8492
          </button>

          <button
            onClick={onOpenNotifications}
            className="relative text-white hover:bg-[#201F20] p-2.5 rounded-full transition-colors active:scale-95 border border-transparent hover:border-[#2D2D2E]"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#D7263D] text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center border-2 border-[#0F0F10] animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile TopAppBar */}
      <header className="md:hidden w-full top-0 sticky bg-[#0F0F10]/95 backdrop-blur-xl flex justify-between items-center px-4 py-3.5 z-40 border-b border-[#2D2D2E]">
        <button
          onClick={onOpenMenuDrawer}
          className="text-white hover:bg-[#201F20] p-2 rounded-full transition-colors active:scale-90"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2"
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

        <div className="flex items-center gap-1">
          {activeTab === 'console' ? (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="font-mono text-[10px] uppercase font-semibold px-2.5 py-1 bg-[#201F20] border border-[#2D2D2E] text-white rounded-full mr-1"
            >
              Exit OP
            </button>
          ) : null}

          <button
            onClick={onOpenNotifications}
            className="relative text-white hover:bg-[#201F20] p-2 rounded-full transition-colors active:scale-90"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#D7263D] text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center border-2 border-[#0F0F10]">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>
    </>
  );
};
