import React, { useState } from 'react';
import { ScanRecord, VenueCapacity } from '../types';
import { sound } from '../utils/audio';

interface ConsoleViewProps {
  capacities: VenueCapacity[];
  scanRecords: ScanRecord[];
  onStartScanner: () => void;
  onSimulateScan: (type: 'VIP' | 'GENERAL' | 'INVALID') => void;
  onClearLogs: () => void;
}

export const ConsoleView: React.FC<ConsoleViewProps> = ({
  capacities,
  scanRecords,
  onStartScanner,
  onSimulateScan,
  onClearLogs,
}) => {
  const [showLookupModal, setShowLookupModal] = useState(false);
  const [lookupId, setLookupId] = useState('');
  const [lookupResult, setLookupResult] = useState<string | null>(null);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupId.trim()) return;

    if (lookupId.toUpperCase().includes('BF') || lookupId.toUpperCase().includes('ALEX')) {
      sound.playGranted();
      setLookupResult('VALID: Alex Mercer (#BF-8492) — VIP ACCESS granted.');
    } else if (lookupId.toUpperCase().includes('SARAH') || lookupId.toUpperCase().includes('GA')) {
      sound.playGranted();
      setLookupResult('VALID: Sarah Chen (#GA-4011) — GENERAL ADMISSION granted.');
    } else {
      sound.playDenied();
      setLookupResult('DENIED: Badge ID not found or expired.');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-8">
      {/* Top Header matching Image 13 */}
      <div className="flex justify-between items-center border-b border-[#2D2D2E] pb-4">
        <h2 className="text-3xl font-extrabold text-white tracking-tighter uppercase">
          CONSOLE
        </h2>
        <div className="flex items-center gap-2">
          <span className="bg-[#201F20] text-[#C4C7C8] border border-[#2D2D2E] px-3 py-1 rounded-full font-mono text-xs font-bold tracking-widest">
            OP
          </span>
          <span className="font-mono text-[10px] text-[#8E9192] uppercase">
            STATION #01
          </span>
        </div>
      </div>

      {/* Main Check-In Card with Big Yellow Pulsing Circle Button (Image 13) */}
      <div className="bg-[#1A1A1B] rounded-[32px] p-8 md:p-10 border border-[#2D2D2E] flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl group">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F6F930]/5 via-transparent to-transparent pointer-events-none"></div>

        <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase mb-3">
          CHECK-IN READY
        </h3>

        <div className="bg-[#0F0F10] border border-[#2D2D2E] px-4 py-1 rounded-full font-mono text-xs text-[#C4C7C8] tracking-widest uppercase mb-10">
          MAIN ENTRANCE ALPHA
        </div>

        {/* Big Yellow Scanner Button */}
        <div className="relative my-4">
          {/* Pulsing Aura */}
          <div className="absolute inset-0 rounded-full bg-[#F6F930] opacity-30 blur-2xl animate-pulse scale-110"></div>

          <button
            onClick={() => {
              sound.playClick();
              onStartScanner();
            }}
            className="relative w-56 h-56 md:w-64 md:h-64 rounded-full bg-[#F6F930] hover:bg-[#FAF960] active:scale-95 transition-all duration-300 flex flex-col items-center justify-center text-[#0F0F10] shadow-[0_0_50px_rgba(246,249,48,0.4)] group/scan cursor-pointer"
          >
            <span className="material-symbols-outlined text-6xl md:text-7xl mb-2 font-light group-hover/scan:scale-110 transition-transform">
              qr_code_scanner
            </span>
            <span className="font-mono text-sm md:text-base font-extrabold tracking-widest uppercase">
              START SCANNER
            </span>
          </button>
        </div>

        {/* Quick Testing Actions */}
        <div className="mt-8 pt-6 border-t border-[#2D2D2E] w-full flex flex-wrap items-center justify-center gap-2">
          <span className="font-mono text-[10px] text-[#8E9192] uppercase w-full mb-1">
            Operator Quick Test:
          </span>
          <button
            onClick={() => onSimulateScan('VIP')}
            className="px-3 py-1 bg-[#201F20] hover:bg-[#2A2A2B] text-[#F6F930] border border-[#F6F930]/30 rounded-lg font-mono text-[10px] uppercase font-bold"
          >
            + Test VIP (Grant)
          </button>
          <button
            onClick={() => onSimulateScan('GENERAL')}
            className="px-3 py-1 bg-[#201F20] hover:bg-[#2A2A2B] text-white border border-[#444748] rounded-lg font-mono text-[10px] uppercase font-bold"
          >
            + Test General (Grant)
          </button>
          <button
            onClick={() => onSimulateScan('INVALID')}
            className="px-3 py-1 bg-[#201F20] hover:bg-[#2A2A2B] text-[#FFB4AB] border border-[#C61633]/50 rounded-lg font-mono text-[10px] uppercase font-bold"
          >
            + Test Invalid (Deny)
          </button>
        </div>
      </div>

      {/* Live Capacity Section matching Image 13 */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-mono text-xs text-[#8E9192] tracking-widest uppercase">
            LIVE CAPACITY
          </span>
          <span className="font-mono text-[11px] text-[#F6F930] bg-[#F6F930]/10 border border-[#F6F930]/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F6F930]"></span>
            Live
          </span>
        </div>

        <div className="space-y-3">
          {capacities.map((cap) => {
            const percent = Math.round((cap.current / cap.max) * 100);
            const remaining = cap.max - cap.current;
            const isWarning = percent >= 95;

            return (
              <div
                key={cap.id}
                className="bg-[#1A1A1B] rounded-2xl p-6 border border-[#2D2D2E] space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-bold text-white tracking-tight">
                      {cap.name}
                    </h4>
                    <span className="font-mono text-[10px] text-[#8E9192] uppercase tracking-wider block mt-0.5">
                      {cap.trackTag}
                    </span>
                  </div>

                  <span
                    className={`text-2xl font-extrabold tracking-tight ${
                      isWarning ? 'text-[#D7263D]' : 'text-white'
                    }`}
                  >
                    {percent}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-[#0F0F10] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isWarning ? 'bg-[#D7263D]' : 'bg-white'
                    }`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  ></div>
                </div>

                {/* Bottom counts */}
                <div className="flex justify-between items-center font-mono text-xs">
                  <span className="text-[#C4C7C8]">
                    {cap.current.toLocaleString()} / {cap.max.toLocaleString()}
                  </span>

                  <span
                    className={`font-semibold uppercase tracking-wider ${
                      isWarning
                        ? 'text-[#D7263D] bg-[#D7263D]/10 px-2 py-0.5 rounded border border-[#D7263D]/30'
                        : 'text-[#8E9192] bg-[#201F20] px-2 py-0.5 rounded border border-[#2D2D2E]'
                    }`}
                  >
                    {remaining} REMAINING
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Scans Section matching Image 13 */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-mono text-xs text-[#8E9192] tracking-widest uppercase">
            RECENT SCANS
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLookupModal(true)}
              className="font-mono text-[11px] text-[#C4C7C8] hover:text-[#F6F930] uppercase tracking-wider"
            >
              Manual Lookup
            </button>
            <span className="text-[#444748]">•</span>
            <button
              onClick={onClearLogs}
              className="font-mono text-[11px] text-[#8E9192] hover:text-[#FFB4AB] uppercase tracking-wider"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="bg-[#1A1A1B] rounded-2xl border border-[#2D2D2E] divide-y divide-[#2D2D2E] overflow-hidden">
          {scanRecords.length === 0 ? (
            <div className="p-8 text-center text-[#8E9192] font-mono text-xs uppercase">
              No scans recorded yet. Tap Start Scanner above.
            </div>
          ) : (
            scanRecords.map((scan) => (
              <div
                key={scan.id}
                className="p-4 md:p-5 flex items-center justify-between gap-4 hover:bg-[#201F20] transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      scan.status === 'GRANTED'
                        ? scan.passType.includes('VIP')
                          ? 'bg-[#F6F930] shadow-[0_0_8px_rgba(246,249,48,0.6)]'
                          : 'bg-[#C4C7C8]'
                        : 'bg-[#D7263D] shadow-[0_0_8px_rgba(215,38,61,0.6)]'
                    }`}
                  ></div>

                  <div>
                    <h5 className="text-sm md:text-base font-bold text-white">
                      {scan.attendeeName}
                    </h5>
                    <p className="font-mono text-[10px] text-[#8E9192] uppercase">
                      {scan.passType} • {scan.timeDisplay}
                    </p>
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded-sm font-mono text-[11px] font-bold uppercase tracking-wider ${
                    scan.status === 'GRANTED'
                      ? scan.passType.includes('VIP')
                        ? 'border border-[#F6F930]/60 bg-[#F6F930]/10 text-[#F6F930]'
                        : 'border border-[#444748] bg-[#201F20] text-white'
                      : 'border border-[#C61633]/60 bg-[#C61633]/15 text-[#FFB4AB]'
                  }`}
                >
                  {scan.status}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Manual Lookup Modal */}
      {showLookupModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1B] border border-[#2D2D2E] rounded-3xl max-w-md w-full p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-[#2D2D2E] pb-3">
              <h4 className="text-lg font-bold text-white uppercase font-mono">
                Manual Attendee Lookup
              </h4>
              <button
                onClick={() => setShowLookupModal(false)}
                className="text-[#8E9192] hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <label className="font-mono text-xs text-[#8E9192] uppercase block mb-1.5">
                  Attendee ID or Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. #BF-8492 or Alex"
                  value={lookupId}
                  onChange={(e) => setLookupId(e.target.value)}
                  className="w-full bg-[#0F0F10] border border-[#2D2D2E] focus:border-[#F6F930] rounded-xl px-4 py-2.5 text-white font-mono text-sm outline-none"
                  autoFocus
                />
              </div>

              {lookupResult && (
                <div
                  className={`p-3.5 rounded-xl font-mono text-xs ${
                    lookupResult.startsWith('VALID')
                      ? 'bg-[#F6F930]/10 border border-[#F6F930]/40 text-[#F6F930]'
                      : 'bg-[#C61633]/15 border border-[#C61633]/50 text-[#FFB4AB]'
                  }`}
                >
                  {lookupResult}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLookupModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#201F20] text-[#C4C7C8] font-mono text-xs uppercase"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F6F930] text-[#0F0F10] font-mono text-xs font-bold uppercase hover:bg-white transition-colors"
                >
                  Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
