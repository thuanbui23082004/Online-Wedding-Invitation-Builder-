import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import FacebookIcon from "../../components/icons/FacebookIcon"; 
import { RevolvingHeartsIcon } from "../../components/icons/emojione-revolving-hearts";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Đăng nhập với:", { email, password });
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-0 md:p-6 font-sans">
      <div className="bg-white w-full max-w-5xl min-h-[600px] md:rounded-[2.5rem] shadow-xl border border-zinc-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-center text-left">
          
          <div className="mb-8 space-y-2">
            <div className="flex items-center gap-2">
              <RevolvingHeartsIcon size={28} color="#f43f5e" />
                <span className="text-2xl font-handwritten font-black tracking-tighter text-zinc-950">
                Dear<span className="text-rose-500">Love</span>
                </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-poppins font-extrabold text-zinc-900 tracking-tight pt-2">
              Chào mừng trở lại
            </h2>
            <p className="text-xs font-medium text-zinc-400">
              Đăng nhập để tiếp tục thiết kế ngày chung đôi
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Trường Email */}
            <div className="space-y-1.5 font-poppins">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
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
                  className="w-full h-11 pl-11 pr-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-rose-400 focus:bg-white text-sm font-medium text-zinc-800 outline-none transition-all"
                />
              </div>
            </div>

            {/* Trường Mật khẩu */}
            <div className="space-y-1.5 font-poppins">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Mật khẩu
                </label>
                <a href="#" className="text-xs font-bold text-rose-500 hover:underline">
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative font-poppins">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-11 pr-11 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-rose-400 focus:bg-white text-sm font-medium text-zinc-800 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 mt-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-[0_8px_20px_rgba(225,29,72,0.15)] hover:shadow-[0_12px_25px_rgba(225,29,72,0.25)] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Đăng nhập <ArrowRight size={16} />
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-100" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
              Hoặc đăng nhập bằng
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Nút Google */}
            <button className="h-10 border border-zinc-200 hover:bg-zinc-50 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-zinc-600 transition-all cursor-pointer">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.98 1 12 1 7.35 1 3.42 3.66 1.52 7.55l3.77 2.92C6.2 7.26 8.87 5.04 12 5.04z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.74-2.38 3.58l3.7 2.87c2.16-1.99 3.41-4.92 3.41-8.6z"/>
                <path fill="#FBBC05" d="M5.29 14.53c-.25-.75-.39-1.55-.39-2.38s.14-1.63.39-2.38L1.52 6.85C.55 8.79 0 10.96 0 13.25s.55 4.46 1.52 6.4l3.77-2.92z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.7-2.87c-1.04.7-2.37 1.12-3.96 1.12-3.13 0-5.8-2.22-6.71-5.43L1.52 17.82C3.42 21.71 7.35 24 12 24z"/>
              </svg>
              Google
            </button>
            {/* Nút Facebook */}
            <button className="h-10 border border-zinc-200 hover:bg-zinc-50 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-zinc-600 transition-all cursor-pointer">
              <FacebookIcon size={16} />
              Facebook
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-zinc-400 font-medium">
            Chưa có tài khoản?{" "}
            <a href="#" className="text-rose-500 font-bold hover:underline">
              Đăng ký miễn phí
            </a>
          </p>

        </div>

        <div className="hidden lg:block lg:col-span-7 relative bg-zinc-100">
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
            <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold">
              DearLove Studio
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}