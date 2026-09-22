import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Attendee } from '../types';
import { sound } from '../utils/audio';
import { exportContactVCard } from '../utils/vcard';

interface NetworkViewProps {
  user: Attendee;
  connections: Attendee[]; // Current friends & saved contacts
  allAttendees: Attendee[];
  pendingReceived: Attendee[];
  pendingSent: Attendee[];
  onOpenScanner: () => void;
  onOpenPeerProfile: (peer: Attendee) => void;
  onUpdatePeerNotes: (peerId: string, notes: string) => void;
  onRemoveConnection: (peerId: string) => void;
  onSendFriendRequest: (peer: Attendee) => void;
  onAcceptFriendRequest: (peer: Attendee) => void;
  onDeclineFriendRequest: (peerId: string) => void;
  onTriggerProximityAlert: (type: 'same_room' | 'venue_arrival' | 'wave_received', friend: Attendee) => void;
}

export const NetworkView: React.FC<NetworkViewProps> = ({
  user,
  connections,
  allAttendees,
  pendingReceived,
  pendingSent,
  onOpenScanner,
  onOpenPeerProfile,
  onUpdatePeerNotes,
  onRemoveConnection,
  onSendFriendRequest,
  onAcceptFriendRequest,
  onDeclineFriendRequest,
  onTriggerProximityAlert,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'friends' | 'find' | 'requests' | 'my_qr'>('friends');
  const [search, setSearch] = useState('');
  const [directoryFilter, setDirectoryFilter] = useState<'all' | 'company' | 'speakers' | 'same_room'>('all');
  const [idLookupInput, setIdLookupInput] = useState('');
  const [idLookupResult, setIdLookupResult] = useState<{ found?: Attendee; error?: string } | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [wavedFriendId, setWavedFriendId] = useState<string | null>(null);
  const [pingedFriendId, setPingedFriendId] = useState<string | null>(null);

  // Identify friends in the same room as the current user
  const userRoom = user.currentRoom || 'Main Stage';
  const friendsInSameRoom = connections.filter(
    (c) => c.currentRoom && c.currentRoom.toLowerCase() === userRoom.toLowerCase()
  );
  const otherFriendsInVenue = connections.filter(
    (c) => !c.currentRoom || c.currentRoom.toLowerCase() !== userRoom.toLowerCase()
  );

  // Filter friends list
  const filteredFriends = connections.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      (c.currentRoom && c.currentRoom.toLowerCase().includes(q)) ||
      (c.notes && c.notes.toLowerCase().includes(q))
    );
  });

  // Filter full attendee directory for "Find Friends"
  const filteredDirectory = allAttendees
    .filter((att) => att.id !== user.id)
    .filter((att) => {
      // Exclude already connected friends
      const isAlreadyFriend = connections.some((c) => c.id === att.id);
      if (directoryFilter === 'all') return true;
      if (directoryFilter === 'company') return att.company === user.company;
      if (directoryFilter === 'speakers') return att.passType === 'SPEAKER' || att.accessLevel === 'Speaker';
      if (directoryFilter === 'same_room') return att.currentRoom === userRoom;
      return true;
    })
    .filter((att) => {
      const q = search.toLowerCase();
      if (!q) return true;
      return (
        att.name.toLowerCase().includes(q) ||
        att.company.toLowerCase().includes(q) ||
        att.role.toLowerCase().includes(q) ||
        att.id.toLowerCase().includes(q)
      );
    });

  const handleSaveNotes = (peerId: string) => {
    sound.playClick();
    onUpdatePeerNotes(peerId, noteText);
    setEditingNotesId(null);
  };

  const handleWave = (friend: Attendee) => {
    sound.playWave();
    setWavedFriendId(friend.id);
    setTimeout(() => setWavedFriendId(null), 3000);
  };

  const handlePing = (friend: Attendee) => {
    sound.playSuccess();
    setPingedFriendId(friend.id);
    setTimeout(() => setPingedFriendId(null), 3500);
  };

  const handleIdLookup = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    const query = idLookupInput.trim().toUpperCase();
    if (!query) return;

    const match = allAttendees.find(
      (a) => a.id.toUpperCase() === query || a.email.toLowerCase() === query.toLowerCase()
    );

    if (match) {
      if (match.id === user.id) {
        setIdLookupResult({ error: "That's your own attendee ID!" });
      } else {
        setIdLookupResult({ found: match });
      }
    } else {
      setIdLookupResult({ error: `No attendee found with ID or email "${idLookupInput}". Try #BF-8492 or #GA-4011` });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2D2D2E] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-[#F6F930] tracking-widest uppercase">
              CONFERENCE FRIEND NETWORK
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ade80]"></span>
            </span>
            <span className="font-mono text-[10px] text-[#4ade80] uppercase tracking-wider">
              LIVE VENUE RADAR ACTIVE
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Friends & Networking
          </h2>
          <p className="text-sm text-[#C4C7C8] mt-1 max-w-2xl">
            Get automatically notified when your friends are in the same room or enter the summit. Add peers via directory search, badge scan, or attendee code.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              sound.playClick();
              setActiveSubTab('find');
            }}
            className="bg-[#201F20] hover:bg-[#2A2A2B] text-white border border-[#444748] font-mono text-xs font-semibold px-4 py-2.5 rounded-full uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#F6F930]">person_add</span>
            Add Friends
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenScanner();
            }}
            className="bg-[#F6F930] hover:bg-white text-[#0F0F10] font-mono text-xs font-bold px-5 py-2.5 rounded-full uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(246,249,48,0.25)] active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
            Scan Badge
          </button>
        </div>
      </div>

      {/* Live Conference Friends Radar Banner */}
      <div className="bg-gradient-to-r from-[#18181A] via-[#1E1E22] to-[#18181A] rounded-2xl md:rounded-3xl p-5 md:p-6 border border-[#2D2D2E] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F6F930] animate-pulse"></span>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Your Location: <span className="text-[#F6F930]">{userRoom}</span>
              </h3>
            </div>
            <p className="text-xs md:text-sm text-[#C4C7C8] leading-relaxed">
              {friendsInSameRoom.length > 0 ? (
                <>
                  <strong className="text-white font-semibold">
                    {friendsInSameRoom.length} {friendsInSameRoom.length === 1 ? 'friend is' : 'friends are'} in this room with you right now!
                  </strong>{' '}
                  ({friendsInSameRoom.map((f) => f.name).join(', ')})
                </>
              ) : (
                'No friends detected in this room yet. Connect with attendees or ping a friend to join you.'
              )}
            </p>
          </div>

          {/* Quick Proximity Simulation Triggers */}
          <div className="bg-[#121214] p-3 rounded-2xl border border-[#2D2D2E] flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] text-[#8E9192] uppercase tracking-wider block w-full mb-1">
              TEST REAL-TIME NOTIFICATIONS:
            </span>
            <button
              onClick={() => {
                const friend = connections[0] || allAttendees[0];
                onTriggerProximityAlert('same_room', friend);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#201F20] hover:bg-[#2A2A2B] text-white border border-[#444748] font-mono text-[10px] uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Simulate friend walking into your room"
            >
              <span className="material-symbols-outlined text-[13px] text-[#F6F930]">bolt</span>
              Friend in Same Room
            </button>

            <button
              onClick={() => {
                const friend = connections[1] || allAttendees[1];
                onTriggerProximityAlert('venue_arrival', friend);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#201F20] hover:bg-[#2A2A2B] text-white border border-[#444748] font-mono text-[10px] uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Simulate friend arriving at the summit"
            >
              <span className="material-symbols-outlined text-[13px] text-[#4ade80]">sensors</span>
              Friend Checked In
            </button>

            <button
              onClick={() => {
                const friend = connections[0] || allAttendees[0];
                onTriggerProximityAlert('wave_received', friend);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#201F20] hover:bg-[#2A2A2B] text-white border border-[#444748] font-mono text-[10px] uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Simulate a friend waving to you"
            >
              <span className="material-symbols-outlined text-[13px] text-[#F6F930]">waving_hand</span>
              Wave Received
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2D2D2E] pb-3 overflow-x-auto">
        <button
          onClick={() => {
            sound.playClick();
            setActiveSubTab('friends');
          }}
          className={`font-mono text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'friends'
              ? 'bg-white text-[#0F0F10] font-bold shadow'
              : 'text-[#C4C7C8] hover:text-white hover:bg-[#1A1A1B]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">group</span>
          MY FRIENDS ({connections.length})
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveSubTab('find');
          }}
          className={`font-mono text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'find'
              ? 'bg-white text-[#0F0F10] font-bold shadow'
              : 'text-[#C4C7C8] hover:text-white hover:bg-[#1A1A1B]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">person_search</span>
          FIND & ADD FRIENDS
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveSubTab('requests');
          }}
          className={`font-mono text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap relative ${
            activeSubTab === 'requests'
              ? 'bg-white text-[#0F0F10] font-bold shadow'
              : 'text-[#C4C7C8] hover:text-white hover:bg-[#1A1A1B]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">mail</span>
          REQUESTS
          {pendingReceived.length > 0 && (
            <span className="w-5 h-5 bg-[#F6F930] text-[#0F0F10] text-[10px] font-bold rounded-full flex items-center justify-center">
              {pendingReceived.length}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveSubTab('my_qr');
          }}
          className={`font-mono text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'my_qr'
              ? 'bg-white text-[#0F0F10] font-bold shadow'
              : 'text-[#C4C7C8] hover:text-white hover:bg-[#1A1A1B]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">qr_code</span>
          MY FRIEND PASS QR
        </button>
      </div>

      {/* TAB 1: MY FRIENDS LIST */}
      {activeSubTab === 'friends' && (
        <div className="space-y-6">
          {/* Search bar & filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search friends by name, company, or room..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#1A1A1B] border border-[#2D2D2E] focus:border-[#F6F930] text-xs text-white rounded-xl pl-9 pr-3 py-2.5 outline-none transition-colors"
              />
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#8E9192] text-[18px]">
                search
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-[#8E9192]">
                {filteredFriends.length} friends connected
              </span>
            </div>
          </div>

          {filteredFriends.length === 0 ? (
            <div className="bg-[#1A1A1B] rounded-2xl p-12 border border-[#2D2D2E] text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#201F20] flex items-center justify-center mx-auto text-[#8E9192]">
                <span className="material-symbols-outlined text-3xl">people_outline</span>
              </div>
              <h4 className="text-xl font-bold text-white">No friends connected yet</h4>
              <p className="text-xs text-[#C4C7C8] max-w-md mx-auto leading-relaxed">
                Add friends at the conference to automatically receive alerts when you are sitting in the same session or nearby in the venue!
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveSubTab('find')}
                  className="px-6 py-2.5 bg-[#F6F930] text-[#0F0F10] font-mono text-xs font-bold rounded-full uppercase hover:bg-white transition-colors"
                >
                  Find Attendees
                </button>
                <button
                  onClick={onOpenScanner}
                  className="px-6 py-2.5 bg-[#201F20] text-white border border-[#444748] font-mono text-xs rounded-full uppercase hover:bg-[#2A2A2B] transition-colors"
                >
                  Scan QR Pass
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFriends.map((peer) => {
                const isSameRoom =
                  peer.currentRoom &&
                  peer.currentRoom.toLowerCase() === userRoom.toLowerCase();
                const isWaved = wavedFriendId === peer.id;
                const isPinged = pingedFriendId === peer.id;

                return (
                  <div
                    key={peer.id}
                    className={`rounded-2xl p-5 border transition-all space-y-3.5 relative overflow-hidden ${
                      isSameRoom
                        ? 'bg-[#18181A] border-[#F6F930]/80 shadow-[0_0_20px_rgba(246,249,48,0.1)]'
                        : 'bg-[#1A1A1B] hover:bg-[#201F20] border-[#2D2D2E] hover:border-[#444748]'
                    }`}
                  >
                    {/* Top row: Avatar + details */}
                    <div className="flex items-start justify-between gap-3">
                      <div
                        onClick={() => onOpenPeerProfile(peer)}
                        className="flex items-center gap-3.5 cursor-pointer group flex-1 min-w-0"
                      >
                        <div className="relative flex-shrink-0">
                          <img
                            src={peer.avatar}
                            alt={peer.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#2D2D2E]"
                          />
                          <span
                            className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#1A1A1B] ${
                              isSameRoom ? 'bg-[#F6F930]' : 'bg-[#4ade80]'
                            }`}
                          />
                        </div>

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

                      {/* Quick profile link */}
                      <button
                        onClick={() => onOpenPeerProfile(peer)}
                        className="p-1.5 rounded-xl bg-[#201F20] hover:bg-[#2A2A2B] text-[#C4C7C8] hover:text-white border border-[#2D2D2E] transition-colors"
                        title="View Full Profile"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                      </button>
                    </div>

                    {/* Room Presence Badge */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-mono text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                            isSameRoom
                              ? 'bg-[#F6F930] text-[#0F0F10]'
                              : 'bg-[#201F20] text-[#4ade80] border border-[#4ade80]/30'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {isSameRoom ? 'bolt' : 'location_on'}
                          </span>
                          {isSameRoom ? `IN SAME ROOM: ${peer.currentRoom}` : peer.currentRoom || 'In Summit'}
                        </span>

                        {peer.statusMessage && (
                          <span className="text-[11px] text-[#8E9192] italic truncate max-w-[200px]">
                            "{peer.statusMessage}"
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Interaction Buttons: Wave, Ping, vCard */}
                    <div className="flex items-center gap-2 pt-2 border-t border-[#2D2D2E]/60 flex-wrap">
                      {isWaved ? (
                        <span className="font-mono text-[11px] text-[#F6F930] bg-[#F6F930]/10 border border-[#F6F930]/30 px-3 py-1 rounded-lg flex items-center gap-1 animate-pulse">
                          <span className="material-symbols-outlined text-[14px]">waving_hand</span>
                          Waved!
                        </span>
                      ) : (
                        <button
                          onClick={() => handleWave(peer)}
                          className="px-3 py-1 bg-[#201F20] hover:bg-[#F6F930] hover:text-[#0F0F10] text-[#C4C7C8] border border-[#2D2D2E] rounded-lg font-mono text-[11px] uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">waving_hand</span>
                          Wave 👋
                        </button>
                      )}

                      {isPinged ? (
                        <span className="font-mono text-[11px] text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/30 px-3 py-1 rounded-lg flex items-center gap-1 animate-pulse">
                          <span className="material-symbols-outlined text-[14px]">check</span>
                          Ping sent!
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePing(peer)}
                          className="px-3 py-1 bg-[#201F20] hover:bg-[#2A2A2B] text-[#C4C7C8] hover:text-white border border-[#2D2D2E] rounded-lg font-mono text-[11px] uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">coffee</span>
                          Meet for Coffee
                        </button>
                      )}

                      <button
                        onClick={() => {
                          sound.playClick();
                          exportContactVCard(peer);
                        }}
                        className="px-2.5 py-1 bg-[#201F20] hover:bg-[#2A2A2B] text-[#8E9192] hover:text-white border border-[#2D2D2E] rounded-lg font-mono text-[11px] uppercase flex items-center gap-1 transition-colors cursor-pointer"
                        title="Export vCard (.vcf)"
                      >
                        <span className="material-symbols-outlined text-[14px]">download</span>
                        vCard
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Remove ${peer.name} from your conference friends?`)) {
                            sound.playClick();
                            onRemoveConnection(peer.id);
                          }
                        }}
                        className="ml-auto text-[#8E9192] hover:text-red-400 p-1 transition-colors"
                        title="Remove Friend"
                      >
                        <span className="material-symbols-outlined text-[16px]">person_remove</span>
                      </button>
                    </div>

                    {/* Private note row */}
                    <div className="text-xs pt-1">
                      {editingNotesId === peer.id ? (
                        <div className="w-full flex items-center gap-2">
                          <input
                            type="text"
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Add private note..."
                            className="flex-1 bg-[#0F0F10] border border-[#444748] rounded-lg px-2.5 py-1 text-white text-xs outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveNotes(peer.id)}
                            className="px-2.5 py-1 bg-[#F6F930] text-[#0F0F10] font-mono text-[10px] font-bold rounded-lg uppercase cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingNotesId(null)}
                            className="px-2 py-1 text-[#8E9192] text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <p className="text-[#8E9192] text-[11px] truncate mr-2">
                            {peer.notes ? `Note: "${peer.notes}"` : 'No private notes.'}
                          </p>
                          <button
                            onClick={() => {
                              setEditingNotesId(peer.id);
                              setNoteText(peer.notes || '');
                            }}
                            className="font-mono text-[10px] text-[#C4C7C8] hover:text-[#F6F930] uppercase flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[12px]">edit</span>
                            Note
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FIND & ADD FRIENDS (DIRECTORY & CODE LOOKUP) */}
      {activeSubTab === 'find' && (
        <div className="space-y-8">
          {/* Quick ID / Email Lookup Bar */}
          <div className="bg-[#1A1A1B] rounded-2xl p-6 border border-[#2D2D2E] space-y-4">
            <div>
              <span className="font-mono text-[10px] text-[#F6F930] uppercase tracking-wider">
                DIRECT ADD BY BADGE CODE OR EMAIL
              </span>
              <h3 className="text-lg font-bold text-white">Know their Attendee ID?</h3>
              <p className="text-xs text-[#C4C7C8]">
                Every summit attendee has an ID on their pass (e.g. <span className="font-mono text-white">#BF-8492</span>, <span className="font-mono text-white">#GA-4011</span>, or their email address).
              </p>
            </div>

            <form onSubmit={handleIdLookup} className="flex gap-2 max-w-xl">
              <input
                type="text"
                value={idLookupInput}
                onChange={(e) => {
                  setIdLookupInput(e.target.value);
                  setIdLookupResult(null);
                }}
                placeholder="Enter Attendee ID (e.g. #BF-8492) or email..."
                className="flex-1 bg-[#0F0F10] border border-[#2D2D2E] focus:border-[#F6F930] rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
              <button
                type="submit"
                className="bg-[#F6F930] hover:bg-white text-[#0F0F10] font-mono text-xs font-bold px-5 py-2.5 rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
              >
                Find & Add
              </button>
            </form>

            {idLookupResult?.error && (
              <p className="text-xs text-red-400 font-mono">{idLookupResult.error}</p>
            )}

            {idLookupResult?.found && (
              <div className="p-4 bg-[#201F20] rounded-xl border border-[#444748] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={idLookupResult.found.avatar}
                    alt={idLookupResult.found.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <h5 className="font-bold text-white text-sm">
                      {idLookupResult.found.name}
                    </h5>
                    <p className="text-xs text-[#8E9192]">
                      {idLookupResult.found.role} • {idLookupResult.found.company}
                    </p>
                  </div>
                </div>

                {connections.some((c) => c.id === idLookupResult.found?.id) ? (
                  <span className="font-mono text-xs text-[#4ade80] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Already Friends
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      sound.playSuccess();
                      onSendFriendRequest(idLookupResult.found!);
                      setIdLookupResult(null);
                      setIdLookupInput('');
                    }}
                    className="px-4 py-2 bg-[#F6F930] text-[#0F0F10] font-mono text-xs font-bold rounded-xl uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
                  >
                    + Add as Friend
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Directory Search & Filters */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-white">Conference Attendee Directory</h3>
                <p className="text-xs text-[#C4C7C8]">Browse fellow attendees and add them to your conference radar.</p>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setDirectoryFilter('all')}
                  className={`font-mono text-[11px] px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    directoryFilter === 'all'
                      ? 'bg-white text-[#0F0F10] font-bold'
                      : 'bg-[#1A1A1B] text-[#C4C7C8] hover:text-white border border-[#2D2D2E]'
                  }`}
                >
                  All (2,500+)
                </button>
                <button
                  onClick={() => setDirectoryFilter('company')}
                  className={`font-mono text-[11px] px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    directoryFilter === 'company'
                      ? 'bg-white text-[#0F0F10] font-bold'
                      : 'bg-[#1A1A1B] text-[#C4C7C8] hover:text-white border border-[#2D2D2E]'
                  }`}
                >
                  Colleagues ({user.company})
                </button>
                <button
                  onClick={() => setDirectoryFilter('speakers')}
                  className={`font-mono text-[11px] px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    directoryFilter === 'speakers'
                      ? 'bg-white text-[#0F0F10] font-bold'
                      : 'bg-[#1A1A1B] text-[#C4C7C8] hover:text-white border border-[#2D2D2E]'
                  }`}
                >
                  Speakers
                </button>
                <button
                  onClick={() => setDirectoryFilter('same_room')}
                  className={`font-mono text-[11px] px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    directoryFilter === 'same_room'
                      ? 'bg-white text-[#0F0F10] font-bold'
                      : 'bg-[#1A1A1B] text-[#C4C7C8] hover:text-white border border-[#2D2D2E]'
                  }`}
                >
                  In My Room ({userRoom})
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Filter attendees by name, title, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#1A1A1B] border border-[#2D2D2E] focus:border-[#F6F930] text-xs text-white rounded-xl pl-9 pr-3 py-2.5 outline-none"
              />
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#8E9192] text-[18px]">
                search
              </span>
            </div>

            {/* Attendees Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDirectory.map((attendee) => {
                const isFriend = connections.some((c) => c.id === attendee.id);
                const isPendingSent = pendingSent.some((p) => p.id === attendee.id);
                const isPendingReceived = pendingReceived.some((p) => p.id === attendee.id);

                return (
                  <div
                    key={attendee.id}
                    className="bg-[#1A1A1B] hover:bg-[#201F20] rounded-2xl p-5 border border-[#2D2D2E] hover:border-[#444748] transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start gap-3">
                        <img
                          src={attendee.avatar}
                          alt={attendee.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#2D2D2E] flex-shrink-0"
                        />
                        <div className="truncate">
                          <h4 className="font-bold text-white text-sm truncate">
                            {attendee.name}
                          </h4>
                          <p className="font-mono text-[11px] text-[#8E9192] truncate">
                            {attendee.role}
                          </p>
                          <p className="text-[11px] text-[#C4C7C8] font-medium truncate">
                            {attendee.company}
                          </p>
                        </div>
                      </div>

                      {attendee.currentRoom && (
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-[#8E9192]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]"></span>
                          <span>Located at: <strong className="text-white font-normal">{attendee.currentRoom}</strong></span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#2D2D2E] flex items-center justify-between gap-2">
                      <button
                        onClick={() => onOpenPeerProfile(attendee)}
                        className="text-xs text-[#8E9192] hover:text-white transition-colors"
                      >
                        View Info
                      </button>

                      {isFriend ? (
                        <span className="font-mono text-xs text-[#4ade80] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px]">check_circle</span>
                          Friends
                        </span>
                      ) : isPendingSent ? (
                        <span className="font-mono text-[10px] text-[#F6F930] bg-[#F6F930]/10 border border-[#F6F930]/30 px-3 py-1 rounded-full">
                          Request Sent
                        </span>
                      ) : isPendingReceived ? (
                        <button
                          onClick={() => {
                            sound.playSuccess();
                            onAcceptFriendRequest(attendee);
                          }}
                          className="px-3 py-1 bg-[#F6F930] text-[#0F0F10] font-mono text-[11px] font-bold rounded-full uppercase hover:bg-white transition-colors cursor-pointer"
                        >
                          Accept Request
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            sound.playSuccess();
                            onSendFriendRequest(attendee);
                          }}
                          className="px-3.5 py-1.5 bg-white hover:bg-[#F6F930] text-[#0F0F10] font-mono text-[11px] font-bold rounded-full uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">person_add</span>
                          + Add Friend
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FRIEND REQUESTS */}
      {activeSubTab === 'requests' && (
        <div className="space-y-6">
          <div className="bg-[#1A1A1B] rounded-2xl p-6 border border-[#2D2D2E] space-y-4">
            <h3 className="text-xl font-bold text-white">Pending Incoming Friend Requests</h3>
            <p className="text-xs text-[#C4C7C8]">
              Accepting friend requests allows you to be alerted when you are attending the same sessions or are nearby at the venue.
            </p>

            {pendingReceived.length === 0 ? (
              <div className="py-8 text-center text-[#8E9192]">
                <span className="material-symbols-outlined text-3xl mb-1">mark_email_read</span>
                <p className="font-mono text-xs uppercase">No pending friend requests</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingReceived.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 bg-[#201F20] rounded-xl border border-[#2D2D2E] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={req.avatar}
                        alt={req.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-white text-base">{req.name}</h4>
                        <p className="text-xs text-[#8E9192]">
                          {req.role} • {req.company}
                        </p>
                        {req.currentRoom && (
                          <span className="font-mono text-[10px] text-[#F6F930] block mt-0.5">
                            Currently at: {req.currentRoom}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          sound.playSuccess();
                          onAcceptFriendRequest(req);
                        }}
                        className="px-4 py-2 bg-[#F6F930] text-[#0F0F10] font-mono text-xs font-bold rounded-xl uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => {
                          sound.playClick();
                          onDeclineFriendRequest(req.id);
                        }}
                        className="px-4 py-2 bg-[#2A2A2B] text-[#C4C7C8] hover:text-white font-mono text-xs rounded-xl uppercase transition-colors cursor-pointer"
                      >
                        Ignore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: MY SWAP PASS & QR */}
      {activeSubTab === 'my_qr' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="bg-[#1A1A1B] rounded-[24px] p-6 md:p-8 border border-[#2D2D2E] text-center space-y-6">
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-[#8E9192] uppercase tracking-widest">
                YOUR INSTANT FRIEND & VCARD SWAP
              </span>
              <h3 className="text-2xl font-bold text-white">{user.name}</h3>
              <p className="text-xs text-[#C4C7C8]">
                {user.role} • {user.company}
              </p>
            </div>

            <div className="inline-block p-4 bg-white rounded-2xl border-2 border-dashed border-[#8E9192] shadow-2xl">
              <QRCodeSVG
                value={user.qrPayload}
                size={200}
                bgColor="#FFFFFF"
                fgColor="#0F0F10"
                level="Q"
                className="w-48 h-48"
              />
            </div>

            <p className="font-mono text-[11px] text-[#8E9192] leading-relaxed max-w-sm mx-auto">
              Have any peer scan this code with their camera to immediately add you as a conference friend and download your vCard contact information.
            </p>

            <button
              onClick={() => {
                sound.playClick();
                exportContactVCard(user);
              }}
              className="w-full py-3 bg-[#201F20] hover:bg-[#2A2A2B] text-white border border-[#444748] rounded-xl font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              Download My vCard File (.vcf)
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-[#1A1A1B] rounded-2xl p-6 border border-[#2D2D2E] space-y-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#F6F930] text-[20px]">security</span>
                Offline Zero-Latency Networking
              </h4>
              <p className="text-xs text-[#C4C7C8] leading-relaxed">
                The QR badge is self-contained. Even when arena cellular towers or Wi-Fi networks are congested, your credentials and contact card swap effortlessly.
              </p>
            </div>

            <div className="bg-[#1A1A1B] rounded-2xl p-6 border border-[#2D2D2E] space-y-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4ade80] text-[20px]">notifications_active</span>
                Same-Conference Notifications
              </h4>
              <p className="text-xs text-[#C4C7C8] leading-relaxed">
                Once connected, whenever you and your friend both enter the venue or sit down in the same session hall (such as Main Stage or Workshop A), you'll both receive an instant proximity alert to wave and connect!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
