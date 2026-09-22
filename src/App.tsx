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
  INITIAL_ACCOUNTS,
} from './data/mockData';
import { Attendee, Session, AppNotification, ScanRecord, VenueCapacity, UserAccount } from './types';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { LandingPageView } from './components/LandingPageView';
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
import { AuthModal } from './components/AuthModal';
import { FriendProximityToast, FriendAlertData } from './components/FriendProximityToast';
import { sound } from './utils/audio';

export default function App() {
  // --- Accounts Registry ---
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('bifrost_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [activeUserId, setActiveUserId] = useState<string>(() => {
    const saved = localStorage.getItem('bifrost_active_user_id');
    return saved || CURRENT_USER.id;
  });

  // Friend Proximity Toast alert state
  const [activeProximityAlert, setActiveProximityAlert] = useState<FriendAlertData | null>(null);

  // Current active account
  const activeAccount =
    accounts.find((acc) => acc.user.id === activeUserId) || accounts[0] || {
      user: CURRENT_USER,
      bookmarkedSessionIds: ['ses-1', 'ses-2', 'ses-6'],
      connections: PEER_DIRECTORY.slice(0, 2),
      notifications: INITIAL_NOTIFICATIONS,
    };

  const user = activeAccount.user;

  // Active user's personalized sessions (with their specific bookmarks)
  const [sessions, setSessions] = useState<Session[]>(() => {
    return INITIAL_SESSIONS.map((s) => ({
      ...s,
      isBookmarked: activeAccount.bookmarkedSessionIds.includes(s.id),
    }));
  });

  // Active user's personalized notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(
    activeAccount.notifications || INITIAL_NOTIFICATIONS
  );

  // Active user's personalized connections
  const [connections, setConnections] = useState<Attendee[]>(
    activeAccount.connections || []
  );

  const [capacities, setCapacities] = useState<VenueCapacity[]>(INITIAL_CAPACITIES);
  const [scanRecords, setScanRecords] = useState<ScanRecord[]>(INITIAL_SCANS);

  // --- UI Navigation & Modals ---
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [scannerMode, setScannerMode] = useState<'peer_swap' | 'staff_checkin'>('peer_swap');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedPeer, setSelectedPeer] = useState<Attendee | null>(null);

  // Auth Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'register'>('register');
  const [authModalPassType, setAuthModalPassType] = useState<Attendee['passType']>('VIP ACCESS');

  // Save accounts and active user to localStorage
  useEffect(() => {
    localStorage.setItem('bifrost_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('bifrost_active_user_id', activeUserId);
  }, [activeUserId]);

  // When switching activeUserId or accounts change, synchronize active session bookmarks & network
  useEffect(() => {
    const currentAcc = accounts.find((acc) => acc.user.id === activeUserId);
    if (currentAcc) {
      setSessions(
        INITIAL_SESSIONS.map((s) => ({
          ...s,
          isBookmarked: currentAcc.bookmarkedSessionIds.includes(s.id),
        }))
      );
      setNotifications(currentAcc.notifications);
      setConnections(currentAcc.connections);
    }
  }, [activeUserId]);

  // Unread notifications count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Helper to update active account state and persistent list
  const updateActiveAccount = (
    updater: (prevAccount: UserAccount) => UserAccount
  ) => {
    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) => {
        if (acc.user.id === activeUserId) {
          return updater(acc);
        }
        return acc;
      })
    );
  };

  // --- Handlers ---
  const handleToggleBookmark = (sessionId: string) => {
    sound.playClick();
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          const nextState = !s.isBookmarked;
          return { ...s, isBookmarked: nextState };
        }
        return s;
      })
    );

    updateActiveAccount((acc) => {
      const isAlready = acc.bookmarkedSessionIds.includes(sessionId);
      const nextBookmarks = isAlready
        ? acc.bookmarkedSessionIds.filter((id) => id !== sessionId)
        : [...acc.bookmarkedSessionIds, sessionId];
      return { ...acc, bookmarkedSessionIds: nextBookmarks };
    });
  };

  const handleUpdateUser = (updatedUser: Attendee) => {
    updateActiveAccount((acc) => ({ ...acc, user: updatedUser }));
  };

  const handleMarkAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    updateActiveAccount((acc) => ({ ...acc, notifications: updated }));
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
        const next = [newPeer, ...prev];
        updateActiveAccount((acc) => ({ ...acc, connections: next }));
        return next;
      });
    }

    const updatedNotifs = notifications.map((n) =>
      n.id === notifId ? { ...n, isRead: true } : n
    );
    setNotifications(updatedNotifs);
    updateActiveAccount((acc) => ({ ...acc, notifications: updatedNotifs }));
  };

  const handleIgnoreConnection = (notifId: string) => {
    const updated = notifications.map((n) =>
      n.id === notifId ? { ...n, isRead: true } : n
    );
    setNotifications(updated);
    updateActiveAccount((acc) => ({ ...acc, notifications: updated }));
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

    const nextNotifs = [newNotif, ...notifications];
    setNotifications(nextNotifs);
    updateActiveAccount((acc) => ({ ...acc, notifications: nextNotifs }));
  };

  // Friend Proximity Alert Trigger
  const handleTriggerProximityAlert = (
    type: 'same_room' | 'venue_arrival' | 'wave_received',
    friend: Attendee
  ) => {
    const isSameRoom = type === 'same_room';
    const isWave = type === 'wave_received';

    if (isWave) {
      sound.playWave();
    } else {
      sound.playFriendNearby();
    }

    const roomName = friend.currentRoom || user.currentRoom || 'Main Stage';

    const newAlert: FriendAlertData = {
      id: `alert-${Date.now()}`,
      type,
      friend,
      roomName,
      customMessage: isSameRoom
        ? `${friend.name} is in ${roomName} right now! You are both attending this session.`
        : isWave
        ? `${friend.name} just waved to you from ${roomName}!`
        : `${friend.name} just checked into the summit (${roomName}).`,
    };

    setActiveProximityAlert(newAlert);

    // Also record in notifications
    const newNotif: AppNotification = {
      id: `notif-friend-${Date.now()}`,
      title: isSameRoom
        ? `Friend in Same Room: ${friend.name}`
        : isWave
        ? `${friend.name} Waved to You!`
        : `Friend Arrived: ${friend.name}`,
      message: isSameRoom
        ? `${friend.name} (${friend.company}) is sitting in ${roomName} right now.`
        : isWave
        ? `${friend.name} sent you a wave from ${roomName}.`
        : `${friend.name} has checked into the conference venue.`,
      type: isSameRoom ? 'friend_same_room' : isWave ? 'peer_wave' : 'friend_arrival',
      timestamp: new Date().toISOString(),
      timeAgo: 'JUST NOW',
      isRead: false,
      friendId: friend.id,
      roomName: roomName,
      sender: {
        id: friend.id,
        name: friend.name,
        company: friend.company,
        role: friend.role,
        avatar: friend.avatar,
      },
    };

    const nextNotifs = [newNotif, ...notifications];
    setNotifications(nextNotifs);
    updateActiveAccount((acc) => ({ ...acc, notifications: nextNotifs }));
  };

  const handleSendFriendRequest = (peer: Attendee) => {
    sound.playSuccess();
    updateActiveAccount((acc) => {
      const pendingSent = acc.pendingSentRequests || [];
      if (pendingSent.some((p) => p.id === peer.id)) return acc;
      return {
        ...acc,
        pendingSentRequests: [...pendingSent, peer],
      };
    });

    const sentNotif: AppNotification = {
      id: `notif-sent-${Date.now()}`,
      title: `Friend Request Sent`,
      message: `Friend request sent to ${peer.name} (${peer.company}).`,
      type: 'info',
      timestamp: new Date().toISOString(),
      timeAgo: 'JUST NOW',
      isRead: false,
    };
    const nextNotifs = [sentNotif, ...notifications];
    setNotifications(nextNotifs);
    updateActiveAccount((acc) => ({ ...acc, notifications: nextNotifs }));

    // Auto-accept simulation after 2.5s for seamless interactive experience
    setTimeout(() => {
      sound.playFriendNearby();
      handleAcceptFriendRequest(peer);
      setActiveProximityAlert({
        id: `alert-accepted-${Date.now()}`,
        type: 'same_room',
        friend: peer,
        roomName: peer.currentRoom || 'Main Stage',
        customMessage: `${peer.name} accepted your friend request! You're now connected.`,
      });
    }, 2500);
  };

  const handleAcceptFriendRequest = (peer: Attendee) => {
    sound.playSuccess();
    const updatedPeer: Attendee = {
      ...peer,
      isFriend: true,
      friendStatus: 'accepted',
      connectedAt: 'Just now',
    };

    setConnections((prev) => {
      if (prev.some((p) => p.id === peer.id)) {
        return prev.map((p) => (p.id === peer.id ? updatedPeer : p));
      }
      return [updatedPeer, ...prev];
    });

    updateActiveAccount((acc) => {
      const filteredReceived = (acc.pendingReceivedRequests || []).filter((p) => p.id !== peer.id);
      const filteredSent = (acc.pendingSentRequests || []).filter((p) => p.id !== peer.id);
      const exists = acc.connections.some((c) => c.id === peer.id);
      const newConnections = exists
        ? acc.connections.map((c) => (c.id === peer.id ? updatedPeer : c))
        : [updatedPeer, ...acc.connections];

      return {
        ...acc,
        connections: newConnections,
        pendingReceivedRequests: filteredReceived,
        pendingSentRequests: filteredSent,
      };
    });

    const acceptedNotif: AppNotification = {
      id: `notif-conn-${Date.now()}`,
      title: `New Conference Friend!`,
      message: `You are now connected with ${peer.name} (${peer.company}). Proximity alerts enabled.`,
      type: 'friend_request',
      timestamp: new Date().toISOString(),
      timeAgo: 'JUST NOW',
      isRead: false,
      sender: {
        id: peer.id,
        name: peer.name,
        company: peer.company,
        role: peer.role,
        avatar: peer.avatar,
      },
    };
    const nextNotifs = [acceptedNotif, ...notifications];
    setNotifications(nextNotifs);
    updateActiveAccount((acc) => ({ ...acc, notifications: nextNotifs }));
  };

  const handleDeclineFriendRequest = (peerId: string) => {
    sound.playClick();
    updateActiveAccount((acc) => ({
      ...acc,
      pendingReceivedRequests: (acc.pendingReceivedRequests || []).filter((p) => p.id !== peerId),
    }));
  };

  const handleScanSuccess = (scannedAttendee: Attendee) => {
    setIsScannerModalOpen(false);
    setSelectedPeer(scannedAttendee);

    // If in peer swap mode, add to network if not already present
    if (scannerMode === 'peer_swap') {
      setConnections((prev) => {
        if (prev.some((p) => p.id === scannedAttendee.id)) return prev;
        const next = [{ ...scannedAttendee, connectedAt: 'Just now' }, ...prev];
        updateActiveAccount((acc) => ({ ...acc, connections: next }));
        return next;
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
    const nextConnections = connections.map((c) =>
      c.id === peerId ? { ...c, notes } : c
    );
    setConnections(nextConnections);
    updateActiveAccount((acc) => ({ ...acc, connections: nextConnections }));

    if (selectedPeer && selectedPeer.id === peerId) {
      setSelectedPeer({ ...selectedPeer, notes });
    }
  };

  const handleToggleSaveConnection = (peer: Attendee) => {
    const isAlreadySaved = connections.some((c) => c.id === peer.id);
    let next: Attendee[];
    if (isAlreadySaved) {
      next = connections.filter((c) => c.id !== peer.id);
    } else {
      next = [{ ...peer, connectedAt: 'Just now' }, ...connections];
    }
    setConnections(next);
    updateActiveAccount((acc) => ({ ...acc, connections: next }));
  };

  const handleOpenSessionById = (sessionId: string) => {
    const found = sessions.find((s) => s.id === sessionId);
    if (found) {
      setSelectedSession(found);
    }
  };

  // Auth flow triggers
  const handleOpenAuthModal = (mode: 'signin' | 'register', passType?: Attendee['passType']) => {
    setAuthModalMode(mode);
    if (passType) {
      setAuthModalPassType(passType);
    }
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (newOrExistingAccount: UserAccount) => {
    setAccounts((prev) => {
      const exists = prev.some((a) => a.user.id === newOrExistingAccount.user.id);
      if (exists) {
        return prev.map((a) => (a.user.id === newOrExistingAccount.user.id ? newOrExistingAccount : a));
      }
      return [newOrExistingAccount, ...prev];
    });

    setActiveUserId(newOrExistingAccount.user.id);
    setActiveTab('dashboard');
  };

  const handleSignOut = () => {
    sound.playClick();
    setActiveTab('landing');
  };

  const handleSwitchAccount = (acc: UserAccount) => {
    setActiveUserId(acc.user.id);
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
        currentUser={user}
        onOpenAuthModal={handleOpenAuthModal}
        onSignOut={handleSignOut}
      />

      {/* Friend Proximity & Same-Room Real-time Alert Toast */}
      <FriendProximityToast
        alert={activeProximityAlert}
        onDismiss={() => setActiveProximityAlert(null)}
        onOpenNetwork={() => setActiveTab('network')}
        onOpenPeerProfile={(peer) => setSelectedPeer(peer)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 w-full relative z-10">
        {activeTab === 'landing' && (
          <LandingPageView
            onOpenAuthModal={handleOpenAuthModal}
            onExploreAgenda={() => setActiveTab('agenda')}
            onExploreNetwork={() => setActiveTab('network')}
            onEnterConsole={() => setActiveTab('console')}
            currentUser={user}
            onLaunchDashboard={() => setActiveTab('dashboard')}
            sessions={sessions}
            onOpenSession={(session) => setSelectedSession(session)}
            allAttendees={PEER_DIRECTORY}
            onTriggerProximityAlert={handleTriggerProximityAlert}
            onSendFriendRequest={handleSendFriendRequest}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            user={user}
            sessions={sessions}
            connections={connections}
            onOpenSession={(session) => setSelectedSession(session)}
            onNavigateToSchedule={() => setActiveTab('agenda')}
            onNavigateToNetwork={() => setActiveTab('network')}
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
            allAttendees={PEER_DIRECTORY}
            pendingReceived={activeAccount.pendingReceivedRequests || []}
            pendingSent={activeAccount.pendingSentRequests || []}
            onOpenScanner={() => {
              setScannerMode('peer_swap');
              setIsScannerModalOpen(true);
            }}
            onOpenPeerProfile={(peer) => setSelectedPeer(peer)}
            onUpdatePeerNotes={handleUpdatePeerNotes}
            onRemoveConnection={(id) => {
              const next = connections.filter((c) => c.id !== id);
              setConnections(next);
              updateActiveAccount((acc) => ({ ...acc, connections: next }));
            }}
            onSendFriendRequest={handleSendFriendRequest}
            onAcceptFriendRequest={handleAcceptFriendRequest}
            onDeclineFriendRequest={handleDeclineFriendRequest}
            onTriggerProximityAlert={handleTriggerProximityAlert}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            user={user}
            onUpdateUser={handleUpdateUser}
            onOpenPassModal={() => setIsPassModalOpen(true)}
            onNavigateToConsole={() => setActiveTab('console')}
            onOpenAuthModal={handleOpenAuthModal}
            onSignOut={handleSignOut}
            allAccounts={accounts}
            onSwitchAccount={handleSwitchAccount}
            bookmarkedCount={sessions.filter((s) => s.isBookmarked).length}
            connectionsCount={connections.length}
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

      {/* Auth & Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
        initialPassType={authModalPassType}
        existingAccounts={accounts}
      />

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
        currentUser={user}
        onOpenAuthModal={handleOpenAuthModal}
        onSignOut={handleSignOut}
      />
    </div>
  );
}
