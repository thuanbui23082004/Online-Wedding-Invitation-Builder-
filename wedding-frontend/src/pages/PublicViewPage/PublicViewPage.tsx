import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { cardsApi } from '../../api/cardsApi';
import { templatesApi } from '../../api/templatesApi';
import { assetsApi } from '../../api/assetsApi';
import type { CanvasElement, BackgroundProperties, AnimationProperties } from '../../features/editor/types/editor.types';
import 'animate.css';
import { RedEnvelope } from '../../features/editor/components/Widgets/RedEnvelope';
import { X, Music, VolumeX } from 'lucide-react';
import { CalendarEditorElement } from '../../features/editor/components/Widgets/CalendarEditorElement';
import { ThreeDSlider, FlatSlider, GridCollage, MixedCollage } from '../../features/editor/components/ImageEditorElement';
import { CoverPagePreview } from '../../features/editor/components/CoverPagePreview';

// ─── Loop animation CSS classes (same as editor) ─────────
function getLoopClass(ap: AnimationProperties): string {
  if (!ap.loopEnabled || ap.loopEffect === 'none') return '';
  switch (ap.loopEffect) {
    case 'bay-lo-lung': return 'animate-bay-lo-lung';
    case 'nay': return 'animate-nay';
    case 'nhap-nhay': return 'animate-nhap-nhay';
    case 'xoay-tron': return 'animate-xoay-tron';
    case 'lac': return 'animate-lac';
    case 'lac-lu': return 'animate-lac-lu';
    case 'lac-lu-nhun-nhay': return 'animate-lac-lu-nhun-nhay';
    default: return '';
  }
}

// ─── Text Renderer ────────────────────────────────────────
function PublicTextElement({ element }: { element: CanvasElement }) {
  const tp = element.textProps;
  if (!tp) return null;
  return (
    <div
      style={{
        fontFamily: tp.fontFamily,
        fontSize: tp.fontSize,
        fontWeight: tp.fontWeight,
        fontStyle: tp.fontStyle,
        textDecoration: tp.textDecoration,
        textAlign: tp.textAlign,
        color: tp.color,
        backgroundColor: tp.backgroundColor === 'transparent' ? undefined : tp.backgroundColor,
        opacity: tp.opacity,
        padding: `${tp.paddingTop}px ${tp.paddingRight}px ${tp.paddingBottom}px ${tp.paddingLeft}px`,
        border: tp.borderWidth > 0 ? `${tp.borderWidth}px ${tp.borderStyle} ${tp.borderColor}` : 'none',
        borderRadius: tp.borderRadius,
        boxShadow: tp.shadowBlur > 0 ? `${tp.shadowX}px ${tp.shadowY}px ${tp.shadowBlur}px ${tp.shadowColor}` : undefined,
        letterSpacing: tp.letterSpacing,
        lineHeight: tp.lineHeight,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: tp.textAlign === 'center' ? 'center' : tp.textAlign === 'right' ? 'flex-end' : 'flex-start',
        overflow: 'hidden',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
        boxSizing: 'border-box',
      }}
    >
      {tp.content}
    </div>
  );
}

// ─── Image Renderer ───────────────────────────────────────
function PublicImageElement({ element }: { element: CanvasElement }) {
  const ip = element.imageProps;
  if (!ip || !ip.src) return null;
  const transforms: string[] = [];
  if (ip.isFlippedX) transforms.push('scaleX(-1)');
  if (ip.isFlippedY) transforms.push('scaleY(-1)');
  const transform = transforms.length > 0 ? transforms.join(' ') : undefined;
  const crop = ip.crop;
  return (
    <div style={{
      width: '100%', height: '100%', opacity: ip.opacity,
      borderRadius: ip.borderRadius,
      border: ip.borderWidth > 0 && ip.borderStyle !== 'none' ? `${ip.borderWidth}px ${ip.borderStyle} ${ip.borderColor}` : undefined,
      boxShadow: ip.shadowBlur > 0 || ip.shadowX !== 0 || ip.shadowY !== 0 ? `${ip.shadowX}px ${ip.shadowY}px ${ip.shadowBlur}px ${ip.shadowColor}` : undefined,
      padding: `${ip.paddingTop}px ${ip.paddingRight}px ${ip.paddingBottom}px ${ip.paddingLeft}px`,
      boxSizing: 'border-box', overflow: (ip.galleryImages && ip.galleryImages.length > 0 && (!ip.sliderStyle || ip.sliderStyle === '3d')) ? 'visible' : 'hidden', display: 'flex', position: 'relative',
    }}>
      {ip.galleryImages && ip.galleryImages.length > 0 ? (
        <>
          {(!ip.sliderStyle || ip.sliderStyle === '3d') && <ThreeDSlider images={ip.galleryImages} />}
          {ip.sliderStyle === 'flat' && <FlatSlider images={ip.galleryImages} />}
          {ip.sliderStyle === 'grid' && <GridCollage images={ip.galleryImages} />}
          {ip.sliderStyle === 'collage' && <MixedCollage images={ip.galleryImages} />}
        </>
      ) : (
        <img src={ip.src} alt={ip.alt} draggable={false} crossOrigin="anonymous"
          style={{
            width: crop ? `${10000 / crop.width}%` : '100%',
            height: crop ? `${10000 / crop.height}%` : '100%',
            left: crop ? `${-(crop.x / crop.width) * 100}%` : undefined,
            top: crop ? `${-(crop.y / crop.height) * 100}%` : undefined,
            position: crop ? 'absolute' : undefined,
            objectFit: crop ? 'fill' : ip.objectFit,
            maxWidth: crop ? 'none' : undefined,
            maxHeight: crop ? 'none' : undefined,
            transform, display: 'block', pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}

// ─── Shape Renderer ───────────────────────────────────────
function PublicShapeElement({ element }: { element: CanvasElement }) {
  const sp = element.shapeProps;
  if (!sp) return null;
  const { shapeType, fillType = 'solid', fillColor, gradientFrom = '#ffffff', gradientTo = '#000000',
    gradientAngle = 90, opacity, borderStyle, borderColor, borderWidth,
    borderRadiusTopLeft, borderRadiusTopRight, borderRadiusBottomLeft, borderRadiusBottomRight,
    shadowEnabled, shadowX, shadowY, shadowBlur, shadowColor } = sp;
  const backgroundStyle = fillType === 'gradient'
    ? { background: `linear-gradient(${gradientAngle}deg, ${gradientFrom}, ${gradientTo})` }
    : { backgroundColor: fillColor };
  const shadowValue = shadowEnabled ? `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowColor}` : 'none';
  const divStyle: React.CSSProperties = {
    width: '100%', height: '100%', ...backgroundStyle, opacity,
    border: borderWidth > 0 ? `${borderWidth}px ${borderStyle} ${borderColor}` : 'none',
    boxSizing: 'border-box', boxShadow: shadowValue,
  };
  const gradId = `sg-${element.id}`;
  const angleRad = (gradientAngle - 90) * (Math.PI / 180);
  if (shapeType === 'square' || shapeType === 'rectangle') {
    return <div style={{ ...divStyle, borderTopLeftRadius: borderRadiusTopLeft, borderTopRightRadius: borderRadiusTopRight, borderBottomLeftRadius: borderRadiusBottomLeft, borderBottomRightRadius: borderRadiusBottomRight }} />;
  }
  if (shapeType === 'circle') return <div style={{ ...divStyle, borderRadius: '50%' }} />;
  if (shapeType === 'line') {
    const svgFill = fillType === 'gradient' ? `url(#${gradId})` : fillColor;
    const x1 = Math.round(50 + Math.cos(angleRad + Math.PI) * 50) + '%';
    const y1 = Math.round(50 + Math.sin(angleRad + Math.PI) * 50) + '%';
    const x2 = Math.round(50 + Math.cos(angleRad) * 50) + '%';
    const y2 = Math.round(50 + Math.sin(angleRad) * 50) + '%';
    return (
      <div style={{ width: '100%', height: '100%', opacity, filter: shadowEnabled ? `drop-shadow(${shadowValue})` : 'none' }}>
        <svg width="100%" height="100%" style={{ display: 'block' }}>
          {fillType === 'gradient' && <defs><linearGradient id={gradId} x1={x1} y1={y1} x2={x2} y2={y2}><stop offset="0%" stopColor={gradientFrom} /><stop offset="100%" stopColor={gradientTo} /></linearGradient></defs>}
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke={svgFill} strokeWidth={element.height} strokeDasharray={borderStyle === 'dashed' ? '8,8' : borderStyle === 'dotted' ? '2,4' : 'none'} />
        </svg>
      </div>
    );
  }
  if (shapeType === 'triangle') {
    const svgFill = fillType === 'gradient' ? `url(#${gradId})` : fillColor;
    const x1c = Math.round(50 + Math.cos(angleRad + Math.PI) * 50) + '%';
    const y1c = Math.round(50 + Math.sin(angleRad + Math.PI) * 50) + '%';
    const x2c = Math.round(50 + Math.cos(angleRad) * 50) + '%';
    const y2c = Math.round(50 + Math.sin(angleRad) * 50) + '%';
    return (
      <div style={{ width: '100%', height: '100%', opacity, filter: shadowEnabled ? `drop-shadow(${shadowValue})` : 'none' }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%">
          {fillType === 'gradient' && <defs><linearGradient id={gradId} x1={x1c} y1={y1c} x2={x2c} y2={y2c}><stop offset="0%" stopColor={gradientFrom} /><stop offset="100%" stopColor={gradientTo} /></linearGradient></defs>}
          <polygon points="50,0 100,100 0,100" fill={svgFill} stroke={borderWidth > 0 ? borderColor : 'none'} strokeWidth={borderWidth} />
        </svg>
      </div>
    );
  }
  return null;
}

// ─── Countdown Renderer ───────────────────────────────────
function PublicCountdownElement({ element }: { element: CanvasElement }) {
  const props = element.countdownProps;
  if (!props) return null;
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const calc = () => {
      const target = new Date(`${props.targetDate}T${props.targetTime}`);
      const diff = target.getTime() - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff / 3600000) % 24),
          minutes: Math.floor((diff / 60000) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    calc(); const t = setInterval(calc, 1000); return () => clearInterval(t);
  }, [props.targetDate, props.targetTime]);
  const items = [
    { show: props.showDays, val: timeLeft.days, label: props.label?.days || (props.language === 'vi' ? 'Ngày' : 'Days') },
    { show: props.showHours, val: timeLeft.hours, label: props.label?.hours || (props.language === 'vi' ? 'Giờ' : 'Hours') },
    { show: props.showMinutes, val: timeLeft.minutes, label: props.label?.minutes || (props.language === 'vi' ? 'Phút' : 'Mins') },
    { show: props.showSeconds, val: timeLeft.seconds, label: props.label?.seconds || (props.language === 'vi' ? 'Giây' : 'Secs') },
  ].filter(i => i.show);
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: props.direction === 'horizontal' ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: props.spacing, fontFamily: props.font }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: props.backgroundColor, opacity: props.opacity, padding: `${props.paddingTop}px ${props.paddingRight}px ${props.paddingBottom}px ${props.paddingLeft}px`, borderWidth: props.borderWidth, borderColor: props.borderColor, borderRadius: props.borderRadius, borderStyle: props.borderStyle as any, boxShadow: `${props.shadowX}px ${props.shadowY}px ${props.shadowBlur}px ${props.shadowSpread}px ${props.shadowColor}`, boxSizing: 'border-box', minWidth: 50 }}>
          <span style={{ fontSize: props.fontSize, fontWeight: 700, color: props.textColor, lineHeight: 1 }}>{String(item.val).padStart(2, '0')}</span>
          <span style={{ fontSize: props.fontSize * 0.45, color: props.frameColor, marginTop: 2, textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Map Renderer ─────────────────────────────────────────
function PublicMapElement({ element }: { element: CanvasElement }) {
  const mp = element.mapProps;
  if (!mp) return null;
  const src = mp.lat && mp.lng
    ? `https://maps.google.com/maps?q=${mp.lat},${mp.lng}&z=${mp.zoomLevel}&output=embed&hl=${mp.language}`
    : `https://maps.google.com/maps?q=${encodeURIComponent(mp.address)}&z=${mp.zoomLevel}&output=embed&hl=${mp.language}`;
  return (
    <div style={{ width: '100%', height: '100%', opacity: mp.opacity, padding: `${mp.paddingTop}px ${mp.paddingRight}px ${mp.paddingBottom}px ${mp.paddingLeft}px`, borderWidth: mp.borderWidth, borderColor: mp.borderColor, borderRadius: mp.borderRadius, borderStyle: mp.borderStyle as any, boxShadow: `${mp.shadowX}px ${mp.shadowY}px ${mp.shadowBlur}px ${mp.shadowSpread}px ${mp.shadowColor}`, boxSizing: 'border-box', overflow: 'hidden' }}>
      <iframe src={src} width="100%" height="100%" style={{ border: 0 }} loading="lazy" title="Bản đồ" />
    </div>
  );
}

// ─── QR Gift Box Renderer ─────────────────────────────────
function PublicQrGiftBoxElement({ element }: { element: CanvasElement }) {
  const qr = element.qrGiftBoxProps;
  if (!qr) return null;
  const [activeTab, setActiveTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const activeAcc = qr.accounts?.[activeTab];

  const scaleFactor = Math.min(element.width / 120, element.height / 150);

  return (
    <>
      {/* Trigger Button (Matches Editor UI) */}
      <div
        onClick={() => setModalOpen(true)}
        title="Nhấn để xem"
        className="group"
        style={{
          width: '100%',
          height: '100%',
          opacity: qr.opacity ?? 1,
          backgroundColor: qr.backgroundColor || 'transparent',
          display: 'flex',
          flexDirection: 'column',
          alignItems: qr.alignment === 'left' ? 'flex-start' : qr.alignment === 'right' ? 'flex-end' : 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          cursor: 'pointer',
          padding: `${8 * scaleFactor}px`,
        }}
      >
        {qr.iconUrl ? (
          <img
            src={qr.iconUrl}
            alt="Gift Box"
            style={{ width: '80%', height: 'auto', maxHeight: '70%', objectFit: 'contain', marginBottom: `${8 * scaleFactor}px`, pointerEvents: 'none' }}
          />
        ) : (
          <div style={{ marginBottom: `${8 * scaleFactor}px` }}>
            <RedEnvelope scaleFactor={scaleFactor * 0.45} color={qr.envelopeColor} />
          </div>
        )}
        <div style={{
          fontSize: `${12 * scaleFactor}px`,
          fontWeight: 600,
          color: '#334155',
          textAlign: qr.alignment,
          width: '100%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          pointerEvents: 'none'
        }}>
          {qr.title || 'Hộp Quà QR'}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && createPortal(
        <div
          onClick={() => setModalOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 99999, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: qr.popupBgColor || '#EAE0D5', borderRadius: 16, width: '100%', maxWidth: qr.accounts?.length === 2 ? 650 : 350, position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}
          >
            {/* Header */}
            <div style={{ backgroundColor: qr.popupHeaderBgColor || '#8B2929', padding: '24px 40px', textAlign: 'center', position: 'relative' }}>
              <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', cursor: 'pointer', color: '#fff' }}>
                <X size={24} />
              </button>
              <div style={{ fontWeight: 700, fontSize: 22, color: qr.popupHeaderTextColor || '#FFFFFF', textTransform: 'uppercase', letterSpacing: 1 }}>{qr.title}</div>
              {qr.subtitle && <div style={{ fontSize: 14, color: qr.popupHeaderTextColor || '#FFFFFF', opacity: 0.9, marginTop: 8 }}>{qr.subtitle}</div>}
            </div>

            {/* Body */}
            <div style={{ display: 'flex', flexDirection: qr.accounts?.length === 2 ? 'row' : 'column', padding: 32, gap: 32 }}>
              {(qr.accounts || []).map((acc) => (
                <div key={acc.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ color: qr.popupHeaderBgColor || '#8B2929', fontSize: 16, fontWeight: 500, marginBottom: 16 }}>{acc.label} - {acc.name}</div>
                  <div style={{ background: '#fff', padding: 12, borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: 16 }}>
                    {acc.qrImageUrl ? (
                      <img src={acc.qrImageUrl} alt="QR" style={{ width: 180, height: 180, objectFit: 'contain', borderRadius: 8 }} />
                    ) : (
                      <div style={{ width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', borderRadius: 8, color: '#94a3b8', fontSize: 14 }}>Không có mã QR</div>
                    )}
                  </div>
                  <div style={{ textAlign: 'center', color: qr.popupTextColor || '#4A4A4A' }}>
                    <div style={{ fontSize: 14, marginBottom: 4 }}>{acc.bankName}</div>
                    <div style={{ fontSize: 14, marginBottom: 4 }}>{acc.accountNumber}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>{acc.name}</div>

                    {acc.qrImageUrl && (
                      <a
                        href={acc.qrImageUrl}
                        download={`QR_${acc.bankName}_${acc.accountNumber}.png`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: qr.popupHeaderBgColor || '#8B2929', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Lưu QR
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

// ─── Album Renderer ───────────────────────────────────────
function PublicAlbumElement({ element }: { element: CanvasElement }) {
  const ap = element.albumProps;
  if (!ap || ap.images.length === 0) return null;
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (ap.sliderStyle && ap.sliderStyle !== 'slideshow') {
    const is3d = ap.sliderStyle === '3d';
    const isFlat = ap.sliderStyle === 'flat';
    const isGrid = ap.sliderStyle === 'grid';
    const isCollage = ap.sliderStyle === 'collage';

    const containerStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      backgroundColor: ap.backgroundColor,
      opacity: ap.opacity,
      padding: `${ap.padding.top}px ${ap.padding.right}px ${ap.padding.bottom}px ${ap.padding.left}px`,
      borderWidth: `${ap.border.width}px`,
      borderStyle: ap.border.style as any,
      borderColor: ap.border.color,
      borderRadius: `${ap.border.radius}px`,
      boxShadow: ap.shadow.color !== 'transparent' ? `${ap.shadow.x}px ${ap.shadow.y}px ${ap.shadow.blur}px ${ap.shadow.spread}px ${ap.shadow.color}` : 'none',
      position: 'relative',
      overflow: is3d ? 'visible' : 'hidden'
    };

    return (
      <div style={containerStyle}>
        {is3d && <ThreeDSlider images={ap.images} />}
        {isFlat && <FlatSlider images={ap.images} />}
        {isGrid && <GridCollage images={ap.images} />}
        {isCollage && <MixedCollage images={ap.images} />}
      </div>
    );
  }

  useEffect(() => {
    if (ap.delay > 0) {
      const t = setInterval(() => setCurrent(c => (c + 1) % ap.images.length), ap.delay * 1000);
      return () => clearInterval(t);
    }
  }, [ap.delay, ap.images.length]);

  const getEffectStyle = (index: number): React.CSSProperties => {
    const isActive = index === current;
    let baseStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: `all 0.5s ease-in-out`,
      opacity: isActive ? 1 : 0,
      pointerEvents: isActive ? 'auto' : 'none',
    };
    if (ap.effectType === 'slide') {
      baseStyle.transform = isActive ? 'translateX(0)' : (index < current ? 'translateX(-100%)' : 'translateX(100%)');
    } else if (ap.effectType === 'zoom') {
      baseStyle.transform = isActive ? 'scale(1)' : 'scale(1.1)';
      baseStyle.opacity = isActive ? 1 : 0;
    }
    return baseStyle;
  };

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: ap.backgroundColor, opacity: ap.opacity, padding: `${ap.padding.top}px ${ap.padding.right}px ${ap.padding.bottom}px ${ap.padding.left}px`, border: `${ap.border.width}px ${ap.border.style} ${ap.border.color}`, borderRadius: ap.border.radius, boxShadow: `${ap.shadow.x}px ${ap.shadow.y}px ${ap.shadow.blur}px ${ap.shadow.spread}px ${ap.shadow.color}`, boxSizing: 'border-box', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor: ap.enableFullscreen ? 'zoom-in' : 'default' }} onClick={() => ap.enableFullscreen && setIsFullscreen(true)}>
        {ap.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Album ${idx + 1}`}
            style={getEffectStyle(idx)}
            crossOrigin="anonymous"
          />
        ))}
        {ap.showNavButtons && ap.images.length > 1 && (
          <>
            <button onClick={e => { e.stopPropagation(); setCurrent(c => (c - 1 + ap.images.length) % ap.images.length); }} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, zIndex: 10 }}>‹</button>
            <button onClick={e => { e.stopPropagation(); setCurrent(c => (c + 1) % ap.images.length); }} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, zIndex: 10 }}>›</button>
          </>
        )}
      </div>
      {ap.showThumbnails && ap.images.length > 1 && (
        <div style={{ display: 'flex', gap: 4, overflowX: 'auto', padding: '4px 0', flexShrink: 0 }}>
          {ap.images.map((img, i) => (
            <img key={i} src={img} alt="" onClick={(e) => { e.stopPropagation(); setCurrent(i); }} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4, cursor: 'pointer', border: `2px solid ${i === current ? '#f43f5e' : 'transparent'}`, flexShrink: 0 }} />
          ))}
        </div>
      )}
      {isFullscreen && createPortal(
        <div onClick={() => setIsFullscreen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
          <img src={ap.images[current]} alt="" style={{ maxWidth: '95vw', maxHeight: '95vh', objectFit: 'contain' }} />
        </div>,
        document.body
      )}
    </div>
  );
}

// ─── RSVP & Wishbook Form Renderer ─────────────────────────
function PublicFormElement({ element, cardId }: { element: CanvasElement; cardId: string }) {
  const fp = element.formProps;
  if (!fp) return null;
  const [name, setName] = useState('');
  const [isGroomGuest, setIsGroomGuest] = useState(false);
  const [isBrideGuest, setIsBrideGuest] = useState(false);
  const [groomAttending, setGroomAttending] = useState<'yes' | 'no' | null>(null);
  const [brideAttending, setBrideAttending] = useState<'yes' | 'no' | null>(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      if (fp.showAttendance) {
        if (isGroomGuest && groomAttending) {
          await cardsApi.submitRsvp(cardId, { guestName: name, attending: groomAttending, side: 'groom', note: message });
        }
        if (isBrideGuest && brideAttending) {
          await cardsApi.submitRsvp(cardId, { guestName: name, attending: brideAttending, side: 'bride', note: message });
        }
        if (!isGroomGuest && !isBrideGuest) {
          // fallback if no side selected but attendance enabled (shouldn't happen with new UI logic usually, but just in case)
          await cardsApi.submitRsvp(cardId, { guestName: name, attending: 'yes', side: 'none', note: message });
        }
      }

      let wishSide = 'none';
      if (isGroomGuest && isBrideGuest) wishSide = 'both';
      else if (isGroomGuest) wishSide = 'groom';
      else if (isBrideGuest) wishSide = 'bride';

      if (message.trim()) {
        await cardsApi.submitWish(cardId, { displayName: name, message: message, side: wishSide });
      } else if (!fp.showAttendance) {
        await cardsApi.submitWish(cardId, { displayName: name, message: 'Đã xem thiệp', side: wishSide });
      }
      setSubmitted(true);
    } catch { setSubmitting(false); }
  };

  const alignStyles = { left: 'flex-start', center: 'center', right: 'flex-end' };
  const alignItems = alignStyles[fp.alignment] || 'center';

  if (submitted) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, backgroundColor: fp.backgroundColor, borderRadius: fp.border.radius, padding: 16 }}>
        <span style={{ fontSize: 32 }}>💌</span>
        <span style={{ fontWeight: 700, color: fp.textColor, fontFamily: fp.fontFamily }}>Cảm ơn bạn đã gửi lời chúc!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: fp.fontFamily, color: fp.textColor, opacity: fp.opacity }}>
      <h2 style={{ fontSize: `${fp.fontSize + 8}px`, fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>
        Gửi lời chúc đến cô dâu và chú rể
      </h2>
      <div style={{ flex: 1, backgroundColor: fp.backgroundColor, padding: `${fp.padding.top}px ${fp.padding.right}px ${fp.padding.bottom}px ${fp.padding.left}px`, border: `${fp.border.width}px ${fp.border.style} ${fp.border.color}`, borderRadius: fp.border.radius, boxShadow: `${fp.shadow.x}px ${fp.shadow.y}px ${fp.shadow.blur}px ${fp.shadow.spread}px ${fp.shadow.color}`, display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'stretch' }}>

        <div className="flex flex-col gap-1.5">
          <input required value={name} onChange={e => setName(e.target.value)} placeholder="Họ tên của bạn *" className="w-full px-4 py-3 rounded-xl bg-transparent outline-none transition-all duration-200 focus:shadow-[0_0_0_1px_currentColor] focus:ring-0" style={{ border: `1px solid ${fp.inputBorderColor}`, fontFamily: fp.fontFamily, color: fp.textColor, fontSize: `${fp.fontSize}px` }} />
        </div>

        {fp.showGuestType && (
          <div className="flex flex-col gap-2" style={{ fontSize: `${fp.fontSize}px` }}>
            <span className="font-bold tracking-wide mb-1">Bạn là khách của <span className="font-normal opacity-70 text-[0.9em] lowercase">(chọn 1 hoặc cả 2)</span></span>

            <div className="grid grid-cols-2 gap-3">
              {/* Nhà trai */}
              <div className="border rounded-xl p-3 flex flex-col gap-2 transition-all duration-300" style={{ borderColor: isGroomGuest ? fp.textColor : fp.inputBorderColor, backgroundColor: isGroomGuest ? 'rgba(0,0,0,0.02)' : 'transparent', opacity: isGroomGuest ? 1 : 0.65 }}>
                <label className="flex items-center cursor-pointer select-none gap-2">
                  <input type="checkbox" checked={isGroomGuest} onChange={(e) => setIsGroomGuest(e.target.checked)} style={{ accentColor: fp.textColor, width: 18, height: 18, cursor: 'pointer' }} />
                  <span className="font-bold">Nhà trai</span>
                </label>

                {fp.showAttendance && (
                  <div className="flex flex-col gap-2 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="groomAttending" checked={groomAttending === 'yes'} onChange={() => setGroomAttending('yes')} className="w-4 h-4 accent-rose-500 cursor-pointer" required={isGroomGuest} disabled={!isGroomGuest} />
                      <span className={`text-[0.9em] transition-all duration-200 ${groomAttending === 'yes' ? 'font-bold' : 'font-medium'}`}>Sẽ tham dự</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="groomAttending" checked={groomAttending === 'no'} onChange={() => setGroomAttending('no')} className="w-4 h-4 accent-rose-500 cursor-pointer" required={isGroomGuest} disabled={!isGroomGuest} />
                      <span className={`text-[0.9em] transition-all duration-200 ${groomAttending === 'no' ? 'font-bold' : 'font-medium'}`}>Không thể đến</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Nhà gái */}
              <div className="border rounded-xl p-3 flex flex-col gap-2 transition-all duration-300" style={{ borderColor: isBrideGuest ? fp.textColor : fp.inputBorderColor, backgroundColor: isBrideGuest ? 'rgba(0,0,0,0.02)' : 'transparent', opacity: isBrideGuest ? 1 : 0.65 }}>
                <label className="flex items-center cursor-pointer select-none gap-2">
                  <input type="checkbox" checked={isBrideGuest} onChange={(e) => setIsBrideGuest(e.target.checked)} style={{ accentColor: fp.textColor, width: 18, height: 18, cursor: 'pointer' }} />
                  <span className="font-bold">Nhà gái</span>
                </label>

                {fp.showAttendance && (
                  <div className="flex flex-col gap-2 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="brideAttending" checked={brideAttending === 'yes'} onChange={() => setBrideAttending('yes')} className="w-4 h-4 accent-rose-500 cursor-pointer" required={isBrideGuest} disabled={!isBrideGuest} />
                      <span className={`text-[0.9em] transition-all duration-200 ${brideAttending === 'yes' ? 'font-bold' : 'font-medium'}`}>Sẽ tham dự</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="brideAttending" checked={brideAttending === 'no'} onChange={() => setBrideAttending('no')} className="w-4 h-4 accent-rose-500 cursor-pointer" required={isBrideGuest} disabled={!isBrideGuest} />
                      <span className={`text-[0.9em] transition-all duration-200 ${brideAttending === 'no' ? 'font-bold' : 'font-medium'}`}>Không thể đến</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Lời chúc của bạn *" rows={3} className="w-full px-4 py-3 rounded-xl bg-transparent outline-none transition-all duration-200 focus:shadow-[0_0_0_1px_currentColor] focus:ring-0" style={{ border: `1px solid ${fp.inputBorderColor}`, fontFamily: fp.fontFamily, color: fp.textColor, fontSize: `${fp.fontSize}px`, resize: 'none' }} required />
        </div>



        <div className="flex justify-center mt-2 pb-2">
          <button type="submit" disabled={submitting} className={`w-full py-3.5 px-6 rounded-xl border-none font-bold tracking-wider uppercase transition-all duration-200 active:scale-[0.98] ${submitting ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:opacity-90 shadow-lg hover:shadow-xl'}`} style={{ backgroundColor: fp.buttonBgColor, color: fp.buttonTextColor, fontFamily: fp.fontFamily, fontSize: `${fp.fontSize}px`, boxShadow: `0 4px 14px 0 ${fp.buttonBgColor}40` }}>
            {submitting ? 'ĐANG GỬI...' : 'GỬI LỜI CHÚC'}
          </button>
        </div>
      </div>
    </form>
  );
}

// ─── Button Contact Renderer ──────────────────────────────
function PublicButtonElement({ element }: { element: CanvasElement }) {
  const bp = element.buttonContactProps;
  if (!bp) return null;
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: bp.opacity }}>
      <a href={`tel:${bp.phoneNumber}`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: bp.fontFamily, fontSize: bp.fontSize, color: bp.textColor, backgroundColor: bp.backgroundColor, textDecoration: 'none', padding: `${bp.padding.top}px ${bp.padding.right}px ${bp.padding.bottom}px ${bp.padding.left}px`, border: `${bp.border.width}px ${bp.border.style} ${bp.border.color}`, borderRadius: bp.border.radius, boxShadow: `${bp.shadow.x}px ${bp.shadow.y}px ${bp.shadow.blur}px ${bp.shadow.spread}px ${bp.shadow.color}`, fontWeight: 700, width: '100%', justifyContent: 'center' }}>
        {bp.showIcon && <span>📞</span>}
        {bp.buttonText}
      </a>
    </div>
  );
}

// ─── Single Element with Scroll Animation ────────────────
function PublicElement({ element, scrollingDown, cardId, showCover }: { element: CanvasElement; scrollingDown: boolean; cardId: string; showCover: boolean }) {
  const ap = element.animationProps;
  const observerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<HTMLDivElement>(null);
  const triggeredRef = useRef(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  const loopClass = useMemo(() => ap ? getLoopClass(ap) : '', [ap]);

  // Entry animation – fires ONLY when scrolling down, only once
  useEffect(() => {
    const target = observerRef.current;
    const el = animRef.current;
    if (!target || !el || !ap || !ap.entryEnabled || ap.entryEffect === 'none') return;
    if (showCover) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !triggeredRef.current && scrollingDown) {
            triggeredRef.current = true;
            setHasTriggered(true);
            el.style.opacity = ''; // Loại bỏ delay hiển thị
            el.style.animationDuration = `${ap.entryDuration || 1.0}s`;
            el.style.animationDelay = `${ap.entryDelay || 0}s`;
            el.style.animationTimingFunction = ap.entryEasing || 'ease';
            el.classList.remove('animate__animated', `animate__${ap.entryEffect}`);
            void el.offsetHeight;
            el.classList.add('animate__animated', `animate__${ap.entryEffect}`);
          }
        });
      },
      { rootMargin: '50px 0px 50px 0px', threshold: 0 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [ap, scrollingDown, showCover]);

  return (
    <div ref={observerRef} style={{ position: 'absolute', left: element.x, top: element.y, width: element.width, height: element.height, zIndex: element.zIndex }}>
      <div ref={animRef} style={{ width: '100%', height: '100%', opacity: (ap?.entryEnabled && ap.entryEffect !== 'none' && !hasTriggered) ? 0 : undefined }}>
        <div className={loopClass} style={{ width: '100%', height: '100%', transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined, ...(ap?.loopEnabled && ap.loopEffect !== 'none' ? { '--anim-dur': `${ap.loopDuration}s`, '--anim-delay': `${ap.loopDelay}s` } as React.CSSProperties : {}) }}>
          {element.type === 'text' && <PublicTextElement element={element} />}
          {element.type === 'image' && <PublicImageElement element={element} />}
          {element.type === 'shape' && <PublicShapeElement element={element} />}
          {element.type === 'countdown' && <PublicCountdownElement element={element} />}
          {element.type === 'map' && <PublicMapElement element={element} />}
          {element.type === 'qr_code' && <PublicQrGiftBoxElement element={element} />}
          {element.type === 'calendar' && <CalendarEditorElement element={element} zoom={100} />}
          {element.type === 'album' && <PublicAlbumElement element={element} />}
          {element.type === 'form' && <PublicFormElement element={element} cardId={cardId} />}
          {element.type === 'button_contact' && <PublicButtonElement element={element} />}
        </div>
      </div>
    </div>
  );
}

// ─── Music floating button ────────────────────────────────
function MusicButton({ isPlaying, onToggle }: { isPlaying: boolean; onToggle: (e?: any) => void }) {
  return (
    <button onClick={onToggle} title={isPlaying ? 'Tắt nhạc' : 'Bật nhạc'}
      style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #f43f5e, #fb7185)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(244,63,94,0.4)', transition: 'transform 0.2s', color: '#fff' }}>
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', animation: isPlaying ? 'musicSpin 3s linear infinite' : 'none' }}>
        {isPlaying ? <Music size={22} strokeWidth={2.5} /> : <VolumeX size={22} strokeWidth={2.5} />}
      </span>
    </button>
  );
}

// ─── 404 Page ─────────────────────────────────────────────
function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fecdd3 100%)', padding: 24, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>💔</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1e293b', margin: '0 0 12px 0' }}>Không tìm thấy thiệp</h1>
      <p style={{ fontSize: 15, color: '#64748b', marginBottom: 32, maxWidth: 360 }}>Thiệp này không tồn tại, chưa được phát hành, hoặc đường link không chính xác.</p>
      <button onClick={() => navigate('/home')} style={{ padding: '12px 32px', borderRadius: 50, background: 'linear-gradient(135deg, #f43f5e, #fb7185)', color: '#fff', border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 20px rgba(244,63,94,0.3)' }}>
        ← Quay lại trang chủ
      </button>
    </div>
  );
}

function LoadingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #fff1f2, #ffe4e6)', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>💕</div>
        <p style={{ color: '#f43f5e', fontWeight: 600, fontSize: 16 }}>Đang tải thiệp cưới...</p>
      </div>
    </div>
  );
}

// ─── MAIN PUBLIC VIEW PAGE ────────────────────────────────
export function PublicViewPage({ isTemplate = false }: { isTemplate?: boolean }) {
  const { slug } = useParams<{ slug: string }>();
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicBlocked, setMusicBlocked] = useState(false);
  const [scrollingDown, setScrollingDown] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastScrollY = useRef(0);
  const userInteracted = useRef(false);
  const [showCover, setShowCover] = useState(true);
  const [scale, setScale] = useState(1);

  // Lock body scroll when cover is visible
  useEffect(() => {
    if (showCover) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showCover]);

  // Fetch card data (public endpoint, no auth needed)
  useEffect(() => {
    if (!slug) return;
    
    if (isTemplate) {
      templatesApi.getTemplateById(slug)
        .then(data => {
          const blocks = data.blocks || [];
          const calculatedHeight = Math.max(900, ...blocks.map((b: any) => (b.posY || 0) + (b.height || 100))) + 150;
          
          // Map template data to match card structure
          setCard({
            ...data,
            settings: {
              ...(data.settings || {}),
              canvasWidth: data.canvasWidth,
              canvasHeight: data.background?.canvasHeight || data.canvasHeight || calculatedHeight,
              music: data.background?.music || null,
            },
          });
          setLoading(false);
        })
        .catch(() => {
          setNotFound(true);
          setLoading(false);
        });
    } else {
      cardsApi.getPublicCard(slug)
        .then(data => { setCard(data); setLoading(false); })
        .catch(() => { setNotFound(true); setLoading(false); });
    }
  }, [slug, isTemplate]);

  // Fetch and inject public fonts
  useEffect(() => {
    assetsApi.getPublicFonts().then(data => {
      let styleEl = document.getElementById('custom-fonts');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'custom-fonts';
        document.head.appendChild(styleEl);
      }

      let css = '';
      const allFonts = [...data.systemFonts, ...data.myFonts];
      allFonts.forEach(font => {
        if (font.thumbnailUrl) {
          css += `
            @font-face {
              font-family: "${font.thumbnailUrl}";
              src: url("${font.url}");
              font-display: swap;
            }
          `;
        }
      });
      styleEl.innerHTML = css;
    }).catch(err => console.error("Failed to load public fonts", err));
  }, []);

  // Track scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrollingDown(y >= lastScrollY.current);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Music init
  const music = card?.settings?.music;
  useEffect(() => {
    if (!music?.src) return;
    const audio = new Audio(music.src);
    audio.loop = music.loop ?? true;
    audio.volume = music.volume ?? 0.7;
    audioRef.current = audio;
    if (music.autoPlay) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {
        setMusicBlocked(true);
        setIsPlaying(false);
      });
    } else {
      setIsPlaying(false);
    }
    return () => { audio.pause(); audio.src = ''; };
  }, [music?.src]);

  // First user interaction → start music if autoPlay was blocked
  const handleFirstInteraction = useCallback(() => {
    if (userInteracted.current) return;
    userInteracted.current = true;
    const audio = audioRef.current;
    if (!audio || !music?.autoPlay) return;
    audio.play().then(() => { setIsPlaying(true); setMusicBlocked(false); }).catch(() => { });
  }, [music?.autoPlay]);

  useEffect(() => {
    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [handleFirstInteraction]);

  const toggleMusic = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
        e.nativeEvent.stopImmediatePropagation();
      }
    }
    userInteracted.current = true;
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { audio.play().then(() => setIsPlaying(true)).catch(() => { }); }
  }, [isPlaying]);

  // SEO
  useEffect(() => {
    if (!card) return;
    document.title = card.title || 'Thiệp Cưới';
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
      el.content = content;
    };
    const setProp = (prop: string, content: string) => {
      let el = document.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement;
      if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el); }
      el.content = content;
    };
    const desc = card.settings?.description || `Thiệp cưới của ${card.groomName || ''} & ${card.brideName || ''}`;
    const cover = card.settings?.coverImage || card.thumbnailUrl || '';
    setMeta('description', desc);
    setProp('og:title', card.title);
    setProp('og:description', desc);
    if (cover) setProp('og:image', cover);
  }, [card]);

  // Auto-scroll logic (Super Smooth Implementation)
  useEffect(() => {
    const shouldAutoScroll = card?.settings?.autoScroll ?? isTemplate; // Default true for templates
    if (!card || !shouldAutoScroll || showCover) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let exactScrollTop = window.scrollY;
    let isHovered = false;

    const autoScrollSpeed = card.settings.autoScrollSpeed || 50;
    const pixelsPerSecond = (autoScrollSpeed / 100) * 120;

    const stopScroll = () => { isHovered = true; };
    const resumeScroll = () => {
      setTimeout(() => {
        isHovered = false;
        lastTime = performance.now();
        exactScrollTop = window.scrollY;
      }, 3000);
    };

    window.addEventListener('touchstart', stopScroll, { passive: true });
    window.addEventListener('touchend', resumeScroll, { passive: true });
    window.addEventListener('mousedown', stopScroll);
    window.addEventListener('mouseup', resumeScroll);
    window.addEventListener('wheel', () => {
      stopScroll();
      resumeScroll();
    }, { passive: true });

    const scrollStep = (currentTime: number) => {
      if (!isHovered) {
        let deltaTime = (currentTime - lastTime) / 1000;
        if (deltaTime > 0.1) deltaTime = 0.016;
        lastTime = currentTime;

        exactScrollTop += pixelsPerSecond * deltaTime;
        window.scrollTo(0, exactScrollTop);
      } else {
        lastTime = currentTime;
        exactScrollTop = window.scrollY;
      }

      // Stop if reached bottom
      if (window.scrollY + window.innerHeight < document.documentElement.scrollHeight - 1) {
        animationFrameId = requestAnimationFrame(scrollStep);
      }
    };

    const timeoutId = setTimeout(() => {
      lastTime = performance.now();
      exactScrollTop = window.scrollY;
      animationFrameId = requestAnimationFrame(scrollStep);
    }, 1500);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('touchstart', stopScroll);
      window.removeEventListener('touchend', resumeScroll);
      window.removeEventListener('mousedown', stopScroll);
      window.removeEventListener('mouseup', resumeScroll);
    };
  }, [card, showCover]);
  const canvasWidth: number = card?.settings?.canvasWidth || card?.canvasWidth || 500;

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
      if (windowWidth < canvasWidth) {
        setScale(windowWidth / canvasWidth);
      } else {
        setScale(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasWidth]);

  if (loading) return <LoadingPage />;
  if (notFound || !card) return <NotFoundPage />;

  // Parse background
  const bg: BackgroundProperties = card.background || { type: 'solid', color: '#ffffff', gradientFrom: '#fff', gradientTo: '#fff', gradientAngle: 90, imageSrc: '', imageOpacity: 1 };

  // Map blocks → CanvasElement format
  // Note: backend saves some blockTypes differently than editor types
  const blockTypeToElementType = (bt: string): CanvasElement['type'] => {
    switch (bt) {
      case 'text': return 'text';
      case 'image': return 'image';
      case 'shape': return 'shape';
      case 'countdown': return 'countdown';
      case 'map': return 'map';
      case 'qr_code': return 'qr_code';
      case 'calendar': return 'calendar';
      case 'album': case 'gallery': return 'album';
      case 'form': case 'rsvp_form': return 'form';
      case 'button_contact': case 'button': return 'button_contact';
      default: return 'text';
    }
  };

  const elements: CanvasElement[] = (card.blocks || []).map((b: any) => {
    const elType = blockTypeToElementType(b.blockType);
    let ap = b.style;
    if (typeof ap === 'string') {
      try { ap = JSON.parse(ap); } catch (e) {}
    }
    const base = { id: b.id, type: elType, x: b.posX, y: b.posY, width: b.width, height: b.height, zIndex: b.zIndex, rotation: b.rotation || 0, isLocked: b.isLocked, animationProps: ap && Object.keys(ap).length > 0 ? ap : undefined };
    switch (elType) {
      case 'text': return { ...base, textProps: b.content };
      case 'image': return { ...base, imageProps: b.content };
      case 'shape': return { ...base, shapeProps: b.content };
      case 'countdown': return { ...base, countdownProps: b.content };
      case 'map': return { ...base, mapProps: b.content };
      case 'qr_code': return { ...base, qrGiftBoxProps: b.content };
      case 'calendar': return { ...base, calendarProps: b.content };
      case 'album': return { ...base, albumProps: b.content };
      case 'form': return { ...base, formProps: b.content };
      case 'button_contact': return { ...base, buttonContactProps: b.content };
      default: return base;
    }
  });
  const canvasHeight: number = card.settings?.canvasHeight || 900;

  const bgStyle: React.CSSProperties = {
    ...(bg.type === 'solid' && { backgroundColor: bg.color }),
    ...(bg.type === 'gradient' && { backgroundImage: `linear-gradient(${bg.gradientAngle}deg, ${bg.gradientFrom}, ${bg.gradientTo})` }),
    ...(bg.type === 'image' && { backgroundImage: `url(${bg.imageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }),
  };

  return (
    <>
      <style>{`
        @keyframes musicSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>

      <div style={{ minHeight: '100vh', width: '100%', backgroundColor: '#f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Autoplay toast */}
        {musicBlocked && !isPlaying && (
          <div onClick={toggleMusic}
            style={{ position: 'fixed', bottom: 84, right: 24, zIndex: 9998, background: 'rgba(15,23,42,0.85)', color: '#fff', padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(8px)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            🎵 Nhấn để bật nhạc
          </div>
        )}

        {/* Canvas container */}
        <div style={{ width: canvasWidth * scale, height: canvasHeight * scale, position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: canvasWidth, height: canvasHeight, position: 'relative', transform: `scale(${scale})`, transformOrigin: 'top left', ...bgStyle }}>
            {[...elements]
              .sort((a, b) => a.zIndex - b.zIndex)
              .map(el => (
                <PublicElement key={el.id} element={el} scrollingDown={scrollingDown} cardId={card.id} showCover={showCover} />
              ))}
          </div>
        </div>

        {/* Cover Page Overlay - Fixed to Viewport */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: canvasWidth,
            height: '100dvh', // Use dynamic viewport height for mobile browsers
            zIndex: 9999,
            transition: 'opacity 0.8s ease-in-out',
            opacity: showCover ? 1 : 0,
            pointerEvents: showCover ? 'auto' : 'none',
          }}
        >
          <CoverPagePreview onOpen={() => setShowCover(false)} customProps={(card?.settings as any)?.coverPage} />
        </div>


      </div>

      {music?.src && <MusicButton isPlaying={isPlaying} onToggle={toggleMusic} />}
    </>
  );
}

export default PublicViewPage;
