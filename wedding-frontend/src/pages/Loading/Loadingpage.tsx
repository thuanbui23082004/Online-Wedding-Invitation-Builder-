import React from "react";
import { RevolvingHeartsIcon } from "../../components/icons/emojione-revolving-hearts";

interface LoadingPageProps {
  message?: string;
}

export default function LoadingPage({ message = "Đang tải dữ liệu ..." }: LoadingPageProps) {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 select-none font-poppins">
      
      <div className="relative flex flex-col items-center space-y-4">
        
        <div className="absolute -top-3 w-16 h-16 border-2 border-rose-100 border-t-rose-500 rounded-full animate-spin duration-1000" />
        
        <div className="w-10 h-10 flex items-center justify-center animate-bounce duration-700">
          <RevolvingHeartsIcon size={40} color="#f43f5e" />
        </div>
        
        <div className="space-y-1 text-center pt-2 z-10">
          <span className="text-xl font-handwritten font-black tracking-tighter text-zinc-950 block">
            Dear<span className="text-rose-500">Love</span>
          </span>
          <p className="text-xs font-bold text-zinc-400 tracking-wide animate-pulse">
            {message}
          </p>
        </div>
      </div>
      
    </div>
  );
}