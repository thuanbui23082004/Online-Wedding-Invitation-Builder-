import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Check } from "lucide-react";
import axiosClient from "../../../api/axiosClient";
import { useAuthStore } from "../../../store/authStore";
import FacebookIcon from "../../../components/icons/FacebookIcon";
import { RevolvingHeartsIcon } from "../../../components/icons/emojione-revolving-hearts";
import flowerBloom from "../../../assets/flower-bloom.png";

// Seeded pseudo-random generator (deterministic, no re-render jitter)
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const rand = seededRand(3735928559); // 0xDEADBEEF — fixed seed for deterministic layout
const BLOOM_FLOWERS = Array.from({ length: 120 }, (_, i) => ({
  left: rand() * 110 - 5,        // -5% … 105% so edges are also covered
  top: rand() * 110 - 5,
  size: 60 + rand() * 160,       // 60–220px
  rotate: rand() * 360,
  opacity: 0.18 + rand() * 0.50, // 0.18–0.68
  delay: rand() * 2.8,           // 0–2.8s stagger
  duration: 1.4 + rand() * 2.0,  // 1.4–3.4s bloom duration
}));

const CARD_FLOWERS = Array.from({ length: 28 }, (_, i) => ({
  left: rand() * 110 - 5,
  top: rand() * 110 - 5,
  size: 80 + rand() * 120,
  rotate: rand() * 360,
  opacity: 0.25 + rand() * 0.35,
  delay: rand() * 1.5,
  duration: 1.8 + rand() * 1.5,
})).filter(f => f.left >= 3 && f.left <= 97 && f.top >= 3 && f.top <= 97).slice(0, 18);

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [agreeTerms, setAgreeTerms] = useState(false);

  // Fake error state for demonstration as requested
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!agreeTerms) {
      newErrors.terms = "Vui lòng đồng ý với Điều khoản sử dụng!";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (password.length < 8) {
      toast.error("Mật khẩu phải có ít nhất 8 ký tự!");
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/.test(password)) {
      toast.error("Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa và 1 số!");
      return;
    }

    setErrors({});

    try {
      setIsLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/auth/register`, {
        fullName: name,
        email,
        password,
      });

      const loginResponse = await axiosClient.post('/auth/login', { email, password });
      
      // Lưu token vào localStorage để bypass lỗi third-party cookie trên Mobile
      if (loginResponse.data.accessToken) {
        localStorage.setItem("access_token", loginResponse.data.accessToken);
      }
      if (loginResponse.data.refreshToken) {
        localStorage.setItem("refresh_token", loginResponse.data.refreshToken);
      }

      setUser(loginResponse.data.user);

      toast.success('Đăng ký thành công!');
      navigate(`/loading?next=${encodeURIComponent('/home')}&message=${encodeURIComponent('Đăng ký thành công!')}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký';
      toast.error(typeof message === 'string' ? message : JSON.stringify(message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative isolate min-h-screen bg-white flex items-center justify-center p-4 md:p-8 font-sans overflow-hidden">
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
              transform: `scale(0.4) rotate(${f.rotate}deg)`,
              animation: `flowerBloom ${f.duration}s cubic-bezier(0.16,1,0.3,1) ${f.delay}s forwards`,
              '--end-opacity': f.opacity,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Khai báo keyframes animation trực tiếp */}
      <style>{`
        @keyframes formFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-form-fade-up {
          animation: formFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .custom-checkbox:checked {
          background-color: #f43f5e;
          border-color: #f43f5e;
        }
        @keyframes flowerBloom {
          0%   { opacity: 0;                      transform: scale(0.25) rotate(var(--rot,0deg)); filter: blur(6px)  saturate(0.6); }
          35%  { opacity: calc(var(--end-opacity,0.4) * 1.35); transform: scale(1.08) rotate(var(--rot,0deg)); filter: blur(0.5px) saturate(1.4); }
          65%  { opacity: calc(var(--end-opacity,0.4) * 1.15); transform: scale(0.95) rotate(var(--rot,0deg)); filter: blur(0.8px) saturate(1.2); }
          100% { opacity: var(--end-opacity,0.4); transform: scale(1)    rotate(var(--rot,0deg)); filter: blur(1.5px) saturate(1.0); }
        }
        @keyframes cardFlowerBloom {
          0%   { opacity: 0;                      transform: scale(0.3) rotate(var(--rot,0deg)); }
          50%  { opacity: calc(var(--end-opacity,0.35) * 1.2); transform: scale(1.05) rotate(var(--rot,0deg)); }
          100% { opacity: var(--end-opacity,0.35); transform: scale(1)   rotate(var(--rot,0deg)); }
        }
      `}</style>


      <div className="bg-white relative z-10 w-full max-w-6xl h-dvh md:h-auto lg:h-[90vh] lg:max-h-212.5 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-100/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-form-fade-up">
        {/* Cột trái: Form */}
        <div className="relative z-30 lg:col-span-6 px-8 py-8 md:px-14 md:py-10 lg:px-18 lg:py-12 flex flex-col text-left overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">

          <div className="max-w-120 mx-auto w-full my-auto">
            {/* Header */}
            <div className="mb-6 space-y-2">
              <div className="flex items-center gap-3">
                <RevolvingHeartsIcon size={32} color="#f43f5e" />
                <span className="text-[28px] font-handwritten font-black tracking-tighter text-zinc-950 mt-1">
                  Dear<span className="text-rose-500">Love</span>
                </span>
              </div>
              <h2 className="text-3xl font-poppins font-semibold text-zinc-900 tracking-tight">
                Tạo tài khoản mới
              </h2>
              <p className="text-[14px] font-normal text-zinc-500">
                Bắt đầu hành trình tự tay thiết kế ngày hạnh phúc
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Trường Họ và Tên (Full width) */}
              <div className="space-y-1.5 font-poppins">
                <label className="text-[13px] font-medium text-zinc-600 block">
                  Họ và tên
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-rose-500 transition-colors duration-300" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-2xl bg-zinc-50 border border-zinc-200 focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-500/10 text-[14px] font-normal text-zinc-800 outline-none transition-all duration-300"
                  />
                </div>
              </div>

              {/* Trường Email (Full width) */}
              <div className="space-y-1.5 font-poppins">
                <label className="text-[13px] font-medium text-zinc-600 block">
                  Địa chỉ Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-rose-500 transition-colors duration-300" size={18} />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-2xl bg-zinc-50 border border-zinc-200 focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-500/10 text-[14px] font-normal text-zinc-800 outline-none transition-all duration-300"
                  />
                </div>
              </div>

              {/* Nhóm Mật khẩu (Chia đôi) */}
              <div className="space-y-1.5 font-poppins">
                {/* Trường Mật khẩu */}
                <div className="space-y-1.5 font-poppins">
                  <label className="text-[13px] font-medium text-zinc-600 block">
                    Mật khẩu
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-rose-500 transition-colors duration-300" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Ít nhất 8 ký tự (hoa, thường, số)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 pl-11 pr-11 rounded-2xl bg-zinc-50 border border-zinc-200 focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-500/10 text-[14px] font-normal text-zinc-800 outline-none transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>


              </div>

              {/* Checkbox Điều khoản dịch vụ */}
              <div className="flex items-start gap-3 pt-2 font-poppins">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="custom-checkbox appearance-none w-5 h-5 rounded-md border border-zinc-300 bg-white checked:bg-rose-500 checked:border-rose-500 transition-all cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                  {agreeTerms && (
                    <Check size={14} className="absolute text-white pointer-events-none" strokeWidth={3} />
                  )}
                </div>
                <label htmlFor="terms" className="text-[13px] text-zinc-500 font-normal leading-relaxed cursor-pointer select-none">
                  Tôi đồng ý với{" "}
                  <a href="#" className="text-zinc-600 underline hover:text-rose-500 transition-colors">
                    Điều khoản dịch vụ
                  </a>{" "}
                  và{" "}
                  <a href="#" className="text-zinc-600 underline hover:text-rose-500 transition-colors">
                    Chính sách bảo mật
                  </a>{" "}

                </label>
              </div>
              {errors.terms && (
                <p className="text-red-500 text-[11px] mt-1">{errors.terms}</p>
              )}

              <div className="pt-2 pb-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-2xl bg-[#f43f5e] hover:bg-[#e11d48] text-white font-semibold text-[15px] shadow-[0_8px_20px_rgba(244,63,94,0.25)] hover:shadow-[0_12px_25px_rgba(225,29,72,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-poppins"
                >
                  {isLoading ? 'Đang tạo tài khoản...' : <>Tạo tài khoản <ArrowRight size={18} /></>}
                </button>
              </div>
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-100" />
              </div>
              <span className="relative bg-white px-4 text-[12px] font-medium text-zinc-400 uppercase tracking-widest font-poppins">
                Hoặc đăng ký bằng
              </span>
            </div>

            {/* SOCIAL SIGNUP */}
            <div className="grid grid-cols-2 gap-4 font-poppins">
              <button
                type="button"
                onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/auth/google`}
                className="h-11 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 rounded-2xl flex items-center justify-center gap-2.5 text-[13px] font-medium text-zinc-600 transition-all cursor-pointer">
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
                className="h-11 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 rounded-2xl flex items-center justify-center gap-2.5 text-[13px] font-medium text-zinc-600 transition-all cursor-pointer">
                <FacebookIcon size={16} />
                Facebook
              </button>
            </div>

            <p className="mt-8 text-center text-[13.5px] text-zinc-500 font-normal font-poppins">
              Đã có tài khoản rồi?{" "}
              <a href="/login" className="text-zinc-600 font-medium underline hover:text-rose-500 transition-colors">
                Đăng nhập ngay
              </a>
            </p>
          </div>

        </div>

        {/* Cột phải: Hình ảnh */}
        <div className="hidden lg:block lg:col-span-6 relative z-10 bg-zinc-100 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200"
            alt="DearLove Wedding Journey"
            className="w-full h-full object-cover select-none pointer-events-none hover:scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Overlay gradient theo yêu cầu: đỏ trắng mờ nhẹ */}
          <div className="absolute inset-0 bg-linear-to-t from-rose-950/80 via-rose-900/30 to-black/10" />

          <div className="absolute bottom-12 left-12 text-left text-white max-w-md space-y-2">
            <p className="text-xl font-serif italic text-white/95 leading-relaxed drop-shadow-md">
              "Once in a while, right in the middle of an ordinary life, love gives us a fairy tale."
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[10px] uppercase tracking-widest text-white font-semibold">
                DearLove Gallery
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}