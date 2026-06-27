// ============================================================
// MAIN CANVAS COMPONENT
// ============================================================

import { useRef, useCallback, useEffect } from 'react';
import '../styles/Canvas.css';
import { useEditorStore } from '../store/editorStore';
import type { CanvasElement } from '../types/editor.types';

// ── SVG Icons ─────────────────────────────────────────────
const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);
const SizeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 3v4" /><path d="M17 3v4" /><path d="M3 7h4" /><path d="M3 17h4" />
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
  const { selectElement, deleteElement, duplicateElement, updateElementPosition, selectedElement, pushHistory } =
    useEditorStore();
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, origX: 0, origY: 0 });
  const isSelected = selectedElement?.id === element.id;

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

  const textProps = element.textProps;

  const style: React.CSSProperties = {
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    zIndex: element.zIndex + (isSelected ? 100 : 0),
  };

  const textStyle: React.CSSProperties = textProps
    ? {
        fontFamily: textProps.fontFamily,
        fontSize: textProps.fontSize,
        fontWeight: textProps.fontWeight,
        fontStyle: textProps.fontStyle,
        textDecoration: textProps.textDecoration,
        textAlign: textProps.textAlign,
        color: textProps.color,
        backgroundColor: textProps.backgroundColor === 'transparent' ? undefined : textProps.backgroundColor,
        opacity: textProps.opacity,
        padding: `${textProps.paddingTop}px ${textProps.paddingRight}px ${textProps.paddingBottom}px ${textProps.paddingLeft}px`,
        border: textProps.borderWidth > 0 ? `${textProps.borderWidth}px solid ${textProps.borderColor}` : undefined,
        borderRadius: textProps.borderRadius,
        boxShadow: textProps.shadowBlur > 0 ? `${textProps.shadowX}px ${textProps.shadowY}px ${textProps.shadowBlur}px ${textProps.shadowColor}` : undefined,
        letterSpacing: textProps.letterSpacing,
        lineHeight: textProps.lineHeight,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: textProps.textAlign === 'center' ? 'center' : textProps.textAlign === 'right' ? 'flex-end' : 'flex-start',
        overflow: 'hidden',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
      }
    : {};

  return (
    <div
      className={`canvas-element ${isSelected ? 'selected' : ''}`}
      style={style}
      onMouseDown={handleMouseDown}
    >
      {/* Selection border */}
      <div className="canvas-el-border" />

      {/* Content */}
      {element.type === 'text' && textProps && (
        <div className="canvas-text-el" style={textStyle}>
          {textProps.content}
        </div>
      )}

      {/* Controls (visible when selected) */}
      {isSelected && (
        <>
          {/* Top controls bar */}
          <div className="canvas-el-controls">
            <button className="canvas-el-ctrl-btn" title="Đưa lên trên" onClick={(e) => e.stopPropagation()}>
              <LayerUpIcon />
            </button>
            <button className="canvas-el-ctrl-btn" title="Đưa xuống dưới" onClick={(e) => e.stopPropagation()}>
              <LayerDownIcon />
            </button>
            <button className="canvas-el-ctrl-btn" title="Khóa" onClick={(e) => e.stopPropagation()}>
              <LockIcon />
            </button>
            <button className="canvas-el-ctrl-btn" title="Nhân bản" onClick={(e) => { e.stopPropagation(); duplicateElement(element.id); }}>
              <CopyIcon />
            </button>
            <button className="canvas-el-ctrl-btn danger" title="Xóa" onClick={(e) => { e.stopPropagation(); deleteElement(element.id); }}>
              <TrashIcon />
            </button>
          </div>

          {/* Resize handles */}
          <div className="canvas-handle tl" onMouseDown={(e) => e.stopPropagation()} />
          <div className="canvas-handle tr" onMouseDown={(e) => e.stopPropagation()} />
          <div className="canvas-handle bl" onMouseDown={(e) => e.stopPropagation()} />
          <div className="canvas-handle br" onMouseDown={(e) => e.stopPropagation()} />
          <div className="canvas-handle tm" onMouseDown={(e) => e.stopPropagation()} />
          <div className="canvas-handle bm" onMouseDown={(e) => e.stopPropagation()} />
          <div className="canvas-handle ml" onMouseDown={(e) => e.stopPropagation()} />
          <div className="canvas-handle mr" onMouseDown={(e) => e.stopPropagation()} />
          <div className="canvas-handle rotate" onMouseDown={(e) => e.stopPropagation()} />
        </>
      )}
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
    canvasWidth,
    canvasHeight,
    selectElement,
    undo,
    redo,
  } = useEditorStore();
  const canvasRef = useRef<HTMLDivElement>(null!);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key === 'Escape') selectElement(null);
      if (e.ctrlKey && e.key === '=') { e.preventDefault(); setZoom(zoom + 10); }
      if (e.ctrlKey && e.key === '-') { e.preventDefault(); setZoom(zoom - 10); }
      if (e.ctrlKey && e.key === '0') { e.preventDefault(); setZoom(100); }

      // Ctrl + Z (Undo)
      if (e.ctrlKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        undo();
      }

      // Ctrl + Y or Ctrl + Shift + Z (Redo)
      if (e.ctrlKey && (e.key === 'y' || e.key === 'Y' || (e.shiftKey && (e.key === 'z' || e.key === 'Z')))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoom, setZoom, selectElement, undo, redo]);

  const scale = zoom / 100;

  return (
    <div className="editor-canvas-area">
      {/* Top-left Canvas Controls */}
      <div className="canvas-controls-top">
        <button
          id="btn-canvas-size"
          className="canvas-ctrl-btn"
          title="Kích thước canvas"
        >
          <SizeIcon />
          {canvasWidth} × {canvasHeight}
        </button>
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
      >
        <div
          className="canvas-frame"
          ref={canvasRef}
          style={{
            width: canvasWidth,
            height: canvasHeight,
            transform: `scale(${scale})`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Grid */}
          {showGrid && <div className="canvas-grid" />}

          {/* Elements */}
          {elements.map((el) => (
            <DraggableElement key={el.id} element={el} zoom={zoom} />
          ))}

          {/* Empty hint */}
          {elements.length === 0 && (
            <div className="canvas-empty-hint">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
              </svg>
              <p>Chọn công cụ ở bên trái để bắt đầu thiết kế</p>
            </div>
          )}
        </div>
      </div>

      {/* Zoom Controls - bottom right */}
      <div className="canvas-zoom-controls">
        <button
          id="btn-zoom-in"
          className="canvas-zoom-btn"
          onClick={() => setZoom(zoom + 10)}
          title="Phóng to"
        >
          <PlusIcon />
        </button>
        <div className="canvas-zoom-display">{zoom}%</div>
        <button
          id="btn-zoom-out"
          className="canvas-zoom-btn"
          onClick={() => setZoom(zoom - 10)}
          title="Thu nhỏ"
        >
          <MinusIcon />
        </button>
        <button
          id="btn-zoom-fit"
          className="canvas-zoom-btn"
          onClick={() => setZoom(100)}
          title="Vừa màn hình"
          style={{ marginTop: 2 }}
        >
          <FitIcon />
        </button>
      </div>
    </div>
  );
}
