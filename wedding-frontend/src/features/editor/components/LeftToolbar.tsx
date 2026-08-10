// ============================================================
// LEFT TOOLBAR COMPONENT
// ============================================================

import { useRef, useState, useEffect } from 'react';
import { BackgroundPanel } from './BackgroundPanel';
import { MusicPanel } from './MusicPanel';
import { EffectsPanel } from './EffectsPanel';
import { LibraryPanel } from './LibraryPanel';
import { WidgetsPanel } from './WidgetsPanel';
import { TemplatePanel } from './TemplatePanel';
import { MobileBottomSheet } from './MobileBottomSheet';
import { TextRightPanel } from './RightPanels/TextRightPanel';
import { ImageRightPanel } from './RightPanels/ImageRightPanel';
import { ShapeRightPanel } from './RightPanels/ShapeRightPanel';
import { ArrangeSection } from './RightPanel';
import { BeginPagePanel } from './BeginPage';
import { EffectsRightPanel } from './RightPanels/EffectsRightPanel';
import { CountdownPanel } from './RightPanels/Widgets/CountdownPanel';
import { MapRightPanel } from './RightPanels/Widgets/MapRightPanel';
import { QrGiftBoxPanel } from './RightPanels/Widgets/QrGiftBoxPanel';
import { CalendarPanel } from './RightPanels/Widgets/CalendarPanel';
import { AlbumRightPanel } from './RightPanels/Widgets/AlbumRightPanel';
import { FormRightPanel } from './RightPanels/Widgets/FormRightPanel';
import { ButtonRightPanel } from './RightPanels/Widgets/ButtonRightPanel';
import {
  TypeIcon,
  PaletteIcon,
  SettingsIcon,
  LayoutIcon,
  BorderIcon,
  ShadowIcon,
  RotateIcon,
  FlipHIcon
} from './RightPanels/RightPanelShared';
import '../styles/LeftToolbar.css';
import { useEditorStore } from '../store/editorStore';
import type { ToolType, UploadedImage } from '../types/editor.types';
import type { JSX } from 'react';
import { assetsApi } from '../../../api/assetsApi';
import { toast } from 'sonner';
import { ChevronLeft, Circle, Square, Heart, Star, Image, Pencil, Wand2 } from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import { BackgroundIcon as HugeBackgroundIcon, BounceLeftIcon, TextIcon as HugeTextIcon, LibraryIcon as HugeLibraryIcon } from '@hugeicons/core-free-icons';

// ── Mobile detection hook ─────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}


// ── SVG Icons ─────────────────────────────────────────────
const TextIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" />
  </svg>
);
const ImageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
  </svg>
);
const BackgroundIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2" /><path d="M2 12h20" /><path d="M12 2v20" />
  </svg>
);
const StockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const ToolsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
  </svg>
);
const MusicIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
  </svg>
);
const WidgetsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);
const TemplatesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
  </svg>
);
const EffectsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const PresetsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 010 14.14" /><path d="M4.93 19.07A10 10 0 014.93 4.93" /><path d="M15.54 8.46a5 5 0 010 7.07" /><path d="M8.46 15.54A5 5 0 018.46 8.46" />
  </svg>
);
const HelpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
  </svg>
);
const TrashSmIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const LibraryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
  </svg>
);
const PagesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

// ── Image Upload Sub-Panel ────────────────────────────────
function ImageUploadPanel({ onClose }: { onClose: () => void }) {
  const { addImageElement, addUploadedImage, removeUploadedImage, uploadedImages, fetchUploadedAssets } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchUploadedAssets();
  }, [fetchUploadedAssets]);

  const processFiles = async (files: FileList | null) => {
    if (!files) return;
    setIsUploading(true);
    let successCount = 0;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      try {
        const asset = await assetsApi.uploadAsset(file);
        const uploaded: UploadedImage = {
          id: asset.id,
          src: asset.url,
          name: file.name,
          thumbnailSrc: asset.thumbnailUrl || asset.url,
        };
        addUploadedImage(uploaded);
        successCount++;
      } catch (error: any) {
        console.error('Lỗi khi tải ảnh lên:', error);
        const msg = error.response?.data?.message;
        const errorText = Array.isArray(msg) ? msg[0] : (msg || error.message || `Lỗi tải lên: ${file.name}`);
        toast.error(errorText);
      }
    }
    setIsUploading(false);
    if (successCount > 0) toast.success(`Đã tải lên ${successCount} ảnh`);
  };

  const handleDelete = async (imgId: string) => {
    try {
      await assetsApi.deleteAsset(imgId);
      removeUploadedImage(imgId);
      toast.success('Xóa ảnh thành công');
    } catch (error: any) {
      console.error('Lỗi khi xóa ảnh:', error);
      const msg = error.response?.data?.message;
      const errorText = Array.isArray(msg) ? msg[0] : (msg || error.message || 'Xóa ảnh thất bại');
      toast.error(errorText);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    e.target.value = '';
  };

  return (
    <div className="lt-image-panel">
      {/* Header */}
      <div className="lt-image-panel-header">
        <span className="lt-image-panel-title">
          <ImageIcon /> Hình ảnh
        </span>
        <button className="panel-collapse-btn" onClick={onClose} title="Thu gọn">
          <ChevronLeft size={16} />
        </button>
      </div>


      {/* Upload zone */}
      <div
        className={`lt-upload-zone ${isDraggingOver ? 'dragging' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
      >
        <div className="lt-upload-icon"><UploadIcon /></div>
        <p className="lt-upload-text">Kéo thả hoặc nhấn vào đây để tải lên. Có thể tải lên nhiều lần cùng một lúc.</p>
        <div className="lt-upload-meta">
          {isUploading ? 'Đang tải lên...' : 'Hỗ trợ JPG, PNG, WEBP, GIF'}
        </div>
        <button className="lt-upload-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} disabled={isUploading}>
          {isUploading ? 'Đang xử lý...' : 'Tải lên Ảnh'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.svg"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
      </div>

      {/* Folder row */}
      <div className="lt-folder-row">
        <span className="lt-folder-label">Thư mục</span>
        <button className="lt-add-folder-btn">Thêm thư mục</button>
      </div>

      {/* Uploaded list */}
      {uploadedImages.length > 0 ? (
        <div className="lt-uploaded-section">
          <div className="lt-uploaded-header">
            <span>Ảnh đã tải lên</span>
            <span className="lt-uploaded-meta">Tổng 1 tập / {uploadedImages.length} ảnh</span>
          </div>
          <div className="lt-image-grid">
            {uploadedImages.map((img) => (
              <div
                key={img.id}
                className="lt-image-thumb-wrap"
                title={img.name}
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', img.src);
                  e.dataTransfer.setData('image-name', img.name);
                  e.dataTransfer.effectAllowed = 'copy';
                }}
              >
                <img
                  src={img.thumbnailSrc ?? img.src}
                  alt={img.name}
                  className="lt-image-thumb"
                  onClick={() => addImageElement(img.src, img.name)}
                  draggable={false}
                />
                <button
                  className="lt-image-thumb-delete"
                  title="Xóa ảnh"
                  onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }}
                >
                  <TrashSmIcon />
                </button>
              </div>
            ))}

          </div>
          <p className="lt-uploaded-hint">Đã hiển thị tất cả ảnh.</p>
        </div>
      ) : (
        <p className="lt-uploaded-hint" style={{ marginTop: 16 }}>Đã hiển thị tất cả ảnh.</p>
      )}
    </div>
  );
}

// ── Tool config ────────────────────────────────────────────
interface ToolConfig {
  id: ToolType;
  label: string;
  icon: () => JSX.Element;
  tooltip: string;
}

const TOOLS: ToolConfig[] = [
  {
    id: 'pages', label: 'Trang mở đầu', icon: PagesIcon, tooltip: 'Quản lý trang'
  },
  {
    id: 'text', label: 'Văn bản', icon: () => (
      <HugeiconsIcon
        icon={HugeTextIcon}
        size={24}
        color="currentColor"
        strokeWidth={1.5}
      />
    ), tooltip: 'Thêm văn bản'
  },
  { id: 'image', label: 'Hình ảnh', icon: ImageIcon, tooltip: 'Tải ảnh lên' },
  {
    id: 'library', label: 'Thư viện', icon: () => (
      <HugeiconsIcon
        icon={HugeLibraryIcon}
        size={24}
        color="currentColor"
        strokeWidth={1.5}
      />
    ), tooltip: 'Thư viện Element'
  },
  {
    id: 'background', label: 'Nền', icon: () => (
      <HugeiconsIcon
        icon={HugeBackgroundIcon}
        size={24}
        color="currentColor"
        strokeWidth={1.5}
      />
    ), tooltip: 'Cài đặt nền'
  },

  { id: 'tools', label: 'Công cụ', icon: ToolsIcon, tooltip: 'Công cụ hình dạng' },
  { id: 'music', label: 'Nhạc nền', icon: MusicIcon, tooltip: 'Thêm nhạc' },
  { id: 'widgets', label: 'Tiện ích', icon: WidgetsIcon, tooltip: 'Tiện ích mở rộng' },
  { id: 'templates', label: 'Mẫu', icon: TemplatesIcon, tooltip: 'Bộ mẫu thiết kế' },
  {
    id: 'effects', label: 'Hiệu ứng', icon: () => (
      <HugeiconsIcon
        icon={BounceLeftIcon}
        size={24}
        color="currentColor"
        strokeWidth={1.5}
      />
    ), tooltip: 'Hiệu ứng đặc biệt'
  },
  { id: 'presets', label: 'Bộ cài', icon: PresetsIcon, tooltip: 'Thiết lập sẵn' },
];

// ── Left Toolbar ───────────────────────────────────────────
export function LeftToolbar() {
  const { activeTool, setActiveTool, addTextElement, addShapeElement, addImageElementWithFrame, selectedElement, selectElement, activeRightTab, setActiveRightTab } = useEditorStore();
  const isMobile = useIsMobile();
  const [showImagePanel, setShowImagePanel] = useState(false);
  const [showShapePopup, setShowShapePopup] = useState(false);
  const [showMusicPanel, setShowMusicPanel] = useState(false);
  const [showEffectsPanel, setShowEffectsPanel] = useState(false);
  const [showLibraryPanel, setShowLibraryPanel] = useState(false);
  const [showWidgetsPanel, setShowWidgetsPanel] = useState(false);
  const [showTemplatesPanel, setShowTemplatesPanel] = useState(false);
  const [showPagesPanel, setShowPagesPanel] = useState(false);
  // Mobile element props bottom sheet
  const [mobilePropSheet, setMobilePropSheet] = useState<string | null>(null);

  const closeAllPanels = () => {
    setShowImagePanel(false);
    setShowShapePopup(false);
    setShowMusicPanel(false);
    setShowEffectsPanel(false);
    setShowLibraryPanel(false);
    setShowWidgetsPanel(false);
    setShowTemplatesPanel(false);
    setShowPagesPanel(false);
  };

  const handleToolClick = (tool: ToolType) => {
    if (tool === 'pages') {
      const next = activeTool === 'pages' ? !showPagesPanel : true;
      setActiveTool('pages');
      closeAllPanels();
      setShowPagesPanel(next);
      return;
    }
    if (tool === 'image') {
      const next = activeTool === 'image' ? !showImagePanel : true;
      setActiveTool('image');
      closeAllPanels();
      setShowImagePanel(next);
      return;
    }
    if (tool === 'library') {
      const next = activeTool === 'library' ? !showLibraryPanel : true;
      setActiveTool('library');
      closeAllPanels();
      setShowLibraryPanel(next);
      return;
    }
    if (tool === 'tools') {
      const next = activeTool === 'tools' ? !showShapePopup : true;
      setActiveTool('tools');
      closeAllPanels();
      setShowShapePopup(next);
      return;
    }
    if (tool === 'music') {
      const next = activeTool === 'music' ? !showMusicPanel : true;
      setActiveTool('music');
      closeAllPanels();
      setShowMusicPanel(next);
      return;
    }
    if (tool === 'effects') {
      const next = activeTool === 'effects' ? !showEffectsPanel : true;
      setActiveTool('effects');
      closeAllPanels();
      setShowEffectsPanel(next);
      return;
    }
    if (tool === 'widgets') {
      const next = activeTool === 'widgets' ? !showWidgetsPanel : true;
      setActiveTool('widgets');
      closeAllPanels();
      setShowWidgetsPanel(next);
      return;
    }
    if (tool === 'templates') {
      const next = activeTool === 'templates' ? !showTemplatesPanel : true;
      setActiveTool('templates');
      closeAllPanels();
      setShowTemplatesPanel(next);
      return;
    }
    // Close all panels for other tools
    closeAllPanels();
    setActiveTool(tool);
    if (tool === 'text') {
      addTextElement();
    }
  };

  return (
    <div className="editor-toolbar-wrapper">
      {/* On mobile: hide the tool icon bar when an element is selected (shows props bar instead) */}
      <aside className={`editor-toolbar ${isMobile && selectedElement ? 'mobile-hidden' : ''}`} aria-label="Công cụ">
        <div className="toolbar-tools">
          {TOOLS.map((tool, index) => (
            <div key={tool.id ?? index} className="toolbar-item-wrapper">
              {index === 6 && <div className="toolbar-divider" />}
              <button
                id={`tool-${tool.id}`}
                className={`toolbar-btn ${activeTool === tool.id ? 'active' : ''}`}
                onClick={() => handleToolClick(tool.id)}
                data-tooltip={tool.tooltip}
                aria-label={tool.label}
              >
                <tool.icon />
                <span className="toolbar-btn-label">{tool.label}</span>
              </button>
            </div>
          ))}
        </div>

        <div className="toolbar-footer">
          <button
            id="tool-help"
            className="toolbar-help-btn"
            title="Hỗ trợ & Hướng dẫn"
            aria-label="Hỗ trợ"
          >
            <HelpIcon />
          </button>
        </div>
      </aside>

      {/* Pages slide-out panel */}
      {showPagesPanel && (
        <BeginPagePanel onClose={() => setShowPagesPanel(false)} />
      )}

      {/* Image upload slide-out panel */}
      {showImagePanel && (
        <ImageUploadPanel onClose={() => setShowImagePanel(false)} />
      )}

      {/* Library element panel */}
      {showLibraryPanel && (
        <LibraryPanel onClose={() => { setShowLibraryPanel(false); setActiveTool(null); }} />
      )}

      {/* Music slide-out panel */}
      {showMusicPanel && (
        <MusicPanel onClose={() => setShowMusicPanel(false)} />
      )}

      {/* Background slide-out panel */}
      {activeTool === 'background' && (
        <BackgroundPanel onClose={() => { setActiveTool('text'); }} />
      )}

      {/* Effects global preset panel */}
      {showEffectsPanel && (
        <EffectsPanel onClose={() => setShowEffectsPanel(false)} />
      )}

      {/* Widgets Panel */}
      {showWidgetsPanel && (
        <WidgetsPanel onClose={() => setShowWidgetsPanel(false)} />
      )}

      {/* Templates Panel */}
      {showTemplatesPanel && (
        <TemplatePanel onClose={() => { setShowTemplatesPanel(false); setActiveTool(null); }} />
      )}

      {/* Shape Popup */}
      {showShapePopup && (
        <div className="lt-shape-popup" style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div className="lt-shape-header" style={{ marginBottom: '8px' }}>HÌNH DẠNG</div>
            <div className="lt-shape-list">
              <button className="lt-shape-item" onClick={() => { addShapeElement('line'); setShowShapePopup(false); }}>
                <div className="lt-shape-icon"><svg viewBox="0 0 24 24"><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" /></svg></div>
                <span>Đường kẻ</span>
              </button>
              <button className="lt-shape-item" onClick={() => { addShapeElement('square'); setShowShapePopup(false); }}>
                <div className="lt-shape-icon"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" fill="currentColor" /></svg></div>
                <span>Hình vuông</span>
              </button>
              <button className="lt-shape-item" onClick={() => { addShapeElement('rectangle'); setShowShapePopup(false); }}>
                <div className="lt-shape-icon"><svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" fill="currentColor" /></svg></div>
                <span>Hình chữ nhật</span>
              </button>
              <button className="lt-shape-item" onClick={() => { addShapeElement('circle'); setShowShapePopup(false); }}>
                <div className="lt-shape-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="currentColor" /></svg></div>
                <span>Hình tròn</span>
              </button>
              <button className="lt-shape-item" onClick={() => { addShapeElement('triangle'); setShowShapePopup(false); }}>
                <div className="lt-shape-icon"><svg viewBox="0 0 24 24"><polygon points="12,4 20,18 4,18" fill="currentColor" /></svg></div>
                <span>Tam giác</span>
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--ed-border)', paddingTop: '12px' }}>
            <div className="lt-shape-header" style={{ marginBottom: '8px' }}>KHUNG ẢNH</div>
            <div className="lt-shape-list">
              <button className="lt-shape-item" onClick={() => { addImageElementWithFrame('polaroid'); setShowShapePopup(false); }}>
                <div className="lt-shape-icon"><Image size={18} /></div>
                <span>Khung Polaroid</span>
              </button>
              <button className="lt-shape-item" onClick={() => { addImageElementWithFrame('arch'); setShowShapePopup(false); }}>
                <div className="lt-shape-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                    <path d="M4 20V10a8 8 0 0 1 16 0v10" />
                  </svg>
                </div>
                <span>Khung Mái vòm</span>
              </button>
              <button className="lt-shape-item" onClick={() => { addImageElementWithFrame('circle'); setShowShapePopup(false); }}>
                <div className="lt-shape-icon"><Circle size={18} /></div>
                <span>Khung Tròn</span>
              </button>
              <button className="lt-shape-item" onClick={() => { addImageElementWithFrame('classic'); setShowShapePopup(false); }}>
                <div className="lt-shape-icon"><Square size={18} strokeWidth={3} /></div>
                <span>Khung Cổ điển</span>
              </button>
              <button className="lt-shape-item" onClick={() => { addImageElementWithFrame('heart'); setShowShapePopup(false); }}>
                <div className="lt-shape-icon"><Heart size={18} /></div>
                <span>Khung Trái tim</span>
              </button>
              <button className="lt-shape-item" onClick={() => { addImageElementWithFrame('star'); setShowShapePopup(false); }}>
                <div className="lt-shape-icon"><Star size={18} /></div>
                <span>Khung Ngôi sao</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Element Props Bar (hình 2 & 3) ─────────────── */}
      {isMobile && selectedElement && (
        <>
          {/* Bottom bar showing property icons */}
          <div className="mobile-props-bar">
            <button
              className="mobile-close-btn"
              onClick={() => { selectElement(null); setMobilePropSheet(null); }}
              title="Quay lại danh sách công cụ"
              aria-label="Đóng"
            >
              <ChevronLeft size={20} />
            </button>

            {selectedElement.type === 'text' && (
              <>
                <button className={`mobile-prop-btn ${mobilePropSheet === 'style' ? 'active' : ''}`} onClick={() => setMobilePropSheet(mobilePropSheet === 'style' ? null : 'style')}>
                  <TypeIcon />
                  Kiểu chữ
                </button>
                <button className={`mobile-prop-btn ${mobilePropSheet === 'color' ? 'active' : ''}`} onClick={() => setMobilePropSheet(mobilePropSheet === 'color' ? null : 'color')}>
                  <PaletteIcon />
                  Màu sắc
                </button>
                <button className={`mobile-prop-btn ${mobilePropSheet === 'curve' ? 'active' : ''}`} onClick={() => setMobilePropSheet(mobilePropSheet === 'curve' ? null : 'curve')}>
                  <SettingsIcon />
                  Uốn cong
                </button>
                <button className={`mobile-prop-btn ${mobilePropSheet === 'spacing' ? 'active' : ''}`} onClick={() => setMobilePropSheet(mobilePropSheet === 'spacing' ? null : 'spacing')}>
                  <LayoutIcon />
                  Khoảng đệm
                </button>
                <button className={`mobile-prop-btn ${mobilePropSheet === 'border' ? 'active' : ''}`} onClick={() => setMobilePropSheet(mobilePropSheet === 'border' ? null : 'border')}>
                  <BorderIcon />
                  Đường viền
                </button>
                <button className={`mobile-prop-btn ${mobilePropSheet === 'shadow' ? 'active' : ''}`} onClick={() => setMobilePropSheet(mobilePropSheet === 'shadow' ? null : 'shadow')}>
                  <ShadowIcon />
                  Đổ bóng
                </button>
                <button className={`mobile-prop-btn ${mobilePropSheet === 'advanced' ? 'active' : ''}`} onClick={() => setMobilePropSheet(mobilePropSheet === 'advanced' ? null : 'advanced')}>
                  <SettingsIcon />
                  Nâng cao
                </button>
              </>
            )}
            {selectedElement.type === 'image' && (
              <>
                <button className={`mobile-prop-btn ${mobilePropSheet === 'image-props' ? 'active' : ''}`} onClick={() => setMobilePropSheet(mobilePropSheet === 'image-props' ? null : 'image-props')}>
                  <ImageIcon />
                  Hình ảnh
                </button>
                <button className={`mobile-prop-btn ${mobilePropSheet === 'image-ai' ? 'active' : ''}`} onClick={() => setMobilePropSheet(mobilePropSheet === 'image-ai' ? null : 'image-ai')}>
                  <Wand2 size={20} />
                  AI
                </button>
                <button className={`mobile-prop-btn ${mobilePropSheet === 'image-flip' ? 'active' : ''}`} onClick={() => setMobilePropSheet(mobilePropSheet === 'image-flip' ? null : 'image-flip')}>
                  <FlipHIcon />
                  Lật ảnh
                </button>
                <button className={`mobile-prop-btn ${mobilePropSheet === 'image-frame' ? 'active' : ''}`} onClick={() => setMobilePropSheet(mobilePropSheet === 'image-frame' ? null : 'image-frame')}>
                  <LayoutIcon />
                  Khung ảnh
                </button>
                <button className={`mobile-prop-btn ${mobilePropSheet === 'image-gallery' ? 'active' : ''}`} onClick={() => setMobilePropSheet(mobilePropSheet === 'image-gallery' ? null : 'image-gallery')}>
                  <PaletteIcon />
                  Bố cục
                </button>
                <button className={`mobile-prop-btn ${mobilePropSheet === 'image-transform' ? 'active' : ''}`} onClick={() => setMobilePropSheet(mobilePropSheet === 'image-transform' ? null : 'image-transform')}>
                  <RotateIcon />
                  Biến đổi
                </button>
                <button className={`mobile-prop-btn ${mobilePropSheet === 'image-border' ? 'active' : ''}`} onClick={() => setMobilePropSheet(mobilePropSheet === 'image-border' ? null : 'image-border')}>
                  <BorderIcon />
                  Viền
                </button>
                <button className={`mobile-prop-btn ${mobilePropSheet === 'image-shadow' ? 'active' : ''}`} onClick={() => setMobilePropSheet(mobilePropSheet === 'image-shadow' ? null : 'image-shadow')}>
                  <ShadowIcon />
                  Đổ bóng
                </button>
              </>
            )}
            {selectedElement.type === 'shape' && (
              <>
                <button className={`mobile-prop-btn ${mobilePropSheet === 'shape-props' ? 'active' : ''}`} onClick={() => setMobilePropSheet(mobilePropSheet === 'shape-props' ? null : 'shape-props')}>
                  <LayoutIcon />
                  Tùy chỉnh
                </button>
                <button className={`mobile-prop-btn ${mobilePropSheet === 'shape-border' ? 'active' : ''}`} onClick={() => setMobilePropSheet(mobilePropSheet === 'shape-border' ? null : 'shape-border')}>
                  <BorderIcon />
                  Đường viền
                </button>
                <button className={`mobile-prop-btn ${mobilePropSheet === 'shape-shadow' ? 'active' : ''}`} onClick={() => setMobilePropSheet(mobilePropSheet === 'shape-shadow' ? null : 'shape-shadow')}>
                  <ShadowIcon />
                  Đổ bóng
                </button>
              </>
            )}
            {['countdown', 'map', 'qr_code', 'calendar', 'album', 'form', 'button_contact'].includes(selectedElement.type) && (
              <>
                <button className={`mobile-prop-btn ${mobilePropSheet === 'widget-props' ? 'active' : ''}`} onClick={() => setMobilePropSheet(mobilePropSheet === 'widget-props' ? null : 'widget-props')}>
                  <SettingsIcon />
                  Tùy chỉnh
                </button>
              </>
            )}
            {/* Position / size — always visible */}
            <button className={`mobile-prop-btn ${mobilePropSheet === 'arrange' ? 'active' : ''}`} onClick={() => setMobilePropSheet(mobilePropSheet === 'arrange' ? null : 'arrange')}>
              <LayoutIcon />
              Căn chỉnh
            </button>

            {/* Animation / effects — always visible */}
            <button className={`mobile-prop-btn ${mobilePropSheet === 'element-effects' ? 'active' : ''}`} onClick={() => setMobilePropSheet(mobilePropSheet === 'element-effects' ? null : 'element-effects')}>
              <Wand2 size={20} />
              Hiệu ứng
            </button>
          </div>

          {/* Bottom sheets for Text */}
          <MobileBottomSheet
            isOpen={['style', 'color', 'curve', 'spacing', 'border', 'shadow', 'advanced'].includes(mobilePropSheet ?? '')}
            onClose={() => setMobilePropSheet(null)}
            title={{
              'style': 'Kiểu chữ',
              'color': 'Màu sắc',
              'curve': 'Uốn cong chữ',
              'spacing': 'Khoảng đệm',
              'border': 'Đường viền',
              'shadow': 'Đổ bóng',
              'advanced': 'Nâng cao'
            }[mobilePropSheet ?? ''] ?? 'Thuộc tính văn bản'}
          >
            {selectedElement.type === 'text' && selectedElement.textProps && (
              <TextRightPanel id={selectedElement.id} props={selectedElement.textProps} activeSection={mobilePropSheet} />
            )}
          </MobileBottomSheet>

          {/* Bottom sheets for Image */}
          <MobileBottomSheet
            isOpen={['image-props', 'image-ai', 'image-flip', 'image-frame', 'image-gallery', 'image-transform', 'image-border', 'image-shadow'].includes(mobilePropSheet ?? '')}
            onClose={() => setMobilePropSheet(null)}
            title={{
              'image-props': 'Hình ảnh',
              'image-ai': 'Xử lý AI',
              'image-flip': 'Lật ảnh',
              'image-frame': 'Khung ảnh',
              'image-gallery': 'Bố cục',
              'image-transform': 'Biến đổi',
              'image-border': 'Đường viền',
              'image-shadow': 'Đổ bóng'
            }[mobilePropSheet ?? ''] ?? 'Thuộc tính hình ảnh'}
          >
            {selectedElement.type === 'image' && selectedElement.imageProps && (
              <ImageRightPanel
                id={selectedElement.id}
                props={selectedElement.imageProps}
                elementWidth={selectedElement.width}
                elementHeight={selectedElement.height}
                activeSection={mobilePropSheet}
              />
            )}
          </MobileBottomSheet>

          {/* Bottom sheets for Shape */}
          <MobileBottomSheet
            isOpen={['shape-props', 'shape-border', 'shape-shadow'].includes(mobilePropSheet ?? '')}
            onClose={() => setMobilePropSheet(null)}
            title={{
              'shape-props': 'Tùy chỉnh',
              'shape-border': 'Đường viền',
              'shape-shadow': 'Đổ bóng'
            }[mobilePropSheet ?? ''] ?? 'Thuộc tính hình dạng'}
          >
            {selectedElement.type === 'shape' && (
              <ShapeRightPanel element={selectedElement} activeTab={activeRightTab} activeSection={mobilePropSheet} />
            )}
          </MobileBottomSheet>

          <MobileBottomSheet
            isOpen={mobilePropSheet === 'arrange'}
            onClose={() => setMobilePropSheet(null)}
            title="Vị trí, Lớp & Căn chỉnh"
          >
            <div style={{ padding: '0 0 24px 0' }}>
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>X (px)</label>
                    <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}>{Math.round(selectedElement.x)}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>Y (px)</label>
                    <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}>{Math.round(selectedElement.y)}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>Rộng (px)</label>
                    <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}>{Math.round(selectedElement.width)}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>Cao (px)</label>
                    <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}>{Math.round(selectedElement.height)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>Xoay (\u00b0)</label>
                  <div style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}>{Math.round(selectedElement.rotation ?? 0)}\u00b0</div>
                </div>
              </div>
              <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 12, paddingTop: 16 }}>
                <ArrangeSection element={selectedElement} />
              </div>
            </div>
          </MobileBottomSheet>

          {/* Bottom sheet for Widgets */}
          <MobileBottomSheet
            isOpen={mobilePropSheet === 'widget-props'}
            onClose={() => setMobilePropSheet(null)}
            title={(
              {
                'countdown': 'Cài đặt Đếm ngược',
                'map': 'Cài đặt Bản đồ',
                'qr_code': 'Cài đặt Quà tặng & QR',
                'calendar': 'Cài đặt Lịch cưới',
                'album': 'Cài đặt Album ảnh',
                'form': 'Cài đặt RSVP Form',
                'button_contact': 'Cài đặt Nút liên hệ'
              } as Record<string, string>
            )[selectedElement.type] ?? 'Cài đặt tiện ích'}
          >
            <div style={{ padding: '0 0 24px 0' }}>
              {selectedElement.type === 'countdown' && (
                <CountdownPanel element={selectedElement} />
              )}
              {selectedElement.type === 'map' && (
                <MapRightPanel element={selectedElement} />
              )}
              {selectedElement.type === 'qr_code' && (
                <QrGiftBoxPanel element={selectedElement} />
              )}
              {selectedElement.type === 'calendar' && (
                <CalendarPanel element={selectedElement} />
              )}
              {selectedElement.type === 'album' && selectedElement.albumProps && (
                <AlbumRightPanel id={selectedElement.id} props={selectedElement.albumProps} />
              )}
              {selectedElement.type === 'form' && (
                <FormRightPanel id={selectedElement.id} />
              )}
              {selectedElement.type === 'button_contact' && (
                <ButtonRightPanel id={selectedElement.id} />
              )}
            </div>
          </MobileBottomSheet>

          {/* Bottom sheet for Element Effects */}
          <MobileBottomSheet
            isOpen={mobilePropSheet === 'element-effects'}
            onClose={() => setMobilePropSheet(null)}
            title="Hiệu ứng động"
          >
            <div style={{ padding: '0 0 24px 0' }}>
              <EffectsRightPanel elementId={selectedElement.id} />
            </div>
          </MobileBottomSheet>
        </>
      )}
    </div>
  );
}
