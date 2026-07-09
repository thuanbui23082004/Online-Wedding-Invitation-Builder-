// ============================================================
// EDITOR PAGE - Main editor layout assembler
// ============================================================

import styles from '../styles/editor.module.css';
import { Header } from '../components/Header';
import { LeftToolbar } from '../components/LeftToolbar';
import { MainCanvas } from '../components/Canvas';
import { RightPanel } from '../components/RightPanel';
import { Filmstrip } from '../components/Filmstrip';
import { ImageCropModal } from '../components/ImageCropModal';
import { AIRemoveBgModal } from '../components/AIModals/AIRemoveBgModal';
import { AIExpandModal } from '../components/AIModals/AIExpandModal';
import { AIRemoveObjectModal } from '../components/AIModals/AIRemoveObjectModal';
import LoadingPage from '../../../pages/Loading/Loadingpage';
import { SlidersHorizontal, ChevronUp, ChevronDown } from 'lucide-react';

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useEditorStore } from '../store/editorStore';
import { useAuthStore } from '../../../store/authStore';
import { assetsApi } from '../../../api/assetsApi';
import type { Asset } from '../../../api/assetsApi';

const AUTO_SAVE_INTERVAL_MS = 30_000; // 30 seconds

export function EditorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isInitialized } = useAuthStore();
  const {
    selectedElement,
    deleteElement,
    duplicateElement,
    saveCanvasNow,
    loadCardData,
    loadTemplateData,
    saveTemplateNow,
    cardId,
    templateId,
    editorMode,
    isLoadingEditor,
  } = useEditorStore();

  const [searchParams] = useSearchParams();
  const cardIdParam = searchParams.get('id');
  const templateIdParam = searchParams.get('templateId');

  // Ngăn chặn giật (flicker) bằng cách kiểm tra xem dữ liệu trong store đã khớp với URL chưa
  const isDataMismatch = 
    (cardIdParam && cardIdParam !== cardId) || 
    (templateIdParam && templateIdParam !== templateId);
  const showLoading = isLoadingEditor || isDataMismatch;
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isFilmstripOpen, setIsFilmstripOpen] = useState(true);

  // ── Load dữ liệu từ URL params ───────────────────────────
  useEffect(() => {
    if (isInitialized) {
      if (!user) {
        navigate('/login', { replace: true });
        return;
      } else if (user.role === 'admin' && !location.pathname.includes('/design/template')) {
        navigate('/login', { replace: true });
        return;
      }

      if (templateIdParam) {
        // Chế độ thiết kế template (admin)
        if (templateId !== templateIdParam) {
          loadTemplateData(templateIdParam);
        }
      } else if (cardIdParam) {
        // Chế độ thiết kế card (user)
        if (cardId !== cardIdParam) {
          loadCardData(cardIdParam);
        }
      }
    }
  }, [isInitialized, user, searchParams, cardId, templateId, loadTemplateData, loadCardData, cardIdParam, templateIdParam]);

  // ── Auto-save mỗi 30s ────────────────────────────────────
  useEffect(() => {
    if (editorMode === 'template') {
      if (!templateId) return;
      const timer = setInterval(() => saveTemplateNow(), AUTO_SAVE_INTERVAL_MS);
      return () => clearInterval(timer);
    } else {
      const timer = setInterval(() => saveCanvasNow(), AUTO_SAVE_INTERVAL_MS);
      return () => clearInterval(timer);
    }
  }, [cardId, templateId, editorMode, saveTemplateNow, saveCanvasNow]);

  // ── Keyboard shortcuts ────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (!selectedElement) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteElement(selectedElement.id);
      }

      // Allow Ctrl+C or Ctrl+D (or Cmd) to duplicate
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'c' || e.key.toLowerCase() === 'd')) {
        e.preventDefault();
        duplicateElement(selectedElement.id);
      }

      // Ctrl+S → save ngay lập tức
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (editorMode === 'template') {
          saveTemplateNow();
        } else {
          saveCanvasNow();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, deleteElement, duplicateElement, saveCanvasNow, saveTemplateNow, editorMode]);

  // ── Inject Custom Fonts ────────────────────────────────────
  const [fontsData, setFontsData] = useState<{ systemFonts: Asset[], myFonts: Asset[] }>({ systemFonts: [], myFonts: [] });

  useEffect(() => {
    if (isInitialized && user) {
      assetsApi.getFonts().then(data => setFontsData(data)).catch(err => console.error("Failed to load fonts", err));
    }
  }, [isInitialized, user]);

  useEffect(() => {
    let styleEl = document.getElementById('custom-fonts');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'custom-fonts';
      document.head.appendChild(styleEl);
    }

    let css = '';
    const allFonts = [...fontsData.systemFonts, ...fontsData.myFonts];
    allFonts.forEach(font => {
      // thumbnailUrl lưu tên phông chữ gốc
      if (font.thumbnailUrl) {
        css += `
          @font-face {
            font-family: "${font.thumbnailUrl}";
            src: url("${font.url}");
            font-display: swap;
          }
        `;
      }
    });
    styleEl.innerHTML = css;
  }, [fontsData]);

  return (
    <div className={styles['editor-root']}>
      {/* ── Header ──────────────────────── */}
      <Header />

      {/* ── Main Body ───────────────────── */}
      <div className={styles['editor-body']}>
        {showLoading ? (
          <div style={{ flex: 1 }}>
            <LoadingPage message="Đang tải dữ liệu..." />
          </div>
        ) : (
          <>
            {/* Left Toolbar */}
            <LeftToolbar />

            {/* Center: Canvas + Filmstrip */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', position: 'relative' }}>
              <MainCanvas />
              
              {/* Toggle pages button */}
              <div style={{
                position: 'absolute',
                bottom: isFilmstripOpen ? '90px' : '16px',
                left: '24px',
                zIndex: 100,
                display: 'flex',
                gap: '8px'
              }}>
                <button
                  onClick={() => setIsFilmstripOpen(!isFilmstripOpen)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#64748b',
                  }}
                  title={isFilmstripOpen ? "Ẩn danh sách trang" : "Hiển thị danh sách trang"}
                >
                  {isFilmstripOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                  <span>{isFilmstripOpen ? "Ẩn trang" : "Hiện trang"}</span>
                </button>
              </div>

              {isFilmstripOpen && <Filmstrip />}

              {/* Floating button to open Right Panel when closed (desktop only) */}
              {!isRightPanelOpen && (
                <button
                  className="editor-expand-right-btn"
                  onClick={() => setIsRightPanelOpen(true)}
                  title="Mở cài đặt thuộc tính"
                >
                  <SlidersHorizontal size={16} />
                </button>
              )}
            </div>

            {/* Right Properties Panel */}
            {isRightPanelOpen && (
              <RightPanel onCollapse={() => setIsRightPanelOpen(false)} />
            )}
          </>
        )}
      </div>

      {/* ── Modals ───────────────────────── */}
      <ImageCropModal />
      <AIRemoveBgModal />
      <AIExpandModal />
      <AIRemoveObjectModal />
    </div>
  );
}
