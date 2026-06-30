import React, { useState } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Check, Send, Mailbox } from 'lucide-react';

export const Feedback = () => {
  const [form, setForm] = useState({
    category: 'Góp ý tính năng',
    title: '',
    message: '',
    contact: ''
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    
    // Simulate sending feedback
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({
        category: 'Góp ý tính năng',
        title: '',
        message: '',
        contact: ''
      });
    }, 2500);
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-4xl border border-rose-100/50 shadow-[0_15px_40px_rgba(244,63,94,0.015)] overflow-hidden min-h-[75vh] flex flex-col lg:flex-row animate-in fade-in duration-500">
        
        <div className="flex-1 p-8 sm:p-10 space-y-6">
          <div>
            <h1 className="text-2xl font-black text-zinc-800 font-poppins">Chia Sẻ & Góp Ý</h1>
            <p className="mt-1.5 text-xs text-zinc-400 font-poppins font-medium">DearLove luôn trân trọng mọi ý kiến đóng góp từ bạn để cải tiến hệ thống tốt hơn</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider">Chủ đề đóng góp <span className="text-rose-500">*</span></label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-850 outline-none focus:border-rose-450 focus:ring-4 focus:ring-rose-50 transition-all bg-white"
                >
                  <option value="Góp ý tính năng">Góp ý tính năng mới</option>
                  <option value="Báo cáo lỗi">Báo cáo lỗi hệ thống</option>
                  <option value="Yêu cầu thiết kế">Yêu cầu thiết kế template</option>
                  <option value="Hợp tác phát triển">Hợp tác phát triển</option>
                  <option value="Chủ đề khác">Ý kiến đóng góp khác</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider">Tiêu đề ngắn gọn</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Ví dụ: Lỗi tải ảnh lên, Ý kiến về nhạc nền..."
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-850 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all bg-white"
                />
              </div>

            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider">Chi tiết nội dung góp ý <span className="text-rose-500">*</span></label>
              <textarea
                rows={5}
                required
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="Hãy chia sẻ ý tưởng của bạn hoặc mô tả chi tiết lỗi bạn gặp phải..."
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-850 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all bg-white resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider">Thông tin liên hệ (Không bắt buộc)</label>
              <input
                type="text"
                value={form.contact}
                onChange={e => setForm({ ...form, contact: e.target.value })}
                placeholder="Số điện thoại hoặc Email của bạn (Nếu muốn nhận phản hồi)"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-850 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all bg-white"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={sent}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white text-xs font-bold transition-all hover:bg-rose-700 active:scale-95 bg-rose-600 cursor-pointer shadow-sm shadow-rose-500/10 disabled:opacity-50"
              >
                {sent ? <><Check size={14} /> Gửi thành công!</> : <><Send size={13} /> Gửi ý kiến đóng góp</>}
              </button>
              <span className="text-[11px] text-zinc-400 font-poppins font-medium text-center sm:text-left">Đội ngũ DearLove sẽ đọc kỹ và cải tiến ngay lập tức</span>
            </div>
          </form>
        </div>

        <div className="w-full lg:w-87.5 bg-linear-to-b from-rose-50/20 via-white to-amber-50/15 lg:border-l border-t lg:border-t-0 border-rose-100/50 p-8 sm:p-10 flex flex-col justify-between space-y-8 relative overflow-hidden shrink-0">
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-rose-100/30 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-amber-100/20 blur-3xl pointer-events-none" />

          <div className="flex flex-col items-center text-center space-y-4 pt-4 z-10">
            <div className="relative w-28 h-28 flex items-center justify-center animate-bounce duration-1000">
              <div className="absolute inset-0 bg-rose-50/60 rounded-full border border-rose-100/50 shadow-2xs scale-90" />
              <Mailbox size={48} className="text-rose-500 relative z-10" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-zinc-800 font-poppins">Hòm Thư DearLove</h3>
              <p className="text-[11px] text-zinc-400 font-poppins font-medium">Nơi lắng nghe mọi tâm tư của bạn</p>
            </div>
          </div>

          <div className="space-y-4 z-10 pt-4 border-t border-rose-100/30">
            <div className="space-y-1">
              <h4 className="text-xs font-black text-zinc-700 font-poppins uppercase tracking-wider">Cùng nhau hoàn thiện</h4>
              <p className="text-[11px] text-zinc-500 font-poppins leading-relaxed">
                Mọi ý kiến của bạn từ đề xuất tính năng hay sửa các lỗi giao diện nhỏ đều được đội ngũ kỹ thuật ghi nhận và cải tiến nhanh chóng.
              </p>
            </div>  
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};
