
import { useCallback, useEffect, useState } from 'react';
import { CalendarDays, Gift, RefreshCw } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { LoadingState } from '../../components/LoadingState';
import { giftsApi } from '../../services/api';
import type { GiftEntry } from '../../services/api';
import { useToast } from '../../components/ToastProvider';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

const formatVND = (n: number) => n.toLocaleString('vi-VN') + 'đ';

export const ReceivedGifts = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [gifts, setGifts] = useState<GiftEntry[]>([]);

  const load = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      const data = await giftsApi.listForUser();
      setGifts(data);
      if (isRefresh) toast.success('Đã làm mới danh sách quà tặng');
    } catch {
      toast.error('Không tải được danh sách quà tặng');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, []);

  const totalGifts = gifts.length;
  const latest = gifts[0];

  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7 min-h-full">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Quà Đã Nhận</h1>
            <p className="mt-2 text-sm text-slate-500 italic">Xem tất cả quà đã nhận từ các thiệp của bạn</p>
          </div>
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Làm mới
          </button>
        </div>

        {loading ? (
          <LoadingState label="Đang tải danh sách quà..." />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 mb-10">
              <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                  <Gift size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Tổng số quà</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{totalGifts}</p>
                  <p className="mt-1 text-sm text-slate-500">Số quà đã ghi nhận</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Quà mới nhất</p>
                  <p className="mt-2 text-2xl font-semibold text-emerald-600">{latest ? latest.giftName : 'Chưa có quà nào'}</p>
                  <p className="mt-1 text-sm text-slate-500">{latest ? formatDate(latest.createdAt) : 'Chưa có dữ liệu'}</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">{latest ? latest.senderName : 'Ẩn danh'}</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-slate-100 text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Ngày nhận</th>
                    <th className="px-6 py-4">Người gửi</th>
                    <th className="px-6 py-4">Tên quà</th>
                    <th className="px-6 py-4">Giá trị</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-50">
                  {gifts.length === 0 ? (
                    <tr className="h-72">
                      <td colSpan={4} className="px-6 py-10">
                        <div className="flex flex-col items-center justify-center gap-3 text-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <Gift size={24} />
                          </div>
                          <p className="text-lg font-semibold text-slate-900">Không có quà nào</p>
                          <p className="max-w-md text-sm text-slate-500">Bạn chưa nhận được quà nào từ các thiệp.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    gifts.map((g) => (
                      <tr key={g.id} className="hover:bg-slate-50/60">
                        <td className="px-6 py-4">{formatDate(g.createdAt)}</td>
                        <td className="px-6 py-4 font-semibold text-slate-800">{g.senderName}</td>
                        <td className="px-6 py-4">{g.giftName}</td>
                        <td className="px-6 py-4 font-bold text-rose-600">{formatVND(g.amount)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};