// ============================================================
// EDITOR TYPES - Central type definitions for the editor
// ============================================================

export type ToolType =
  | 'text'
  | 'image'
  | 'background'
  | 'stock'
  | 'tools'
  | 'music'
  | 'widgets'
  | 'templates'
  | 'effects'
  | 'presets'
  | null;

export type AlignType = 'left' | 'center' | 'right' | 'justify';
export type FontWeightType = 'normal' | 'bold';
export type FontStyleType = 'normal' | 'italic';
export type TextDecorationLine = 'none' | 'underline' | 'line-through';
export type BorderStyleType = 'none' | 'solid' | 'dashed' | 'dotted';
export type PageAlignType = 'left' | 'center' | 'right';

// ── Text Properties ───────────────────────────────────────
export interface TextProperties {
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: FontWeightType;
  fontStyle: FontStyleType;
  textDecoration: TextDecorationLine;
  textAlign: AlignType;
  color: string;
  backgroundColor: string;
  opacity: number;
  // Spacing
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  // Border
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  // Shadow
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowColor: string;
  // Typography
  letterSpacing: number;
  lineHeight: number;
}

export interface ImageCropData {
  x: number;      // percentage (0-100)
  y: number;      // percentage (0-100)
  width: number;  // percentage (0-100)
  height: number; // percentage (0-100)
  shape?: 'rect' | 'circle';
}

// ── Image Properties ──────────────────────────────────────
export interface ImageProperties {
  src: string;
  alt: string;
  opacity: number;
  crop?: ImageCropData;
  // Transform
  isFlippedX: boolean;
  isFlippedY: boolean;
  lockAspectRatio: boolean;
  // Padding
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  // Border
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  borderStyle: BorderStyleType;
  // Shadow (single drop-shadow)
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowColor: string;
  // Fit
  objectFit: 'contain' | 'cover' | 'fill';
}

// ── Shape Properties ──────────────────────────────────────
export type ShapeType = 'line' | 'square' | 'rectangle' | 'circle' | 'triangle';

export interface ShapeProperties {
  shapeType: ShapeType;
  fillType: 'solid' | 'gradient';
  fillColor: string;
  gradientFrom?: string;
  gradientTo?: string;
  gradientAngle?: number;
  opacity: number;
  // Border
  borderStyle: BorderStyleType;
  borderPosition: 'inside' | 'center' | 'outside';
  borderColor: string;
  borderWidth: number;
  // Border Radius
  borderRadiusTopLeft: number;
  borderRadiusTopRight: number;
  borderRadiusBottomLeft: number;
  borderRadiusBottomRight: number;
  borderRadiusLinked: boolean;
  // Shadow
  shadowEnabled: boolean;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowColor: string;
}

// ── Background Properties ─────────────────────────────────
export interface BackgroundProperties {
  type: 'solid' | 'gradient' | 'image';
  color: string;
  gradientFrom: string;
  gradientTo: string;
  gradientAngle: number;
  imageSrc: string;
  imageOpacity: number;
}

// ── Music Properties ──────────────────────────────────────
export interface MusicProperties {
  id: string;
  src: string;
  name: string;
  duration?: number;
  source?: 'uploaded' | 'library';
  autoPlay: boolean;
  loop: boolean;
  volume: number; // 0–1
}

// ── Animation Properties ───────────────────────────────
export interface AnimationProperties {
  // Hiệu ứng xuất hiện (chạy 1 lần khi scroll đến)
  entryEnabled: boolean;
  entryEffect: string;       // 'none' | 'bounce' | 'fadeIn' | ...
  entryDuration: number;     // giây
  entryDelay: number;        // giây
  entryEasing: string;       // 'ease' | 'ease-in' | 'ease-out' | 'elastic'

  // Chuyển động liên tục (loop)
  loopEnabled: boolean;
  loopEffect: string;        // 'none' | 'bay-lo-lung' | 'nay' | ...
  loopDuration: number;      // giây
  loopDelay: number;         // giây
}

// ── Canvas Element (base + union) ─────────────────────────
export type CanvasElementType = 'text' | 'image' | 'shape';

export interface CanvasElement {
  id: string;
  type: CanvasElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  rotation: number;        // degrees, 0 by default
  isLocked?: boolean;
  isSelected?: boolean;
  textProps?: TextProperties;
  imageProps?: ImageProperties;
  shapeProps?: ShapeProperties;
  animationProps?: AnimationProperties;
}

// ── Uploaded Image Record ─────────────────────────────────
export interface UploadedImage {
  id: string;
  src: string;         // data URL or object URL
  name: string;
  thumbnailSrc?: string;
}

// ── Filmstrip / Page ──────────────────────────────────────
export interface FilmstripItem {
  id: string;
  thumbnail: string;
  label: string;
  isActive: boolean;
}

// ── AI Color ──────────────────────────────────────────────
export interface AIColor {
  id: string;
  hex: string;
  label: string;
}

export interface HistoryState {
  elements: CanvasElement[];
  canvasBackground: BackgroundProperties;
}

// ── Editor State ──────────────────────────────────────────
export interface EditorState {
  activeTool: ToolType;
  selectedElement: CanvasElement | null;
  elements: CanvasElement[];
  uploadedImages: UploadedImage[];
  uploadedMusics: MusicProperties[];
  zoom: number;
  showGrid: boolean;
  canvasWidth: number;
  canvasHeight: number;
  cropElementId: string | null;
  filmstripItems: FilmstripItem[];
  aiColors: AIColor[];
  activeRightTab: 'settings' | 'effects';
  showAIColorPanel: boolean;
  history: HistoryState[];
  historyIndex: number;
  music: MusicProperties | null;
  canvasBackground: BackgroundProperties;
  recentColors: string[];
  animationPreviewTick: number;
  activeGlobalAnimationPreset: string | null;
}
