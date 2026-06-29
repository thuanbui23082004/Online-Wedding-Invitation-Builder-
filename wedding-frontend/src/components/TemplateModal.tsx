// src/components/TemplateModal.tsx
import React, { useEffect, useRef } from "react";
import type { TemplateItem } from "../data/templates";
import { Button } from "../components/button"; 
import { X, Heart, Palette, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TemplateModalProps {
  template: TemplateItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TemplateModal({ template, isOpen, onClose }: TemplateModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && template && (
        <div 
          onClick={handleOverlayClick}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4 md:p-6"
        >
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="bg-white w-full max-w-5xl h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden relative grid grid-cols-1 lg:grid-cols-12 border border-zinc-100"
          >
            
            <button 
              onClick={onClose}
              className="absolute right-6 top-6 z-50 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-rose-50 text-zinc-500 hover:text-rose-600 shadow-sm border border-zinc-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="lg:col-span-7 bg-zinc-50 p-6 lg:p-10 overflow-y-auto h-[45vh] lg:h-full space-y-6 [scrollbar-width:none]">
              <div className="max-w-md mx-auto space-y-6 pt-4">
                {template.detailImages.map((img, index) => (
                  <div 
                    key={index} 
                    className="w-full rounded-2xl overflow-hidden bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-zinc-100"
                  >
                    <img 
                      src={img} 
                      alt={`Page ${index + 1}`} 
                      className="w-full h-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between h-[40vh] lg:h-full border-t lg:border-t-0 lg:border-l border-zinc-100 bg-white text-left">
              
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <span className="bg-rose-50 text-rose-600 text-[10px] font-black tracking-widest px-3 py-1 rounded-full border border-rose-100 uppercase">
                    {template.tag}
                  </span>
                  <span className="text-xs font-semibold text-zinc-400">
                    Mã: {template.code}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-zinc-900 tracking-tight leading-snug">
                  {template.title}
                </h3>

                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-sm font-bold text-zinc-400">Giá khuyên dùng:</span>
                  <span className="text-xl font-black text-rose-600 bg-rose-50/60 px-3 py-0.5 rounded-md">
                    {template.price}
                  </span>
                </div>

                <div className="border-t border-dashed border-zinc-100 pt-4">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-500" /> Mô tả thiết kế
                  </h4>
                  <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                    {template.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-zinc-100">
                <Button className="w-full h-12 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-base shadow-[0_10px_25px_rgba(225,29,72,0.15)] hover:shadow-[0_15px_35px_rgba(225,29,72,0.25)] transition-all flex items-center justify-center gap-2">
                  <Palette size={18} /> Tạo thiệp với mẫu này
                </Button>
                
                <Button variant="outline" className="w-full h-12 rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-rose-600 bg-white font-bold transition-all flex items-center justify-center gap-2">
                  <Heart size={18} /> Thêm vào yêu thích
                </Button>
              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
