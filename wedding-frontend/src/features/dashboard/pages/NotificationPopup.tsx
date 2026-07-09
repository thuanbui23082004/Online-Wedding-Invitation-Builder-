import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, MessageSquare, UserCheck } from 'lucide-react';

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPopup: React.FC<NotificationPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const quickLinks = [
    { label: 'Lời chúc mới', icon: MessageSquare, to: '/dashboard/wishes', color: 'text-[rgb(235,76,76)] bg-[rgb(255,240,240)] border-[rgb(255,220,220)]/45' },
    { label: 'Xác nhận RSVP', icon: UserCheck, to: '/dashboard/rsvp', color: 'text-teal-600 bg-teal-50 border-teal-100/40' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="absolute bottom-20 left-4 w-72 bg-white rounded-2xl border border-[rgb(255,220,220)]/60 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-3 duration-250 text-left">
        <div className="px-4 py-3 bg-linear-to-r from-[rgba(235,76,76,0.05)] to-[rgba(255,237,199,0.2)] border-b border-[rgb(255,220,220)]/30 flex items-center justify-between text-zinc-800">
          <span className="text-xs font-black font-inter">Thông báo</span>
          <Bell size={13} className="text-zinc-400" />
        </div>

        {/* Quick nav shortcuts */}
        <div className="p-3 space-y-2">
          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-wider px-1 mb-1">Truy cập nhanh</p>
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${link.color} hover:opacity-80 transition-opacity no-underline`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${link.color}`}>
                  <Icon size={13} />
                </div>
                <span className="text-[11px] font-bold text-zinc-700 font-inter">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Empty state */}
        <div className="px-4 pb-4 flex flex-col items-center text-center gap-1.5">
          <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-300">
            <Bell size={18} />
          </div>
          <p className="text-[11px] font-semibold text-zinc-500 font-inter">Chưa có thông báo mới</p>
          <p className="text-[9px] text-zinc-400 font-inter leading-relaxed">
            Khi có lời chúc hoặc RSVP mới, bạn sẽ thấy ở đây.
          </p>
        </div>

        <Link
          to="/dashboard/wishes"
          onClick={onClose}
          className="text-[10px] font-black text-center block py-2.5 bg-zinc-50/40 hover:bg-[rgba(235,76,76,0.05)] text-[rgb(235,76,76)] border-t border-[rgb(255,220,220)]/20 transition-all font-inter no-underline"
        >
          Xem tất cả lời chúc →
        </Link>
      </div>
    </>
  );
};
