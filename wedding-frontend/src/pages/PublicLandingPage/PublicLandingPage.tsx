import React from 'react';
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
import { Footer } from "../../components/Footer";
import { templatesApi } from '../../api/templatesApi';
import {
  ArrowRight,
  LayoutTemplate,
  UsersRound,
  Sparkles,
  Share2,
  ChevronDown,
  Send,
  Image,
  Palette,
  Play,
  Pen,
  Zap,
  Clock,
  CheckCircle2,
  MapPin,
  Music,
  HeartHandshake,
  Phone,
  ExternalLink,
  X,
} from 'lucide-react';


import { Button } from '../../components/button';
import "./style.css";
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';


import { motion, AnimatePresence } from 'framer-motion';

import { PublicLandingHeader } from '../../components/PublicLandingHeader';


interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

export const testimonialsData: Testimonial[] = [
  {
    text: "Mẫu thiệp cưới online và Video Slide cưới ở đây làm quá đẹp và tinh tế! Giao diện dễ chỉnh sửa, hình ảnh lên nét 4K khi trình chiếu ở nhà hàng ai cũng khen. Rất tiện lợi!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Linh Đan & Hoàng Nam",
    role: "Cô Dâu & Chú Rể Tháng 10",
  },
  {
    text: "Tụi mình đặt combo vừa thiệp điện tử vừa video slide cưới. Thiệp gửi Zalo 1-click có tên từng khách cực kỳ sang trọng, vừa tiết kiệm thời gian vừa đúng phong cách yêu thích!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Quốc Bảo & Thu Hồng",
    role: "Đã Đặt Combo Thiệp + Slide 4K",
  },
  {
    text: "Kho mẫu thiệp phong phú từ cổ điển đến hiện đại. Tính năng bản đồ chỉ đường Google Maps và xác nhận tham dự RSVP 24/7 giúp gia đình quản lý danh sách khách mời cực kỳ chuẩn xác.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Minh Thư & Anh Tuấn",
    role: "Cặp Đôi Đã Sử Dụng Dịch Vụ",
  },
  {
    text: "Video Slide cưới Chibi vô cùng dễ thương, chất lượng HD nét căng không dán logo. Đội ngũ hỗ trợ chỉnh sửa theo yêu cầu rất nhanh chóng và chu đáo!",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Đăng Khoa & Khánh Vy",
    role: "Đặt Video Slide Cưới",
  },
  {
    text: "Điểm 10 cho sự tiện lợi và mẫu mã sang trọng! Nhạc nền tự phát lãng mạn, hình ảnh sắc nét và giao diện điện thoại mượt mà giúp buổi tiệc cưới của vợ chồng mình thêm trọn vẹn.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Ngọc Anh & Hải Đăng",
    role: "Cặp Đôi Đám Cưới 2026",
  },
  {
    text: "Dịch vụ làm thiệp cưới online và video slide cực kỳ uy tín! Gói combo tiết kiệm giá tốt, chất lượng cao vượt mong đợi. Rất khuyên các cặp đôi nên chọn!",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Minh Anh & Thanh Tùng",
    role: "Khách Hàng Đặt Trọn Gói",
  },
];

export const videoSlideTemplates = [
  {
    id: "slide-1",
    name: "VIDEO 1",
    code: "SLIDE-01",
    category: "VIDEO SLIDE 4K",
    thumbnail: "/slide-thumb-1.png",
    driveUrl: "https://drive.google.com/file/d/1R7SQNED8w49u0l395aBFA80PcbgGUfIn/view?usp=sharing",
    embedUrl: "https://drive.google.com/file/d/1R7SQNED8w49u0l395aBFA80PcbgGUfIn/preview",
  },
  {
    id: "slide-2",
    name: "VIDEO 2",
    code: "SLIDE-02",
    category: "VIDEO CHIBI",
    thumbnail: "/slide-thumb-2.png",
    driveUrl: "https://drive.google.com/file/d/1npz4V_asWZhnYQ3wqCdUkiVUxtVo4STU/view",
    embedUrl: "https://drive.google.com/file/d/1npz4V_asWZhnYQ3wqCdUkiVUxtVo4STU/preview",
  },
  {
    id: "slide-3",
    name: "VIDEO 3",
    code: "SLIDE-03",
    category: "MÀN HÌNH CHỜ",
    thumbnail: "/slide-thumb-3.jpg",
    driveUrl: "https://drive.google.com/file/d/1RLSYSGRbbxCOzcFGqt-vk7L6cC5RrMnu/view",
    embedUrl: "https://drive.google.com/file/d/1RLSYSGRbbxCOzcFGqt-vk7L6cC5RrMnu/preview",
  },
  {
    id: "slide-4",
    name: "VIDEO 4",
    code: "SLIDE-04",
    category: "SLIDE VINTAGE",
    thumbnail: "/slide-thumb-4.png",
    driveUrl: "https://drive.google.com/file/d/1F915bn3_4k8eTqGUROqSN_3GPs5Y1lnh/view?usp=sharing",
    embedUrl: "https://drive.google.com/file/d/1F915bn3_4k8eTqGUROqSN_3GPs5Y1lnh/preview",
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
        className="flex flex-col gap-4 md:gap-6 pb-4 md:pb-6 bg-transparent list-none m-0 p-0"
      >
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map(({ text, image, name, role }: Testimonial, i: number) => (
              <motion.li
                key={`${index}-${i}`}
                whileHover={{ scale: 1.02, y: -5 }}
                className="p-5 md:p-8 rounded-2xl md:rounded-[3rem] border border-zinc-200/80 shadow-sm bg-white/90 backdrop-blur-sm cursor-default select-none group"
              >
                <blockquote className="m-0 p-0 space-y-4 md:space-y-6">
                  <p className="text-zinc-600 leading-relaxed font-regular italic text-xs sm:text-sm md:text-base">"{text}"</p>
                  <footer className="flex items-center gap-3 md:gap-4">
                    <img src={image} alt={name} className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover ring-2 ring-red-100" />
                    <div className="flex flex-col text-left">
                      <cite className="font-bold font-poppins not-italic tracking-tight text-zinc-900 text-xs sm:text-sm md:text-base">{name}</cite>
                      <span className="text-[10px] sm:text-xs font-bold font-poppins uppercase tracking-wider text-zinc-400">{role}</span>
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="container px-4 md:px-10 lg:px-40 mx-auto py-4 md:py-10 my-10"
    >
      <div className="flex flex-col items-center justify-center max-w-3xl mx-auto mb-4 md:mb-8 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-[#FFF0F2] border border-[#F5D0D6] text-xs font-bold uppercase tracking-wider text-[#700B1A] shadow-xs mb-2 md:mb-3">
          HƠN 10,000+ CẶP ĐÔI TIN DÙNG
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
          Người Dùng Nói Gì Về <span className="text-[#700B1A] font-handwritten italic font-bold ">Dịch Vụ?</span>
        </h2>
      </div>
      <div className="flex justify-center gap-4 md:gap-8 mask-[linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[380px] sm:max-h-[460px] md:max-h-[580px] overflow-hidden">
        {/* On Mobile: Render all 6 testimonials in 1 column so it scrolls continuously without empty gaps */}
        <TestimonialsColumn testimonials={testimonialsData} className="block md:hidden" duration={35} />
        {/* On Desktop: 3 multi-columns */}
        <TestimonialsColumn testimonials={firstColumn} className="hidden md:block" duration={25} />
        <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={35} />
        <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={30} />
      </div>
    </motion.div>
  );
};

function FinalCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-5xl mx-auto px-4 md:px-6 my-14 md:my-10"
      id="lien-he"
    >
      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] py-6 md:py-10 px-5 md:px-10 text-center border-2 border-[#F5D0D6] shadow-sm relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#FFF0F2] border border-[#F5D0D6] text-[#700B1A] text-xs font-extrabold px-4 py-1 rounded-full shadow-xs uppercase tracking-widest">
            <Phone size={13} className="text-[#700B1A]" />
            <span>TƯ VẤN & ĐẶT LÀM THIỆP TRỰC TIẾP</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
            Liên Hệ Tư Vấn & Đặt Thiệp <span className="text-[#700B1A]">Trực Tiếp</span>
          </h2>

          <p className="text-zinc-600 font-poppins text-xs sm:text-sm max-w-xl mx-auto font-medium leading-relaxed">
            Bạn cần tư vấn mẫu thiệp cưới online, làm video slide cưới theo yêu cầu hoặc nhận ưu đãi combo? Hãy liên hệ ngay với chúng tôi qua Điện thoại & Zalo!
          </p>

          {/* Contact Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            {/* Direct Phone Call Button */}
            <a
              href="tel:0329635973"
              className="w-full sm:w-auto h-11 md:h-12 px-7 rounded-full bg-white border-2 border-[#700B1A] text-[#700B1A] hover:bg-[#FFF0F2] font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Phone size={16} className="text-[#700B1A]" />
              <span>Hotline: 0329.635.973</span>
            </a>

            {/* Zalo Direct Chat Button */}
            <a
              href="https://zalo.me/0329635973"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto h-11 md:h-12 px-7 rounded-full bg-[#700B1A] hover:bg-[#520712] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Send size={16} />
              <span>Chat Zalo: 0329635973</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}




// Static arrays kept as default backups

// ─── Count-up hook ──────────────────────────────────────────────
function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [hasStarted, target, duration]);

  return { count, ref };
}

const PublicLandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideoSlide, setSelectedVideoSlide] = useState<any>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobileDevice(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (selectedVideoSlide) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedVideoSlide]);
  const [dbTemplates, setDbTemplates] = useState<any[]>([]);
  const [activeSolutionTab, setActiveSolutionTab] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % 3);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res: any = await templatesApi.getTemplates({ limit: 100 });
        const items = Array.isArray(res) 
          ? res 
          : (res?.items || res?.data?.items || res?.data || []);
        if (items && Array.isArray(items) && items.length > 0) {
          setDbTemplates(items);
        }
      } catch (err) {
        console.warn('Backend API templates fallback to default templates:', err);
      }
    };
    fetchTemplates();
  }, []);

  const handleOpenModal = (item: any) => {
    const formattedItem: TemplateItem = {
      id: typeof item.id === 'string' ? parseInt(item.id.replace(/\D/g, '')) || 99 : item.id,
      title: item.name || item.title,
      code: item.slug || item.code || 'DL-2026',
      tag: item.category?.name || item.tag || 'WEDDING',
      price: item.isPremium ? 'VIP' : 'Miễn phí',
      mainImage: item.thumbnailUrl || item.mainImage,
      detailImages: item.detailImages || [item.thumbnailUrl || item.mainImage],
      description: item.description || `Mẫu thiết kế thiệp cưới tuyệt đẹp phong cách hiện đại từ DearLove.`
    };
    setSelectedTemplate(formattedItem);
    setIsModalOpen(true);
  };

  const handleOpenDemo = (item: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const demoUrl = item.demoUrl || item.previewUrl || item.link;
    if (demoUrl && (demoUrl.startsWith('http') || demoUrl.startsWith('/'))) {
      window.open(demoUrl, '_blank');
    } else if (item.id && typeof item.id === 'string') {
      window.open(`/view-template/${item.id}`, '_blank');
    } else {
      handleOpenModal(item);
    }
  };

  const words = ["thiệp cưới", "video slide", "tiệc cưới", "lời chúc"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const galleryImages = dbTemplates.length > 0
    ? dbTemplates.map(t => t.thumbnailUrl).filter(Boolean)
    : [WeddingImg1, WeddingImg2, WeddingImg3, WeddingImg4, WeddingImg5, WeddingImg6];

  // Dynamic rows for Hero Section marquee scrolling
  const dbRow1 = dbTemplates.length > 0
    ? dbTemplates.slice(0, 5).map(t => ({ src: t.thumbnailUrl, alt: t.name }))
    : [
      { src: WeddingImg1, alt: "Mẫu thiệp 1" },
      { src: WeddingImg2, alt: "Mẫu thiệp 2" },
      { src: WeddingImg3, alt: "Mẫu thiệp 3" },
      { src: WeddingImg4, alt: "Mẫu thiệp 4" },
      { src: WeddingImg5, alt: "Mẫu thiệp 5" },
    ];

  const dbRow2 = dbTemplates.length > 5
    ? dbTemplates.slice(5, 10).map(t => ({ src: t.thumbnailUrl, alt: t.name }))
    : [
      { src: WeddingImg6, alt: "Mẫu thiệp 6" },
      { src: WeddingImg7, alt: "Mẫu thiệp 7" },
      { src: WeddingImg8, alt: "Mẫu thiệp 8" },
      { src: WeddingImg9, alt: "Mẫu thiệp 9" },
      { src: WeddingImg10, alt: "Mẫu thiệp 10" },
    ];

  const templatesRow1 = dbRow1;
  const templatesRow2 = dbRow2;
  const templatesRow3 = dbRow1;
  const templatesRow4 = dbRow2;

  // Nhân đôi mảng để tạo luồng chạy lặp vô tận không có điểm đứt
  const [activeClickIdx, setActiveClickIdx] = useState<number | null>(null);
  const doubleImages = [...galleryImages, ...galleryImages];

  const templatesToRender = dbTemplates.length > 0 ? dbTemplates : templatesData;

  // Mouse tracking for hero section
  const heroRef = React.useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  // Count-up for stats
  const { count: invitationCount, ref: invitationCountRef } = useCountUp(999, 2000);


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (hero) hero.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (

    <div className="min-h-screen bg-white">
      <PublicLandingHeader />
      <section
        ref={heroRef}
        className="relative min-h-[90vh] md:min-h-screen pt-24 sm:pt-28 md:pt-36 pb-12 md:pb-20 px-4 md:px-12 lg:px-20 overflow-hidden flex items-center bg-white"
      >
        {/* Fixed soft background blobs - Top only */}
        <div className="absolute top-0 left-0 right-0 h-full -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[10%] w-[60vw] h-[70vh] rounded-full bg-red-100/50 mix-blend-multiply filter blur-[120px]" />
          <div className="absolute top-[10%] right-[-5%] w-[50vw] h-[60vh] rounded-full bg-rose-100/40 mix-blend-multiply filter blur-[120px]" />
          <div className="absolute top-[20%] left-[20%] w-[50vw] h-[50vh] rounded-full bg-red-100/40 mix-blend-multiply filter blur-[100px]" />
        </div>

        {/* Fade to white at bottom */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-white/40 to-white pointer-events-none" />

        {/* Animated Mouse Glow */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-70 transition-opacity duration-300"
          style={{
            background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(230, 18, 52, 0.15), transparent 40%)`,
          }}
        />

        <div className="max-w-6xl mx-auto w-full space-y-10 md:space-y-16">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">

            <div className="lg:col-span-6 text-center lg:text-left space-y-5 md:space-y-6 z-10 flex flex-col items-center lg:items-start">
              <h1 className="hero-animate hero-animate-1 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 leading-[1.15]">

                Nâng tầm ngày cưới
                <br />{" "}
                <span className="inline-block min-w-[120px] md:min-w-[180px] text-center">
                  <motion.span
                    key={currentWordIndex}
                    initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="inline-block text-[#700B1A] font-handwritten italic font-medium px-1"
                  >
                    {words[currentWordIndex]}
                  </motion.span>
                </span>{" "}
                <br />
                với{" "}
                <span className="inline-flex font-black tracking-tight select-none">
                  {"TIMELESS BOND.".split("").map((char, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gradient-to-r from-[#8B1226] via-[#700B1A] to-[#520712] bg-clip-text text-transparent overflow-hidden"
                      style={{
                        backgroundSize: '300% auto',
                        animation: `textShine 3s linear infinite`,
                        animationDelay: `${index * 0.1}s`,
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </span>
              </h1>

              <p className="hero-animate hero-animate-2 text-sm sm:text-base md:text-lg text-zinc-600 max-w-xl leading-relaxed">
                Chuyên mẫu mã Thiệp Cưới Online sang trọng & Video Slide Cưới 4K trình chiếu tiệc. Thiết kế tinh tế, chỉnh sửa cực kỳ tiện lợi và chia sẻ 1-click tức thì.
              </p>


              <div className="hero-animate hero-animate-4 flex flex-wrap justify-center lg:justify-start gap-3 md:gap-4 pt-2">

                <a href="#mau-thiep">
                  <Button size="lg" className="bg-[#700B1A] hover:bg-[#520712] text-white text-sm md:text-base font-bold px-6 md:px-8 py-3.5 md:py-6 rounded-full shadow-lg shadow-[#700B1A]/20 active:scale-95 transition-all flex items-center gap-2">
                    <LayoutTemplate size={18} /> Mẫu thiệp
                  </Button>
                </a>
                <a href="#video-slide">
                  <Button size="lg" variant="outline" className="border-[#F5D0D6] hover:bg-[#FFF0F2] text-zinc-800 text-sm md:text-base font-bold px-6 md:px-8 py-3.5 md:py-6 rounded-full bg-white shadow-sm active:scale-95 transition-all flex items-center gap-2">
                    <Play size={18} className="text-[#700B1A] fill-[#700B1A]" /> Mẫu Video Slide
                  </Button>
                </a>
              </div>

              <div className="lg:col-span-6" />

            </div>

            {/* Right Showcase: Sleek Compact Interactive Phone Mockup with 3D Tilt & Floating Feature Badges */}
            <div className="lg:col-span-6 relative flex items-center justify-center py-2 md:py-6 [perspective:1200px]">

              {/* Ambient Ultra-Soft Neutral Glowing Aura */}
              <div className="absolute w-[200px] md:w-[260px] h-[200px] md:h-[260px] bg-red-50/30 rounded-full blur-2xl -z-10" />

              {/* Main Phone Mockup with Ultra-Smooth 3D Parallax Tilt & Continuous Floating */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9, rotateY: -18, rotateX: 12, rotateZ: -6 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -14, 0],
                  rotateY: [-14, -7, -14],
                  rotateX: [8, 3, 8],
                  rotateZ: [-4, -2, -4],
                }}
                transition={{
                  opacity: { duration: 0.8, ease: "easeOut" },
                  scale: { duration: 0.8, ease: "easeOut" },
                  y: { repeat: Infinity, duration: 5.5, ease: "easeInOut" },
                  rotateY: { repeat: Infinity, duration: 5.5, ease: "easeInOut" },
                  rotateX: { repeat: Infinity, duration: 5.5, ease: "easeInOut" },
                  rotateZ: { repeat: Infinity, duration: 5.5, ease: "easeInOut" },
                }}
                style={{ transformStyle: "preserve-3d" }}
                whileHover={{ rotateY: 0, rotateX: 0, rotateZ: 0, scale: 1.04 }}
                onClick={() => handleOpenModal(templatesToRender[0])}
                className="relative w-[195px] sm:w-[225px] md:w-[250px] aspect-[9/18.5] rounded-[2rem] p-2 sm:p-2.5 bg-zinc-950 shadow-[-10px_20px_35px_-10px_rgba(0,0,0,0.18)] border-4 border-zinc-800/90 z-10 overflow-hidden group cursor-pointer transition-all duration-700"
              >
                {/* Dynamic Notch / Camera Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-zinc-900 rounded-full z-30 flex items-center justify-between px-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
                  <div className="w-2 h-2 rounded-full bg-blue-900/40 border border-blue-500/30" />
                </div>

                {/* Clean Phone Screen Container */}
                <div className="relative w-full h-full rounded-[1.6rem] overflow-hidden bg-zinc-950">
                  <img
                    src="https://res.cloudinary.com/dimrl0w79/image/upload/v1786434957/dearlove/user_c51c175f-17c2-4305-b79f-68d420272fc6/thumbnails/nkii3hf1ohyczg8orldn.webp"
                    alt="Mẫu Thiệp Cưới Online Live Preview"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </motion.div>

              {/* Floating Glassmorphic Badge 1: Top Right - Overlapping Phone Frame */}
              <motion.div
                initial={{ opacity: 0, x: 40, y: 20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: [0, -12, 0],
                }}
                transition={{
                  opacity: { delay: 0.4, duration: 0.6 },
                  x: { delay: 0.4, duration: 0.6 },
                  y: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.4 }
                }}
                className="absolute top-6 -right-2 sm:-right-6 md:-right-8 z-20 bg-white/98 backdrop-blur-2xl border border-zinc-200/80 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl shadow-md flex items-center gap-3 w-auto shrink-0"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-extrabold text-xs sm:text-sm shadow-inner">
                  98%
                </div>
                <div className="text-left shrink-0 pr-1">
                  <p className="text-xs sm:text-sm font-extrabold text-zinc-900 leading-tight">RSVP Xác Nhận</p>
                  <p className="text-[10px] sm:text-[11px] text-zinc-500 font-semibold whitespace-nowrap leading-tight">142 Khách mời tham dự</p>
                </div>
              </motion.div>

              {/* Floating Glassmorphic Badge 2: Bottom Left - Overlapping Phone Frame */}
              <motion.div
                initial={{ opacity: 0, x: -40, y: 20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: [0, 12, 0],
                }}
                transition={{
                  opacity: { delay: 0.6, duration: 0.6 },
                  x: { delay: 0.6, duration: 0.6 },
                  y: { repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.6 }
                }}
                className="absolute bottom-6 -left-2 sm:-left-6 md:-left-8 z-20 bg-white/98 backdrop-blur-2xl border border-zinc-200/80 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl shadow-md flex items-center gap-3 w-auto shrink-0"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FFF0F2] text-[#700B1A] flex items-center justify-center shrink-0 border border-[#F5D0D6] shadow-inner">
                  <Play size={16} className="fill-[#700B1A] ml-0.5" />
                </div>
                <div className="text-left shrink-0 pr-1">
                  <p className="text-xs sm:text-sm font-extrabold text-zinc-900 leading-tight">Video Slide Cưới 4K</p>
                  <p className="text-[10px] sm:text-[11px] text-zinc-500 font-semibold whitespace-nowrap leading-tight">Trình chiếu tiệc HD</p>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </section>


      {/* Planning & Features Section: Modern 3D Cover Flow Auto-Rotating Showcase */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-white via-zinc-50/40 to-white border-y border-zinc-100 overflow-hidden" id="document">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          {/* Header */}
          <div className="mb-6 md:mb-8 space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF0F2] border border-[#F5D0D6] text-xs font-bold uppercase tracking-wider text-[#700B1A] shadow-xs">
              <Sparkles size={13} className="text-[#700B1A]" />
              <span>GIẢI PHÁP THIỆP ĐIỆN TỬ & SLIDE CƯỚI 4K</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight leading-snug">
              Giải Pháp Tạo Thiệp Online & Video Slide Cưới <span className="inline-block text-[#700B1A] font-handwritten italic font-bold px-1">Thông Minh</span>
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm max-w-xl mx-auto font-medium">
              Tự động xoay chuyển giải pháp thông minh — Gửi lời mời trang trọng, ấn tượng & kiểm soát phản hồi 24/7.
            </p>
          </div>

          {/* 3D Depth Auto-Rotating Cover Flow Stage */}
          <div className="relative w-full max-w-4xl mx-auto h-[270px] sm:h-[260px] flex items-center justify-center [perspective:1200px] mb-5">
            {[
              {
                id: 0,
                icon: <Send size={22} className="text-[#700B1A]" />,
                iconBg: "bg-[#FFF0F2] border-[#F5D0D6]",
                badge: "✓ Gửi 100+ Thiệp Trong 1s",
                badgeColor: "bg-[#FFF0F2] text-[#700B1A] border-[#F5D0D6]",
                title: "Gửi Thiệp Nhanh Chóng 1-Click",
                desc: "Tự động cá nhân hóa tên khách mời trên từng liên kết thiệp. Chia sẻ trực tiếp qua Zalo, Messenger, Facebook tức thì mà không tốn công di chuyển.",
              },
              {
                id: 1,
                icon: <Music size={22} className="text-amber-600" />,
                iconBg: "bg-amber-50 border-amber-100",
                badge: "✓ Nhạc Nền & Video Slide 4K",
                badgeColor: "bg-amber-50 text-amber-600 border-amber-100",
                title: "Nhạc Nền Lãng Mạn & Video Slide HD",
                desc: "Thiệp cưới tương tác sinh động với nhạc nền tự phát, album ảnh cưới nét căng và Video trình chiếu tiệc không dán logo vô cùng chuyên nghiệp.",
              },
              {
                id: 2,
                icon: <UsersRound size={22} className="text-emerald-600" />,
                iconBg: "bg-emerald-50 border-emerald-100",
                badge: "✓ Thống Kê RSVP & Google Maps",
                badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
                title: "Thống Kê Khách RSVP & Google Maps",
                desc: "Tự động ghi nhận danh sách khách xác nhận tham dự 24/7, nhận lời chúc mừng online và tích hợp bản đồ chỉ đường Google Maps tới tận nhà hàng.",
              },
            ].map((card, i) => {
              const position = (i - carouselIndex + 3) % 3;
              const isCenter = position === 0;
              const isRight = position === 1;

              return (
                <motion.div
                  key={card.id}
                  onClick={() => setCarouselIndex(i)}
                  animate={{
                    x: isCenter ? "0%" : isRight ? "52%" : "-52%",
                    scale: isCenter ? 1.04 : 0.82,
                    zIndex: isCenter ? 30 : 10,
                    opacity: isCenter ? 1 : 0.45,
                    filter: isCenter ? "blur(0px)" : "blur(2px)",
                    rotateY: isCenter ? 0 : isRight ? -16 : 16,
                  }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className={`absolute w-[84vw] sm:w-[340px] md:w-[380px] p-5 sm:p-6 rounded-2xl md:rounded-3xl cursor-pointer bg-white text-left transition-shadow duration-500 ${isCenter
                    ? "shadow-[0_25px_60px_rgba(112,11,26,0.18)] border-2 border-[#F5D0D6]"
                    : "shadow-md border border-zinc-200/80 hover:opacity-75"
                    }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-sm ${card.iconBg}`}>
                      {card.icon}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-950 mb-2 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 font-medium leading-relaxed">
                    {card.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Carousel Indicator Dots */}
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => setCarouselIndex(idx)}
                aria-label={`Chuyển tới slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-500 ${carouselIndex === idx
                  ? "w-8 bg-[#700B1A] shadow-sm"
                  : "w-2.5 bg-zinc-300 hover:bg-zinc-400"
                  }`}
              />
            ))}
          </div>
        </div>
      </section>



      {/* Templates Collection Showcase Section */}
      <section className="py-12 md:py-20 bg-white" id="mau-thiep">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center md:text-left mb-6 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-[#700B1A] font-bold text-xs uppercase tracking-wider bg-[#FFF0F2] px-3.5 py-1 rounded-full border border-[#F5D0D6] shadow-xs">
                <Sparkles size={14} className="animate-spin text-[#700B1A]" />
                <span>BỘ SƯU TẬP MẪU THIỆP CAO CẤP ({templatesToRender.length} MẪU)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                Chọn Mẫu & Trải Nghiệm <span className="inline-block text-[#700B1A] font-handwritten italic font-bold px-1">Thiệp Cưới Online</span>
              </h2>

            </div>


          </motion.div>



          {/* Responsive Mobile-Friendly Template Grid (2 columns on mobile, 4 columns on desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6 mb-8 md:mb-12">
            {templatesToRender
              .filter((item: any) => {
                if (selectedCategoryFilter === 'ALL') return true;
                const cat = (item.category?.name || item.tag || item.category || '').toUpperCase();
                if (selectedCategoryFilter === 'WEDDING') return cat.includes('WEDDING') || cat.includes('CƯỚI');
                if (selectedCategoryFilter === 'VIDEO') return cat.includes('VIDEO') || cat.includes('SLIDE');
                if (selectedCategoryFilter === 'EVENT') return cat.includes('EVENT') || cat.includes('TIỆC') || cat.includes('REUNION');
                return true;
              })
              .map((item: any) => {
                const imageSrc = item.thumbnailUrl || item.mainImage;
                const titleText = item.name || item.title;
                const categoryTag = item.category?.name || item.tag || 'WEDDING';
                const codeText = item.slug || item.code || 'DL-2026';
                const isVIP = item.isPremium;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-200/80 shadow-sm hover:shadow-xl hover:border-red-200 transition-all duration-300 group flex flex-col justify-between"
                  >
                    {/* Card Thumbnail with Smooth Hover Auto-Scroll */}
                    <div
                      className="relative aspect-[3/4.2] overflow-hidden bg-zinc-900 cursor-pointer"
                      onClick={() => handleOpenDemo(item)}
                    >
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={titleText}
                          className="w-full h-full object-cover object-top transition-all duration-[3.5s] ease-in-out group-hover:object-bottom"
                          style={{ transition: 'object-position 3.5s ease-in-out' }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-red-300 bg-red-50/40">
                          <Palette size={40} strokeWidth={1.5} />
                        </div>
                      )}

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                        <span className="bg-white/90 backdrop-blur-md text-[9px] sm:text-[10px] font-black tracking-widest text-zinc-900 px-2 sm:px-2.5 py-0.5 rounded-full border border-white/60 uppercase shadow-sm">
                          {categoryTag}
                        </span>
                        {isVIP ? (
                          <span className="bg-amber-400 text-zinc-950 text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                            VIP 👑
                          </span>
                        ) : (
                          <span className="bg-emerald-500 text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                            Miễn Phí
                          </span>
                        )}
                      </div>

                      {/* Hover Smooth Scroll Hint */}
                      <div className="absolute bottom-2 left-2.5 right-2.5 z-10 opacity-90 group-hover:opacity-0 transition-opacity duration-300">
                        <span className="text-[9px] font-semibold text-white/90 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md flex items-center gap-1 w-fit">
                          <ChevronDown size={10} className="animate-bounce text-amber-300" />
                          Rê chuột để cuộn xem
                        </span>
                      </div>

                      {/* Desktop Hover Action Overlay */}
                      <div className="hidden md:flex absolute inset-0 bg-zinc-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center p-3 gap-2">
                        <Button
                          onClick={(e) => handleOpenDemo(item, e)}
                          className="rounded-full bg-white text-zinc-900 font-bold text-xs px-4 py-2 shadow-md hover:bg-zinc-100"
                        >
                          👁️ Xem Demo
                        </Button>

                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="p-3 sm:p-4 text-left space-y-2 bg-white">
                      <div>
                        <h4 className="font-bold text-zinc-950 text-xs sm:text-sm tracking-tight line-clamp-1 group-hover:text-[#700B1A] transition-colors">
                          {titleText}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] font-medium text-zinc-400">
                          Mã: {codeText}
                        </p>
                      </div>

                      {/* Mobile Action Buttons Bar */}
                      <div className="pt-2 border-t border-zinc-100 flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleOpenDemo(item, e)}
                          className="flex-1 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[11px] font-bold transition-all text-center"
                        >
                          Xem Demo
                        </button>

                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>


        </div>
      </section>


      <section className="py-14 md:py-24 bg-white" id="thong-ke">
        <div className="w-full">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-10 md:mb-16 font-sans space-y-2 md:space-y-3 max-w-7xl mx-auto px-4 md:px-6"
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-poppins font-bold tracking-tight text-zinc-950 leading-tight">
              <span
                ref={invitationCountRef}
                className="count-up-animate text-[#700B1A] font-handwritten italic text-4xl sm:text-5xl md:text-7xl mr-1 relative inline-block"
              > 10
                {invitationCount}<span className="font-sans not-italic font-bold text-2xl sm:text-3xl md:text-5xl top-2 md:top-3.75 relative">+</span>
              </span>{" "}

              chiếc thiệp online <br className="md:hidden" /> đã chia sẻ thành công
            </h2>
            <p className="text-zinc-500 font-poppins text-xs sm:text-sm md:text-base font-medium max-w-xl mx-auto leading-relaxed">
              Lời mời tham dự sự kiện bằng thiệp Online <br className="hidden sm:inline" />
              phù hợp với mọi mạng xã hội và nền tảng trò chuyện trực tuyến
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex overflow-hidden w-full relative group/gallery mb-10 md:mb-16 mask-image-linear"
          >

            <div className="flex gap-4 md:gap-5 w-max animate-marquee hover:[animation-play-state:paused]">
              {doubleImages.map((img, idx) => {
                const isClicked = activeClickIdx === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => setActiveClickIdx(isClicked ? null : idx)}
                    className={`shrink-0 w-36 sm:w-45 md:w-55 aspect-3/4 rounded-2xl overflow-hidden border border-zinc-100 shadow-md transition-all duration-500 cursor-pointer
                    blur-[1px]
                    group-hover/gallery:blur-sm                     
                    hover:!blur-none hover:scale-105 hover:shadow-xl hover:border-red-300
                    ${isClicked ? "!blur-none scale-105 border-[#700B1A] ring-4 ring-red-100 shadow-xl" : ""}
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
          </motion.div>

          <div className="flex justify-center">
            <Button className="h-12 md:h-13 px-8 md:px-10 rounded-full font-poppins bg-[#700B1A] hover:bg-[#520712] text-white font-bold text-sm md:text-base shadow-[0_12px_30px_rgba(112,11,26,0.25)] hover:shadow-[0_18px_40px_rgba(112,11,26,0.35)] active:scale-95 transition-all flex items-center gap-2">
              Liên hệ ngay
            </Button>
          </div>

        </div>
      </section>

      {/* Video Slide Showcase Section */}
      <section className="py-10 md:py-16 bg-gradient-to-b from-white via-red-50/20 to-white border-t border-zinc-100" id="video-slide">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center md:text-left mb-6 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-[#700B1A] font-bold text-xs uppercase tracking-wider bg-[#FFF0F2] px-3.5 py-1 rounded-full border border-[#F5D0D6] shadow-xs">
                <Play size={14} className="text-[#700B1A] fill-[#700B1A]" />
                <span>BỘ SƯU TẬP VIDEO SLIDE CƯỚI 4K ({videoSlideTemplates.length} MẪU)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                Mẫu Video Slide Cưới <span className="inline-block text-[#700B1A] font-handwritten italic font-bold px-1">Trình Chiếu Tiệc 4K</span>
              </h2>
            </div>
          </motion.div>

          {/* Video Grid: 1 column on Mobile, 2 on SM, 4 on Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {videoSlideTemplates.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-200/80 shadow-sm hover:shadow-xl hover:border-red-200 transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Cover Thumbnail with Big Play Button */}
                <div
                  className="relative aspect-video overflow-hidden bg-zinc-900 cursor-pointer"
                  onClick={() => setSelectedVideoSlide(item)}
                >
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-zinc-950/40 group-hover:bg-zinc-950/30 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/95 text-[#700B1A] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#700B1A] group-hover:text-white transition-all duration-300">
                      <Play size={20} className="fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
                    <span className="bg-white/90 backdrop-blur-md text-[9px] sm:text-[10px] font-black tracking-widest text-zinc-900 px-2 sm:px-2.5 py-0.5 rounded-full border border-white/60 uppercase shadow-sm">
                      {item.category}
                    </span>
                    <span className="bg-[#700B1A] text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                      4K HD 🎬
                    </span>
                  </div>
                </div>

                {/* Info Block */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3 text-left">
                  <div>
                    <h3 className="font-bold text-zinc-900 text-sm md:text-base leading-snug group-hover:text-[#700B1A] transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-xs font-semibold text-zinc-400 mt-1">Mã: {item.code}</p>
                  </div>

                  <button
                    onClick={() => setSelectedVideoSlide(item)}
                    className="w-full h-10 rounded-full bg-zinc-50 hover:bg-[#FFF0F2] text-zinc-800 hover:text-[#700B1A] font-bold text-xs sm:text-sm border border-zinc-200/80 transition-all flex items-center justify-center gap-1.5 active:scale-95 text-center cursor-pointer"
                  >
                    <span>Xem Video Demo 🎬</span>
                    <Play size={14} className="fill-current text-[#700B1A]" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section: Authentic Traditional Luxury Poster Design */}
      <section className="py-8 md:py-12 bg-white overflow-hidden" id="bang-gia">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
          {/* Main Luxury Parchment Poster Frame */}
          <div className="relative bg-white border-[10px] md:border-[16px] border-[#700B1A] rounded-3xl md:rounded-[2.5rem] p-5 sm:p-7 md:p-10 pb-8 sm:pb-10 md:pb-12 shadow-sm text-zinc-900">
            {/* Traditional Corner Ornaments */}
            <div className="absolute top-2.5 left-2.5 pointer-events-none z-0">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#700B1A]" viewBox="0 0 40 40" fill="currentColor">
                <path d="M0 0h40v6H6v34H0V0zm10 10h20v4H14v16h-4V10z" />
              </svg>
            </div>
            <div className="absolute top-2.5 right-2.5 pointer-events-none z-0">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#700B1A] rotate-90" viewBox="0 0 40 40" fill="currentColor">
                <path d="M0 0h40v6H6v34H0V0zm10 10h20v4H14v16h-4V10z" />
              </svg>
            </div>
            <div className="absolute bottom-2.5 left-2.5 pointer-events-none z-0">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#700B1A] -rotate-90" viewBox="0 0 40 40" fill="currentColor">
                <path d="M0 0h40v6H6v34H0V0zm10 10h20v4H14v16h-4V10z" />
              </svg>
            </div>
            <div className="absolute bottom-2.5 right-2.5 pointer-events-none z-0">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#700B1A] rotate-180" viewBox="0 0 40 40" fill="currentColor">
                <path d="M0 0h40v6H6v34H0V0zm10 10h20v4H14v16h-4V10z" />
              </svg>
            </div>

            {/* Header: Logo Box + Big Title */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 md:pb-8 border-b border-[#700B1A]/20">
              {/* Brand Logo Box */}
              <div className="bg-white/95 border border-[#700B1A]/40 rounded-xl p-3 sm:p-4 text-center sm:text-left shadow-sm min-w-[170px]">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-[#700B1A] font-black text-xl tracking-tight">
                  <div className="w-7 h-7 rounded-lg border-2 border-[#700B1A] flex items-center justify-center font-sans font-bold text-xs">TB</div>
                  <span className="font-poppins font-black">TIMELESS BOND</span>
                </div>
                <div className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[#700B1A]/80 uppercase mt-0.5 font-poppins">
                  ONLINE INVITATION • SLIDE WEDDING
                </div>
              </div>

              {/* Title Block */}
              <div className="text-center sm:text-right">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#700B1A] tracking-tight font-poppins">
                  Bảng Giá Dịch Vụ
                </h2>
                <div className="text-xs sm:text-sm font-bold text-zinc-600 tracking-wider mt-0.5 font-poppins">
                  THIỆP CƯỚI ONLINE & VIDEO SLIDE CƯỚI
                </div>
              </div>
            </div>

            {/* Pricing Categories Stack */}
            <div className="relative z-10 space-y-6 sm:space-y-8 py-6">
              {/* Category 1: Gói Thiệp Cưới Online */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-[#700B1A] font-extrabold text-base sm:text-lg md:text-xl font-poppins">
                  <span className="text-amber-600 text-lg">❀</span>
                  <span>GÓI THIỆP CƯỚI ONLINE</span>
                </div>
                <div className="bg-white/95 rounded-2xl p-4 sm:p-6 border-2 border-[#E5C387]/70 shadow-sm space-y-3">
                  {[
                    { name: 'Thiệp nhà trai hoặc nhà gái', price: '149.000 đ' },
                    { name: 'Combo 2 thiệp nhà trai, gái theo mẫu', price: '200.000 đ' },
                    { name: 'Thiệp theo yêu cầu', price: '359.000 đ' },
                    { name: 'Thiệp điền tên từng khách cá nhân hóa', price: '+99.000đ' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4 border-b border-dashed border-amber-100 last:border-0 pb-2.5 last:pb-0">
                      <span className="text-zinc-800 text-left font-poppins text-sm sm:text-base md:text-lg font-bold">{item.name}</span>
                      <span className="text-[#700B1A] font-extrabold whitespace-nowrap font-poppins text-xs sm:text-sm md:text-base">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category 2: Gói Slide Cưới */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-[#700B1A] font-extrabold text-base sm:text-lg md:text-xl font-poppins">
                  <span className="text-amber-600 text-lg">❀</span>
                  <span>GÓI SLIDE CƯỚI</span>
                </div>
                <div className="bg-white/95 rounded-2xl p-4 sm:p-6 border-2 border-[#E5C387]/70 shadow-sm space-y-3">
                  {[
                    { name: 'Video Cưới Slide theo mẫu', price: '200.000 đ' },
                    { name: 'Video Chibi theo mẫu', price: '200.000 đ' },
                    { name: 'Video theo yêu cầu', price: '300.000 đ' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4 border-b border-dashed border-amber-100 last:border-0 pb-2.5 last:pb-0">
                      <span className="text-zinc-800 text-left font-poppins text-sm sm:text-base md:text-lg font-bold">{item.name}</span>
                      <span className="text-[#700B1A] font-extrabold whitespace-nowrap font-poppins text-xs sm:text-sm md:text-base">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category 3: Combo */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-[#700B1A] font-extrabold text-base sm:text-lg md:text-xl font-poppins">
                  <span className="text-amber-600 text-lg">❀</span>
                  <span>COMBO TIẾT KIỆM</span>
                </div>
                <div className="bg-white/95 rounded-2xl p-4 sm:p-6 border-2 border-[#E5C387]/70 shadow-sm space-y-4">
                  {[
                    {
                      name: 'Video cưới + combo 2 thiệp nhà trai và gái theo mẫu',
                      price: '350.000 đ'
                    },
                    {
                      name: 'Video cưới theo yêu cầu + 1 video màn hình chờ + Thiệp theo yêu cầu (combo 2 thiệp) + 1 playlist nhạc theo từng khoảnh khắc',
                      price: '550.000 đ'
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-6 border-b border-dashed border-amber-100 last:border-0 pb-3 last:pb-0 text-left">
                      <span className="text-zinc-800 leading-relaxed max-w-xl font-poppins text-sm sm:text-base md:text-lg font-bold">{item.name}</span>
                      <span className="text-[#700B1A] font-extrabold whitespace-nowrap self-end sm:self-center font-poppins text-xs sm:text-sm md:text-base">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Poster Footer Bar: Hotline & Contact Button */}
            <div className="relative z-10 mt-6 pt-5 border-t border-[#700B1A]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[#700B1A] font-extrabold text-sm sm:text-base tracking-wider font-poppins">
                <Phone size={18} className="text-[#700B1A] animate-pulse" />
                <span>HOTLINE: 032-963-5973</span>
              </div>
              <a
                href="https://zalo.me/0329635973"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#700B1A] hover:bg-[#520712] text-white font-bold text-xs sm:text-sm shadow-md transition-all text-center flex items-center justify-center gap-2 font-poppins active:scale-95"
              >
                <span>Tư Vấn & Đặt Thiệp Zalo</span>
                <Send size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <FinalCTA />
      <Footer />

      {/* Video Demo Embed Modal rendered at document.body level via React Portal */}
      {selectedVideoSlide && createPortal(
        <div 
          onClick={() => setSelectedVideoSlide(null)}
          className="fixed inset-0 z-[99999] bg-zinc-950/90 backdrop-blur-md flex items-center justify-center sm:p-6 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-full sm:h-auto sm:w-full sm:max-w-3xl bg-zinc-900 sm:rounded-3xl overflow-hidden shadow-2xl sm:border border-zinc-800 flex flex-col justify-between"
          >
            {/* Modal Header */}
            <div className="px-3.5 py-3 sm:p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between gap-2 text-left shrink-0">
              <div className="space-y-0.5 max-w-[82%]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black uppercase tracking-wider bg-red-950/80 text-red-400 px-2 py-0.5 rounded border border-red-900/60">
                    {selectedVideoSlide.category}
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-zinc-400">Mã: {selectedVideoSlide.code}</span>
                </div>
                <h3 className="font-bold text-white text-xs sm:text-base leading-tight line-clamp-1">
                  {selectedVideoSlide.name}
                </h3>
              </div>

              <button
                onClick={() => setSelectedVideoSlide(null)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Video Player:
               - Mobile: thumbnail + CTA button (Google Drive embed is broken on mobile)
               - Desktop: iframe embed */}
            {isMobileDevice ? (
              <div className="relative w-full flex-1 flex flex-col items-center justify-center bg-zinc-950 gap-5 px-6 py-8">
                {/* Thumbnail Preview */}
                <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-zinc-700">
                  <img
                    src={selectedVideoSlide.thumbnail}
                    alt={selectedVideoSlide.name}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-zinc-950/50 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-xl">
                      <Play size={26} className="fill-[#700B1A] text-[#700B1A] ml-1" />
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-1.5">
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Nhấn để xem video chất lượng cao trực tiếp trên Google Drive
                  </p>
                </div>

                <a
                  href={selectedVideoSlide.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full max-w-sm px-6 py-3.5 rounded-full bg-[#700B1A] hover:bg-[#520712] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                >
                  <Play size={16} className="fill-white text-white" />
                  <span>Xem Video Demo Ngay (Google Drive)</span>
                </a>
              </div>
            ) : (
              <div className="relative w-full bg-black shrink-0" style={{ aspectRatio: '16/9' }}>
                <iframe
                  src={selectedVideoSlide.embedUrl}
                  title={selectedVideoSlide.name}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                />
              </div>
            )}

            {/* Modal Footer Controls */}
            <div className="px-3.5 py-3 sm:p-4 bg-zinc-900 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <a
                href={selectedVideoSlide.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors py-0.5"
              >
                <span>🎬 Xem Video Fullscreen Trực Tiếp Trên Drive</span>
                <ExternalLink size={13} />
              </a>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedVideoSlide(null)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  Đóng
                </button>
                <a
                  href="https://zalo.me/0329635973"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-5 py-2 rounded-full bg-[#700B1A] hover:bg-[#520712] text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-md whitespace-nowrap"
                >
                  <span>Đặt Qua Zalo 💬</span>
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <TemplateModal
        template={selectedTemplate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>



  );
};
export default PublicLandingPage;