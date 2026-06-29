
import { RefreshCw, CheckSquare } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

export const RSVP = () => {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 min-h-full">
        <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-100">
          <div><h1 className="text-2xl font-bold text-gray-900 mb-1">Danh Sách RSVP</h1><p className="text-sm text-gray-500 italic">Theo dõi phản hồi xác nhận tham dự tiệc</p></div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-xl hover:bg-gray-50"><RefreshCw size={16}/> Tải lại</button>
        </div>
        <div className="flex flex-col items-center justify-center py-24"><CheckSquare size={64} className="text-teal-200 mb-4"/><h3 className="font-semibold text-gray-700">Chưa có phản hồi tham dự</h3><p className="text-sm text-gray-400 mt-1">Dữ liệu khách mời xác nhận đi tiệc sẽ được thống kê liên tục tại đây.</p></div>
      </div>
    </DashboardLayout>
  );
};