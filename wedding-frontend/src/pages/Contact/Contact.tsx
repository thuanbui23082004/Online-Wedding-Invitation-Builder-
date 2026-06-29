import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FacebookIcon from '../../components/icons/FacebookIcon';
import InstagramIcon from '../../components/icons/InstagramIcon';
import ThreadsSquareIcon from '../../components/icons/ThreadsSquareIcon';
import TiktokIcon from '../../components/icons/TiktokIcon';
import { Mail, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import FloatingBackgroundHearts from '../../components/FloatingBackgroundHearts';

export const Contact: React.FC = () => {
    const socialLinks = [
        {
            name: "Facebook",
            sub: "Theo dõi ngay",
            icon: <FacebookIcon size={24} />,
            color: "bg-blue-50 text-blue-600 border-blue-100",
            href: "https://facebook.com"
        },
        {
            name: "Instagram",
            sub: "Theo dõi ngay",
            icon: <InstagramIcon size={24} />,
            color: "bg-pink-50 text-pink-600 border-pink-100",
            href: "https://instagram.com"
        },
        {
            name: "TikTok",
            sub: "Theo dõi ngay",
            icon: <TiktokIcon size={24} />,
            color: "bg-zinc-50 text-zinc-900 border-zinc-200/50",
            href: "https://tiktok.com"
        },
        {
            name: "Threads",
            sub: "Theo dõi ngay",
            icon: <ThreadsSquareIcon size={24} color="currentColor" />,
            color: "bg-zinc-50 text-zinc-900 border-zinc-200/50",
            href: "https://threads.net"
        },
        {
            name: "Email",
            sub: "Liên hệ ngay",
            icon: <Mail size={24} />,
            color: "bg-rose-50 text-rose-600 border-rose-100",
            href: "mailto:contact@dearlove.me"
        }
    ];

    const faqs = [
        {
            q: "Tôi đã tạo thiệp nhưng quên mật khẩu đăng nhập, phải làm sao?",
            a: "Bạn chỉ cần truy cập trang Đăng nhập, bấm chọn 'Quên mật khẩu' và điền địa chỉ email đã dùng để tạo tài khoản. Hệ thống sẽ tự động gửi link đặt lại mật khẩu mới cho bạn."
        },
        {
            q: "Tôi có thể sửa lại nội dung thiệp sau khi đã gửi link cho bạn bè không?",
            a: "Hoàn toàn được! Mọi nội dung chỉnh sửa trên tài khoản của bạn sẽ được tự động cập nhật ngay lập tức. Khách mời khi mở lại link cũ sẽ nhìn thấy nội dung mới nhất mà không cần bạn phải gửi lại link."
        },
        {
            q: "Hệ thống có giới hạn thời gian tồn tại của thiệp mời online không?",
            a: "Không. Thiệp mời cưới online của bạn sẽ được lưu giữ vĩnh viễn trên hệ thống DearLove như một kỷ niệm đẹp để bạn có thể xem lại bất cứ khi nào."
        },
        {
            q: "Khách mời có thể gửi quà mừng qua mã QR trên thiệp không?",
            a: "Có. Bạn hoàn toàn có thể thêm thông tin số tài khoản và mã QR nhận quà mừng cưới của cô dâu/chú rể trực tiếp lên thiệp mời để khách mời ở xa dễ dàng chúc phúc."
        }
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col font-poppins select-none relative overflow-hidden">
            <FloatingBackgroundHearts />
            <Header />

            <motion.main 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex-1 max-w-7xl mx-auto w-full px-6 pt-32 pb-24 space-y-16 relative z-10"
            >
                
                <div className="text-center space-y-4 relative">
                    
                    {/*  */}
                    <div className="flex justify-center items-center gap-1.5 text-sm text-zinc-400 font-medium font-poppins">
                        <span>Trang chủ</span>
                        <span className="text-zinc-300 font-normal">&gt;</span>
                        <span className="text-zinc-800 font-semibold">Liên hệ</span>
                    </div>

                    <div className="flex justify-center pt-2">
                        <svg width="48" height="8" viewBox="0 0 48 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 4.5C6.33333 1.83333 10.6667 7.16667 16 4.5C21.3333 1.83333 25.6667 7.16667 31 4.5C36.3333 1.83333 40.6667 7.16667 46 4.5" stroke="#FDA4AF" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight leading-tight pt-1">
                        Thông tin <span className="text-rose-500 font-handwritten text-[2.75rem] md:text-[3.75rem] font-normal pl-1 inline-block -rotate-1">liên hệ</span>
                    </h1>

                    <div className="relative inline-block max-w-2xl mx-auto px-4">
                        <p className="text-zinc-500 font-poppins font-medium text-sm md:text-base leading-relaxed">
                            Kết nối với <span className="font-semibold text-rose-500">DearLove</span> qua các kênh mạng xã hội và email bên dưới.
                        </p>
                        <span className="absolute -right-2 -bottom-2 text-amber-400 animate-pulse hidden md:inline-block">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z" />
                            </svg>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-2">
                    {socialLinks.map((social, idx) => (
                        <motion.a
                            key={idx}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}
                            className="bg-white rounded-4xl border border-zinc-100 p-8 flex flex-col items-center justify-center text-center space-y-5 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] cursor-pointer group"
                        >
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center border ${social.color} transition-transform group-hover:scale-110 duration-300`}>
                                {social.icon}
                            </div>
                            
                            <div className="space-y-1">
                                <h3 className="font-black text-rose-500 text-base font-poppins leading-tight">
                                    {social.name}
                                </h3>
                                <p className="text-xs text-zinc-400 font-semibold font-poppins tracking-tight">
                                    {social.sub}
                                </p>
                            </div>
                        </motion.a>
                    ))}
                </div>

                <div className="space-y-10 pt-8 border-t border-zinc-100">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight font-poppins uppercase">
                            Câu hỏi thường gặp
                        </h2>
                        <p className="text-sm text-zinc-400 font-medium font-poppins max-w-md mx-auto">
                            Giải đáp nhanh một số thắc mắc phổ biến của các cặp đôi khi sử dụng thiệp mời.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {faqs.map((faq, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                className="bg-white border border-zinc-100 rounded-3xl p-6 md:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 transition-all duration-300 text-left flex flex-col justify-between"
                            >
                                <div className="space-y-3">
                                    <h3 className="text-zinc-900 font-bold text-base tracking-tight leading-snug flex items-start gap-2.5">
                                        <HelpCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                                        <span>{faq.q}</span>
                                    </h3>
                                    <p className="text-sm text-zinc-500 font-medium leading-relaxed pl-7">
                                        {faq.a}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.main>

            <Footer />
        </div>
    );
};

export default Contact;
