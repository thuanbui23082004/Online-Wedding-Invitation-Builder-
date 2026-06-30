import { Link } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { Crown, Sparkles, ArrowRight, Sparkle, ArrowUpRight } from 'lucide-react';
import FloatingBackgroundHearts from '../../components/FloatingBackgroundHearts';

// --- Custom Icon Components ---

interface CustomIconProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  background?: string;
  opacity?: number;
  rotation?: number;
  shadow?: number;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  padding?: number;
}

const Clipboard2HeartFillIcon = ({
  size = 24,
  color = 'currentColor',
  background = 'transparent',
  opacity = 1,
  rotation = 0,
  shadow = 0,
  flipHorizontal = false,
  flipVertical = false,
  padding = 0
}: CustomIconProps) => {
  const baseViewBox = 16;
  const transforms = [];
  if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
  if (flipHorizontal) transforms.push('scaleX(-1)');
  if (flipVertical) transforms.push('scaleY(-1)');

  const viewBoxSize = baseViewBox + (padding * 2);
  const viewBoxOffset = -padding;
  const viewBox = `${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={size}
      height={size}
      style={{
        opacity,
        color,
        transform: transforms.join(' ') || undefined,
        filter: shadow > 0 ? `drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))` : undefined,
        backgroundColor: background !== 'transparent' ? background : undefined
      }}
    >
      <g fill="currentColor" fillRule="evenodd"><path d="M10.058.501a.5.5 0 0 0-.5-.501h-2.98c-.276 0-.5.225-.5.501A.5.5 0 0 1 5.582 1a.497.497 0 0 0-.497.497V2a.5.5 0 0 0 .5.5h4.968a.5.5 0 0 0 .5-.5v-.503A.497.497 0 0 0 10.555 1a.5.5 0 0 1-.497-.499"/><path d="M4.174 1h-.57a1.5 1.5 0 0 0-1.5 1.5v12a1.5 1.5 0 0 0 1.5 1.5h9a1.5 1.5 0 0 0 1.5-1.5v-12a1.5 1.5 0 0 0-1.5-1.5h-.642q.084.236.085.5V2c0 .828-.668 1.5-1.492 1.5H5.581A1.496 1.496 0 0 1 4.09 2v-.5q.001-.264.085-.5Zm3.894 5.482c1.656-1.673 5.795 1.254 0 5.018c-5.795-3.764-1.656-6.69 0-5.018"/></g>
    </svg>
  );
};

const ImageSizeSelectActualIcon = ({
  size = 24,
  color = 'currentColor',
  background = 'transparent',
  opacity = 1,
  rotation = 0,
  shadow = 0,
  flipHorizontal = false,
  flipVertical = false,
  padding = 0
}: CustomIconProps) => {
  const baseViewBox = 24;
  const transforms = [];
  if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
  if (flipHorizontal) transforms.push('scaleX(-1)');
  if (flipVertical) transforms.push('scaleY(-1)');

  const viewBoxSize = baseViewBox + (padding * 2);
  const viewBoxOffset = -padding;
  const viewBox = `${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={size}
      height={size}
      style={{
        opacity,
        color,
        transform: transforms.join(' ') || undefined,
        filter: shadow > 0 ? `drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))` : undefined,
        backgroundColor: background !== 'transparent' ? background : undefined
      }}
    >
      <path fill="currentColor" d="M21 3H3C2 3 1 4 1 5v14a2 2 0 0 0 2 2h18c1 0 2-1 2-2V5c0-1-1-2-2-2M5 17l3.5-4.5l2.5 3l3.5-4.5l4.5 6z"/>
    </svg>
  );
};

const PeopleEye16FilledIcon = ({
  size = 24,
  color = 'currentColor',
  background = 'transparent',
  opacity = 1,
  rotation = 0,
  shadow = 0,
  flipHorizontal = false,
  flipVertical = false,
  padding = 0
}: CustomIconProps) => {
  const baseViewBox = 16;
  const transforms = [];
  if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
  if (flipHorizontal) transforms.push('scaleX(-1)');
  if (flipVertical) transforms.push('scaleY(-1)');

  const viewBoxSize = baseViewBox + (padding * 2);
  const viewBoxOffset = -padding;
  const viewBox = `${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={size}
      height={size}
      style={{
        opacity,
        color,
        transform: transforms.join(' ') || undefined,
        filter: shadow > 0 ? `drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))` : undefined,
        backgroundColor: background !== 'transparent' ? background : undefined
      }}
    >
      <path fill="currentColor" d="M11.5 8c2.761 0 4.5 2.3 4.5 3.5c0 1.182-1.739 3.5-4.5 3.5S7 12.7 7 11.5C7 10.318 8.736 8 11.5 8m.957 1.19a2.501 2.501 0 1 0-1.915 4.622a2.501 2.501 0 0 0 1.915-4.622M7.5 8q.322.001.613.097q-.313.226-.582.478a5.5 5.5 0 0 0-1.097 1.406C6.18 10.451 6 10.983 6 11.5c0 .443.13.913.354 1.371c-.43.084-.886.129-1.354.129c-1.175 0-2.27-.272-3.089-.77C1.091 11.73.5 10.965.5 10a2 2 0 0 1 2-2zm4 2a1.5 1.5 0 1 1 0 2.999a1.5 1.5 0 0 1 0-2.999M5 1.5A2.75 2.75 0 1 1 5 7a2.75 2.75 0 0 1 0-5.5m6.502.997a2.252 2.252 0 1 1 0 4.503a2.252 2.252 0 0 1 0-4.503"/>
    </svg>
  );
};

const TemplateFilledIcon = ({
  size = 24,
  color = '#000000',
  background = 'transparent',
  opacity = 1,
  rotation = 0,
  shadow = 0,
  flipHorizontal = false,
  flipVertical = false,
  padding = 0
}: CustomIconProps) => {
  const baseViewBox = 24;
  const transforms = [];
  if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
  if (flipHorizontal) transforms.push('scaleX(-1)');
  if (flipVertical) transforms.push('scaleY(-1)');

  const viewBoxSize = baseViewBox + (padding * 2);
  const viewBoxOffset = -padding;
  const viewBox = `${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={size}
      height={size}
      style={{
        opacity,
        color,
        transform: transforms.join(' ') || undefined,
        filter: shadow > 0 ? `drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))` : undefined,
        backgroundColor: background !== 'transparent' ? background : undefined
      }}
    >
      <path fill="currentColor" d="M22 2H2v6h20zm0 8H11v12h11zM9 22V10H2v12z"/>
    </svg>
  );
};

const HeartWhiteSuitSmallIcon = ({
  size = 24,
  color = '#000000',
  background = 'transparent',
  opacity = 1,
  rotation = 0,
  shadow = 0,
  flipHorizontal = false,
  flipVertical = false,
  padding = 0
}: CustomIconProps) => {
  const baseViewBox = 10;
  const transforms = [];
  if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
  if (flipHorizontal) transforms.push('scaleX(-1)');
  if (flipVertical) transforms.push('scaleY(-1)');

  const viewBoxSize = baseViewBox + (padding * 2);
  const viewBoxOffset = -padding;
  const viewBox = `${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={size}
      height={size}
      style={{
        opacity,
        color,
        transform: transforms.join(' ') || undefined,
        filter: shadow > 0 ? `drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))` : undefined,
        backgroundColor: background !== 'transparent' ? background : undefined
      }}
    >
      <path fill="currentColor" d="M8 5H7v1h1Zm0 0h1V2H8ZM3 8h1V7H3ZM2 7h1V6H2ZM1 6h1V5H1Zm3 3h1V8H4ZM0 5h1V2H0Zm5 3h1V7H5Zm1-1h1V6H6ZM1 2h2V1H1Zm2 1h1V2H3Zm1 1h1V3H4Zm1-1h1V2H5Zm1-1h2V1H6Zm0 0"/>
    </svg>
  );
};

const FolderPeople24FilledIcon = ({
  size = 24,
  color = '#000000',
  background = 'transparent',
  opacity = 1,
  rotation = 0,
  shadow = 0,
  flipHorizontal = false,
  flipVertical = false,
  padding = 0
}: CustomIconProps) => {
  const baseViewBox = 24;
  const transforms = [];
  if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
  if (flipHorizontal) transforms.push('scaleX(-1)');
  if (flipVertical) transforms.push('scaleY(-1)');

  const viewBoxSize = baseViewBox + (padding * 2);
  const viewBoxOffset = -padding;
  const viewBox = `${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={size}
      height={size}
      style={{
        opacity,
        color,
        transform: transforms.join(' ') || undefined,
        filter: shadow > 0 ? `drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))` : undefined,
        backgroundColor: background !== 'transparent' ? background : undefined
      }}
    >
      <path fill="currentColor" d="M2 8V6.25A3.25 3.25 0 0 1 5.25 3h2.879a2.25 2.25 0 0 1 1.59.659l1.531 1.53L8.659 7.78a.75.75 0 0 1-.53.22zm0 1.5v8.25A3.25 3.25 0 0 0 5.25 21h5.866A4.3 4.3 0 0 1 11 20a3 3 0 0 1 2.333-2.925a3 3 0 1 1 5.05-2.905A2.5 2.5 0 0 1 22 13.5V8.75a3.25 3.25 0 0 0-3.25-3.25h-5.69L9.72 8.841a2.25 2.25 0 0 1-1.591.659zM15.5 17a2 2 0 1 0 0-4a2 2 0 0 0 0 4m0 6c2.567 0 3.5-1.52 3.5-3a2 2 0 0 0-2-2h-3a2 2 0 0 0-2 2c0 1.48.933 3 3.5 3m4.007-1.022q.234.021.493.022c2.2 0 3-1.216 3-2.4a1.6 1.6 0 0 0-1.6-1.6h-2.164c.475.53.764 1.232.764 2c0 .656-.144 1.35-.493 1.978M22 15.5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0"/>
    </svg>
  );
};

const PersonSupport16FilledIcon = ({
  size = 24,
  color = '#000000',
  background = 'transparent',
  opacity = 1,
  rotation = 0,
  shadow = 0,
  flipHorizontal = false,
  flipVertical = false,
  padding = 0
}: CustomIconProps) => {
  const baseViewBox = 16;
  const transforms = [];
  if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
  if (flipHorizontal) transforms.push('scaleX(-1)');
  if (flipVertical) transforms.push('scaleY(-1)');

  const viewBoxSize = baseViewBox + (padding * 2);
  const viewBoxOffset = -padding;
  const viewBox = `${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={size}
      height={size}
      style={{
        opacity,
        color,
        transform: transforms.join(' ') || undefined,
        filter: shadow > 0 ? `drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))` : undefined,
        backgroundColor: background !== 'transparent' ? background : undefined
      }}
    >
      <path fill="currentColor" d="m6.527 10.782l-.001-.003l-.19-.062a5 5 0 0 1-2.284-1.649a5 5 0 1 1 8.924-3.567c.027.275-.2.499-.476.499s-.497-.225-.53-.499a4 4 0 1 0-5.285 4.278a1.5 1.5 0 1 1-.158 1.003m-.793.775a6 6 0 0 1-2.482-1.889A1.5 1.5 0 0 0 3 10.5v.5c0 1.971 1.86 4 5 4s5-2.029 5-4v-.5A1.5 1.5 0 0 0 11.5 9H10a2.5 2.5 0 1 1-4.266 2.557M11 6c0-.914-.409-1.733-1.054-2.283a3 3 0 1 0-3.518 4.84A2.5 2.5 0 0 1 8 7.999a2.5 2.5 0 0 1 1.572.556A3 3 0 0 0 11 6"/>
    </svg>
  );
};

// --- End Custom Icon Components ---

export const Overview = () => {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">

        {/* Welcome Banner Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-rose-50/40 via-white to-amber-50/20 border border-rose-100/70 p-8 md:p-10 text-zinc-800 shadow-[0_15px_40px_rgba(244,63,94,0.02)]">
          {/* Floating background elements */}
          <div className="absolute inset-0 -z-10 pointer-events-none opacity-15">
            <FloatingBackgroundHearts />
          </div>
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-rose-100/30 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-amber-100/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8">
            <div className="space-y-6 flex-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-100/60 px-3.5 py-1.5 text-[10px] font-black tracking-wider uppercase text-rose-500 shadow-2xs">
                <Sparkles size={11} className="text-amber-500 animate-pulse" /> KHÔNG GIAN THIẾT KẾ CỦA BẠN
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-black font-poppins tracking-tight leading-tight text-zinc-900">
                  Chào Nguyen!
                </h1>
                <p className="text-zinc-500 text-sm font-poppins font-medium max-w-lg leading-relaxed">
                  Bạn đang sử dụng <span className="text-rose-500 font-bold">Gói trải nghiệm tự do</span>. Hãy thỏa sức sáng tạo và lan tỏa yêu thương qua những tấm thiệp cưới di động đẹp hoàn hảo nhất.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/editor"
                  className="flex items-center gap-2 rounded-full bg-rose-600 hover:bg-rose-700 px-6 py-3.5 font-bold text-white shadow-md shadow-rose-500/10 hover:shadow-lg hover:shadow-rose-500/20 active:scale-95 transition-all duration-300 font-poppins text-xs group"
                >
                  <span>Tạo thiệp mới ngay</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/dashboard/plan"
                  className="flex items-center gap-2 rounded-full bg-white hover:bg-zinc-50 border border-zinc-200 px-6 py-3.5 font-bold text-zinc-650 shadow-2xs hover:shadow-xs active:scale-95 transition-all duration-300 font-poppins text-xs"
                >
                  <span>Nâng cấp gói dịch vụ</span>
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center shrink-0 relative mr-4 select-none pointer-events-none">
              <div className="absolute inset-0 bg-rose-100/35 rounded-2xl blur-xl" />
              <div className="relative w-48 h-32 bg-[#fffdf9] rounded-2xl border border-amber-200/50 shadow-xl p-4 rotate-3 transform flex flex-col justify-between text-zinc-800">
                <div className="absolute top-2 inset-x-2 border-t border-amber-200/40" />
                <div className="flex flex-col items-center justify-center flex-1 space-y-1 mt-2">
                  <span className="text-[9px] font-extrabold text-amber-600/80 tracking-widest font-serif uppercase">SAVE THE DATE</span>
                  <div className="h-6 w-6 rounded-full border border-amber-200 flex items-center justify-center text-[10px] font-serif font-black text-amber-700 bg-amber-50/50">
                    N
                  </div>
                  <span className="text-[8px] text-zinc-400 font-serif font-medium">Nguyen & Partner</span>
                </div>
                <div className="text-center text-[8px] font-poppins font-semibold text-zinc-400 tracking-wider">
                  DECEMBER 2026
                </div>
                <div className="absolute bottom-2 inset-x-2 border-b border-amber-200/40" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="rounded-4xl bg-white border border-rose-100/60 p-6 flex items-center justify-between shadow-xs transition-all duration-300 hover:shadow-md hover:border-rose-200">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
                  <ImageSizeSelectActualIcon size={18} color="currentColor" />
                </div>
                <span className="text-xs font-bold text-zinc-500 tracking-wide font-poppins uppercase">Kho lưu trữ ảnh</span>
              </div>
              <div>
                <p className="text-3xl font-black text-zinc-800 mt-1 font-poppins">
                  0 <span className="text-sm font-semibold text-zinc-400">/ 10 tệp</span>
                </p>
                <p className="text-[11px] text-zinc-400 font-bold mt-1">Đã tối ưu bộ nhớ</p>
              </div>
            </div>

            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle cx="28" cy="28" r="22" className="stroke-zinc-100" strokeWidth="3" fill="transparent" />
                <circle cx="28" cy="28" r="22" className="stroke-rose-500" strokeWidth="3.5" fill="transparent" strokeDasharray="138" strokeDashoffset="138" strokeLinecap="round" />
              </svg>
              <span className="absolute text-xs font-black text-zinc-700">0%</span>
            </div>
          </div>

          <div className="rounded-4xl bg-white border border-rose-100/60 p-6 flex items-center justify-between shadow-xs transition-all duration-300 hover:shadow-md hover:border-rose-200">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500">
                  <Clipboard2HeartFillIcon size={18} color="currentColor" />
                </div>
                <span className="text-xs font-bold text-zinc-500 tracking-wide font-poppins uppercase">Thiệp kích hoạt</span>
              </div>
              <div>
                <p className="text-3xl font-black text-zinc-800 mt-1 font-poppins">
                  0 <span className="text-sm font-semibold text-zinc-400">/ 01 thiệp</span>
                </p>
                <p className="text-[11px] text-pink-500 font-bold mt-1">Trạng thái: Sẵn sàng</p>
              </div>
            </div>

            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle cx="28" cy="28" r="22" className="stroke-zinc-100" strokeWidth="3" fill="transparent" />
                <circle cx="28" cy="28" r="22" className="stroke-pink-500" strokeWidth="3.5" fill="transparent" strokeDasharray="138" strokeDashoffset="138" strokeLinecap="round" />
              </svg>
              <span className="absolute text-xs font-black text-zinc-700">0%</span>
            </div>
          </div>

          <div className="rounded-4xl bg-white border border-rose-100/60 p-6 flex items-center justify-between shadow-xs transition-all duration-300 hover:shadow-md hover:border-rose-200">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <PeopleEye16FilledIcon size={18} color="currentColor" />
                </div>
                <span className="text-xs font-bold text-zinc-500 tracking-wide font-poppins uppercase">Khách ghé thăm</span>
              </div>
              <div>
                <p className="text-3xl font-black text-zinc-800 mt-1 font-poppins">
                  0 <span className="text-sm font-semibold text-zinc-400">/ 300 lượt</span>
                </p>
                <p className="text-[11px] text-zinc-400 font-bold mt-1">Reset sau 30 ngày</p>
              </div>
            </div>

            {/* Circular Progress Gauge */}
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle cx="28" cy="28" r="22" className="stroke-zinc-100" strokeWidth="3" fill="transparent" />
                <circle cx="28" cy="28" r="22" className="stroke-amber-400" strokeWidth="3.5" fill="transparent" strokeDasharray="138" strokeDashoffset="138" strokeLinecap="round" />
              </svg>
              <span className="absolute text-xs font-black text-zinc-700">0%</span>
            </div>
          </div>

        </div>

        {/* Quick Nav area */}
        <div className="rounded-[2.5rem] bg-white border border-rose-100/50 p-8 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-zinc-800 font-poppins">Khu vực điều hướng nhanh</h3>
            <span className="text-xs font-bold text-rose-400 bg-rose-50 px-3 py-1 rounded-full border border-rose-100/50">LỐI TẮT TIỆN ÍCH</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
            {[
              { icon: TemplateFilledIcon, label: 'Kho Mẫu Thiệp', path: '/dashboard/templates', color: 'text-rose-500 bg-rose-50 border-rose-100/50' },
              { icon: HeartWhiteSuitSmallIcon, label: 'Lời Chúc', path: '/dashboard/wishes', color: 'text-pink-500 bg-pink-50 border-pink-100/50' },
              { icon: FolderPeople24FilledIcon, label: 'Khách RSVP', path: '/dashboard/rsvp', color: 'text-rose-600 bg-rose-50/50 border-rose-100/30' },
              { icon: Crown, label: 'Nâng Cấp VIP', path: '/dashboard/plan', color: 'text-amber-600 bg-amber-50 border-amber-100/50' },
              { icon: PersonSupport16FilledIcon, label: 'Hỗ Trợ', path: '/dashboard/account', color: 'text-purple-600 bg-purple-50 border-purple-100/50' },
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className="flex flex-col items-center justify-center p-5 rounded-[1.75rem] border border-zinc-100 bg-zinc-50/30 hover:bg-white hover:border-rose-200 hover:shadow-md transition-all duration-300 group"
              >
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-3 border ${item.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon size={24} color="currentColor" />
                </div>
                <span className="text-sm font-bold text-zinc-700 font-poppins group-hover:text-rose-600 transition-colors">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-4xl bg-rose-50/30 border border-rose-100/40 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
              <Sparkle size={20} className="animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-zinc-800 font-poppins">Mách nhỏ để thiết kế thiệp đẹp</h4>
              <p className="text-xs text-zinc-500 font-poppins">Hãy chuẩn bị các hình ảnh cưới chất lượng cao (tỷ lệ 4:3 hoặc 16:9) để chèn vào thiệp trông sắc nét nhất!</p>
            </div>
          </div>
          <Link
            to="/dashboard/templates"
            className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 hover:underline font-poppins"
          >
            Xem kho mẫu ngay <ArrowUpRight size={14} />
          </Link>
        </div>

      </div>
    </DashboardLayout>
  );
};