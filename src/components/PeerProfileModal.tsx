import React, { useState } from 'react';
import { Attendee } from '../types';
import { sound } from '../utils/audio';
import { exportContactVCard } from '../utils/vcard';

interface PeerProfileModalProps {
  peer: Attendee | null;
  isOpen: boolean;
  onClose: () => void;
  isSavedConnection: boolean;
  onToggleSaveConnection: (peer: Attendee) => void;
  onUpdateNotes: (peerId: string, notes: string) => void;
}

export const PeerProfileModal: React.FC<PeerProfileModalProps> = ({
  peer,
  isOpen,
  onClose,
  isSavedConnection,
  onToggleSaveConnection,
  onUpdateNotes,
}) => {
  const [note, setNote] = useState(peer?.notes || '');
  const [savedNoteSuccess, setSavedNoteSuccess] = useState(false);

  if (!isOpen || !peer) return null;

  const handleSaveNote = () => {
    sound.playClick();
    onUpdateNotes(peer.id, note);
    setSavedNoteSuccess(true);
    setTimeout(() => setSavedNoteSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative max-w-md w-full bg-[#1A1A1B] border border-[#2D2D2E] rounded-[32px] p-6 md:p-8 space-y-6 shadow-2xl my-auto">
        {/* Header & Close */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#F6F930] bg-[#F6F930]/10 border border-[#F6F930]/30 px-2.5 py-0.5 rounded-full uppercase font-bold">
              {peer.passType}
            </span>
            <span className="font-mono text-xs text-[#8E9192]">
              {peer.id}
            </span>
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

        {/* Profile Card Center */}
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <img
              src={peer.avatar}
              alt={peer.name}
              className="w-24 h-24 rounded-3xl object-cover mx-auto border-2 border-[#F6F930]/40 shadow-xl"
            />
            <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#1A1A1B]" title="Active at Summit"></span>
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              {peer.name}
            </h3>
            <p className="text-sm font-semibold text-[#F6F930]">
              {peer.role}
            </p>
            <p className="text-xs text-[#C4C7C8] font-mono mt-0.5">
              {peer.company}
            </p>
          </div>
        </div>

        {/* Bio */}
        {peer.bio && (
          <div className="bg-[#141415] rounded-2xl p-4 border border-[#2D2D2E] text-xs text-[#C4C7C8] leading-relaxed">
            <span className="font-mono text-[10px] text-[#8E9192] uppercase tracking-wider block mb-1">
              ABOUT
            </span>
            {peer.bio}
          </div>
        )}

        {/* Quick Social & Contact Channels */}
        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
          {peer.email && (
            <a
              href={`mailto:${peer.email}`}
              className="p-3 bg-[#201F20] hover:bg-[#2A2A2B] text-white border border-[#2D2D2E] rounded-xl flex items-center gap-2 transition-colors truncate"
            >
              <span className="material-symbols-outlined text-[#F6F930] text-[18px]">
                mail
              </span>
              <span className="truncate">Email</span>
            </a>
          )}

          {peer.linkedin && (
            <a
              href={peer.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#201F20] hover:bg-[#2A2A2B] text-white border border-[#2D2D2E] rounded-xl flex items-center gap-2 transition-colors truncate"
            >
              <span className="material-symbols-outlined text-[#F6F930] text-[18px]">
                share
              </span>
              <span className="truncate">LinkedIn</span>
            </a>
          )}
        </div>

        {/* Private Meeting Notes */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] text-[#8E9192] uppercase tracking-wider">
              YOUR PRIVATE MEETING NOTES
            </span>
            {savedNoteSuccess && (
              <span className="font-mono text-[10px] text-[#F6F930]">Saved!</span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Discussed AI agent infra partnership..."
              className="flex-1 bg-[#141415] border border-[#2D2D2E] focus:border-[#F6F930] rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
            />
            <button
              onClick={handleSaveNote}
              className="px-3 py-2 bg-[#201F20] hover:bg-[#2A2A2B] text-white rounded-xl font-mono text-xs uppercase border border-[#2D2D2E]"
            >
              Save
            </button>
          </div>
        </div>

        {/* Primary Action Buttons: Save Connection & Export vCard */}
        <div className="space-y-2 pt-2 border-t border-[#2D2D2E]">
          <button
            onClick={() => {
              sound.playSuccess();
              onToggleSaveConnection(peer);
            }}
            className={`w-full py-3.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${
              isSavedConnection
                ? 'bg-[#201F20] text-[#F6F930] border border-[#F6F930]/40'
                : 'bg-[#F6F930] text-[#0F0F10] hover:bg-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSavedConnection ? 'how_to_reg' : 'person_add'}
            </span>
            {isSavedConnection ? 'In Your Network (Saved)' : 'Add to My Network'}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              exportContactVCard(peer);
            }}
            className="w-full py-2.5 bg-transparent hover:bg-[#201F20] text-[#C4C7C8] hover:text-white rounded-xl font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-transparent hover:border-[#2D2D2E] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Download vCard (.vcf)
          </button>
        </div>
      </div>
    </div>
  );
};
