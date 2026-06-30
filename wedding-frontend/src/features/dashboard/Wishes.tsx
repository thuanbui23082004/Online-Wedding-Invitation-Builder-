
import { useCallback, useEffect, useState } from 'react';
import { CalendarDays, Heart, MessageCircle, RefreshCw, Trash2 } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { LoadingState } from '../../components/LoadingState';
import { wishesApi } from '../../services/api';
import type { Wish } from '../../services/api';
import { useToast, useConfirm } from '../../components/ToastProvider';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export const Wishes = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>([]);

  const load = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      const data = await wishesApi.listForUser();
      setWishes(data);
      if (isRefresh) toast.success('Đã làm mới danh sách lời chúc');
    } catch {
      toast.error('Không tải được lời chúc, vui lòng thử lại');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: 'Xóa lời chúc này?',
      description: 'Lời chúc sẽ bị xóa vĩnh viễn và không thể khôi phục.',
      confirmText: 'Xóa',
      danger: true,
    });
    if (!ok) return;
    await wishesApi.remove(id);
    setWishes((prev) => prev.filter((w) => w.id !== id));
    toast.success('Đã xóa lời chúc');
  };

  const totalWishes = wishes.length;
  const latestFrom = wishes[0]?.name || 'Ẩn danh';
  const cardsWithWish = new Set(wishes.map((w) => w.cardId)).size;

  return (
    <DashboardLayout>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7 min-h-full">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Lời chúc của tôi</h1>
            <p className="mt-2 text-sm text-slate-500 italic">Quản lý và xem tất cả lời chúc từ các thiệp của bạn.</p>
          </div>
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-rose-500 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Làm mới
          </button>
        </div>

        {loading ? (
          <LoadingState label="Đang tải lời chúc..." />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3 mb-8">
              <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Tổng lời chúc</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{totalWishes}</p>
                  <p className="mt-1 text-sm text-slate-500">Số lời chúc đã ghi nhận</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Mới nhất từ</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{latestFrom}</p>
                  <p className="mt-1 text-sm text-slate-500">{wishes[0] ? formatDate(wishes[0].createdAt) : 'Chưa có dữ liệu'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                  <Heart size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Thiệp nhận lời chúc</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{cardsWithWish}</p>
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
                    <th className="px-6 py-4">Thời gian</th>
                    <th className="px-6 py-4">Hành động</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-50">
                  {wishes.length === 0 ? (
                    <tr className="h-72">
                      <td colSpan={4} className="px-6 py-10">
                        <div className="flex flex-col items-center justify-center gap-3 text-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <Heart size={24} />
                          </div>
                          <p className="text-lg font-semibold text-slate-900">Không có lời chúc nào</p>
                          <p className="max-w-md text-sm text-slate-500">Bạn chưa nhận được lời chúc nào.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    wishes.map((w) => (
                      <tr key={w.id} className="hover:bg-slate-50/60">
                        <td className="px-6 py-4 font-semibold text-slate-800">{w.name}</td>
                        <td className="px-6 py-4 max-w-md">{w.message}</td>
                        <td className="px-6 py-4 text-slate-400">{formatDate(w.createdAt)}</td>
                        <td className="px-6 py-4">
                          <button onClick={() => handleDelete(w.id)} className="text-slate-400 hover:text-red-500" title="Xóa">
                            <Trash2 size={15} />
                          </button>
                        </td>
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