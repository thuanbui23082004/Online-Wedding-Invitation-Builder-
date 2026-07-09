import React, { useEffect, useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import { CardRenderer } from './CardRenderer';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PreviewModal({ isOpen, onClose }: PreviewModalProps) {
  const { elements, canvasBackground, canvasWidth, canvasHeight, cardId, autoScroll, autoScrollSpeed } = useEditorStore();
  const [windowSize, setWindowSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [containerWidth, setContainerWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const innerContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Auto-scroll logic (Super Smooth Implementation)
  useEffect(() => {
    if (!autoScroll || !containerRef.current || !isOpen || isHovered) {
      if (innerContainerRef.current) {
        innerContainerRef.current.style.transform = `translateY(0px)`;
      }
      return;
    }

    const container = containerRef.current;
    const innerContainer = innerContainerRef.current;
    let animationFrameId: number;
    let lastTime = performance.now();
    let exactScrollTop = container.scrollTop;

    // Speed mapping: autoScrollSpeed is 10-100.
    // Max speed (100) = ~120px/sec. Min speed (10) = ~12px/sec.
    const pixelsPerSecond = (autoScrollSpeed / 100) * 120;

    const scrollStep = (currentTime: number) => {
      // Prevent massive jumps if tab was inactive
      let deltaTime = (currentTime - lastTime) / 1000;
      if (deltaTime > 0.1) deltaTime = 0.016;
      lastTime = currentTime;

      exactScrollTop += pixelsPerSecond * deltaTime;

      const integerScroll = Math.floor(exactScrollTop);
      const fractionalScroll = exactScrollTop - integerScroll;

      container.scrollTop = integerScroll;

      // Sub-pixel translation for buttery smooth animation
      if (innerContainer) {
        innerContainer.style.transform = `translateY(-${fractionalScroll}px)`;
      }

      // Stop if reached bottom
      if (container.scrollTop + container.clientHeight < container.scrollHeight - 1) {
        animationFrameId = requestAnimationFrame(scrollStep);
      } else if (innerContainer) {
        innerContainer.style.transform = `translateY(0px)`;
      }
    };

    const timeoutId = setTimeout(() => {
      lastTime = performance.now();
      exactScrollTop = container.scrollTop;
      animationFrameId = requestAnimationFrame(scrollStep);
    }, 1500); // Wait 1.5s before starting scroll

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
      if (innerContainerRef.current) {
        innerContainerRef.current.style.transform = `translateY(0px)`;
      }
    };
  }, [isOpen, autoScroll, autoScrollSpeed, isHovered]);

  if (!isOpen) return null;

  const isMobile = windowSize.w < 768;

  // Phone mockup dimensions
  const PHONE_INNER_W = 500;
  const PHONE_INNER_H = 926;

  // Calculate dynamic scale based on the actual measured container width (fixes scrollbar clipping)
  const actualContainerWidth = containerWidth || (isMobile ? windowSize.w - 32 : PHONE_INNER_W);
  const scale = actualContainerWidth / canvasWidth;

  // Scale down the phone mockup if the user's screen is too small
  const phoneFrameH = PHONE_INNER_H + 24;
  const phoneFrameW = PHONE_INNER_W + 24;
  const phoneScale = isMobile ? 1 : Math.min(1, (windowSize.h - 100) / phoneFrameH, (windowSize.w - 40) / phoneFrameW);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/view/${cardId || 'preview'}`;
    navigator.clipboard.writeText(link);
    alert('Đã copy link mời!');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
      onClick={onClose}
    >
      <style>{`
        .preview-scroll-container::-webkit-scrollbar {
          width: 5px;
        }
        .preview-scroll-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .preview-scroll-container::-webkit-scrollbar-thumb {
          background: rgba(235, 76, 76, 0.35);
          border-radius: 9999px;
        }
        .preview-scroll-container::-webkit-scrollbar-thumb:hover {
          background: rgba(235, 76, 76, 0.6);
        }
        .preview-scroll-container {
          scrollbar-width: thin;
          scrollbar-color: rgba(235, 76, 76, 0.35) transparent;
        }
      `}</style>
      <div
        style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
      >
        {isMobile ? (
          // Mobile view: Full screen without phone mockup
          <div
            ref={containerRef}
            className="preview-scroll-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => {
              setTimeout(() => setIsHovered(false), 2000); // Resume 2s after touch ends
            }}
            style={{
              width: windowSize.w - 32,
              height: windowSize.h - 80,
              position: 'relative',
              borderRadius: 8,
              overflowY: 'auto',
              overflowX: 'hidden',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
              backgroundColor: '#fff',
            }}
          >
            <div ref={innerContainerRef} style={{
              width: actualContainerWidth,
              height: canvasHeight * scale,
              position: 'relative',
            }}>
              <div style={{
                width: canvasWidth,
                height: canvasHeight,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                position: 'absolute',
                top: 0,
                left: 0,
              }}>
                <CardRenderer elements={elements} background={canvasBackground} canvasWidth={canvasWidth} />
              </div>
            </div>
          </div>
        ) : (
          // Desktop view: Clean card container (no mockup)
          <div
            ref={containerRef}
            className="preview-scroll-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => {
              setTimeout(() => setIsHovered(false), 2000);
            }}
            style={{
              width: PHONE_INNER_W,
              height: PHONE_INNER_H,
              backgroundColor: '#fff',
              borderRadius: 32,
              overflowY: 'auto',
              overflowX: 'hidden',
              position: 'relative',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              transform: `scale(${phoneScale})`,
              transformOrigin: 'center center',
            }}
          >
            <div ref={innerContainerRef} style={{
              width: actualContainerWidth,
              height: canvasHeight * scale,
              position: 'relative',
            }}>
              <div style={{
                width: canvasWidth,
                height: canvasHeight,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                position: 'absolute',
                top: 0,
                left: 0,
              }}>
                <CardRenderer elements={elements} background={canvasBackground} canvasWidth={canvasWidth} />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
          <button
            onClick={handleCopyLink}
            style={{
              backgroundColor: '#f43f5e',
              color: 'white',
              padding: '10px 20px',
              borderRadius: 9999,
              fontWeight: 600,
              fontSize: 14,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(244, 63, 94, 0.3)',
            }}
          >
            Copy link mời
          </button>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: 9999,
              fontWeight: 600,
              fontSize: 14,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
