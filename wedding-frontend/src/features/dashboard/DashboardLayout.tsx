
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CreditCard, Edit3, MessageSquare,
  CheckSquare, Gift, User, Wallet, MessageCircle, Bell, Megaphone, LayoutTemplate,
  Menu, X,
} from 'lucide-react';

export const DashboardLayout = ({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuGroups = [
    {
      title: 'Tổng quan',
      items: [
        { name: 'Tổng quan', path: '/dashboard/overview', icon: LayoutDashboard },
        { name: 'Thiệp của tôi', path: '/dashboard/my-cards', icon: CreditCard },
        { name: 'Kho mẫu thiệp', path: '/dashboard/templates', icon: LayoutTemplate },
        { name: 'Trình thiết kế', path: '/editor', icon: Edit3 },
      ]
    },
    {
      title: 'Lời chúc & Quà tặng',
      items: [
        { name: 'Lời chúc', path: '/dashboard/wishes', icon: MessageSquare },
        { name: 'Xác nhận tham dự', path: '/dashboard/rsvp', icon: CheckSquare },
        { name: 'Quà tặng', path: '/dashboard/gifts', icon: Gift },
      ]
    },
    {
      title: 'Tài khoản',
      items: [
        { name: 'Thông tin tài khoản', path: '/dashboard/account', icon: User },
        { name: 'Gói dịch vụ', path: '/dashboard/plan', icon: Wallet },
      ]
    },
    {
      title: 'Hỗ trợ',
      items: [
        { name: 'Chia sẻ góp ý', path: '/dashboard/overview', icon: MessageCircle },
      ]
    }
  ];

  const SidebarContent = () => (
    <>
      <div className="flex items-center px-6 h-16 shrink-0 justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-3 shadow-md shadow-rose-200">
            L
          </div>
          <span className="text-xl font-black tracking-tight text-slate-800">loveyou</span>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-slate-400 hover:text-slate-700"
          aria-label="Đóng menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
        {menuGroups.map((group, idx) => (
          <div key={idx}>
            <h3 className="px-3 mb-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">{group.title}</h3>
            <div className="space-y-1">
              {group.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={itemIdx}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold ${
                      isActive ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 select-none">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-100 flex-col h-full overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Sidebar - mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-slate-500 hover:text-slate-800 shrink-0"
              aria-label="Mở menu"
            >
              <Menu size={22} />
            </button>
            <div className="hidden md:flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-600 px-4 py-1.5 rounded-full text-xs font-semibold truncate">
              <Megaphone size={14} className="shrink-0" />
              <span className="truncate">Hệ thống tạo thiệp di động đang hoạt động tối ưu!</span>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button className="text-slate-400 hover:text-slate-700"><Bell size={20} /></button>
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold shadow cursor-pointer">N</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 relative">
          {(title || subtitle) && (
            <div className="mb-6">
              {title && <h1 className="text-2xl font-bold text-slate-900">{title}</h1>}
              {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
};