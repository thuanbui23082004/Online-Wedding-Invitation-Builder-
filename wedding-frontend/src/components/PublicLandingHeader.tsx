import React, { useState, useEffect } from 'react';
import { RevolvingHeartsIcon } from './icons/emojione-revolving-hearts';
import { Send } from 'lucide-react';
import { cn } from '../lib/utils';

export const PublicLandingHeader: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { mobileName: 'Thiệp', name: 'Mẫu Thiệp', href: '#mau-thiep' },
        { mobileName: 'Slide', name: 'Video Slide', href: '#video-slide' },
        { mobileName: 'Bảng Giá', name: 'Bảng Giá', href: '#bang-gia' },
    ];

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.replace('#', '');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            } else if (href === '#mau-thiep') {
                const mauThiepEl = document.querySelector('.group\\/carousel');
                if (mauThiepEl) {
                    mauThiepEl.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (href === '#lien-he') {
                const footerEl = document.querySelector('footer');
                if (footerEl) {
                    footerEl.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-100 pt-0 px-0 sm:pt-4 sm:px-4 pointer-events-none font-sans transition-all duration-300">
            <nav className={cn(
                "mx-auto pointer-events-auto bg-white/98 backdrop-blur-2xl transition-all ease-[cubic-bezier(0.34,1.56,0.64,1)] duration-500 delay-0",
                "w-full rounded-none border-b border-t-0 border-x-0 border-zinc-200/80 px-3 sm:px-6 md:px-8 py-2 sm:py-1.5 shadow-xs",
                "sm:rounded-full sm:border sm:border-[#F5D0D6]",
                isScrolled
                    ? 'sm:max-w-5xl sm:py-1.5 sm:px-5 md:px-6 sm:shadow-[0_12px_35px_rgba(112,11,26,0.12)] sm:translate-y-0.5 sm:scale-[0.99]'
                    : 'sm:max-w-7xl sm:py-1.5 sm:px-6 md:px-8 sm:shadow-[0_15px_40px_rgba(0,0,0,0.06)]'
            )}>
                <div className="flex items-center justify-between h-10 sm:h-12 md:h-14 gap-1.5 sm:gap-3">
                    {/* Brand Logo: TIMELESS BOND */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="bg-[#FFF0F2] p-1 sm:p-1.5 rounded-xl transition-transform group-hover:rotate-12 border border-[#F5D0D6] flex items-center justify-center shrink-0">
                            <RevolvingHeartsIcon size={16} color="#700B1A" />
                        </div>
                        <span className="text-[11px] sm:text-base md:text-lg font-black tracking-tight text-zinc-950 uppercase whitespace-nowrap">
                            TIMELESS <span className="text-[#700B1A]">BOND</span>
                        </span>
                    </div>

                    {/* Navigation Links & Action Button */}
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => scrollToSection(e, link.href)}
                                className="px-2 sm:px-3 md:px-4 py-1 text-[11px] sm:text-xs md:text-sm font-extrabold rounded-full transition-all text-zinc-800 hover:text-[#700B1A] hover:bg-[#FFF0F2] active:scale-95 whitespace-nowrap"
                            >
                                <span className="sm:hidden">{link.mobileName}</span>
                                <span className="hidden sm:inline">{link.name}</span>
                            </a>
                        ))}

                        {/* Direct Zalo Chat Button on Header */}
                        <a
                            href="https://zalo.me/0329635973"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#700B1A] hover:bg-[#520712] text-white text-[10.5px] sm:text-xs md:text-sm font-extrabold shadow-sm active:scale-95 transition-all flex items-center gap-1 shrink-0"
                        >
                            <span>Zalo</span>
                            <Send size={11} className="hidden sm:inline ml-0.5" />
                        </a>
                    </div>
                </div>
            </nav>
        </header>
    );
};
