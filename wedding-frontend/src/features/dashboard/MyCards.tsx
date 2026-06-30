import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { Edit3, X, Sparkles, LayoutTemplate } from 'lucide-react';
import { BsEnvelopePaperHeart } from "react-icons/bs";


export const MyCards = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="bg-white rounded-4xl border border-rose-100/50 shadow-[0_15px_40px_rgba(244,63,94,0.015)] p-8 min-h-[75vh]">
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-rose-100/30">
          <div>
            <h1 className="text-2xl font-black text-zinc-800 font-poppins">Thiệp Của Tôi</h1>
            <p className="mt-1.5 text-xs text-zinc-400 font-poppins font-medium">Quản lý và phát triển thiết kế thiệp cưới di động của bạn</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm shadow-rose-500/10 hover:shadow-rose-500/20 cursor-pointer"
          >
            <Edit3 size={14} /> Tạo thiệp mới
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-rose-50/50 border border-rose-100/30 rounded-2xl flex items-center justify-center text-rose-500 mb-4 shadow-2xs">
            <BsEnvelopePaperHeart size={26} />
          </div>
          <h3 className="text-base font-bold text-zinc-750 font-poppins mb-1">Chưa có thiệp cưới nào</h3>
          <p className="text-xs text-zinc-400 font-poppins font-medium mb-6 text-center max-w-xs leading-relaxed">
            Thiết kế thiệp đầu tiên để gửi gắm thông điệp lãng mạn tới mọi khách mời của bạn.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm shadow-rose-500/10 cursor-pointer"
          >
            <Edit3 size={14} /> Tạo thiệp ngay
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-255 border border-rose-100/40">
              <div className="bg-linear-to-br from-rose-50/50 via-white to-amber-50/30 border-b border-rose-100/30 p-6 text-zinc-800 relative">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="absolute top-4 right-4 text-zinc-400 hover:text-rose-500 cursor-pointer"
                >
                  <X size={18} />
                </button>
                <h2 className="text-lg font-black flex items-center gap-2 font-poppins text-zinc-800">
                  <Edit3 size={18} className="text-rose-500" /> Tạo thiệp mời mới
                </h2>
                <p className="text-zinc-400 text-xs mt-1 font-medium font-poppins">Chọn phương thức bắt đầu thiết kế</p>
              </div>
              <div className="p-6 space-y-4">
                <Link 
                  to="/editor" 
                  className="w-full flex items-start gap-4 p-4 rounded-2xl border border-zinc-100 hover:border-rose-200 hover:bg-rose-50/20 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100/50 text-rose-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-all"><Edit3 size={18}/></div>
                  <div>
                    <h4 className="font-extrabold text-zinc-800 text-sm font-poppins">Bản vẽ thiết kế trống</h4>
                    <p className="text-[11px] text-zinc-400 mt-1 font-poppins font-medium">Tự do bố cục và sáng tạo từ canvas trắng tinh</p>
                  </div>
                </Link>
                <Link 
                  to="/dashboard/templates" 
                  className="w-full flex items-start gap-4 p-4 rounded-2xl border border-zinc-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100/50 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-all"><LayoutTemplate size={18}/></div>
                  <div>
                    <h4 className="font-extrabold text-zinc-800 text-sm font-poppins">Chọn mẫu thiệp có sẵn</h4>
                    <p className="text-[11px] text-zinc-400 mt-1 font-poppins font-medium">Khám phá và sử dụng các bản mẫu chuyên nghiệp</p>
                  </div>
                </Link>
                <div className="mt-6 p-4 bg-amber-50/40 rounded-2xl border border-amber-100/50 text-xs text-amber-700 font-poppins leading-relaxed">
                  <span className="font-black flex items-center gap-1 mb-1 text-amber-800"><Sparkles size={14}/> Bạn muốn thiết kế riêng (VIP)?</span>
                  Liên hệ ngay với bộ phận tư vấn của DearLove để nhận thiệp độc quyền cho đám cưới của bạn.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};