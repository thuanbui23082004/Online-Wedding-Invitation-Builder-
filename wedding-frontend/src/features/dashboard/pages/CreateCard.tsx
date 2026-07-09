import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { PaletteIcon, LayoutTemplate, Sparkles, Paintbrush, ArrowRight } from 'lucide-react';
import { RevolvingHeartsIcon } from '../../../components/icons/emojione-revolving-hearts';

export const CreateCard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="bg-white/45 backdrop-blur-md rounded-[2.5rem] border border-[rgb(255,166,166)]/30 shadow-lg p-8 sm:p-12 min-h-[75vh]">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-10 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgb(255,237,199)] border border-[rgb(255,166,166)]/30 mb-4">
              <Sparkles size={12} className="text-[rgb(235,76,76)]" />
              <span className="text-[10px] font-black uppercase tracking-wider text-[rgb(235,76,76)]">Bắt đầu thiết kế</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-zinc-800 font-inter tracking-tight leading-tight">
              Tạo thiệp cưới của riêng bạn
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-zinc-550 font-inter font-medium leading-relaxed max-w-2xl">
              Thỏa sức sáng tạo không giới hạn với trình thiết kế kéo-thả chuyên nghiệp hoặc bắt đầu nhanh chóng với kho mẫu được chuẩn bị sẵn bởi nghệ sĩ.
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <Link
              to={`/loading?next=${encodeURIComponent('/design')}&message=${encodeURIComponent('Đang mở trình thiết kế...')}`}
              className="relative flex flex-col justify-between p-8 rounded-[2rem] border border-[rgb(255,166,166)]/40 bg-white/50 backdrop-blur-md hover:border-[rgb(235,76,76)] hover:bg-white/80 transition-all duration-300 group cursor-pointer h-full hover:-translate-y-1 hover:shadow-xl hover:shadow-[rgb(255,166,166)]/15 overflow-hidden"
            >
              {/* Graphic Accent */}
              <div className="absolute -top-10 -right-10 p-10 opacity-5 group-hover:opacity-10 transition-all duration-500 group-hover:rotate-12 text-zinc-800">
                <PaletteIcon size={180} />
              </div>

              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[rgb(255,112,112)] to-[rgb(235,76,76)] text-white flex items-center justify-center mb-6 shadow-md shadow-[rgb(235,76,76)]/20 group-hover:scale-105 transition-transform duration-300">
                  <Paintbrush size={24} strokeWidth={2.5} />
                </div>

                <h3 className="text-xl font-black text-zinc-800 font-inter mb-3 group-hover:text-[rgb(235,76,76)] transition-colors">
                  Bản vẽ thiết kế trống
                </h3>
                <p className="text-xs sm:text-sm text-zinc-550 font-medium font-inter leading-relaxed mb-10">
                  Tự do thiết kế, kéo-thả hình ảnh, đổi phông chữ và nhạc nền hoàn toàn theo sở thích của riêng bạn. Phù hợp cho những ai yêu nghệ thuật sáng tạo.
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100/60">
                <span className="inline-flex items-center gap-1.5 text-xs text-[rgb(235,76,76)] font-bold group-hover:translate-x-1 transition-transform">
                  Bắt đầu ngay <ArrowRight size={13} />
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-600">
                  MIỄN PHÍ
                </span>
              </div>
            </Link>

            <Link
              to="/dashboard/templates"
              className="relative flex flex-col justify-between p-8 rounded-[2rem] border border-[rgb(255,166,166)]/40 bg-white/50 backdrop-blur-md hover:border-[rgb(235,76,76)] hover:bg-white/80 transition-all duration-300 group cursor-pointer h-full hover:-translate-y-1 hover:shadow-xl hover:shadow-[rgb(255,166,166)]/15 overflow-hidden"
            >
              {/* Graphic Accent */}
              <div className="absolute -bottom-10 -right-10 p-10 opacity-5 group-hover:opacity-10 transition-all duration-500 group-hover:-rotate-12 text-zinc-800">
                <LayoutTemplate size={180} />
              </div>

              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[rgb(255,237,199)] to-[rgb(255,112,112)] text-[rgb(235,76,76)] flex items-center justify-center mb-6 shadow-md shadow-[rgb(255,166,166)]/15 group-hover:scale-105 transition-transform duration-300 border border-[rgb(255,166,166)]/30">
                  <LayoutTemplate size={24} strokeWidth={2.5} />
                </div>

                <h3 className="text-xl font-black text-zinc-800 font-inter mb-3 group-hover:text-[rgb(235,76,76)] transition-colors">
                  Chọn từ kho mẫu sẵn
                </h3>
                <p className="text-xs sm:text-sm text-zinc-555 font-medium font-inter leading-relaxed mb-10">
                  Hàng trăm mẫu giao diện sang trọng được thiết kế sẵn bởi các designer chuyên nghiệp, bạn chỉ cần thay đổi thông tin lễ cưới của mình trong 5 phút.
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100/60">
                <span className="inline-flex items-center gap-1.5 text-xs text-[rgb(235,76,76)] font-bold group-hover:translate-x-1 transition-transform">
                  Xem thư viện <ArrowRight size={13} />
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-100 text-amber-600">
                  KHUYÊN DÙNG
                </span>
              </div>
            </Link>
          </div>

          {/* VIP Premium Banner */}
          <div className="relative overflow-hidden p-8 sm:p-10 rounded-[2rem] bg-gradient-to-r from-[rgb(255,237,199)]/35 via-white/50 to-[rgb(255,166,166)]/25 flex flex-col lg:flex-row items-center gap-8 shadow-md border border-[rgb(255,166,166)]/30">
            {/* Premium Gradients */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[rgb(255,166,166)]/25 rounded-full blur-[90px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[rgb(255,237,199)]/30 rounded-full blur-[70px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-[rgb(235,76,76)] shrink-0 shadow-sm relative z-10 border border-[rgb(255,166,166)]/45">
              <RevolvingHeartsIcon size={32} strokeWidth={2} />
            </div>

            <div className="flex-1 text-center lg:text-left relative z-10">
              <h4 className="text-lg sm:text-xl font-black text-slate-800 font-inter mb-2 tracking-tight">Bạn muốn có thiết kế độc quyền?</h4>
              <p className="text-xs sm:text-sm text-zinc-600 font-medium font-inter leading-relaxed max-w-xl">
                Sử dụng dịch vụ hỗ trợ thiết kế <span className="text-[rgb(235,76,76)] font-bold bg-white/70 px-2 py-0.5 rounded-md mx-1 border border-[rgb(255,166,166)]/20 shadow-2xs">Premium 1:1</span>. Các nhà thiết kế của chúng tôi sẽ phác thảo mẫu giao diện độc bản duy nhất dành riêng cho đám cưới của bạn.
              </p>
            </div>

            <a
              href="mailto:support@dearlove.com"
              className="px-8 py-3.5 bg-gradient-to-br from-[rgb(235,76,76)] to-[rgb(255,112,112)] text-white font-bold text-xs rounded-xl transition-all hover:opacity-95 active:scale-95 shadow-md shadow-[rgb(235,76,76)]/25 shrink-0 relative z-10"
            >
              Liên hệ tư vấn
            </a>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};
