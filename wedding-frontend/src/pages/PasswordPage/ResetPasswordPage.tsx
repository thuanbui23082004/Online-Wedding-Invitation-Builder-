import React, { useState } from "react";
import { Eye, EyeOff, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { RevolvingHeartsIcon } from "../../components/icons/emojione-revolving-hearts";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không trùng khớp!");
      return;
    }
    console.log("Cập nhật mật khẩu mới thành công");
    setIsSuccess(true);
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
          </div>

          {!isSuccess ? (
            <>
              <div className="mb-6 space-y-1">
                <h2 className="text-2xl md:text-3xl font-poppins font-extrabold text-zinc-900 tracking-tight">
                  Đặt lại mật khẩu
                </h2>
                <p className="text-xs font-medium text-zinc-400">
                  Vui lòng nhập mật khẩu mới bảo mật hơn cho tài khoản của bạn
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5 font-poppins">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Tối thiểu 8 ký tự"
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

                <div className="space-y-1.5 font-poppins">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-11 pl-11 pr-4 rounded-xl bg-zinc-50 border border-zinc-100 focus:border-rose-400 focus:bg-white text-sm font-medium text-zinc-800 outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 mt-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-[0_8px_20px_rgba(225,29,72,0.15)] hover:shadow-[0_12px_25px_rgba(225,29,72,0.25)] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer font-poppins"
                >
                  Cập nhật mật khẩu <ArrowRight size={16} />
                </button>
              </form>
            </>
          ) : (
            <div className="py-8 space-y-6 text-center lg:text-left font-poppins">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mx-auto lg:mx-0">
                <CheckCircle2 size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-zinc-900 tracking-tight">
                  Đổi mật khẩu thành công!
                </h3>
                <p className="text-xs font-medium text-zinc-400 leading-relaxed">
                  Mật khẩu của bạn đã được cập nhật trên hệ thống. Bây giờ bạn có thể quay lại đăng nhập bằng mật khẩu mới.
                </p>
              </div>
              <a 
                href="/login" 
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm transition-all shadow-sm"
              >
                Quay lại Đăng nhập
              </a>
            </div>
          )}

          <p className="mt-8 text-center text-xs text-zinc-400 font-medium font-poppins">
            Nhớ ra mật khẩu cũ?{" "}
            <a href="/login" className="text-rose-500 font-bold hover:underline">
              Đăng nhập ngay
            </a>
          </p>

        </div>

        <div className="hidden lg:block lg:col-span-7 relative bg-zinc-100">
          <img
            src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200"
            alt="DearLove Reset Password Background"
            className="w-full h-full object-cover select-none pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-zinc-950/10 to-transparent" />
          
          <div className="absolute bottom-10 left-10 text-left text-white max-w-md space-y-1">
            <p className="text-lg font-serif italic text-white/90">
              "Grow old along with me! The best is yet to be."
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