// ============================================================
// MAIN CANVAS COMPONENT
// ============================================================

import { useRef, useCallback, useEffect, useMemo } from 'react';
import '../styles/Canvas.css';
import { useEditorStore } from '../store/editorStore';
import { DEFAULT_ANIMATION_PROPS } from '../store/editorStore';
import type { CanvasElement } from '../types/editor.types';
import { TextEditorElement } from './TextEditorElement';
import { ImageEditorElement } from './ImageEditorElement';
import { ShapeEditorElement } from './ShapeEditorElement';

// ── SVG Icons ─────────────────────────────────────────────
const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);
const LayerUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 11 12 6 7 11" /><polyline points="17 18 12 13 7 18" />
  </svg>
);
const LayerDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="7 13 12 18 17 13" /><polyline points="7 6 12 11 17 6" />
  </svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const MinusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const FitIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
  </svg>
);

// ── Draggable Element ──────────────────────────────────────
interface DraggableElementProps {
  element: CanvasElement;
  zoom: number;
}

function DraggableElement({ element, zoom }: DraggableElementProps) {
  const {
    selectElement,
    deleteElement,
    duplicateElement,
    updateElementPosition,
    updateElementSize,
    updateElementRotation,
    bringElementForward,
    sendElementBackward,
    selectedElement,
    pushHistory,
    animationPreviewTick,
  } = useEditorStore();



  // Persist drag state without triggering re-render
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, origX: 0, origY: 0 });
  const elementRef = useRef<HTMLDivElement>(null);
  const isSelected = selectedElement?.id === element.id;
  const ap = element.animationProps ?? DEFAULT_ANIMATION_PROPS;

  // ── Loop animation CSS class ─────────────────────────────
  const loopClass = useMemo(() => {
    if (!ap.loopEnabled || ap.loopEffect === 'none') return '';
    switch (ap.loopEffect) {
      case 'bay-lo-lung':       return 'animate-bay-lo-lung';
      case 'nay':               return 'animate-nay';
      case 'nhap-nhay':         return 'animate-nhap-nhay';
      case 'xoay-tron':         return 'animate-xoay-tron';
      case 'lac':               return 'animate-lac';
      case 'lac-lu':            return 'animate-lac-lu';
      case 'lac-lu-nhun-nhay':  return 'animate-lac-lu-nhun-nhay';
      default: return '';
    }
  }, [ap.loopEnabled, ap.loopEffect]);

  // ── Entry animation via IntersectionObserver ─────────────
  useEffect(() => {
    const el = elementRef.current;
    if (!el || !ap.entryEnabled || ap.entryEffect === 'none') return;

    const applyEntry = () => {
      el.style.animationDuration = `${ap.entryDuration}s`;
      el.style.animationDelay = `${ap.entryDelay}s`;
      el.style.animationTimingFunction = ap.entryEasing;
      // Remove first to re-trigger
      el.classList.remove('animate__animated', `animate__${ap.entryEffect}`);
      void el.offsetHeight; // reflow
      el.classList.add('animate__animated', `animate__${ap.entryEffect}`);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            applyEntry();
          } else {
            // Remove so it re-triggers on next scroll in
            el.classList.remove('animate__animated', `animate__${ap.entryEffect}`);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      el.classList.remove('animate__animated', `animate__${ap.entryEffect}`);
    };
  }, [ap.entryEnabled, ap.entryEffect, ap.entryDuration, ap.entryDelay, ap.entryEasing, animationPreviewTick]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('.canvas-el-ctrl-btn, .canvas-handle')) return;
      e.preventDefault();
      e.stopPropagation();
      selectElement(element.id);
      const scale = zoom / 100;
      dragRef.current = {
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        origX: element.x,
        origY: element.y,
      };

      const handleMouseMove = (me: MouseEvent) => {
        if (!dragRef.current.isDragging) return;
        const dx = (me.clientX - dragRef.current.startX) / scale;
        const dy = (me.clientY - dragRef.current.startY) / scale;
        updateElementPosition(element.id, dragRef.current.origX + dx, dragRef.current.origY + dy);
      };
      const handleMouseUp = () => {
        if (dragRef.current.isDragging) {
          dragRef.current.isDragging = false;
          pushHistory();
        }
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [element.id, element.x, element.y, zoom, selectElement, updateElementPosition, pushHistory]
  );

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, handle: string) => {
      e.preventDefault();
      e.stopPropagation();

      const scale = zoom / 100;
      const startX = e.clientX;
      const startY = e.clientY;
      const origW = element.width;
      const origH = element.height;
      const origX = element.x;
      const origY = element.y;
      const rotDeg = element.rotation || 0;
      const rad = (rotDeg * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);

      // Center of the original element
      const cx = origX + origW / 2;
      const cy = origY + origH / 2;

      // Find the opposite corner (which stays fixed) in local space coordinates
      let localOppositeX = 0;
      let localOppositeY = 0;
      if (handle.includes('t')) localOppositeY = origH / 2;
      if (handle.includes('b')) localOppositeY = -origH / 2;
      if (handle.includes('l')) localOppositeX = origW / 2;
      if (handle.includes('r')) localOppositeX = -origW / 2;

      // Calculate global coordinates of the fixed opposite corner
      const fixedX = cx + (localOppositeX * cos - localOppositeY * sin);
      const fixedY = cy + (localOppositeX * sin + localOppositeY * cos);

      const handleMouseMove = (me: MouseEvent) => {
        const dx = (me.clientX - startX) / scale;
        const dy = (me.clientY - startY) / scale;

        // Project raw mouse delta onto the element's rotated local axes
        const localDx = dx * cos + dy * sin;
        const localDy = -dx * sin + dy * cos;

        let newW = origW;
        let newH = origH;

        if (handle.includes('r')) {
          newW = Math.max(15, origW + localDx);
        } else if (handle.includes('l')) {
          newW = Math.max(15, origW - localDx);
        }

        if (handle.includes('b')) {
          newH = Math.max(15, origH + localDy);
        } else if (handle.includes('t')) {
          newH = Math.max(15, origH - localDy);
        }

        // Apply aspect ratio lock if configured (e.g. for locked images)
        const isAspectLocked = element.type === 'image' && element.imageProps?.lockAspectRatio;
        if (isAspectLocked) {
          const ratio = origW / origH;
          if (handle === 'tr' || handle === 'bl' || handle === 'tl' || handle === 'br') {
            if (newW / ratio > newH) {
              newH = newW / ratio;
            } else {
              newW = newH * ratio;
            }
          }
        }

        // Compute new center relative to the fixed opposite corner
        let newLocalOppositeX = 0;
        let newLocalOppositeY = 0;
        if (handle.includes('t')) newLocalOppositeY = newH / 2;
        if (handle.includes('b')) newLocalOppositeY = -newH / 2;
        if (handle.includes('l')) newLocalOppositeX = newW / 2;
        if (handle.includes('r')) newLocalOppositeX = -newW / 2;

        const newCx = fixedX - (newLocalOppositeX * cos - newLocalOppositeY * sin);
        const newCy = fixedY - (newLocalOppositeX * sin + newLocalOppositeY * cos);

        const newX = newCx - newW / 2;
        const newY = newCy - newH / 2;

        updateElementPosition(element.id, newX, newY);
        updateElementSize(element.id, newW, newH);
      };

      const handleMouseUp = () => {
        pushHistory();
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [element, zoom, updateElementPosition, updateElementSize, pushHistory]
  );

  const handleRotateMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const el = document.querySelector(`[data-element-id="${element.id}"]`);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const handleMouseMove = (me: MouseEvent) => {
        const dx = me.clientX - cx;
        const dy = me.clientY - cy;
        // atan2 returns angle in radians, subtract 90 degrees since handle is positioned on top of element
        const angleRad = Math.atan2(dy, dx);
        let angleDeg = (angleRad * 180) / Math.PI - 90;
        if (angleDeg < 0) angleDeg += 360;
        angleDeg = Math.round(angleDeg);

        updateElementRotation(element.id, angleDeg);
      };

      const handleMouseUp = () => {
        pushHistory();
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [element.id, updateElementRotation, pushHistory]
  );


  const entryWrapperStyle: React.CSSProperties = {
    position: 'absolute',
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    zIndex: element.zIndex,
    pointerEvents: 'none',
  };

  const innerWrapperStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    pointerEvents: 'auto',
    transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
    // Loop animation CSS variables
    ...(ap.loopEnabled && ap.loopEffect !== 'none' ? {
      '--anim-dur': `${ap.loopDuration}s`,
      '--anim-delay': `${ap.loopDelay}s`,
    } as React.CSSProperties : {}),
  };

  return (
    <div
      ref={elementRef}
      className={`canvas-element-entry`}
      style={entryWrapperStyle}
    >
      <div
        className={`canvas-element ${isSelected ? 'selected' : ''} ${loopClass}`}
        style={innerWrapperStyle}
        onMouseDown={handleMouseDown}
        data-element-id={element.id}
      >
      {/* Selection border overlay */}
      <div className="canvas-el-border" />

      {/* ── Delegate content rendering by type ── */}
      {element.type === 'text' && (
        <TextEditorElement element={element} zoom={zoom} />
      )}
      {element.type === 'image' && (
        <ImageEditorElement element={element} zoom={zoom} />
      )}
      {element.type === 'shape' && (
        <ShapeEditorElement element={element} zoom={zoom} />
      )}

      {/* Controls – visible only when selected */}
      {isSelected && (
        <>
          {/* Top controls bar */}
          <div
            className="canvas-el-controls"
            onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
          >
            <button
              className="canvas-el-ctrl-btn"
              title="Đưa lên trên"
              onClick={(e) => { e.stopPropagation(); console.log("hihih"); bringElementForward(element.id); }}
            >
              <LayerUpIcon />
            </button>
            <button
              className="canvas-el-ctrl-btn"
              title="Đưa xuống dưới"
              onClick={(e) => { e.stopPropagation(); sendElementBackward(element.id); }}
            >
              <LayerDownIcon />
            </button>

            <button
              className="canvas-el-ctrl-btn"
              title="Khóa"
              onClick={(e) => e.stopPropagation()}
            >
              <LockIcon />
            </button>
            <button
              className="canvas-el-ctrl-btn"
              title="Nhân bản"
              onClick={(e) => { e.stopPropagation(); duplicateElement(element.id); }}
            >
              <CopyIcon />
            </button>
            <button
              className="canvas-el-ctrl-btn danger"
              title="Xóa"
              onClick={(e) => { e.stopPropagation(); deleteElement(element.id); }}
            >
              <TrashIcon />
            </button>
          </div>


          {/* Resize handles */}
          <div className="canvas-handle tl" onMouseDown={(e) => handleResizeMouseDown(e, 'tl')} />
          <div className="canvas-handle tr" onMouseDown={(e) => handleResizeMouseDown(e, 'tr')} />
          <div className="canvas-handle bl" onMouseDown={(e) => handleResizeMouseDown(e, 'bl')} />
          <div className="canvas-handle br" onMouseDown={(e) => handleResizeMouseDown(e, 'br')} />
          <div className="canvas-handle tm" onMouseDown={(e) => handleResizeMouseDown(e, 'tm')} />
          <div className="canvas-handle bm" onMouseDown={(e) => handleResizeMouseDown(e, 'bm')} />
          <div className="canvas-handle ml" onMouseDown={(e) => handleResizeMouseDown(e, 'ml')} />
          <div className="canvas-handle mr" onMouseDown={(e) => handleResizeMouseDown(e, 'mr')} />
          <div className="canvas-handle rotate" onMouseDown={handleRotateMouseDown} />
        </>
      )}

      </div>
    </div>
  );
}

// ── Main Canvas ────────────────────────────────────────────
export function MainCanvas() {
  const {
    elements,
    zoom,
    setZoom,
    showGrid,
    toggleGrid,
    canvasHeight,
    setCanvasSize,
    selectElement,
    undo,
    redo,
    addImageElement,
    canvasBackground,
  } = useEditorStore();
  const canvasRef = useRef<HTMLDivElement>(null!);
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key === 'Escape') selectElement(null);
      if (e.ctrlKey && e.key === '=') { e.preventDefault(); setZoom(zoom + 10); }
      if (e.ctrlKey && e.key === '-') { e.preventDefault(); setZoom(zoom - 10); }
      if (e.ctrlKey && e.key === '0') { e.preventDefault(); setZoom(100); }

      if (e.ctrlKey && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (e.ctrlKey && (e.key === 'y' || e.key === 'Y' || (e.shiftKey && (e.key === 'z' || e.key === 'Z')))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoom, setZoom, selectElement, undo, redo]);

  const scale = zoom / 100;

  const handleHeightDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startY = e.clientY;
    const startHeight = canvasHeight;

    const handleMouseMove = (me: MouseEvent) => {
      const dy = (me.clientY - startY) / scale;
      const newHeight = Math.max(200, Math.round(startHeight + dy));
      setCanvasSize(500, newHeight);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [canvasHeight, scale, setCanvasSize]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // Drop file from local computer
      Array.from(files).forEach((file) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const src = ev.target?.result as string;
          if (src) {
            let posX = 50;
            let posY = 50;
            if (canvasRef.current) {
              const rect = canvasRef.current.getBoundingClientRect();
              posX = (e.clientX - rect.left) / scale - 120;
              posY = (e.clientY - rect.top) / scale - 150;
            }
            addImageElement(src, file.name, posX, posY);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      // Drop image thumbnail from LeftToolbar
      const src = e.dataTransfer.getData('text/plain');
      const name = e.dataTransfer.getData('image-name') || 'Hình ảnh';
      if (src) {
        let posX = 50;
        let posY = 50;
        if (canvasRef.current) {
          const rect = canvasRef.current.getBoundingClientRect();
          posX = (e.clientX - rect.left) / scale - 120;
          posY = (e.clientY - rect.top) / scale - 150;
        }
        addImageElement(src, name, posX, posY);
      }
    }
  }, [scale, addImageElement]);


  return (
    <div className="editor-canvas-area">
      {/* Top-left Canvas Controls */}
      <div className="canvas-controls-top">
        {/* Removed width/height popup as requested, width is now fixed to 500px */}
        <button
          id="btn-toggle-grid"
          className={`canvas-ctrl-btn ${showGrid ? 'active' : ''}`}
          onClick={toggleGrid}
          title="Bật/Tắt lưới"
        >
          <GridIcon />
          Lưới
        </button>
      </div>

      {/* Canvas Workspace */}
      <div
        className="canvas-workspace"
        onClick={() => selectElement(null)}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >

        <div
          className="canvas-scale-wrapper"
          style={{
            transform: `scale(${scale})`,
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transformOrigin: 'top center',
            paddingBottom: '60px' // Space for the pill
          }}
        >
          <div
            className="canvas-frame"
            ref={canvasRef}
            style={{
              width: 500, // Hardcoded width as requested
              height: canvasHeight,
              margin: 0,
              ...(canvasBackground.type === 'solid' && { backgroundColor: canvasBackground.color }),
              ...(canvasBackground.type === 'gradient' && { backgroundImage: `linear-gradient(${canvasBackground.gradientAngle}deg, ${canvasBackground.gradientFrom}, ${canvasBackground.gradientTo})` }),
              ...(canvasBackground.type === 'image' && { backgroundImage: `url(${canvasBackground.imageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: canvasBackground.imageOpacity }),
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grid overlay */}
            {showGrid && <div className="canvas-grid" />}

            {/* ── Element list – dispatched by type ── */}
            {[...elements]
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((el) => (
                <DraggableElement key={el.id} element={el} zoom={zoom} />
              ))}

            {/* Empty state hint */}
            {elements.length === 0 && (
              <div className="canvas-empty-hint">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
                </svg>
                <p>Chọn công cụ ở bên trái để bắt đầu thiết kế</p>
              </div>
            )}

            {/* Bottom drag handle */}
            <div className="canvas-bottom-resize-area" onMouseDown={handleHeightDrag}>
              <div className="canvas-bottom-resize-line" />
            </div>
          </div>

          {/* Height Pill UI */}
          <div className="canvas-height-pill" onClick={(e) => e.stopPropagation()}>
            <button 
              className="canvas-height-pill-btn" 
              onClick={() => setCanvasSize(500, Math.max(200, canvasHeight - 10))}
            >
              <MinusIcon />
            </button>
            <input 
              type="number" 
              className="canvas-height-pill-input"
              value={canvasHeight}
              onChange={(e) => setCanvasSize(500, Math.max(200, parseInt(e.target.value) || 200))}
            />
            <span style={{ fontSize: '12px', color: 'var(--ed-text-secondary)', marginRight: '4px' }}>px</span>
            <button 
              className="canvas-height-pill-btn" 
              onClick={() => setCanvasSize(500, canvasHeight + 10)}
            >
              <PlusIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Zoom Controls – bottom right */}
      <div className="canvas-zoom-controls">
        <button id="btn-zoom-in" className="canvas-zoom-btn" onClick={() => setZoom(zoom + 10)} title="Phóng to">
          <PlusIcon />
        </button>
        <div className="canvas-zoom-display">{zoom}%</div>
        <button id="btn-zoom-out" className="canvas-zoom-btn" onClick={() => setZoom(zoom - 10)} title="Thu nhỏ">
          <MinusIcon />
        </button>
        <button id="btn-zoom-fit" className="canvas-zoom-btn" onClick={() => setZoom(100)} title="Vừa màn hình" style={{ marginTop: 2 }}>
          <FitIcon />
        </button>
      </div>
    </div>
  );
}
