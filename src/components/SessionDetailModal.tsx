import React, { useState } from 'react';
import { Session } from '../types';
import { sound } from '../utils/audio';
import { exportSessionICS } from '../utils/vcard';

interface SessionDetailModalProps {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleBookmark: (sessionId: string) => void;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  session,
  isOpen,
  onClose,
  onToggleBookmark,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !session) return null;

  const capacityPercent = Math.round((session.enrolledCount / session.capacity) * 100);
  const isNearCapacity = capacityPercent >= 90;

  const handleShare = () => {
    sound.playClick();
    navigator.clipboard.writeText(`https://bifrostsummit.org/agenda/${session.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative max-w-lg w-full bg-[#1A1A1B] border border-[#2D2D2E] rounded-[32px] p-6 md:p-8 space-y-6 shadow-2xl my-auto">
        {/* Top Header */}
        <div className="flex justify-between items-start">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-[#F6F930] bg-[#F6F930]/10 border border-[#F6F930]/30 px-3 py-1 rounded-full uppercase font-bold">
              {session.room}
            </span>
            <span className="font-mono text-xs text-[#C4C7C8] bg-[#201F20] px-2.5 py-1 rounded-full border border-[#2D2D2E]">
              {session.day} • {session.timeDisplay}
            </span>
            {session.isLive && (
              <span className="bg-[#D7263D] text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                LIVE NOW
              </span>
            )}
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

        {/* Title & Category */}
        <div className="space-y-2">
          <span className="font-mono text-xs text-[#8E9192] uppercase tracking-wider block">
            {session.sessionType} • TRACK: {session.track}
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
            {session.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm md:text-base text-[#C4C7C8] leading-relaxed">
          {session.description}
        </p>

        {/* Speaker Card */}
        <div className="bg-[#141415] rounded-2xl p-4 border border-[#2D2D2E] flex items-start gap-4">
          <img
            src={session.speaker.avatar}
            alt={session.speaker.name}
            className="w-14 h-14 rounded-2xl object-cover border border-[#2D2D2E] flex-shrink-0"
          />
          <div className="space-y-1">
            <h4 className="font-bold text-white text-base">
              {session.speaker.name}
            </h4>
            <p className="font-mono text-xs text-[#F6F930] uppercase">
              {session.speaker.role} • {session.speaker.company}
            </p>
            {session.speaker.bio && (
              <p className="text-xs text-[#8E9192] leading-relaxed pt-1">
                {session.speaker.bio}
              </p>
            )}
          </div>
        </div>

        {/* Capacity Occupancy Bar */}
        <div className="space-y-2 bg-[#201F20]/50 p-3.5 rounded-xl border border-[#2D2D2E]">
          <div className="flex justify-between items-center font-mono text-xs">
            <span className="text-[#8E9192] uppercase">Live Room Capacity</span>
            <span className={isNearCapacity ? 'text-[#D7263D] font-bold' : 'text-white'}>
              {session.enrolledCount} / {session.capacity} seats ({capacityPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-[#0F0F10] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                isNearCapacity ? 'bg-[#D7263D]' : 'bg-white'
              }`}
              style={{ width: `${Math.min(capacityPercent, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#2D2D2E]">
          <button
            onClick={() => {
              sound.playClick();
              onToggleBookmark(session.id);
            }}
            className={`py-3 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              session.isBookmarked
                ? 'bg-[#F6F930] text-[#0F0F10] shadow-[0_0_12px_rgba(246,249,48,0.3)]'
                : 'bg-white text-[#0F0F10] hover:bg-[#F6F930]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {session.isBookmarked ? 'bookmark' : 'bookmark_border'}
            </span>
            {session.isBookmarked ? 'Bookmarked' : 'Add to Agenda'}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              exportSessionICS(session);
            }}
            className="py-3 px-4 bg-[#201F20] hover:bg-[#2A2A2B] text-white border border-[#2D2D2E] rounded-xl font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
            Save .ICS
          </button>

          <button
            onClick={handleShare}
            className="py-3 px-4 bg-[#201F20] hover:bg-[#2A2A2B] text-white border border-[#2D2D2E] rounded-xl font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
            {copiedLink ? 'Link Copied!' : 'Share'}
          </button>
        </div>
      </div>
    </div>
  );
};
