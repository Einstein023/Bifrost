import React from 'react';
import { Attendee, Session } from '../types';
import { PassCard } from './PassCard';
import { sound } from '../utils/audio';

interface DashboardViewProps {
  user: Attendee;
  sessions: Session[];
  connections: Attendee[];
  onOpenSession: (session: Session) => void;
  onNavigateToSchedule: () => void;
  onNavigateToNetwork: () => void;
  onOpenPassModal: () => void;
  onOpenScanner: () => void;
  onToggleBookmark: (sessionId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  sessions,
  connections,
  onOpenSession,
  onNavigateToSchedule,
  onNavigateToNetwork,
  onOpenPassModal,
  onOpenScanner,
  onToggleBookmark,
}) => {
  // Find currently live and next upcoming sessions
  const liveSession = sessions.find((s) => s.isLive) || sessions[0];
  const nextSession = sessions.find((s) => s.id !== liveSession?.id && s.day === 'Day 1') || sessions[1];

  const userRoom = user.currentRoom || 'Main Stage';
  const friendsInSameRoom = connections.filter(
    (c) => c.currentRoom && c.currentRoom.toLowerCase() === userRoom.toLowerCase()
  );

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

          {/* Conference Friends Live Radar Widget */}
          <div className="bg-[#1A1A1B] p-5 md:p-6 rounded-2xl md:rounded-[24px] border border-[#2D2D2E] hover:border-[#444748] transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F6F930]/10 border border-[#F6F930]/30 flex items-center justify-center text-[#F6F930]">
                  <span className="material-symbols-outlined text-lg">group</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                    Friends in Summit
                    <span className="font-mono text-[10px] bg-[#201F20] text-[#F6F930] px-2 py-0.5 rounded-full border border-[#2D2D2E]">
                      {connections.length} Online
                    </span>
                  </h4>
                  <p className="font-mono text-[10px] text-[#8E9192]">
                    Real-time proximity & room alerts
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onNavigateToNetwork();
                }}
                className="font-mono text-[10px] text-[#C4C7C8] hover:text-[#F6F930] uppercase tracking-wider flex items-center gap-1 transition-colors"
              >
                RADAR HUB →
              </button>
            </div>

            {/* Same room alert badge if friends are in user's room */}
            {friendsInSameRoom.length > 0 && (
              <div className="bg-[#F6F930]/10 border border-[#F6F930]/40 rounded-xl p-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#F6F930] text-[18px]">bolt</span>
                  <p className="text-xs text-white">
                    <strong className="text-[#F6F930]">{friendsInSameRoom.length} {friendsInSameRoom.length === 1 ? 'friend is' : 'friends are'}</strong> in your session right now! ({friendsInSameRoom.map(f => f.name.split(' ')[0]).join(', ')})
                  </p>
                </div>
                <button
                  onClick={() => {
                    sound.playWave();
                    alert(`Waved to ${friendsInSameRoom.map(f => f.name).join(' & ')}!`);
                  }}
                  className="px-2.5 py-1 bg-[#F6F930] text-[#0F0F10] font-mono text-[10px] font-bold rounded-lg uppercase whitespace-nowrap active:scale-95"
                >
                  Wave 👋
                </button>
              </div>
            )}

            {/* List of active friends with current location */}
            <div className="space-y-2">
              {connections.slice(0, 3).map((friend) => {
                const isSame = friend.currentRoom && friend.currentRoom.toLowerCase() === userRoom.toLowerCase();
                return (
                  <div
                    key={friend.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#201F20]/60 border border-[#2D2D2E]/80 text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-7 h-7 rounded-lg object-cover border border-[#444748] flex-shrink-0"
                      />
                      <div className="truncate">
                        <span className="font-semibold text-white truncate block">
                          {friend.name}
                        </span>
                        <span className="font-mono text-[10px] text-[#8E9192]">
                          {friend.company}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1 ${
                        isSame
                          ? 'bg-[#F6F930] text-[#0F0F10] font-bold'
                          : 'bg-[#18181A] text-[#4ade80] border border-[#4ade80]/30'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[10px]">
                        {isSame ? 'bolt' : 'location_on'}
                      </span>
                      {friend.currentRoom || 'In Summit'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  sound.playClick();
                  onNavigateToNetwork();
                }}
                className="flex-1 py-2 rounded-xl bg-[#201F20] hover:bg-[#2A2A2B] text-white border border-[#444748] font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px] text-[#F6F930]">person_add</span>
                + Add Friends
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenScanner();
                }}
                className="flex-1 py-2 rounded-xl bg-white hover:bg-[#F6F930] text-[#0F0F10] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">qr_code_scanner</span>
                Scan Badge
              </button>
            </div>
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
