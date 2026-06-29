import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { Edit3, Layout, X, Sparkles, LayoutTemplate } from 'lucide-react';

export const MyCards = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[80vh] p-8 relative">
        <div className="flex justify-between items-center mb-8">
          <div><h1 className="text-2xl font-bold text-gray-900">Thiệp của tôi</h1><p className="text-sm text-gray-500">Quản lý và theo dõi hiệu quả thiệp của bạn</p></div>
          <button onClick={() => setIsModalOpen(true)} className="bg-rose-500 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-rose-600"><Edit3 size={18}/> Tạo thiệp mới</button>
        </div>

        <div className="flex flex-col items-center justify-center py-20 border-t border-gray-100">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-300 mb-4"><Layout size={32} /></div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Chưa có thiệp nào</h3>
          <p className="text-sm text-gray-500 mb-6 text-center">Tạo thiệp đầu tiên của bạn và chia sẻ khoảnh khắc đáng nhớ</p>
          <button onClick={() => setIsModalOpen(true)} className="bg-rose-500 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-rose-600"><Edit3 size={18}/> Tạo thiệp mới</button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-rose-500 p-6 text-white relative">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-white/80 hover:text-white"><X size={20}/></button>
                <h2 className="text-xl font-bold flex items-center gap-2"><Edit3 size={20}/> Tạo thiết kế mới</h2>
                <p className="text-rose-100 text-sm mt-1">Chọn cách bạn muốn bắt đầu</p>
              </div>
              <div className="p-6 space-y-4">
                <Link to="/editor" className="w-full flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-rose-200 hover:bg-rose-50 transition-all text-left">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-500 flex items-center justify-center shrink-0"><Edit3 size={20}/></div>
                  <div><h4 className="font-bold text-gray-900 text-sm">Thiết kế trống</h4><p className="text-xs text-gray-500 mt-1">Tự do sáng tạo trên canvas trắng</p></div>
                </Link>
                <Link to="/dashboard/templates" className="w-full flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all text-left">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-500 flex items-center justify-center shrink-0"><LayoutTemplate size={20}/></div>
                  <div><h4 className="font-bold text-gray-900 text-sm">Mẫu có sẵn</h4><p className="text-xs text-gray-500 mt-1">Khám phá bộ sưu tập mẫu chuyên nghiệp</p></div>
                </Link>
                <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100 text-xs text-orange-700">
                  <span className="font-bold flex items-center gap-1 mb-1"><Sparkles size={16}/> Cần hỗ trợ thiết kế VIP?</span>Liên hệ ngay đội ngũ Zenlove qua Zalo để có thiệp độc quyền.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};