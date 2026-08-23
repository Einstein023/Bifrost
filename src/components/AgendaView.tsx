import React, { useState, useMemo } from 'react';
import { Session } from '../types';
import { sound } from '../utils/audio';
import { exportSessionICS } from '../utils/vcard';

interface AgendaViewProps {
  sessions: Session[];
  onToggleBookmark: (sessionId: string) => void;
  onOpenSession: (session: Session) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  sessions,
  onToggleBookmark,
  onOpenSession,
}) => {
  const [selectedDay, setSelectedDay] = useState<'Day 1' | 'Day 2'>('Day 1');
  const [selectedTrack, setSelectedTrack] = useState<string>('All');
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const tracks = ['All', 'Main Stage', 'AI & Vision', 'Cloud & Systems', 'Design & Ethics', 'Workshop'];

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchDay = s.day === selectedDay;
      const matchTrack = selectedTrack === 'All' || s.track === selectedTrack;
      const matchBookmark = onlyBookmarked ? s.isBookmarked : true;
      const matchSearch =
        searchQuery.trim() === '' ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.room.toLowerCase().includes(searchQuery.toLowerCase());

      return matchDay && matchTrack && matchBookmark && matchSearch;
    });
  }, [sessions, selectedDay, selectedTrack, onlyBookmarked, searchQuery]);

  const bookmarkedCount = useMemo(() => {
    return sessions.filter((s) => s.isBookmarked).length;
  }, [sessions]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-8">
      {/* Title & Day Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2D2D2E] pb-6">
        <div>
          <span className="font-mono text-xs text-[#F6F930] tracking-widest uppercase block mb-1">
            BIFROST AGENDA
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Schedule & Tracks
          </h2>
          <p className="text-sm text-[#C4C7C8] mt-1">
            Explore live keynotes, hands-on workshops, and build your custom itinerary.
          </p>
        </div>

        {/* Day 1 / Day 2 Pill Switcher */}
        <div className="flex items-center gap-1.5 bg-[#1A1A1B] p-1 rounded-full border border-[#2D2D2E] self-start md:self-auto">
          <button
            onClick={() => {
              sound.playClick();
              setSelectedDay('Day 1');
            }}
            className={`font-mono text-xs px-5 py-2 rounded-full font-bold uppercase transition-all ${
              selectedDay === 'Day 1'
                ? 'bg-white text-[#0F0F10] shadow-md'
                : 'text-[#C4C7C8] hover:text-white'
            }`}
          >
            Day 1 (Oct 24)
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setSelectedDay('Day 2');
            }}
            className={`font-mono text-xs px-5 py-2 rounded-full font-bold uppercase transition-all ${
              selectedDay === 'Day 2'
                ? 'bg-white text-[#0F0F10] shadow-md'
                : 'text-[#C4C7C8] hover:text-white'
            }`}
          >
            Day 2 (Oct 25)
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Main / Bookmark toggle tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setOnlyBookmarked(false);
              }}
              className={`font-mono text-xs px-4 py-2 rounded-xl font-semibold uppercase transition-all border ${
                !onlyBookmarked
                  ? 'bg-white text-[#0F0F10] border-white'
                  : 'bg-[#1A1A1B] text-[#C4C7C8] border-[#2D2D2E] hover:border-[#444748]'
              }`}
            >
              All Sessions
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setOnlyBookmarked(true);
              }}
              className={`font-mono text-xs px-4 py-2 rounded-xl font-semibold uppercase transition-all border flex items-center gap-1.5 ${
                onlyBookmarked
                  ? 'bg-[#F6F930] text-[#0F0F10] border-[#F6F930] font-bold shadow-[0_0_12px_rgba(246,249,48,0.3)]'
                  : 'bg-[#1A1A1B] text-[#C4C7C8] border-[#2D2D2E] hover:border-[#444748]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">bookmark</span>
              My Schedule ({bookmarkedCount})
            </button>
          </div>

          {/* Search box */}
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search speaker, topic, room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1A1B] border border-[#2D2D2E] focus:border-[#F6F930] text-sm text-white rounded-xl pl-9 pr-4 py-2 outline-none transition-colors"
            />
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#8E9192] text-[18px]">
              search
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-[#8E9192] hover:text-white"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Track Pills (Horizontal scrollable) */}
        {!onlyBookmarked && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {tracks.map((track) => (
              <button
                key={track}
                onClick={() => {
                  sound.playClick();
                  setSelectedTrack(track);
                }}
                className={`font-mono text-[11px] whitespace-nowrap px-3.5 py-1.5 rounded-full uppercase tracking-wider transition-all border ${
                  selectedTrack === track
                    ? 'bg-[#2A2A2B] text-white border-[#F6F930]'
                    : 'bg-[#141415] text-[#8E9192] border-[#2D2D2E] hover:text-white hover:border-[#444748]'
                }`}
              >
                {track}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sessions Timeline or Empty State */}
      {filteredSessions.length === 0 ? (
        /* Empty State matching Image 7 ("Your Agenda is Clear") */
        <section className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-28 h-28 rounded-full bg-[#1A1A1B] border border-[#2D2D2E] flex items-center justify-center mb-6 shadow-xl relative">
            <div className="absolute inset-0 rounded-full bg-[#F6F930]/5 blur-md pointer-events-none"></div>
            <span className="material-symbols-outlined text-5xl text-[#8E9192]">
              calendar_month
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            {onlyBookmarked ? 'Your Agenda is Clear' : 'No Sessions Found'}
          </h3>

          <p className="text-sm md:text-base text-[#C4C7C8] max-w-md mb-8 leading-relaxed">
            {onlyBookmarked
              ? "You haven't added any sessions to your schedule yet. Discover keynotes, workshops, and exclusive networking events to build your ultimate Summit experience."
              : 'Try adjusting your search query or track filters to find sessions.'}
          </p>

          {onlyBookmarked ? (
            <button
              onClick={() => {
                sound.playClick();
                setOnlyBookmarked(false);
                setSelectedTrack('All');
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1A1A1B] text-white hover:text-[#0F0F10] hover:bg-[#F6F930] border border-[#2D2D2E] hover:border-[#F6F930] rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">explore</span>
              EXPLORE THE AGENDA
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                setSelectedTrack('All');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 bg-[#1A1A1B] border border-[#2D2D2E] hover:border-[#F6F930] text-white font-mono text-xs uppercase rounded-full"
            >
              Clear Filters
            </button>
          )}
        </section>
      ) : (
        /* Session List */
        <div className="space-y-4">
          {filteredSessions.map((session) => {
            const capacityPercent = Math.round((session.enrolledCount / session.capacity) * 100);
            const isNearCapacity = capacityPercent >= 90;

            return (
              <div
                key={session.id}
                onClick={() => onOpenSession(session)}
                className={`bg-[#1A1A1B] hover:bg-[#201F20] rounded-2xl p-6 border transition-all cursor-pointer group shadow-sm ${
                  session.isLive
                    ? 'border-[#D7263D]/60 hover:border-[#D7263D]'
                    : session.isBookmarked
                    ? 'border-[#F6F930]/40 hover:border-[#F6F930]'
                    : 'border-[#2D2D2E] hover:border-[#444748]'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left info */}
                  <div className="space-y-3 flex-1">
                    {/* Time, Room, and Live status */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-base font-bold text-white">
                        {session.startTime} — {session.endTime}
                      </span>
                      <span className="h-3.5 w-[1px] bg-[#2D2D2E]"></span>
                      <span className="font-mono text-xs font-semibold text-[#F6F930] uppercase bg-[#F6F930]/10 px-2.5 py-0.5 rounded border border-[#F6F930]/30">
                        {session.room}
                      </span>
                      <span className="font-mono text-[10px] text-[#8E9192] uppercase">
                        {session.sessionType}
                      </span>
                      {session.isLive && (
                        <span className="bg-[#D7263D] text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                          LIVE NOW
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#F6F930] transition-colors leading-snug">
                        {session.title}
                      </h3>
                      <p className="text-sm text-[#C4C7C8] mt-1.5 line-clamp-2 leading-relaxed">
                        {session.description}
                      </p>
                    </div>

                    {/* Speaker Preview */}
                    <div className="flex items-center gap-3 pt-2">
                      <img
                        src={session.speaker.avatar}
                        alt={session.speaker.name}
                        className="w-9 h-9 rounded-lg object-cover border border-[#2D2D2E]"
                        loading="lazy"
                      />
                      <div>
                        <p className="text-xs font-bold text-white">
                          {session.speaker.name}
                        </p>
                        <p className="font-mono text-[10px] text-[#8E9192] uppercase">
                          {session.speaker.role} • {session.speaker.company}
                        </p>
                      </div>
                    </div>

                    {/* Tags & Capacity Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {session.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-[10px] text-[#8E9192] bg-[#141415] px-2 py-0.5 rounded border border-[#2D2D2E]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className={isNearCapacity ? 'text-[#D7263D] font-bold' : 'text-[#8E9192]'}>
                          {session.enrolledCount} / {session.capacity} seats ({capacityPercent}%)
                        </span>
                        <div className="w-16 h-1.5 bg-[#201F20] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isNearCapacity ? 'bg-[#D7263D]' : 'bg-white'
                            }`}
                            style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: Bookmark & ICS */}
                  <div className="flex md:flex-col items-center justify-end gap-2 pt-2 md:pt-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playClick();
                        onToggleBookmark(session.id);
                      }}
                      className={`p-2.5 rounded-xl border transition-all active:scale-95 ${
                        session.isBookmarked
                          ? 'bg-[#F6F930] border-[#F6F930] text-[#0F0F10] font-bold shadow-[0_0_12px_rgba(246,249,48,0.3)]'
                          : 'bg-[#201F20] border-[#2D2D2E] text-[#C4C7C8] hover:text-white hover:border-[#444748]'
                      }`}
                      title={session.isBookmarked ? 'Bookmarked' : 'Add to My Schedule'}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {session.isBookmarked ? 'bookmark' : 'bookmark_border'}
                      </span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playClick();
                        exportSessionICS(session);
                      }}
                      className="p-2.5 rounded-xl bg-[#201F20] border border-[#2D2D2E] text-[#8E9192] hover:text-white hover:border-[#444748] transition-all active:scale-95"
                      title="Add to Calendar (.ics)"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        calendar_add_on
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
