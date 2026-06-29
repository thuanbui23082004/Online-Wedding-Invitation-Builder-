import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { customerCardsData } from '../../data/customerCards';
import { Mail, X } from 'lucide-react';
import { RevolvingHeartsIcon } from '../../components/icons/emojione-revolving-hearts';
import { motion } from 'framer-motion';
import { ThreeDInvitation } from '../../components/ThreeDInvitation';

export const InvitationShow: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [isQrVisible, setIsQrVisible] = useState(true);
    const [heartCount, setHeartCount] = useState(128);
    const [wishVisible, setWishVisible] = useState(true);
    const [hearts, setHearts] = useState<{ id: number, x: number }[]>([]);
    const [is3DOpen, setIs3DOpen] = useState(false);

    const handleShootHeart = () => {
        setHeartCount(prev => prev + 1);
        const newHeart = {
            id: Date.now(),
            x: Math.random() * 40 - 20
        };
        setHearts(prev => [...prev, newHeart]);
        setTimeout(() => {
            setHearts(prev => prev.filter(h => h.id !== newHeart.id));
        }, 1200);
    };

    const card = customerCardsData.find(c => c.id === Number(id)) || customerCardsData[0];

    const getCursiveNames = () => {
        if (card.title.includes('&')) {
            const parts = card.title.split('&');
            const groom = parts[0].replace(/Thiệp mời cưới|Thiệp Cưới|Lễ Cưới/gi, '').trim().split(' ').pop();
            const bride = parts[1].replace(/Wedding|Tiệc Cưới|Lễ Thành Hôn/gi, '').trim().split(' ').shift();
            return { groom, bride };
        }
        if (card.title.includes('-')) {
            const parts = card.title.split('-');
            const groom = parts[0].trim().split(' ').pop();
            const bride = parts[1].trim().split(' ').shift();
            return { groom, bride };
        }
        return { groom: "Anh", bride: "Uyên" };
    };

    const { groom, bride } = getCursiveNames();

    return (
        <div className="min-h-screen w-screen bg-zinc-100 flex items-center justify-center relative p-4 overflow-hidden select-none font-sans">
            
            <Link to="/" className="absolute top-6 left-6 flex items-center gap-2.5 z-50">
                <div className="bg-rose-100 p-2.5 rounded-2xl shadow-xs transition-transform hover:scale-105">
                    <RevolvingHeartsIcon size={24} color="#f43f5e" />
                </div>
                <span className="text-xl font-serif font-black text-zinc-800 tracking-tight hidden sm:inline-block">DearLove</span>
            </Link>

            <div className="relative w-full max-w-[430px] h-[88vh] min-h-[780px] max-h-[920px] bg-zinc-950 rounded-[3.25rem] p-3 shadow-2xl border-4 border-zinc-900/90 overflow-hidden flex flex-col">
                
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-zinc-950 rounded-full z-50 flex items-center justify-center border border-zinc-900/40">
                    <div className="w-3 h-3 bg-zinc-900 rounded-full mr-auto ml-4 opacity-50" />
                    <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full ml-auto mr-4 opacity-50" />
                </div>

                <div 
                    className="relative w-full h-full rounded-[2.75rem] overflow-hidden bg-cover bg-center flex flex-col justify-between py-9 px-5"
                    style={{ backgroundImage: `url(${card.image})` }}
                >
                    <div className="absolute inset-0 bg-linear-to-b from-black/45 via-transparent to-black/75 pointer-events-none" />

                    <div className="relative z-10 flex justify-end text-right">
                        <div className="space-y-1">
                            <div className="flex justify-end mb-1">
                                <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-1.5 rounded-full w-8 h-8 flex items-center justify-center">
                                    <span className="text-white text-xs">♾️</span>
                                </div>
                            </div>
                            <h4 className="text-white font-handwritten text-xl font-normal leading-none drop-shadow-md">
                                {groom}
                            </h4>
                            <span className="text-rose-400 font-handwritten text-xs font-normal block pr-2 opacity-90 drop-shadow-xs">❤️</span>
                            <h4 className="text-white font-handwritten text-xl font-normal leading-none drop-shadow-md">
                                {bride}
                            </h4>
                        </div>
                    </div>

                    <div className="relative z-10 flex-1 flex flex-col justify-center pb-12">
                        {wishVisible && (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white/70 backdrop-blur-md border border-white/30 rounded-full py-2 pl-4 pr-3 flex items-center justify-between gap-3 shadow-md max-w-[280px]"
                            >
                                <span className="text-zinc-800 text-[11px] font-semibold tracking-tight truncate">
                                    <span className="text-rose-500 font-bold">Yến xinh</span>: Chúc Chú hạnh phúc nha 🥰
                                </span>
                                <button 
                                    onClick={() => setWishVisible(false)}
                                    className="p-1 rounded-full hover:bg-zinc-200/50 text-zinc-500 hover:text-zinc-800 transition-colors"
                                >
                                    <X size={10} />
                                </button>
                            </motion.div>
                        )}
                    </div>

                    <div className="relative z-10 space-y-6">
                        
                        <div className="text-right text-white space-y-1 drop-shadow-md">
                            <h5 className="text-[10px] font-black tracking-widest text-zinc-300 uppercase font-poppins">THƯ MỜI TIỆC CƯỚI</h5>
                            <p className="text-xs font-bold font-poppins text-zinc-100">THỨ BẢY - 15:30</p>
                            <p className="text-[10px] font-medium text-zinc-300 font-poppins">04.07.2026</p>
                            <div className="w-16 h-px bg-white/35 ml-auto my-1.5" />
                            <h5 className="text-[10px] font-black tracking-widest text-zinc-300 uppercase font-poppins">LỄ THÀNH HÔN</h5>
                            <p className="text-xs font-bold font-poppins text-zinc-100">Chủ Nhật - 11:00</p>
                            <p className="text-[10px] font-medium text-zinc-300 font-poppins">05.07.2026</p>
                        </div>

                        <div className="flex justify-end relative">
                            <div className="relative">
                                <img 
                                    src={card.image} 
                                    alt="Avatar" 
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white/80 shadow-md"
                                />
                                <span className="absolute -bottom-1 -right-1 bg-red-500 text-white rounded-full p-0.5 border border-white flex items-center justify-center">
                                    <X size={8} />
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {/* 3D Invitation Toggle Button */}
                            <button
                                onClick={() => setIs3DOpen(true)}
                                className="w-full bg-linear-to-r from-white-500 via-rose-100 to-whitr-600 hover:from-amber-200 hover:via-rose-650 hover:to-pink-700 text-white font-black text-[10px] sm:text-xs py-3 px-4 rounded-full shadow-lg hover:shadow-rose-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10 uppercase tracking-widest font-poppins"
                            >
                                Trải nghiệm thiệp 3D
                            </button>

                            <div className="flex gap-4 text-xs font-poppins text-white/90 drop-shadow-xs pl-2 font-medium">
                                <span className="hover:text-rose-400 cursor-pointer">Nhà Trai</span>
                                <span className="hover:text-rose-400 cursor-pointer">Nhà Gái</span>
                            </div>

                            <div className="flex items-center gap-2 relative">
                                <button 
                                    onClick={() => alert('Chức năng gửi lời chúc sẽ sớm ra mắt!')}
                                    className="flex-1 bg-white-800/80 hover:bg-black backdrop-blur-xs text-white rounded-full py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-1.5 border border-white/10 active:scale-95 transition-all shadow-xs cursor-pointer"
                                >
                                    <Mail size={12} className="text-white-400" />
                                    <span>Gửi lời chúc...</span>
                                </button>

                                <button 
                                    onClick={handleShootHeart}
                                    className="bg-white-500 hover:bg-rose-600 text-white rounded-full py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-1 border border-rose-400/20 active:scale-95 transition-all shadow-md cursor-pointer"
                                >
                                    <span>💖</span>
                                    <span>Bắn tim</span>
                                </button>

                                <div className="relative shrink-0 bg-red-800/90 text-white rounded-full w-9 h-9 flex items-center justify-center text-xs font-black border border-red-700/20 font-poppins">
                                    <span>{heartCount}</span>
                                    <span className="absolute -top-1 -right-1 bg-rose-500 text-[8px] font-black rounded-full px-1 py-0.5 scale-75 animate-ping">
                                        0
                                    </span>
                                </div>

                                <div className="absolute bottom-12 right-6 pointer-events-none w-20 h-64 overflow-hidden z-50">
                                    {hearts.map((h) => (
                                        <motion.div
                                            key={h.id}
                                            initial={{ opacity: 1, y: 0, x: 0, scale: 0.8 }}
                                            animate={{ 
                                                opacity: 0, 
                                                y: -200, 
                                                x: h.x, 
                                                scale: 1.5,
                                                rotate: h.x * 0.8
                                            }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="absolute bottom-0 left-1/2 -translate-x-1/2 text-rose-500 text-xl filter drop-shadow-md"
                                        >
                                            💖
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isQrVisible && (
                <div className="fixed bottom-8 right-8 z-50 bg-white rounded-2xl p-5 shadow-2xl border border-zinc-100 flex flex-col items-center gap-3 w-40 animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <button 
                        onClick={() => setIsQrVisible(false)}
                        className="absolute -top-2 -right-2 bg-white hover:bg-rose-50 border border-zinc-100 shadow-md p-1.5 rounded-full text-zinc-400 hover:text-rose-500 transition-colors"
                    >
                        <X size={12} />
                    </button>
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider font-poppins">Quét mã QR để</span>
                    
                    <div className="w-28 h-28 bg-zinc-50 rounded-lg overflow-hidden border border-zinc-100 p-1 flex items-center justify-center">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(window.location.href)}`} 
                            alt="QR Code Link"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    
                    <span className="text-[10px] font-medium text-zinc-400 font-poppins">xem trên điện thoại</span>
                </div>
            )}

            {is3DOpen && (
                <ThreeDInvitation card={card} onClose={() => setIs3DOpen(false)} />
            )}
        </div>
    );
};

export default InvitationShow; //cái này thì preview chưa hoàn chỉnh
