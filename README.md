# BIFROST — Digital Conference Pass & Summit Companion

[![React](https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**BIFROST** is a production-grade, dark-mode digital conference pass and attendee networking application engineered for large-scale multi-track summits. It solves the friction of paper badges, crowded venues, and lost connections through **real-time conference friend proximity radar**, **offline peer QR contact swaps (vCards)**, and an **interactive live agenda**.

---

## Key Features

### 1. Conference Friend Radar & Same-Room Proximity
- **Real-Time Same-Room Alerts**: Automatically detects when a connected friend or colleague is sitting in the same session hall (e.g. *Main Stage* or *Workshop A*), delivering an unobtrusive proximity banner and custom audio chime.
- **Micro-Interactions**: Send an instant **Wave 👋** or **Coffee Invitation ☕** directly from proximity notifications or the friends directory.
- **Discovery & Search**: Browse the summit directory filtered by colleagues, keynote speakers, or peers in your current room, or look up attendees instantly by Attendee ID (e.g. `#BF-8492`).
- **Connection Management**: Send, accept, or decline friend requests with live state updates and simulated real-time peer interactions.

### 2. High-Contrast Digital Pass & Offline vCard Swap
- **Tiered Badges**: Digital passes with distinct security colorways and iconography for **General**, **VIP All-Access**, and **Speaker** credentials.
- **Zero-Connectivity vCard Exchange**: Generates an RFC-compliant QR code encoding standard `.vcf` contact card data. Attendees can scan badges directly with iOS/Android camera apps or the built-in scanner without relying on congested conference Wi-Fi.
- **Interactive Camera Scanner**: Built-in camera scanner with fallback manual check-in and QR simulation controls.

### 3. Live 48-Hour Multi-Track Agenda
- **Multi-Track Timetable**: Filter sessions across **AI & Architecture**, **Systems & Edge**, and **Policy & Governance**.
- **Live Now Telemetry**: Highlights active keynotes with progress bars, countdown tickers, venue room badges, and live capacity gauges.
- **Personalized Schedule**: Bookmark sessions with instant toggle synchronization across the attendee dashboard.
- **Session Modals**: Deep-dive into session abstracts, prerequisites, speaker credentials, and direct room navigation coordinates.

### 4. Organizer Console & Announcement Center
- **Notifications Hub**: Central drawer aggregating room updates, upcoming session alerts, friend arrivals, and connection requests.
- **Organizer Broadcast Controls**: Administrative interface for testing live announcements, emergency venue updates, and real-time alerts.
- **Multi-Account Switching**: Built-in test account switcher (General Attendee, VIP, Speaker) to preview role-based views and permissions seamlessly.

### 5. Acoustic UI & Micro-Animations
- **Web Audio API Synthesizer**: Custom synthesized sound palette for badge scans, incoming waves, friend alerts, and interface clicks—with zero external audio assets.
- **Motion Fluidity**: Powered by `motion/react` for buttery-smooth drawer transitions, modal reveals, and radar sweep pulses.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/) |
| **Language** | [TypeScript 5.8](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`) |
| **Animation** | [Motion](https://motion.dev/) (`motion/react`) |
| **Icons & Symbols** | [Lucide React](https://lucide.dev/) + Google Material Symbols |
| **QR Code Engine** | [`qrcode.react`](https://www.npmjs.com/package/qrcode.react) (Canvas & SVG renderers) |
| **Celebrations** | [`canvas-confetti`](https://www.npmjs.com/package/canvas-confetti) |
| **Audio** | Native HTML5 Web Audio API (Synthesizer Oscillator Node) |

---

## Architecture & Project Structure

```text
├── index.html                  # HTML entry point with typography preloads
├── metadata.json               # App metadata, capabilities & permissions
├── package.json                # Project dependencies & scripts
├── vite.config.ts              # Vite + Tailwind v4 + React plugin setup
└── src/
    ├── main.tsx                # React root bootstrap
    ├── App.tsx                 # Core state engine, routing & notification pipeline
    ├── index.css               # Global Tailwind CSS imports & custom variables
    ├── types/
    │   └── index.ts            # Type definitions (Attendee, Session, Pass, Notification)
    ├── data/
    │   └── mockData.ts         # Seed data for attendees, agenda, passes & demo accounts
    ├── utils/
    │   ├── audio.ts            # Web Audio API sound synthesizer
    │   └── vcard.ts            # RFC vCard generator & parser for offline contact swaps
    └── components/
        ├── LandingPageView.tsx      # Public conference landing page with friend radar hero
        ├── DashboardView.tsx        # Personal attendee hub with live pass & schedule
        ├── NetworkView.tsx          # Friends directory, radar tabs & QR contact swap
        ├── AgendaView.tsx           # Multi-track agenda timeline & bookmarking
        ├── ConsoleView.tsx          # Organizer announcement console
        ├── FriendProximityToast.tsx # Real-time same-room alert toast notification
        ├── PassModal.tsx            # Fullscreen interactive pass & QR display
        ├── PassCard.tsx             # Ticket card component with barcode & chip
        ├── ScannerModal.tsx         # Camera barcode & QR reader
        ├── SessionDetailModal.tsx   # Detailed keynote & workshop modal
        ├── PeerProfileModal.tsx     # Attendee contact card & connection modal
        ├── NotificationsDrawer.tsx  # Slide-over activity & alert center
        ├── MenuDrawer.tsx           # Quick navigation & account profile drawer
        ├── TopAppBar.tsx            # Navigation header with sound & search controls
        ├── BottomNavBar.tsx         # Mobile-optimized dock navigation
        └── AuthModal.tsx            # Check-in, sign in & demo account switcher
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** (v9+) or **pnpm** / **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/bifrost-conference-pass.git
   cd bifrost-conference-pass
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

4. **Type check & build for production**:
   ```bash
   # Run TypeScript verification
   npm run lint

   # Compile optimized static bundle
   npm run build
   ```

---

## Usage Guide

### Simulating Friend Proximity
1. Navigate to the **Friends** tab (`/network`) or use the interactive radar on the **Landing Page**.
2. Click **"Test Room Alert"** to trigger a real-time proximity event where a colleague sits down in your same room.
3. Observe the audio chime, proximity toast banner, and quick-action buttons (**Wave 👋**, **Meet for Coffee ☕**, or **View Profile**).

### Exchanging Passes Offline
1. Tap **"My Pass & QR"** in the navigation or dashboard.
2. Select your pass to display the high-contrast QR badge.
3. On another device (or using the built-in **Scan Badge** button), scan the code to instantly import the attendee's vCard profile directly into your contacts.

### Exploring the Agenda
1. Switch to the **Agenda** view.
2. Filter sessions by **Track** (AI, Systems, Policy) or **Day 1 / Day 2**.
3. Click the bookmark icon to pin sessions to your personal dashboard agenda.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
