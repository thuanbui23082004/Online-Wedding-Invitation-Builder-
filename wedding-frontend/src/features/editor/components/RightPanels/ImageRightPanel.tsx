// ============================================================
// IMAGE RIGHT PANEL
// Standalone panel for editing Image element properties.
// Imported by: RightPanel.tsx
// ============================================================

import { useRef } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { Expand, Paintbrush, Wand2 } from 'lucide-react';
import type { ImageProperties, BorderStyleType, PageAlignType } from '../../types/editor.types';
import {
  Section,
  Slider,
  ColorField,
  Stepper,
  ImageIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  FlipHIcon,
  FlipVIcon,
  LockIcon,
  UnlockIcon,
  ShadowIcon,
  BorderIcon,
  ScissorsIcon,
  RefreshIcon,
  EraserIcon,
  RotateIcon,
  PaddingSection,
  BorderSection,
  ShadowSection,
  PaletteIcon,
  LayoutIcon,
  SettingsIcon,
} from './RightPanelShared';
import { Circle, Square, Heart, Star, Image } from 'lucide-react';

// ── Constants ──────────────────────────────────────────────
const BORDER_STYLES: { value: BorderStyleType; label: string }[] = [
  { value: 'none', label: 'Không' },
  { value: 'solid', label: 'Liền' },
  { value: 'dashed', label: 'Nét đứt' },
  { value: 'dotted', label: 'Chấm' },
];

// ── Props ──────────────────────────────────────────────────
interface ImageRightPanelProps {
  id: string;
  props: ImageProperties;
  elementWidth: number;
  elementHeight: number;
  activeSection?: string | null;
}

// ── Component ──────────────────────────────────────────────
export function ImageRightPanel({ id, props, elementWidth, elementHeight, activeSection }: ImageRightPanelProps) {
  const {
    updateImageProp,
    updateImageProps,
    updateElementSize,
    updateElementRotation,
    selectedElement,
    pushHistory,
    setCropElementId,
    updateElementPosition,
    canvasWidth,
    setAiModalState,
  } = useEditorStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  /** Generic updater: set an image prop, optionally push undo history */
  const upd = <K extends keyof ImageProperties>(
    key: K,
    val: ImageProperties[K],
    shouldPushHistory = true
  ) => {
    updateImageProp(id, key, val);
    if (shouldPushHistory) pushHistory();
  };

  const handleApplyFrame = (frameType: string) => {
    switch (frameType) {
      case 'none':
        updateImageProps(id, {
          frameType: 'none',
          borderRadius: 0,
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          backgroundColor: 'transparent',
        });
        break;
      case 'rounded':
        updateImageProps(id, {
          frameType: 'rounded',
          borderRadius: 24,
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          backgroundColor: 'transparent',
        });
        break;
      case 'circle':
        updateImageProps(id, {
          frameType: 'circle',
          borderRadius: 999,
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          backgroundColor: 'transparent',
        });
        break;
      case 'arch':
        updateImageProps(id, {
          frameType: 'arch',
          borderRadius: 0,
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          backgroundColor: 'transparent',
        });
        break;
      case 'polaroid':
        updateImageProps(id, {
          frameType: 'polaroid',
          borderRadius: 0,
          paddingTop: 12,
          paddingRight: 12,
          paddingBottom: 48,
          paddingLeft: 12,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#e2e8f0',
          borderStyle: 'solid',
          shadowX: 0,
          shadowY: 8,
          shadowBlur: 16,
          shadowColor: 'rgba(0, 0, 0, 0.1)',
        });
        break;
      case 'classic':
        updateImageProps(id, {
          frameType: 'classic',
          borderRadius: 4,
          paddingTop: 12,
          paddingRight: 12,
          paddingBottom: 12,
          paddingLeft: 12,
          backgroundColor: '#ffffff',
          borderWidth: 2,
          borderColor: '#e0c4a8',
          borderStyle: 'solid',
          shadowX: 0,
          shadowY: 4,
          shadowBlur: 8,
          shadowColor: 'rgba(0, 0, 0, 0.08)',
        });
        break;
      case 'heart':
        updateImageProps(id, {
          frameType: 'heart',
          borderRadius: 0,
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          backgroundColor: 'transparent',
        });
        break;
      case 'star':
        updateImageProps(id, {
          frameType: 'star',
          borderRadius: 0,
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          backgroundColor: 'transparent',
        });
        break;
    }
    pushHistory();
  };

  const handleAddGalleryImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newSrcs: string[] = [];
    let processed = 0;
    
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          newSrcs.push(ev.target.result as string);
        }
        processed++;
        if (processed === files.length) {
          const currentList = props.galleryImages || [];
          updateImageProp(id, 'galleryImages', [...currentList, ...newSrcs]);
          pushHistory();
        }
      };
      reader.readAsDataURL(file);
    });
    
    e.target.value = '';
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    const currentList = props.galleryImages || [];
    const updated = currentList.filter((_, idx) => idx !== indexToRemove);
    updateImageProp(id, 'galleryImages', updated);
    pushHistory();
  };

  // ── Replace / file change ──────────────────────────────
  const handleReplaceImage = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        upd('src', ev.target.result as string);
        upd('alt', file.name, false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // ── Page alignment ─────────────────────────────────────
  const handlePageAlign = (align: PageAlignType) => {
    if (!selectedElement) return;

    let newX = selectedElement.x;

    switch (align) {
      case 'left':
        newX = 0;
        break;
      case 'center':
        newX = (canvasWidth - elementWidth) / 2;
        break;
      case 'right':
        newX = canvasWidth - elementWidth;
        break;
    }

    updateElementPosition(id, newX, selectedElement.y);
    pushHistory();
  };

  // ── Aspect-ratio locked resize ─────────────────────────
  const aspectRatio = elementHeight !== 0 ? elementWidth / elementHeight : 1;

  const handleWidthChange = (w: number) => {
    if (props.lockAspectRatio) {
      updateElementSize(id, w, Math.round(w / aspectRatio));
    } else {
      updateElementSize(id, w, elementHeight);
    }
  };

  const handleHeightChange = (h: number) => {
    if (props.lockAspectRatio) {
      updateElementSize(id, Math.round(h * aspectRatio), h);
    } else {
      updateElementSize(id, elementWidth, h);
    }
  };

  const rotation = selectedElement?.rotation ?? 0;

  return (
    <>
      {/* ── Hình ảnh – Preview & Actions ──────────────────── */}
      {(!activeSection || activeSection === 'image-props') && (
      <Section title="Hình ảnh" icon={<ImageIcon />} defaultOpen>
        {/* Thumbnail preview */}
        <div className="rp-image-preview-box">
          {props.src ? (
            <img src={props.src} alt={props.alt} className="rp-image-preview-thumb" />
          ) : (
            <div className="rp-image-preview-empty">
              <ImageIcon />
              <span>Chưa có ảnh</span>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.svg"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Action buttons */}
        <div className="rp-image-actions">
          <button className="rp-image-action-btn" onClick={handleReplaceImage} title="Đổi ảnh">
            <RefreshIcon />
            <span>Đổi ảnh</span>
          </button>
          <button className="rp-image-action-btn" title="Cắt ảnh" onClick={() => setCropElementId(id)}>
            <ScissorsIcon />
            <span>Cắt ảnh</span>
          </button>
        </div>

        <div className="rp-field" style={{ marginBlock: 25 }}>
          <span className="rp-label">Theo trang</span>
          <div className="rp-align-page-group">
            <button className="rp-align-btn" title="Căn trái" onClick={() => handlePageAlign('left')}><AlignLeftIcon /></button>
            <button className="rp-align-btn" title="Căn giữa" onClick={() => handlePageAlign('center')}><AlignCenterIcon /></button>
            <button className="rp-align-btn" title="Căn phải" onClick={() => handlePageAlign('right')}><AlignRightIcon /></button>
          </div>
        </div>
        <Slider
          label="Độ mờ"
          value={props.opacity}
          min={0} max={1} step={0.01}
          onChange={(v) => upd('opacity', v, false)}
          onCommit={pushHistory}
          displayVal={props.opacity.toFixed(2)}

        />
      </Section>
      )}

      {/* ── AI ──────────────────────── */}
      {(!activeSection || activeSection === 'image-ai') && (
      <div className="rp-ai-section-wrapper">
        <Section title="Xử lý hình ảnh AI" icon={<Wand2 size={16} />} defaultOpen>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="rp-image-action-btn rp-ai-btn" title="Xóa nền" onClick={() => setAiModalState({ type: 'remove-bg', elementId: id })}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 20 }}><EraserIcon /></span>
              <span style={{ fontSize: '11px', marginTop: 4 }}>Xóa nền</span>
            </button>
            <button className="rp-image-action-btn rp-ai-btn" title="Mở rộng" onClick={() => setAiModalState({ type: 'expand', elementId: id })}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 20 }}><Expand size={18} /></span>
              <span style={{ fontSize: '11px', marginTop: 4 }}>Mở rộng</span>
            </button>
            <button className="rp-image-action-btn rp-ai-btn" title="Xóa vật thể" onClick={() => setAiModalState({ type: 'remove-object', elementId: id })}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 20 }}><Paintbrush size={18} /></span>
              <span style={{ fontSize: '11px', marginTop: 4 }}>Xóa vật</span>
            </button>
          </div>
        </Section>
      </div>
      )}

      {/* ── Lật ảnh ──────────────────────────────────────── */}
      {(!activeSection || activeSection === 'image-flip') && (
      <Section title="Lật ảnh" icon={<FlipHIcon />} defaultOpen>
        <div className="rp-flip-group">
          <button
            id="img-flip-x"
            className={`rp-flip-btn ${props.isFlippedX ? 'active' : ''}`}
            onClick={() => upd('isFlippedX', !props.isFlippedX)}
            title="Lật ngang"
          >
            <FlipHIcon />
            <span>Ngang</span>
          </button>
          <button
            id="img-flip-y"
            className={`rp-flip-btn ${props.isFlippedY ? 'active' : ''}`}
            onClick={() => upd('isFlippedY', !props.isFlippedY)}
            title="Lật dọc"
          >
            <FlipVIcon />
            <span>Dọc</span>
          </button>
        </div>
      </Section>
      )}

      {/* ── Khung ảnh – Preset Frames ─────────────────────── */}
      {(!activeSection || activeSection === 'image-frame') && (
      <Section title="Khung ảnh & Hình dạng" icon={<LayoutIcon />} defaultOpen>
        <div className="rp-frame-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          marginBlock: '12px'
        }}>
          {[
            { id: 'none', name: 'Mặc định', icon: <Square size={18} strokeWidth={1} style={{ opacity: 0.5 }} /> },
            { id: 'rounded', name: 'Bo góc', icon: <div style={{ width: 16, height: 16, border: '2px solid currentColor', borderRadius: '4px' }} /> },
            { id: 'circle', name: 'Hình tròn', icon: <Circle size={18} /> },
            { id: 'arch', name: 'Mái vòm', icon: (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                <path d="M4 20V10a8 8 0 0 1 16 0v10" />
              </svg>
            ) },
            { id: 'polaroid', name: 'Polaroid', icon: <Image size={18} /> },
            { id: 'classic', name: 'Cổ điển', icon: <Square size={18} strokeWidth={3} /> },
            { id: 'heart', name: 'Trái tim', icon: <Heart size={18} /> },
            { id: 'star', name: 'Ngôi sao', icon: <Star size={18} /> },
          ].map((f) => (
            <button
              key={f.id}
              className={`rp-frame-btn ${props.frameType === f.id ? 'active' : ''}`}
              onClick={() => handleApplyFrame(f.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 2px',
                border: props.frameType === f.id ? '2px solid var(--ed-primary, #F95E5A)' : '1px solid var(--ed-border, #e2e8f0)',
                borderRadius: '8px',
                background: props.frameType === f.id ? 'var(--ed-primary-light, #fee2e2)' : 'transparent',
                cursor: 'pointer',
                fontSize: '11px',
                gap: '6px',
                color: 'var(--ed-text-primary, #1e293b)',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 20 }}>
                {f.icon}
              </div>
              <span>{f.name}</span>
            </button>
          ))}
        </div>
        
        {/* Only show frame background color if padding exists or polaroid/classic frame is active */}
        {((props.paddingTop > 0 || props.paddingBottom > 0 || props.frameType === 'polaroid' || props.frameType === 'classic')) && (
          <ColorField
            label="Màu nền khung"
            color={props.backgroundColor || '#ffffff'}
            onChange={(c) => upd('backgroundColor', c, false)}
            onCommit={pushHistory}
          />
        )}
      </Section>
      )}

      {(!activeSection || activeSection === 'image-gallery') && (
      <Section title="Bố cục ảnh" icon={<PaletteIcon />} defaultOpen={true}>
        {props.galleryImages === undefined ? (
          <div>
            <p style={{ fontSize: '11px', color: '#666', marginBottom: '12px', lineHeight: '1.4' }}>
              Biến hình ảnh đơn này thành một album ảnh 3D trượt động.
            </p>
            <button
              className="rp-remove-bg-btn"
              onClick={() => {
                updateImageProp(id, 'galleryImages', [props.src].filter(Boolean));
                pushHistory();
              }}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Tạo album ảnh
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {props.galleryImages.map((src, index) => (
                <div key={index} style={{ position: 'relative', aspectRatio: '1', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd' }}>
                  <img src={src} alt={`Thumb ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    onClick={() => handleRemoveGalleryImage(index)}
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))}
              
              {/* Add button */}
              <label
                htmlFor={`gallery-file-input-${id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  aspectRatio: '1',
                  borderRadius: '4px',
                  border: '1px dashed #999',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#666'
                }}
              >
                +
              </label>
              <input
                id={`gallery-file-input-${id}`}
                type="file"
                multiple
                accept="image/*,.svg"
                onChange={handleAddGalleryImage}
                style={{ display: 'none' }}
              />
            </div>
            
            {/* Display style selection */}
            <div style={{ marginTop: '4px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
              <span className="rp-label" style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>Kiểu hiển thị</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginTop: '6px', marginBottom: '8px' }}>
                {[
                  { id: '3d', name: '3D Flow' },
                  { id: 'flat', name: 'Trượt phẳng' },
                  { id: 'grid', name: 'Lưới ảnh' },
                  { id: 'collage', name: 'Collage' }
                ].map((s) => (
                  <button
                    key={s.id}
                    className={`rp-border-style-btn ${(props.sliderStyle === s.id || (!props.sliderStyle && s.id === '3d')) ? 'active' : ''}`}
                    onClick={() => {
                      updateImageProp(id, 'sliderStyle', s.id as any);
                      pushHistory();
                    }}
                    style={{
                      padding: '6px 2px',
                      fontSize: '10px',
                      borderRadius: '4px',
                      border: (props.sliderStyle === s.id || (!props.sliderStyle && s.id === '3d')) ? '1px solid var(--ed-primary, #F95E5A)' : '1px solid var(--ed-border, #e2e8f0)',
                      background: (props.sliderStyle === s.id || (!props.sliderStyle && s.id === '3d')) ? 'var(--ed-primary-light, #fee2e2)' : 'transparent',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      color: (props.sliderStyle === s.id || (!props.sliderStyle && s.id === '3d')) ? 'var(--ed-primary, #F95E5A)' : '#475569',
                    }}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="rp-remove-bg-btn"
              onClick={() => {
                updateImageProps(id, {
                  galleryImages: undefined,
                  src: props.galleryImages?.[0] || props.src
                });
                pushHistory();
              }}
              style={{ width: '100%', justifyContent: 'center', background: '#f3f4f6', color: '#1f2937', border: '1px solid #d1d5db' }}
            >
              Trở lại ảnh đơn
            </button>
          </div>
        )}
      </Section>
      )}

      {/* ── Biến đổi (W / H / Rotation / Lock) ──────────── */}
      {(!activeSection || activeSection === 'image-transform') && (
      <Section title="Biến đổi" icon={<RotateIcon />} defaultOpen>

        <div className="rp-grid-2">
          <div className="rp-grid-input-wrap">
            <span className="rp-grid-input-label">W</span>
            <input
              type="number" className="rp-grid-input"
              value={Math.round(elementWidth)}
              min={10} max={2000}
              onChange={(e) => handleWidthChange(Number(e.target.value))}
              onBlur={pushHistory}
            />
          </div>
          <div className="rp-grid-input-wrap">
            <span className="rp-grid-input-label">H</span>
            <input
              type="number" className="rp-grid-input"
              value={Math.round(elementHeight)}
              min={10} max={2000}
              onChange={(e) => handleHeightChange(Number(e.target.value))}
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
      </Section>
      )}

      {(!activeSection || activeSection === 'image-padding') && (
      <PaddingSection
        padding={{ top: props.paddingTop, right: props.paddingRight, bottom: props.paddingBottom, left: props.paddingLeft }}
        onChange={(p) => { upd('paddingTop', p.top, false); upd('paddingRight', p.right, false); upd('paddingBottom', p.bottom, false); upd('paddingLeft', p.left, false); }}
        onCommit={pushHistory}
      />
      )}
      
      {(!activeSection || activeSection === 'image-border') && (
      <BorderSection
        border={{ width: props.borderWidth, style: props.borderStyle, color: props.borderColor, radius: props.borderRadius }}
        onChange={(b) => { upd('borderWidth', b.width, false); upd('borderStyle', b.style as import('../../types/editor.types').BorderStyleType, false); upd('borderColor', b.color, false); upd('borderRadius', b.radius, false); }}
        onCommit={pushHistory}
      />
      )}
      
      {(!activeSection || activeSection === 'image-shadow') && (
      <ShadowSection
        shadow={{ x: props.shadowX, y: props.shadowY, blur: props.shadowBlur, spread: 0, color: props.shadowColor }}
        onChange={(s) => { upd('shadowX', s.x, false); upd('shadowY', s.y, false); upd('shadowBlur', s.blur, false); upd('shadowColor', s.color, false); }}
        onCommit={pushHistory}
      />
      )}

      {/* ── Nâng cao ─────────────────────────────────────── */}
      {(!activeSection || activeSection === 'image-advanced') && (
      <Section title="Nâng cao" icon={<SettingsIcon />} defaultOpen={false}>
        <div className="rp-field">
          <span className="rp-label" title={props.crop ? "Ảnh đã cắt bắt buộc dùng Fill để giữ toạ độ chuẩn" : undefined}>Fit</span>
          <select
            className="rp-select"
            value={props.crop ? 'fill' : props.objectFit}
            onChange={(e) => upd('objectFit', e.target.value as ImageProperties['objectFit'])}
            disabled={!!props.crop}
            title={props.crop ? "Ảnh đã cắt bắt buộc dùng Fill để giữ toạ độ chuẩn" : undefined}
          >
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
            <option value="fill">Fill</option>
          </select>
        </div>
        <div className="rp-field">
          <span className="rp-label">Alt text</span>
          <input
            type="text"
            className="rp-input"
            value={props.alt}
            onChange={(e) => upd('alt', e.target.value, false)}
            onBlur={pushHistory}
          />
        </div>
      </Section>
      )}
    </>
  );
}
