import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { customerCardsData } from '../../data/customerCards';
import { Eye } from 'lucide-react';
import { Button } from '../../components/button';
import { motion } from 'framer-motion';
import FloatingBackgroundHearts from '../../components/FloatingBackgroundHearts';

export const CreatedCards: React.FC = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col font-poppins select-none relative overflow-hidden">
            <FloatingBackgroundHearts />
            <Header />

            <motion.main 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex-1 max-w-360 mx-auto w-full px-4 md:px-8 pt-32 pb-24 space-y-12 relative z-10"
            >
                
                <div className="text-center space-y-4 relative">
                    
                    <div className="flex justify-center items-center gap-1.5 text-sm text-zinc-400 font-medium font-poppins">
                        <span>Trang chủ</span>
                        <span className="text-zinc-300 font-normal">&gt;</span>
                        <span className="text-zinc-800 font-semibold">Thiệp online của khách hàng</span>
                    </div>

                    <div className="absolute right-[25%] top-[10%] text-amber-400 animate-pulse hidden lg:block">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z" />
                        </svg>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight leading-tight pt-2">
                        <span className="text-rose-500 font-handwritten text-[2.75rem] md:text-[3.75rem] font-normal tracking-wide block -rotate-1">Bộ sưu tập</span>
                        <span className="block mt-1">thiệp online của khách hàng</span>
                    </h1>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-4 max-w-3xl mx-auto pt-2">
                        <div className="shrink-0 text-purple-500 opacity-80">
                            <svg width="48" height="8" viewBox="0 0 48 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 4.5C6.33333 1.83333 10.6667 7.16667 16 4.5C21.3333 1.83333 25.6667 7.16667 31 4.5C36.3333 1.83333 40.6667 7.16667 46 4.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <p className="text-zinc-500 font-poppins font-medium text-sm md:text-base leading-relaxed text-center md:text-left">
                            Khám phá bộ sưu tập thiệp online cực đẹp và độc đáo của khách hàng tại <span className="font-semibold text-rose-500">DearLove!</span>
                        </p>
                    </div>

                    {/* Love Count Stats */}
                    <div className="pt-2 flex justify-center items-center gap-2 text-rose-500 font-bold text-sm font-poppins">
                        <svg className="w-4 h-4 shrink-0 text-rose-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span>2.235 câu chuyện tình yêu đã được chia sẻ.</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {customerCardsData.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="relative aspect-[3/4.2] rounded-4xl overflow-hidden border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.015)] hover:shadow-[0_15px_35px_rgba(244,63,94,0.08)] hover:-translate-y-1 transition-all duration-500 group cursor-pointer"
                            onClick={() => window.open(item.url, '_blank')}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover filter blur-[6px] group-hover:blur-none group-hover:scale-105 transition-all duration-700 ease-out"
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-left transition-all duration-300 group-hover:from-black/90">
                                
                                <div className="space-y-1.5">
                                    <h3 className="font-bold text-white text-sm md:text-base tracking-tight leading-snug line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-1 text-zinc-300 text-[10px] md:text-xs font-medium font-poppins">
                                        <span></span>
                                        <span>{item.date}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                                <Button
                                    className="rounded-full bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs py-2.5 px-6 shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95 duration-200"
                                >
                                    <Eye size={14} /> Xem thiệp
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.main>

            <Footer />
        </div>
    );
};

export default CreatedCards;
