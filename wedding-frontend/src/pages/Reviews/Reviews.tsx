import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { testimonialsData } from '../../data/testimonials';
import { motion } from 'framer-motion';
import FloatingBackgroundHearts from '../../components/FloatingBackgroundHearts';

export const Reviews: React.FC = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col font-poppins select-none relative overflow-hidden">
            <FloatingBackgroundHearts />
            <Header />

            <motion.main 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex-1 max-w-7xl mx-auto w-full px-6 pt-32 pb-24 space-y-12 relative z-10"
            >
                
                <div className="text-center space-y-4 relative">
                    
                    <div className="flex justify-center items-center gap-1.5 text-sm text-zinc-400 font-medium font-poppins">
                        <span>Trang chủ</span>
                        <span className="text-zinc-300 font-normal">&gt;</span>
                        <span className="text-zinc-800 font-semibold">Đánh giá của khách hàng</span>
                    </div>

                    <div className="flex justify-center pt-2">
                        <svg width="48" height="8" viewBox="0 0 48 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 4.5C6.33333 1.83333 10.6667 7.16667 16 4.5C21.3333 1.83333 25.6667 7.16667 31 4.5C36.3333 1.83333 40.6667 7.16667 46 4.5" stroke="#FDA4AF" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight leading-tight pt-1">
                        Đánh giá <span className="text-rose-500 font-handwritten text-[2.75rem] md:text-[3.75rem] font-normal pl-1 inline-block -rotate-1">khách hàng</span>
                    </h1>

                    <div className="relative inline-block max-w-2xl mx-auto px-4">
                        <p className="text-zinc-500 font-poppins font-medium text-sm md:text-base leading-relaxed">
                            Xem những cảm nhận chân thực và câu chuyện chuẩn bị đám cưới ngọt ngào của các cặp đôi đã tin tưởng chọn <span className="font-semibold text-rose-500">DearLove.</span>
                        </p>
                        <span className="absolute -right-2 -bottom-2 text-amber-400 animate-pulse hidden md:inline-block">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z" />
                            </svg>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
                    {testimonialsData.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            className="p-8 rounded-[2.5rem] border border-rose-100 shadow-[0_8px_30px_rgba(244,63,94,0.02)] bg-rose-50/10 backdrop-blur-xs flex flex-col justify-between"
                        >
                            <blockquote className="space-y-6 text-left">
                                <p className="text-zinc-600 leading-relaxed font-medium italic text-[14px]">
                                    "{item.text}"
                                </p>
                                <footer className="flex items-center gap-4 pt-2">
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="h-12 w-12 rounded-full object-cover ring-2 ring-rose-100" 
                                    />
                                    <div className="flex flex-col">
                                        <cite className="font-bold font-poppins not-italic tracking-tight text-zinc-900 text-[15px]">
                                            {item.name}
                                        </cite>
                                        <span className="text-[10px] font-black font-poppins uppercase tracking-wider text-rose-400">
                                            {item.role}
                                        </span>
                                    </div>
                                </footer>
                            </blockquote>
                        </motion.div>
                    ))}
                </div>
            </motion.main>

            <Footer />
        </div>
    );
};

export default Reviews;
