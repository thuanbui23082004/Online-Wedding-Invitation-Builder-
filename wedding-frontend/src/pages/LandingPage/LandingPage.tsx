import React  from 'react';
import { Link } from 'react-router-dom';
import WeddingImg1 from '../../assets/images/wedding1.jpg';
import WeddingImg2 from '../../assets/images/wedding2.jpg';
import WeddingImg3 from '../../assets/images/wedding3.jpg';
import WeddingImg4 from '../../assets/images/wedding4.jpg';
import WeddingImg5 from '../../assets/images/wedding5.jpg';
import WeddingImg6 from '../../assets/images/wedding6.jpg';
import WeddingImg7 from '../../assets/images/wedding7.jpg';
import WeddingImg8 from '../../assets/images/wedding8.jpg';
import WeddingImg9 from '../../assets/images/wedding9.jpg';
import WeddingImg10 from '../../assets/images/wedding10.jpg';
import Image1 from '../../assets/images/1.png';
import Image2 from '../../assets/images/2.png';
import Image3 from '../../assets/images/3.png';
import { templatesData, type TemplateItem } from '../../data/templates';
import TemplateModal from '../../components/TemplateModal';
import { RevolvingHeartsIcon } from "../../components/icons/emojione-revolving-hearts";
import { Footer } from "../../components/Footer";
import {
    ArrowRight,
    LayoutTemplate,
    Menu,
    X,
    UsersRound,
    Sparkles,
    Share2,
    ChevronDown,
    Send,
    Image,
    Palette,
    Play,
    Pen,
    
} from 'lucide-react';

import { Button } from '../../components/button';
import "./style.css";
import  { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface Testimonial {
    text: string;
    image: string;
    name: string;
    role: string;
}

export const testimonialsData: Testimonial[] = [
  {
    text: "Tụi mình tự tạo thiệp cưới trên DearLove chỉ mất chưa đầy 15 phút. Giao diện kéo thả trực quan, hình ảnh lên nét căng và điều thích nhất là tính năng quản lý khách mời tham dự cực kỳ chính xác, đỡ hẳn khâu gọi điện xác nhận.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Linh Đan",
    role: "Cô dâu tháng 10",
  },
  {
    text: "DearLove saved us so much time! Since my husband is American and I am Vietnamese, we needed a platform that supports multiple languages effortlessly. Our guests from New York and Hanoi loved the elegant bilingual design.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "David & Thu Hồng",
    role: "Đám cưới Việt - Mỹ",
  },
  {
    text: "Nhận được link thiệp cưới từ bạn thân mà bất ngờ vì giao diện dễ thương quá! Có cả bản đồ chỉ đường, nhạc nền tự động phát và khu vực gửi lời chúc trực tuyến rất ý nghĩa. Mình đã bấm xác nhận tham dự ngay trên thiệp.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Minh Thư",
    role: "Khách mời dự tiệc",
  },
  {
    text: "As an expat living in Da Nang, planning a wedding locally was challenging until I found DearLove. The digital invitations are stunning, modern, and incredibly easy to share via WhatsApp and social media with my family back home.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Michael Green",
    role: "Chú rể ngoại quốc tại Việt Nam",
  },
  {
    text: "Tính năng nhận lời chúc trực tuyến của DearLove là kho tàng kỷ niệm vô giá đối với tụi mình. Đêm tân hôn hai vợ chồng ngồi mở danh sách ra đọc từng lời chúc bằng cả tiếng Việt lẫn tiếng Anh của bạn bè mà vừa cười vừa xúc động.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Ngọc Anh",
    role: "Cô dâu mới",
  },
  {
    text: "Ce site là là fantastique! Thiết kế tinh tế chuẩn gu châu Âu, hệ thống phông chữ cực kỳ sang trọng. Nó giải quyết hoàn hảo bài toán gửi thiệp cưới nhanh chóng cho các cặp đôi có bạn bè, gia đình sinh sống ở nhiều quốc gia khác nhau.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Thomas & Minh Anh",
    role: "Cặp đôi Việt - Pháp",
  },
];

const firstColumn = testimonialsData.slice(0, 2);
const secondColumn = testimonialsData.slice(2, 4);
const thirdColumn = testimonialsData.slice(4, 6);
const TestimonialsColumn = ({ className, testimonials, duration }: any) => {
    return (
        <div className={className}>
            <motion.ul
                animate={{ translateY: "-50%" }}
                transition={{
                    duration: duration || 10,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop",
                }}
                className="flex flex-col gap-6 pb-6 bg-transparent list-none m-0 p-0"
            >
                {[...new Array(2)].map((_, index) => (
                    <React.Fragment key={index}>
                        {testimonials.map(({ text, image, name, role }: Testimonial, i: number) => (
                            <motion.li
                                key={`${index}-${i}`}
                                whileHover={{ scale: 1.02, y: -5 }}
                                className="p-8 rounded-[3rem] border border-white/60 shadow-sm bg-white/80 backdrop-blur-sm cursor-default select-none group"
                            >
                                <blockquote className="m-0 p-0 space-y-6">
                                    <p className="text-slate-600 leading-relaxed font-regular italic text-m">"{text}"</p>
                                    <footer className="flex items-center gap-4">
                                        <img src={image} alt={name} className="h-12 w-12 rounded-full object-cover ring-2 ring-purple-100" />
                                        <div className="flex flex-col">
                                            <cite className="font-bold font-poppins not-italic tracking-tight text-slate-900">{name}</cite>
                                            <span className="text-xs font-bold font-poppins uppercase tracking-widest text-slate-400">{role}</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </motion.li>
                        ))}
                    </React.Fragment>
                ))}
            </motion.ul>
        </div>
    );
};

const TestimonialsSection = () => {
    return (
        <div className="container px-40 mx-auto">
            <div className="flex flex-col items-center justify-center max-w-3xl mx-auto mb-20 text-center">
                <div className="inline-block px-6 py-2 rounded-full bg-white border border-rose-100 text-[11px] font-bold uppercase tracking-[0.5em] text-rose-400 shadow-sm mb-8">
                    FEEDBACK
                </div>
                <h2 className="text-5xl md:text-5xl font-bold text-slate-800 tracking-tighter leading-none italic mb-8">
                    Người dùng <span className="text-pink-500">nói gì?</span>
                </h2>
            </div>
            <div className="flex justify-center gap-8 mask-[linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-200 overflow-hidden">
                <TestimonialsColumn testimonials={firstColumn} duration={25} />
                <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={35} />
                <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={30} />
            </div>
        </div>
    );
};
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "DearLove là gì?",
      a: "DearLove là nền tảng tạo thiệp cưới online miễn phí, giúp các cặp đôi dễ dàng thiết kế, cá nhân hóa và chia sẻ thiệp mời kỹ thuật số một cách nhanh chóng và chuyên nghiệp."
    },
    {
      q: "Tạo Thiệp Cưới Online Trên Nền Tảng Của DearLove Có MIỄN PHÍ Không?",
      a: "Hoàn toàn miễn phí! DearLove cung cấp kho mẫu thiệp đa dạng cùng đầy đủ tính năng cơ bản như thêm ảnh, nhạc nền, bản đồ và nhận lời chúc trực tuyến mà không thu bất kỳ khoản phí nào."
    },
    {
      q: "Có Cần Tạo Và Đăng Nhập Tài Khoản Để Thiết Kế Thiệp Cưới Online Không?",
      a: "Có, việc đăng nhập giúp hệ thống bảo mật thông tin của bạn, đồng thời lưu trữ tiến trình thiết kế để bạn có thể quay lại chỉnh sửa bất kỳ lúc nào."
    },
    {
      q: "Khách Mời Có Cần Đăng Nhập Để Xem Thiệp Cưới Không?",
      a: "Không cần. Khách mời chỉ cần bấm vào đường liên kết (link) duy nhất do bạn chia sẻ là có thể xem trọn vẹn nội dung thiệp mời trên mọi thiết bị di động mà không cần tài khoản."
    },
    {
      q: "Tạo Nhiều Mẫu Thiệp Cưới Trên Một Tài Khoản Có Được Không?",
      a: "Được. Bạn có thể tạo nhiều mẫu thiệp khác nhau trên cùng một tài khoản để gửi riêng cho bạn bè, đồng nghiệp hoặc người thân tùy theo ý muốn."
    },
    {
      q: "Thông Tin Của Người Dùng Và Khách Mời Được Quản Lý Như Thế Nào?",
      a: "Mọi thông tin về danh sách khách mời, phản hồi tham dự và lời chúc đều được mã hóa an toàn và gom gọn vào trang quản lý riêng tư dành riêng cho tài khoản của bạn."
    },
    {
      q: "Khách mời có thể tặng quà trực tiếp trên thiệp không?",
      a: "Có, bạn có thể tích hợp số tài khoản hoặc mã QR mừng cưới trực tiếp lên giao diện thiệp để khách mời ở xa dễ dàng gửi quà mừng chúc phúc."
    }
  ];

  return (
    <section className="py-20 bg-white" id="faq">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-950 tracking-tight uppercase">
            Câu hỏi thường gặp
          </h2>
          <p className="text-zinc-500 font-poppins font-medium text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Mọi thắc mắc về tạo thiệp, gửi thiệp, nhận quà mừng và quản lý khách mời trên DearLove đều được giải đáp tại đây.
          </p>
        </div>
        <div className="divide-y divide-zinc-100 border-y border-zinc-100">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-4 text-left">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between py-2 text-zinc-900 font-poppins font-bold text-base md:text-md hover:text-rose-600 transition-colors duration-300 group"
                >
                  <span className="pr-4 tracking-tight leading-snug">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-all duration-300 shrink-0 ${isOpen ? "rotate-180 bg-rose-50 text-rose-500" : ""}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                <div className={`grid transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="text-sm md:text-base text-zinc-500 font-medium leading-relaxed pb-3 pr-6">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
function FinalCTA() {
  return (
    <div className="max-w-6xl mx-auto px-6 mb-20">
      <div className="bg-rose-100/20 rounded-[2.5rem] py-16 px-6 md:px-12 text-center border border-rose-100/40 relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-1.5 bg-white border border-rose-100 text-rose-600 text-xs font-bold px-4 py-1.5 rounded-full shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            Tạo thiệp cưới chỉ trong vài phút
          </div>
          <h2 className="text-3xl md:text-4xl font-poppins font-extrabold text-zinc-950 tracking-tight leading-tight">
            Tạo thiệp cưới online dễ dàng hơn
          </h2>

          <p className="text-zinc-500 text-sm md:text-base font-poppins font-medium leading-relaxed">
            Chọn mẫu thiệp đẹp, chỉnh sửa thông tin, gửi lời mời bằng link và lưu giữ lời chúc từ khách mời.
          </p>

          <div className="pt-2">
            <Button className="h-13 px-10 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-poppins font-bold text-base shadow-[0_10px_25px_rgba(225,29,72,0.15)] hover:shadow-[0_15px_35px_rgba(225,29,72,0.25)] transition-all flex items-center gap-2 mx-auto active:scale-95">
              Bắt đầu tạo thiệp <Send size={16} />
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}


export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Trang chủ', href: '#trang-chu' },
        { name: 'Mẫu thiệp', href: '#mau-thiep' },
        { name: 'Thiệp đã tạo', href: '#thiep-da-tao' },
        { name: 'Đánh giá', href: '#danh-gia' },
        { name: 'Liên hệ', href: '#lien-he' },
    ];

    return (
            <header className="fixed top-0 left-0 right-0 z-100 pt-6 px-4 pointer-events-none font-sans transition-all duration-300">
              <nav className={cn(
                  "mx-auto pointer-events-auto bg-white/80 backdrop-blur-xl border transition-all ease-[cubic-bezier(0.34,1.56,0.64,1)] duration-500 delay-0",			
                  isScrolled 
                      ? 'max-w-5xl py-2 px-6 rounded-full shadow-[0_12px_40px_rgba(244,63,94,0.15)] bg-white/90 border-rose-100 translate-y-1 scale-[0.98]' 
                      : 'max-w-7xl py-2 px-10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white/90 border-rose-100'
              )}>
                  <div className="flex justify-between items-center h-14">
                      <div className="flex items-center gap-2.5 shrink-0 group cursor-pointer">
                          <div className="bg-rose-100 p-2 rounded-xl transition-transform group-hover:rotate-12">
                              <RevolvingHeartsIcon size={28} color="#f43f5e" />
                          </div>
                          <span className="text-2xl font-serif font-black text-zinc-800">DearLove</span>
                      </div>

                      <div className="hidden md:flex items-center space-x-1">
                          {navLinks.map((link) => (
                              <a
                                  key={link.name}
                                  href={link.href}
                                  className={cn(
                                      "px-4 py-2 text-[15px] font-medium rounded-full transition-all flex items-center gap-1",
                                      link.href === "/" || link.name === "Trang chủ" 
                                          ? "text-rose-600 font-bold bg-rose-50/50" 
                                          : "text-gray-600 hover:text-gray-950 hover:bg-gray-50/50"
                                  )}
                              >
                                  {link.name}
                                  {['Security', 'Document', 'Integration'].includes(link.name) && (
                                      <ChevronDown className="h-3.5 w-3.5 opacity-40" />
                                  )}
                              </a>
                          ))}
                      </div>

                      <div className="flex items-center space-x-2 ml-auto md:ml-0">
                          <Link to="/login" className="block">
                              <Button variant="ghost" className="font-semibold text-gray-600 hover:text-rose-600 text-sm md:text-base px-3 md:px-4">
                                  Đăng nhập
                              </Button>
                          </Link>
                          <Link to="/signup" className="hidden md:inline-block">
                              <Button 
                            variant="default" 
                            className="rounded-xl px-6 bg-rose-600/80 hover:bg-rose-700/80 text-white transition-transform group-hover:rotate-12 shadow-none">
                            Đăng ký
                          </Button>
                          </Link>
                      </div>

                      <div className="md:hidden ml-1">
                          <Button variant="ghost" size="icon" className="rounded-full hover:bg-rose-50" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                              {isMenuOpen ? <X className="h-5 w-5 text-rose-600" /> : <Menu className="h-5 w-5" />}
                          </Button>
                      </div>
                  </div>

                  {isMenuOpen && (
                      <div className="md:hidden mt-4 py-4 bg-white/95 rounded-2xl border border-rose-100/60 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                          <div className="space-y-1 px-4">
                              {navLinks.map((link) => (
                                  <a
                                      key={link.name}
                                      href={link.href}
                                      className={cn(
                                          "flex items-center justify-between w-full px-4 py-3 text-base font-medium rounded-xl transition-colors",
                                          link.href === "/" || link.name === "Trang chủ"
                                              ? "bg-rose-50 text-rose-600 font-bold"
                                              : "text-gray-700 hover:bg-zinc-50"
                                      )}
                                      onClick={() => setIsMenuOpen(false)}
                                  >
                                      {link.name}
                                      <ChevronDown className="h-4 w-4 -rotate-90 opacity-30" />
                                  </a>
                              ))}
                          </div>
                      </div>
                  )}
              </nav>
          </header>
    );
};

const templatesRow1 = [
    { src: WeddingImg1, alt: "Mẫu thiệp 1" },
    { src: WeddingImg2, alt: "Mẫu thiệp 2" },
    { src: WeddingImg3, alt: "Mẫu thiệp 3" },
    { src: WeddingImg4, alt: "Mẫu thiệp 4" },
    { src: WeddingImg5, alt: "Mẫu thiệp 5" },
  ];
  const templatesRow2 = [
    { src: WeddingImg6, alt: "Mẫu thiệp 6" },
    { src: WeddingImg7, alt: "Mẫu thiệp 7" },
    { src: WeddingImg8, alt: "Mẫu thiệp 8" },
    { src: WeddingImg9, alt: "Mẫu thiệp 9" },
    { src: WeddingImg10, alt: "Mẫu thiệp 10" },
  ];
  const templatesRow3 = [
    { src: WeddingImg1, alt: "Mẫu thiệp 1" },
    { src: WeddingImg2, alt: "Mẫu thiệp 2" },
    { src: WeddingImg3, alt: "Mẫu thiệp 3" },
    { src: WeddingImg4, alt: "Mẫu thiệp 4" },
    { src: WeddingImg5, alt: "Mẫu thiệp 5" },
  ];
  const templatesRow4 = [
    { src: WeddingImg6, alt: "Mẫu thiệp 6" },
    { src: WeddingImg7, alt: "Mẫu thiệp 7" },
    { src: WeddingImg8, alt: "Mẫu thiệp 8" },
    { src: WeddingImg9, alt: "Mẫu thiệp 9" },
    { src: WeddingImg10, alt: "Mẫu thiệp 10" },
  ];

const LandingPage: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (item: TemplateItem) => {
      setSelectedTemplate(item);
      setIsModalOpen(true);
    };
    const words = ["tân gia", "thôi nôi", "đám cưới", "lời chúc"];
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      }, 2500);
      return () => clearInterval(interval);
    }, []);
    const galleryImages = [WeddingImg1, WeddingImg2, WeddingImg3, WeddingImg4, WeddingImg5, WeddingImg6];
    // Nhân đôi mảng để tạo luồng chạy lặp vô tận không có điểm đứt
    const [activeClickIdx, setActiveClickIdx] = useState<number | null>(null);
    const doubleImages = [...galleryImages, ...galleryImages];
    return (

        <div className="min-h-screen bg-white">
            <Header/>
            <section className="relative min-h-screen bg-linear-to-br from-rose-50/50 via-white to-pink-50/30 pt-32 pb-20 px-6 md:px-12 lg:px-20 overflow-hidden flex items-center">
              <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute top-1/4 left-[10%] w-96 h-96 bg-rose-200/40 rounded-full blur-3xl animate-pulse duration-6000" />
                <div className="absolute bottom-1/4 right-[10%] w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse duration-8000" />
              </div>
              
              <div className="max-w-6xl mx-auto w-full space-y-16">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

                  <div className="lg:col-span-6 text-left space-y-6 z-10">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 leading-[1.15]">
                      Đổi mới cách gửi lời mời
                      <br />{" "}
                      <span className="inline-block min-w-120px md:min-w-180px text-center">
                        <motion.span
                          key={currentWordIndex} 
                          initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="inline-block text-rose-500 font-handwritten italic font-medium px-1"
                        >
                          {words[currentWordIndex]}
                        </motion.span>
                      </span>{" "}
                      <br />
                      với{" "}
                      <span className="inline-flex font-black tracking-tight select-none">
                      {"DearLove.".split("").map((char, index) => (
                        <span
                          key={index}
                          style={{
                            animationDelay: `${index * 0.1}s`,
                          }}
                          className="relative inline-block bg-linear-to-r from-rose-500 via-pink-600 to-rose-600 bg-clip-text text-transparent overflow-hidden animate-[textShine_3s_infinite_linear]"
                        >
                          {char === " " ? "\u00A0" : char}
                        </span>
                      ))}
                    </span>
                    </h1>

                    <p className="text-base  md:text-lg text-black-500 max-w-xl leading-relaxed">
                      Giải pháp tạo thiệp online đột phá giúp bạn gửi lời mời chuyên nghiệp chỉ qua một đường link, tiết kiệm tối đa chi phí in ấn và thời gian chuẩn bị.
                    </p>

                    <p className="text-sm font-poppinsfont-medium text-zinc-500">
                      Tạo miễn phí • Mẫu đa dạng • Giao diện thân thiện • Bảo mật tuyệt đối
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                      <Link to="/signup">
                        <Button size="lg" className="bg-rose-600/80 hover:bg-rose-700/80 text-white text-base font-bold px-8 py-6 rounded-full shadow-lg shadow-rose-600/20 active:scale-95 transition-all">
                          Tạo thiệp ngay
                        </Button>
                      </Link>
                      <Link to="/guide">
                        <Button size="lg" variant="outline" className="border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-base font-bold px-8 py-6 rounded-full bg-white shadow-sm active:scale-95 transition-all">
                          Hướng dẫn <ArrowRight className="ml-2 h-4 w-4 text-rose-500" />
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="lg:col-span-6" />

                  </div>

                <div className="lg:col-span-6 relative h-125 md:h-150 w-full grid grid-cols-3 gap-4 overflow-hidden rounded-3xl mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)">
                  <div className="relative w-full h-full overflow-hidden backdrop-blur-sm bg-white/20">
                    <motion.div 
                      className="flex flex-col gap-4 pb-4"
                      animate={{ y: [0, -1200] }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 28,
                        ease: "linear",
                      }}
                    >
                    {[...templatesRow1, ...templatesRow3, ...templatesRow1].map((item, idx) => (
                      <div key={idx} className="w-full aspect-3/4 rounded-2xl overflow-hidden border border-rose-100/50 shadow-md bg-white p-1.5 group cursor-pointer hover:border-rose-200 transition-colors opacity-70 hover:opacity-100">
                        <img 
                          src={item.src} 
                          alt={item.alt} 
                          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                    ))}
                    </motion.div>
                  </div>

                  <div className="relative w-full h-full overflow-hidden backdrop-blur-sm pt-12">
                    <motion.div 
                      className="flex flex-col gap-4 pb-4"
                      animate={{ y: [-1200, 0] }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 25,
                        ease: "linear",
                      }}
                    >
                      {[...templatesRow2, ...templatesRow4, ...templatesRow2].map((item, idx) => (
                        <div key={idx} className="w-full aspect-3/4 rounded-2xl overflow-hidden border border-rose-100 shadow-md bg-white p-1.5 group cursor-pointer">
                          <img 
                            src={item.src} 
                            alt={item.alt} 
                            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500" 
                          />
                        </div>
                      ))}
                    </motion.div>
                  </div>

                  <div className="relative w-full h-full overflow-hidden backdrop-blur-sm bg-white/20">
                    <motion.div 
                      className="flex flex-col gap-4 pb-4"
                      animate={{ y: [0, -1200] }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 28,
                        ease: "linear",
                      }}
                    >
                    {[...templatesRow3, ...templatesRow2, ...templatesRow1].map((item, idx) => (
                      <div key={idx} className="w-full aspect-3/4 rounded-2xl overflow-hidden border border-rose-100/50 shadow-md bg-white p-1.5 group cursor-pointer hover:border-rose-200 transition-colors opacity-70 hover:opacity-100">
                        <img 
                          src={item.src} 
                          alt={item.alt} 
                          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                    ))}
                    </motion.div>
                  </div>
                </div>
                </div>

              </div>
            </section>


            {/* Planning & Features Section */}
            <section className="py-20 bg-white" id="document">
              <div className="max-w-6xl mx-auto px-6">
                  <div className="text-center mb-16 ">
                      <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-zinc-900 uppercase leading-tight">
                          Bạn đang có kế hoạch {""} 
                          <span className="inline-block mx-1 md:mx-2 align-text-top">
                              <svg 
                                className="w-4 h-4 md:w-6 md:h-6 text-rose-500 rotate-45 inline-block animate-bounce"
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={3} 
                                  d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                                />
                              </svg>
                            </span>
                            
                          <br className="hidden sm:block" />mời tiệc{" "}
                          <span className="text-rose-600 font-handwritten italic text-5xl md:text-9xl relative inline-block ml-1 md:ml-2 leading-none">
                              100<span className=" non-italic text-4xl md:text-6xl align-super ml-0.5">+</span>
                          </span>
                          <br className="hidden sm:block" />
                          khách
                      </h2>
                      <div className="text-rose-400 text-2xl mt-2 animate-bounce"></div>
                  </div>

                  {/* Pain points */}
                  <div className="grid md:grid-cols-3 gap-8 mb-24">
                      {[
                          {
                              imgSrc: Image1, 
                              title: "Mất nhiều thời gian",
                              desc: "để gửi tận tay tất cả thiệp mời"
                          },
                          {
                              imgSrc: Image2, 
                              title: "Không đủ chia sẻ thành ý",
                              desc: "khi dùng tin nhắn và ảnh chụp thiệp"
                          },
                          {
                              imgSrc: Image3, 
                              title: "Không biết số khách mời tham dự",
                              desc: "một cách chính xác"
                          } 
                      ].map((item, idx) => (
                          <div key={idx} className="bg-white border border-rose-50 rounded-4xl p-10 md:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(244,63,94,0.08)] transition-all duration-500 text-center flex flex-col items-center group hover:-translate-y-1">
                              <div className="w-24 h-24 bg-linear-to-br flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-500">
                                  {item.imgSrc && <img src={item.imgSrc} alt={item.title} className="w-35 h-35 object-contain" />}
                              </div>
                              <h3 className="text-md font-poppins font-bold text-zinc-900 mb-2 tracking-tight">
                                  {item.title}
                              </h3>
                              <p className="text-md text-zinc-500 font-medium leading-relaxed">
                                  {item.desc}
                              </p>
                          </div>
                      ))}
                  </div>
                  <div className="relative overflow-hidden bg-linear-to-b from-rose-50/30 to-transparent border border-rose-100 rounded-[4rem] p-12 md:p-20 text-center shadow-sm">
                      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                          <h3 className="text-xl md:text-3xl font-bold tracking-tight text-zinc-900 uppercase">
                              Tự tạo thiệp online với <span className="bg-linear-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent font-black">vô vàn tính năng hay</span>
                          </h3>
                          
                          <p className="text-base md:text-lg text-zinc-600 font-poppins leading-relaxed">
                              <b>DearLove</b> mang đến giải pháp thiệp online hiện đại, tính năng{" "}
                              <span className="text-rose-500 font-handwritten italic font-semibold px-0.5">Miễn Phí</span> giúp bạn dễ dàng tạo những chiếc thiệp độc đáo, mang đậm màu sắc cá nhân.
                          </p>

                          <div className="pt-8 flex justify-center relative group">
                              <span className="absolute left-1/4 top-1/2 -translate-y-1/2 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse">✨</span>
                              <Button className="h-14 px-10 rounded-full bg-rose-700/80 hover:bg-rose-600 text-white font-bold text-lg shadow-[0_12px_30px_rgba(225,29,72,0.15)] hover:shadow-[0_18px_40px_rgba(225,29,72,0.25)] transition-all active:scale-95 flex items-center gap-2">
                                  Thiết kế thiệp ngay
                              </Button>
                              <span className="absolute right-1/4 top-1/2 -translate-y-1/2 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse">✨</span>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-6 mt-12 mb-32">
          {[
            {
              title: "Thiết kế kéo thả nhanh chóng",
              desc: "Chỉ cần vài thao tác đơn giản, dễ dàng chỉnh sửa thông tin bạn có thể tạo và gửi thiệp cưới ngay lập tức mà không mất thời gian chờ đợi in ấn.",
              icon: <LayoutTemplate size={48} strokeWidth={1.5} />,
              iconColor: "text-blue-400",
              bgDeco: "bg-blue-50 border-blue-100",
            },
            {
              title: "Quản lý số lượng khách mời",
              desc: "Sau khi chia sẻ thiệp Online đến khách mời, các phản hồi tham dự và lời chúc sẽ được ghi nhận đầy đủ dưới dạng danh sách.",
              icon: <UsersRound size={48} strokeWidth={1.5} />,
              iconColor: "text-emerald-400",
              bgDeco: "bg-emerald-50 border-emerald-100",
            },
            {
              title: "Đa dạng các mẫu thiệp online",
              desc: "Các thiết kế thiệp Online của DearLove được cập nhật liên tục với nhiều lựa chọn khác nhau về phong cách và màu sắc.",
              icon: <Sparkles size={48} strokeWidth={1.5} />,
              iconColor: "text-purple-400",
              bgDeco: "bg-purple-50 border-purple-100",
            },
            {
              title: "Dễ dàng chia sẻ trực tuyến",
              desc: "Gửi thiệp Online đến từng khách mời bất kể thời gian và khoảng cách địa lý bằng cách chia sẻ một đường liên kết đơn giản.",
              icon: <Share2 size={48} strokeWidth={1.5} />,
              iconColor: "text-orange-400",
              bgDeco: "bg-orange-50 border-orange-100",
            },
          ].map((feat, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden bg-white border border-zinc-100 rounded-4xl p-8 min-h-80 flex flex-col justify-between text-left shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500 group cursor-default"
            >
              <div className="space-y-4 relative z-10">
                <h4 className="text-xl font-poppins font-semibold text-zinc-900 leading-snug tracking-tight group-hover:text-rose-600 transition-colors duration-300">
                  {feat.title}
                </h4>
                <p className="text-sm font-poppins text-zinc-900 font-medium leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out border ${feat.bgDeco}`}>
                <span className={`${feat.iconColor} -translate-x-2 -translate-y-2 group-hover:rotate-12 transition-transform duration-500`}>
                    {feat.icon}
                </span>
              </div>
            </div>
          ))}
        </div>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-left mb-12 max-w-3xl">
              <div className="flex items-center gap-2 text-rose-500 font-bold mb-2">
                <LayoutTemplate size={18} className="animate-bounce" />
                <span className="text-xs uppercase tracking-widest font-bold font-poppins">Bộ sưu tập ấn tượng</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight uppercase leading-tight mb-4">
                Chọn mẫu <br /> & tạo thiệp mời của bạn
              </h2>
              <p className="text-zinc-700 font-medium text-sm md:text-base leading-relaxed">
                Bắt đầu trải nghiệm tự tạo thiệp Online của bạn ngay với nhiều lựa chọn phong phú — chọn mẫu, xem trước và tùy chỉnh chỉ trong vài bước.
              </p>
            </div>

            {/* DANH SÁCH MẪU THIỆP */}
            <div className="relative group/carousel">
              <div className="flex gap-6 overflow-x-auto pb-8 pt-4 snap-x no-scrollbar scroll-smooth">
                {templatesData.map((item) => (
                  <div 
                    key={item.id} 
                    className="shrink-0 w-48 md:w-52 snap-start bg-white rounded-3xl overflow-hidden border border-zinc-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(244,63,94,0.08)] transition-all duration-500 group/card text-left"                  >
                    <div className="relative aspect-3/4 overflow-hidden bg-zinc-50">
                      <img 
                        src={item.mainImage} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700"
                      />
                      
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                        <Button 
                          onClick={() => handleOpenModal(item)} 
                          className="rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm px-6 py-2.5 shadow-md active:scale-95 transition-all"
                        >
                          Xem mẫu
                        </Button>
                      </div>

                      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[10px] font-black tracking-widest text-zinc-800 px-3 py-1 rounded-full border border-zinc-100 shadow-sm uppercase">
                        {item.tag}
                      </span>
                    </div>

                    <div className="p-5 space-y-1">
                      <h4 className="font-bold text-zinc-800 text-base tracking-tight truncate group-hover/card:text-rose-600 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        Mã: {item.code}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => {
                  const el = document.querySelector('#mau-thiep .overflow-x-auto');
                  if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
                }}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl border border-zinc-100 items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 z-20 hover:bg-rose-50 hover:text-rose-600 text-zinc-600"
              >
                <ArrowRight size={20} />
              </button>
            </div>

            <div className="flex justify-center pt-10">
              <Button className="h-12 px-8 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-base shadow-[0_10px_25px_rgba(225,29,72,0.12)] hover:shadow-[0_15px_30px_rgba(225,29,72,0.22)] transition-all flex items-center gap-2">
                Xem thêm mẫu thiệp <Send size={16} />
              </Button>
            </div>

          </div>
        </section>
        <TemplateModal template={selectedTemplate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        />
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 tracking-tight">
                Tạo thiệp cưới online trong{" "}
                <span className="text-rose-500 font-handwritten italic text-4xl md:text-6xl px-1 relative inline-block animate-pulse">
                  10 phút
                </span>
              </h2>
              <p className="text-zinc-500 text-sm md:text-base font-semibold tracking-wide">
                Dễ dàng thao tác • Kho mẫu đa dạng, cập nhật liên tục
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
              <div className="lg:col-span-7 relative pl-8 md:pl-10 text-left space-y-16">
                
                <div className="absolute left-5.75 top-6 bottom-6 w-0.5 bg-rose-100" />
                {[
                  {
                    step: "Bước 1",
                    title: "Chọn mẫu",
                    desc: "Kho mẫu đa dạng, cập nhật liên tục với nhiều chủ đề và phong cách khác nhau.",
                    icon: <Image size={25} className="text-white" />,
                  },
                  {
                    step: "Bước 2",
                    title: "Cá nhân hóa",
                    desc: "Tùy chỉnh ảnh và nội dung dễ dàng với giao diện trực quan, thân thiện với người dùng.",
                    icon: <Palette size={25} className="text-white" />,
                  },
                  {
                    step: "Bước 3",
                    title: "Gửi thiệp",
                    desc: "Chia sẻ qua Zalo, Messenger ngay lập tức mà không cần tải về, đảm bảo thiệp đến tay khách mời nhanh chóng và tiện lợi.",
                    icon: <Send size={25} className="text-white -translate-x-0.5 translate-y-0.5" />,
                  },
                ].map((item, idx) => (
                  <div key={idx} className="relative flex gap-6 group">
                    
                    <div className="absolute -left-8 w-12 h-12 rounded-full bg-rose-600/50 flex items-center justify-center shadow-[0_0_0_6px_rgba(244,63,94,0.1)] group-hover:scale-110 group-hover:bg-rose-600 transition-all duration-300 z-10">
                      {item.icon}
                    </div>

                    <div className="space-y-1 pl-10">
                      <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">
                        {item.step}
                      </span>
                      <h3 className="text-xl font-poppins font-black text-zinc-900 tracking-tight group-hover:text-rose-600 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-sm font-poppins text-zinc-500 font-medium leading-relaxed max-w-md">
                        {item.desc}
                      </p>
                    </div>

                  </div>
                ))}
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-85 aspect-9/16 rounded-[2.5rem] p-3 bg-zinc-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] border border-zinc-800 group/mockup overflow-hidden">
                  <div className="relative w-full h-full rounded-4xl overflow-hidden bg-zinc-100 flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600" //video demo thay thê sau
                      alt="Preview " 
                      className="w-full h-full object-cover group-hover/mockup:scale-105 transition-transform duration-700"
                    />
                    <button className="absolute w-16 h-16 rounded-full bg-white text-rose-500 flex items-center justify-center shadow-2xl active:scale-90 group-hover/mockup:scale-110 transition-all duration-500 z-20 cursor-pointer pl-1">
                      <Play size={24} fill="currentColor" />
                    </button>
                    <div className="absolute inset-0 bg-zinc-900/10 group-hover/mockup:bg-zinc-900/0 transition-colors duration-500" />
                  </div>
                </div>
              </div>

            </div>
            
            <div className="flex flex-col items-center gap-4 pt-4">
              <Button className="h-13 px-10 font-poppins rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-base shadow-[0_12px_30px_rgba(225,29,72,0.15)] hover:shadow-[0_18px_40px_rgba(225,29,72,0.25)] active:scale-95 transition-all flex items-center gap-2">
                <Pen/> Bắt đầu tạo thiệp 
              </Button>
              <a 
                href="#huong-dan-chi-tiet" 
                className="text-sm font-poppins font-bold text-gray-500 hover:text-rose-500 underline underline-offset-4 transition-colors duration-300"
              >
                Xem hướng dẫn chi tiết
              </a>
            </div>

          </div>
        </section>
       
        <section className="py-24 bg-white" id="thong-ke">
          <div className="w-full">
            
            <div className="text-center mb-16 font-sans space-y-3 max-w-7xl mx-auto px-6">
              <h2 className="text-3xl md:text-5xl font-poppins font-bold tracking-tight text-zinc-950 leading-tight">
                <span className="text-rose-500 font-handwritten italic text-5xl md:text-7xl mr-1 relative inline-block animate-pulse">
                  999<span className="font-sans not-italic font-boldtext-3xl md:text-5xl top-3.75 relative">+</span>
                </span>{" "}
                chiếc thiệp online <br className="md:hidden" /> đã chia sẻ thành công
              </h2>
              <p className="text-zinc-500 font-poppins text-md md:text-base font-medium max-w-xl mx-auto leading-relaxed">
                Lời mời tham dự sự kiện bằng thiệp Online <br className="hidden sm:inline" />
                phù hợp với mọi mạng xã hội và nền tảng trò chuyện trực tuyến
              </p>
            </div>

            <div className="flex overflow-hidden w-full relative group/gallery mb-16 mask-image-linear">
          
          <div className="flex gap-5 w-max animate-marquee hover:[animation-play-state:paused]">
            {doubleImages.map((img, idx) => {
              const isClicked = activeClickIdx === idx;
              
              return (
                <div
                  key={idx}
                  onClick={() => setActiveClickIdx(isClicked ? null : idx)}
                  className={`shrink-0 w-45 sm:w-55 aspect-3/4 rounded-2xl overflow-hidden border border-zinc-100 shadow-md transition-all duration-500 cursor-pointer
                    blur-[1px]
                    group-hover/gallery:blur-sm                     
                    hover:!blur-none hover:scale-105 hover:shadow-xl hover:border-rose-200
                    ${isClicked ? "!blur-none scale-105 border-rose-500 ring-4 ring-rose-100 shadow-xl" : ""}
                  `}
                >
                  <img
                    src={img}
                    alt={`Khách hàng DearLove ${idx + 1}`}
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                </div>
              );
            })}
          </div>
        </div>

            <div className="flex justify-center">
              <Button className="h-13 px-10 rounded-full font-poppins bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-base shadow-[0_12px_30px_rgba(225,29,72,0.15)] hover:shadow-[0_18px_40px_rgba(225,29,72,0.25)] active:scale-95 transition-all flex items-center gap-2">
                Tạo thiệp của bạn ngay
              </Button>
            </div>

          </div>
        </section>
  
        <TestimonialsSection />
        <FAQSection />
        <FinalCTA/>
        <Footer/>
        </div>
        

            
    );
};
export default LandingPage;
