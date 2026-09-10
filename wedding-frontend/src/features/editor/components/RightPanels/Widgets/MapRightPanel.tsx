import React, { useState } from 'react';
import { useEditorStore } from '../../../store/editorStore';
import type { CanvasElement, MapContent } from '../../../types/editor.types';
import { Section, Slider, AlignLeftIcon, AlignCenterIcon, AlignRightIcon, LayoutIcon, PaddingSection, BorderSection, ShadowSection } from '../RightPanelShared';
import { CustomColorPicker } from '../../CustomColorPicker';
import { MapPickerModal } from '../../Widgets/MapPickerModal';

export interface MapRightPanelProps {
  element: CanvasElement;
}

// Parse Google Maps URL and extract lat, lng, address
function parseGoogleMapsUrl(url: string): { lat: number; lng: number; address: string } | null {
  try {
    // Format: @lat,lng or @lat,lng,zoom
    const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
      return { lat: Number(atMatch[1]), lng: Number(atMatch[2]), address: '' };
    }

    // Format: !3dLAT!4dLNG (Place detail URL)
    const bangMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (bangMatch) {
      return { lat: Number(bangMatch[1]), lng: Number(bangMatch[2]), address: '' };
    }

    // Format: ?q=lat,lng
    const qLatLng = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qLatLng) {
      return { lat: Number(qLatLng[1]), lng: Number(qLatLng[2]), address: '' };
    }

    // Format: ?q=address+text (no coordinates, just a query)
    const qAddr = url.match(/[?&]q=([^&]+)/);
    if (qAddr) {
      const decoded = decodeURIComponent(qAddr[1].replace(/\+/g, ' '));
      return { lat: 0, lng: 0, address: decoded };
    }

    // Format: /place/NAME+ADDRESS/
    const placeMatch = url.match(/\/place\/([^/@]+)/);
    if (placeMatch) {
      const decoded = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      return { lat: 0, lng: 0, address: decoded };
    }
  } catch {
    // silently fail
  }
  return null;
}

export function MapRightPanel({ element }: MapRightPanelProps) {
  const props = element.mapProps;
  const updateMapProps = useEditorStore((state) => state.updateMapProps);
  const [showBorderColorPicker, setShowBorderColorPicker] = useState(false);
  const [showShadowColorPicker, setShowShadowColorPicker] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [gmapsLink, setGmapsLink] = useState('');
  const [linkStatus, setLinkStatus] = useState<'idle' | 'success' | 'error' | 'address-only'>('idle');

  if (!props) return null;

  const handlePropChange = <K extends keyof MapContent>(key: K, value: MapContent[K]) => {
    updateMapProps(element.id, { [key]: value });
  };

  const applyGmapsLink = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setLinkStatus('idle');
      return;
    }

    // Short links (maps.app.goo.gl) cannot be resolved client-side
    if (trimmed.includes('maps.app.goo.gl') || trimmed.includes('goo.gl/maps')) {
      setLinkStatus('error');
      return;
    }

    const parsed = parseGoogleMapsUrl(trimmed);
    if (!parsed) {
      setLinkStatus('error');
      return;
    }

    if (parsed.lat !== 0 || parsed.lng !== 0) {
      // Have real coordinates
      updateMapProps(element.id, {
        lat: parsed.lat.toString(),
        lng: parsed.lng.toString(),
        address: parsed.address || props.address,
      });
      setLinkStatus('success');
    } else if (parsed.address) {
      // Only address text, no coordinates
      updateMapProps(element.id, { address: parsed.address, lat: '', lng: '' });
      setLinkStatus('address-only');
    } else {
      setLinkStatus('error');
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setGmapsLink(val);
    if (val.trim().length > 10) {
      applyGmapsLink(val);
    } else {
      setLinkStatus('idle');
    }
  };

  const statusConfig = {
    idle: { color: '#94a3b8', icon: '', text: '' },
    success: { color: '#22c55e', icon: '✓', text: 'Đã cập nhật tọa độ từ link!' },
    'address-only': { color: '#f59e0b', icon: '⚠', text: 'Đã lấy địa chỉ, không tìm thấy tọa độ.' },
    error: { color: '#ef4444', icon: '✗', text: 'Không nhận diện được link. Hãy dùng link đầy đủ (không phải link rút gọn).' },
  };

  return (
    <div className="rp-panel">
      <Section title="Cài đặt Bản đồ" icon={<LayoutIcon />}>
        {/* ── Google Maps Link Input ── */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--ed-text-muted)', marginBottom: '8px', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>🔗</span> Nhập link Google Maps
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={gmapsLink}
              onChange={handleLinkChange}
              placeholder="Dán link Google Maps vào đây..."
              style={{
                width: '100%',
                padding: '9px 36px 9px 12px',
                border: `1.5px solid ${linkStatus === 'success' ? '#22c55e' : linkStatus === 'error' ? '#ef4444' : linkStatus === 'address-only' ? '#f59e0b' : 'var(--ed-border, #e2e8f0)'}`,
                borderRadius: '8px',
                fontSize: '13px',
                outline: 'none',
                background: 'var(--ed-bg, #fff)',
                color: 'var(--ed-text-primary)',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
            />
            {gmapsLink && (
              <button
                onClick={() => { setGmapsLink(''); setLinkStatus('idle'); }}
                style={{
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#94a3b8', fontSize: 16, lineHeight: 1, padding: 2,
                }}
                title="Xóa"
              >×</button>
            )}
          </div>
          {linkStatus !== 'idle' && (
            <div style={{ marginTop: 6, fontSize: '12px', color: statusConfig[linkStatus].color, display: 'flex', alignItems: 'flex-start', gap: 4 }}>
              <span style={{ flexShrink: 0 }}>{statusConfig[linkStatus].icon}</span>
              <span>{statusConfig[linkStatus].text}</span>
            </div>
          )}
          <div style={{ marginTop: 6, fontSize: '11px', color: '#94a3b8', lineHeight: 1.5 }}>
            💡 Mở Google Maps → Chia sẻ → Sao chép link và dán vào đây
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 16px' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--ed-border, #e2e8f0)' }} />
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>hoặc</span>
          <div style={{ flex: 1, height: 1, background: 'var(--ed-border, #e2e8f0)' }} />
        </div>

        <div className="rp-field" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span className="rp-label" style={{ whiteSpace: 'nowrap', margin: 0 }}>Địa chỉ & Tọa độ</span>

          <button
            className="rp-btn"
            style={{ flex: 1, padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f43f5e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500, gap: '6px' }}
            onClick={() => setShowMapModal(true)}
            title="Chọn trên bản đồ"
          >
            📍 Chọn trên bản đồ
          </button>
        </div>

        {/* Current location info */}
        {(props.lat || props.address) && (
          <div style={{
            marginTop: 10,
            padding: '8px 12px',
            background: 'var(--ed-bg-hover, #f8fafc)',
            border: '1px solid var(--ed-border, #e2e8f0)',
            borderRadius: '8px',
            fontSize: '12px',
            color: 'var(--ed-text-muted)',
          }}>
            {props.lat && props.lng ? (
              <div style={{ display: 'flex', gap: 12 }}>
                <span><strong>Lat:</strong> {Number(props.lat).toFixed(5)}</span>
                <span><strong>Lng:</strong> {Number(props.lng).toFixed(5)}</span>
              </div>
            ) : null}
            {props.address && (
              <div style={{ marginTop: props.lat ? 4 : 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                📍 {props.address}
              </div>
            )}
          </div>
        )}

        <div className="rp-field" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <span className="rp-label">Tỉ lệ Zoom</span>
          <input
            type="number"
            className="rp-input"
            style={{ width: 120 }}
            value={props.zoomLevel ?? 15}
            onChange={(e) => handlePropChange('zoomLevel', Number(e.target.value))}
            min={1}
            max={20}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <Slider
            label="Độ mờ"
            value={props.opacity ?? 1}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => handlePropChange('opacity', v)}
          />
        </div>

        <div className="rp-field" style={{ marginTop: 20 }}>
          <span className="rp-label">Căn chỉnh</span>
          <div className="rp-align-group" style={{ flex: 1 }}>
            <button
              className={`rp-align-btn ${props.align === 'left' ? 'active' : ''}`}
              onClick={() => handlePropChange('align', 'left')}
              title="Trái"
            >
              <AlignLeftIcon />
            </button>
            <button
              className={`rp-align-btn ${props.align === 'center' ? 'active' : ''}`}
              onClick={() => handlePropChange('align', 'center')}
              title="Giữa"
            >
              <AlignCenterIcon />
            </button>
            <button
              className={`rp-align-btn ${props.align === 'right' ? 'active' : ''}`}
              onClick={() => handlePropChange('align', 'right')}
              title="Phải"
            >
              <AlignRightIcon />
            </button>
          </div>
        </div>
      </Section>

      <PaddingSection
        padding={{ top: props.paddingTop || 0, right: props.paddingRight || 0, bottom: props.paddingBottom || 0, left: props.paddingLeft || 0 }}
        onChange={(p) => { handlePropChange('paddingTop', p.top); handlePropChange('paddingRight', p.right); handlePropChange('paddingBottom', p.bottom); handlePropChange('paddingLeft', p.left); }}
      />
      <BorderSection
        border={{ width: props.borderWidth || 0, style: props.borderStyle || 'none', color: props.borderColor || 'transparent', radius: props.borderRadius || 0 }}
        onChange={(b) => { handlePropChange('borderWidth', b.width); handlePropChange('borderStyle', b.style); handlePropChange('borderColor', b.color); handlePropChange('borderRadius', b.radius); }}
      />
      <ShadowSection
        shadow={{ x: props.shadowX || 0, y: props.shadowY || 0, blur: props.shadowBlur || 0, spread: props.shadowSpread || 0, color: props.shadowColor || 'transparent' }}
        onChange={(s) => { handlePropChange('shadowX', s.x); handlePropChange('shadowY', s.y); handlePropChange('shadowBlur', s.blur); handlePropChange('shadowSpread', s.spread); handlePropChange('shadowColor', s.color); }}
      />

      {showMapModal && (
        <MapPickerModal
          initialAddress={props.address}
          initialLat={props.lat}
          initialLng={props.lng}
          onClose={() => setShowMapModal(false)}
          onSave={(address, lat, lng) => {
            updateMapProps(element.id, { address, lat: lat.toString(), lng: lng.toString() });
            setShowMapModal(false);
          }}
        />
      )}
    </div>
  );
}
