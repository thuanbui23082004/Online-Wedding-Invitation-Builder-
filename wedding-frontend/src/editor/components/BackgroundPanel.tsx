import React, { useState, useRef } from 'react';
import { useEditorStore } from '../store/editorStore';
import { CustomColorPicker } from './CustomColorPicker';
import { ImageIcon } from './RightPanels/RightPanelShared';
import '../styles/BackgroundPanel.css';

const SOLID_SWATCHES = [
  'transparent', '#000000', '#4b5563', '#9ca3af', '#d1d5db', '#ffffff',
  '#ef4444', '#8b5cf6', '#3b82f6', '#10b981', '#22c55e', '#f59e0b',
  '#f87171', '#a78bfa', '#60a5fa', '#34d399', '#4ade80', '#fbbf24',
  '#fecaca', '#ddd6fe', '#bfdbfe', '#a7f3d0', '#bbf7d0', '#fde68a',
  '#fee2e2', '#ede9fe', '#6ee7b7', '#a3e635', '#fbcfe8', '#fef08a'
];

const GRADIENT_SWATCHES = [
  { from: '#ef4444', to: '#f97316' },
  { from: '#f59e0b', to: '#fde047' },
  { from: '#8b5cf6', to: '#d946ef' },
  { from: '#3b82f6', to: '#8b5cf6' },
  { from: '#10b981', to: '#3b82f6' },
  { from: '#f43f5e', to: '#fb7185' },
  { from: '#0ea5e9', to: '#38bdf8' },
  { from: '#84cc16', to: '#bef264' },
];

const TEXTURE_SWATCHES = [
  'https://www.transparenttextures.com/patterns/cubes.png',
  'https://www.transparenttextures.com/patterns/diagonal-stripes.png',
  'https://www.transparenttextures.com/patterns/fabric-of-squares.png',
  'https://www.transparenttextures.com/patterns/light-paper-fibers.png',
  'https://www.transparenttextures.com/patterns/stardust.png',
  'https://www.transparenttextures.com/patterns/white-diamond-dark.png',
];

interface BackgroundPanelProps {
  onClose: () => void;
}

export function BackgroundPanel({ onClose }: BackgroundPanelProps) {
  const { canvasBackground, updateCanvasBackground } = useEditorStore();
  const [activeTab, setActiveTab] = useState<'color' | 'image'>('color');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSolidClick = (color: string) => {
    updateCanvasBackground({ type: 'solid', color });
  };

  const handleGradientClick = (from: string, to: string) => {
    updateCanvasBackground({ type: 'gradient', gradientFrom: from, gradientTo: to, gradientAngle: 90 });
  };

  const handleTextureClick = (url: string) => {
    updateCanvasBackground({ type: 'image', imageSrc: url, imageOpacity: 1 });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      if (src) {
        updateCanvasBackground({ type: 'image', imageSrc: src, imageOpacity: 1 });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const renderPreview = () => {
    if (canvasBackground.type === 'solid') {
      const isTransparent = canvasBackground.color === 'transparent';
      return (
        <div className="bgp-preview-card">
          <div className={`bgp-preview-box ${isTransparent ? 'checkerboard' : ''}`} style={!isTransparent ? { backgroundColor: canvasBackground.color } : {}}></div>
          <div className="bgp-preview-text">
            <span>Màu đang chọn</span>
            <strong>{isTransparent ? 'Trong suốt' : canvasBackground.color}</strong>
          </div>
        </div>
      );
    } else if (canvasBackground.type === 'gradient') {
      return (
        <div className="bgp-preview-card">
          <div className="bgp-preview-box" style={{ background: `linear-gradient(${canvasBackground.gradientAngle}deg, ${canvasBackground.gradientFrom}, ${canvasBackground.gradientTo})` }}></div>
          <div className="bgp-preview-text">
            <span>Gradient đang chọn</span>
            <strong>{canvasBackground.gradientFrom} → {canvasBackground.gradientTo}</strong>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bgp-preview-card">
          {canvasBackground.imageSrc ? (
            <div className="bgp-preview-box" style={{ backgroundImage: `url(${canvasBackground.imageSrc})`, backgroundSize: 'cover' }}></div>
          ) : (
            <div className="bgp-preview-box empty"><ImageIcon /></div>
          )}
          <div className="bgp-preview-text">
            <span>Ảnh nền đã chọn</span>
            <strong>{canvasBackground.imageSrc ? 'Tùy chỉnh' : 'Chưa có'}</strong>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="editor-slide-panel bg-panel">
      <div className="bgp-header">
        <div className="bgp-main-tabs">
          <button className={`bgp-main-tab ${activeTab === 'color' ? 'active' : ''}`} onClick={() => setActiveTab('color')}>
            <span className="icon">▨</span> Màu nền
          </button>
          <button className={`bgp-main-tab ${activeTab === 'image' ? 'active' : ''}`} onClick={() => setActiveTab('image')}>
            <span className="icon">🖼</span> Hình nền
          </button>
        </div>
        <button className="panel-close-btn" onClick={onClose} title="Đóng">&times;</button>
      </div>

      <div className="bgp-scroll-content">
        <div className="bgp-preview-section">
          {renderPreview()}
        </div>

        {activeTab === 'color' && (
          <div className="bgp-color-tab">
            <div className="bgp-custom-color-row">
              <div className="bgp-section-title">
                <h4>Tùy chỉnh màu</h4>
                <p>Chọn màu nền</p>
              </div>
              <div style={{ position: 'relative' }}>
                <button
                  className="bgp-custom-color-btn"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                >
                  <div className="color-wheel-icon"></div>
                </button>
              </div>
            </div>

            <div className="bgp-swatch-section">
              <h4>Màu nền mặc định</h4>
              <div className="bgp-swatch-grid">
                {SOLID_SWATCHES.map((color, i) => (
                  <button
                    key={i}
                    className={`bgp-swatch ${color === 'transparent' ? 'checkerboard' : ''} ${canvasBackground.type === 'solid' && canvasBackground.color === color ? 'active' : ''}`}
                    style={color !== 'transparent' ? { backgroundColor: color } : {}}
                    onClick={() => handleSolidClick(color)}
                  />
                ))}
              </div>
            </div>

            <div className="bgp-swatch-section">
              <h4>Màu nền gradient</h4>
              <div className="bgp-swatch-grid gradient">
                {GRADIENT_SWATCHES.map((grad, i) => (
                  <button
                    key={i}
                    className={`bgp-swatch gradient ${canvasBackground.type === 'gradient' && canvasBackground.gradientFrom === grad.from && canvasBackground.gradientTo === grad.to ? 'active' : ''}`}
                    style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
                    onClick={() => handleGradientClick(grad.from, grad.to)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'image' && (
          <div className="bgp-image-tab">
            <button className="bgp-upload-btn" onClick={() => fileInputRef.current?.click()}>
              Chọn ảnh của tôi
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleFileChange}
            />

            <div className="bgp-texture-section">
              <h4>Hình nền có sẵn</h4>
              <div className="bgp-texture-grid">
                {TEXTURE_SWATCHES.map((url, i) => (
                  <button
                    key={i}
                    className={`bgp-texture-item ${canvasBackground.type === 'image' && canvasBackground.imageSrc === url ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${url})`, backgroundColor: '#f0f0f0' }}
                    onClick={() => handleTextureClick(url)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showColorPicker && (
        <CustomColorPicker 
          onClose={() => setShowColorPicker(false)} 
          initialType={canvasBackground.type}
          initialColor={canvasBackground.color}
          initialGradientFrom={canvasBackground.gradientFrom}
          initialGradientTo={canvasBackground.gradientTo}
          initialGradientAngle={canvasBackground.gradientAngle}
          onChange={(data) => {
            updateCanvasBackground({
              type: data.type === 'solid' || data.type === 'gradient' || data.type === 'image' ? data.type : 'solid',
              color: data.color || canvasBackground.color,
              gradientFrom: data.gradientFrom || canvasBackground.gradientFrom,
              gradientTo: data.gradientTo || canvasBackground.gradientTo,
              gradientAngle: data.gradientAngle ?? canvasBackground.gradientAngle
            });
          }}
        />
      )}
    </div>
  );
}
