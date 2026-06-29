
import { Link } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { Crown, Sparkles, Image as ImageIcon, CreditCard, Eye, LayoutTemplate, Heart, Users, Headphones, ArrowRight, TrendingUp } from 'lucide-react';

export const Overview = () => {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-8 text-white shadow-xl">
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md text-rose-300 border border-white/10">
                <Sparkles size={14} /> KHÔNG GIAN SÁNG TẠO
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">Chào Nguyen!</h1>
              <p className="text-slate-300 text-sm max-w-xl">Bạn đang dùng gói trải nghiệm tự do với đầy đủ các công cụ thiết kế thiệp cưới di động.</p>
            </div>
            <Link to="/editor" className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-rose-500/30 hover:opacity-90 transition-all shrink-0">
              <span>Tạo thiệp mới ngay</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white p-6 border border-slate-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500"><ImageIcon size={24} /></div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1"><TrendingUp size={12}/> Tối ưu</span>
            </div>
            <p className="text-sm font-medium text-slate-500">Kho lưu trữ ảnh</p>
            <p className="text-3xl font-black text-slate-800">0 <span className="text-sm font-normal text-slate-400">/ 10 tệp</span></p>
            <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"><div className="bg-rose-500 h-full w-[5%]" /></div>
          </div>

          <div className="rounded-2xl bg-white p-6 border border-slate-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600"><CreditCard size={24} /></div>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">Sẵn sàng</span>
            </div>
            <p className="text-sm font-medium text-slate-500">Thiệp đang kích hoạt</p>
            <p className="text-3xl font-black text-slate-800">0 <span className="text-sm font-normal text-slate-400">/ 1 thiệp</span></p>
            <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"><div className="bg-purple-600 h-full w-[0%]" /></div>
          </div>

          <div className="rounded-2xl bg-white p-6 border border-slate-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600"><Eye size={24} /></div>
              <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">Reset sau 30 ngày</span>
            </div>
            <p className="text-sm font-medium text-slate-500">Lượt khách truy cập</p>
            <p className="text-3xl font-black text-slate-800">0 <span className="text-sm font-normal text-slate-400">/ 300 lượt</span></p>
            <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"><div className="bg-amber-500 h-full w-[0%]" /></div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Khu vực điều hướng nhanh</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { icon: LayoutTemplate, label: 'Kho Mẫu Thiệp', path: '/dashboard/templates', color: 'text-blue-600 bg-blue-50' },
              { icon: Heart, label: 'Lời Chúc', path: '/dashboard/wishes', color: 'text-rose-500 bg-rose-50' },
              { icon: Users, label: 'Khách RSVP', path: '/dashboard/rsvp', color: 'text-teal-600 bg-teal-50' },
              { icon: Crown, label: 'Nâng Cấp VIP', path: '/dashboard/plan', color: 'text-amber-600 bg-amber-50' },
              { icon: Headphones, label: 'Hỗ Trợ', path: '/dashboard/account', color: 'text-purple-600 bg-purple-50' },
            ].map((item, idx) => (
              <Link key={idx} to={item.path} className="flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all shadow-sm">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-3 ${item.color}`}><item.icon size={26} /></div>
                <span className="text-sm font-bold text-slate-700">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};