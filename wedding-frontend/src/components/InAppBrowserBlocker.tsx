import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

export function InAppBrowserBlocker({ children }: { children: React.ReactNode }) {
  const [isInApp, setIsInApp] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Không block các trang Public (Trang chủ landing page, xem thiệp /view/, xem mẫu /templates/)
    // Chỉ kiểm tra đối với trình chỉnh sửa /editor
    if (!location.pathname.startsWith('/editor')) {
      setIsInApp(false);
      return;
    }

    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    // Kiểm tra các trình duyệt in-app phổ biến
    const inAppBrowsers = [
      'FBAN', 'FBAV', // Facebook
      'Instagram',    // Instagram
      'Zalo',         // Zalo
      'Line',         // Line
      'Viber',        // Viber
      'Twitter',      // Twitter
      'TikTok',       // TikTok
    ];

    const isMatch = inAppBrowsers.some(keyword => ua.includes(keyword));
    
    if (isMatch) {
      setIsInApp(true);
    } else {
      setIsInApp(false);
    }
  }, [location.pathname]);

  const handleOpenDefaultBrowser = () => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const currentUrl = window.location.href;
    
    const urlWithoutProtocol = currentUrl.replace(/^https?:\/\//i, '');

    if (/android/i.test(ua)) {
      // Dùng Intent scheme của Android để ép mở bằng Chrome
      const intentUrl = `intent://${urlWithoutProtocol}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(currentUrl)};end`;
      window.location.href = intentUrl;
    } else if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) {
      // iOS chặn khá gắt, nên fallback nhắc người dùng
      alert('Trên iOS, vui lòng nhấn biểu tượng [...] và chọn "Mở trong Safari".');
    } else {
      window.open(currentUrl, '_blank');
    }
  };

  if (!isInApp) {
    return <>{children}</>;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#242526',
      zIndex: 999999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        backgroundColor: '#523405',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '32px'
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <path d="M3 9h18" />
        </svg>
      </div>
      
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', marginBottom: '16px' }}>
        Mở bằng trình duyệt
      </h2>
      
      <p style={{ fontSize: '16px', color: '#E4E6EB', lineHeight: '1.6', marginBottom: '32px', maxWidth: '320px', fontWeight: '500' }}>
        Trang này không hoạt động đúng trong Zalo / Facebook. Vui lòng mở bằng Safari hoặc Chrome để tiếp tục.
      </p>

      <button
        onClick={handleOpenDefaultBrowser}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          backgroundColor: '#3DB2FF',
          color: '#ffffff',
          border: 'none',
          borderRadius: '12px',
          padding: '16px 24px',
          width: '100%',
          maxWidth: '320px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: '24px',
          boxShadow: '0 4px 12px rgba(61, 178, 255, 0.3)'
        }}
      >
        <ExternalLink size={20} />
        Mở trình duyệt mặc định
      </button>

      <div style={{
        padding: '12px',
        width: '100%',
        maxWidth: '320px',
        textAlign: 'center',
        borderTop: '1px solid #3E4042',
        paddingTop: '24px'
      }}>
        <p style={{ fontSize: '14px', color: '#B0B3B8', margin: 0, lineHeight: '1.6' }}>
          iOS: nhấn ... → "Mở trong Safari" <br/>
          Android: nhấn ⋮ → "Mở trong Chrome"
        </p>
      </div>
    </div>
  );
}
