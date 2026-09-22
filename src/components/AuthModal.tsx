import React, { useState } from 'react';
import { Attendee, UserAccount } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (account: UserAccount) => void;
  initialMode?: 'signin' | 'register';
  initialPassType?: Attendee['passType'];
  existingAccounts: UserAccount[];
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAbx_-qxd8_WEYG5ExDRJ2uV-8bWvKFcQTzNyVKoLOI46OTo1fjmKs9Mc63z6quJPwtb_7npFxVawpGLL1ExoN_OEI47iao6vGq0w1JFGLn_T0G1GZlEDo5yDVn1GnmqazBzqGwCgfegFMLbLbsRj9HdUEcqHsImYP5GihGJ0ThmwloAre9apOxreh6le3gQQGpgKpdL26KUM9UI8SAcH4yNNOL9V_hx0en0wtHjqcw4mcG2FcAo-QVmQ',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'register',
  initialPassType = 'VIP ACCESS',
  existingAccounts,
}) => {
  const [mode, setMode] = useState<'signin' | 'register'>(initialMode);
  
  // Sign In state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInError, setSignInError] = useState<string | null>(null);

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regPassType, setRegPassType] = useState<Attendee['passType']>(initialPassType);
  const [regAvatar, setRegAvatar] = useState(PRESET_AVATARS[0]);
  const [regCustomAvatar, setRegCustomAvatar] = useState('');
  const [regBio, setRegBio] = useState('');
  const [regLinkedin, setRegLinkedin] = useState('');
  const [regGithub, setRegGithub] = useState('');
  const [regError, setRegError] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerCelebration = () => {
    sound.playSuccess();
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F6F930', '#FFFFFF', '#1A1A1B'],
    });
  };

  const handleQuickPersonaSelect = (account: UserAccount) => {
    sound.playClick();
    triggerCelebration();
    onAuthSuccess(account);
    onClose();
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);

    const emailTrimmed = signInEmail.trim().toLowerCase();
    const found = existingAccounts.find(
      (acc) => acc.user.email.toLowerCase() === emailTrimmed
    );

    if (found) {
      triggerCelebration();
      onAuthSuccess(found);
      onClose();
    } else if (emailTrimmed) {
      // Auto-create pass for email if not found
      const generatedId = `#BF-${Math.floor(1000 + Math.random() * 9000)}`;
      const nameParts = emailTrimmed.split('@')[0].split('.');
      const formattedName = nameParts
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ');

      const newAttendee: Attendee = {
        id: generatedId,
        name: formattedName || 'Summit Attendee',
        role: 'Technology Leader',
        company: emailTrimmed.split('@')[1]?.split('.')[0]?.toUpperCase() || 'Summit Global',
        accessLevel: 'VIP',
        passType: 'VIP ACCESS',
        email: emailTrimmed,
        bio: 'Technology leader attending Bifrost Summit 2024.',
        avatar: PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)],
        location: 'Main Hall Atrium',
        qrPayload: `BIFROST_USER:${generatedId}:${formattedName}:Summit:VIP:${emailTrimmed}`,
        checkedIn: true,
      };

      const newAccount: UserAccount = {
        user: newAttendee,
        password: signInPassword,
        bookmarkedSessionIds: ['ses-1', 'ses-2'],
        connections: [],
        notifications: [
          {
            id: `notif-welcome-${Date.now()}`,
            title: 'Welcome to BIFROST',
            message: `Your digital pass ${generatedId} is active and ready for check-in.`,
            type: 'info',
            timestamp: new Date().toISOString(),
            timeAgo: 'JUST NOW',
            isRead: false,
          },
        ],
      };

      triggerCelebration();
      onAuthSuccess(newAccount);
      onClose();
    } else {
      setSignInError('Please enter your email to proceed.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim()) {
      setRegError('Please enter your full name.');
      return;
    }
    if (!regEmail.trim()) {
      setRegError('Please enter a valid email address.');
      return;
    }

    const generatedId = `#BF-${Math.floor(1000 + Math.random() * 9000)}`;
    const avatarUrl = regCustomAvatar.trim() || regAvatar;

    const accessLevel =
      regPassType === 'VIP ACCESS'
        ? 'VIP'
        : regPassType === 'SPEAKER'
        ? 'Speaker'
        : 'General';

    const newAttendee: Attendee = {
      id: generatedId,
      name: regName.trim(),
      role: regRole.trim() || 'Software Engineer / Architect',
      company: regCompany.trim() || 'Independent Tech',
      accessLevel: accessLevel as any,
      passType: regPassType,
      email: regEmail.trim(),
      bio:
        regBio.trim() ||
        `${regRole || 'Technologist'} at ${
          regCompany || 'Summit 2024'
        }. Interested in AI systems and next-gen interfaces.`,
      avatar: avatarUrl,
      linkedin: regLinkedin.trim() || undefined,
      github: regGithub.trim() || undefined,
      location: 'Main Hall Atrium',
      qrPayload: `BIFROST_USER:${generatedId}:${regName.trim()}:${regCompany.trim()}:${regPassType}:${regEmail.trim()}`,
      checkedIn: true,
    };

    const newAccount: UserAccount = {
      user: newAttendee,
      password: regPassword,
      bookmarkedSessionIds: ['ses-1', 'ses-4'],
      connections: [],
      notifications: [
        {
          id: `notif-welcome-${Date.now()}`,
          title: 'Summit Pass Activated',
          message: `Welcome ${newAttendee.name}! Your ${newAttendee.passType} pass has been minted with ID ${generatedId}.`,
          type: 'critical',
          timestamp: new Date().toISOString(),
          timeAgo: 'JUST NOW',
          isRead: false,
          actionLabel: 'VIEW PASS',
          actionType: 'info',
        },
      ],
    };

    triggerCelebration();
    onAuthSuccess(newAccount);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative max-w-xl w-full bg-[#121214] border border-[#2D2D2E] rounded-[32px] p-6 md:p-8 space-y-6 shadow-2xl my-auto">
        {/* Top Header */}
        <div className="flex justify-between items-start border-b border-[#2D2D2E] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight text-white">
                BIFROST
              </span>
              <span className="font-mono text-[10px] text-[#F6F930] bg-[#F6F930]/10 border border-[#F6F930]/30 px-2 py-0.5 rounded font-bold">
                IDENTITY ENGINE
              </span>
            </div>
            <p className="text-xs text-[#8E9192] mt-1">
              {mode === 'register'
                ? 'Claim your digital conference pass & personalize your summit agenda'
                : 'Sign in to access your saved sessions, badge, and peer network'}
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-[#1A1A1B] text-[#C4C7C8] hover:text-white flex items-center justify-center border border-[#2D2D2E] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* 1-Click Quick Demo Personas */}
        <div className="space-y-2.5 bg-[#18181A] p-3.5 rounded-2xl border border-[#2D2D2E]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#F6F930] uppercase tracking-wider font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              1-Click Demo Personas:
            </span>
            <span className="font-mono text-[9px] text-[#8E9192]">
              Instant test login
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {existingAccounts.slice(0, 5).map((acc) => (
              <button
                key={acc.user.id}
                type="button"
                onClick={() => handleQuickPersonaSelect(acc)}
                className="flex items-center gap-2 p-2 rounded-xl bg-[#201F20] hover:bg-[#2A2A2B] border border-[#2D2D2E] hover:border-[#F6F930]/60 transition-all text-left group"
              >
                <img
                  src={acc.user.avatar}
                  alt={acc.user.name}
                  className="w-7 h-7 rounded-lg object-cover flex-shrink-0 border border-[#2D2D2E]"
                />
                <div className="truncate">
                  <p className="font-bold text-xs text-white group-hover:text-[#F6F930] truncate">
                    {acc.user.name.split(' ')[0]}
                  </p>
                  <p className="font-mono text-[9px] text-[#8E9192] truncate">
                    {acc.user.passType.replace(' ACCESS', '')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[#18181A] p-1 rounded-2xl border border-[#2D2D2E]">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setMode('register');
            }}
            className={`flex-1 py-2.5 font-mono text-xs font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-2 ${
              mode === 'register'
                ? 'bg-[#F6F930] text-[#0F0F10] shadow-md'
                : 'text-[#C4C7C8] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">badge</span>
            Register & Claim Pass
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setMode('signin');
            }}
            className={`flex-1 py-2.5 font-mono text-xs font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-2 ${
              mode === 'signin'
                ? 'bg-[#F6F930] text-[#0F0F10] shadow-md'
                : 'text-[#C4C7C8] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">login</span>
            Sign In Existing
          </button>
        </div>

        {/* Mode: Sign In */}
        {mode === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            {signInError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-[#FFB4AB] text-xs rounded-xl">
                {signInError}
              </div>
            )}

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-[#8E9192] uppercase block">
                WORK EMAIL / ATTENDEE ID
              </label>
              <input
                type="email"
                required
                placeholder="alex.mercer@nexuscorp.io"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                className="w-full bg-[#18181A] border border-[#2D2D2E] focus:border-[#F6F930] rounded-xl px-4 py-2.5 text-white text-sm outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-[#8E9192] uppercase block">
                PASSWORD / ACCESS CODE
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                className="w-full bg-[#18181A] border border-[#2D2D2E] focus:border-[#F6F930] rounded-xl px-4 py-2.5 text-white text-sm outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#F6F930] hover:bg-white text-[#0F0F10] font-mono text-xs font-bold uppercase rounded-xl tracking-wider transition-all active:scale-98 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(246,249,48,0.25)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">key</span>
              Sign In to Summit Pass
            </button>
          </form>
        ) : (
          /* Mode: Register */
          <form onSubmit={handleRegister} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {regError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-[#FFB4AB] text-xs rounded-xl">
                {regError}
              </div>
            )}

            {/* Pass Tier Selection */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-[#8E9192] uppercase block">
                SELECT PASS TIER
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRegPassType('VIP ACCESS')}
                  className={`p-2.5 rounded-xl border text-center font-mono text-xs transition-all ${
                    regPassType === 'VIP ACCESS'
                      ? 'bg-[#F6F930] text-[#0F0F10] border-[#F6F930] font-bold shadow-md'
                      : 'bg-[#18181A] text-[#C4C7C8] border-[#2D2D2E] hover:border-white'
                  }`}
                >
                  <p className="font-extrabold text-xs">VIP ACCESS</p>
                  <p className="text-[9px] opacity-80 mt-0.5">Alpha Level</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRegPassType('SPEAKER')}
                  className={`p-2.5 rounded-xl border text-center font-mono text-xs transition-all ${
                    regPassType === 'SPEAKER'
                      ? 'bg-[#F6F930] text-[#0F0F10] border-[#F6F930] font-bold shadow-md'
                      : 'bg-[#18181A] text-[#C4C7C8] border-[#2D2D2E] hover:border-white'
                  }`}
                >
                  <p className="font-extrabold text-xs">SPEAKER</p>
                  <p className="text-[9px] opacity-80 mt-0.5">Stage & Green</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRegPassType('GENERAL')}
                  className={`p-2.5 rounded-xl border text-center font-mono text-xs transition-all ${
                    regPassType === 'GENERAL'
                      ? 'bg-white text-[#0F0F10] border-white font-bold shadow-md'
                      : 'bg-[#18181A] text-[#C4C7C8] border-[#2D2D2E] hover:border-white'
                  }`}
                >
                  <p className="font-extrabold text-xs">GENERAL</p>
                  <p className="text-[9px] opacity-80 mt-0.5">Main Track</p>
                </button>
              </div>
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-[#8E9192] uppercase block">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kai Nakamura"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-[#18181A] border border-[#2D2D2E] focus:border-[#F6F930] rounded-xl px-3.5 py-2 text-white text-sm outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-[#8E9192] uppercase block">
                  WORK EMAIL *
                </label>
                <input
                  type="email"
                  required
                  placeholder="kai@cybergrid.io"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-[#18181A] border border-[#2D2D2E] focus:border-[#F6F930] rounded-xl px-3.5 py-2 text-white text-sm outline-none"
                />
              </div>
            </div>

            {/* Role & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-[#8E9192] uppercase block">
                  JOB TITLE / ROLE
                </label>
                <input
                  type="text"
                  placeholder="e.g. Staff AI Engineer"
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  className="w-full bg-[#18181A] border border-[#2D2D2E] focus:border-[#F6F930] rounded-xl px-3.5 py-2 text-white text-sm outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-[#8E9192] uppercase block">
                  COMPANY / ORG
                </label>
                <input
                  type="text"
                  placeholder="e.g. CyberGrid Systems"
                  value={regCompany}
                  onChange={(e) => setRegCompany(e.target.value)}
                  className="w-full bg-[#18181A] border border-[#2D2D2E] focus:border-[#F6F930] rounded-xl px-3.5 py-2 text-white text-sm outline-none"
                />
              </div>
            </div>

            {/* Avatar Preset Grid */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-[#8E9192] uppercase block">
                CHOOSE BADGE AVATAR
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {PRESET_AVATARS.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setRegAvatar(av);
                      setRegCustomAvatar('');
                    }}
                    className={`w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      regAvatar === av && !regCustomAvatar
                        ? 'border-[#F6F930] scale-105 shadow-md shadow-[#F6F930]/30'
                        : 'border-[#2D2D2E] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={av} alt="Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <label className="font-mono text-[10px] text-[#8E9192] uppercase block">
                BIO & FOCUS TOPICS (OPTIONAL)
              </label>
              <textarea
                rows={2}
                placeholder="Building distributed LLM runtimes & neural edge pipelines..."
                value={regBio}
                onChange={(e) => setRegBio(e.target.value)}
                className="w-full bg-[#18181A] border border-[#2D2D2E] focus:border-[#F6F930] rounded-xl px-3.5 py-2 text-white text-xs outline-none"
              />
            </div>

            {/* Social handles */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-[#8E9192] uppercase block">
                  LINKEDIN
                </label>
                <input
                  type="text"
                  placeholder="https://linkedin.com/in/..."
                  value={regLinkedin}
                  onChange={(e) => setRegLinkedin(e.target.value)}
                  className="w-full bg-[#18181A] border border-[#2D2D2E] focus:border-[#F6F930] rounded-xl px-3 py-1.5 text-white text-xs outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-[#8E9192] uppercase block">
                  GITHUB / HANDLE
                </label>
                <input
                  type="text"
                  placeholder="@handle"
                  value={regGithub}
                  onChange={(e) => setRegGithub(e.target.value)}
                  className="w-full bg-[#18181A] border border-[#2D2D2E] focus:border-[#F6F930] rounded-xl px-3 py-1.5 text-white text-xs outline-none font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#F6F930] hover:bg-white text-[#0F0F10] font-mono text-xs font-bold uppercase rounded-xl tracking-wider transition-all active:scale-98 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(246,249,48,0.25)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              Generate Digital Pass & Launch App
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
