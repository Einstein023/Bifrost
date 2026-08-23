import React from 'react';
import { AppNotification, Session } from '../types';
import { sound } from '../utils/audio';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onAcceptConnection: (notifId: string, sender: AppNotification['sender']) => void;
  onIgnoreConnection: (notifId: string) => void;
  onOpenSessionById: (sessionId: string) => void;
  onBroadcastTestAlert: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onAcceptConnection,
  onIgnoreConnection,
  onOpenSessionById,
  onBroadcastTestAlert,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const unreadNotifs = notifications.filter((n) => !n.isRead);
  const readNotifs = notifications.filter((n) => n.isRead);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0F0F10]/80 backdrop-blur-sm z-50 transition-opacity"
      />

      {/* Drawer Container (Slide-up on mobile, slide-in on desktop) */}
      <div className="fixed bottom-0 left-0 w-full h-[85vh] md:h-full md:w-[480px] md:right-0 md:left-auto md:top-0 md:bottom-auto bg-[#1A1A1B] z-50 rounded-t-[32px] md:rounded-l-[32px] md:rounded-tr-none flex flex-col border-t md:border-l border-[#2D2D2E] shadow-2xl overflow-hidden animate-in slide-in-from-bottom md:slide-in-from-right duration-300">
        {/* Mobile handle indicator */}
        <div className="w-12 h-1.5 bg-[#444748] rounded-full mx-auto mt-3 md:hidden"></div>

        {/* Header */}
        <div className="px-6 md:px-8 py-6 flex justify-between items-center border-b border-[#2D2D2E]">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase">
              NOTIFICATIONS
            </h2>
            <p className="font-mono text-xs text-[#8E9192] mt-1 uppercase tracking-widest">
              {unreadCount} {unreadCount === 1 ? 'UNREAD ALERT' : 'UNREAD ALERTS'}
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-[#201F20] flex items-center justify-center text-[#C4C7C8] hover:text-white hover:bg-[#2A2A2B] transition-colors border border-[#2D2D2E]"
            aria-label="Close Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-4">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-[#8E9192]">
              <span className="material-symbols-outlined text-4xl mb-2 text-[#444748]">
                notifications_off
              </span>
              <p className="font-mono text-xs uppercase tracking-wider">No notifications</p>
            </div>
          ) : null}

          {/* Unread Alerts */}
          {unreadNotifs.map((notif) => {
            if (notif.type === 'critical') {
              return (
                /* Alert 1: Critical (Red Left Border + Red Glow matching Image 11) */
                <div
                  key={notif.id}
                  className="relative bg-[#131314] rounded-xl p-5 border-l-4 border-[#C61633] glow-red overflow-hidden transition-all hover:bg-[#201F20]"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#C61633]/20 flex items-center justify-center flex-shrink-0">
                      <span
                        className="material-symbols-outlined text-[#FFB4AB] text-[20px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        schedule
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-base font-bold text-white">
                          {notif.title}
                        </h3>
                        <span className="font-mono text-[10px] text-[#8E9192] uppercase">
                          {notif.timeAgo}
                        </span>
                      </div>

                      <p className="text-xs md:text-sm text-[#C4C7C8] leading-relaxed">
                        {notif.message}
                      </p>

                      {notif.sessionId && (
                        <div className="mt-3.5 flex gap-3">
                          <button
                            onClick={() => {
                              sound.playClick();
                              onOpenSessionById(notif.sessionId!);
                              onClose();
                            }}
                            className="px-4 py-2 bg-[#C61633] text-white rounded-full font-mono text-[11px] font-bold uppercase tracking-wider hover:bg-[#92001F] transition-colors shadow-md active:scale-95 flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[14px]">visibility</span>
                            {notif.actionLabel || 'VIEW SESSION'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            if (notif.type === 'venue') {
              return (
                /* Alert 2: Warning/Update (Yellow Left Border + Yellow Glow matching Image 11) */
                <div
                  key={notif.id}
                  className="relative bg-[#131314] rounded-xl p-5 border-l-4 border-[#F6F930] glow-yellow overflow-hidden transition-all hover:bg-[#201F20]"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F6F930]/20 flex items-center justify-center flex-shrink-0">
                      <span
                        className="material-symbols-outlined text-[#F6F930] text-[20px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        location_on
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-base font-bold text-white">
                          {notif.title}
                        </h3>
                        <span className="font-mono text-[10px] text-[#8E9192] uppercase">
                          {notif.timeAgo}
                        </span>
                      </div>

                      <p className="text-xs md:text-sm text-[#C4C7C8] leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            if (notif.type === 'connection' && notif.sender) {
              return (
                /* Alert 3: New Connection Request (White border with avatar and Accept/Ignore) */
                <div
                  key={notif.id}
                  className="relative bg-[#131314] rounded-xl p-5 border-l-4 border-white overflow-hidden transition-all hover:bg-[#201F20]"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={notif.sender.avatar}
                      alt={notif.sender.name}
                      className="w-11 h-11 rounded-full object-cover border border-[#2D2D2E] flex-shrink-0"
                    />

                    <div className="flex-1">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-base font-bold text-white">
                          {notif.title}
                        </h3>
                        <span className="font-mono text-[10px] text-[#8E9192] uppercase">
                          {notif.timeAgo}
                        </span>
                      </div>

                      <p className="text-xs md:text-sm text-[#C4C7C8]">
                        New connection request from{' '}
                        <span className="text-white font-semibold">
                          {notif.sender.name}
                        </span>{' '}
                        ({notif.sender.company}).
                      </p>

                      <div className="mt-4 flex gap-2.5">
                        <button
                          onClick={() => {
                            sound.playSuccess();
                            onAcceptConnection(notif.id, notif.sender);
                          }}
                          className="px-4 py-1.5 bg-white text-[#0F0F10] rounded-full font-mono text-[11px] font-bold uppercase tracking-wider hover:bg-[#F6F930] transition-colors active:scale-95"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => {
                            sound.playClick();
                            onIgnoreConnection(notif.id);
                          }}
                          className="px-4 py-1.5 bg-[#201F20] text-[#C4C7C8] rounded-full font-mono text-[11px] font-semibold uppercase tracking-wider hover:bg-[#2A2A2B] hover:text-white transition-colors active:scale-95"
                        >
                          Ignore
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}

          {/* Older Divider (from Image 11) */}
          {readNotifs.length > 0 && (
            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-1 bg-[#2D2D2E]"></div>
              <span className="font-mono text-[#8E9192] text-[10px] uppercase tracking-widest">
                Older
              </span>
              <div className="h-[1px] flex-1 bg-[#2D2D2E]"></div>
            </div>
          )}

          {/* Older Read Alerts */}
          {readNotifs.map((notif) => (
            <div
              key={notif.id}
              className="relative bg-[#131314]/60 rounded-xl p-4 opacity-75 border border-[#2D2D2E]"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-[#201F20] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[#8E9192] text-[18px]">
                    check_circle
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-sm font-semibold text-[#C4C7C8]">
                      {notif.title}
                    </h4>
                    <span className="font-mono text-[10px] text-[#8E9192] uppercase">
                      {notif.timeAgo}
                    </span>
                  </div>
                  <p className="text-xs text-[#8E9192]">{notif.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-6 md:p-8 border-t border-[#2D2D2E] bg-[#141415] space-y-3">
          <button
            onClick={() => {
              sound.playClick();
              onMarkAllAsRead();
            }}
            disabled={unreadCount === 0}
            className="w-full py-3.5 bg-transparent border border-[#444748] rounded-xl font-mono text-xs text-white uppercase tracking-widest hover:bg-[#201F20] hover:border-white transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed active:scale-98"
          >
            <span className="material-symbols-outlined text-[16px]">done_all</span>
            Mark all as read
          </button>

          {/* Organizer Test Trigger */}
          <button
            onClick={onBroadcastTestAlert}
            className="w-full py-2 text-[10px] font-mono text-[#8E9192] hover:text-[#F6F930] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">campaign</span>
            Simulate Organizer Live Broadcast
          </button>
        </div>
      </div>
    </>
  );
};
