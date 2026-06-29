import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Calendar, Award } from 'lucide-react';

interface ThreeDInvitationProps {
  card: {
    id: number;
    title: string;
    image: string;
    url: string;
    date: string;
  };
  onClose: () => void;
}

export const ThreeDInvitation: React.FC<ThreeDInvitationProps> = ({ card, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const getCursiveNames = () => {
    if (card.title.includes('&')) {
      const parts = card.title.split('&');
      const groom = parts[0].replace(/Thiệp mời cưới|Thiệp Cưới|Lễ Cưới/gi, '').trim();
      const bride = parts[1].replace(/Wedding|Tiệc Cưới|Lễ Thành Hôn/gi, '').trim();
      return { groom, bride };
    }
    return { groom: "Gia Bảo", bride: "Khánh Huyền" };
  };

  const { groom, bride } = getCursiveNames();

  const handleEnvelopeClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-center overflow-y-auto p-4 select-none">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-zinc-400 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all duration-300 z-50 cursor-pointer shadow-md"
      >
        <X size={20} />
      </button>

      <div 
        className="relative flex flex-col items-center justify-center w-full max-w-lg min-h-[620px] pt-24"
        style={{ perspective: "1500px" }}
      >
        {!isOpen && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-12 text-center text-sm font-poppins font-semibold text-rose-400 uppercase tracking-widest bg-rose-500/10 border border-rose-500/20 px-6 py-2.5 rounded-full shadow-xs"
          >
            ✉️ Bấm vào bao thư để mở thiệp
          </motion.p>
        )}

        {isOpen && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-12 text-center text-sm font-poppins font-semibold text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-6 py-2.5 rounded-full shadow-xs"
          >
            🔄 Bấm vào thiệp cưới để lật xem thông tin
          </motion.p>
        )}

        <div 
          onClick={handleEnvelopeClick}
          className={`relative w-[300px] sm:w-[320px] h-[400px] cursor-pointer`}
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isOpen ? "translateY(120px) rotateX(15deg)" : "rotateX(20deg)",
          }}
        >
          <div 
            className="absolute inset-0 bg-red-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-1 border border-red-700 overflow-hidden"
            style={{ transform: "translateZ(-1px)" }}
          >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>

          <div
            onClick={handleCardClick}
            className="absolute left-3 right-3 h-[380px] rounded-2xl cursor-pointer"
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 1.2s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.8s",
              transform: isOpen 
                ? isFlipped 
                  ? "translateY(-230px) translateZ(50px) rotateY(180deg) scale(1.15)"
                  : "translateY(-230px) translateZ(50px) scale(1.15)"
                : "translateY(10px) translateZ(5px) scale(0.95)",
              boxShadow: isOpen 
                ? "0 25px 60px rgba(0,0,0,0.5)" 
                : "0 4px 10px rgba(0,0,0,0.1)",
              zIndex: isOpen ? 30 : 2,
            }}
          >
            <div 
              className="absolute inset-0 bg-[#fffdf5] rounded-2xl p-4 flex flex-col justify-between border-4 border-amber-100 shadow-inner overflow-hidden"
              style={{ 
                transform: "rotateY(0deg)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden"
              }}
            >
              <div className="absolute inset-2 border border-amber-300/40 rounded-xl pointer-events-none" />

              <div className="text-center mt-2 space-y-0.5">
                <span className="text-[10px] font-bold text-amber-600 font-poppins uppercase tracking-widest block">SAVE THE DATE</span>
                <div className="w-16 h-px bg-amber-200/80 mx-auto" />
              </div>

              <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-amber-200 shadow-sm relative">
                <img 
                  src={card.image} 
                  alt="Couple" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              <div className="text-center flex-1 flex flex-col justify-center py-2 space-y-1">
                <h3 className="font-handwritten text-2xl font-black text-rose-700 leading-snug drop-shadow-xs">
                  {groom} & {bride}
                </h3>
                <p className="text-[10px] font-bold text-zinc-500 font-poppins tracking-wider">LỄ THÀNH HÔN</p>
                <div className="flex justify-center items-center gap-1.5 text-rose-500">
                  <span>❤️</span>
                  <span className="text-xs font-bold text-zinc-700 font-poppins">{card.date}</span>
                  <span>❤️</span>
                </div>
              </div>

              <div className="text-center mb-1">
                <span className="text-[9px] font-bold text-amber-600 tracking-widest font-poppins uppercase">Trân Trọng Kính Mời</span>
              </div>
            </div>

            <div 
              className="absolute inset-0 bg-[#fffdf5] rounded-2xl p-5 flex flex-col justify-between border-4 border-amber-100 shadow-inner overflow-hidden"
              style={{ 
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden"
              }}
            >
              <div className="absolute inset-2 border border-amber-300/40 rounded-xl pointer-events-none" />

              <div className="text-center mt-1.5 space-y-1">
                <h3 className="font-handwritten text-2xl font-bold text-rose-700 leading-none">Thông Tin Tiệc Cưới</h3>
                <div className="w-24 h-px bg-amber-300 mx-auto" />
              </div>

              <div className="space-y-3.5 my-auto">
                <div className="flex items-start gap-2.5">
                  <div className="bg-rose-50 p-1.5 rounded-lg text-rose-500 shrink-0">
                    <Calendar size={14} />
                  </div>
                  <div className="text-left space-y-0.5">
                    <h4 className="text-[10px] font-extrabold text-zinc-700 font-poppins tracking-wide uppercase">Thời Gian</h4>
                    <p className="text-xs font-bold text-zinc-900 font-poppins">{card.date}</p>
                    <p className="text-[10px] text-zinc-500 font-poppins">Lễ Thành Hôn bắt đầu lúc 11:00</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="bg-rose-50 p-1.5 rounded-lg text-rose-500 shrink-0">
                    <MapPin size={14} />
                  </div>
                  <div className="text-left space-y-0.5">
                    <h4 className="text-[10px] font-extrabold text-zinc-700 font-poppins tracking-wide uppercase">Địa Điểm</h4>
                    <p className="text-xs font-bold text-zinc-900 font-poppins leading-tight">Trung tâm tiệc cưới DearLove Premium</p>
                    <p className="text-[10px] text-zinc-500 font-poppins line-clamp-1">128 Nguyễn Huệ, Quận 1, TP. HCM</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 p-2.5 rounded-xl">
                <div className="w-12 h-12 bg-white rounded-lg border border-zinc-200 flex items-center justify-center p-0.5 shrink-0 shadow-xs">
                  <img 
                    src={card.image} 
                    alt="QR" 
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="text-left space-y-0.5">
                  <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest font-poppins">Mừng Cưới Cô Dâu Chú Rể</span>
                  <p className="text-[10px] font-semibold text-zinc-600 font-poppins leading-tight">Quét QR mừng cưới chúc mừng hạnh phúc cặp đôi</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(card.url, '_blank');
                  }}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full py-2 text-[10px] font-bold tracking-wider uppercase active:scale-95 transition-all shadow-sm cursor-pointer text-center"
                >
                  📍 Xem bản đồ
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(false);
                  }}
                  className="flex-1 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 rounded-full py-2 text-[10px] font-bold tracking-wider uppercase active:scale-95 transition-all cursor-pointer text-center"
                >
                  ↩️ Mặt trước
                </button>
              </div>
            </div>
          </div>

          <div 
            className="absolute inset-x-0 top-0 h-[190px] rounded-t-3xl origin-top transition-transform duration-700 ease-in-out"
            style={{
              clipPath: "polygon(0 0, 50% 100%, 100% 0)",
              backgroundColor: isOpen ? "#92151d" : "#9e1c25",
              transform: isOpen ? "rotateX(180deg) translateZ(10px)" : "rotateX(0deg) translateZ(25px)",
              zIndex: isOpen ? 5 : 25,
            }}
          >
            <div 
              className="absolute inset-x-0 top-0 h-[178px] border-b-2 border-r-2 border-l-2 border-dashed border-amber-300/30 opacity-60" 
              style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0)" }}
            />
          </div>

          <div 
            className="absolute inset-x-0 bottom-0 h-[210px] bg-red-900 rounded-b-3xl z-10 border-t border-red-950"
            style={{
              clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
              transform: "translateZ(20px)",
            }}
          >
            <div 
              className="absolute inset-x-0 bottom-0 h-[200px] border-t-2 border-r-2 border-l-2 border-dashed border-amber-300/35 opacity-40" 
              style={{ clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }}
            />
          </div>

          <div 
            className="absolute inset-y-0 left-0 w-[170px] bg-red-850 rounded-l-3xl z-8"
            style={{
              clipPath: "polygon(0 0, 100% 50%, 0 100%)",
              transform: "translateZ(15px)",
            }}
          />

          <div 
            className="absolute inset-y-0 right-0 w-[170px] bg-red-850 rounded-r-3xl z-8"
            style={{
              clipPath: "polygon(100% 0, 0 50%, 100% 100%)",
              transform: "translateZ(15px)",
            }}
          />

          {!isOpen && (
            <div 
              className="absolute left-1/2 top-[175px] -translate-x-1/2 w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center shadow-xl border-4 border-amber-600 animate-pulse active:scale-95 transition-transform"
              style={{
                transform: "translateZ(26px) translateX(-50%)",
                zIndex: 26,
              }}
            >
              <Award className="text-amber-950 w-6 h-6" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
