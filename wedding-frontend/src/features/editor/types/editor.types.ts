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
  | 'library'
  | 'pages'
  | null;

export type AlignType = 'left' | 'center' | 'right' | 'justify';
export type FontWeightType = 'normal' | 'bold';
export type FontStyleType = 'normal' | 'italic';
export type TextDecorationLine = 'none' | 'underline' | 'line-through';
export type BorderStyleType = 'none' | 'solid' | 'dashed' | 'dotted';
export type PageAlignType = 'left' | 'center' | 'right';
export type AIModalType = 'remove-bg' | 'expand' | 'remove-object';

export interface AIModalState {
  type: AIModalType;
  elementId: string;
}

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
  borderStyle: string;
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
  textCurve?: number;
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
  // Custom Frame Properties
  backgroundColor?: string;
  frameType?: 'none' | 'polaroid' | 'circle' | 'arch' | 'rounded' | 'classic' | 'heart' | 'star';
  galleryImages?: string[];
  sliderStyle?: '3d' | 'flat' | 'grid' | 'collage' | 'slideshow';
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

// ── Countdown Properties ─────────────────────────────────
export interface CountdownContent {
  targetDate: string;
  targetTime: string;
  direction: 'horizontal' | 'vertical';
  language: 'vi' | 'en';
  spacing: number;
  font: string;
  fontSize: number;
  textColor: string;
  frameColor: string;
  backgroundColor: string;
  opacity: number;
  showDays: boolean;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  label: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  // Padding
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  // Border
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  borderStyle: string;
  // Shadow
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowColor: string;
}

// ── Map Properties ───────────────────────────────────────
export interface MapContent {
  address: string;
  lat: string;
  lng: string;
  language: 'vi' | 'en';
  zoomLevel: number;
  opacity: number;
  align: 'left' | 'center' | 'right';
  // Padding
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  // Border
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  borderStyle: string;
  // Shadow
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowColor: string;
}

// ── QR Gift Box Properties ────────────────────────────────
export interface BankAccount {
  id: string;                  // Unique ID for React lists
  role: 'bride' | 'groom';
  label: string;               // "Cô dâu" / "Chú rể"
  name: string;                // Tên chủ tài khoản
  bankName: string;            // Tên ngân hàng
  accountNumber: string;       // Số tài khoản
  qrImageUrl: string | null;   // URL ảnh QR (upload từ Cloudinary)
}

export interface QrGiftBoxContent {
  title: string;               // "Hộp Quà Yêu Thương"
  subtitle: string;            // "Quét QR code để gửi yêu thương..."
  iconUrl: string | null;      // URL icon hộp quà
  alignment: 'left' | 'center' | 'right';
  backgroundColor: string;
  envelopeColor?: string;
  opacity: number;
  popupHeaderBgColor?: string;
  popupHeaderTextColor?: string;
  popupBgColor?: string;
  popupTextColor?: string;
  accounts: BankAccount[];     // tối đa 2 phần tử
}

// ── Calendar Content ──────────────────────────────────────
export interface CalendarDay {
  date: string;          // format 'YYYY-MM-DD'
  side: 'groom' | 'bride' | null;  // null = ngày thường
}

export interface CalendarContent {
  templateId: 1 | 2 | 3;
  primaryDate: string;             // 'YYYY-MM-DD'
  showTwoDates: boolean;
  secondaryDate: string | null;
  groomSideLabel: string;
  brideSideLabel: string;

  alignment: 'left' | 'center' | 'right';
  font: string;
  fontSize: number;
  textColor: string;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  opacity: number;

  padding: { top: number; right: number; bottom: number; left: number };
  border: { width: number; style: string; color: string; radius: number };
  shadow: { x: number; y: number; blur: number; spread: number; color: string };
}

// ── Album Content ──────────────────────────────────────────
export interface AlbumContent {
  images: string[];
  showThumbnails: boolean;
  showNavButtons: boolean;
  enableFullscreen: boolean;
  effectType: 'fade' | 'slide' | 'zoom';
  delay: number; // In seconds
  alignment: 'left' | 'center' | 'right';
  backgroundColor: string;
  opacity: number;
  sliderStyle?: '3d' | 'flat' | 'grid' | 'collage' | 'slideshow';

  padding: { top: number; right: number; bottom: number; left: number };
  border: { width: number; style: string; color: string; radius: number };
  shadow: { x: number; y: number; blur: number; spread: number; color: string };
}

// ── Form Content ───────────────────────────────────────────
export interface FormContent {
  showGuestType: boolean;
  showAttendance: boolean;

  alignment: 'left' | 'center' | 'right';
  fontFamily: string;
  fontSize: number;
  textColor: string;
  backgroundColor: string;
  inputBorderColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  opacity: number;

  padding: { top: number; right: number; bottom: number; left: number };
  border: { width: number; style: string; color: string; radius: number };
  shadow: { x: number; y: number; blur: number; spread: number; color: string };
}

// ── Button Contact Properties ─────────────────────────────
export interface ButtonContactContent {
  phoneNumber: string;
  buttonText: string;
  showIcon: boolean;

  fontFamily: string;
  fontSize: number;
  textColor: string;
  backgroundColor: string;
  opacity: number;

  padding: { top: number; right: number; bottom: number; left: number };
  border: { width: number; style: string; color: string; radius: number };
  shadow: { x: number; y: number; blur: number; spread: number; color: string };
}

// ── Cover Page Properties ──────────────────────────────────
export interface CoverPageProps {
  enabled?: boolean;
  groomName: string;
  brideName: string;
  nameFontSize: number;
  nameFontFamily: string;
  date: string;
  dateFontSize: number;
  dateFontFamily: string;
  bgColor: string; // card
  outerBgColor: string; // outer
  nameColor: string;
  dateColor: string;
  buttonLabel: string;
  buttonBgColor: string;
  buttonTextColor: string;
  buttonBorderRadius: number;
  showPattern: boolean;
  patternStyle: 'red' | 'gold' | 'emerald' | 'hidden' | 'custom';
  patternCustomImage?: string;
  patternOpacity: number;
  patternColor: string;
  showEffect: boolean;
  effectType: 'cherry' | 'yellow' | 'heart' | 'hy';
  effectParticleCount: number;
  effectColor: string;
  effectSpeed: number;
}

// ── Canvas Element (base + union) ─────────────────────────
export type CanvasElementType = 'text' | 'image' | 'shape' | 'countdown' | 'map' | 'qr_code' | 'calendar' | 'album' | 'form' | 'button_contact';

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
  countdownProps?: CountdownContent;
  mapProps?: MapContent;
  qrGiftBoxProps?: QrGiftBoxContent;
  calendarProps?: CalendarContent;
  albumProps?: AlbumContent;
  formProps?: FormContent;
  buttonContactProps?: ButtonContactContent;
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
  aiModalState: AIModalState | null;
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
  // Auto-save
  cardId: string | null;
  autoSaveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSavedData: string | null;
  // Editor mode: 'card' for user cards, 'template' for admin templates
  editorMode: 'card' | 'template';
  templateId: string | null;
  // Loading state when fetching template data from server
  isLoadingEditor: boolean;

  // Global settings
  autoScroll: boolean;
  autoScrollSpeed: number;

  // Pages
  currentPage: 'main' | 'cover';
  coverPageProps: CoverPageProps;
}
