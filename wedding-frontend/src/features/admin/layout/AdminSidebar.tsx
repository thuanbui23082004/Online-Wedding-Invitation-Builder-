import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, CreditCard, LayoutTemplate,
  Image, Package, ShieldCheck, LogOut, Heart, ChevronRight,
  FileText, Tag,
} from 'lucide-react';
import { RevolvingHeartsIcon } from "../../../components/icons/emojione-revolving-hearts";
import { useAuthStore } from '../../../store/authStore';
import '../styles/admin.css';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

const mainNav: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
];

const contentNav: NavItem[] = [
  { label: 'Người dùng', path: '/admin/users', icon: <Users size={18} /> },
  { label: 'Thiệp người dùng', path: '/admin/cards', icon: <FileText size={18} /> },
  { label: 'Mẫu thiệp', path: '/admin/templates', icon: <LayoutTemplate size={18} /> },
  { label: 'Thư viện Element', path: '/admin/elements', icon: <Image size={18} /> },
];

const configNav: NavItem[] = [
  { label: 'Gói dịch vụ', path: '/admin/plans', icon: <Package size={18} /> },
  { label: 'Danh mục Template', path: '/admin/categories', icon: <Tag size={18} /> },
  { label: 'Kiểm duyệt', path: '/admin/moderation', icon: <ShieldCheck size={18} />, badge: '3' },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/home');
  };

  const handleNavClick = () => {
    if (window.innerWidth <= 768 && onClose) {
      onClose();
    }
  };

  return (
    <aside className={`adm-sidebar ${isOpen ? 'open' : ''}`}>
      {/* Logo */}
      <div className="adm-sidebar-logo" style={{ textDecoration: 'none' }}>
        <div className="bg-rose-100 rounded-2xl w-10 h-10 flex items-center justify-center">
          <RevolvingHeartsIcon size={28} color="#f43f5e" />
        </div>
        <div>
          <span className="adm-sidebar-logo-text">DearLove</span>
          <span className="adm-sidebar-logo-sub">Admin Panel</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="adm-nav">
        {/* Main */}
        <div className="adm-nav-section-label">Overview</div>
        {mainNav.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) => `adm-nav-link${isActive ? ' active' : ''}`}
            onClick={handleNavClick}
          >
            <span className="adm-nav-icon">{item.icon}</span>
            {item.label}
            {item.badge && <span className="adm-nav-badge">{item.badge}</span>}
          </NavLink>
        ))}

        {/* Content */}
        <div className="adm-nav-section-label">Quản lý nội dung</div>
        {contentNav.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `adm-nav-link${isActive ? ' active' : ''}`}
            onClick={handleNavClick}
          >
            <span className="adm-nav-icon">{item.icon}</span>
            {item.label}
            {item.badge && <span className="adm-nav-badge">{item.badge}</span>}
          </NavLink>
        ))}

        {/* Config */}
        <div className="adm-nav-section-label">Cài đặt</div>
        {configNav.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `adm-nav-link${isActive ? ' active' : ''}`}
            onClick={handleNavClick}
          >
            <span className="adm-nav-icon">{item.icon}</span>
            {item.label}
            {item.badge && <span className="adm-nav-badge">{item.badge}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="adm-sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div className="adm-user-avatar" style={{ width: 36, height: 36, fontSize: 14 }}>
            {user?.fullName?.charAt(0) ?? 'A'}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--adm-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.fullName ?? 'Admin'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--adm-text-muted)' }}>Administrator</div>
          </div>
        </div>
        <button className="adm-nav-link" onClick={handleLogout} style={{ color: 'var(--adm-danger)' }}>
          <LogOut size={16} style={{ color: 'var(--adm-danger)' }} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
