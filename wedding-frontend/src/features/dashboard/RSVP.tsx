import { RefreshCw, CheckSquare } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

export const RSVP = () => {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-4xl border border-rose-100/50 shadow-[0_15px_40px_rgba(244,63,94,0.015)] p-8 min-h-[75vh]">
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-rose-100/30">
          <div>
            <h1 className="text-2xl font-black text-zinc-800 font-poppins">Danh Sách RSVP</h1>
            <p className="mt-1.5 text-xs text-zinc-400 font-poppins font-medium">Theo dõi phản hồi xác nhận tham gia tiệc cưới từ khách mời</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-bold text-zinc-650 hover:text-rose-500 hover:border-rose-100/80 hover:bg-rose-50/20 active:scale-95 transition-all cursor-pointer">
            <RefreshCw size={13} /> Tải lại
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 border border-teal-100/60 text-teal-500 mb-4 shadow-2xs">
            <CheckSquare size={24} />
          </div>
          <h3 className="text-base font-bold text-zinc-750 font-poppins mb-1.5">Chưa có phản hồi tham dự</h3>
          <p className="max-w-xs text-center text-xs text-zinc-400 font-poppins font-medium leading-relaxed">
            Dữ liệu xác nhận tham dự (Số người đi cùng, lời chúc, thực đơn đặc biệt) của khách mời sẽ xuất hiện ngay tại đây.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};