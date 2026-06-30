// src/components/Footer.tsx
import FacebookIcon from "./icons/FacebookIcon"; 
import InstagramIcon from "../components/icons/InstagramIcon";
import ThreadsSquareIcon from "../components/icons/ThreadsSquareIcon";
import TiktokLogoBlockIcon from "../components/icons/TiktokIcon";
import { RevolvingHeartsIcon } from "../components/icons/emojione-revolving-hearts";


export default function Footer() {
  return (
    <footer id="lien-he" className="bg-white font-poppins font-medium border-t border-zinc-100 pt-16 pb-8 text-left">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-zinc-100">
          
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <RevolvingHeartsIcon size={28} color="#f43f5e" />
              <span className="text-2xl font-handwritten font-black tracking-tighter text-zinc-950">
                Dear<span className="text-rose-500">Love</span>
              </span>
            </div>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed max-w-sm">
              Nền tảng tạo thiệp cưới online miễn phí, hiện đại và tinh tế, giúp cặp đôi lan tỏa lời mời một cách chuyên nghiệp.
            </p>
            <div className="pt-2 text-sm font-semibold text-zinc-500 space-y-1">
              <div>Website: <a href="https://dearlove.me" className="text-zinc-900 hover:text-rose-600 underline">dearlove.me</a></div>
              <div className="text-zinc-400 font-normal text-xs">tạo thiệp cưới online</div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-black text-zinc-950 uppercase tracking-wider">Sản phẩm</h4>
            <ul className="space-y-2.5 text-sm text-zinc-500 font-medium">
              <li><a href="#" className="hover:text-rose-600 transition-colors">Mẫu thiệp online</a></li>
              <li><a href="#" className="hover:text-rose-600 transition-colors">Mẫu thiệp cưới online</a></li>
              <li><a href="#" className="hover:text-rose-600 transition-colors">Blog cưới hỏi</a></li>
              <li><a href="#" className="hover:text-rose-600 transition-colors">Tiếp thị liên kết</a></li>
              <li><a href="#" className="hover:text-rose-600 transition-colors">Tạo thiệp trọn gói</a></li>
              <li><a href="#" className="hover:text-rose-600 transition-colors">Công cụ đám cưới</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-black text-zinc-950 uppercase tracking-wider">Pháp lý</h4>
            <ul className="space-y-2.5 text-sm text-zinc-500 font-medium">
              <li><a href="#" className="hover:text-rose-600 transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-rose-600 transition-colors">Điều khoản sử dụng</a></li>
              <li><a href="#" className="hover:text-rose-600 transition-colors">Về DearLove</a></li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-black text-zinc-950 uppercase tracking-wider">Kết nối</h4>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed">
              Kết nối với chúng tôi để cập nhật xu hướng thiệp cưới mới nhất.
            </p>
            
            <div className="flex items-center gap-3 pt-1">
              {/* NÚT FACEBOOK */}
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-zinc-50 text-zinc-500 transition-all shadow-xs flex items-center justify-center hover:scale-110"
              >
                <FacebookIcon size={18} />
              </a>

              {/* NÚT INSTAGRAM */}
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-zinc-50 text-zinc-500 transition-all shadow-xs flex items-center justify-center hover:scale-110"
              >
                <InstagramIcon size={18} />
              </a>

              {/* NÚT THREADS */}
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-zinc-50 text-zinc-500 hover:text-zinc-950 transition-all shadow-xs flex items-center justify-center hover:scale-110"
              >
                <ThreadsSquareIcon size={18} color="currentColor" />
              </a>

              {/* NÚT TIKTOK */}
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-zinc-50 text-zinc-500 hover:text-zinc-950 transition-all shadow-xs flex items-center justify-center hover:scale-110"
              >
                <TiktokLogoBlockIcon size={18} color="currentColor" />
              </a>
            </div>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-xs text-zinc-400 font-medium gap-4">
          <div>
            © {new Date().getFullYear()} <span className="text-zinc-800 font-bold">DearLove™</span>. All Rights Reserved.
          </div>
          <div className="flex items-center gap-1">
            Made with love in Vietnam <span className="text-rose-500">❤️</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
export { Footer };