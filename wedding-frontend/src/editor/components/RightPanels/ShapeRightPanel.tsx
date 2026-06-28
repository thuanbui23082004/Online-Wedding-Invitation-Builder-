import { useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import type { CanvasElement, ShapeProperties, ShapeType } from '../../types/editor.types';
import {
  Section,
  Slider,
  LayoutIcon,
  SettingsIcon,
  BorderIcon,
  ShadowIcon,
} from './RightPanelShared';
import { CustomColorPicker } from '../CustomColorPicker';

export interface ShapeRightPanelProps {
  element: CanvasElement;
  activeTab: 'settings' | 'effects';
}

const LinkIcon = ({ linked, onClick }: { linked: boolean, onClick: () => void }) => (
  <svg 
    viewBox="0 0 24 24" 
    width="16" height="16" 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ cursor: 'pointer', opacity: linked ? 1 : 0.5 }}
    onClick={onClick}
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
);

export function ShapeRightPanel({ element, activeTab }: ShapeRightPanelProps) {
  const { updateShapeProp, updateShapeProps, updateElementSize } = useEditorStore();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBorderColorPicker, setShowBorderColorPicker] = useState(false);
  const [showShadowColorPicker, setShowShadowColorPicker] = useState(false);

  const sp = element.shapeProps;
  if (!sp) return null;

  const handlePropChange = <K extends keyof ShapeProperties>(key: K, value: ShapeProperties[K]) => {
    updateShapeProp(element.id, key, value);
    if (key === 'shapeType') {
      const type = value as ShapeType;
      if (type === 'line') updateElementSize(element.id, 200, 4);
      else if (type === 'square') updateElementSize(element.id, 150, 150);
      else if (type === 'rectangle') updateElementSize(element.id, 200, 120);
      else if (type === 'triangle') updateElementSize(element.id, 150, 130);
      else if (type === 'circle') updateElementSize(element.id, 150, 150);
    }
  };

  const handleBorderRadiusChange = (val: number, corner?: 'tl' | 'tr' | 'bl' | 'br') => {
    if (sp.borderRadiusLinked) {
      updateShapeProp(element.id, 'borderRadiusTopLeft', val);
      updateShapeProp(element.id, 'borderRadiusTopRight', val);
      updateShapeProp(element.id, 'borderRadiusBottomLeft', val);
      updateShapeProp(element.id, 'borderRadiusBottomRight', val);
    } else if (corner) {
      if (corner === 'tl') updateShapeProp(element.id, 'borderRadiusTopLeft', val);
      if (corner === 'tr') updateShapeProp(element.id, 'borderRadiusTopRight', val);
      if (corner === 'bl') updateShapeProp(element.id, 'borderRadiusBottomLeft', val);
      if (corner === 'br') updateShapeProp(element.id, 'borderRadiusBottomRight', val);
    }
  };

  if (activeTab === 'effects') {
    return (
      <div className="right-panel-scroll">
        <Section title="Hiệu ứng" icon={<SettingsIcon />}>
          <p className="rp-hint">Chưa có hiệu ứng đặc biệt cho hình dạng.</p>
        </Section>
      </div>
    );
  }

  return (
    <div className="right-panel-scroll">
      <Section title="Tùy chỉnh" icon={<LayoutIcon />}>
        {/* Type */}
        <div className="rp-field" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="rp-label">Loại</span>
          <select 
            className="rp-select" 
            value={sp.shapeType} 
            onChange={(e) => handlePropChange('shapeType', e.target.value as any)}
            style={{ width: 140, padding: 4, borderRadius: 4, border: '1px solid var(--ed-border)' }}
          >
            <option value="line">Đường kẻ</option>
            <option value="square">Hình vuông</option>
            <option value="rectangle">Hình chữ nhật</option>
            <option value="circle">Hình tròn</option>
            <option value="triangle">Tam giác</option>
          </select>
        </div>

        {/* Fill Color */}
        <div className="rp-field" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <span className="rp-label">Màu shape</span>
          <div 
            className="rp-color-swatch-circle"
            style={{ width: 24, height: 24, borderRadius: '50%', background: sp.fillColor, cursor: 'pointer', border: '1px solid var(--ed-border)' }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          />
          {showColorPicker && (
            <div style={{ position: 'absolute', top: 30, right: 0, zIndex: 10 }}>
              <CustomColorPicker onClose={() => setShowColorPicker(false)} 
                initialType={sp.fillType || 'solid'}
                initialColor={sp.fillColor}
                initialGradientFrom={sp.gradientFrom}
                initialGradientTo={sp.gradientTo}
                initialGradientAngle={sp.gradientAngle}
                onChange={(data) => {
                  updateShapeProps(element.id, {
                    fillType: data.type,
                    fillColor: data.color || sp.fillColor,
                    gradientFrom: data.gradientFrom || sp.gradientFrom,
                    gradientTo: data.gradientTo || sp.gradientTo,
                    gradientAngle: data.gradientAngle ?? sp.gradientAngle
                  });
                }}
                alignRight={true}
               />
            </div>
          )}
        </div>

        {/* Opacity */}
        <Slider
          label="Độ mờ"
          value={sp.opacity}
          min={0} max={1} step={0.01}
          onChange={(v) => handlePropChange('opacity', v)}
        />
      </Section>

      <Section title="Đường viền" icon={<BorderIcon />}>
        <div className="rp-field" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="rp-label">Kiểu</span>
          <select 
            className="rp-select" 
            value={sp.borderStyle} 
            onChange={(e) => handlePropChange('borderStyle', e.target.value as any)}
            style={{ width: 140, padding: 4, borderRadius: 4, border: '1px solid var(--ed-border)' }}
          >
            <option value="solid">Nét liền</option>
            <option value="dashed">Nét đứt</option>
            <option value="dotted">Nét chấm</option>
          </select>
        </div>

        <div className="rp-field" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <span className="rp-label">Vị trí</span>
          <select 
            className="rp-select" 
            value={sp.borderPosition} 
            onChange={(e) => handlePropChange('borderPosition', e.target.value as any)}
            style={{ width: 140, padding: 4, borderRadius: 4, border: '1px solid var(--ed-border)' }}
          >
            <option value="center">Toàn bộ</option>
          </select>
        </div>

        <div className="rp-field" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <span className="rp-label">Màu viền</span>
          <div 
            className="rp-color-swatch-circle"
            style={{ width: 24, height: 24, borderRadius: '50%', background: sp.borderColor, cursor: 'pointer', border: '1px solid var(--ed-border)' }}
            onClick={() => setShowBorderColorPicker(!showBorderColorPicker)}
          />
          {showBorderColorPicker && (
            <div style={{ position: 'absolute', top: 30, right: 0, zIndex: 10 }}>
              <CustomColorPicker onClose={() => setShowBorderColorPicker(false)} forceSolid={true}
                initialType="solid"
                initialColor={sp.borderColor}
                onChange={(data) => handlePropChange('borderColor', data.color)}
                alignRight={true}
              />
            </div>
          )}
        </div>

        <Slider
          label="Kích thước"
          value={sp.borderWidth}
          min={0} max={50} step={1}
          onChange={(v) => handlePropChange('borderWidth', v)}
        />

        {sp.shapeType !== 'circle' && sp.shapeType !== 'line' && (
          <div className="rp-field" style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span className="rp-label">Bo góc</span>
              <LinkIcon 
                linked={sp.borderRadiusLinked} 
                onClick={() => handlePropChange('borderRadiusLinked', !sp.borderRadiusLinked)} 
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: 8, alignItems: 'center', background: 'var(--ed-bg-hover)', padding: 12, borderRadius: 8 }}>
              {/* TL */}
              <input 
                type="number" className="rp-stepper-input" style={{ width: '100%' }} min={0}
                value={sp.borderRadiusTopLeft} onChange={(e) => handleBorderRadiusChange(Number(e.target.value), 'tl')}
              />
              <div style={{ visibility: 'hidden' }}></div>
              {/* TR */}
              <input 
                type="number" className="rp-stepper-input" style={{ width: '100%' }} min={0}
                value={sp.borderRadiusLinked ? sp.borderRadiusTopLeft : sp.borderRadiusTopRight} 
                onChange={(e) => handleBorderRadiusChange(Number(e.target.value), 'tr')}
                disabled={sp.borderRadiusLinked}
              />
              <div style={{ visibility: 'hidden' }}></div>
              {/* Center Box */}
              <div style={{ width: '100%', height: 24, border: '1px solid #ccc', borderRadius: 4 }}></div>
              <div style={{ visibility: 'hidden' }}></div>
              {/* BL */}
              <input 
                type="number" className="rp-stepper-input" style={{ width: '100%' }} min={0}
                value={sp.borderRadiusLinked ? sp.borderRadiusTopLeft : sp.borderRadiusBottomLeft} 
                onChange={(e) => handleBorderRadiusChange(Number(e.target.value), 'bl')}
                disabled={sp.borderRadiusLinked}
              />
              <div style={{ visibility: 'hidden' }}></div>
              {/* BR */}
              <input 
                type="number" className="rp-stepper-input" style={{ width: '100%' }} min={0}
                value={sp.borderRadiusLinked ? sp.borderRadiusTopLeft : sp.borderRadiusBottomRight} 
                onChange={(e) => handleBorderRadiusChange(Number(e.target.value), 'br')}
                disabled={sp.borderRadiusLinked}
              />
            </div>
          </div>
        )}
      </Section>

      <Section title="Đổ bóng" icon={<ShadowIcon />}>
        <div className="rp-field" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="rp-label" style={{ fontStyle: 'italic' }}>Đổ bóng khối:</span>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={sp.shadowEnabled}
              onChange={(e) => handlePropChange('shadowEnabled', e.target.checked)}
              style={{ display: 'none' }}
            />
            <div style={{ 
              width: 40, height: 20, borderRadius: 10, 
              background: sp.shadowEnabled ? 'var(--ed-success)' : '#ccc',
              position: 'relative', transition: 'background 0.2s'
            }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%', background: 'white',
                position: 'absolute', top: 2, left: sp.shadowEnabled ? 22 : 2,
                transition: 'left 0.2s'
              }}/>
            </div>
          </label>
        </div>

        {sp.shadowEnabled && (
          <div style={{ marginTop: 12 }}>
            <Slider label="Khoảng cách ngang (X)" value={sp.shadowX} min={-50} max={50} step={1} onChange={(v) => handlePropChange('shadowX', v)} />
            <Slider label="Khoảng cách dọc (Y)" value={sp.shadowY} min={-50} max={50} step={1} onChange={(v) => handlePropChange('shadowY', v)} />
            <Slider label="Độ mờ (Blur)" value={sp.shadowBlur} min={0} max={100} step={1} onChange={(v) => handlePropChange('shadowBlur', v)} />
            
            <div className="rp-field" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <span className="rp-label">Màu viền</span>
              <div 
                className="rp-color-swatch-circle"
                style={{ width: 24, height: 24, borderRadius: '50%', background: sp.shadowColor, cursor: 'pointer', border: '1px solid var(--ed-border)' }}
                onClick={() => setShowShadowColorPicker(!showShadowColorPicker)}
              />
              {showShadowColorPicker && (
                <div style={{ position: 'absolute', top: 30, right: 0, zIndex: 10 }}>
                  <CustomColorPicker onClose={() => setShowShadowColorPicker(false)} forceSolid={true}
                    initialType="solid"
                    initialColor={sp.shadowColor}
                    onChange={(data) => handlePropChange('shadowColor', data.color)}
                    alignRight={true}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </Section>

      <Section title="Nâng cao" icon={<SettingsIcon />} defaultOpen={false}>
        <p className="rp-hint">Chưa có cài đặt nâng cao.</p>
      </Section>
    </div>
  );
}
