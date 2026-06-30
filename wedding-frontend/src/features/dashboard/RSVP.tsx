
import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, CheckSquare, Users } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { LoadingState } from '../../components/LoadingState';
import { rsvpApi } from '../../services/api';
import type { RsvpEntry } from '../../services/api';
import { useToast } from '../../components/ToastProvider';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export const RSVP = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [entries, setEntries] = useState<RsvpEntry[]>([]);

  const load = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      const data = await rsvpApi.listForUser();
      setEntries(data);
      if (isRefresh) toast.success('Đã làm mới danh sách RSVP');
    } catch {
      toast.error('Không tải được danh sách RSVP');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, []);

  const attendingCount = entries.filter((e) => e.attending === 'yes').reduce((sum, e) => sum + e.guestCount, 0);
  const declinedCount = entries.filter((e) => e.attending === 'no').length;

  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 min-h-full">
        <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Danh Sách RSVP</h1>
            <p className="text-sm text-gray-500 italic">Theo dõi phản hồi xác nhận tham dự tiệc</p>
          </div>
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-xl hover:bg-gray-50 disabled:opacity-60"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} /> Tải lại
          </button>
        </div>

        {loading ? (
          <LoadingState label="Đang tải danh sách RSVP..." />
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <CheckSquare size={64} className="text-teal-200 mb-4" />
            <h3 className="font-semibold text-gray-700">Chưa có phản hồi tham dự</h3>
            <p className="text-sm text-gray-400 mt-1">Dữ liệu khách mời xác nhận đi tiệc sẽ được thống kê liên tục tại đây.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 mb-8">
              <div className="flex items-center gap-4 rounded-2xl border border-teal-100 bg-teal-50 p-4">
                <div className="h-12 w-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center"><Users size={18} /></div>
                <div>
                  <p className="text-sm text-teal-700 font-medium">Tổng khách xác nhận tham dự</p>
                  <p className="text-2xl font-bold text-teal-700">{attendingCount} khách</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center"><CheckSquare size={18} /></div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Khách báo bận / không tham dự</p>
                  <p className="text-2xl font-bold text-slate-700">{declinedCount} người</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-100">
              <table className="min-w-full divide-y divide-gray-100 text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-3">Tên khách</th>
                    <th className="px-6 py-3">Số điện thoại</th>
                    <th className="px-6 py-3">Trạng thái</th>
                    <th className="px-6 py-3">Số người đi</th>
                    <th className="px-6 py-3">Thời gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {entries.map((e) => (
                    <tr key={e.id} className="hover:bg-gray-50/60">
                      <td className="px-6 py-3 font-semibold text-gray-800">{e.name}</td>
                      <td className="px-6 py-3 text-gray-500">{e.phone || '—'}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${e.attending === 'yes' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {e.attending === 'yes' ? 'Tham dự' : 'Không tham dự'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-600">{e.attending === 'yes' ? e.guestCount : '—'}</td>
                      <td className="px-6 py-3 text-gray-400">{formatDate(e.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};