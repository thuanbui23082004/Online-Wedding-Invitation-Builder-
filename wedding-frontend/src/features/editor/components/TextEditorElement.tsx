// ============================================================
// TEXT EDITOR ELEMENT
// Renders a text canvas element – extracted from DraggableElement
// ============================================================

import { useState, useEffect, useRef } from 'react';
import type { CanvasElement } from '../types/editor.types';
import { useEditorStore } from '../store/editorStore';

interface TextEditorElementProps {
  element: CanvasElement;
  zoom: number;
}

export function TextEditorElement({ element }: TextEditorElementProps) {
  const tp = element.textProps;
  const { updateTextProp, pushHistory } = useEditorStore();
  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState(tp?.content ?? '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync state when content changes externally
  useEffect(() => {
    if (!isEditing && tp?.content !== undefined) {
      setTempText(tp.content);
    }
  }, [tp?.content, isEditing]);

  // Focus and select the textarea on editing activation
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  if (!tp) return null;

  const style: React.CSSProperties = {
    fontFamily: tp.fontFamily,
    fontSize: tp.fontSize,
    fontWeight: tp.fontWeight,
    fontStyle: tp.fontStyle,
    textDecoration: tp.textDecoration,
    textAlign: tp.textAlign,
    color: tp.color,
    backgroundColor:
      tp.backgroundColor === 'transparent' ? undefined : tp.backgroundColor,
    opacity: tp.opacity,
    padding: `${tp.paddingTop}px ${tp.paddingRight}px ${tp.paddingBottom}px ${tp.paddingLeft}px`,
    border:
      tp.borderWidth > 0
        ? `${tp.borderWidth}px ${tp.borderStyle || 'solid'} ${tp.borderColor}`
        : 'none',
    borderRadius: tp.borderRadius,
    boxShadow:
      tp.shadowBlur > 0
        ? `${tp.shadowX}px ${tp.shadowY}px ${tp.shadowBlur}px ${tp.shadowColor}`
        : undefined,
    letterSpacing: tp.letterSpacing,
    lineHeight: tp.lineHeight,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent:
      tp.textAlign === 'center'
        ? 'center'
        : tp.textAlign === 'right'
          ? 'flex-end'
          : 'flex-start',
    overflow: 'hidden',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
    boxSizing: 'border-box',
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (tempText !== tp.content) {
      updateTextProp(element.id, 'content', tempText);
      pushHistory();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setTempText(tp.content); // Revert changes
    }
  };

  if (isEditing) {
    const textareaStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      fontFamily: tp.fontFamily,
      fontSize: tp.fontSize,
      fontWeight: tp.fontWeight,
      fontStyle: tp.fontStyle,
      textDecoration: tp.textDecoration,
      textAlign: tp.textAlign,
      color: tp.color,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      resize: 'none',
      padding: 0,
      margin: 0,
      lineHeight: tp.lineHeight,
      letterSpacing: tp.letterSpacing,
      boxSizing: 'border-box',
      display: 'block',
      overflow: 'hidden',
    };

    return (
      <div className="canvas-text-el editing" style={style}>
        <textarea
          ref={textareaRef}
          style={textareaStyle}
          value={tempText}
          onChange={(e) => setTempText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onMouseDown={(e) => e.stopPropagation()} // Stop text drag/select propagating to parent canvas element
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  }
  
  const isCurved = tp.textCurve !== undefined && tp.textCurve !== 0;

  if (!isEditing && isCurved) {
    const w = element.width;
    const h = element.height;
    const curve = tp.textCurve || 0;
    
    // Path calculation
    const yMid = h / 2;
    const startY = yMid + curve;
    const endY = yMid + curve;
    const controlY = yMid - curve;
    const pathData = `M 0,${startY} Q ${w / 2},${controlY} ${w},${endY}`;
    const pathId = `text-path-${element.id}`;

    // Text align properties mapping
    let textAnchor: 'inherit' | 'end' | 'start' | 'middle' = 'middle';
    let startOffset = '50%';
    if (tp.textAlign === 'left') {
      textAnchor = 'start';
      startOffset = '0%';
    } else if (tp.textAlign === 'right') {
      textAnchor = 'end';
      startOffset = '100%';
    }

    const lines = tp.content.split('\n');
    const svgTextStyle: React.CSSProperties = {
      fontFamily: tp.fontFamily,
      fontSize: `${tp.fontSize}px`,
      fontWeight: tp.fontWeight,
      fontStyle: tp.fontStyle,
      textDecoration: tp.textDecoration,
      letterSpacing: tp.letterSpacing ? `${tp.letterSpacing}px` : undefined,
    };

    return (
      <div
        className="canvas-text-el"
        style={{
          ...style,
          display: 'block',
          padding: 0,
          overflow: 'visible',
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${w} ${h}`}
          overflow="visible"
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            <path id={pathId} d={pathData} fill="none" stroke="none" />
          </defs>
          {lines.map((line, index) => {
            const dy = (index - (lines.length - 1) / 2) * tp.fontSize * (tp.lineHeight || 1.5);
            return (
              <text
                key={index}
                fill={tp.color}
                style={svgTextStyle}
                transform={`translate(0, ${dy})`}
              >
                <textPath
                  href={`#${pathId}`}
                  startOffset={startOffset}
                  textAnchor={textAnchor}
                  dominantBaseline="middle"
                >
                  {line}
                </textPath>
              </text>
            );
          })}
        </svg>
      </div>
    );
  }

  return (
    <div
      className="canvas-text-el"
      style={style}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
    >
      {tp.content}
    </div>
  );
}
