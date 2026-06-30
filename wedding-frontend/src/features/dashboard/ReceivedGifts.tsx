import { CalendarDays, Gift, RefreshCw } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

export const ReceivedGifts = () => {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-4xl border border-rose-100/50 shadow-[0_15px_40px_rgba(244,63,94,0.015)] p-8 min-h-[75vh]">
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-rose-100/30">
          <div>
            <h1 className="text-2xl font-black text-zinc-800 font-poppins">Quà Cưới Đã Nhận</h1>
            <p className="mt-1.5 text-xs text-zinc-400 font-poppins font-medium">Theo dõi danh sách quà mừng và hiện kim từ khách mời gửi tặng</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-bold text-zinc-650 hover:text-rose-500 hover:border-rose-100/80 hover:bg-rose-50/20 active:scale-95 transition-all cursor-pointer">
            <RefreshCw size={13} /> Làm mới
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 mb-8">
          <div className="flex items-center gap-4 rounded-2xl border border-rose-100/40 bg-rose-50/10 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-500 border border-rose-100/50 shadow-2xs">
              <Gift size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-400 font-poppins uppercase tracking-wider">Tổng số quà mừng</p>
              <p className="mt-1 text-2xl font-black text-zinc-800 font-poppins">0</p>
              <p className="text-[10px] text-rose-450 font-semibold font-poppins mt-0.5">Hệ thống ghi nhận</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-amber-100/40 bg-amber-50/10 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100/50 shadow-2xs">
              <CalendarDays size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-400 font-poppins uppercase tracking-wider">Mới nhất từ</p>
              <p className="mt-1 text-sm font-extrabold text-zinc-700 font-poppins">Chưa có quà mừng</p>
              <p className="text-[10px] text-zinc-400 font-medium font-poppins mt-0.5">Dữ liệu sẽ hiển thị khi khách chúc mừng</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-rose-100/30 bg-white shadow-2xs">
          <table className="min-w-full divide-y divide-zinc-100 text-left text-xs text-zinc-650">
            <thead className="bg-zinc-50/60 text-[10px] font-black uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-6 py-4">Ngày nhận</th>
                <th className="px-6 py-4">Người gửi</th>
                <th className="px-6 py-4">Tên quà</th>
                <th className="px-6 py-4">Giá trị</th>
                <th className="px-6 py-4">Thiệp cưới</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="h-72">
                <td colSpan={5} className="px-6 py-10">
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50/50 text-rose-400 border border-rose-100/30">
                      <Gift size={20} />
                    </div>
                    <p className="text-sm font-bold text-zinc-750 font-poppins">Không có quà nào</p>
                    <p className="max-w-xs text-xs text-zinc-400 font-poppins font-medium leading-relaxed">
                      Thông tin quà tặng và hiện kim của khách gửi qua cổng mừng thiệp sẽ được liệt kê tại đây.
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