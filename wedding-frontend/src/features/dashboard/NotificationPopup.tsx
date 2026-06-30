import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, UserCheck, Gift } from 'lucide-react';

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPopup: React.FC<NotificationPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      <div className="absolute bottom-20 left-4 w-72 bg-white rounded-2xl border border-rose-100/60 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-3 duration-250 text-left">
        <div className="px-4 py-3 bg-linear-to-r from-rose-50/30 to-amber-50/20 border-b border-rose-100/30 flex items-center justify-between text-zinc-800">
          <span className="text-xs font-black font-poppins">Thông báo mới</span>
          <span className="text-[10px] font-black text-rose-500 bg-rose-50 border border-rose-100/60 px-2 py-0.5 rounded-full">3 mới</span>
        </div>
        
        <div className="divide-y divide-zinc-50 max-h-64 overflow-y-auto">
          <div className="p-3 hover:bg-rose-50/10 transition-colors flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 border border-rose-100/40">
              <MessageSquare size={13} />
            </div>
            <div className="space-y-0.5 flex-1">
              <p className="text-[11px] text-zinc-650 leading-relaxed font-poppins">
                <span className="font-bold text-zinc-800">Trần Đức</span> đã gửi lời chúc mới tới thiệp cưới.
              </p>
              <span className="text-[9px] text-zinc-400 font-poppins font-medium">5 phút trước</span>
            </div>
          </div>
          
          <div className="p-3 hover:bg-rose-50/10 transition-colors flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 border border-rose-100/40">
              <UserCheck size={13} />
            </div>
            <div className="space-y-0.5 flex-1">
              <p className="text-[11px] text-zinc-650 leading-relaxed font-poppins">
                <span className="font-bold text-zinc-800">Lê Mai Anh</span> xác nhận tham dự (đi cùng 2 người).
              </p>
              <span className="text-[9px] text-zinc-400 font-poppins font-medium">15 phút trước</span>
            </div>
          </div>
          
          <div className="p-3 hover:bg-rose-50/10 transition-colors flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 border border-rose-100/40">
              <Gift size={13} />
            </div>
            <div className="space-y-0.5 flex-1">
              <p className="text-[11px] text-zinc-650 leading-relaxed font-poppins">
                Bạn nhận được quà mừng mới từ <span className="font-bold text-zinc-800">Gia đình Bác Hùng</span>.
              </p>
              <span className="text-[9px] text-zinc-400 font-poppins font-medium">1 giờ trước</span>
            </div>
          </div>
        </div>
        
        <Link 
          to="/dashboard/wishes" 
          onClick={onClose}
          className="text-[10px] font-black text-center block py-2.5 bg-zinc-50/40 hover:bg-rose-50/20 text-rose-500 border-t border-rose-100/20 transition-all font-poppins no-underline"
        >
          Xem tất cả thông báo
        </Link>
      </div>
    </>
  );
};
