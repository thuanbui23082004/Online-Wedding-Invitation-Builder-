// ============================================================
// RIGHT PANEL - Orchestrator (layout + routing only)
// All property panels live in ./panels/:
//   panels/TextRightPanel.tsx
//   panels/ImageRightPanel.tsx
//   panels/RightPanelShared.tsx
// ============================================================

import { useState, useMemo } from 'react';
import '../styles/RightPanel.css';
import 'animate.css';
import '../styles/animations.css';
import { useEditorStore } from '../store/editorStore';
import { CursorIcon, Slider, Section, LayoutIcon } from './RightPanels/RightPanelShared';
import { TextRightPanel } from './RightPanels/TextRightPanel';
import { ImageRightPanel } from './RightPanels/ImageRightPanel';
import { ShapeRightPanel } from './RightPanels/ShapeRightPanel';
import { EffectsRightPanel } from './RightPanels/EffectsRightPanel';
import { CountdownPanel } from './RightPanels/Widgets/CountdownPanel';
import { MapRightPanel } from './RightPanels/Widgets/MapRightPanel';
import { QrGiftBoxPanel } from './RightPanels/Widgets/QrGiftBoxPanel';
import { CalendarPanel } from './RightPanels/Widgets/CalendarPanel';
import { AlbumRightPanel } from './RightPanels/Widgets/AlbumRightPanel';
import { FormRightPanel } from './RightPanels/Widgets/FormRightPanel';
import { ButtonRightPanel } from './RightPanels/Widgets/ButtonRightPanel';
import {
  SlidersHorizontal,
  Wand2,
  ArrowUp,
  ArrowDown,
  ArrowUpToLine,
  ArrowDownToLine,
  AlignStartVertical,
  AlignEndVertical,
  AlignCenterVertical,
  AlignCenterHorizontal,
  AlignStartHorizontal,
  AlignEndHorizontal,
  Lock,
  Unlock,
  ChevronRight
} from 'lucide-react';
import type { CanvasElement } from '../types/editor.types';

// ── Tool placeholder ───────────────────────────────────────
function ToolPlaceholderPanel({ toolName, description, icon }: {
  toolName: string; description: string; icon: string;
}) {
  return (
    <div className="right-panel-empty">
      <div style={{ fontSize: 32 }}>{icon}</div>
      <p style={{ fontWeight: 600, color: 'var(--ed-text-primary)', fontSize: 13 }}>{toolName}</p>
      <p>{description}</p>
    </div>
  );
}

// ── Empty state (Global Settings) ────────────────────────────────────────────
function EmptyState() {
  return (
    <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 24, textAlign: 'center', color: '#94a3b8' }}>
      <div>
        <CursorIcon />
        <p style={{ fontSize: 13, marginTop: 12 }}>Chọn một đối tượng trên canvas để chỉnh sửa thuộc tính</p>
      </div>
    </div>
  );
}

// ── Global Settings Panel ──────────────────────────────────────────
function GlobalSettingsPanel() {
  const { autoScroll, autoScrollSpeed, setAutoScroll, setAutoScrollSpeed, pushHistory } = useEditorStore();

  return (
    <div style={{ padding: '24px 20px', borderTop: '1px solid var(--ed-border)' }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ed-text-primary)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Wand2 size={18} /> Cài đặt hiệu ứng chung
      </h3>

      <div className="prop-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="prop-label" style={{ margin: 0 }}>Tự động cuộn trang</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
          />
          <span className="slider round" style={{ color: '#f43f5e' }}></span>
        </label>
      </div>

      {autoScroll && (
        <div className="prop-row" style={{ marginTop: 16 }}>
          <Slider
            label="Tốc độ cuộn"
            value={autoScrollSpeed}
            min={10} max={100} step={1}
            onChange={(v) => setAutoScrollSpeed(v)}
            onCommit={pushHistory}
            displayVal={`${autoScrollSpeed}%`}
          />
        </div>
      )}
    </div>
  );
}

// ── ArrangeSection Component ───────────────────────────────────────
export function ArrangeSection({ element }: { element: CanvasElement }) {
  const [lockAspectRatio, setLockAspectRatio] = useState(false);
  const [activeTab, setActiveTab] = useState<'arrange' | 'layers'>('arrange');
  const {
    pushHistory,
    updateElementSize,
    updateElementPosition,
    updateElementRotation,
    bringElementForward,
    sendElementBackward,
    bringElementToFront,
    sendElementToBack,
    alignElementToPage,
    selectElement,
    elements
  } = useEditorStore();

  const id = element.id;
  const elementWidth = element.width;
  const elementHeight = element.height;
  const elementX = element.x;
  const elementY = element.y;
  const rotation = element.rotation ?? 0;
  const aspectRatio = elementHeight !== 0 ? elementWidth / elementHeight : 1;

  const handleWidthChange = (w: number) => {
    if (lockAspectRatio) {
      updateElementSize(id, w, Math.round(w / aspectRatio));
    } else {
      updateElementSize(id, w, elementHeight);
    }
  };

  const handleHeightChange = (h: number) => {
    if (lockAspectRatio) {
      updateElementSize(id, Math.round(h * aspectRatio), h);
    } else {
      updateElementSize(id, elementWidth, h);
    }
  };

  const allElementsSorted = useMemo(() => {
    return [...elements].sort((a, b) => b.zIndex - a.zIndex);
  }, [elements]);

  return (
    <Section title="Sắp xếp & Căn chỉnh" icon={<LayoutIcon />} defaultOpen={true}>
      <div className="rp-tabs-container mb-4" style={{ display: 'flex', borderBottom: '1px solid var(--ed-border)', paddingBottom: '8px', marginBottom: '16px' }}>
        <button 
          className={`rp-tab-btn ${activeTab === 'arrange' ? 'active' : ''}`}
          onClick={() => setActiveTab('arrange')}
          style={{ 
            flex: 1, 
            padding: '6px 12px', 
            background: 'none', 
            border: 'none', 
            fontWeight: 600, 
            fontSize: '13px',
            color: activeTab === 'arrange' ? 'var(--ed-accent, #f43f5e)' : 'var(--ed-text-muted)',
            borderBottom: activeTab === 'arrange' ? '2px solid var(--ed-accent, #f43f5e)' : 'none',
            cursor: 'pointer'
          }}
        >
          Sắp xếp
        </button>
        <button 
          className={`rp-tab-btn ${activeTab === 'layers' ? 'active' : ''}`}
          onClick={() => setActiveTab('layers')}
          style={{ 
            flex: 1, 
            padding: '6px 12px', 
            background: 'none', 
            border: 'none', 
            fontWeight: 600, 
            fontSize: '13px',
            color: activeTab === 'layers' ? 'var(--ed-accent, #f43f5e)' : 'var(--ed-text-muted)',
            borderBottom: activeTab === 'layers' ? '2px solid var(--ed-accent, #f43f5e)' : 'none',
            cursor: 'pointer'
          }}
        >
          Lớp
        </button>
      </div>

      {activeTab === 'arrange' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="rp-grid-2">
            <button 
              className="flex items-center justify-center gap-1.5 py-2 px-3 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-700 bg-white hover:bg-zinc-50 active:scale-95 transition-all cursor-pointer"
              onClick={() => bringElementForward(id)}
              title="Đưa lên một lớp"
            >
              <ArrowUp size={14} /> Lên 1 lớp
            </button>
            <button 
              className="flex items-center justify-center gap-1.5 py-2 px-3 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-700 bg-white hover:bg-zinc-50 active:scale-95 transition-all cursor-pointer"
              onClick={() => sendElementBackward(id)}
              title="Hạ xuống một lớp"
            >
              <ArrowDown size={14} /> Xuống 1 lớp
            </button>
            <button 
              className="flex items-center justify-center gap-1.5 py-2 px-3 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-700 bg-white hover:bg-zinc-50 active:scale-95 transition-all cursor-pointer"
              onClick={() => bringElementToFront(id)}
              title="Đưa lên trên cùng"
            >
              <ArrowUpToLine size={14} /> Trên cùng
            </button>
            <button 
              className="flex items-center justify-center gap-1.5 py-2 px-3 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-700 bg-white hover:bg-zinc-50 active:scale-95 transition-all cursor-pointer"
              onClick={() => sendElementToBack(id)}
              title="Hạ xuống dưới cùng"
            >
              <ArrowDownToLine size={14} /> Dưới cùng
            </button>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--ed-text-muted)', marginBottom: '8px', letterSpacing: '0.5px' }}>
              Căn chỉnh trang
            </div>
            <div className="rp-grid-2">
              <button 
                className="flex items-center justify-center gap-1.5 py-2 px-3 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-700 bg-white hover:bg-zinc-50 active:scale-95 transition-all cursor-pointer"
                onClick={() => alignElementToPage(id, 'top')}
              >
                <AlignStartVertical size={14} /> Căn trên
              </button>
              <button 
                className="flex items-center justify-center gap-1.5 py-2 px-3 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-700 bg-white hover:bg-zinc-50 active:scale-95 transition-all cursor-pointer"
                onClick={() => alignElementToPage(id, 'left')}
              >
                <AlignStartHorizontal size={14} /> Căn trái
              </button>
              <button 
                className="flex items-center justify-center gap-1.5 py-2 px-3 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-700 bg-white hover:bg-zinc-50 active:scale-95 transition-all cursor-pointer"
                onClick={() => alignElementToPage(id, 'center')}
              >
                <AlignCenterVertical size={14} /> Giữa dọc
              </button>
              <button 
                className="flex items-center justify-center gap-1.5 py-2 px-3 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-700 bg-white hover:bg-zinc-50 active:scale-95 transition-all cursor-pointer"
                onClick={() => alignElementToPage(id, 'middle')}
              >
                <AlignCenterHorizontal size={14} /> Giữa ngang
              </button>
              <button 
                className="flex items-center justify-center gap-1.5 py-2 px-3 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-700 bg-white hover:bg-zinc-50 active:scale-95 transition-all cursor-pointer"
                onClick={() => alignElementToPage(id, 'bottom')}
              >
                <AlignEndVertical size={14} /> Căn dưới
              </button>
              <button 
                className="flex items-center justify-center gap-1.5 py-2 px-3 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-700 bg-white hover:bg-zinc-50 active:scale-95 transition-all cursor-pointer"
                onClick={() => alignElementToPage(id, 'right')}
              >
                <AlignEndHorizontal size={14} /> Căn phải
              </button>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--ed-text-muted)', marginBottom: '8px', letterSpacing: '0.5px' }}>
              Biến đổi
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-zinc-500 font-medium">Khóa tỉ lệ</span>
              <button
                className={`rp-lock-btn ${lockAspectRatio ? 'active' : ''}`}
                onClick={() => setLockAspectRatio(!lockAspectRatio)}
                title={lockAspectRatio ? 'Mở khóa tỉ lệ' : 'Khóa tỉ lệ'}
                style={{
                  padding: '4px 8px',
                  border: '1px solid var(--ed-border)',
                  borderRadius: '6px',
                  background: lockAspectRatio ? 'var(--ed-bg-active, #fff1f2)' : '#ffffff',
                  color: lockAspectRatio ? 'var(--ed-accent, #f43f5e)' : 'var(--ed-text-muted)',
                  cursor: 'pointer'
                }}
              >
                {lockAspectRatio ? <Lock size={14} /> : <Unlock size={14} />}
              </button>
            </div>
            <div className="rp-grid-2">
              <div className="rp-grid-input-wrap">
                <span className="rp-grid-input-label">W</span>
                <input
                  type="number" className="rp-grid-input"
                  value={Math.round(elementWidth)}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  onBlur={pushHistory}
                />
              </div>
              <div className="rp-grid-input-wrap">
                <span className="rp-grid-input-label">H</span>
                <input
                  type="number" className="rp-grid-input"
                  value={Math.round(elementHeight)}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  onBlur={pushHistory}
                />
              </div>
              <div className="rp-grid-input-wrap">
                <span className="rp-grid-input-label">X</span>
                <input
                  type="number" className="rp-grid-input"
                  value={Math.round(elementX)}
                  onChange={(e) => {
                    updateElementPosition(id, Number(e.target.value), elementY);
                  }}
                  onBlur={pushHistory}
                />
              </div>
              <div className="rp-grid-input-wrap">
                <span className="rp-grid-input-label">Y</span>
                <input
                  type="number" className="rp-grid-input"
                  value={Math.round(elementY)}
                  onChange={(e) => {
                    updateElementPosition(id, elementX, Number(e.target.value));
                  }}
                  onBlur={pushHistory}
                />
              </div>
            </div>
            <Slider
              label="Xoay"
              value={rotation}
              min={0} max={360} step={1}
              onChange={(v) => updateElementRotation(id, v)}
              onCommit={pushHistory}
              displayVal={`${Math.round(rotation)}°`}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
          {allElementsSorted.map((el) => {
            const isSelected = el.id === id;
            return (
              <div 
                key={el.id}
                onClick={() => selectElement(el.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: isSelected ? 'var(--ed-bg-hover, #f3f4f6)' : '#ffffff',
                  border: isSelected ? '1px solid var(--ed-accent, #f43f5e)' : '1px solid var(--ed-border, #e2e8f0)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                className="hover:bg-zinc-50"
              >
                <span style={{ fontSize: '12px', fontWeight: isSelected ? 700 : 500, color: 'var(--ed-text-primary)' }}>
                  {el.type === 'text' ? `📝 ${el.textProps?.content?.substring(0, 15) || 'Văn bản'}` : el.type === 'image' ? '🖼️ Hình ảnh' : '⬟ Hình khối'}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--ed-text-muted)', fontWeight: 600 }}>
                  Z: {el.zIndex}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}

// ── Main Right Panel ───────────────────────────────────────
export function RightPanel({ onCollapse }: { onCollapse?: () => void }) {
  const { activeRightTab, setActiveRightTab, selectedElement, activeTool } = useEditorStore();

  const renderSettingsContent = () => {
    // ── Image element selected → ImageRightPanel ──────────
    if (selectedElement?.type === 'text' && selectedElement.textProps) {
      return (
        <>
          <div className="right-panel-hint">Nhấp vào văn bản để chỉnh sửa nội dung</div>
          <TextRightPanel id={selectedElement.id} props={selectedElement.textProps} />
        </>
      );
    }

    if (selectedElement?.type === 'image' && selectedElement.imageProps) {
      return (
        <ImageRightPanel
          id={selectedElement.id}
          props={selectedElement.imageProps}
          elementWidth={selectedElement.width}
          elementHeight={selectedElement.height}
        />
      );
    }

    if (selectedElement?.type === 'shape') {
      return <ShapeRightPanel element={selectedElement} activeTab={activeRightTab} />;
    }

    if (selectedElement?.type === 'countdown') {
      return <CountdownPanel element={selectedElement} />;
    }

    if (selectedElement?.type === 'map') {
      return <MapRightPanel element={selectedElement} />;
    }

    if (selectedElement?.type === 'qr_code') {
      return <QrGiftBoxPanel element={selectedElement} />;
    }

    if (selectedElement?.type === 'calendar') {
      return <CalendarPanel element={selectedElement} />;
    }

    if (selectedElement?.type === 'album' && selectedElement.albumProps) {
      return <AlbumRightPanel id={selectedElement.id} props={selectedElement.albumProps} />;
    }

    if (selectedElement?.type === 'form') {
      return <FormRightPanel id={selectedElement.id} />;
    }

    if (selectedElement?.type === 'button_contact') {
      return <ButtonRightPanel id={selectedElement.id} />;
    }

    // ── Nothing selected: show tool-specific guidance ─────
    if (!selectedElement) {
      switch (activeTool) {
        case 'image': return <ToolPlaceholderPanel toolName="Hình ảnh" description="Kéo thả ảnh vào canvas hoặc tải ảnh lên để chỉnh sửa thuộc tính tại đây." icon="🖼️" />;
        case 'background': return <ToolPlaceholderPanel toolName="Hình nền" description="Chọn màu, gradient hoặc ảnh làm nền cho canvas của bạn." icon="🎨" />;
        case 'stock': return <ToolPlaceholderPanel toolName="Tài nguyên Stock" description="Tìm kiếm và chèn ảnh stock chất lượng cao từ thư viện." icon="🔍" />;
        case 'music': return <ToolPlaceholderPanel toolName="Nhạc nền" description="Thêm nhạc nền cho thiệp cưới của bạn." icon="🎵" />;
        case 'widgets': return <ToolPlaceholderPanel toolName="Tiện ích" description="Chèn các tiện ích như đếm ngược, bản đồ, RSVP..." icon="🧩" />;
        case 'templates': return <ToolPlaceholderPanel toolName="Mẫu thiết kế" description="Chọn mẫu để bắt đầu thiết kế nhanh hơn." icon="📋" />;
        case 'effects': return <ToolPlaceholderPanel toolName="Hiệu ứng" description="Thêm hiệu ứng động và chuyển đổi cho thiệp." icon="✨" />;
        case 'presets': return <ToolPlaceholderPanel toolName="Bộ cài sẵn" description="Áp dụng các bộ cài sẵn cho toàn bộ thiết kế." icon="🎛️" />;
        default: return <EmptyState />;
      }
    }

    return <EmptyState />;
  };

  return (
    <aside className="editor-right-panel" aria-label="Thuộc tính">
      {/* Tabs */}
      <div className="right-panel-tabs" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flex: 1 }}>
          <button
            id="tab-settings"
            className={`right-panel-tab ${activeRightTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveRightTab('settings')}
          >
            <SlidersHorizontal size={16} /> Cài đặt
          </button>
          <button
            id="tab-effects"
            className={`right-panel-tab ${activeRightTab === 'effects' ? 'active' : ''}`}
            onClick={() => setActiveRightTab('effects')}
          >
            <Wand2 size={16} /> Hiệu ứng
          </button>
        </div>
        
        {onCollapse && (
          <button
            className="right-panel-collapse-btn"
            onClick={onCollapse}
            title="Thu gọn bảng"
            style={{
              background: 'none',
              border: 'none',
              padding: '0 12px',
              height: '100%',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'stretch',
            }}
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="right-panel-content">
        {activeRightTab === 'settings' ? (
          <>
            {renderSettingsContent()}
            {selectedElement && <ArrangeSection element={selectedElement} />}
          </>
        ) : selectedElement ? (
          <EffectsRightPanel elementId={selectedElement.id} />
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Always visible Global Settings at bottom (only in effects tab) */}
      {activeRightTab === 'effects' && <GlobalSettingsPanel />}
    </aside>
  );
}
