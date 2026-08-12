// src/components/Footer.tsx
import React from "react";
import { RevolvingHeartsIcon } from "../components/icons/emojione-revolving-hearts";

export default function Footer() {
  return (
    <footer id="lien-he" className="bg-white font-poppins font-medium border-t border-zinc-100 pt-8 pb-8 text-left">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <RevolvingHeartsIcon size={24} color="#700B1A" />
            <span className="text-xl font-black tracking-tight text-zinc-950">
              Timeless<span className="text-[#700B1A]">Bond</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium text-center md:text-right">
            Dịch vụ Thiệp Cưới Online & Video Slide Cưới 4K sang trọng, tiện lợi.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 text-xs text-zinc-400 font-medium gap-3">
          <div>
            © {new Date().getFullYear()} <span className="text-zinc-800 font-bold">TimelessBond™</span>. All Rights Reserved.
          </div>
          <div className="flex items-center gap-1">
            Made with love in Vietnam <span className="text-rose-600">❤️</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
export { Footer };