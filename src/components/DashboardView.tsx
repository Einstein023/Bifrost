import React from 'react';
import { Attendee, Session } from '../types';
import { PassCard } from './PassCard';
import { sound } from '../utils/audio';

interface DashboardViewProps {
  user: Attendee;
  sessions: Session[];
  onOpenSession: (session: Session) => void;
  onNavigateToSchedule: () => void;
  onOpenPassModal: () => void;
  onOpenScanner: () => void;
  onToggleBookmark: (sessionId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  sessions,
  onOpenSession,
  onNavigateToSchedule,
  onOpenPassModal,
  onOpenScanner,
  onToggleBookmark,
}) => {
  // Find currently live and next upcoming sessions
  const liveSession = sessions.find((s) => s.isLive) || sessions[0];
  const nextSession = sessions.find((s) => s.id !== liveSession?.id && s.day === 'Day 1') || sessions[1];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-12">
      {/* Header section matching Image 3 & Image 7 */}
      <section className="space-y-3">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Welcome back,{' '}
          <span className="text-[#F6F930] inline-block">{user.name.split(' ')[0]}.</span>
        </h2>
        <p className="text-base md:text-lg text-[#C4C7C8] max-w-2xl font-normal leading-relaxed">
          Your digital pass and upcoming agenda for Day 1. Access your credentials and swap peer contacts seamlessly.
        </p>
      </section>

      {/* Main Grid: Digital Pass (Left) & Next Up Schedule (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Digital Pass + Bento Info Cards */}
        <div className="lg:col-span-6 w-full">
          <PassCard
            user={user}
            onOpenPassModal={onOpenPassModal}
            onOpenScanner={onOpenScanner}
          />
        </div>

        {/* Right Column: Next Up Section matching Image 3 */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex justify-between items-center pb-2">
            <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Next Up
              {liveSession?.isLive && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D7263D] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D7263D]"></span>
                </span>
              )}
            </h3>
            <button
              onClick={onNavigateToSchedule}
              className="font-mono text-xs text-[#C4C7C8] hover:text-[#F6F930] flex items-center gap-1 uppercase tracking-wider transition-colors group"
            >
              VIEW FULL SCHEDULE
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>

          {/* Featured Live Session Card (Exact styling from Image 3) */}
          {liveSession && (
            <div className="bg-[#1A1A1B] rounded-[24px] p-6 md:p-8 border border-[#2D2D2E] hover:border-[#444748] transition-all relative overflow-hidden group shadow-lg">
              {/* Top Meta: Time + Room */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xl md:text-2xl font-extrabold text-white tracking-tight block">
                    {liveSession.startTime}
                  </span>
                  <span className="font-mono text-xs text-[#F6F930] font-semibold tracking-wider uppercase">
                    {liveSession.room.toUpperCase()}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    onToggleBookmark(liveSession.id);
                  }}
                  className={`p-2 rounded-full border transition-colors ${
                    liveSession.isBookmarked
                      ? 'bg-[#F6F930]/10 border-[#F6F930] text-[#F6F930]'
                      : 'bg-[#201F20] border-[#2D2D2E] text-[#8E9192] hover:text-white'
                  }`}
                  title={liveSession.isBookmarked ? 'Remove from My Schedule' : 'Add to My Schedule'}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {liveSession.isBookmarked ? 'bookmark' : 'bookmark_border'}
                  </span>
                </button>
              </div>

              {/* Session Type & Title */}
              <div className="space-y-2 mb-6">
                <span className="font-mono text-[10px] text-[#8E9192] tracking-widest uppercase block">
                  {liveSession.sessionType}
                </span>
                <h4 
                  onClick={() => onOpenSession(liveSession)}
                  className="text-xl md:text-2xl font-bold text-white leading-snug hover:text-[#F6F930] cursor-pointer transition-colors"
                >
                  {liveSession.title}
                </h4>
                <p className="text-sm text-[#C4C7C8] leading-relaxed line-clamp-2">
                  {liveSession.description}
                </p>
              </div>

              {/* Speaker Row & Detail Trigger */}
              <div className="flex items-center justify-between pt-4 border-t border-[#2D2D2E]">
                <div className="flex items-center gap-3">
                  <img
                    src={liveSession.speaker.avatar}
                    alt={liveSession.speaker.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#2D2D2E]"
                    loading="lazy"
                  />
                  <div>
                    <h5 className="font-semibold text-white text-sm">
                      {liveSession.speaker.name}
                    </h5>
                    <p className="font-mono text-[10px] text-[#8E9192] uppercase tracking-wider">
                      {liveSession.speaker.role}, {liveSession.speaker.company}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenSession(liveSession)}
                  className="w-10 h-10 rounded-xl bg-[#201F20] border border-[#2D2D2E] text-white hover:text-[#0F0F10] hover:bg-[#F6F930] hover:border-[#F6F930] flex items-center justify-center transition-all active:scale-95 group/btn"
                  title="View Session Details"
                >
                  <span className="material-symbols-outlined text-[18px] group-hover/btn:rotate-45 transition-transform">
                    north_east
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Secondary Next Session Card (Compact row from Image 3) */}
          {nextSession && (
            <div 
              onClick={() => onOpenSession(nextSession)}
              className="bg-[#1A1A1B] hover:bg-[#201F20] p-5 rounded-2xl border border-[#2D2D2E] hover:border-[#444748] transition-all cursor-pointer flex justify-between items-center group"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm font-bold text-white">
                  {nextSession.startTime}
                </span>
                <div className="h-6 w-[1px] bg-[#2D2D2E]"></div>
                <div>
                  <span className="font-mono text-[10px] text-[#8E9192] uppercase tracking-wider block">
                    {nextSession.room} • {nextSession.sessionType}
                  </span>
                  <span className="font-semibold text-white group-hover:text-[#F6F930] transition-colors text-sm md:text-base">
                    {nextSession.title}
                  </span>
                </div>
              </div>

              <span className="material-symbols-outlined text-[#8E9192] group-hover:text-white group-hover:translate-x-1 transition-all text-xl">
                chevron_right
              </span>
            </div>
          )}

          {/* Network Connection Quick status */}
          <div className="bg-[#1A1A1B]/60 p-5 rounded-2xl border border-[#2D2D2E] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#201F20] flex items-center justify-center text-[#F6F930]">
                <span className="material-symbols-outlined text-lg">bolt</span>
              </div>
              <div>
                <p className="font-mono text-[10px] text-[#8E9192] uppercase tracking-wider">
                  PEER NETWORKING
                </p>
                <p className="text-xs text-white font-medium">
                  Ready to exchange cards via QR code
                </p>
              </div>
            </div>

            <button
              onClick={onOpenScanner}
              className="font-mono text-[11px] uppercase tracking-wider text-[#F6F930] bg-[#F6F930]/10 px-3 py-1.5 rounded-full border border-[#F6F930]/30 hover:bg-[#F6F930] hover:text-[#0F0F10] transition-all"
            >
              Scan Peer
            </button>
          </div>
        </div>
      </div>

      {/* Footer matching Image 3 */}
      <footer className="pt-16 pb-12 border-t border-[#2D2D2E] text-center space-y-6">
        <h4 className="font-extrabold text-2xl tracking-tighter text-white">
          BIFROST
        </h4>
        <div className="flex flex-wrap justify-center gap-6 font-mono text-[11px] text-[#8E9192] uppercase tracking-widest">
          <button onClick={() => alert('Bifrost Summit Privacy Policy: Offline-first conference data with local storage.')} className="hover:text-white transition-colors">
            PRIVACY POLICY
          </button>
          <span>•</span>
          <button onClick={() => alert('Bifrost Summit Terms of Service: Alpha access tier.')} className="hover:text-white transition-colors">
            TERMS OF SERVICE
          </button>
          <span>•</span>
          <a href="mailto:support@bifrostsummit.org" className="hover:text-white transition-colors">
            CONTACT
          </a>
        </div>
        <p className="font-mono text-[10px] text-[#8E9192] tracking-wider uppercase">
          © 2024 BIFROST TECHNOLOGY CONFERENCE. ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  );
};
