import { CalendarDays, Heart, MessageCircle, RefreshCw } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

export const Wishes = () => {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7 min-h-full">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Lời chúc của tôi</h1>
            <p className="mt-2 text-sm text-slate-500 italic">Quản lý và xem tất cả lời chúc từ các thiệp của bạn.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-rose-500 transition hover:bg-slate-50">
            <RefreshCw size={14} /> Làm mới
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
              <MessageCircle size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Tổng lời chúc</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">0</p>
              <p className="mt-1 text-sm text-slate-500">Số lời chúc đã ghi nhận</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <CalendarDays size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Mới nhất từ</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">Ẩn danh</p>
              <p className="mt-1 text-sm text-slate-500">Chưa có dữ liệu</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <Heart size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Thiệp nhận lời chúc</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">0</p>
              <p className="mt-1 text-sm text-slate-500">Số thiệp hiện có lời chúc gần nhất</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-6 py-4">Người gửi</th>
                <th className="px-6 py-4">Nội dung lời chúc</th>
                <th className="px-6 py-4">Thiệp</th>
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="h-72">
                <td colSpan={5} className="px-6 py-10">
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <Heart size={24} />
                    </div>
                    <p className="text-lg font-semibold text-slate-900">Không có lời chúc nào</p>
                    <p className="max-w-md text-sm text-slate-500">Bạn chưa nhận được lời chúc nào.</p>
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