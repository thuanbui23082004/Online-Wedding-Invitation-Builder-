import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RevolvingHeartsIcon } from '../../components/icons/emojione-revolving-hearts';
import { BsEnvelopePaperHeart } from "react-icons/bs";
import { NotificationPopup } from './NotificationPopup';

import {
  LayoutDashboard, Palette, MessageSquare,
  UserCheck, Gift, User, Crown, MessageCircle, Bell, Megaphone, LayoutTemplate,
  ChevronLeft
} from 'lucide-react';

export const DashboardLayout = ({ children }: { children: React.ReactNode; title?: string; subtitle?: string }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const menuGroups = [
    {
      title: 'Tổng quan',
      items: [
        { name: 'Tổng quan', path: '/dashboard/overview', icon: LayoutDashboard },
        { name: 'Thiệp của tôi', path: '/dashboard/my-cards', icon: BsEnvelopePaperHeart },
        { name: 'Kho mẫu thiệp', path: '/dashboard/templates', icon: LayoutTemplate },
        { name: 'Trình thiết kế', path: '/editor', icon: Palette },
      ]
    },
    {
      title: 'Lời chúc & Quà tặng',
      items: [
        { name: 'Lời chúc', path: '/dashboard/wishes', icon: MessageSquare },
        { name: 'Xác nhận tham dự', path: '/dashboard/rsvp', icon: UserCheck },
        { name: 'Quà tặng', path: '/dashboard/gifts', icon: Gift },
      ]
    },
    {
      title: 'Tài khoản',
      items: [
        { name: 'Thông tin tài khoản', path: '/dashboard/account', icon: User },
        { name: 'Gói dịch vụ', path: '/dashboard/plan', icon: Crown },
      ]
    },
    {
      title: 'Hỗ trợ',
      items: [
        { name: 'Chia sẻ góp ý', path: '/dashboard/feedback', icon: MessageCircle },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-slate-50/50 font-poppins text-zinc-800 select-none">
      <aside className={`bg-white/95 backdrop-blur-md border-r border-rose-100/50 flex flex-col h-full shadow-[4px_0_24px_rgba(244,63,94,0.015)] transition-all duration-350 ease-in-out shrink-0 z-30 ${isSidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 -translate-x-full overflow-hidden pointer-events-none'}`}>

        <div className="flex items-center justify-between px-5 h-16 shrink-0 border-b border-rose-100/30">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer no-underline">
            <div className="bg-rose-50 p-1.5 rounded-lg transition-transform group-hover:rotate-12 flex items-center justify-center border border-rose-100/50">
              <RevolvingHeartsIcon size={22} color="#f43f5e" />
            </div>
            <span className="text-xl font-serif font-black text-zinc-800 tracking-tight">DearLove</span>
          </Link>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100/30 transition-all cursor-pointer flex items-center justify-center"
            title="Thu gọn menu"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="px-3 text-[10px] font-black text-rose-400/80 uppercase tracking-wider">{group.title}</h3>
              <div className="space-y-1">
                {group.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={itemIdx}
                      to={item.path}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-sm font-semibold border ${isActive
                        ? 'bg-rose-50/60 border-rose-100/50 text-rose-500 shadow-2xs'
                        : 'border-transparent text-zinc-500 hover:bg-rose-50/20 hover:text-rose-500/80'
                        }`}
                    >
                      <Icon size={17} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-rose-100/30 shrink-0 relative">

          <NotificationPopup isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />

          <div className="flex items-center gap-3 bg-zinc-50/60 border border-zinc-100/80 p-2.5 rounded-3xl">
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0">
              N
            </div>

            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-black text-zinc-800 font-poppins truncate">Nguyen</p>
              <p className="text-[9px] font-bold text-rose-500 font-poppins uppercase tracking-wider">Gói Tự Do</p>
            </div>

            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-1.5 text-zinc-400 hover:text-rose-500 transition-colors bg-white hover:bg-rose-50 rounded-lg border border-zinc-100 cursor-pointer flex items-center justify-center shrink-0"
              title="Thông báo"
            >
              <Bell size={14} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 border border-white" />
            </button>
          </div>

        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-rose-100/40 flex items-center justify-between px-6 shrink-0 z-10 shadow-2xs">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-2.5 group cursor-pointer no-underline focus:outline-none animate-in fade-in slide-in-from-left duration-300 mr-2"
                title="Mở menu chức năng"
              >
                <div className="bg-rose-50 p-1.5 rounded-lg transition-transform group-hover:rotate-12 flex items-center justify-center border border-rose-100/50 shadow-sm">
                  <RevolvingHeartsIcon size={20} color="#f43f5e" />
                </div>
                <span className="text-lg font-serif font-black text-zinc-800 tracking-tight">DearLove</span>
                <span className="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-100/50 px-2 py-0.5 rounded-md hover:bg-rose-100/50 transition-colors ml-1 uppercase tracking-wider">
                  Menu
                </span>
              </button>
            )}

            <div className="flex items-center gap-2 bg-rose-50/70 border border-rose-100/40 text-rose-500 px-4 py-1.5 rounded-full text-xs font-semibold shadow-2xs">
              <Megaphone size={13} className="animate-bounce" />
              <span>Hệ thống tạo thiệp di động đang hoạt động tối ưu!</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-zinc-50/30 px-3 py-1.5 rounded-full border border-zinc-100/50">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-black text-zinc-800 font-poppins">Nguyen</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-linear-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center font-black text-xs shadow-sm ring-2 ring-rose-100">
              N
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 relative">
          {children}
        </div>
      </main>
    </div>
  );
};