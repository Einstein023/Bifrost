import React, { useState } from 'react';
import { Attendee } from '../types';
import { sound } from '../utils/audio';
import { exportContactVCard } from '../utils/vcard';

interface ProfileViewProps {
  user: Attendee;
  onUpdateUser: (updatedUser: Attendee) => void;
  onOpenPassModal: () => void;
  onNavigateToConsole: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  onOpenPassModal,
  onNavigateToConsole,
}) => {
  const [formData, setFormData] = useState<Attendee>({ ...user });
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    onUpdateUser(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleRoleToggle = (passType: Attendee['passType']) => {
    sound.playClick();
    const updated = {
      ...user,
      passType,
      accessLevel: (passType === 'VIP ACCESS' ? 'Alpha' : passType === 'SPEAKER' ? 'Speaker' : 'General') as any,
    };
    setFormData(updated);
    onUpdateUser(updated);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2D2D2E] pb-6">
        <div>
          <span className="font-mono text-xs text-[#F6F930] tracking-widest uppercase block mb-1">
            ATTENDEE SETTINGS
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Digital Pass & Profile
          </h2>
          <p className="text-sm text-[#C4C7C8] mt-1">
            Manage your credentials, peer contact swap card, and conference preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPassModal}
            className="px-5 py-2.5 bg-[#F6F930] text-[#0F0F10] font-mono text-xs font-bold uppercase rounded-full hover:bg-white transition-colors flex items-center gap-2 shadow-md"
          >
            <span className="material-symbols-outlined text-[16px]">qr_code</span>
            Show Pass
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-[#F6F930]/10 border border-[#F6F930]/40 text-[#F6F930] p-4 rounded-2xl font-mono text-xs flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          Profile & Digital Pass successfully updated!
        </div>
      )}

      {/* Grid: Overview Bento Card & Edit Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Pass preview & quick actions */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-[#1A1A1B] rounded-[24px] p-6 border border-[#2D2D2E] text-center space-y-4 relative overflow-hidden">
            <div className="relative inline-block">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-3xl object-cover mx-auto border-2 border-[#F6F930]/50 shadow-xl"
              />
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#1A1A1B]"></span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">{user.name}</h3>
              <p className="font-mono text-xs text-[#F6F930]">{user.role}</p>
              <p className="text-xs text-[#8E9192]">{user.company}</p>
            </div>

            <div className="pt-2 flex flex-wrap justify-center gap-1.5 font-mono text-[10px]">
              <span className="px-2.5 py-1 rounded bg-[#201F20] border border-[#2D2D2E] text-[#C4C7C8]">
                ID: {user.id}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#F6F930]/10 border border-[#F6F930]/40 text-[#F6F930] font-bold">
                {user.passType}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#201F20] border border-[#2D2D2E] text-white">
                LEVEL: {user.accessLevel}
              </span>
            </div>

            {/* Role switch simulation */}
            <div className="pt-4 border-t border-[#2D2D2E] space-y-2">
              <span className="font-mono text-[10px] text-[#8E9192] uppercase block">
                Simulate Badge Tier:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleRoleToggle('VIP ACCESS')}
                  className={`py-1.5 rounded-lg font-mono text-[10px] font-bold uppercase transition-all ${
                    user.passType === 'VIP ACCESS'
                      ? 'bg-[#F6F930] text-[#0F0F10]'
                      : 'bg-[#201F20] text-[#8E9192] hover:text-white'
                  }`}
                >
                  VIP
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleToggle('SPEAKER')}
                  className={`py-1.5 rounded-lg font-mono text-[10px] font-bold uppercase transition-all ${
                    user.passType === 'SPEAKER'
                      ? 'bg-[#F6F930] text-[#0F0F10]'
                      : 'bg-[#201F20] text-[#8E9192] hover:text-white'
                  }`}
                >
                  Speaker
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleToggle('GENERAL')}
                  className={`py-1.5 rounded-lg font-mono text-[10px] font-bold uppercase transition-all ${
                    user.passType === 'GENERAL'
                      ? 'bg-white text-[#0F0F10]'
                      : 'bg-[#201F20] text-[#8E9192] hover:text-white'
                  }`}
                >
                  General
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  exportContactVCard(user);
                }}
                className="w-full py-2.5 bg-[#201F20] hover:bg-[#2A2A2B] text-white border border-[#2D2D2E] rounded-xl font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Export My vCard
              </button>
            </div>
          </div>

          {/* Organizer Console Quick Access */}
          <div className="bg-[#1A1A1B] rounded-2xl p-5 border border-[#2D2D2E] space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F6F930]/10 flex items-center justify-center text-[#F6F930]">
                <span className="material-symbols-outlined text-2xl">badge</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase font-mono">
                  Event Staff / Operator Mode
                </h4>
                <p className="text-xs text-[#8E9192]">
                  Access entrance check-in & capacity HUD
                </p>
              </div>
            </div>

            <button
              onClick={onNavigateToConsole}
              className="w-full py-2.5 bg-[#201F20] hover:bg-[#F6F930] hover:text-[#0F0F10] text-[#F6F930] border border-[#F6F930]/30 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              Open Staff Console
            </button>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="md:col-span-7 bg-[#1A1A1B] rounded-[24px] p-6 md:p-8 border border-[#2D2D2E] space-y-6">
          <div className="flex justify-between items-center border-b border-[#2D2D2E] pb-4">
            <h3 className="text-xl font-bold text-white">Contact & Pass Data</h3>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="font-mono text-xs text-[#F6F930] hover:underline uppercase"
            >
              {isEditing ? 'Cancel' : 'Edit Info'}
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[10px] text-[#8E9192] uppercase block mb-1">
                  FULL NAME
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0F0F10] border border-[#2D2D2E] focus:border-[#F6F930] disabled:opacity-60 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] text-[#8E9192] uppercase block mb-1">
                  COMPANY / ORG
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-[#0F0F10] border border-[#2D2D2E] focus:border-[#F6F930] disabled:opacity-60 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[10px] text-[#8E9192] uppercase block mb-1">
                  ROLE / TITLE
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-[#0F0F10] border border-[#2D2D2E] focus:border-[#F6F930] disabled:opacity-60 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] text-[#8E9192] uppercase block mb-1">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#0F0F10] border border-[#2D2D2E] focus:border-[#F6F930] disabled:opacity-60 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[10px] text-[#8E9192] uppercase block mb-1">
                  LINKEDIN PROFILE
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.linkedin || ''}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="w-full bg-[#0F0F10] border border-[#2D2D2E] focus:border-[#F6F930] disabled:opacity-60 rounded-xl px-4 py-2.5 text-white text-sm outline-none font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] text-[#8E9192] uppercase block mb-1">
                  GITHUB / HANDLE
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.github || ''}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  className="w-full bg-[#0F0F10] border border-[#2D2D2E] focus:border-[#F6F930] disabled:opacity-60 rounded-xl px-4 py-2.5 text-white text-sm outline-none font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] text-[#8E9192] uppercase block mb-1">
                BIO / FOCUS AREAS
              </label>
              <textarea
                rows={3}
                disabled={!isEditing}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-[#0F0F10] border border-[#2D2D2E] focus:border-[#F6F930] disabled:opacity-60 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
              />
            </div>

            {isEditing && (
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#201F20] text-[#C4C7C8] font-mono text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#F6F930] text-[#0F0F10] font-mono text-xs font-bold uppercase hover:bg-white transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
