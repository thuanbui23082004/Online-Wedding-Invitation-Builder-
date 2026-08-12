import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axiosClient from "../../../api/axiosClient";
import { useAuthStore } from "../../../store/authStore";
import FacebookIcon from "../../../components/icons/FacebookIcon";
import { RevolvingHeartsIcon } from "../../../components/icons/emojione-revolving-hearts";
import flowerBloom from "../../../assets/flower-bloom.png";

// ─── Seeded pseudo-random (deterministic, no re-render jitter) ───────────────
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const rand = seededRand(2868903935); // fixed seed → same layout every render
const BLOOM_FLOWERS = Array.from({ length: 120 }, () => ({
  left: rand() * 112 - 6,        // -6 … 106%
  top: rand() * 112 - 6,
  size: 55 + rand() * 170,       // 55–225 px
  rotate: rand() * 360,
  opacity: 0.08 + rand() * 0.25, // Lighter opacity for hearts
  delay: rand() * 3.0,        // 0–3 s stagger
  duration: 1.3 + rand() * 2.2,  // 1.3–3.5 s
}));

const CARD_FLOWERS = Array.from({ length: 14 }, () => ({
  left: rand() * 112 - 6,
  top: rand() * 112 - 6,
  size: 70 + rand() * 130,
  rotate: rand() * 360,
  opacity: 0.22 + rand() * 0.38,
  delay: rand() * 1.6,
  duration: 1.6 + rand() * 1.8,
}));
// ─────────────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Vui lòng điền đầy đủ email và mật khẩu");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosClient.post("/auth/login", { email, password });

      // Lưu token vào localStorage để bypass lỗi third-party cookie trên Mobile (Safari ITP)
      if (response.data.accessToken) {
        localStorage.setItem("access_token", response.data.accessToken);
      }
      if (response.data.refreshToken) {
        localStorage.setItem("refresh_token", response.data.refreshToken);
      }

      setUser(response.data.user);
      toast.success("Đăng nhập thành công!");

      if (response.data.user.role === 'admin') {
        navigate(`/loading?next=${encodeURIComponent('/admin')}&message=${encodeURIComponent('Đăng nhập thành công!')}`);
      } else {
        navigate(`/loading?next=${encodeURIComponent('/home')}&message=${encodeURIComponent('Đăng nhập thành công!')}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative isolate min-h-screen bg-white flex items-center justify-center p-0 md:p-6 font-sans overflow-hidden">

      {/* ═══ 120 bông hoa nở rộ toàn trang ═══ */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {BLOOM_FLOWERS.map((f, i) => (
          <img
            key={`bloom-${i}`}
            src={flowerBloom}
            alt=""
            aria-hidden="true"
            className="absolute select-none"
            style={{
              left: `${f.left}%`,
              top: `${f.top}%`,
              width: f.size,
              height: f.size,
              opacity: 0,
              mixBlendMode: 'multiply',
              transform: `scale(0.25) rotate(${f.rotate}deg)`,
              animation: `loginFlowerBloom ${f.duration}s cubic-bezier(0.16,1,0.3,1) ${f.delay}s forwards`,
              '--end-opacity': f.opacity,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes loginFlowerBloom {
          0%   { opacity: 0;                               transform: scale(0.22) rotate(var(--rot,0deg)); filter: blur(7px)   saturate(0.5); }
          35%  { opacity: calc(var(--end-opacity,0.4)*1.4); transform: scale(1.10) rotate(var(--rot,0deg)); filter: blur(0.4px) saturate(1.5); }
          65%  { opacity: calc(var(--end-opacity,0.4)*1.15); transform: scale(0.94) rotate(var(--rot,0deg)); filter: blur(0.7px) saturate(1.2); }
          100% { opacity: var(--end-opacity,0.4);           transform: scale(1)    rotate(var(--rot,0deg)); filter: blur(1.5px) saturate(1.0); }
        }
        @keyframes cardFlowerBloom {
          0%   { opacity: 0;                                transform: scale(0.28) rotate(var(--rot,0deg)); }
          50%  { opacity: calc(var(--end-opacity,0.35)*1.2); transform: scale(1.06) rotate(var(--rot,0deg)); }
          100% { opacity: var(--end-opacity,0.35);           transform: scale(1)    rotate(var(--rot,0deg)); }
        }
        @keyframes loginFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-card {
          animation: loginFadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Card */}
      <div className="login-card bg-white/80 backdrop-blur-sm relative z-30 w-full max-w-5xl h-dvh md:h-auto lg:h-[90vh] lg:max-h-200 md:rounded-[2.5rem] shadow-[0_24px_60px_-10px_rgba(0,0,0,0.12)] ring-1 ring-rose-100/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* ── Cột trái: Form ── */}
        <div className="relative z-30 lg:col-span-6 p-10 md:p-16 lg:p-18 flex flex-col justify-center text-left overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

          <div className="mb-8 space-y-2">
            <div className="flex items-center gap-2">
              <RevolvingHeartsIcon size={28} color="#f43f5e" />
              <span className="text-2xl font-handwritten font-black tracking-tighter text-zinc-950">
                Dear<span className="text-rose-500">Love</span>
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-poppins font-medium text-zinc-900 tracking-tight pt-2">
              Chào mừng trở lại
            </h2>
            <p className="text-xs font-normal text-zinc-500">
              Đăng nhập để tiếp tục thiết kế ngày chung đôi
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div className="space-y-1.5 font-poppins">
              <label className="text-xs font-semibold text-zinc-500 tracking-wider">
                Email của bạn
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-rose-400 focus:bg-white text-[13px] font-normal text-zinc-800 outline-none transition-all"
                />
              </div>
            </div>

            {/* Mật khẩu */}
            <div className="space-y-1.5 font-poppins">
              <label className="text-xs font-semibold text-zinc-500 tracking-wider block">
                Mật khẩu
              </label>
              <div className="relative font-poppins">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-11 pr-11 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-rose-400 focus:bg-white text-[13px] font-normal text-zinc-800 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex justify-end pt-1">
                <a href="/reset-password" className="text-xs font-medium text-rose-500 hover:underline">
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`group w-full h-12 mt-4 rounded-xl bg-[#f43f5e] hover:bg-[#e11d48] text-white font-semibold text-base shadow-[0_8px_20px_rgba(244,63,94,0.3)] hover:shadow-[0_12px_25px_rgba(225,29,72,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${isLoading ? 'opacity-70 cursor-not-allowed pointer-events-none' : ''}`}
            >
              {isLoading ? "Đang đăng nhập..." : <>Đăng nhập <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-100" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-medium text-zinc-400 tracking-widest">
              Hoặc đăng nhập bằng
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/auth/google`}
              className="h-10 border border-zinc-200 hover:bg-zinc-50 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-zinc-600 transition-all cursor-pointer">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.98 1 12 1 7.35 1 3.42 3.66 1.52 7.55l3.77 2.92C6.2 7.26 8.87 5.04 12 5.04z" />
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.74-2.38 3.58l3.7 2.87c2.16-1.99 3.41-4.92 3.41-8.6z" />
                <path fill="#FBBC05" d="M5.29 14.53c-.25-.75-.39-1.55-.39-2.38s.14-1.63.39-2.38L1.52 6.85C.55 8.79 0 10.96 0 13.25s.55 4.46 1.52 6.4l3.77-2.92z" />
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.7-2.87c-1.04.7-2.37 1.12-3.96 1.12-3.13 0-5.8-2.22-6.71-5.43L1.52 17.82C3.42 21.71 7.35 24 12 24z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/auth/facebook`}
              className="h-10 border border-zinc-200 hover:bg-zinc-50 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-zinc-800 transition-all cursor-pointer">
              <FacebookIcon size={16} />
              Facebook
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-zinc-500 font-normal">
            Chưa có tài khoản?{" "}
            <a href="/signup" className="text-rose-500 font-semibold hover:underline">
              Đăng ký miễn phí
            </a>
          </p>

        </div>

        {/* ── Cột phải: Ảnh cưới ── */}
        <div className="hidden lg:block lg:col-span-6 relative bg-zinc-100">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200"
            alt="DearLove Wedding Background"
            className="w-full h-full object-cover select-none pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-zinc-950/10 to-transparent" />

          <div className="absolute bottom-10 left-10 text-left text-white max-w-md space-y-1">
            <p className="text-lg font-serif italic text-white/90">
              "Love does not consist in gazing at each other, but in looking outward together in the same direction."
            </p>
            <p className="text-[10px] tracking-widest text-white/60 font-semibold">
              DearLove Studio
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}