import { useEditorStore } from '../store/editorStore';
import { useMemo, useEffect, useState } from 'react';

import type { CoverPageProps } from '../types/editor.types';

export function CoverPagePreview({ onOpen, customProps }: { onOpen?: () => void, customProps?: CoverPageProps }) {
  const storeProps = useEditorStore((state) => state.coverPageProps);
  const coverPageProps = customProps || storeProps;

  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    // Call the original onOpen after animation finishes
    setTimeout(() => {
      onOpen?.();
    }, 1800);
  };

  // Generate particles based on config
  useEffect(() => {
    if (coverPageProps.showEffect) {
      const newParticles = Array.from({ length: coverPageProps.effectParticleCount }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100 + 100, // Start below viewport
        size: Math.random() * 15 + 10,
        duration: (Math.random() * 5 + 5) * (100 / Math.max(coverPageProps.effectSpeed, 10)),
        delay: Math.random() * 5,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [coverPageProps.showEffect, coverPageProps.effectParticleCount, coverPageProps.effectSpeed]);

  const renderParticleContent = () => {
    switch (coverPageProps.effectType) {
      case 'hy': return '囍';
      case 'cherry': return '🌸';
      case 'yellow': return '🌼';
      case 'heart': return '❤️';
      default: return '囍';
    }
  };

  const getPatternIcon = () => {
    if (coverPageProps.patternStyle === 'hidden') return null;

    if (coverPageProps.patternStyle === 'custom' && coverPageProps.patternCustomImage) {
      return (
        <img
          src={coverPageProps.patternCustomImage}
          alt="Custom Pattern"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      );
    }

    // Fallback simple SVG pattern for demonstration
    // In a real app, this would be a detailed SVG based on 'patternStyle'
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 200" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M50 10 Q 90 50 50 90 Q 10 130 50 170" fill="none" stroke={coverPageProps.patternColor} strokeWidth="4" />
        <circle cx="50" cy="50" r="10" fill={coverPageProps.patternColor} />
        <circle cx="50" cy="130" r="10" fill={coverPageProps.patternColor} />
      </svg>
    );
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: coverPageProps.outerBgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background Particles */}
      {coverPageProps.showEffect && particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            color: coverPageProps.effectColor,
            opacity: 0.6,
            animation: `floatUp ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
            pointerEvents: 'none',
          }}
        >
          {renderParticleContent()}
        </div>
      ))}

      {/* Card Wrapper (to hold patterns outside overflow:hidden) */}
      <div
        style={{
          position: 'relative',
          width: '90%',
          maxWidth: '400px',
          minHeight: '65%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'stretch',
          zIndex: 10,
        }}
      >


        {/* Ghost Patterns (outside overflow:hidden, only appear when opening) */}
        {isOpening && coverPageProps.showPattern && (
          <>
            <div style={{ 
              position: 'absolute', left: '-32%', top: '-10%', width: '76%', height: '59%', 
              pointerEvents: 'none',
              zIndex: 20, 
              animation: `ghostZoomLeft 1.2s ease-out forwards`,
            }}>
              {getPatternIcon()}
            </div>
            <div style={{ 
              position: 'absolute', right: '-27%', bottom: '-10%', width: '75%', height: '63%', 
              pointerEvents: 'none',
              zIndex: 20,
              animation: `ghostZoomRight 1.2s ease-out forwards`,
            }}>
              {getPatternIcon()}
            </div>
          </>
        )}

        {/* Main Card */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            backgroundColor: coverPageProps.bgColor,
            borderRadius: '24px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '40px 20px',
            overflow: 'hidden',
            zIndex: 10,
            transition: 'transform 1.5s ease-in, opacity 1.5s ease-in',
            transform: isOpening ? 'translateY(-150vh)' : 'translateY(0)',
            opacity: isOpening ? 0 : 1,
          }}
        >


        {/* Top Left Pattern (Static, inside card) */}
        {coverPageProps.showPattern && (
          <div style={{ 
            position: 'absolute', left: '-32%', top: '-10%', width: '76%', height: '59%', 
            opacity: coverPageProps.patternOpacity / 100, 
            transform: 'rotate(35deg)', 
            pointerEvents: 'none',
            zIndex: 20, // on top of other content
          }}>
            {getPatternIcon()}
          </div>
        )}
        
        {/* Bottom Right Pattern (Static, inside card) */}
        {coverPageProps.showPattern && (
          <div style={{ 
            position: 'absolute', right: '-27%', bottom: '-10%', width: '75%', height: '63%', 
            opacity: coverPageProps.patternOpacity / 100, 
            transform: 'scaleX(-1) rotate(-47deg)', 
            pointerEvents: 'none',
            zIndex: 20, // on top of other content
          }}>
            {getPatternIcon()}
          </div>
        )}

        {/* Top Badge */}
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #f0d497, rgb(210, 182, 121))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: '#CC1111',
            boxShadow: '0 4px 20px rgba(240, 212, 151, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
            marginBottom: '20px',
            zIndex: 30,
            animation: 'seal-pulse 2s ease-in-out infinite',
            // @ts-expect-error custom css variable
            '--shadow-color': 'rgba(240, 212, 151, 0.5)',
          }}
        >
          囍
        </div>

        {/* Names */}
        <div style={{ textAlign: 'center', zIndex: 2 }}>
          <h2 style={{
            fontFamily: coverPageProps.nameFontFamily,
            fontSize: `${coverPageProps.nameFontSize}px`,
            color: coverPageProps.nameColor,
            margin: '0 0 5px 0',
            fontWeight: 'normal',
          }}>
            {coverPageProps.groomName}
          </h2>
          <div style={{ fontFamily: coverPageProps.nameFontFamily, fontSize: `${coverPageProps.nameFontSize * 0.4}px`, color: coverPageProps.nameColor, margin: '0' }}>
            &
          </div>
          <h2 style={{
            fontFamily: coverPageProps.nameFontFamily,
            fontSize: `${coverPageProps.nameFontSize}px`,
            color: coverPageProps.nameColor,
            margin: '5px 0 0 0',
            fontWeight: 'normal',
          }}>
            {coverPageProps.brideName}
          </h2>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '25px 0', zIndex: 2 }}>
          <div style={{ width: '40px', height: '1px', backgroundColor: coverPageProps.dateColor, opacity: 0.5 }} />
          <span style={{ color: coverPageProps.dateColor, fontSize: '14px' }}>❦</span>
          <div style={{ width: '40px', height: '1px', backgroundColor: coverPageProps.dateColor, opacity: 0.5 }} />
        </div>

        {/* Date & Subtext */}
        <div style={{ textAlign: 'center', zIndex: 2, flex: 1 }}>
          <p style={{
            fontFamily: coverPageProps.dateFontFamily,
            fontSize: `${coverPageProps.dateFontSize}px`,
            color: coverPageProps.dateColor,
            margin: '0 0 10px 0',
          }}>
            {coverPageProps.date}
          </p>
          <p style={{
            fontFamily: coverPageProps.dateFontFamily,
            fontSize: `${coverPageProps.dateFontSize * 0.9}px`,
            color: coverPageProps.dateColor,
            margin: '0',
          }}>
            Thân Mời
          </p>
        </div>

        {/* Open Button */}
        <button
          onClick={handleOpen}
          style={{
            padding: '12px 32px',
            backgroundColor: coverPageProps.buttonBgColor,
            color: coverPageProps.buttonTextColor,
            borderRadius: `${coverPageProps.buttonBorderRadius}px`,
            border: 'none',
            fontSize: '18px',
            fontFamily: 'Lora, serif',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(240, 212, 151, 0.35)',
            zIndex: 2,
            transition: 'transform 0.2s',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {coverPageProps.buttonLabel}
          <div style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            animation: 'shine 3s ease-in-out infinite',
            position: 'absolute',
            top: 0,
            height: '100%',
            width: '2rem',
            pointerEvents: 'none'
          }}></div>
        </button>
        </div>
      </div>
      
      {/* Fireworks Explosion (Behind Card) */}
      {isOpening && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 5, pointerEvents: 'none' }}>
          {Array.from({ length: 25 }).map((_, i) => {
            const angle = (i / 25) * Math.PI * 2;
            const velocity = 80 + Math.random() * 200; // px distance
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity + 100; // slightly downwards bias
            const rot = Math.random() * 720 - 360;
            const delay = Math.random() * 0.2;
            const size = 20 + Math.random() * 30;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  color: ['#f43f5e', '#fbbf24', '#f87171', '#fcd34d'][Math.floor(Math.random() * 4)],
                  fontSize: `${size}px`,
                  fontWeight: 'bold',
                  textShadow: '0 0 10px rgba(255,255,255,0.5)',
                  animation: `firework-${i} 1.5s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s forwards`,
                  opacity: 0,
                  transform: 'translate(0, 0) scale(0.5)'
                }}
              >
                囍
                <style>{`
                  @keyframes firework-${i} {
                    0% { transform: translate(0, 0) scale(0.5) rotate(0deg); opacity: 1; }
                    50% { opacity: 1; }
                    100% { transform: translate(${tx}px, ${ty}px) scale(1.5) rotate(${rot}deg); opacity: 0; }
                  }
                `}</style>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes ghostZoomLeft {
          0% { transform: scale(1) rotate(35deg); opacity: ${coverPageProps.patternOpacity / 100}; }
          100% { transform: scale(4) rotate(35deg); opacity: 0; }
        }
        @keyframes ghostZoomRight {
          0% { transform: scaleX(-1) scale(1) rotate(-47deg); opacity: ${coverPageProps.patternOpacity / 100}; }
          100% { transform: scaleX(-1) scale(4) rotate(-47deg); opacity: 0; }
        }
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-1200px) rotate(360deg); opacity: 0; }
        }
        @keyframes shine {
          0% { left: -100px; }
          20% { left: 100%; }
          100% { left: 100%; }
        }
        @keyframes seal-pulse {
          0% { box-shadow: 0 4px 20px var(--shadow-color), inset 0 2px 4px rgba(255, 255, 255, 0.3); transform: scale(1); }
          50% { box-shadow: 0 4px 30px var(--shadow-color), inset 0 2px 4px rgba(255, 255, 255, 0.5); transform: scale(1.05); }
          100% { box-shadow: 0 4px 20px var(--shadow-color), inset 0 2px 4px rgba(255, 255, 255, 0.3); transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
