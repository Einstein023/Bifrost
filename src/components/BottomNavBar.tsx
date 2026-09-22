import React from 'react';
import { sound } from '../utils/audio';

interface BottomNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const handleNav = (tab: string) => {
    sound.playClick();
    setActiveTab(tab);
  };

  return (
    <nav className="md:hidden fixed bottom-0 w-full flex justify-around items-center bg-[#0F0F10]/95 backdrop-blur-xl py-1.5 px-1 border-t border-[#2D2D2E] z-40 pb-safe">
      <button
        onClick={() => handleNav('landing')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[56px] transition-all active:scale-95 ${
          activeTab === 'landing'
            ? 'bg-white text-[#0F0F10] shadow-md font-semibold'
            : 'text-[#C4C7C8] hover:bg-[#1A1A1B]'
        }`}
      >
        <span className="material-symbols-outlined text-[20px] mb-0.5">
          home
        </span>
        <span className="font-mono text-[8px] tracking-wider uppercase">HOME</span>
      </button>

      <button
        onClick={() => handleNav('dashboard')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[56px] transition-all active:scale-95 ${
          activeTab === 'dashboard'
            ? 'bg-white text-[#0F0F10] shadow-md font-semibold'
            : 'text-[#C4C7C8] hover:bg-[#1A1A1B]'
        }`}
      >
        <span className="material-symbols-outlined text-[20px] mb-0.5">
          qr_code_2
        </span>
        <span className="font-mono text-[8px] tracking-wider uppercase">PASS</span>
      </button>

      <button
        onClick={() => handleNav('agenda')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[56px] transition-all active:scale-95 ${
          activeTab === 'agenda'
            ? 'bg-white text-[#0F0F10] shadow-md font-semibold'
            : 'text-[#C4C7C8] hover:bg-[#1A1A1B]'
        }`}
      >
        <span className="material-symbols-outlined text-[20px] mb-0.5">
          event_note
        </span>
        <span className="font-mono text-[8px] tracking-wider uppercase">AGENDA</span>
      </button>

      <button
        onClick={() => handleNav('network')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[56px] transition-all active:scale-95 ${
          activeTab === 'network'
            ? 'bg-white text-[#0F0F10] shadow-md font-semibold'
            : 'text-[#C4C7C8] hover:bg-[#1A1A1B]'
        }`}
      >
        <span className="material-symbols-outlined text-[20px] mb-0.5">
          group
        </span>
        <span className="font-mono text-[8px] tracking-wider uppercase">FRIENDS</span>
      </button>

      <button
        onClick={() => handleNav('profile')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[56px] transition-all active:scale-95 ${
          activeTab === 'profile'
            ? 'bg-white text-[#0F0F10] shadow-md font-semibold'
            : 'text-[#C4C7C8] hover:bg-[#1A1A1B]'
        }`}
      >
        <span className="material-symbols-outlined text-[20px] mb-0.5">
          person
        </span>
        <span className="font-mono text-[8px] tracking-wider uppercase">PROFILE</span>
      </button>

      <button
        onClick={() => handleNav('console')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[56px] transition-all active:scale-95 ${
          activeTab === 'console'
            ? 'bg-[#F6F930] text-[#0F0F10] shadow-[0_0_12px_rgba(246,249,48,0.4)] font-bold'
            : 'text-[#C4C7C8] hover:bg-[#1A1A1B]'
        }`}
      >
        <span className="material-symbols-outlined text-[20px] mb-0.5">
          badge
        </span>
        <span className="font-mono text-[8px] tracking-wider uppercase">OP</span>
      </button>
    </nav>
  );
};
