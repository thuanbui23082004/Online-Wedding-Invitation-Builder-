import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RevolvingHeartsIcon } from '../../components/icons/emojione-revolving-hearts';
import { BsEnvelopePaperHeart } from "react-icons/bs";
import { NotificationPopup } from './NotificationPopup';
import { useAuthStore } from '../../store/authStore';

import {
  LayoutDashboard, Palette, MessageSquare,
  UserCheck, Gift, User, Crown, MessageCircle, Bell, Megaphone, LayoutTemplate,
  ChevronLeft, Search
} from 'lucide-react';

export const DashboardLayout = ({ children }: { children: React.ReactNode; title?: string; subtitle?: string }) => {
  const location = useLocation();
  const { user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);


  const menuGroups = [
    {
      title: 'Tổng quan',
      items: [
        { name: 'Tổng quan', path: '/dashboard/overview', icon: LayoutDashboard },
        { name: 'Thiệp của tôi', path: '/dashboard/my-cards', icon: BsEnvelopePaperHeart },
        { name: 'Kho mẫu thiệp', path: '/dashboard/templates', icon: LayoutTemplate },
        { name: 'Tạo thiệp mới', path: '/editor', icon: Palette },
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
    <div className="flex h-screen bg-[#faf7f7] font-poppins text-zinc-800 select-none">
      <aside className={`bg-white/45 backdrop-blur-xl border border-[rgb(255,166,166)]/30 flex flex-col h-[calc(100vh-2rem)] shadow-lg transition-all duration-350 ease-in-out shrink-0 z-30 my-4 ml-8 rounded-[2.5rem] ${isSidebarOpen ? 'w-56 opacity-100' : 'w-0 opacity-0 -translate-x-full overflow-hidden pointer-events-none ml-0 my-0 border-none'}`}>

        <div className="flex items-center justify-between px-5 h-16 shrink-0 border-b border-[rgb(255,166,166)]/30">
          <Link to="/home" className="flex items-center gap-2 group cursor-pointer no-underline">
            <div className="bg-[rgb(255,237,199)] p-1.5 rounded-lg transition-transform group-hover:rotate-12 flex items-center justify-center border border-[rgb(255,166,166)]/30">
              <RevolvingHeartsIcon size={20} color="rgb(235, 76, 76)" />
            </div>
            <span className="text-lg font-serif font-black text-[rgb(235, 76, 76)] tracking-tight">DearLove</span>
          </Link>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-[rgb(235, 76, 76)] hover:bg-[rgb(255,237,199)]/45 border border-transparent hover:border-[rgb(255,166,166)]/30 transition-all cursor-pointer flex items-center justify-center"
            title="Thu gọn menu"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="px-3 text-[10px] font-black text-[rgb(255,112,112)] uppercase tracking-wider">{group.title}</h3>
              <div className="space-y-1">
                {group.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={itemIdx}
                      to={item.path}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-sm font-semibold border ${isActive
                        ? 'bg-[rgb(255,237,199)]/70 border-[rgb(255,166,166)]/40 text-[rgb(235, 76, 76)] shadow-2xs'
                        : 'border-transparent text-zinc-550 hover:bg-[rgb(255,237,199)]/20 hover:text-[rgb(235, 76, 76)]'
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

        <div className="p-4 border-t border-[rgb(255,166,166)]/30 shrink-0 relative flex items-center">
          <div className="flex items-center gap-3 bg-[rgb(255,237,199)]/20 border border-[rgb(255,166,166)]/25 p-2.5 rounded-full w-full">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[rgb(255,112,112)] to-[rgb(235,76,76)] text-white flex items-center justify-center font-black text-sm shadow-sm">
                {user?.fullName?.trim().split(/\s+/).pop()?.charAt(0).toUpperCase() || 'N'}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
            </div>

            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-black text-zinc-800 font-poppins truncate">
                {user?.fullName || 'Nguyen'}
              </p>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                Đang hoạt động
              </span>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white/60 backdrop-blur-md border-b border-[rgb(255,166,166)]/30 flex items-center justify-between px-6 shrink-0 z-10 shadow-2xs">

          {/* Header Left: Sidebar Trigger & Search Bar */}
          <div className="flex items-center gap-4 flex-1">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-2.5 group cursor-pointer no-underline focus:outline-none animate-in fade-in slide-in-from-left duration-300 mr-2"
                title="Mở menu chức năng"
              >
                <div className="bg-[rgb(255,237,199)] p-1.5 rounded-lg transition-transform group-hover:rotate-12 flex items-center justify-center border border-[rgb(255,166,166)]/30 shadow-sm">
                  <RevolvingHeartsIcon size={20} color="rgb(235, 76, 76)" />
                </div>
                <span className="text-lg font-serif font-black text-[rgb(235, 76, 76)] tracking-tight">DearLove</span>
                <span className="text-[10px] font-bold text-[rgb(235, 76, 76)] bg-[rgb(255,237,199)] border border-[rgb(255,166,166)]/40 px-2 py-0.5 rounded-md hover:bg-[rgb(255,237,199)]/80 transition-colors ml-1 uppercase tracking-wider">
                  Menu
                </span>
              </button>
            )}

            {/* Search Input field */}
            <div className="relative w-full max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[rgb(255,112,112)]">
                <Search size={15} />
              </span>
              <input
                type="text"
                placeholder="Tìm thiệp, mẫu, khách mời..."
                className="w-full pl-9 pr-4 py-2 rounded-full border border-[rgb(255,166,166)]/30 bg-slate-50/50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[rgb(235,76,76)]/10 focus:border-[rgb(255,112,112)] transition-all font-inter placeholder-zinc-400"
              />
            </div>
          </div>

          {/* Header Right: Megaphone status & Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 bg-[rgb(255,237,199)]/70 border border-[rgb(255,166,166)]/30 text-[rgb(235,76,76)] px-4 py-1.5 rounded-full text-[10px] font-bold shadow-2xs">
              <Megaphone size={12} className="animate-bounce" />
              <span>Hệ thống tạo thiệp di động đang hoạt động tối ưu!</span>
            </div>

            {/* Notifications & Creation Pill */}
            <div className="flex items-center gap-3 bg-[rgb(255,237,199)]/20 border border-[rgb(255,166,166)]/30 p-1.5 rounded-full shadow-2xs relative">
              <NotificationPopup isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />

              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-zinc-500 hover:text-[rgb(235,76,76)] transition-colors hover:bg-[rgb(255,237,199)]/35 rounded-full cursor-pointer flex items-center justify-center shrink-0 border border-transparent hover:border-[rgb(255,166,166)]/30 bg-white"
                title="Thông báo"
              >
                <Bell size={16} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[rgb(235,76,76)] border border-white" />
              </button>

              <div className="w-[1px] h-5 bg-[rgb(255,166,166)]/30" />

              <Link
                to="/dashboard/create"
                className="bg-[rgb(235,76,76)] hover:bg-[rgb(255,112,112)] text-white px-4 py-2 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm shadow-[rgb(235,76,76)]/10 cursor-pointer no-underline"
              >
                <span className="text-[14px] leading-none font-light">+</span>
                <span>Tạo mới</span>
              </Link>
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