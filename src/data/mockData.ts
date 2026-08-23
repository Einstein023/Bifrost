import { Attendee, Session, AppNotification, ScanRecord, VenueCapacity } from '../types';

export const CURRENT_USER: Attendee = {
  id: '#BF-8492',
  name: 'Alex Mercer',
  role: 'Lead AI Systems Architect',
  company: 'Nexus Corp',
  accessLevel: 'Alpha',
  passType: 'VIP ACCESS',
  email: 'alex.mercer@nexuscorp.io',
  phone: '+1 (415) 890-2341',
  linkedin: 'https://linkedin.com/in/alex-mercer-nexus',
  github: 'https://github.com/alex-mercer',
  twitter: '@alexmercer_ai',
  bio: 'Spearheading autonomous infrastructure and real-time distributed neural networks at Nexus Corp. Focus on edge compute and generative architecture.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  location: 'Main Hall Atrium',
  qrPayload: 'BIFROST_USER:#BF-8492:Alex Mercer:Nexus Corp:VIP:alex.mercer@nexuscorp.io',
  checkedIn: true,
};

export const INITIAL_SESSIONS: Session[] = [
  {
    id: 'ses-1',
    title: 'The Future of Generative Architecture',
    track: 'Main Stage',
    sessionType: 'KEYNOTE SESSION',
    day: 'Day 1',
    dateStr: 'Oct 24, 2024',
    timeDisplay: '10:00 AM',
    startTime: '10:00 AM',
    endTime: '11:15 AM',
    room: 'Main Stage',
    description: 'Exploring structural paradigms shifted by AI models and the evolution of computational design across urban systems and scalable architectures.',
    speaker: {
      name: 'Dr. Elena Rostova',
      role: 'LEAD RESEARCHER',
      company: 'MIT Media Lab',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbx_-qxd8_WEYG5ExDRJ2uV-8bWvKFcQTzNyVKoLOI46OTo1fjmKs9Mc63z6quJPwtb_7npFxVawpGLL1ExoN_OEI47iao6vGq0w1JFGLn_T0G1GZlEDo5yDVn1GnmqazBzqGwCgfegFMLbLbsRj9HdUEcqHsImYP5GihGJ0ThmwloAre9apOxreh6le3gQQGpgKpdL26KUM9UI8SAcH4yNNOL9V_hx0en0wtHjqcw4mcG2FcAo-QVmQ',
      bio: 'Pioneering researcher in geometric deep learning, algorithmic spatial topology, and human-machine collaborative synthesis.'
    },
    capacity: 2500,
    enrolledCount: 2100,
    isBookmarked: true,
    isLive: true,
    isUpcoming: false,
    tags: ['Generative AI', 'Architecture', 'Keynote', 'Spatial Computing']
  },
  {
    id: 'ses-2',
    title: 'Ethics in Automated Design',
    track: 'Design & Ethics',
    sessionType: 'PANEL',
    day: 'Day 1',
    dateStr: 'Oct 24, 2024',
    timeDisplay: '11:30 AM',
    startTime: '11:30 AM',
    endTime: '12:30 PM',
    room: 'Room B2',
    description: 'Examining systemic bias, algorithmic accountability, and environmental footprints of large-scale generative pipelines in critical infrastructure.',
    speaker: {
      name: 'Marcus Vance',
      role: 'HEAD OF AI GOVERNANCE',
      company: 'Aetheria Protocol',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Advising global regulatory bodies and open source consortia on verifiable AI safety, privacy preservation, and model provenance.'
    },
    capacity: 350,
    enrolledCount: 280,
    isBookmarked: true,
    isLive: false,
    isUpcoming: true,
    tags: ['Safety & Ethics', 'Governance', 'Panel']
  },
  {
    id: 'ses-3',
    title: 'Zero-Latency Edge Neural Processing',
    track: 'Cloud & Systems',
    sessionType: 'WORKSHOP',
    day: 'Day 1',
    dateStr: 'Oct 24, 2024',
    timeDisplay: '01:45 PM',
    startTime: '01:45 PM',
    endTime: '03:15 PM',
    room: 'Workshop A',
    description: 'Hands-on laboratory deploying quantized micro-transformers to bare-metal RISC-V edge accelerators under sub-2ms constraint envelopes.',
    speaker: {
      name: 'Kaito Tanaka',
      role: 'VP OF HARDWARE ARCHITECTURE',
      company: 'Synapse Silicon',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      bio: 'Leading low-power neuromorphic chip design with over 18 patents in hardware-accelerated tensor matrix pipelines.'
    },
    capacity: 300,
    enrolledCount: 294,
    isBookmarked: false,
    isLive: false,
    isUpcoming: true,
    tags: ['Edge Compute', 'Hardware', 'Workshop', 'Hands-on']
  },
  {
    id: 'ses-4',
    title: 'Autonomous Multi-Agent Swarms in Production',
    track: 'AI & Vision',
    sessionType: 'KEYNOTE SESSION',
    day: 'Day 1',
    dateStr: 'Oct 24, 2024',
    timeDisplay: '03:30 PM',
    startTime: '03:30 PM',
    endTime: '04:45 PM',
    room: 'Main Stage',
    description: 'Case studies from operating 10,000+ synchronized asynchronous agents negotiating distributed workflows with zero human intervention.',
    speaker: {
      name: 'Sophia Zhang',
      role: 'FOUNDER & CEO',
      company: 'HiveMind Systems',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      bio: 'Former DARPA robotics challenge lead and founder of HiveMind, building orchestration software for autonomous enterprise fleets.'
    },
    capacity: 2500,
    enrolledCount: 1840,
    isBookmarked: false,
    isLive: false,
    isUpcoming: true,
    tags: ['Multi-Agent', 'Distributed Systems', 'Production AI']
  },
  {
    id: 'ses-5',
    title: 'Spatial Computing & Neural CAD Interfaces',
    track: 'Main Stage',
    sessionType: 'LIGHTNING TALK',
    day: 'Day 2',
    dateStr: 'Oct 25, 2024',
    timeDisplay: '09:30 AM',
    startTime: '09:30 AM',
    endTime: '10:30 AM',
    room: 'Main Stage',
    description: 'Live demonstration of volumetric neural meshes edited in real time with eye tracking, spatial gesture cues, and generative voice feedback.',
    speaker: {
      name: 'Liam Davies',
      role: 'CHIEF DESIGN OFFICER',
      company: 'Dimension Interactive',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      bio: 'Pioneering next-generation human computer interaction paradigms for mixed reality and spatial engineering platforms.'
    },
    capacity: 2500,
    enrolledCount: 920,
    isBookmarked: false,
    isLive: false,
    isUpcoming: true,
    tags: ['Spatial UI', 'Vision Pro', 'Neural CAD']
  },
  {
    id: 'ses-6',
    title: 'VIP Founder & Investor Networking Mixer',
    track: 'Keynote',
    sessionType: 'NETWORKING',
    day: 'Day 2',
    dateStr: 'Oct 25, 2024',
    timeDisplay: '05:00 PM',
    startTime: '05:00 PM',
    endTime: '07:00 PM',
    room: 'Atrium Sky Lounge',
    description: 'Curated networking salon for Series A-C founders, keynote speakers, and sovereign tech fund partners. Refreshments provided.',
    speaker: {
      name: 'Alex Mercer & Panel Hosts',
      role: 'SUMMIT ADVISORY BOARD',
      company: 'Bifrost Tech Council',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Bifrost Tech Council steering committee.'
    },
    capacity: 200,
    enrolledCount: 165,
    isBookmarked: true,
    isLive: false,
    isUpcoming: true,
    tags: ['VIP Only', 'Networking', 'Exclusive']
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Session Starting Soon',
    message: 'Your session starts in 10 mins. Please proceed to Main Stage.',
    type: 'critical',
    timestamp: new Date().toISOString(),
    timeAgo: 'JUST NOW',
    isRead: false,
    actionLabel: 'VIEW SESSION',
    actionType: 'view_session',
    sessionId: 'ses-1'
  },
  {
    id: 'notif-2',
    title: 'Venue Update',
    message: 'Venue update: Workshop B has been moved to Hall 2.',
    type: 'venue',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    timeAgo: '12m AGO',
    isRead: false,
    actionLabel: 'VIEW LOCATION',
    actionType: 'view_room'
  },
  {
    id: 'notif-3',
    title: 'New Connection',
    message: 'New connection request from Sarah Chen.',
    type: 'connection',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    timeAgo: '1h AGO',
    isRead: false,
    actionLabel: 'ACCEPT',
    actionType: 'connection_request',
    sender: {
      id: 'usr-101',
      name: 'Sarah Chen',
      role: 'Principal UX Director',
      company: 'Vector Labs',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbx_-qxd8_WEYG5ExDRJ2uV-8bWvKFcQTzNyVKoLOI46OTo1fjmKs9Mc63z6quJPwtb_7npFxVawpGLL1ExoN_OEI47iao6vGq0w1JFGLn_T0G1GZlEDo5yDVn1GnmqazBzqGwCgfegFMLbLbsRj9HdUEcqHsImYP5GihGJ0ThmwloAre9apOxreh6le3gQQGpgKpdL26KUM9UI8SAcH4yNNOL9V_hx0en0wtHjqcw4mcG2FcAo-QVmQ',
      linkedin: 'https://linkedin.com/in/sarah-chen-design',
      email: 'sarah.chen@vectorlabs.co'
    }
  },
  {
    id: 'notif-4',
    title: 'Registration Confirmed',
    message: 'Your registration for BIFROST summit is complete.',
    type: 'info',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    timeAgo: 'YESTERDAY',
    isRead: true
  }
];

export const PEER_DIRECTORY: Attendee[] = [
  {
    id: 'usr-101',
    name: 'Sarah Chen',
    role: 'Principal UX Director',
    company: 'Vector Labs',
    accessLevel: 'VIP',
    passType: 'VIP ACCESS',
    email: 'sarah.chen@vectorlabs.co',
    phone: '+1 (650) 412-9832',
    linkedin: 'https://linkedin.com/in/sarah-chen-ux',
    github: 'https://github.com/schen-design',
    twitter: '@schen_spatial',
    bio: 'Pioneering human interaction systems for neural workspaces, high-density HUDs, and ambient spatial intelligence.',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbx_-qxd8_WEYG5ExDRJ2uV-8bWvKFcQTzNyVKoLOI46OTo1fjmKs9Mc63z6quJPwtb_7npFxVawpGLL1ExoN_OEI47iao6vGq0w1JFGLn_T0G1GZlEDo5yDVn1GnmqazBzqGwCgfegFMLbLbsRj9HdUEcqHsImYP5GihGJ0ThmwloAre9apOxreh6le3gQQGpgKpdL26KUM9UI8SAcH4yNNOL9V_hx0en0wtHjqcw4mcG2FcAo-QVmQ',
    location: 'Main Stage Atrium',
    qrPayload: 'BIFROST_USER:usr-101:Sarah Chen:Vector Labs:VIP:sarah.chen@vectorlabs.co',
    checkedIn: true,
    connectedAt: '1h ago',
    notes: 'Met during morning keynote. Interested in collaborating on edge latency UI feedback.'
  },
  {
    id: 'usr-102',
    name: 'Marcus Vance',
    role: 'Head of AI Governance',
    company: 'Aetheria Protocol',
    accessLevel: 'Speaker',
    passType: 'SPEAKER',
    email: 'm.vance@aetheria.org',
    phone: '+1 (202) 555-0193',
    linkedin: 'https://linkedin.com/in/marcus-vance-ai',
    github: 'https://github.com/marcusvance',
    twitter: '@marcus_governance',
    bio: 'Authoring policy frameworks and verifiable zero-knowledge attestations for autonomous agent architectures.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    location: 'Speaker Lounge B',
    qrPayload: 'BIFROST_USER:usr-102:Marcus Vance:Aetheria Protocol:SPEAKER:m.vance@aetheria.org',
    checkedIn: true,
    connectedAt: 'Yesterday',
    notes: 'Speaker on Ethics panel. Connect regarding EU AI Act compliance checks.'
  },
  {
    id: 'usr-103',
    name: 'Dr. Elena Rostova',
    role: 'Lead Researcher',
    company: 'MIT Media Lab',
    accessLevel: 'Speaker',
    passType: 'SPEAKER',
    email: 'e.rostova@media.mit.edu',
    linkedin: 'https://linkedin.com/in/elena-rostova-mit',
    bio: 'Investigating dynamic topological neural representations and automated construction systems.',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbx_-qxd8_WEYG5ExDRJ2uV-8bWvKFcQTzNyVKoLOI46OTo1fjmKs9Mc63z6quJPwtb_7npFxVawpGLL1ExoN_OEI47iao6vGq0w1JFGLn_T0G1GZlEDo5yDVn1GnmqazBzqGwCgfegFMLbLbsRj9HdUEcqHsImYP5GihGJ0ThmwloAre9apOxreh6le3gQQGpgKpdL26KUM9UI8SAcH4yNNOL9V_hx0en0wtHjqcw4mcG2FcAo-QVmQ',
    location: 'Keynote Green Room',
    qrPayload: 'BIFROST_USER:usr-103:Dr. Elena Rostova:MIT Media Lab:SPEAKER:e.rostova@media.mit.edu',
    checkedIn: true
  },
  {
    id: 'usr-104',
    name: 'Liam Davies',
    role: 'Chief Design Officer',
    company: 'Dimension Interactive',
    accessLevel: 'VIP',
    passType: 'VIP ACCESS',
    email: 'liam@dimension.design',
    linkedin: 'https://linkedin.com/in/liam-davies-xr',
    github: 'https://github.com/liamdavies',
    bio: 'Designing next-generation spatial computing interfaces for engineering workflows.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    location: 'Demo Booth 4',
    qrPayload: 'BIFROST_USER:usr-104:Liam Davies:Dimension Interactive:VIP:liam@dimension.design',
    checkedIn: true
  },
  {
    id: 'usr-105',
    name: 'Sophia Zhang',
    role: 'Founder & CEO',
    company: 'HiveMind Systems',
    accessLevel: 'VIP',
    passType: 'VIP ACCESS',
    email: 'sophia@hivemind.systems',
    linkedin: 'https://linkedin.com/in/sophia-zhang-ai',
    bio: 'Scaling autonomous multi-agent pipelines for tier-1 telecommunications and cloud grids.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    location: 'VIP Sky Lounge',
    qrPayload: 'BIFROST_USER:usr-105:Sophia Zhang:HiveMind Systems:VIP:sophia@hivemind.systems',
    checkedIn: true
  }
];

export const INITIAL_CAPACITIES: VenueCapacity[] = [
  {
    id: 'cap-main',
    name: 'Main Stage',
    trackTag: 'KEYNOTE HALL',
    current: 2100,
    max: 2500,
    warningThreshold: 0.90
  },
  {
    id: 'cap-ws-a',
    name: 'Workshop A',
    trackTag: 'TECHNICAL TRACK',
    current: 294,
    max: 300,
    warningThreshold: 0.95
  },
  {
    id: 'cap-rm-b2',
    name: 'Room B2',
    trackTag: 'ETHICS & DESIGN PANEL',
    current: 280,
    max: 350,
    warningThreshold: 0.85
  }
];

export const INITIAL_SCANS: ScanRecord[] = [
  {
    id: 'scan-1',
    attendeeName: 'Alex Mercer',
    attendeeId: '#BF-8492',
    passType: 'VIP PASS',
    timestamp: '2024-10-24T14:02:11Z',
    timeDisplay: '14:02:11',
    status: 'GRANTED',
    location: 'Main Entrance Alpha'
  },
  {
    id: 'scan-2',
    attendeeName: 'Unknown Tag',
    attendeeId: '#EX-9912',
    passType: 'INVALID ID',
    timestamp: '2024-10-24T13:58:44Z',
    timeDisplay: '13:58:44',
    status: 'DENIED',
    reason: 'Expired session credential',
    location: 'Main Entrance Alpha'
  },
  {
    id: 'scan-3',
    attendeeName: 'Sarah Chen',
    attendeeId: '#GA-4011',
    passType: 'GENERAL ADMISSION',
    timestamp: '2024-10-24T13:55:01Z',
    timeDisplay: '13:55:01',
    status: 'GRANTED',
    location: 'Main Entrance Alpha'
  }
];
