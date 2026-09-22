import React, { useState, useEffect } from 'react';
import { Attendee } from '../types';
import { sound } from '../utils/audio';

export interface FriendAlertData {
  id: string;
  type: 'same_room' | 'venue_arrival' | 'wave_received' | 'request_received';
  friend: Attendee;
  roomName: string;
  customMessage?: string;
}

interface FriendProximityToastProps {
  alert: FriendAlertData | null;
  onDismiss: () => void;
  onOpenNetwork: () => void;
  onOpenPeerProfile: (peer: Attendee) => void;
}

export const FriendProximityToast: React.FC<FriendProximityToastProps> = ({
  alert,
  onDismiss,
  onOpenNetwork,
  onOpenPeerProfile,
}) => {
  const [waved, setWaved] = useState(false);

  useEffect(() => {
    setWaved(false);
  }, [alert?.id]);

  if (!alert) return null;

  const { friend, type, roomName, customMessage } = alert;

  const handleWave = () => {
    sound.playWave();
    setWaved(true);
    setTimeout(() => {
      setWaved(false);
    }, 4000);
  };

  const isSameRoom = type === 'same_room';

  return (
    <div className="fixed top-16 md:top-20 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-lg animate-in slide-in-from-top-6 fade-in duration-300">
      <div
        className={`p-4 md:p-5 rounded-2xl md:rounded-3xl border shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl ${
          isSameRoom
            ? 'bg-[#18181A]/95 border-[#F6F930] shadow-[0_0_30px_rgba(246,249,48,0.25)]'
            : 'bg-[#18181A]/95 border-[#2D2D2E]'
        }`}
      >
        <div className="flex items-start justify-between gap-3.5">
          {/* Avatar with live pulse badge */}
          <div className="relative flex-shrink-0">
            <img
              src={friend.avatar}
              alt={friend.name}
              className="w-12 h-12 rounded-xl object-cover border border-[#444748]"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#18181A] flex items-center justify-center ${
                isSameRoom ? 'bg-[#F6F930]' : 'bg-[#4ade80]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#0F0F10] animate-ping"></span>
            </span>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  isSameRoom
                    ? 'bg-[#F6F930] text-[#0F0F10]'
                    : 'bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/40'
                }`}
              >
                <span className="material-symbols-outlined text-[12px]">
                  {isSameRoom ? 'bolt' : 'sensors'}
                </span>
                {isSameRoom ? 'FRIEND IN SAME ROOM' : 'FRIEND CHECKED IN'}
              </span>

              <span className="font-mono text-[10px] text-[#8E9192]">JUST NOW</span>
            </div>

            <h4 className="text-sm md:text-base font-bold text-white truncate">
              {friend.name}{' '}
              <span className="text-xs font-normal text-[#C4C7C8]">
                ({friend.company})
              </span>
            </h4>

            <p className="text-xs text-[#C4C7C8] mt-0.5 leading-snug">
              {customMessage || (
                isSameRoom ? (
                  <>
                    Spotted at <strong className="text-white font-semibold">{roomName}</strong>! You are both attending this session right now.
                  </>
                ) : (
                  <>
                    Just arrived at the summit venue (<strong className="text-white font-semibold">{roomName}</strong>).
                  </>
                )
              )}
            </p>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {waved ? (
                <span className="font-mono text-xs text-[#F6F930] bg-[#F6F930]/10 border border-[#F6F930]/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-pulse">
                  <span className="material-symbols-outlined text-[16px]">waving_hand</span>
                  Waved to {friend.name.split(' ')[0]}!
                </span>
              ) : (
                <button
                  onClick={handleWave}
                  className="bg-[#F6F930] hover:bg-white text-[#0F0F10] font-mono text-[11px] font-bold px-3.5 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">waving_hand</span>
                  Wave 👋
                </button>
              )}

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenPeerProfile(friend);
                  onDismiss();
                }}
                className="bg-[#201F20] hover:bg-[#2A2A2B] text-white border border-[#444748] font-mono text-[11px] px-3 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">person</span>
                Profile
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenNetwork();
                  onDismiss();
                }}
                className="text-[#C4C7C8] hover:text-[#F6F930] font-mono text-[11px] px-2 py-1.5 uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
              >
                View Friends Radar →
              </button>
            </div>
          </div>

          {/* Dismiss button */}
          <button
            onClick={() => {
              sound.playClick();
              onDismiss();
            }}
            className="p-1 rounded-full text-[#8E9192] hover:text-white hover:bg-[#201F20] transition-colors"
            aria-label="Dismiss toast"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
