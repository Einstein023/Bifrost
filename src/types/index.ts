export type AccessLevel = 'Alpha' | 'Beta' | 'VIP' | 'General' | 'Speaker' | 'Organizer';

export interface Attendee {
  id: string;
  name: string;
  role: string;
  company: string;
  accessLevel: AccessLevel;
  passType: 'VIP ACCESS' | 'SPEAKER' | 'ALL-ACCESS' | 'GENERAL';
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  bio: string;
  avatar: string;
  location: string;
  qrPayload: string;
  checkedIn: boolean;
  notes?: string;
  connectedAt?: string;
}

export interface SessionSpeaker {
  name: string;
  role: string;
  company: string;
  avatar: string;
  bio: string;
}

export interface Session {
  id: string;
  title: string;
  track: 'Keynote' | 'Main Stage' | 'AI & Vision' | 'Cloud & Systems' | 'Design & Ethics' | 'Workshop';
  sessionType: 'KEYNOTE SESSION' | 'PANEL' | 'WORKSHOP' | 'LIGHTNING TALK' | 'NETWORKING';
  day: 'Day 1' | 'Day 2';
  dateStr: string;
  timeDisplay: string;
  startTime: string; // '10:00 AM'
  endTime: string;   // '11:15 AM'
  room: string;
  description: string;
  speaker: SessionSpeaker;
  secondarySpeakers?: SessionSpeaker[];
  capacity: number;
  enrolledCount: number;
  isBookmarked: boolean;
  isLive?: boolean;
  isUpcoming?: boolean;
  tags: string[];
}

export type NotificationType = 'critical' | 'venue' | 'connection' | 'info';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  timeAgo: string;
  isRead: boolean;
  actionLabel?: string;
  actionType?: 'view_session' | 'view_room' | 'connection_request' | 'info';
  sessionId?: string;
  sender?: {
    id: string;
    name: string;
    role: string;
    company: string;
    avatar: string;
    linkedin?: string;
    email?: string;
  };
}

export interface ScanRecord {
  id: string;
  attendeeName: string;
  attendeeId: string;
  passType: string;
  timestamp: string;
  timeDisplay: string;
  status: 'GRANTED' | 'DENIED';
  reason?: string;
  location: string;
}

export interface VenueCapacity {
  id: string;
  name: string;
  trackTag: string;
  current: number;
  max: number;
  warningThreshold: number;
}
