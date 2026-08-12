import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { RevolvingHeartsIcon } from '../../../components/icons/emojione-revolving-hearts';
import { useAuthStore } from '../../../store/authStore';
import { BsEnvelopePaperHeart } from "react-icons/bs";
import { NotificationPopup } from './NotificationPopup';

import {
  LayoutDashboard, Palette, MessageSquare,
  UserCheck, Menu, Mails, Wallet, Home, Gift, User, Crown, MessageCircle, Bell, Megaphone, LayoutTemplate,
  ChevronLeft, LogOut, Search, Heart
} from 'lucide-react';

export const DashboardLayout = ({ children }: { children: React.ReactNode; title?: string; subtitle?: string }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    // Run once to initialize correctly on mount
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  if (user && user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  const handleLogout = async () => {
    await logout();
    navigate('/home');
  };

  const displayName = user?.fullName ? user.fullName.trim().split(/\s+/).pop() : 'User';

  const menuGroups = [
    {
      title: 'Tổng quan',
      items: [
        { name: 'Tổng quan', path: '/dashboard/overview', icon: LayoutDashboard },
        { name: 'Thiệp của tôi', path: '/dashboard/my-cards', icon: BsEnvelopePaperHeart },
        { name: 'Kho mẫu thiệp', path: '/dashboard/templates', icon: LayoutTemplate },
        { name: 'Tạo thiệp mới', path: '/dashboard/create', icon: Palette },
      ]
    },
    {
      title: 'Lời chúc & Quà tặng',
      items: [
        { name: 'Lời chúc', path: '/dashboard/wishes', icon: Heart },
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

  const closeSidebar = () => setIsSidebarOpen(false);

  const SidebarContent = () => (
    <>
      {/* Logo + Close */}
      <div className="flex items-center justify-between px-5 h-16 shrink-0 border-b border-[rgb(255,166,166)]/30">
        <Link to="/dashboard/overview" className="flex items-center gap-2 group cursor-pointer no-underline" onClick={closeSidebar}>
          <div className="bg-[rgb(253,205,209)] p-1.5 rounded-lg transition-transform group-hover:rotate-12 flex items-center justify-center border border-[rgb(255,166,166)]/30">
            <RevolvingHeartsIcon size={20} color="#f43f5e" />
          </div>
          <span className="text-lg font-serif font-black text-[rgb(235, 76, 76)] tracking-tight">DearLove</span>
        </Link>

        <button
          onClick={closeSidebar}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-[rgb(235, 76, 76)] hover:bg-[rgb(255,237,199)]/45 border border-transparent hover:border-[rgb(255,166,166)]/30 transition-all cursor-pointer flex items-center justify-center" title="Thu gọn menu"
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto custom-scrollbar-mini">        {menuGroups.map((group, idx) => (
        <div key={idx} className="space-y-2">
          <h3 className="px-3 text-[10px] font-black text-[rgb(255,112,112)] uppercase tracking-wider">{group.title}</h3>          <div className="space-y-1">
            {group.items.map((item, itemIdx) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={itemIdx}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-sm font-semibold border ${isActive
                    ? 'bg-rose-50 border-[rgb(255,166,166)]/40 text-rose-500 shadow-2xs'
                    : 'border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'}`}
                >
                  {/* <span className={isActive ? 'text-rose-500' : 'text-slate-400 transition-colors group-hover:text-slate-600'}> */}
                  <Icon size={17} />
                  {/* </span> */}
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-slate-200 shrink-0 relative">
        <div className="hidden md:block">
          <NotificationPopup isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-[10px]">
          <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0 overflow-hidden">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
            ) : (
              user?.fullName?.charAt(0) || 'U'
            )}
          </div>

          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-bold text-slate-800 font-inter truncate">{displayName}</p>
            <p className="text-[10px] font-semibold text-rose-500 font-inter uppercase tracking-wide">Gói Tự Do</p>
          </div>

          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-slate-400 hover:text-rose-500 transition-colors bg-white hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer flex items-center justify-center shrink-0"
            title="Thông báo"
          >
            <Bell size={14} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 border border-white" />
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-3 flex items-center gap-3 px-4 py-2.5 rounded-full transition-all duration-200 text-xs font-bold text-zinc-500 hover:bg-[rgb(255,237,199)]/30 hover:text-[rgb(235,76,76)] border border-transparent hover:border-[rgb(255,166,166)]/30 cursor-pointer"        >
          <LogOut size={17} />
          Đăng xuất
        </button>
      </div>
    </>
  );

  return (

    <div className="flex h-screen bg-slate-50/50 font-inter text-zinc-800 select-none overflow-hidden">

      {/* ── DESKTOP SIDEBAR (md+) ─────────────────────────────── */}
      <aside
        className={`hidden md:flex bg-white border-r border-slate-100 flex-col h-full transition-all duration-300 ease-in-out shrink-0 z-30 ${isSidebarOpen ? 'md:w-64' : 'md:w-0 md:opacity-0 md:-translate-x-full md:overflow-hidden md:pointer-events-none'}`}
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        <SidebarContent />
      </aside>

      {/* ── MOBILE SIDEBAR OVERLAY (< md) ────────────────────── */}
      <div className={`md:hidden fixed inset-0 z-50 flex ${isSidebarOpen ? '' : 'pointer-events-none'}`}>
        {/* Dark backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeSidebar}
        />
        {/* Sidebar panel */}
        <aside
          className={`relative w-[80vw] max-w-sm bg-white/95 backdrop-blur-xl border-r border-[rgb(255,166,166)]/30 flex flex-col h-full shadow-2xl transition-transform duration-300 ease-out rounded-r-[2.25rem] ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{ fontFamily: "'Poppins', 'Inter', system-ui, sans-serif" }}
        >
          <SidebarContent />
        </aside>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">

        {/* Header Desktop */}
        <header className="hidden md:flex h-14 md:h-16 bg-white/80 backdrop-blur-xl border-b border-slate-100 items-center justify-between px-4 md:px-6 shrink-0 z-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all duration-300">          <div className="flex items-center gap-2 md:gap-3 min-w-0">
          {/* Hamburger / logo toggle */}
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 group cursor-pointer focus:outline-none shrink-0"
              title="Mở menu"
            >
              <div className="bg-[rgb(253,205,209)] p-1.5 rounded-lg transition-transform group-hover:rotate-12 flex items-center justify-center border border-[rgb(255,166,166)]/30 shadow-sm">
                <RevolvingHeartsIcon size={20} color="rgb(235, 76, 76)" />
              </div>
              <span className="text-lg font-serif font-black text-[rgb(235, 76, 76)] tracking-tight">DearLove</span>
              <span className="text-[10px] font-bold text-[rgb(235, 76, 76)] bg-[rgb(253,205,209)] border border-[rgb(255,166,166)]/40 px-2 py-0.5 rounded-md hover:bg-[rgb(255,237,199)]/80 transition-colors ml-1 uppercase tracking-wider">
                Menu
              </span>
            </button>
          )}

        </div>

          {/* Header Right: Megaphone status & Actions */}
          <div className="  flex items-center gap-4 ">            <div className="hidden lg:flex items-center gap-2 bg-[rgb(255,237,199)]/40 border border-[rgb(255,166,166)]/30 text-[rgb(235,76,76)] px-4 py-1.5 rounded-full text-[10px] font-bold shadow-2xs">
            <Megaphone size={12} className="animate-bounce" />
            <span>Hệ thống tạo thiệp di động đang hoạt động tối ưu!</span>
          </div>

            {/* Notifications */}
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

              <div className="w-7 h-7 rounded-full bg-linear-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center font-black text-xs shadow-sm ring-2 ring-rose-100 overflow-hidden">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  user?.fullName?.charAt(0) || 'U'
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Header Mobile App-like */}
        <header className="md:hidden flex h-14 bg-white items-center justify-between px-4 shrink-0 z-10 shadow-sm relative">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-800 hover:text-rose-600 cursor-pointer">
              <Menu size={24} strokeWidth={2.5} />
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-rose-50 p-1.5 rounded-lg flex items-center justify-center border border-rose-100/50 shadow-sm">
                <RevolvingHeartsIcon size={20} color="#f43f5e" />
              </div>
              <span className="text-base font-serif font-black text-zinc-800 tracking-tight">DearLove</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <Link to="/dashboard/plan" className="cursor-pointer hover:text-rose-500 transition-colors">
              <Wallet size={20} strokeWidth={1.5} />
            </Link>
            <Link to="/home" className="cursor-pointer hover:text-rose-500 transition-colors">
              <Home size={20} strokeWidth={1.5} />
            </Link>
            <button onClick={handleLogout} className="cursor-pointer hover:text-rose-500 transition-colors">
              <LogOut size={20} strokeWidth={1.5} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 relative flex flex-col">
          <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
            {children}
          </div>
          {/* Spacer for mobile bottom nav to prevent overlap */}
          <div className="h-[90px] shrink-0 md:hidden" aria-hidden="true" />
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] z-40 flex justify-between px-2 h-[68px] pb-safe items-center">
          <Link to="/dashboard/overview" className={`flex-1 flex flex-col items-center justify-center gap-1 ${location.pathname.includes('overview') ? 'text-rose-600' : 'text-slate-600'}`}>
            <LayoutDashboard size={24} strokeWidth={location.pathname.includes('overview') ? 2 : 1.5} />
            <span className={`text-[11px] ${location.pathname.includes('overview') ? 'font-semibold' : 'font-medium'}`}>Tổng quan</span>
          </Link>
          <Link to="/dashboard/my-cards" className={`flex-1 flex flex-col items-center justify-center gap-1 ${location.pathname.includes('my-cards') ? 'text-rose-600' : 'text-slate-600'}`}>
            <Mails size={24} strokeWidth={location.pathname.includes('my-cards') ? 2 : 1.5} />
            <span className={`text-[11px] ${location.pathname.includes('my-cards') ? 'font-semibold' : 'font-medium'}`}>Thiệp của tôi</span>
          </Link>

          {/* Center FAB */}
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <Link to={`/loading?next=${encodeURIComponent('/design')}&message=${encodeURIComponent('Đang mở trình thiết kế...')}`} className="absolute -top-7 flex flex-col items-center group cursor-pointer no-underline">
              <div className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-200 group-active:scale-95 transition-transform border-[3px] border-white ring-1 ring-slate-100">
                <span className="text-3xl font-light mb-1">+</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-700 mt-1 uppercase tracking-tight">Tạo thiệp</span>
            </Link>
          </div>

          <button onClick={() => setIsNotificationsOpen(true)} className="flex-1 flex flex-col items-center justify-center gap-1 text-slate-600 cursor-pointer">
            <div className="relative">
              <Bell size={24} strokeWidth={1.5} />
            </div>
            <span className="text-[11px] font-medium">Thông báo</span>
          </button>
          <Link to="/dashboard/account" className={`flex-1 flex flex-col items-center justify-center gap-1 ${location.pathname.includes('account') ? 'text-rose-600' : 'text-slate-600'} cursor-pointer no-underline`}>
            <User size={24} strokeWidth={location.pathname.includes('account') ? 2 : 1.5} />
            <span className={`text-[11px] ${location.pathname.includes('account') ? 'font-semibold' : 'font-medium'}`}>Cá nhân</span>
          </Link>
        </nav>

        {/* Mobile Notification Popup wrapper */}
        <div className="md:hidden">
          <NotificationPopup isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
        </div>
      </main>
    </div>
  );
};