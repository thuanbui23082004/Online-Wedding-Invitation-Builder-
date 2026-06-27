// ============================================================
// LEFT TOOLBAR COMPONENT
// ============================================================

import '../styles/LeftToolbar.css';
import { useEditorStore } from '../store/editorStore';
import type { ToolType } from '../types/editor.types';
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

// ── Tool config ────────────────────────────────────────────
interface ToolConfig {
  id: ToolType;
  label: string;
  icon: () => JSX.Element;
  tooltip: string;
}

const TOOLS: ToolConfig[] = [
  { id: 'text',       label: 'Văn bản',    icon: TextIcon,       tooltip: 'Thêm văn bản' },
  { id: 'image',      label: 'Hình ảnh',   icon: ImageIcon,      tooltip: 'Tải ảnh lên' },
  { id: 'background', label: 'Nền',        icon: BackgroundIcon, tooltip: 'Cài đặt nền' },
  { id: 'stock',      label: 'Stock',      icon: StockIcon,      tooltip: 'Tài nguyên Stock' },
  { id: 'tools',      label: 'Công cụ',    icon: ToolsIcon,      tooltip: 'Công cụ hình dạng' },
  { id: 'music',      label: 'Nhạc nền',   icon: MusicIcon,      tooltip: 'Thêm nhạc' },
  { id: 'widgets',    label: 'Tiện ích',   icon: WidgetsIcon,    tooltip: 'Tiện ích mở rộng' },
  { id: 'templates',  label: 'Mẫu',        icon: TemplatesIcon,  tooltip: 'Bộ mẫu thiết kế' },
  { id: 'effects',    label: 'Hiệu ứng',   icon: EffectsIcon,    tooltip: 'Hiệu ứng đặc biệt' },
  { id: 'presets',    label: 'Bộ cài',     icon: PresetsIcon,    tooltip: 'Thiết lập sẵn' },
];

export function LeftToolbar() {
  const { activeTool, setActiveTool, addTextElement } = useEditorStore();

  const handleToolClick = (tool: ToolType) => {
    setActiveTool(tool);
    if (tool === 'text') {
      addTextElement();
    }
  };

  return (
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
  );
}
