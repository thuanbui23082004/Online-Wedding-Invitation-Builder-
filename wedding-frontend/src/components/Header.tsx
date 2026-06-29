import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RevolvingHeartsIcon } from "./icons/emojione-revolving-hearts";
import { Button } from "./button";
import { cn } from "../lib/utils";
import { ChevronDown, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isHome = location.pathname === '/';

    const navLinks = [
        { name: 'Trang chủ', href: isHome ? '#trang-chu' : '/' },
        { name: 'Mẫu thiệp', href: '/templates' },
        { name: 'Thiệp đã tạo', href: '/created-cards' },
        { name: 'Đánh giá', href: '/reviews' },
        { name: 'Liên hệ', href: '/contact' },
    ];

    const isLinkActive = (linkName: string) => {
        if (location.pathname === '/templates') {
            return linkName === 'Mẫu thiệp';
        }
        if (location.pathname === '/created-cards') {
            return linkName === 'Thiệp đã tạo';
        }
        if (location.pathname === '/reviews') {
            return linkName === 'Đánh giá';
        }
        if (location.pathname === '/contact') {
            return linkName === 'Liên hệ';
        }
        return linkName === 'Trang chủ';
    };

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (isHome && href.startsWith('#')) {
            e.preventDefault();
            const id = href.substring(1);
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            } else if (id === 'trang-chu') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            setIsMenuOpen(false);
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] pt-6 px-4 pointer-events-none font-sans transition-all duration-300">
            <nav className={cn(
                "mx-auto pointer-events-auto bg-white/80 backdrop-blur-xl border transition-all ease-[cubic-bezier(0.34,1.56,0.64,1)] duration-500 delay-0",			
                isScrolled 
                    ? 'max-w-5xl py-2 px-6 rounded-full shadow-[0_12px_40px_rgba(244,63,94,0.15)] bg-white/90 border-rose-100 translate-y-1 scale-[0.98]' 
                    : 'max-w-7xl py-2 px-10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white/90 border-rose-100'
            )}>
                <div className="flex justify-between items-center h-14">
                    <Link to="/" className="flex items-center gap-2.5 shrink-0 group cursor-pointer">
                        <div className="bg-rose-100 p-2 rounded-xl transition-transform group-hover:rotate-12">
                            <RevolvingHeartsIcon size={28} color="#f43f5e" />
                        </div>
                        <span className="text-2xl font-serif font-black text-zinc-800">DearLove</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => {
                            const active = isLinkActive(link.name);
                            const isRoute = link.href.startsWith('/') && !link.href.includes('#');
                            
                            return isRoute ? (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className={cn(
                                        "px-4 py-2 text-[15px] font-medium rounded-full transition-all flex items-center gap-1",
                                        active 
                                            ? "text-rose-600 font-bold bg-rose-50/50" 
                                            : "text-gray-600 hover:text-gray-950 hover:bg-gray-50/50"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ) : (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => handleLinkClick(e, link.href)}
                                    className={cn(
                                        "px-4 py-2 text-[15px] font-medium rounded-full transition-all flex items-center gap-1",
                                        active 
                                            ? "text-rose-600 font-bold bg-rose-50/50" 
                                            : "text-gray-600 hover:text-gray-950 hover:bg-gray-50/50"
                                    )}
                                >
                                    {link.name}
                                </a>
                            );
                        })}
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
                                className="rounded-xl px-6 bg-rose-600/80 hover:bg-rose-700/80 text-white transition-transform group-hover:rotate-12 shadow-none"
                            >
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
                            {navLinks.map((link) => {
                                const active = isLinkActive(link.name);
                                const isRoute = link.href.startsWith('/') && !link.href.includes('#');

                                return isRoute ? (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        className={cn(
                                            "flex items-center justify-between w-full px-4 py-3 text-base font-medium rounded-xl transition-colors",
                                            active
                                                ? "bg-rose-50 text-rose-600 font-bold"
                                                : "text-gray-700 hover:bg-zinc-50"
                                        )}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {link.name}
                                        <ChevronDown className="h-4 w-4 -rotate-90 opacity-30" />
                                    </Link>
                                ) : (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={(e) => handleLinkClick(e, link.href)}
                                        className={cn(
                                            "flex items-center justify-between w-full px-4 py-3 text-base font-medium rounded-xl transition-colors",
                                            active
                                                ? "bg-rose-50 text-rose-600 font-bold"
                                                : "text-gray-700 hover:bg-zinc-50"
                                        )}
                                    >
                                        {link.name}
                                        <ChevronDown className="h-4 w-4 -rotate-90 opacity-30" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};
export default Header;
