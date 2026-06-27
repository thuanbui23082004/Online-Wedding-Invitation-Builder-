// ============================================================
// RIGHT PANEL - Properties / Settings
// ============================================================

import { useState } from 'react';
import '../styles/RightPanel.css';
import { useEditorStore } from '../store/editorStore';
import type { TextProperties, AlignType } from '../types/editor.types';

// ── Icons ──────────────────────────────────────────────────
const BoldIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M6 4h8a4 4 0 010 8H6z"/><path d="M6 12h9a4 4 0 010 8H6z"/></svg>;
const ItalicIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>;
const UnderlineIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 3v7a6 6 0 0012 0V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>;
const StrikeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M17.3 12H6.7"/><path d="M8 7c0-1.7 1.3-3 4-3s4 1.3 4 3"/><path d="M16 17c0 1.7-1.3 3-4 3s-4-1.3-4-3"/></svg>;
const AlignLeftIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>;
const AlignCenterIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>;
const AlignRightIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>;
const AlignJustifyIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const TypeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>;
const PaletteIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.55 0 1-.45 1-1v-1.5c0-.41-.33-.75-.75-.75H12c-.83 0-1.5-.67-1.5-1.5S11.17 16 12 16c1.93 0 3.5-1.57 3.5-3.5C15.5 8.36 14.1 2 12 2z"/></svg>;
const LayoutIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>;
const SettingsIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 19.07A10 10 0 014.93 4.93"/><path d="M15.54 8.46a5 5 0 010 7.07M8.46 15.54A5 5 0 018.46 8.46"/></svg>;
const ChevronDownIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>;
const CursorIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4l7.07 17 2.51-7.39L21 11.07z" /></svg>;

// ── Collapsible Section ────────────────────────────────────
interface SectionProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}
function Section({ title, icon, defaultOpen = true, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="right-section">
      <div className="right-section-header" onClick={() => setOpen((o) => !o)}>
        <span className="right-section-title">
          {icon}
          {title}
        </span>
        <span className={`right-section-chevron ${open ? 'open' : ''}`}>
          <ChevronDownIcon />
        </span>
      </div>
      {open && <div className="right-section-body">{children}</div>}
    </div>
  );
}

// ── Slider ─────────────────────────────────────────────────
function Slider({ label, value, min = 0, max = 1, step = 0.01, onChange, onCommit, displayVal }: {
  label: string; value: number; min?: number; max?: number; step?: number;
  onChange: (v: number) => void; onCommit?: () => void; displayVal?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="rp-field">
      <span className="rp-label">{label}</span>
      <div className="rp-slider-wrap">
        <input
          type="range"
          className="rp-slider"
          min={min} max={max} step={step}
          value={value}
          style={{ '--pct': `${pct}%` } as React.CSSProperties}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseUp={onCommit}
          onTouchEnd={onCommit}
        />
        <span className="rp-slider-val">{displayVal ?? value.toFixed(2)}</span>
      </div>
    </div>
  );
}

// ── Color Swatch ───────────────────────────────────────────
function ColorField({ label, color, onChange, onCommit }: { label: string; color: string; onChange: (c: string) => void; onCommit?: () => void }) {
  const isTransparent = color === 'transparent';
  return (
    <div className="rp-color-field">
      <span className="rp-color-label">{label}</span>
      <div className="rp-color-swatch-wrap">
        <div className={`rp-color-swatch ${isTransparent ? 'rp-color-transparent' : ''}`} style={!isTransparent ? { background: color } : {}}>
          <input 
            type="color" 
            value={isTransparent ? '#ffffff' : color} 
            onChange={(e) => onChange(e.target.value)} 
            onBlur={onCommit}
          />
        </div>
        <span className="rp-color-hex">{isTransparent ? 'Trong suốt' : color.toUpperCase()}</span>
      </div>
    </div>
  );
}

// ── Stepper ────────────────────────────────────────────────
function Stepper({ value, onChange, onCommit, min = 1, max = 200 }: { value: number; onChange: (v: number) => void; onCommit?: () => void; min?: number; max?: number }) {
  return (
    <div className="rp-stepper">
      <button className="rp-stepper-btn" onClick={() => { onChange(Math.max(min, value - 1)); onCommit?.(); }}>−</button>
      <input
        type="number"
        className="rp-stepper-input"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        onBlur={onCommit}
      />
      <button className="rp-stepper-btn" onClick={() => { onChange(Math.min(max, value + 1)); onCommit?.(); }}>+</button>
    </div>
  );
}

// ── TEXT PROPERTIES PANEL ──────────────────────────────────
const FONTS = [
  'Inter', 'Playfair Display', 'Roboto', 'Open Sans', 'Lato', 'Montserrat',
  'Poppins', 'Raleway', 'Oswald', 'Merriweather', 'Georgia', 'Arial',
  'Great Vibes', 'Dancing Script', 'Pacifico',
];

function TextPanel({ id, props }: { id: string; props: TextProperties }) {
  const { updateTextProp, pushHistory } = useEditorStore();
  const upd = <K extends keyof TextProperties>(key: K, val: TextProperties[K], shouldPushHistory = true) => {
    updateTextProp(id, key, val);
    if (shouldPushHistory) {
      pushHistory();
    }
  };

  const toggleBold = () => upd('fontWeight', props.fontWeight === 'bold' ? 'normal' : 'bold');
  const toggleItalic = () => upd('fontStyle', props.fontStyle === 'italic' ? 'normal' : 'italic');
  const toggleUnderline = () => upd('textDecoration', props.textDecoration === 'underline' ? 'none' : 'underline');
  const toggleStrike = () => upd('textDecoration', props.textDecoration === 'line-through' ? 'none' : 'line-through');

  return (
    <>
      {/* Typography */}
      <Section title="Kiểu chữ" icon={<TypeIcon />} defaultOpen>
        {/* Format buttons */}
        <div className="rp-field" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 8 }}>
          <div className="rp-format-group">
            <button id="fmt-bold" className={`rp-format-btn ${props.fontWeight === 'bold' ? 'active' : ''}`} onClick={toggleBold} title="In đậm"><BoldIcon /></button>
            <button id="fmt-italic" className={`rp-format-btn ${props.fontStyle === 'italic' ? 'active' : ''}`} onClick={toggleItalic} title="In nghiêng"><ItalicIcon /></button>
            <button id="fmt-underline" className={`rp-format-btn ${props.textDecoration === 'underline' ? 'active' : ''}`} onClick={toggleUnderline} title="Gạch chân"><UnderlineIcon /></button>
            <button id="fmt-strike" className={`rp-format-btn ${props.textDecoration === 'line-through' ? 'active' : ''}`} onClick={toggleStrike} title="Gạch ngang"><StrikeIcon /></button>
          </div>
        </div>

        {/* Align */}
        <div className="rp-field">
          <span className="rp-label">Căn lề</span>
          <div className="rp-align-group" style={{ flex: 1 }}>
            {(['left', 'center', 'right', 'justify'] as AlignType[]).map((a) => (
              <button
                key={a}
                id={`align-${a}`}
                className={`rp-align-btn ${props.textAlign === a ? 'active' : ''}`}
                onClick={() => upd('textAlign', a)}
                title={a}
              >
                {a === 'left' && <AlignLeftIcon />}
                {a === 'center' && <AlignCenterIcon />}
                {a === 'right' && <AlignRightIcon />}
                {a === 'justify' && <AlignJustifyIcon />}
              </button>
            ))}
          </div>
        </div>

        {/* Font */}
        <div className="rp-field">
          <span className="rp-label">Font</span>
          <select
            id="sel-font"
            className="rp-select"
            value={props.fontFamily}
            onChange={(e) => upd('fontFamily', e.target.value)}
          >
            {FONTS.map((f) => (
              <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
            ))}
          </select>
        </div>

        {/* Size */}
        <div className="rp-field">
          <span className="rp-label">Cỡ chữ</span>
          <Stepper value={props.fontSize} onChange={(v) => upd('fontSize', v, false)} onCommit={pushHistory} min={6} max={200} />
        </div>

        {/* Letter spacing */}
        <Slider
          label="Giãn chữ"
          value={props.letterSpacing}
          min={-5}
          max={20}
          step={0.5}
          onChange={(v) => upd('letterSpacing', v, false)}
          onCommit={pushHistory}
          displayVal={`${props.letterSpacing}px`}
        />
        {/* Line height */}
        <Slider
          label="Chiều cao"
          value={props.lineHeight}
          min={0.8}
          max={3}
          step={0.05}
          onChange={(v) => upd('lineHeight', v, false)}
          onCommit={pushHistory}
          displayVal={props.lineHeight.toFixed(2)}
        />
      </Section>

      {/* Color */}
      <Section title="Màu sắc" icon={<PaletteIcon />} defaultOpen>
        <ColorField label="Màu chữ" color={props.color} onChange={(c) => upd('color', c, false)} onCommit={pushHistory} />
        <ColorField label="Màu nền" color={props.backgroundColor} onChange={(c) => upd('backgroundColor', c, false)} onCommit={pushHistory} />
        <Slider
          label="Độ mờ"
          value={props.opacity}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => upd('opacity', v, false)}
          onCommit={pushHistory}
          displayVal={props.opacity.toFixed(2)}
        />
      </Section>

      {/* Layout & Align */}
      <Section title="Bố cục & Căn chỉnh" icon={<LayoutIcon />} defaultOpen>
        <div className="rp-grid-2">
          <div className="rp-grid-input-wrap">
            <span className="rp-grid-input-label">Trên</span>
            <input type="number" className="rp-grid-input" value={props.paddingTop} onChange={(e) => upd('paddingTop', Number(e.target.value), false)} onBlur={pushHistory} />
          </div>
          <div className="rp-grid-input-wrap">
            <span className="rp-grid-input-label">Phải</span>
            <input type="number" className="rp-grid-input" value={props.paddingRight} onChange={(e) => upd('paddingRight', Number(e.target.value), false)} onBlur={pushHistory} />
          </div>
          <div className="rp-grid-input-wrap">
            <span className="rp-grid-input-label">Dưới</span>
            <input type="number" className="rp-grid-input" value={props.paddingBottom} onChange={(e) => upd('paddingBottom', Number(e.target.value), false)} onBlur={pushHistory} />
          </div>
          <div className="rp-grid-input-wrap">
            <span className="rp-grid-input-label">Trái</span>
            <input type="number" className="rp-grid-input" value={props.paddingLeft} onChange={(e) => upd('paddingLeft', Number(e.target.value), false)} onBlur={pushHistory} />
          </div>
        </div>
      </Section>

      {/* Advanced */}
      <Section title="Đường viền" icon={<SettingsIcon />} defaultOpen={false}>
        <div className="rp-field">
          <span className="rp-label">Độ dày</span>
          <Stepper value={props.borderWidth} onChange={(v) => upd('borderWidth', v, false)} onCommit={pushHistory} min={0} max={20} />
        </div>
        <ColorField label="Màu viền" color={props.borderColor} onChange={(c) => upd('borderColor', c, false)} onCommit={pushHistory} />
        <div className="rp-field">
          <span className="rp-label">Bo tròn</span>
          <Stepper value={props.borderRadius} onChange={(v) => upd('borderRadius', v, false)} onCommit={pushHistory} min={0} max={100} />
        </div>
      </Section>

      <Section title="Đổ bóng" icon={<SettingsIcon />} defaultOpen={false}>
        <div className="rp-grid-2">
          <div className="rp-grid-input-wrap">
            <span className="rp-grid-input-label">X</span>
            <input type="number" className="rp-grid-input" value={props.shadowX} onChange={(e) => upd('shadowX', Number(e.target.value), false)} onBlur={pushHistory} />
          </div>
          <div className="rp-grid-input-wrap">
            <span className="rp-grid-input-label">Y</span>
            <input type="number" className="rp-grid-input" value={props.shadowY} onChange={(e) => upd('shadowY', Number(e.target.value), false)} onBlur={pushHistory} />
          </div>
          <div className="rp-grid-input-wrap">
            <span className="rp-grid-input-label">Mờ</span>
            <input type="number" className="rp-grid-input" value={props.shadowBlur} onChange={(e) => upd('shadowBlur', Number(e.target.value), false)} onBlur={pushHistory} />
          </div>
        </div>
        <ColorField label="Màu bóng" color={props.shadowColor} onChange={(c) => upd('shadowColor', c, false)} onCommit={pushHistory} />
      </Section>

      <Section title="Nâng cao" icon={<SettingsIcon />} defaultOpen={false}>
        <div className="rp-field">
          <span className="rp-label">Nội dung</span>
          <input
            type="text"
            className="rp-input"
            value={props.content}
            onChange={(e) => upd('content', e.target.value, false)}
            onBlur={pushHistory}
          />
        </div>
      </Section>
    </>
  );
}

// ── EFFECTS TAB ────────────────────────────────────────────
const EFFECTS = [
  { id: 'none',       name: 'Bình thường', emoji: '⬜' },
  { id: 'blur',       name: 'Làm mờ',      emoji: '🌫' },
  { id: 'shadow',     name: 'Đổ bóng',     emoji: '🌑' },
  { id: 'glow',       name: 'Phát sáng',   emoji: '✨' },
  { id: 'outline',    name: 'Viền chữ',    emoji: '🔠' },
  { id: 'neon',       name: 'Neon',         emoji: '💡' },
  { id: '3d',         name: '3D',           emoji: '🏆' },
  { id: 'retro',      name: 'Cổ điển',     emoji: '📷' },
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

// ── Placeholder panels for other tools ────────────────────
function ToolPlaceholderPanel({ toolName, description, icon }: { toolName: string; description: string; icon: string }) {
  return (
    <div className="right-panel-empty">
      <div style={{ fontSize: 32 }}>{icon}</div>
      <p style={{ fontWeight: 600, color: 'var(--ed-text-primary)', fontSize: 13 }}>{toolName}</p>
      <p>{description}</p>
    </div>
  );
}

// ── MAIN RIGHT PANEL ──────────────────────────────────────
export function RightPanel() {
  const { activeRightTab, setActiveRightTab, selectedElement, activeTool } = useEditorStore();

  const renderSettingsContent = () => {
    if (!selectedElement && activeTool !== 'text') {
      // Show tool-specific empty panel
      switch (activeTool) {
        case 'image':
          return <ToolPlaceholderPanel toolName="Hình ảnh" description="Kéo thả ảnh vào canvas hoặc tải ảnh lên để chỉnh sửa thuộc tính tại đây." icon="🖼️" />;
        case 'background':
          return <ToolPlaceholderPanel toolName="Hình nền" description="Chọn màu, gradient hoặc ảnh làm nền cho canvas của bạn." icon="🎨" />;
        case 'stock':
          return <ToolPlaceholderPanel toolName="Tài nguyên Stock" description="Tìm kiếm và chèn ảnh stock chất lượng cao từ thư viện." icon="🔍" />;
        case 'music':
          return <ToolPlaceholderPanel toolName="Nhạc nền" description="Thêm nhạc nền cho thiệp cưới của bạn." icon="🎵" />;
        case 'widgets':
          return <ToolPlaceholderPanel toolName="Tiện ích" description="Chèn các tiện ích như đếm ngược, bản đồ, RSVP..." icon="🧩" />;
        case 'templates':
          return <ToolPlaceholderPanel toolName="Mẫu thiết kế" description="Chọn mẫu để bắt đầu thiết kế nhanh hơn." icon="📋" />;
        case 'effects':
          return <ToolPlaceholderPanel toolName="Hiệu ứng" description="Thêm hiệu ứng động và chuyển đổi cho thiệp." icon="✨" />;
        case 'presets':
          return <ToolPlaceholderPanel toolName="Bộ cài sẵn" description="Áp dụng các bộ cài sẵn cho toàn bộ thiết kế." icon="🎛️" />;
        default:
          return (
            <div className="right-panel-empty">
              <CursorIcon />
              <p>Chọn một đối tượng trên canvas để chỉnh sửa thuộc tính</p>
            </div>
          );
      }
    }

    if (selectedElement?.type === 'text' && selectedElement.textProps) {
      return (
        <>
          <div className="right-panel-hint">Nhấp vào văn bản để chỉnh sửa nội dung</div>
          <TextPanel id={selectedElement.id} props={selectedElement.textProps} />
        </>
      );
    }

    return (
      <div className="right-panel-empty">
        <CursorIcon />
        <p>Chọn một đối tượng trên canvas để chỉnh sửa thuộc tính</p>
      </div>
    );
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


