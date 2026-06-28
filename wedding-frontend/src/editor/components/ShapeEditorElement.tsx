import React from 'react';
import type { CanvasElement } from '../types/editor.types';

interface ShapeEditorElementProps {
  element: CanvasElement;
  zoom: number;
}

export function ShapeEditorElement({ element }: ShapeEditorElementProps) {
  const sp = element.shapeProps;
  if (!sp) return null;

  const {
    shapeType,
    fillType = 'solid',
    fillColor,
    gradientFrom = '#ffffff',
    gradientTo = '#000000',
    gradientAngle = 90,
    opacity,
    borderStyle,
    borderColor,
    borderWidth,
    borderRadiusTopLeft,
    borderRadiusTopRight,
    borderRadiusBottomLeft,
    borderRadiusBottomRight,
    shadowEnabled,
    shadowX,
    shadowY,
    shadowBlur,
    shadowColor,
  } = sp;

  // Filter for shadow (used in SVG drop-shadow or CSS box-shadow)
  const shadowValue = shadowEnabled
    ? `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowColor}`
    : 'none';

  // Background style
  const backgroundStyle = fillType === 'gradient' 
    ? { background: `linear-gradient(${gradientAngle}deg, ${gradientFrom}, ${gradientTo})` }
    : { backgroundColor: fillColor };

  // Common container style for DIV-based shapes
  const divStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    ...backgroundStyle,
    opacity: opacity,
    border: borderWidth > 0 ? `${borderWidth}px ${borderStyle} ${borderColor}` : 'none',
    boxSizing: 'border-box',
    boxShadow: shadowValue,
  };

  // SVG Gradient helpers
  const gradId = `shape-grad-${element.id}`;
  const angleRad = (gradientAngle - 90) * (Math.PI / 180);
  const x1 = Math.round(50 + Math.cos(angleRad + Math.PI) * 50) + '%';
  const y1 = Math.round(50 + Math.sin(angleRad + Math.PI) * 50) + '%';
  const x2 = Math.round(50 + Math.cos(angleRad) * 50) + '%';
  const y2 = Math.round(50 + Math.sin(angleRad) * 50) + '%';
  
  const defs = fillType === 'gradient' && (
    <defs>
      <linearGradient id={gradId} x1={x1} y1={y1} x2={x2} y2={y2}>
        <stop offset="0%" stopColor={gradientFrom} />
        <stop offset="100%" stopColor={gradientTo} />
      </linearGradient>
    </defs>
  );

  const svgFill = fillType === 'gradient' ? `url(#${gradId})` : fillColor;



  if (shapeType === 'square' || shapeType === 'rectangle') {
    return (
      <div
        style={{
          ...divStyle,
          borderTopLeftRadius: borderRadiusTopLeft,
          borderTopRightRadius: borderRadiusTopRight,
          borderBottomLeftRadius: borderRadiusBottomLeft,
          borderBottomRightRadius: borderRadiusBottomRight,
        }}
      />
    );
  }

  if (shapeType === 'circle') {
    return (
      <div
        style={{
          ...divStyle,
          borderRadius: '50%',
        }}
      />
    );
  }

  if (shapeType === 'line') {
    return (
      <div style={{ width: '100%', height: '100%', opacity, filter: shadowEnabled ? `drop-shadow(${shadowValue})` : 'none' }}>
        <svg width="100%" height="100%" style={{ display: 'block' }}>
          {defs}
          <line
            x1="0"
            y1="50%"
            x2="100%"
            y2="50%"
            stroke={svgFill}
            strokeWidth={element.height} // Line width equals element height
            strokeDasharray={
              borderStyle === 'dashed' ? '8,8' :
              borderStyle === 'dotted' ? '2,4' : 'none'
            }
          />
        </svg>
      </div>
    );
  }

  if (shapeType === 'triangle') {
    return (
      <div style={{ width: '100%', height: '100%', opacity }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible', filter: shadowEnabled ? `drop-shadow(${shadowValue})` : 'none' }}>
          {defs}
          <polygon
            points="50,0 100,100 0,100"
            fill={svgFill}
            stroke={borderWidth > 0 ? borderColor : 'none'}
            strokeWidth={borderWidth}
            strokeDasharray={
              borderStyle === 'dashed' ? '8,8' :
              borderStyle === 'dotted' ? '2,4' : 'none'
            }
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    );
  }

  return null;
}
