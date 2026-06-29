// ============================================================
// LEFT TOOLBAR COMPONENT
// ============================================================

import { useRef, useState } from 'react';
import { BackgroundPanel } from './BackgroundPanel';
import { MusicPanel } from './MusicPanel';
import { EffectsPanel } from './EffectsPanel';
import '../styles/LeftToolbar.css';
import { useEditorStore } from '../store/editorStore';
import type { ToolType, UploadedImage } from '../types/editor.types';
import type { JSX } from 'react';

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

// ── Image Upload Sub-Panel ────────────────────────────────
function ImageUploadPanel({ onClose }: { onClose: () => void }) {
  const { addImageElement, addUploadedImage, removeUploadedImage, uploadedImages } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const processFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        if (!src) return;
        const uploaded: UploadedImage = {
          id: `upl-${Date.now()}-${Math.random()}`,
          src,
          name: file.name,
          thumbnailSrc: src,
        };
        addUploadedImage(uploaded);
      };
      reader.readAsDataURL(file);
    });
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
        <button className="lt-panel-close-btn" onClick={onClose} title="Đóng">
          <CloseIcon />
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
          Tối đa 1/10 • Còn lại 9
        </div>
        <button className="lt-upload-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
          Tải lên Root
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
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
                  onClick={(e) => { e.stopPropagation(); removeUploadedImage(img.id); }}
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
  { id: 'text', label: 'Văn bản', icon: TextIcon, tooltip: 'Thêm văn bản' },
  { id: 'image', label: 'Hình ảnh', icon: ImageIcon, tooltip: 'Tải ảnh lên' },
  { id: 'background', label: 'Nền', icon: BackgroundIcon, tooltip: 'Cài đặt nền' },
  { id: 'stock', label: 'Stock', icon: StockIcon, tooltip: 'Tài nguyên Stock' },
  { id: 'tools', label: 'Công cụ', icon: ToolsIcon, tooltip: 'Công cụ hình dạng' },
  { id: 'music', label: 'Nhạc nền', icon: MusicIcon, tooltip: 'Thêm nhạc' },
  { id: 'widgets', label: 'Tiện ích', icon: WidgetsIcon, tooltip: 'Tiện ích mở rộng' },
  { id: 'templates', label: 'Mẫu', icon: TemplatesIcon, tooltip: 'Bộ mẫu thiết kế' },
  { id: 'effects', label: 'Hiệu ứng', icon: EffectsIcon, tooltip: 'Hiệu ứng đặc biệt' },
  { id: 'presets', label: 'Bộ cài', icon: PresetsIcon, tooltip: 'Thiết lập sẵn' },
];

// ── Left Toolbar ───────────────────────────────────────────
export function LeftToolbar() {
  const { activeTool, setActiveTool, addTextElement, addShapeElement } = useEditorStore();
  const [showImagePanel, setShowImagePanel] = useState(false);
  const [showShapePopup, setShowShapePopup] = useState(false);
  const [showMusicPanel, setShowMusicPanel] = useState(false);
  const [showEffectsPanel, setShowEffectsPanel] = useState(false);

  const closeAllPanels = () => {
    setShowImagePanel(false);
    setShowShapePopup(false);
    setShowMusicPanel(false);
    setShowEffectsPanel(false);
  };

  const handleToolClick = (tool: ToolType) => {
    if (tool === 'image') {
      const next = activeTool === 'image' ? !showImagePanel : true;
      setActiveTool('image');
      closeAllPanels();
      setShowImagePanel(next);
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
    // Close all panels for other tools
    closeAllPanels();
    setActiveTool(tool);
    if (tool === 'text') {
      addTextElement();
    }
  };

  return (
    <div className="editor-toolbar-wrapper">
      <aside className="editor-toolbar" aria-label="Công cụ">
        <div className="toolbar-tools">
          {TOOLS.map((tool, index) => (
            <div key={tool.id ?? index}>
              {index === 5 && <div className="toolbar-divider" />}
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

      {/* Image upload slide-out panel */}
      {showImagePanel && (
        <ImageUploadPanel onClose={() => setShowImagePanel(false)} />
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

      {/* Shape Popup */}
      {showShapePopup && (
        <div className="lt-shape-popup">
          <div className="lt-shape-header">HÌNH DẠNG</div>
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
      )}
    </div>
  );
}
