// =============================================================
// EFFECTS PANEL – Global animation preset picker
// Applies selected preset's animationProps to ALL elements
// =============================================================
import { useState } from 'react';
import type { JSX } from 'react';
import { useEditorStore } from '../store/editorStore';
import type { AnimationProperties } from '../types/editor.types';

// ── Icons ──────────────────────────────────────────────────
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Individual SVG icons per preset (colorful, styled like the screenshot)
const IconFadeInAll = () => (
  <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
    <circle cx="20" cy="20" r="8" fill="#FFB3B0" opacity="0.4"/>
    <circle cx="20" cy="20" r="5" fill="#FF6B6B" opacity="0.7"/>
    <circle cx="20" cy="20" r="2.5" fill="#F95E5A"/>
    <circle cx="10" cy="10" r="2" fill="#FFB3B0"/>
    <circle cx="30" cy="10" r="2" fill="#FFB3B0"/>
    <circle cx="10" cy="30" r="2" fill="#FFB3B0"/>
    <circle cx="30" cy="30" r="2" fill="#FFB3B0"/>
  </svg>
);

const IconSlideUpAll = () => (
  <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
    <rect x="8" y="22" width="24" height="6" rx="3" fill="#FFB3B0"/>
    <rect x="8" y="13" width="24" height="6" rx="3" fill="#F95E5A"/>
    <polygon points="20,5 26,12 14,12" fill="#c0392b"/>
  </svg>
);

const IconScaleInAll = () => (
  <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
    <rect x="14" y="14" width="12" height="12" rx="3" fill="#FFB3B0" opacity="0.5"/>
    <rect x="10" y="10" width="20" height="20" rx="4" fill="none" stroke="#F95E5A" strokeWidth="2" strokeDasharray="3 2"/>
    <polyline points="26,6 34,6 34,14" stroke="#F95E5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="25" y1="15" x2="34" y2="6" stroke="#F95E5A" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconFlipInAll = () => (
  <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
    <rect x="6" y="12" width="12" height="16" rx="3" fill="#FFB3B0" opacity="0.7"/>
    <rect x="22" y="12" width="12" height="16" rx="3" fill="#F95E5A" opacity="0.9"/>
    <line x1="20" y1="8" x2="20" y2="32" stroke="#c0392b" strokeWidth="2" strokeDasharray="3 2"/>
  </svg>
);

const IconSlideUpMix = () => (
  <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
    <rect x="6" y="24" width="12" height="10" rx="3" fill="#FFB3B0" opacity="0.6"/>
    <rect x="22" y="16" width="12" height="18" rx="3" fill="#F95E5A" opacity="0.8"/>
    <polyline points="12,20 12,12 8,16" stroke="#F95E5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="28,12 28,20 32,16" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconFadeInMix = () => (
  <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
    <path d="M6 20 C6 14 12 10 18 14 L18 26 C12 30 6 26 6 20Z" fill="#FFB3B0" opacity="0.7"/>
    <path d="M22 14 C28 10 34 14 34 20 C34 26 28 30 22 26Z" fill="#F95E5A" opacity="0.9"/>
    <line x1="20" y1="10" x2="20" y2="30" stroke="#c0392b" strokeWidth="2" strokeDasharray="3 2"/>
  </svg>
);

const IconBounceInAll = () => (
  <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
    <circle cx="20" cy="14" r="7" fill="#74B9FF" opacity="0.9"/>
    <ellipse cx="20" cy="33" rx="8" ry="3" fill="#a0d8ff" opacity="0.5"/>
    <line x1="20" y1="21" x2="20" y2="30" stroke="#0984e3" strokeWidth="2" strokeDasharray="2 2"/>
  </svg>
);

const IconFadeInDownAll = () => (
  <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
    <rect x="8" y="10" width="24" height="6" rx="3" fill="#FFB3B0" opacity="0.4"/>
    <rect x="8" y="18" width="24" height="6" rx="3" fill="#F95E5A" opacity="0.8"/>
    <rect x="8" y="26" width="24" height="6" rx="3" fill="#c0392b" opacity="0.6"/>
    <polygon points="20,36 14,30 26,30" fill="#F95E5A"/>
  </svg>
);

const IconZoomInUpAll = () => (
  <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
    <rect x="12" y="14" width="16" height="14" rx="4" fill="#a29bfe" opacity="0.7"/>
    <rect x="16" y="10" width="8" height="8" rx="2" fill="#6c5ce7" opacity="0.9"/>
    <polyline points="20,4 20,10" stroke="#6c5ce7" strokeWidth="2" strokeLinecap="round"/>
    <polyline points="16,8 20,4 24,8" stroke="#6c5ce7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconRotateInAll = () => (
  <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
    <circle cx="20" cy="20" r="11" stroke="#fd79a8" strokeWidth="3" strokeDasharray="5 3"/>
    <circle cx="20" cy="20" r="5" fill="#e84393" opacity="0.8"/>
    <polyline points="30,8 34,14 28,14" stroke="#e84393" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconLightSpeedAll = () => (
  <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
    <line x1="4" y1="16" x2="28" y2="16" stroke="#74B9FF" strokeWidth="3.5" strokeLinecap="round"/>
    <line x1="8" y1="22" x2="32" y2="22" stroke="#0984e3" strokeWidth="3.5" strokeLinecap="round"/>
    <line x1="12" y1="28" x2="36" y2="28" stroke="#74B9FF" strokeWidth="2.5" strokeLinecap="round"/>
    <polyline points="28,10 36,16 28,22" stroke="#0984e3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconBackInUpAll = () => (
  <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
    <rect x="10" y="18" width="20" height="14" rx="4" fill="#55efc4" opacity="0.8"/>
    <rect x="14" y="10" width="12" height="12" rx="3" fill="#00b894" opacity="0.9"/>
    <line x1="20" y1="4" x2="20" y2="11" stroke="#00b894" strokeWidth="2" strokeLinecap="round"/>
    <polyline points="15,8 20,4 25,8" stroke="#00b894" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconJackInTheBox = () => (
  <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
    <rect x="12" y="22" width="16" height="12" rx="3" fill="#fdcb6e" opacity="0.9"/>
    <circle cx="20" cy="14" r="8" fill="#e17055" opacity="0.9"/>
    <line x1="20" y1="22" x2="20" y2="20" stroke="#fdcb6e" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="17" cy="13" r="1.5" fill="white"/>
    <circle cx="23" cy="13" r="1.5" fill="white"/>
    <path d="M17 17 Q20 19 23 17" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </svg>
);

const IconSlideInMix = () => (
  <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
    <rect x="4" y="14" width="14" height="12" rx="3" fill="#74B9FF" opacity="0.7"/>
    <rect x="22" y="14" width="14" height="12" rx="3" fill="#0984e3" opacity="0.7"/>
    <polyline points="14,10 4,16 14,22" stroke="#0984e3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="26,10 36,16 26,22" stroke="#74B9FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconNone = () => (
  <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
    <circle cx="20" cy="20" r="12" stroke="#b2bec3" strokeWidth="3"/>
    <line x1="12" y1="12" x2="28" y2="28" stroke="#b2bec3" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// ── Preset types & definitions ─────────────────────────────
interface PresetDef {
  id: string;
  label: string;
  icon: () => JSX.Element;
  apply: (index: number) => Partial<AnimationProperties>;
}

const PRESETS: PresetDef[] = [
  {
    id: 'none',
    label: 'Bỏ hiệu ứng',
    icon: IconNone,
    apply: () => ({ entryEnabled: false, entryEffect: 'none', loopEnabled: false, loopEffect: 'none' }),
  },
  {
    id: 'fadeInAll',
    label: 'Fade In All',
    icon: IconFadeInAll,
    apply: () => ({ entryEnabled: true, entryEffect: 'fadeIn', entryDuration: 1.0, entryDelay: 0, entryEasing: 'ease-out' }),
  },
  {
    id: 'slideUpAll',
    label: 'Slide Up All',
    icon: IconSlideUpAll,
    apply: () => ({ entryEnabled: true, entryEffect: 'slideInUp', entryDuration: 0.9, entryDelay: 0, entryEasing: 'ease-out' }),
  },
  {
    id: 'scaleInAll',
    label: 'Scale In All',
    icon: IconScaleInAll,
    apply: () => ({ entryEnabled: true, entryEffect: 'zoomIn', entryDuration: 0.8, entryDelay: 0, entryEasing: 'ease-out' }),
  },
  {
    id: 'flipInAll',
    label: 'Flip In All',
    icon: IconFlipInAll,
    apply: () => ({ entryEnabled: true, entryEffect: 'flipInX', entryDuration: 1.0, entryDelay: 0, entryEasing: 'ease' }),
  },
  {
    id: 'slideUpMix',
    label: 'Slide Up Mix',
    icon: IconSlideUpMix,
    apply: (i) => ({
      entryEnabled: true,
      entryEffect: i % 2 === 0 ? 'slideInUp' : 'slideInDown',
      entryDuration: 0.9, entryDelay: 0, entryEasing: 'ease-out',
    }),
  },
  {
    id: 'fadeInMix',
    label: 'Fade In Mix',
    icon: IconFadeInMix,
    apply: (i) => ({
      entryEnabled: true,
      entryEffect: i % 2 === 0 ? 'fadeInLeft' : 'fadeInRight',
      entryDuration: 1.0, entryDelay: 0, entryEasing: 'ease-out',
    }),
  },
  {
    id: 'bounceInAll',
    label: 'Bounce In All',
    icon: IconBounceInAll,
    apply: () => ({ entryEnabled: true, entryEffect: 'bounceIn', entryDuration: 1.0, entryDelay: 0, entryEasing: 'ease' }),
  },
  {
    id: 'fadeInDownAll',
    label: 'Fade In Down All',
    icon: IconFadeInDownAll,
    apply: () => ({ entryEnabled: true, entryEffect: 'fadeInDown', entryDuration: 1.0, entryDelay: 0, entryEasing: 'ease-out' }),
  },
  {
    id: 'zoomInUpAll',
    label: 'Zoom In Up All',
    icon: IconZoomInUpAll,
    apply: () => ({ entryEnabled: true, entryEffect: 'zoomInUp', entryDuration: 0.9, entryDelay: 0, entryEasing: 'ease-out' }),
  },
  {
    id: 'rotateInAll',
    label: 'Rotate In All',
    icon: IconRotateInAll,
    apply: () => ({ entryEnabled: true, entryEffect: 'rotateIn', entryDuration: 1.0, entryDelay: 0, entryEasing: 'ease-out' }),
  },
  {
    id: 'lightSpeedAll',
    label: 'Light Speed All',
    icon: IconLightSpeedAll,
    apply: () => ({ entryEnabled: true, entryEffect: 'lightSpeedInRight', entryDuration: 0.8, entryDelay: 0, entryEasing: 'ease-out' }),
  },
  {
    id: 'backInUpAll',
    label: 'Back In Up All',
    icon: IconBackInUpAll,
    apply: () => ({ entryEnabled: true, entryEffect: 'backInUp', entryDuration: 1.0, entryDelay: 0, entryEasing: 'ease-out' }),
  },
  {
    id: 'jackInTheBox',
    label: 'Jack In The Box',
    icon: IconJackInTheBox,
    apply: () => ({ entryEnabled: true, entryEffect: 'jackInTheBox', entryDuration: 1.2, entryDelay: 0, entryEasing: 'ease-out' }),
  },
  {
    id: 'slideInMix',
    label: 'Slide In Mix',
    icon: IconSlideInMix,
    apply: (i) => ({
      entryEnabled: true,
      entryEffect: i % 2 === 0 ? 'slideInLeft' : 'slideInRight',
      entryDuration: 0.9, entryDelay: 0, entryEasing: 'ease-out',
    }),
  },
];

// ── Panel Component ────────────────────────────────────────
export function EffectsPanel({ onClose }: { onClose: () => void }) {
  const { applyGlobalAnimation, activeGlobalAnimationPreset } = useEditorStore();

  const handleApply = (preset: PresetDef) => {
    applyGlobalAnimation(preset.id, preset.apply);
  };

  return (
    <div className="lt-effects-panel">
      {/* Header */}
      <div className="lt-effects-panel-header">
        <span className="lt-effects-panel-title">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" style={{ color: '#F95E5A' }}>
            <path d="M10 1l2.39 7.26H20l-6.19 4.5 2.36 7.24L10 15.5l-6.17 4.5 2.36-7.24L0 8.26h7.61z"/>
          </svg>
          Hiệu ứng động
        </span>
        <button className="lt-effects-panel-close" onClick={onClose} title="Đóng">
          <CloseIcon />
        </button>
      </div>

      {/* Subtitle */}
      <p className="lt-effects-panel-subtitle">
        Chọn một bộ hiệu ứng để áp dụng cho toàn bộ nội dung trang
      </p>

      {/* Grid of presets */}
      <div className="lt-effects-grid">
        {PRESETS.map((preset) => {
          const isApplied = activeGlobalAnimationPreset === preset.id;
          return (
            <button
              key={preset.id}
              className={`lt-effects-preset-btn${isApplied ? ' applied' : ''}`}
              onClick={() => handleApply(preset)}
              title={preset.label}
            >
              <div className="lt-effects-preset-icon">
                <preset.icon />
              </div>
              <span className="lt-effects-preset-label">{preset.label}</span>
              <div className="lt-effects-preset-bar" />
              {isApplied && (
                <span className="lt-effects-applied-badge">✓ Đã áp dụng</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
