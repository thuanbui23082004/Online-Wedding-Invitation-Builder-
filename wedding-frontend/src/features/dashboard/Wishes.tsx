import { CalendarDays, Heart, MessageCircle, RefreshCw } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

export const Wishes = () => {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-4xl border border-rose-100/50 shadow-[0_15px_40px_rgba(244,63,94,0.015)] p-8 min-h-[75vh]">
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-rose-100/30">
          <div>
            <h1 className="text-2xl font-black text-zinc-800 font-poppins">Lời Chúc Đã Nhận</h1>
            <p className="mt-1.5 text-xs text-zinc-400 font-poppins font-medium">Lưu giữ những lời chúc yêu thương gửi đến vợ chồng bạn</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-bold text-rose-500 hover:border-rose-100/85 hover:bg-rose-50/20 active:scale-95 transition-all cursor-pointer">
            <RefreshCw size={13} /> Làm mới
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-3 mb-8">
          <div className="flex items-center gap-4 rounded-2xl border border-rose-100/40 bg-rose-50/10 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-500 border border-rose-100/50 shadow-2xs">
              <MessageCircle size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-400 font-poppins uppercase tracking-wider">Tổng số lời chúc</p>
              <p className="mt-1 text-2xl font-black text-zinc-800 font-poppins">0</p>
              <p className="text-[10px] text-rose-450 font-semibold font-poppins mt-0.5">Lời chúc được ghi nhận</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-amber-100/40 bg-amber-50/10 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100/50 shadow-2xs">
              <CalendarDays size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-400 font-poppins uppercase tracking-wider">Lời chúc mới nhất</p>
              <p className="mt-1 text-sm font-extrabold text-zinc-700 font-poppins">Chưa có lời chúc</p>
              <p className="text-[10px] text-zinc-400 font-medium font-poppins mt-0.5">Không tìm thấy người gửi</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-pink-100/40 bg-pink-50/10 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 text-pink-500 border border-pink-100/50 shadow-2xs">
              <Heart size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-400 font-poppins uppercase tracking-wider">Thiệp nhận lời chúc</p>
              <p className="mt-1 text-2xl font-black text-zinc-800 font-poppins">0</p>
              <p className="text-[10px] text-pink-550 font-semibold font-poppins mt-0.5">Có thiệp được kết nối</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-rose-100/30 bg-white shadow-2xs">
          <table className="min-w-full divide-y divide-zinc-100 text-left text-xs text-zinc-650">
            <thead className="bg-zinc-50/60 text-[10px] font-black uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-6 py-4">Người gửi</th>
                <th className="px-6 py-4">Nội dung lời chúc</th>
                <th className="px-6 py-4">Thiệp cưới</th>
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="h-72">
                <td colSpan={5} className="px-6 py-10">
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50/50 text-rose-400 border border-rose-100/30">
                      <Heart size={20} />
                    </div>
                    <p className="text-sm font-bold text-zinc-750 font-poppins">Không có lời chúc nào</p>
                    <p className="max-w-xs text-xs text-zinc-400 font-poppins font-medium leading-relaxed">
                      Mọi tin nhắn chúc mừng đáng yêu từ bạn bè gửi qua thiệp sẽ tụ họp đầy đủ ở đây.
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};