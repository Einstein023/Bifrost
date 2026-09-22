import React, { useState, useEffect } from 'react';
import { Attendee, Session } from '../types';
import { sound } from '../utils/audio';

interface LandingPageViewProps {
  onOpenAuthModal: (mode: 'signin' | 'register', passType?: Attendee['passType']) => void;
  onExploreAgenda: () => void;
  onExploreNetwork: () => void;
  onEnterConsole: () => void;
  currentUser: Attendee | null;
  onLaunchDashboard: () => void;
  sessions: Session[];
  onOpenSession: (session: Session) => void;
  allAttendees?: Attendee[];
  onTriggerProximityAlert?: (type: 'same_room' | 'venue_arrival' | 'wave_received', friend: Attendee) => void;
  onSendFriendRequest?: (peer: Attendee) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onOpenAuthModal,
  onExploreAgenda,
  onExploreNetwork,
  onEnterConsole,
  currentUser,
  onLaunchDashboard,
  sessions,
  onOpenSession,
  allAttendees = [],
  onTriggerProximityAlert,
  onSendFriendRequest,
}) => {
  // Live countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 8,
    minutes: 42,
    seconds: 15,
  });

  const [searchFriendQuery, setSearchFriendQuery] = useState('');
  const [interactiveWaveStatus, setInteractiveWaveStatus] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { ...prev, days: Math.max(0, prev.days - 1), hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const featuredSessions = sessions.slice(0, 3);

  // Sample peer attendees for quick interactive discovery on landing page
  const samplePeers = (allAttendees.length > 0 ? allAttendees : [
    {
      id: 'usr-101',
      name: 'Sarah Chen',
      role: 'Principal UX Director',
      company: 'Vector Labs',
      accessLevel: 'VIP',
      passType: 'VIP ACCESS',
      email: 'sarah.chen@vectorlabs.co',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbx_-qxd8_WEYG5ExDRJ2uV-8bWvKFcQTzNyVKoLOI46OTo1fjmKs9Mc63z6quJPwtb_7npFxVawpGLL1ExoN_OEI47iao6vGq0w1JFGLn_T0G1GZlEDo5yDVn1GnmqazBzqGwCgfegFMLbLbsRj9HdUEcqHsImYP5GihGJ0ThmwloAre9apOxreh6le3gQQGpgKpdL26KUM9UI8SAcH4yNNOL9V_hx0en0wtHjqcw4mcG2FcAo-QVmQ',
      location: 'Main Stage Atrium',
      currentRoom: 'Main Stage',
      checkedIn: true,
      bio: 'Interaction systems and HUD design.',
      qrPayload: 'sample',
    },
    {
      id: 'usr-102',
      name: 'Marcus Vance',
      role: 'Head of AI Governance',
      company: 'Aetheria Protocol',
      accessLevel: 'Speaker',
      passType: 'SPEAKER',
      email: 'm.vance@aetheria.org',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      location: 'Main Stage',
      currentRoom: 'Main Stage',
      checkedIn: true,
      bio: 'Verifiable AI safety policy frameworks.',
      qrPayload: 'sample',
    },
    {
      id: 'usr-104',
      name: 'Liam Davies',
      role: 'Chief Design Officer',
      company: 'Dimension Interactive',
      accessLevel: 'VIP',
      passType: 'VIP ACCESS',
      email: 'liam@dimension.design',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      location: 'Atrium Sky Lounge',
      currentRoom: 'Atrium Sky Lounge',
      checkedIn: true,
      bio: 'Spatial computing for neural workflows.',
      qrPayload: 'sample',
    }
  ]) as Attendee[];

  const filteredPreviewPeers = samplePeers.filter((p) => {
    const q = searchFriendQuery.toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.company.toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q)
    );
  });

  const handleTestAlert = () => {
    sound.playFriendNearby();
    if (onTriggerProximityAlert && samplePeers.length > 0) {
      onTriggerProximityAlert('same_room', samplePeers[0]);
    } else {
      setInteractiveWaveStatus('Alert triggered! Sarah Chen is in Main Stage.');
      setTimeout(() => setInteractiveWaveStatus(null), 4000);
    }
  };

  const handleInteractiveWave = (peer: Attendee) => {
    sound.playWave();
    setInteractiveWaveStatus(`You waved to ${peer.name.split(' ')[0]}!`);
    setTimeout(() => setInteractiveWaveStatus(null), 3500);
  };

  return (
    <div className="w-full bg-[#0F0F10] text-[#E5E2E3] min-h-screen overflow-x-hidden selection:bg-[#F6F930] selection:text-[#0F0F10]">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#F6F930]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[900px] -right-32 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* 1. HERO SECTION: Clean, balanced, friend-networking first */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-16 md:pb-24">
        {/* Conference status bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2D2D2E] pb-5 mb-8 md:mb-12">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4ade80]"></span>
            </span>
            <span className="font-mono text-xs text-[#F6F930] uppercase tracking-widest font-bold">
              BIFROST SUMMIT '24 • SAN FRANCISCO
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs text-[#8E9192]">
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F6F930]"></span>
              METREON ARENA ALPHA
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1A1A1B] border border-[#2D2D2E] text-[#4ade80]">
              2,500+ ATTENDEES LIVE
            </span>
          </div>
        </div>

        {/* Hero Grid: Typography (Left) + Interactive Live Radar & Pass (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-center">
          {/* Left Column: Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1A1B] border border-[#2D2D2E] text-[#C4C7C8] font-mono text-xs">
              <span className="text-[#F6F930] font-bold">SMART SUMMIT NETWORKING</span>
              <span>•</span>
              <span className="text-white">Proximity & Same-Room Alerts</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08]">
              Never miss a friend at a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F6F930] to-white">
                2,500-person summit.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#C4C7C8] max-w-2xl leading-relaxed">
              Bifrost is the companion app that automatically alerts you when friends arrive at the venue or sit down in your keynote session. Connect with colleagues, swap contacts offline, and never lose your network.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {currentUser ? (
                <button
                  onClick={() => {
                    sound.playClick();
                    onLaunchDashboard();
                  }}
                  className="px-7 py-3.5 bg-[#F6F930] text-[#0F0F10] font-mono text-xs sm:text-sm font-extrabold uppercase rounded-full hover:bg-white transition-all shadow-[0_0_25px_rgba(246,249,48,0.3)] flex items-center gap-2 active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                  Open Dashboard ({currentUser.name.split(' ')[0]})
                </button>
              ) : (
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenAuthModal('register', 'VIP ACCESS');
                  }}
                  className="px-7 py-3.5 bg-[#F6F930] text-[#0F0F10] font-mono text-xs sm:text-sm font-extrabold uppercase rounded-full hover:bg-white transition-all shadow-[0_0_25px_rgba(246,249,48,0.3)] flex items-center gap-2 active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                  Claim Pass & Connect
                </button>
              )}

              <button
                onClick={() => {
                  sound.playClick();
                  onExploreNetwork();
                }}
                className="px-5 py-3.5 bg-[#1A1A1B] hover:bg-[#201F20] text-white border border-[#2D2D2E] hover:border-[#F6F930]/60 font-mono text-xs uppercase font-bold rounded-full transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#F6F930]">person_search</span>
                Find Friends
              </button>

              <button
                onClick={handleTestAlert}
                className="px-4 py-3.5 text-[#C4C7C8] hover:text-[#F6F930] font-mono text-xs uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Test how notifications sound and look"
              >
                <span className="material-symbols-outlined text-[16px] text-[#F6F930]">campaign</span>
                Simulate Nearby Alert
              </button>
            </div>

            {/* Quick Live Presence Pill Indicator */}
            <div className="pt-4 flex items-center gap-3 flex-wrap">
              <span className="font-mono text-[11px] text-[#8E9192] uppercase">
                Friends nearby right now:
              </span>
              <div className="flex items-center -space-x-2">
                {samplePeers.slice(0, 3).map((p) => (
                  <img
                    key={p.id}
                    src={p.avatar}
                    alt={p.name}
                    className="w-7 h-7 rounded-full object-cover border-2 border-[#0F0F10]"
                    title={`${p.name} (${p.currentRoom || 'Summit'})`}
                  />
                ))}
              </div>
              <span className="font-mono text-xs text-[#4ade80] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"></span>
                2 in Main Stage with you
              </span>
            </div>
          </div>

          {/* Right Column: Live Conference Friends Radar Preview Box */}
          <div className="lg:col-span-5 relative">
            <div className="bg-[#141416] border border-[#2D2D2E] hover:border-[#F6F930]/50 rounded-[28px] p-6 space-y-5 shadow-2xl relative overflow-hidden transition-all">
              {/* Top Bar of Card */}
              <div className="flex justify-between items-center pb-3 border-b border-[#2D2D2E]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F6F930] animate-ping"></span>
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    CONFERENCE FRIEND RADAR
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#F6F930] bg-[#F6F930]/10 px-2.5 py-0.5 rounded-full border border-[#F6F930]/30 font-semibold">
                  LIVE TELEMETRY
                </span>
              </div>

              {/* High-priority Same Room Alert Simulation */}
              <div className="p-4 rounded-2xl bg-[#1A1A1B] border border-[#F6F930] shadow-[0_0_20px_rgba(246,249,48,0.15)] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] bg-[#F6F930] text-[#0F0F10] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">bolt</span>
                    FRIEND IN SAME SESSION
                  </span>
                  <span className="font-mono text-[10px] text-[#8E9192]">JUST NOW</span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={samplePeers[0].avatar}
                    alt={samplePeers[0].name}
                    className="w-10 h-10 rounded-xl object-cover border border-[#F6F930]"
                  />
                  <div className="truncate flex-1">
                    <h4 className="text-white font-bold text-sm truncate">
                      {samplePeers[0].name}
                    </h4>
                    <p className="text-xs text-[#C4C7C8] truncate">
                      At <strong className="text-white">Main Stage</strong> ({samplePeers[0].company})
                    </p>
                  </div>

                  <button
                    onClick={() => handleInteractiveWave(samplePeers[0])}
                    className="px-3 py-1.5 bg-[#F6F930] hover:bg-white text-[#0F0F10] font-mono text-[11px] font-bold rounded-xl uppercase transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    Wave 👋
                  </button>
                </div>

                <p className="text-[11px] text-[#8E9192] italic">
                  "Sitting row 3 stage left for Generative Architecture keynote!"
                </p>
              </div>

              {/* Status acknowledgment banner */}
              {interactiveWaveStatus && (
                <div className="p-2.5 bg-[#F6F930]/15 border border-[#F6F930]/50 rounded-xl text-center text-xs font-mono text-[#F6F930] animate-in fade-in">
                  ✨ {interactiveWaveStatus}
                </div>
              )}

              {/* Other friends in venue list */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-[#8E9192] uppercase tracking-wider block">
                  OTHER FRIENDS CHECKED IN:
                </span>

                {samplePeers.slice(1, 3).map((peer) => (
                  <div
                    key={peer.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#1A1A1B] border border-[#2D2D2E] text-xs hover:border-[#444748] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={peer.avatar}
                        alt={peer.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold text-white">{peer.name}</p>
                        <p className="font-mono text-[10px] text-[#8E9192]">{peer.company}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-[#4ade80] bg-[#4ade80]/10 px-2 py-0.5 rounded-full border border-[#4ade80]/20">
                        {peer.currentRoom || 'In Summit'}
                      </span>
                      <button
                        onClick={() => handleInteractiveWave(peer)}
                        className="text-[10px] font-mono text-[#C4C7C8] hover:text-[#F6F930] px-2 py-1 rounded bg-[#201F20]"
                      >
                        Wave 👋
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action row */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => {
                    sound.playClick();
                    onExploreNetwork();
                  }}
                  className="w-full py-2.5 bg-[#201F20] hover:bg-[#2A2A2B] text-white border border-[#444748] rounded-xl font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">group</span>
                  Open Full Summit Network Hub →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Keynote Countdown Ticker */}
        <div className="mt-12 bg-[#141415] rounded-[24px] p-5 sm:p-7 border border-[#2D2D2E] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <span className="font-mono text-[10px] text-[#F6F930] uppercase tracking-widest block font-bold">
              KEYNOTE STAGE COMMENCES IN
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold text-white">
              Countdown to Opening Keynote
            </h3>
            <p className="text-xs text-[#8E9192]">
              Dr. Elena Rostova on "The Future of Generative Architecture"
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <div className="bg-[#1A1A1B] border border-[#2D2D2E] px-4 py-2.5 rounded-2xl text-center min-w-[68px]">
              <span className="text-2xl font-extrabold text-white block">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-[#8E9192] uppercase">DAYS</span>
            </div>

            <div className="bg-[#1A1A1B] border border-[#2D2D2E] px-4 py-2.5 rounded-2xl text-center min-w-[68px]">
              <span className="text-2xl font-extrabold text-white block">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-[#8E9192] uppercase">HOURS</span>
            </div>

            <div className="bg-[#1A1A1B] border border-[#2D2D2E] px-4 py-2.5 rounded-2xl text-center min-w-[68px]">
              <span className="text-2xl font-extrabold text-white block">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-[#8E9192] uppercase">MINS</span>
            </div>

            <div className="bg-[#1A1A1B] border border-[#2D2D2E] px-4 py-2.5 rounded-2xl text-center min-w-[68px]">
              <span className="text-2xl font-extrabold text-[#F6F930] block">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-[#8E9192] uppercase">SECS</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 4 PILLARS OF BIFROST NETWORKING (BENTO GRID) */}
      <section className="bg-[#121214] py-16 md:py-24 border-y border-[#2D2D2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-mono text-xs text-[#F6F930] uppercase tracking-widest font-bold">
              DESIGNED FOR LIVE ENGAGEMENT
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              A companion engineered for summit networking
            </h2>
            <p className="text-sm text-[#C4C7C8] leading-relaxed">
              Never miss opportunities to sync with colleagues or peers across multi-floor conference halls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="bg-[#18181A] rounded-2xl p-6 border border-[#2D2D2E] hover:border-[#F6F930]/60 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#F6F930]/10 border border-[#F6F930]/30 flex items-center justify-center text-[#F6F930]">
                <span className="material-symbols-outlined text-2xl">bolt</span>
              </div>
              <h3 className="text-lg font-bold text-white">Same-Room Notifications</h3>
              <p className="text-xs text-[#C4C7C8] leading-relaxed">
                Receive instant alerts whenever a connected friend sits down in the same session hall or workshop.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#18181A] rounded-2xl p-6 border border-[#2D2D2E] hover:border-[#F6F930]/60 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-2xl">person_add</span>
              </div>
              <h3 className="text-lg font-bold text-white">1-Click Friend Adding</h3>
              <p className="text-xs text-[#C4C7C8] leading-relaxed">
                Connect via attendee directory search, offline QR badge scan, or direct badge ID pairing in seconds.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#18181A] rounded-2xl p-6 border border-[#2D2D2E] hover:border-[#F6F930]/60 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#4ade80]/10 border border-[#4ade80]/30 flex items-center justify-center text-[#4ade80]">
                <span className="material-symbols-outlined text-2xl">qr_code</span>
              </div>
              <h3 className="text-lg font-bold text-white">Offline vCard Badges</h3>
              <p className="text-xs text-[#C4C7C8] leading-relaxed">
                Swap contact info and LinkedIn links seamlessly without depending on congested conference Wi-Fi networks.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-[#18181A] rounded-2xl p-6 border border-[#2D2D2E] hover:border-[#F6F930]/60 transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <span className="material-symbols-outlined text-2xl">sensors</span>
              </div>
              <h3 className="text-lg font-bold text-white">Live Room Telemetry</h3>
              <p className="text-xs text-[#C4C7C8] leading-relaxed">
                Monitor real-time capacity sensors for Main Stage and breakout rooms so you always arrive before capacity limits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE DIRECTORY LOOKUP PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2D2D2E] pb-6">
          <div>
            <span className="font-mono text-xs text-[#F6F930] uppercase tracking-widest font-bold">
              SUMMIT DIRECTORY
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">
              Find Colleagues & Friends
            </h2>
            <p className="text-xs md:text-sm text-[#C4C7C8] mt-1">
              Search attendees and test adding friends to your conference radar.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search by name or company..."
              value={searchFriendQuery}
              onChange={(e) => setSearchFriendQuery(e.target.value)}
              className="w-full bg-[#1A1A1B] border border-[#2D2D2E] focus:border-[#F6F930] text-xs text-white rounded-xl pl-9 pr-3 py-2 outline-none"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#8E9192] text-[18px]">
              search
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPreviewPeers.slice(0, 3).map((peer) => (
            <div
              key={peer.id}
              className="bg-[#141416] p-5 rounded-2xl border border-[#2D2D2E] hover:border-[#444748] transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-3">
                <img
                  src={peer.avatar}
                  alt={peer.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#2D2D2E]"
                />
                <div className="truncate">
                  <h4 className="font-bold text-white text-sm truncate">{peer.name}</h4>
                  <p className="font-mono text-[11px] text-[#F6F930] truncate">{peer.role}</p>
                  <p className="text-xs text-[#8E9192] truncate">{peer.company}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#2D2D2E] flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] text-[#4ade80] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]"></span>
                  {peer.currentRoom || 'In Summit'}
                </span>

                <button
                  onClick={() => {
                    sound.playSuccess();
                    if (onSendFriendRequest) {
                      onSendFriendRequest(peer);
                    }
                    setInteractiveWaveStatus(`Friend request sent to ${peer.name}!`);
                    setTimeout(() => setInteractiveWaveStatus(null), 3500);
                  }}
                  className="px-3 py-1 bg-white hover:bg-[#F6F930] text-[#0F0F10] font-mono text-[11px] font-bold rounded-lg uppercase transition-colors cursor-pointer"
                >
                  + Add Friend
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED STAGE SESSIONS */}
      <section className="bg-[#121214] py-16 md:py-24 border-t border-[#2D2D2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2D2D2E] pb-6">
            <div>
              <span className="font-mono text-xs text-[#F6F930] uppercase tracking-widest font-bold">
                STAGE TIMELINE
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">
                Featured Keynotes & Sessions
              </h2>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onExploreAgenda();
              }}
              className="font-mono text-xs text-[#C4C7C8] hover:text-[#F6F930] uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              VIEW FULL 48-HR AGENDA →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredSessions.map((ses) => (
              <div
                key={ses.id}
                onClick={() => onOpenSession(ses)}
                className="bg-[#18181A] hover:bg-[#201F20] rounded-2xl p-6 border border-[#2D2D2E] hover:border-[#444748] transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[#F6F930] font-semibold uppercase">{ses.room}</span>
                    <span className="text-[#8E9192]">{ses.startTime}</span>
                  </div>

                  <h3 className="font-bold text-white text-base group-hover:text-[#F6F930] transition-colors line-clamp-2">
                    {ses.title}
                  </h3>

                  <p className="text-xs text-[#C4C7C8] line-clamp-2 leading-relaxed">
                    {ses.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#2D2D2E] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={ses.speaker.avatar}
                      alt={ses.speaker.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#2D2D2E]"
                    />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-white truncate">{ses.speaker.name}</p>
                      <p className="font-mono text-[9px] text-[#8E9192] truncate">{ses.speaker.company}</p>
                    </div>
                  </div>

                  <span className="font-mono text-[10px] text-[#8E9192] group-hover:text-white flex items-center gap-1">
                    Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PASS SELECTION TIERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-mono text-xs text-[#F6F930] uppercase tracking-widest font-bold">
            CREDENTIALS
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Claim your digital conference pass
          </h2>
          <p className="text-xs md:text-sm text-[#C4C7C8]">
            Instant activation with offline contact swapping and conference friend radar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Tier 1: General Admission */}
          <div className="bg-[#141416] rounded-2xl p-7 border border-[#2D2D2E] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="font-mono text-xs text-[#8E9192] uppercase tracking-widest">
                STANDARD PASS
              </span>
              <h3 className="text-2xl font-bold text-white">General Admission</h3>
              <p className="text-xs text-[#C4C7C8] leading-relaxed">
                Full 2-day access to all Keynote and panel stages with standard digital badge.
              </p>

              <div className="pt-2">
                <span className="text-3xl font-extrabold text-white">$499</span>
                <span className="text-xs text-[#8E9192] font-mono"> / attendee</span>
              </div>

              <ul className="space-y-2.5 text-xs text-[#C4C7C8] pt-2 border-t border-[#2D2D2E]">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#F6F930]">check</span>
                  Keynote & Panel Access
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#F6F930]">check</span>
                  Conference Friend Radar & Alerts
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#F6F930]">check</span>
                  Offline vCard Contact Swap
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onOpenAuthModal('register', 'GENERAL');
              }}
              className="w-full py-3 bg-[#201F20] hover:bg-[#2A2A2B] text-white border border-[#444748] rounded-xl font-mono text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
            >
              Claim General Pass
            </button>
          </div>

          {/* Tier 2: VIP All-Access (Highlighted) */}
          <div className="bg-[#18181A] rounded-2xl p-7 border-2 border-[#F6F930] shadow-[0_0_30px_rgba(246,249,48,0.15)] flex flex-col justify-between space-y-6 relative">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-[#F6F930] uppercase tracking-widest font-bold">
                  RECOMMENDED TIER
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#F6F930] text-[#0F0F10] font-mono text-[9px] font-extrabold uppercase">
                  VIP ACCESS
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white">VIP All-Access</h3>
              <p className="text-xs text-[#C4C7C8] leading-relaxed">
                Complete summit access including the Atrium Sky Lounge, Speaker Mixer, and priority check-in.
              </p>

              <div className="pt-2">
                <span className="text-3xl font-extrabold text-[#F6F930]">$899</span>
                <span className="text-xs text-[#8E9192] font-mono"> / attendee</span>
              </div>

              <ul className="space-y-2.5 text-xs text-white pt-2 border-t border-[#2D2D2E]">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#F6F930]">check</span>
                  All Stages & Hands-on Workshops
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#F6F930]">check</span>
                  Atrium Sky Lounge & Founder Mixer
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#F6F930]">check</span>
                  Priority Same-Room Proximity Alerts
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#F6F930]">check</span>
                  Dedicated VIP Fast-Track Entry
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onOpenAuthModal('register', 'VIP ACCESS');
              }}
              className="w-full py-3.5 bg-[#F6F930] hover:bg-white text-[#0F0F10] font-mono text-xs font-extrabold uppercase tracking-wider rounded-xl shadow transition-all active:scale-95 cursor-pointer"
            >
              Claim VIP Pass
            </button>
          </div>

          {/* Tier 3: Speaker / Operator Pass */}
          <div className="bg-[#141416] rounded-2xl p-7 border border-[#2D2D2E] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="font-mono text-xs text-[#8E9192] uppercase tracking-widest">
                SPEAKER & FACULTY
              </span>
              <h3 className="text-2xl font-bold text-white">Speaker Pass</h3>
              <p className="text-xs text-[#C4C7C8] leading-relaxed">
                For designated faculty, stage presenters, and summit advisory board members.
              </p>

              <div className="pt-2">
                <span className="text-3xl font-extrabold text-white">Complimentary</span>
                <span className="text-xs text-[#8E9192] font-mono"> / invitation</span>
              </div>

              <ul className="space-y-2.5 text-xs text-[#C4C7C8] pt-2 border-t border-[#2D2D2E]">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#F6F930]">check</span>
                  Speaker Green Room & AV Concierge
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#F6F930]">check</span>
                  Presenter Console & Telemetry Access
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#F6F930]">check</span>
                  Full VIP Networking Privileges
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onOpenAuthModal('signin');
              }}
              className="w-full py-3 bg-[#201F20] hover:bg-[#2A2A2B] text-white border border-[#444748] rounded-xl font-mono text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
            >
              Speaker Portal Login
            </button>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="bg-[#121214] py-16 md:py-20 border-t border-[#2D2D2E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-[#F6F930] uppercase tracking-widest font-bold">
              COMMON QUESTIONS
            </span>
            <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'How does the Conference Friend Notification system work?',
                a: 'Whenever you add an attendee as a friend, your app monitors room presence. If a friend sits down in your session or enters the venue, you receive a gentle audio chime and a real-time notification with a 1-tap "Wave" action so you can sit together.',
              },
              {
                q: 'Can I add friends if there is no Wi-Fi or cellular service?',
                a: 'Yes! Your digital pass contains your identity cryptographically encoded in an offline QR payload. Simply have your friend scan your badge screen to immediately exchange contact cards without an internet connection.',
              },
              {
                q: 'How can I search and add colleagues attending the summit?',
                a: 'Navigate to the Network view or use the search bar above to look up attendees by name, company, or badge ID (e.g. #BF-8492). Tap "Add Friend" to establish the connection.',
              },
              {
                q: 'Is my contact information secure?',
                a: 'Yes. Only contacts you explicitly connect with receive your email or phone information, and you can remove friends or edit private notes at any time.',
              },
            ].map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-[#18181A] rounded-2xl border border-[#2D2D2E] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left flex justify-between items-center text-sm font-bold text-white hover:text-[#F6F930] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="material-symbols-outlined text-[20px] text-[#8E9192]">
                      {isOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-[#C4C7C8] leading-relaxed border-t border-[#2D2D2E]/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-12 border-t border-[#2D2D2E] text-center space-y-4">
        <h4 className="font-extrabold text-2xl tracking-tighter text-white">BIFROST</h4>
        <div className="flex flex-wrap justify-center gap-6 font-mono text-[11px] text-[#8E9192] uppercase tracking-widest">
          <button onClick={onExploreAgenda} className="hover:text-white transition-colors">
            SCHEDULE
          </button>
          <span>•</span>
          <button onClick={onExploreNetwork} className="hover:text-white transition-colors">
            FRIENDS RADAR
          </button>
          <span>•</span>
          <button onClick={onEnterConsole} className="hover:text-white transition-colors">
            CONSOLE
          </button>
        </div>
        <p className="font-mono text-[10px] text-[#8E9192] tracking-wider uppercase">
          © 2024 BIFROST TECHNOLOGY CONFERENCE. ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  );
};
