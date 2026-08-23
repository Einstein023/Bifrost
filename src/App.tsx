/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  CURRENT_USER,
  INITIAL_SESSIONS,
  INITIAL_NOTIFICATIONS,
  PEER_DIRECTORY,
  INITIAL_CAPACITIES,
  INITIAL_SCANS,
} from './data/mockData';
import { Attendee, Session, AppNotification, ScanRecord, VenueCapacity } from './types';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { DashboardView } from './components/DashboardView';
import { AgendaView } from './components/AgendaView';
import { NetworkView } from './components/NetworkView';
import { ConsoleView } from './components/ConsoleView';
import { ProfileView } from './components/ProfileView';
import { PassModal } from './components/PassModal';
import { ScannerModal } from './components/ScannerModal';
import { PeerProfileModal } from './components/PeerProfileModal';
import { SessionDetailModal } from './components/SessionDetailModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { MenuDrawer } from './components/MenuDrawer';
import { sound } from './utils/audio';

export default function App() {
  // --- Persistent State ---
  const [user, setUser] = useState<Attendee>(() => {
    const saved = localStorage.getItem('bifrost_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('bifrost_sessions');
    return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('bifrost_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [connections, setConnections] = useState<Attendee[]>(() => {
    const saved = localStorage.getItem('bifrost_connections');
    return saved ? JSON.parse(saved) : PEER_DIRECTORY.slice(0, 3);
  });

  const [capacities, setCapacities] = useState<VenueCapacity[]>(INITIAL_CAPACITIES);
  const [scanRecords, setScanRecords] = useState<ScanRecord[]>(INITIAL_SCANS);

  // --- UI Navigation & Modals ---
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [scannerMode, setScannerMode] = useState<'peer_swap' | 'staff_checkin'>('peer_swap');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedPeer, setSelectedPeer] = useState<Attendee | null>(null);

  // Save changes to local storage
  useEffect(() => {
    localStorage.setItem('bifrost_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('bifrost_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('bifrost_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('bifrost_connections', JSON.stringify(connections));
  }, [connections]);

  // Unread notifications count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // --- Handlers ---
  const handleToggleBookmark = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, isBookmarked: !s.isBookmarked } : s))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleAcceptConnection = (notifId: string, sender?: AppNotification['sender']) => {
    if (sender) {
      const newPeer: Attendee = {
        id: sender.id,
        name: sender.name,
        role: sender.role,
        company: sender.company,
        accessLevel: 'VIP',
        passType: 'VIP ACCESS',
        email: sender.email || `${sender.name.toLowerCase().replace(/\s+/g, '.')}@summit.io`,
        linkedin: sender.linkedin,
        bio: `${sender.role} at ${sender.company}. Connected at Bifrost Summit.`,
        avatar: sender.avatar,
        location: 'Main Stage Atrium',
        qrPayload: `BIFROST_USER:${sender.id}:${sender.name}:${sender.company}:VIP`,
        checkedIn: true,
        connectedAt: 'Just now',
      };

      setConnections((prev) => {
        if (prev.some((p) => p.id === newPeer.id)) return prev;
        return [newPeer, ...prev];
      });
    }

    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const handleIgnoreConnection = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const handleBroadcastTestAlert = () => {
    sound.playSuccess();
    const alerts: Array<Omit<AppNotification, 'id' | 'timestamp' | 'timeAgo' | 'isRead'>> = [
      {
        title: 'Room Change: Workshop B',
        message: 'Workshop B: Neural Compilers has been relocated to Hall 2, Room 204.',
        type: 'venue',
        actionLabel: 'VIEW DETAILS',
        actionType: 'view_room',
      },
      {
        title: 'Keynote Q&A Opening Soon',
        message: 'Live speaker Q&A starting in 5 minutes on Main Stage. Submit questions via console.',
        type: 'critical',
        actionLabel: 'VIEW SESSION',
        actionType: 'view_session',
        sessionId: 'ses-1',
      },
      {
        title: 'VIP Lounge Reception',
        message: 'Exclusive founder & investor mixer begins at 5:00 PM at Atrium Sky Lounge.',
        type: 'info',
        sessionId: 'ses-6',
      },
    ];

    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      ...randomAlert,
      timestamp: new Date().toISOString(),
      timeAgo: 'JUST NOW',
      isRead: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleScanSuccess = (scannedAttendee: Attendee) => {
    setIsScannerModalOpen(false);
    setSelectedPeer(scannedAttendee);

    // If in peer swap mode, also add to network if not already present
    if (scannerMode === 'peer_swap') {
      setConnections((prev) => {
        if (prev.some((p) => p.id === scannedAttendee.id)) return prev;
        return [{ ...scannedAttendee, connectedAt: 'Just now' }, ...prev];
      });
    }
  };

  const handleStaffScanResult = (status: 'GRANTED' | 'DENIED', name: string, type: string) => {
    const newRecord: ScanRecord = {
      id: `scan-${Date.now()}`,
      attendeeName: name,
      attendeeId: `#BF-${Math.floor(1000 + Math.random() * 9000)}`,
      passType: type,
      timestamp: new Date().toISOString(),
      timeDisplay: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status,
      location: 'Main Entrance Alpha',
    };

    setScanRecords((prev) => [newRecord, ...prev.slice(0, 19)]);

    if (status === 'GRANTED') {
      setCapacities((prev) =>
        prev.map((c) =>
          c.id === 'cap-main'
            ? { ...c, current: Math.min(c.current + 1, c.max) }
            : c
        )
      );
    }
  };

  const handleUpdatePeerNotes = (peerId: string, notes: string) => {
    setConnections((prev) =>
      prev.map((c) => (c.id === peerId ? { ...c, notes } : c))
    );
    if (selectedPeer && selectedPeer.id === peerId) {
      setSelectedPeer({ ...selectedPeer, notes });
    }
  };

  const handleToggleSaveConnection = (peer: Attendee) => {
    const isAlreadySaved = connections.some((c) => c.id === peer.id);
    if (isAlreadySaved) {
      setConnections((prev) => prev.filter((c) => c.id !== peer.id));
    } else {
      setConnections((prev) => [{ ...peer, connectedAt: 'Just now' }, ...prev]);
    }
  };

  const handleOpenSessionById = (sessionId: string) => {
    const found = sessions.find((s) => s.id === sessionId);
    if (found) {
      setSelectedSession(found);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F10] text-[#E5E2E3] flex flex-col relative selection:bg-[#F6F930] selection:text-[#0F0F10] pb-24 md:pb-12">
      {/* Top Application Bar */}
      <TopAppBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={unreadCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenPassModal={() => setIsPassModalOpen(true)}
        onToggleConsole={() => setActiveTab(activeTab === 'console' ? 'dashboard' : 'console')}
        isConsoleMode={activeTab === 'console'}
        onOpenMenuDrawer={() => setIsMenuDrawerOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 w-full relative z-10">
        {activeTab === 'dashboard' && (
          <DashboardView
            user={user}
            sessions={sessions}
            onOpenSession={(session) => setSelectedSession(session)}
            onNavigateToSchedule={() => setActiveTab('agenda')}
            onOpenPassModal={() => setIsPassModalOpen(true)}
            onOpenScanner={() => {
              setScannerMode('peer_swap');
              setIsScannerModalOpen(true);
            }}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {activeTab === 'agenda' && (
          <AgendaView
            sessions={sessions}
            onToggleBookmark={handleToggleBookmark}
            onOpenSession={(session) => setSelectedSession(session)}
          />
        )}

        {activeTab === 'network' && (
          <NetworkView
            user={user}
            connections={connections}
            onOpenScanner={() => {
              setScannerMode('peer_swap');
              setIsScannerModalOpen(true);
            }}
            onOpenPeerProfile={(peer) => setSelectedPeer(peer)}
            onUpdatePeerNotes={handleUpdatePeerNotes}
            onRemoveConnection={(id) =>
              setConnections((prev) => prev.filter((c) => c.id !== id))
            }
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            user={user}
            onUpdateUser={setUser}
            onOpenPassModal={() => setIsPassModalOpen(true)}
            onNavigateToConsole={() => setActiveTab('console')}
          />
        )}

        {activeTab === 'console' && (
          <ConsoleView
            capacities={capacities}
            scanRecords={scanRecords}
            onStartScanner={() => {
              setScannerMode('staff_checkin');
              setIsScannerModalOpen(true);
            }}
            onSimulateScan={(type) => {
              if (type === 'VIP') {
                sound.playGranted();
                handleStaffScanResult('GRANTED', 'Alex Mercer', 'VIP PASS');
              } else if (type === 'GENERAL') {
                sound.playGranted();
                handleStaffScanResult('GRANTED', 'Sarah Chen', 'GENERAL ADMISSION');
              } else {
                sound.playDenied();
                handleStaffScanResult('DENIED', 'Unknown Tag', 'INVALID ID');
              }
            }}
            onClearLogs={() => setScanRecords([])}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Digital Pass Modal (High Contrast Fullscreen) */}
      <PassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        user={user}
      />

      {/* QR Scanner Modal (Camera or HUD Simulation) */}
      <ScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        onScanSuccess={handleScanSuccess}
        peerDirectory={PEER_DIRECTORY}
        mode={scannerMode}
        onStaffScanResult={handleStaffScanResult}
      />

      {/* Peer Profile Slide-over Sheet */}
      <PeerProfileModal
        peer={selectedPeer}
        isOpen={!!selectedPeer}
        onClose={() => setSelectedPeer(null)}
        isSavedConnection={
          selectedPeer ? connections.some((c) => c.id === selectedPeer.id) : false
        }
        onToggleSaveConnection={handleToggleSaveConnection}
        onUpdateNotes={handleUpdatePeerNotes}
      />

      {/* Session Details Modal */}
      <SessionDetailModal
        session={selectedSession}
        isOpen={!!selectedSession}
        onClose={() => setSelectedSession(null)}
        onToggleBookmark={handleToggleBookmark}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllAsRead}
        onAcceptConnection={handleAcceptConnection}
        onIgnoreConnection={handleIgnoreConnection}
        onOpenSessionById={handleOpenSessionById}
        onBroadcastTestAlert={handleBroadcastTestAlert}
      />

      {/* Menu / Event Info Drawer */}
      <MenuDrawer
        isOpen={isMenuDrawerOpen}
        onClose={() => setIsMenuDrawerOpen(false)}
        onNavigate={setActiveTab}
        onOpenPass={() => setIsPassModalOpen(true)}
      />
    </div>
  );
}
