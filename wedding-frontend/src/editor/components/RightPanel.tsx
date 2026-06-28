// ============================================================
// RIGHT PANEL - Orchestrator (layout + routing only)
// All property panels live in ./panels/:
//   panels/TextRightPanel.tsx
//   panels/ImageRightPanel.tsx
//   panels/RightPanelShared.tsx
// ============================================================

import { useState } from 'react';
import '../styles/RightPanel.css';
import { useEditorStore } from '../store/editorStore';
import { CursorIcon } from './RightPanels/RightPanelShared';
import { TextRightPanel } from './RightPanels/TextRightPanel';
import { ImageRightPanel } from './RightPanels/ImageRightPanel';
import { ShapeRightPanel } from './RightPanels/ShapeRightPanel';


// ── Effects tab ────────────────────────────────────────────
const EFFECTS = [
  { id: 'none', name: 'Bình thường', emoji: '⬜' },
  { id: 'blur', name: 'Làm mờ', emoji: '🌫' },
  { id: 'shadow', name: 'Đổ bóng', emoji: '🌑' },
  { id: 'glow', name: 'Phát sáng', emoji: '✨' },
  { id: 'outline', name: 'Viền chữ', emoji: '🔠' },
  { id: 'neon', name: 'Neon', emoji: '💡' },
  { id: '3d', name: '3D', emoji: '🏆' },
  { id: 'retro', name: 'Cổ điển', emoji: '📷' },
];

function EffectsTab() {
  const [activeEffect, setActiveEffect] = useState('none');
  return (
    <div>
      <div className="effects-grid">
        {EFFECTS.map((ef) => (
          <div
            key={ef.id}
            id={`effect-${ef.id}`}
            className={`effect-card ${activeEffect === ef.id ? 'active' : ''}`}
            onClick={() => setActiveEffect(ef.id)}
          >
            <div className="effect-preview">{ef.emoji}</div>
            <div className="effect-name">{ef.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

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

// ── Empty state ────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="right-panel-empty">
      <CursorIcon />
      <p>Chọn một đối tượng trên canvas để chỉnh sửa thuộc tính</p>
    </div>
  );
}

// ── Main Right Panel ───────────────────────────────────────
export function RightPanel() {
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
      <div className="right-panel-tabs">
        <button
          id="tab-settings"
          className={`right-panel-tab ${activeRightTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveRightTab('settings')}
        >
          ⚙ Cài đặt
        </button>
        <button
          id="tab-effects"
          className={`right-panel-tab ${activeRightTab === 'effects' ? 'active' : ''}`}
          onClick={() => setActiveRightTab('effects')}
        >
          ✨ Hiệu ứng
        </button>
      </div>

      {/* Content */}
      <div className="right-panel-content">
        {activeRightTab === 'settings' ? renderSettingsContent() : <EffectsTab />}
      </div>
    </aside>
  );
}
