import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Attendee } from '../types';
import { sound } from '../utils/audio';
import { exportContactVCard } from '../utils/vcard';

interface NetworkViewProps {
  user: Attendee;
  connections: Attendee[];
  onOpenScanner: () => void;
  onOpenPeerProfile: (peer: Attendee) => void;
  onUpdatePeerNotes: (peerId: string, notes: string) => void;
  onRemoveConnection: (peerId: string) => void;
}

export const NetworkView: React.FC<NetworkViewProps> = ({
  user,
  connections,
  onOpenScanner,
  onOpenPeerProfile,
  onUpdatePeerNotes,
  onRemoveConnection,
}) => {
  const [search, setSearch] = useState('');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const filteredConnections = connections.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      (c.notes && c.notes.toLowerCase().includes(q))
    );
  });

  const handleSaveNotes = (peerId: string) => {
    sound.playClick();
    onUpdatePeerNotes(peerId, noteText);
    setEditingNotesId(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2D2D2E] pb-6">
        <div>
          <span className="font-mono text-xs text-[#F6F930] tracking-widest uppercase block mb-1">
            PEER CONTACT EXCHANGE
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Network & Connections
          </h2>
          <p className="text-sm text-[#C4C7C8] mt-1">
            Instantly swap digital badges, save vCards, and review notes with fellow attendees.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onOpenScanner();
          }}
          className="self-start md:self-auto bg-[#F6F930] text-[#0F0F10] font-mono text-xs font-bold px-6 py-3 rounded-full hover:bg-white transition-all duration-200 uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(246,249,48,0.3)] active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
          SCAN PEER QR
        </button>
      </div>

      {/* Bento Grid: My Swap Badge (Left) & Connections Directory (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: My Instant Swap Card */}
        <div className="lg:col-span-5 bg-[#1A1A1B] rounded-[24px] p-6 md:p-8 border border-[#2D2D2E] text-center space-y-6 relative overflow-hidden">
          <div className="space-y-1">
            <span className="font-mono text-[10px] text-[#8E9192] uppercase tracking-widest">
              YOUR INSTANT SWAP QR
            </span>
            <h3 className="text-xl font-bold text-white">{user.name}</h3>
            <p className="text-xs text-[#C4C7C8]">
              {user.role} • {user.company}
            </p>
          </div>

          <div className="inline-block p-4 bg-white rounded-2xl border-2 border-dashed border-[#8E9192] shadow-2xl">
            <QRCodeSVG
              value={user.qrPayload}
              size={180}
              bgColor="#FFFFFF"
              fgColor="#0F0F10"
              level="Q"
              className="w-40 h-40 md:w-44 md:h-44"
            />
          </div>

          <p className="font-mono text-[11px] text-[#8E9192] leading-relaxed">
            Have a peer scan this code to exchange vCard contact details, LinkedIn, and email immediately.
          </p>

          <div className="pt-2">
            <button
              onClick={() => {
                sound.playClick();
                exportContactVCard(user);
              }}
              className="w-full py-2.5 bg-[#201F20] hover:bg-[#2A2A2B] text-white border border-[#444748] rounded-xl font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              Download My vCard
            </button>
          </div>
        </div>

        {/* Right: Saved Connections List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Saved Contacts
              <span className="font-mono text-xs bg-[#201F20] border border-[#2D2D2E] text-[#F6F930] px-2.5 py-0.5 rounded-full">
                {connections.length}
              </span>
            </h3>

            <div className="relative">
              <input
                type="text"
                placeholder="Filter connections..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#1A1A1B] border border-[#2D2D2E] focus:border-[#F6F930] text-xs text-white rounded-xl pl-8 pr-3 py-1.5 outline-none w-full sm:w-56"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-1.5 text-[#8E9192] text-[16px]">
                search
              </span>
            </div>
          </div>

          {filteredConnections.length === 0 ? (
            <div className="bg-[#1A1A1B] rounded-2xl p-10 border border-[#2D2D2E] text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#201F20] flex items-center justify-center mx-auto text-[#8E9192]">
                <span className="material-symbols-outlined text-3xl">person_search</span>
              </div>
              <h4 className="text-lg font-bold text-white">No connections yet</h4>
              <p className="text-xs text-[#C4C7C8] max-w-sm mx-auto">
                Scan another attendee's QR pass or accept incoming connection requests to populate your directory.
              </p>
              <button
                onClick={onOpenScanner}
                className="px-6 py-2.5 bg-white text-[#0F0F10] font-mono text-xs font-bold rounded-full uppercase hover:bg-[#F6F930] transition-colors"
              >
                Scan Peer Code
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredConnections.map((peer) => (
                <div
                  key={peer.id}
                  className="bg-[#1A1A1B] hover:bg-[#201F20] rounded-2xl p-5 border border-[#2D2D2E] hover:border-[#444748] transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      onClick={() => onOpenPeerProfile(peer)}
                      className="flex items-center gap-3.5 cursor-pointer group flex-1 min-w-0"
                    >
                      <img
                        src={peer.avatar}
                        alt={peer.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#2D2D2E] flex-shrink-0"
                      />
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white group-hover:text-[#F6F930] transition-colors truncate">
                            {peer.name}
                          </h4>
                          <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-[#201F20] border border-[#2D2D2E] text-[#C4C7C8]">
                            {peer.passType}
                          </span>
                        </div>
                        <p className="font-mono text-[11px] text-[#8E9192] truncate">
                          {peer.role} • {peer.company}
                        </p>
                      </div>
                    </div>

                    {/* Quick vCard export & profile trigger */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => {
                          sound.playClick();
                          exportContactVCard(peer);
                        }}
                        className="p-2 rounded-xl bg-[#201F20] hover:bg-[#2A2A2B] text-[#C4C7C8] hover:text-white border border-[#2D2D2E] transition-colors"
                        title="Export vCard (.vcf)"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          contact_page
                        </span>
                      </button>

                      {peer.email && (
                        <a
                          href={`mailto:${peer.email}`}
                          className="p-2 rounded-xl bg-[#201F20] hover:bg-[#2A2A2B] text-[#C4C7C8] hover:text-white border border-[#2D2D2E] transition-colors"
                          title="Send Email"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            mail
                          </span>
                        </a>
                      )}

                      <button
                        onClick={() => onOpenPeerProfile(peer)}
                        className="p-2 rounded-xl bg-[#201F20] hover:bg-[#2A2A2B] text-[#C4C7C8] hover:text-white border border-[#2D2D2E] transition-colors"
                        title="View Full Profile"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          visibility
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Notes / Conversation snippet */}
                  <div className="pt-2 border-t border-[#2D2D2E]/60 flex items-center justify-between text-xs">
                    {editingNotesId === peer.id ? (
                      <div className="w-full flex items-center gap-2">
                        <input
                          type="text"
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add private note (e.g. follow up on API)..."
                          className="flex-1 bg-[#0F0F10] border border-[#444748] rounded-lg px-3 py-1 text-white text-xs outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveNotes(peer.id)}
                          className="px-3 py-1 bg-[#F6F930] text-[#0F0F10] font-mono text-[10px] font-bold rounded-lg uppercase"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="px-2 py-1 text-[#8E9192] text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <p className="text-[#8E9192] text-[11px] truncate mr-2 italic">
                          {peer.notes ? `"${peer.notes}"` : 'No notes added.'}
                        </p>
                        <button
                          onClick={() => {
                            setEditingNotesId(peer.id);
                            setNoteText(peer.notes || '');
                          }}
                          className="font-mono text-[10px] text-[#C4C7C8] hover:text-[#F6F930] uppercase flex-shrink-0 flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[12px]">edit</span>
                          Note
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
