import { Outlet, Navigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { useAuthStore } from '../../../store/authStore';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import '../styles/admin.css';

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  '/admin': { title: 'Dashboard', subtitle: 'Tổng quan hệ thống' },
  '/admin/users': { title: 'Quản lý Người dùng', subtitle: 'Danh sách & quản lý tài khoản' },
  '/admin/cards': { title: 'Thiệp người dùng', subtitle: 'Xem & kiểm soát thiệp do user tạo' },
  '/admin/templates': { title: 'Mẫu thiệp', subtitle: 'Quản lý thư viện template' },
  '/admin/elements': { title: 'Thư viện Element', subtitle: 'Icon, sticker, frame, ảnh stock' },
  '/admin/plans': { title: 'Gói dịch vụ', subtitle: 'Cấu hình các gói Free / Premium / Pro' },
  '/admin/categories': { title: 'Danh mục Template', subtitle: 'Quản lý cây danh mục' },
  '/admin/moderation': { title: 'Kiểm duyệt nội dung', subtitle: 'Duyệt lời chúc & báo cáo vi phạm' },
};

export function AdminLayout() {
  const { user, isLoading, isInitialized } = useAuthStore();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Wait until auth is initialized
  if (!isInitialized || isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8fafc' }}>
        <div className="adm-spinner" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  // Guard: must be authenticated AND admin
  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== 'admin') return <Navigate to="/home" replace />;

  const meta = PAGE_META[location.pathname] ?? { title: 'Admin', subtitle: '' };

  return (
    <div className="adm-root">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {/* Overlay for mobile */}
      <div 
        className={`adm-overlay ${isSidebarOpen ? 'open' : ''}`} 
        onClick={() => setIsSidebarOpen(false)} 
      />
      <div className="adm-main">
        <AdminHeader 
          title={meta.title} 
          subtitle={meta.subtitle} 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <main className="adm-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
