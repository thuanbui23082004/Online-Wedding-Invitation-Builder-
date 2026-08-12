
import { RevolvingHeartsIcon } from "./icons/emojione-revolving-hearts";
import { Footer } from "./Footer";
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
    LogOut,
    Zap,
} from 'lucide-react';

import { useAuthStore } from '../store/authStore';
import { Button } from '../components/button';
// import "./style.css";
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { cardsApi } from '../api/cardsApi';
import { toast } from 'sonner';
import { Link, useNavigate, useLocation } from 'react-router-dom';
export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleCreateCard = async () => {
        try {
            const card = await cardsApi.createCard({ title: 'Thiệp cưới của tôi' });
            toast.success('Tạo thiệp thành công!');
            navigate(`/loading?next=${encodeURIComponent(`/design?id=${card.id}`)}&message=${encodeURIComponent('Đang mở trình thiết kế...')}`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo thiệp');
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Trang chủ', href: '/' },
        { name: 'Mẫu thiệp', href: '/templates' },
        { name: 'Thiệp đã tạo', href: '/my-cards' },
        { name: 'Đánh giá', href: '/reviews' },
        { name: 'Liên hệ', href: '/contact' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-100 pt-3 md:pt-6 px-2 md:px-4 pointer-events-none font-sans transition-all duration-300">
            <nav className={cn(
                "mx-auto pointer-events-auto bg-white/90 backdrop-blur-xl border transition-all ease-[cubic-bezier(0.34,1.56,0.64,1)] duration-500 delay-0",
                isScrolled
                    ? 'max-w-5xl py-1.5 px-3 md:py-2 md:px-6 rounded-full shadow-[0_12px_40px_rgba(230,18,52,0.12)] bg-white/95 border-red-100/80 translate-y-1 scale-[0.98]'
                    : 'max-w-7xl py-2 px-3 md:px-10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white/95 border-red-100/80'
            )}>
                <div className="flex justify-between items-center h-12 md:h-14 gap-2">
                    <div className="flex items-center gap-2 md:gap-2.5 shrink-0 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="bg-red-50 p-1.5 md:p-2 rounded-xl transition-transform group-hover:rotate-12 border border-red-100">
                            <RevolvingHeartsIcon size={24} color="#e61234" />
                        </div>
                        <span className="text-xl md:text-2xl font-serif font-black text-zinc-900 tracking-tight">Dear<span className="text-[#e61234]">Love</span></span>
                    </div>

                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={cn(
                                    "px-4 py-2 text-[15px] font-medium rounded-full transition-all flex items-center gap-1",
                                    location.pathname === link.href
                                        ? "text-[#e61234] font-bold bg-red-50/80 border border-red-100/60"
                                        : "text-gray-600 hover:text-gray-950 hover:bg-gray-50/50"
                                )}
                            >
                                {link.name}
                                {['Security', 'Document', 'Integration'].includes(link.name) && (
                                    <ChevronDown className="h-3.5 w-3.5 opacity-40" />
                                )}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center space-x-1 md:space-x-2 ml-auto md:ml-0">
                        {user ? (
                            <div className="flex items-center bg-white border border-red-100 p-1 md:p-1.5 rounded-full shadow-sm">
                                <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-red-50 flex items-center justify-center text-[#e61234] font-bold uppercase overflow-hidden shrink-0 text-xs md:text-sm border border-red-100">
                                    {user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                                    ) : (
                                        user.fullName?.charAt(0) || 'U'
                                    )}
                                </div>
                                <div className="ml-1 md:ml-2">
                                    <Button onClick={() => navigate('/dashboard/overview')} variant="default" className="rounded-full h-7 md:h-9 px-2.5 md:px-4 text-white bg-[#e61234] hover:bg-[#c80b2a] shadow-none text-[12px] md:text-sm flex items-center gap-1 md:gap-1.5 font-semibold border-0">
                                        <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-300" />
                                        <span>Tổng quan</span>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="block">
                                    <Button variant="ghost" className="font-semibold text-gray-600 hover:text-[#e61234] text-[13px] md:text-sm px-2 md:px-4 h-8 md:h-10">
                                        Đăng nhập
                                    </Button>
                                </Link>
                                <Link to="/signup" className="hidden md:inline-block">
                                    <Button
                                        variant="default"
                                        className="rounded-xl px-6 bg-[#e61234] hover:bg-[#c80b2a] text-white transition-transform group-hover:rotate-12 shadow-none">
                                        Đăng ký
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="md:hidden ml-1 shrink-0">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 h-8 w-8" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="h-5 w-5 text-[#e61234]" /> : <Menu className="h-5 w-5 text-zinc-700" />}
                        </Button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden mt-3 py-3 bg-white/95 rounded-2xl border border-red-100 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="space-y-1 px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className={cn(
                                        "flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium rounded-xl transition-colors",
                                        location.pathname === link.href
                                            ? "bg-red-50 text-[#e61234] font-bold"
                                            : "text-gray-700 hover:bg-zinc-50"
                                    )}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                    <ChevronDown className="h-4 w-4 -rotate-90 opacity-30" />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};