// ============================================================
// EDITOR STORE - Zustand state management for the editor
// ============================================================

import { create } from 'zustand';
import { toCanvas } from 'html-to-image';
import type {
  EditorState,
  ToolType,
  CanvasElement,
  TextProperties,
  ImageProperties,
  ShapeType,
  ShapeProperties,
  UploadedImage,
  MusicProperties,
  ImageCropData,
  BackgroundProperties,
  AnimationProperties,
} from '../types/editor.types';
import { assetsApi } from '../../../api/assetsApi';
import { cardsApi } from '../../../api/cardsApi';
import { templatesEditorApi } from '../../../api/templatesEditorApi';
import type { CanvasBlockPayload } from '../../../api/cardsApi';

// ── Default property sets ────────────────────────────────
export const DEFAULT_ANIMATION_PROPS: AnimationProperties = {
  entryEnabled: false,
  entryEffect: 'none',
  entryDuration: 1.0,
  entryDelay: 0,
  entryEasing: 'ease',
  loopEnabled: false,
  loopEffect: 'none',
  loopDuration: 2,
  loopDelay: 0,
};
const DEFAULT_TEXT_PROPS: TextProperties = {
  content: 'Nội dung',
  fontFamily: 'Playfair Display',
  fontSize: 26,
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
  textAlign: 'center',
  color: '#1a1a2e',
  backgroundColor: 'transparent',
  opacity: 1,
  paddingTop: 12,
  paddingRight: 16,
  paddingBottom: 12,
  paddingLeft: 16,
  borderWidth: 0,
  borderStyle: 'solid',
  borderColor: '#e0c4a8',
  borderRadius: 4,
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowColor: 'rgba(0,0,0,0.3)',
  letterSpacing: 0,
  lineHeight: 1.5,
  textCurve: 0,
};

const DEFAULT_IMAGE_PROPS: ImageProperties = {
  src: '',
  alt: 'Hình ảnh',
  opacity: 1,
  isFlippedX: false,
  isFlippedY: false,
  lockAspectRatio: true,
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  borderWidth: 0,
  borderColor: '#e0c4a8',
  borderRadius: 0,
  borderStyle: 'none',
  shadowX: 0,
  shadowY: 4,
  shadowBlur: 12,
  shadowColor: 'rgba(0,0,0,0.0)',
  objectFit: 'cover',
  frameType: 'none',
};

const DEFAULT_SHAPE_PROPS: ShapeProperties = {
  shapeType: 'rectangle',
  fillType: 'solid',
  fillColor: '#1a1a2e',
  gradientFrom: '#1a1a2e',
  gradientTo: '#4f46e5',
  gradientAngle: 90,
  opacity: 1,
  borderStyle: 'solid',
  borderPosition: 'center',
  borderColor: '#000000',
  borderWidth: 0,
  borderRadiusTopLeft: 0,
  borderRadiusTopRight: 0,
  borderRadiusBottomLeft: 0,
  borderRadiusBottomRight: 0,
  borderRadiusLinked: true,
  shadowEnabled: false,
  shadowX: 0,
  shadowY: 4,
  shadowBlur: 10,
  shadowColor: 'rgba(0, 0, 0, 0.2)',
};

const DEFAULT_COUNTDOWN_PROPS: import('../types/editor.types').CountdownContent = {
  targetDate: '2026-08-15',
  targetTime: '18:30',
  direction: 'horizontal',
  language: 'vi',
  spacing: 20,
  font: 'Arial',
  fontSize: 14,
  textColor: '#000000',
  frameColor: '#000000',
  backgroundColor: 'transparent',
  opacity: 1,
  showDays: true,
  showHours: true,
  showMinutes: true,
  showSeconds: true,
  label: { days: 'Ngày', hours: 'Giờ', minutes: 'Phút', seconds: 'Giây' },
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  borderWidth: 0,
  borderColor: '#000000',
  borderRadius: 0,
  borderStyle: 'none',
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowSpread: 0,
  shadowColor: 'transparent',
};

const DEFAULT_MAP_PROPS: import('../types/editor.types').MapContent = {
  address: '',
  lat: '',
  lng: '',
  language: 'vi',
  zoomLevel: 15,
  opacity: 1,
  align: 'center',
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  borderWidth: 0,
  borderColor: '#000000',
  borderRadius: 8,
  borderStyle: 'none',
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowSpread: 0,
  shadowColor: 'transparent',
};

const DEFAULT_QR_GIFT_BOX_PROPS: import('../types/editor.types').QrGiftBoxContent = {
  title: "Hộp Quà Yêu Thương",
  subtitle: "Quét QR code để gửi yêu thương trực tiếp tới:",
  iconUrl: null,
  alignment: "center",
  backgroundColor: "transparent",
  opacity: 1,
  popupHeaderBgColor: "#8B2929",
  popupHeaderTextColor: "#FFFFFF",
  popupBgColor: "#EAE0D5",
  popupTextColor: "#4A4A4A",
  accounts: []
};

export const DEFAULT_CALENDAR_PROPS: import('../types/editor.types').CalendarContent = {
  templateId: 1,
  primaryDate: new Date().toISOString().split('T')[0],
  showTwoDates: false,
  secondaryDate: null,
  groomSideLabel: "Nhà trai",
  brideSideLabel: "Nhà gái",
  alignment: "center",
  font: "Arial",
  fontSize: 14,
  textColor: "#1a1a1a",
  backgroundColor: "#ffffff",
  primaryColor: "#f43f5e",
  secondaryColor: "#3b82f6",
  opacity: 1,
  padding: { top: 16, right: 16, bottom: 16, left: 16 },
  border: { width: 1, style: "solid", color: "#e4e4e7", radius: 12 },
  shadow: { x: 0, y: 2, blur: 8, spread: 0, color: "rgba(0,0,0,0.08)" }
};

export const DEFAULT_ALBUM_PROPS: import('../types/editor.types').AlbumContent = {
  images: [],
  showThumbnails: true,
  showNavButtons: true,
  enableFullscreen: true,
  effectType: 'fade',
  delay: 3,
  alignment: 'center',
  backgroundColor: '#ffffff',
  opacity: 1,
  sliderStyle: '3d',
  padding: { top: 0, right: 0, bottom: 0, left: 0 },
  border: { width: 0, style: "none", color: "#e4e4e7", radius: 12 },
  shadow: { x: 0, y: 2, blur: 8, spread: 0, color: "rgba(0,0,0,0.08)" }
};

export const DEFAULT_FORM_PROPS: import('../types/editor.types').FormContent = {
  showGuestType: true,
  showAttendance: true,
  alignment: 'center',
  fontFamily: 'Arial',
  fontSize: 14,
  textColor: '#000000',
  backgroundColor: '#f9f9f9',
  inputBorderColor: '#cccccc',
  buttonBgColor: '#000000',
  buttonTextColor: '#ffffff',
  opacity: 1,
  padding: { top: 20, right: 20, bottom: 20, left: 20 },
  border: { width: 1, style: 'solid', color: '#e4e4e7', radius: 12 },
  shadow: { x: 0, y: 4, blur: 12, spread: 0, color: 'rgba(0,0,0,0.1)' }
};

export const DEFAULT_BUTTON_CONTACT_PROPS: import('../types/editor.types').ButtonContactContent = {
  phoneNumber: '0987654321',
  buttonText: 'Liên hệ',
  showIcon: true,
  fontFamily: 'Arial',
  fontSize: 16,
  textColor: '#ffffff',
  backgroundColor: '#f43f5e',
  opacity: 1,
  padding: { top: 12, right: 24, bottom: 12, left: 24 },
  border: { width: 0, style: 'none', color: '#e4e4e7', radius: 24 },
  shadow: { x: 0, y: 4, blur: 12, spread: 0, color: 'rgba(0,0,0,0.1)' }
};

export const DEFAULT_COVER_PAGE_PROPS: import('../types/editor.types').CoverPageProps = {
  enabled: true,
  groomName: 'Van Thuan',
  brideName: 'Anh Truc',
  nameFontSize: 42,
  nameFontFamily: 'Playfair Display',
  date: '23 tháng 8, 2004',
  dateFontSize: 20,
  dateFontFamily: 'Playfair Display',
  bgColor: '#A31D16',
  outerBgColor: '#3C0F0F',
  nameColor: '#F0D497',
  dateColor: '#F0D497',
  buttonLabel: 'Mở thiệp',
  buttonBgColor: '#F0D497',
  buttonTextColor: '#4A1212',
  buttonBorderRadius: 24,
  showPattern: true,
  patternStyle: 'custom',
  patternCustomImage: 'https://res.cloudinary.com/dimrl0w79/image/upload/v1783091497/dearlove/library_elements/njsjlfrf0ctt5rnkg0hv.webp',
  patternOpacity: 36,
  patternColor: '#E74C3C',
  showEffect: true,
  effectType: 'hy',
  effectParticleCount: 30,
  effectColor: '#F0D497',
  effectSpeed: 50,
};

// ── Initial data ──────────────────────────────────────────
const INITIAL_ELEMENTS: CanvasElement[] = [
  {
    id: 'el-1',
    type: 'text',
    x: 60,
    y: 160,
    width: 280,
    height: 60,
    zIndex: 1,
    rotation: 0,
    isSelected: true,
    textProps: {
      ...DEFAULT_TEXT_PROPS,
      content: 'Nội dung',
      fontSize: 26,
    },
  },
];

// ── Actions interface ─────────────────────────────────────
interface EditorActions {
  setActiveTool: (tool: ToolType) => void;
  selectElement: (id: string | null) => void;
  addTextElement: () => void;
  addImageElement: (src: string, name?: string, x?: number, y?: number) => void;
  updateTextProp: <K extends keyof TextProperties>(
    id: string,
    key: K,
    value: TextProperties[K]
  ) => void;
  updateImageProp: <K extends keyof ImageProperties>(
    id: string,
    key: K,
    value: ImageProperties[K]
  ) => void;
  updateImageProps: (
    id: string,
    props: Partial<ImageProperties>
  ) => void;
  addShapeElement: (shapeType: ShapeType) => void;
  updateShapeProp: <K extends keyof ShapeProperties>(
    id: string,
    key: K,
    value: ShapeProperties[K]
  ) => void;
  updateShapeProps: (
    id: string,
    props: Partial<ShapeProperties>
  ) => void;
  addCountdownElement: (x?: number, y?: number) => void;
  updateCountdownProps: (
    id: string,
    props: Partial<import('../types/editor.types').CountdownContent>
  ) => void;
  addMapElement: (x?: number, y?: number) => void;
  addQrCodeElement: (x?: number, y?: number) => void;
  updateMapProps: (
    id: string,
    props: Partial<import('../types/editor.types').MapContent>
  ) => void;
  updateQrGiftBoxProps: (
    id: string,
    props: Partial<import('../types/editor.types').QrGiftBoxContent>
  ) => void;
  addCalendarElement: (x?: number, y?: number) => void;
  updateCalendarProps: (
    id: string,
    props: Partial<import('../types/editor.types').CalendarContent>
  ) => void;
  addAlbumElement: (x?: number, y?: number) => void;
  updateAlbumProps: (
    id: string,
    props: Partial<import('../types/editor.types').AlbumContent>
  ) => void;
  addFormElement: (x?: number, y?: number) => void;
  updateFormProps: (
    id: string,
    props: Partial<import('../types/editor.types').FormContent>
  ) => void;
  addButtonContactElement: (x?: number, y?: number) => void;
  updateButtonContactProps: (
    id: string,
    props: Partial<import('../types/editor.types').ButtonContactContent>
  ) => void;
  updateAnimationProps: (id: string, props: Partial<AnimationProperties>) => void;
  applyGlobalAnimation: (presetId: string, preset: (index: number) => Partial<AnimationProperties>) => void;
  triggerAnimationPreview: () => void;
  updateElementPosition: (id: string, x: number, y: number) => void;
  updateElementSize: (id: string, width: number, height: number) => void;
  updateElementRotation: (id: string, rotation: number) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  setZoom: (zoom: number) => void;
  setCanvasSize: (width: number, height: number) => void;
  toggleGrid: () => void;
  setActiveRightTab: (tab: 'settings' | 'effects') => void;
  toggleAIColorPanel: () => void;
  addUploadedImage: (img: UploadedImage) => void;
  removeUploadedImage: (id: string) => void;
  addUploadedMusic: (music: MusicProperties) => void;
  removeUploadedMusic: (id: string) => void;
  setMusic: (music: MusicProperties | null) => void;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  bringElementForward: (id: string) => void;
  sendElementBackward: (id: string) => void;
  bringElementToFront: (id: string) => void;
  sendElementToBack: (id: string) => void;
  alignElementToPage: (id: string, align: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'middle') => void;
  addImageElementWithFrame: (frameType: string) => void;
  setCropElementId: (id: string | null) => void;
  setAiModalState: (state: import('../types/editor.types').AIModalState | null) => void;
  updateElementCrop: (id: string, cropData: ImageCropData, newWidth: number, newHeight: number) => void;
  updateCanvasBackground: (props: Partial<BackgroundProperties>) => void;
  addRecentColor: (color: string) => void;
  fetchUploadedAssets: () => Promise<void>;
  setCardId: (id: string) => void;
  setAutoSaveStatus: (status: EditorState['autoSaveStatus']) => void;
  saveCanvasNow: () => Promise<void>;
  loadCardData: (cardId: string) => Promise<void>;
  loadTemplateData: (templateId: string) => Promise<void>;
  saveTemplateNow: () => Promise<void>;

  // Settings
  setAutoScroll: (enabled: boolean) => void;
  setAutoScrollSpeed: (speed: number) => void;

  // Pages
  setCurrentPage: (page: 'main' | 'cover') => void;
  updateCoverPageProps: (props: Partial<import('../types/editor.types').CoverPageProps>) => void;
  resetEditorToBlank: () => void;
}


// ── Initial data ──────────────────────────────────────────
const INITIAL_BACKGROUND: BackgroundProperties = {
  type: 'solid',
  color: '#ffffff',
  gradientFrom: '#ffffff',
  gradientTo: '#000000',
  gradientAngle: 90,
  imageSrc: '',
  imageOpacity: 1,
};

const INITIAL_STATE: EditorState = {
  currentPage: 'main',
  coverPageProps: DEFAULT_COVER_PAGE_PROPS,
  activeTool: 'text',
  selectedElement: INITIAL_ELEMENTS[0],
  elements: INITIAL_ELEMENTS,
  uploadedImages: [],
  uploadedMusics: [],
  zoom: 100,
  showGrid: false,
  // Canvas dimensions
  canvasWidth: 500, // desktop-first, user can switch
  canvasHeight: 2000,
  cropElementId: null,
  aiModalState: null,
  filmstripItems: Array.from({ length: 14 }, (_, i) => ({
    id: `page-${i + 1}`,
    thumbnail: '',
    label: `Trang ${i + 1}`,
    isActive: i === 0,
  })),
  aiColors: [
    { id: 'c1', hex: '#8B1A1A', label: 'Deep Red' },
    { id: 'c2', hex: '#C0392B', label: 'Crimson' },
    { id: 'c3', hex: '#E74C3C', label: 'Red' },
    { id: 'c4', hex: '#4A235A', label: 'Deep Purple' },
    { id: 'c5', hex: '#884EA0', label: 'Purple' },
    { id: 'c6', hex: '#2E4057', label: 'Navy' },
    { id: 'c7', hex: '#1A8F5D', label: 'Emerald' },
    { id: 'c8', hex: '#F4D03F', label: 'Gold' },
  ],
  activeRightTab: 'settings',
  showAIColorPanel: true,
  history: [{ elements: INITIAL_ELEMENTS, canvasBackground: INITIAL_BACKGROUND }],
  historyIndex: 0,
  music: null,
  canvasBackground: INITIAL_BACKGROUND,
  recentColors: [],
  animationPreviewTick: 0,
  activeGlobalAnimationPreset: null,
  cardId: null,
  autoSaveStatus: 'idle',
  lastSavedData: null,
  editorMode: 'card' as const,
  templateId: null,
  isLoadingEditor: false,
  autoScroll: false,
  autoScrollSpeed: 50,
};

// ── Store ─────────────────────────────────────────────────
const getViewportCenterY = (zoom: number, canvasHeight: number): number => {
  const workspace = document.querySelector('.canvas-workspace');
  const canvasEl = document.getElementById('editor-canvas-frame');
  if (workspace && canvasEl) {
    const scale = zoom / 100;
    const workspaceRect = workspace.getBoundingClientRect();
    const canvasRect = canvasEl.getBoundingClientRect();

    const visibleCenterY = workspaceRect.top + workspaceRect.height / 2;
    const offsetInCanvas = (visibleCenterY - canvasRect.top) / scale;

    return Math.max(50, Math.min(offsetInCanvas, canvasHeight - 50));
  }
  return 200;
};

export const useEditorStore = create<EditorState & EditorActions>((set, get) => ({
  ...INITIAL_STATE,

  setAutoScroll: (enabled) => {
    set({ autoScroll: enabled });
    get().pushHistory(); // Optional: whether changing scroll state should push history
  },
  setAutoScrollSpeed: (speed) => {
    set({ autoScrollSpeed: speed });
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
    // Maybe deselect elements when switching pages
    get().selectElement(null);
  },

  updateCoverPageProps: (props) => {
    set((state) => ({
      coverPageProps: { ...state.coverPageProps, ...props },
    }));
  },

  setActiveTool: (tool) => set({ activeTool: tool }),

  selectElement: (id) => {
    const { elements } = get();
    const updated = elements.map((el) => ({ ...el, isSelected: el.id === id }));
    const selected = id ? updated.find((el) => el.id === id) ?? null : null;

    let activeTool = get().activeTool;
    if (selected) {
      if (selected.type === 'text') activeTool = 'text';
      else if (selected.type === 'image') activeTool = 'image';
      else if (selected.type === 'shape') activeTool = 'tools';
      else if (selected.type === 'countdown' || selected.type === 'map' || selected.type === 'qr_code' || selected.type === 'calendar') activeTool = 'widgets';
    }

    set({ elements: updated, selectedElement: selected, activeTool });
  },

  // ── Add text element ──────────────────────────────────
  addTextElement: () => {
    const { elements } = get();
    const id = `el-${Date.now()}`;
    const newEl: CanvasElement = {
      id,
      type: 'text',
      x: 60 + Math.random() * 100,
      y: getViewportCenterY(get().zoom, get().canvasHeight) - 30 + Math.random() * 60,
      width: 280,
      height: 60,
      zIndex: elements.length > 0 ? Math.max(...elements.map(el => el.zIndex)) + 1 : 1,
      rotation: 0,
      isSelected: true,
      textProps: { ...DEFAULT_TEXT_PROPS, content: 'Văn bản mới' },
    };
    const updated = elements.map((el) => ({ ...el, isSelected: false }));
    set({
      elements: [...updated, newEl],
      selectedElement: newEl,
      activeTool: 'text',
    });
    get().pushHistory();
  },

  // ── Add image element ─────────────────────────────────
  addImageElement: (src, name = 'Hình ảnh', x, y) => {
    const { elements } = get();
    const id = `el-img-${Date.now()}`;
    const defaultX = x !== undefined ? x : 50 + Math.random() * 80;
    const defaultY = y !== undefined ? y : Math.max(50, getViewportCenterY(get().zoom, get().canvasHeight) - 150 + Math.random() * 80);
    const newEl: CanvasElement = {
      id,
      type: 'image',
      x: defaultX,
      y: defaultY,
      width: 240,
      height: 300,
      zIndex: elements.length > 0 ? Math.max(...elements.map(el => el.zIndex)) + 1 : 1,
      rotation: 0,
      isSelected: true,
      imageProps: { ...DEFAULT_IMAGE_PROPS, src, alt: name },
    };
    const updated = elements.map((el) => ({ ...el, isSelected: false }));
    set({
      elements: [...updated, newEl],
      selectedElement: newEl,
      activeTool: 'image',
    });
    get().pushHistory();
  },

  addImageElementWithFrame: (frameType) => {
    const { elements } = get();
    const id = `el-img-${Date.now()}`;
    const x = 50 + Math.random() * 80;
    const y = Math.max(50, getViewportCenterY(get().zoom, get().canvasHeight) - 150 + Math.random() * 80);

    let frameProps: Partial<ImageProperties> = {
      frameType: frameType as any,
    };

    // Apply specific frame presets
    if (frameType === 'circle') {
      frameProps.borderRadius = 999;
    } else if (frameType === 'rounded') {
      frameProps.borderRadius = 24;
    } else if (frameType === 'polaroid') {
      frameProps = {
        frameType: 'polaroid',
        borderRadius: 0,
        paddingTop: 12,
        paddingRight: 12,
        paddingBottom: 48,
        paddingLeft: 12,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        shadowX: 0,
        shadowY: 8,
        shadowBlur: 16,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
      };
    } else if (frameType === 'classic') {
      frameProps = {
        frameType: 'classic',
        borderRadius: 4,
        paddingTop: 12,
        paddingRight: 12,
        paddingBottom: 12,
        paddingLeft: 12,
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#e0c4a8',
        borderStyle: 'solid',
        shadowX: 0,
        shadowY: 4,
        shadowBlur: 8,
        shadowColor: 'rgba(0, 0, 0, 0.08)',
      };
    }

    const newEl: CanvasElement = {
      id,
      type: 'image',
      x,
      y,
      width: 240,
      height: frameType === 'polaroid' ? 280 : 240,
      zIndex: elements.length > 0 ? Math.max(...elements.map(el => el.zIndex)) + 1 : 1,
      rotation: 0,
      isSelected: true,
      imageProps: {
        ...DEFAULT_IMAGE_PROPS,
        src: '',
        alt: 'Khung ảnh',
        ...frameProps
      },
    };

    const updated = elements.map((el) => ({ ...el, isSelected: false }));
    set({
      elements: [...updated, newEl],
      selectedElement: newEl,
      activeTool: 'image',
    });
    get().pushHistory();
  },

  // ── Add shape element ─────────────────────────────────
  addShapeElement: (shapeType) => {
    const { elements } = get();
    const id = `el-shape-${Date.now()}`;
    const x = 50 + Math.random() * 80;
    const y = Math.max(50, getViewportCenterY(get().zoom, get().canvasHeight) - 75 + Math.random() * 80);

    let width = 150;
    let height = 150;

    if (shapeType === 'line') {
      width = 200;
      height = 4;
    } else if (shapeType === 'rectangle') {
      width = 200;
      height = 120;
    } else if (shapeType === 'triangle') {
      width = 150;
      height = 130;
    }

    const newEl: CanvasElement = {
      id,
      type: 'shape',
      x,
      y,
      width,
      height,
      zIndex: elements.length > 0 ? Math.max(...elements.map(el => el.zIndex)) + 1 : 1,
      rotation: 0,
      isSelected: true,
      shapeProps: { ...DEFAULT_SHAPE_PROPS, shapeType },
    };
    const updated = elements.map((el) => ({ ...el, isSelected: false }));
    set({
      elements: [...updated, newEl],
      selectedElement: newEl,
      activeTool: 'tools',
    });
    get().pushHistory();
  },

  // ── Add countdown element ───────────────────────────────
  addCountdownElement: (x, y) => {
    const { elements } = get();
    const id = `el-countdown-${Date.now()}`;
    const defaultX = x !== undefined ? x : 50;
    const defaultY = y !== undefined ? y : getViewportCenterY(get().zoom, get().canvasHeight) - 50;
    const newEl: CanvasElement = {
      id,
      type: 'countdown',
      x: defaultX,
      y: defaultY,
      width: 300,
      height: 100,
      zIndex: elements.length > 0 ? Math.max(...elements.map(el => el.zIndex)) + 1 : 1,
      rotation: 0,
      isSelected: true,
      countdownProps: { ...DEFAULT_COUNTDOWN_PROPS },
    };
    const updated = elements.map((el) => ({ ...el, isSelected: false }));
    set({
      elements: [...updated, newEl],
      selectedElement: newEl,
      activeTool: 'widgets',
    });
    get().pushHistory();
  },

  // ── Add Map Element ─────────────────────────────────────
  addMapElement: (x, y) => {
    const { elements } = get();
    const id = `el-map-${Date.now()}`;
    const defaultX = x !== undefined ? x : 50;
    const defaultY = y !== undefined ? y : getViewportCenterY(get().zoom, get().canvasHeight) - 150;
    const newEl: import('../types/editor.types').CanvasElement = {
      id,
      type: 'map',
      x: defaultX,
      y: defaultY,
      width: 400,
      height: 300,
      zIndex: elements.length > 0 ? Math.max(...elements.map(el => el.zIndex)) + 1 : 1,
      rotation: 0,
      isSelected: true,
      mapProps: { ...DEFAULT_MAP_PROPS },
    };
    const updated = elements.map((el) => ({ ...el, isSelected: false }));
    set({
      elements: [...updated, newEl],
      selectedElement: newEl,
      activeTool: 'widgets',
    });
    get().pushHistory();
  },



  // ── Add QR Code Element ─────────────────────────────────
  addQrCodeElement: (x, y) => {
    const { elements } = get();
    const id = `el-qrcode-${Date.now()}`;
    const defaultX = x !== undefined ? x : 50;
    const defaultY = y !== undefined ? y : getViewportCenterY(get().zoom, get().canvasHeight) - 75;
    const newEl: import('../types/editor.types').CanvasElement = {
      id,
      type: 'qr_code',
      x: defaultX,
      y: defaultY,
      width: 120,
      height: 150,
      zIndex: elements.length > 0 ? Math.max(...elements.map(el => el.zIndex)) + 1 : 1,
      rotation: 0,
      isSelected: true,
      qrGiftBoxProps: { ...DEFAULT_QR_GIFT_BOX_PROPS },
    };
    const updated = elements.map((el) => ({ ...el, isSelected: false }));
    set({
      elements: [...updated, newEl],
      selectedElement: newEl,
      activeTool: 'widgets',
    });
    get().pushHistory();
  },

  // ── Add Calendar Element ─────────────────────────────────
  addCalendarElement: (x, y) => {
    const { elements } = get();
    const id = `el-calendar-${Date.now()}`;
    const defaultX = x !== undefined ? x : 50;
    const defaultY = y !== undefined ? y : getViewportCenterY(get().zoom, get().canvasHeight) - 160;
    const newEl: import('../types/editor.types').CanvasElement = {
      id,
      type: 'calendar',
      x: defaultX,
      y: defaultY,
      width: 380,
      height: 320,
      zIndex: elements.length > 0 ? Math.max(...elements.map(el => el.zIndex)) + 1 : 1,
      rotation: 0,
      isSelected: true,
      calendarProps: { ...DEFAULT_CALENDAR_PROPS },
    };
    const updated = elements.map((el) => ({ ...el, isSelected: false }));
    set({
      elements: [...updated, newEl],
      selectedElement: newEl,
      activeTool: 'widgets',
    });
    get().pushHistory();
  },

  // ── Add Album Element ────────────────────────────────────
  addAlbumElement: (x, y) => {
    const { elements } = get();
    const id = `el-album-${Date.now()}`;
    const defaultX = x !== undefined ? x : 50;
    const defaultY = y !== undefined ? y : getViewportCenterY(get().zoom, get().canvasHeight) - 150;
    const newEl: import('../types/editor.types').CanvasElement = {
      id,
      type: 'album',
      x: defaultX,
      y: defaultY,
      width: 380,
      height: 300,
      zIndex: elements.length > 0 ? Math.max(...elements.map(el => el.zIndex)) + 1 : 1,
      rotation: 0,
      isSelected: true,
      albumProps: { ...DEFAULT_ALBUM_PROPS },
    };
    const updated = elements.map((el) => ({ ...el, isSelected: false }));
    set({
      elements: [...updated, newEl],
      selectedElement: newEl,
      activeTool: 'widgets',
    });
    get().pushHistory();
  },

  // ── Add Form Element ─────────────────────────────────────
  addFormElement: (x, y) => {
    const { elements } = get();
    const id = `el-form-${Date.now()}`;
    const defaultX = x !== undefined ? x : 50;
    const defaultY = y !== undefined ? y : getViewportCenterY(get().zoom, get().canvasHeight) - 175;
    const newEl: import('../types/editor.types').CanvasElement = {
      id,
      type: 'form',
      x: defaultX,
      y: defaultY,
      width: 400,
      height: 350,
      zIndex: elements.length > 0 ? Math.max(...elements.map(el => el.zIndex)) + 1 : 1,
      rotation: 0,
      isSelected: true,
      formProps: { ...DEFAULT_FORM_PROPS },
    };
    const updated = elements.map((el) => ({ ...el, isSelected: false }));
    set({
      elements: [...updated, newEl],
      selectedElement: newEl,
      activeTool: 'widgets',
    });
    get().pushHistory();
  },

  // ── Updates ────────────────────────────────────────────
  updateTextProp: (id, key, value) => {
    const { elements, selectedElement } = get();
    const updated = elements.map((el) => {
      if (el.id !== id || !el.textProps) return el;
      return { ...el, textProps: { ...el.textProps, [key]: value } };
    });
    const updatedSelected =
      selectedElement?.id === id
        ? updated.find((el) => el.id === id) ?? null
        : selectedElement;
    set({ elements: updated, selectedElement: updatedSelected });
  },

  // ── Update image prop ─────────────────────────────────
  updateImageProp: (id, key, value) => {
    const { elements, selectedElement } = get();
    const updated = elements.map((el) => {
      if (el.id !== id || !el.imageProps) return el;
      return { ...el, imageProps: { ...el.imageProps, [key]: value } };
    });
    const updatedSelected =
      selectedElement?.id === id
        ? updated.find((el) => el.id === id) ?? null
        : selectedElement;
    set({ elements: updated, selectedElement: updatedSelected });
  },

  updateImageProps: (id, props) => {
    const { elements, selectedElement } = get();
    const updated = elements.map((el) => {
      if (el.id !== id || !el.imageProps) return el;
      return { ...el, imageProps: { ...el.imageProps, ...props } };
    });
    const updatedSelected =
      (selectedElement && selectedElement.id === id)
        ? updated.find((el) => el.id === id) ?? null
        : selectedElement;
    set({ elements: updated, selectedElement: updatedSelected });
  },

  // ── Update shape prop ─────────────────────────────────
  updateShapeProp: (id, key, value) => {
    const { elements, selectedElement } = get();
    const updated = elements.map((el) => {
      if (el.id !== id || !el.shapeProps) return el;
      return { ...el, shapeProps: { ...el.shapeProps, [key]: value } };
    });
    const updatedSelected =
      selectedElement?.id === id
        ? updated.find((el) => el.id === id) ?? null
        : selectedElement;
    set({ elements: updated, selectedElement: updatedSelected });
  },

  updateShapeProps: (id, props) => {
    const { elements, selectedElement } = get();
    const updated = elements.map((el) => {
      if (el.id !== id || !el.shapeProps) return el;
      return { ...el, shapeProps: { ...el.shapeProps, ...props } };
    });
    const updatedSelected =
      selectedElement?.id === id
        ? updated.find((el) => el.id === id) ?? null
        : selectedElement;
    set({ elements: updated, selectedElement: updatedSelected });
  },

  updateCountdownProps: (id, props) => {
    const { elements, selectedElement } = get();
    const updated = elements.map((el) => {
      if (el.id !== id || !el.countdownProps) return el;
      return { ...el, countdownProps: { ...el.countdownProps, ...props } };
    });
    const updatedSelected =
      selectedElement?.id === id
        ? updated.find((el) => el.id === id) ?? null
        : selectedElement;
    set({ elements: updated, selectedElement: updatedSelected });
  },

  updateMapProps: (id, props) => {
    const { elements, selectedElement } = get();
    const updated = elements.map((el) => {
      if (el.id !== id || !el.mapProps) return el;
      return { ...el, mapProps: { ...el.mapProps, ...props } };
    });
    const updatedSelected =
      selectedElement?.id === id
        ? updated.find((el) => el.id === id) ?? null
        : selectedElement;
    set({ elements: updated, selectedElement: updatedSelected });
  },

  updateQrGiftBoxProps: (id, props) => {
    const { elements, selectedElement } = get();
    const updated = elements.map((el) => {
      if (el.id !== id || !el.qrGiftBoxProps) return el;
      return { ...el, qrGiftBoxProps: { ...el.qrGiftBoxProps, ...props } };
    });
    const updatedSelected =
      selectedElement?.id === id
        ? updated.find((el) => el.id === id) ?? null
        : selectedElement;
    set({ elements: updated, selectedElement: updatedSelected });
  },

  updateCalendarProps: (id, props) => {
    const { elements, selectedElement } = get();
    const updated = elements.map((el) => {
      if (el.id !== id || !el.calendarProps) return el;
      return { ...el, calendarProps: { ...el.calendarProps, ...props } };
    });
    const updatedSelected =
      selectedElement?.id === id
        ? updated.find((el) => el.id === id) ?? null
        : selectedElement;
    set({ elements: updated, selectedElement: updatedSelected });
  },
  updateAlbumProps: (id, props) => {
    const { elements, selectedElement } = get();
    const updated = elements.map((el) => {
      if (el.id !== id || !el.albumProps) return el;
      return { ...el, albumProps: { ...el.albumProps, ...props } };
    });
    const updatedSelected =
      selectedElement?.id === id
        ? updated.find((el) => el.id === id) ?? null
        : selectedElement;
    set({ elements: updated, selectedElement: updatedSelected });
  },

  updateFormProps: (id, props) => {
    const { elements, selectedElement } = get();
    const updated = elements.map((el) => {
      if (el.id !== id || !el.formProps) return el;
      return { ...el, formProps: { ...el.formProps, ...props } };
    });
    const updatedSelected =
      selectedElement?.id === id
        ? updated.find((el) => el.id === id) ?? null
        : selectedElement;
    set({ elements: updated, selectedElement: updatedSelected });
  },

  // ── Geometry updates ──────────────────────────────────
  updateElementPosition: (id, x, y) => {
    const { elements, selectedElement } = get();
    const updated = elements.map((el) => (el.id === id ? { ...el, x, y } : el));
    const updatedSelected =
      selectedElement?.id === id ? { ...selectedElement, x, y } : selectedElement;
    set({ elements: updated, selectedElement: updatedSelected });
  },

  updateElementSize: (id, width, height) => {
    const { elements, selectedElement } = get();
    console.log('[editorStore] updateElementSize ->', { id, width, height });
    const updated = elements.map((el) =>
      el.id === id ? { ...el, width, height } : el
    );
    const updatedSelected =
      selectedElement?.id === id
        ? { ...selectedElement, width, height }
        : selectedElement;
    set({ elements: updated, selectedElement: updatedSelected });
  },

  updateElementRotation: (id, rotation) => {
    const { elements, selectedElement } = get();
    const updated = elements.map((el) =>
      el.id === id ? { ...el, rotation } : el
    );
    const updatedSelected =
      selectedElement?.id === id
        ? { ...selectedElement, rotation }
        : selectedElement;
    set({ elements: updated, selectedElement: updatedSelected });
  },

  setCropElementId: (id) => set({ cropElementId: id }),

  setAiModalState: (state) => set({ aiModalState: state }),

  updateElementCrop: (id, cropData, newWidth, newHeight) => {
    const { elements, selectedElement } = get();
    const updated = elements.map((el) => {
      if (el.id !== id || !el.imageProps) return el;
      return {
        ...el,
        width: newWidth,
        height: newHeight,
        imageProps: { ...el.imageProps, crop: cropData },
      };
    });
    const updatedSelected =
      selectedElement?.id === id
        ? updated.find((el) => el.id === id) ?? null
        : selectedElement;
    set({ elements: updated, selectedElement: updatedSelected });
  },

  updateCanvasBackground: (props) => {
    set((state) => ({
      canvasBackground: { ...state.canvasBackground, ...props }
    }));
    get().pushHistory();
  },

  addRecentColor: (color) => {
    set((state) => {
      const colors = state.recentColors.filter((c) => c !== color);
      colors.unshift(color);
      if (colors.length > 12) colors.pop();
      return { recentColors: colors };
    });
  },

  // ── Delete / Duplicate ────────────────────────────────
  deleteElement: (id) => {
    const { elements } = get();
    set({
      elements: elements.filter((el) => el.id !== id),
      selectedElement: null,
    });
    get().pushHistory();
  },

  // ── Add Button Contact Element ───────────────────────────
  addButtonContactElement: (x, y) => {
    const { elements } = get();
    const id = `el-button-contact-${Date.now()}`;
    const defaultX = x !== undefined ? x : 100;
    const defaultY = y !== undefined ? y : getViewportCenterY(get().zoom, get().canvasHeight) - 30;
    const newEl: import('../types/editor.types').CanvasElement = {
      id,
      type: 'button_contact',
      x: defaultX,
      y: defaultY,
      width: 180,
      height: 48,
      zIndex: elements.length > 0 ? Math.max(...elements.map(el => el.zIndex)) + 1 : 1,
      rotation: 0,
      isSelected: true,
      buttonContactProps: { ...DEFAULT_BUTTON_CONTACT_PROPS },
    };
    const updated = elements.map((el) => ({ ...el, isSelected: false }));
    set({
      elements: [...updated, newEl],
      selectedElement: newEl,
      activeTool: 'widgets',
    });
    get().pushHistory();
  },

  updateButtonContactProps: (id, props) => {
    const { elements } = get();
    set({
      elements: elements.map((el) => (el.id === id ? { ...el, buttonContactProps: { ...el.buttonContactProps!, ...props } } : el)),
    });
    get().pushHistory();
  },

  duplicateElement: (id) => {
    const { elements } = get();
    const src = elements.find((el) => el.id === id);
    if (!src) return;
    const newEl: CanvasElement = {
      ...src,
      id: `el-${Date.now()}`,
      x: src.x + 20,
      y: src.y + 20,
      zIndex: elements.length > 0 ? Math.max(...elements.map(el => el.zIndex)) + 1 : 1,
      isSelected: true,
      textProps: src.textProps ? { ...src.textProps } : undefined,
      imageProps: src.imageProps ? { ...src.imageProps } : undefined,
      shapeProps: src.shapeProps ? { ...src.shapeProps } : undefined,
      countdownProps: src.countdownProps ? { ...src.countdownProps } : undefined,
    };
    const updated = elements.map((el) => ({ ...el, isSelected: false }));
    set({ elements: [...updated, newEl], selectedElement: newEl });
    get().pushHistory();
  },

  // ── Canvas controls ───────────────────────────────────
  setZoom: (zoom) => set({ zoom: Math.max(25, Math.min(200, zoom)) }),
  setCanvasSize: (width, height) =>
    set({
      canvasWidth: Math.max(50, Math.round(width)),
      canvasHeight: Math.max(50, Math.round(height)),
    }),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  setActiveRightTab: (tab) => set({ activeRightTab: tab }),
  toggleAIColorPanel: () => set((s) => ({ showAIColorPanel: !s.showAIColorPanel })),

  // ── Uploaded images management ────────────────────────
  addUploadedImage: (img) =>
    set((s) => ({ uploadedImages: [...s.uploadedImages, img] })),
  removeUploadedImage: (id) =>
    set((s) => ({ uploadedImages: s.uploadedImages.filter((i) => i.id !== id) })),

  // ── Uploaded music management ────────────────────────
  addUploadedMusic: (music) =>
    set((s) => ({ uploadedMusics: [music, ...s.uploadedMusics] })),
  removeUploadedMusic: (id) => {
    set((s) => {
      const musicToRemove = s.uploadedMusics.find((m) => m.id === id);
      if (musicToRemove && musicToRemove.src.startsWith('blob:')) {
        URL.revokeObjectURL(musicToRemove.src);
      }
      return {
        uploadedMusics: s.uploadedMusics.filter((m) => m.id !== id),
        music: s.music?.id === id ? null : s.music,
      };
    });
  },

  fetchUploadedAssets: async () => {
    try {
      const assets = await assetsApi.getAssets();
      const images: UploadedImage[] = [];
      const musics: MusicProperties[] = [];

      assets.forEach(asset => {
        if (asset.type === 'image' || asset.type === 'video') {
          images.push({
            id: asset.id,
            src: asset.url,
            name: `Ảnh của tôi`, // Optional: extract filename from url if needed
            thumbnailSrc: asset.thumbnailUrl || asset.url,
          });
        } else if (asset.type === 'audio') {
          musics.push({
            id: asset.id,
            name: `Nhạc của tôi`,
            src: asset.url,
            duration: asset.durationMs ? asset.durationMs / 1000 : 0,
            source: 'uploaded',
            autoPlay: true,
            loop: true,
            volume: 0.5
          });
        }
      });

      set({ uploadedImages: images, uploadedMusics: musics });
    } catch (error) {
      console.error('Failed to fetch assets', error);
    }
  },

  // ── Music ─────────────────────────────────────────────
  setMusic: (music) => set({ music }),

  // ── Layer ordering (Z-Index) ──────────────────────────
  bringElementForward: (id) => {
    const { elements, selectedElement } = get();

    let sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
    const index = sorted.findIndex((el) => el.id === id);
    if (index === -1 || index === sorted.length - 1) return; // already on top

    // Swap with the element directly above
    const temp = sorted[index];
    sorted[index] = sorted[index + 1];
    sorted[index + 1] = temp;

    // Re-assign z-index cleanly
    const updatedElements = sorted.map((el, i) => ({ ...el, zIndex: i + 1 }));

    const updatedSelected = updatedElements.find(el => el.id === selectedElement?.id) ?? null;

    set({ elements: updatedElements, selectedElement: updatedSelected });
    get().pushHistory();
  },

  bringElementToFront: (id: string) => {
    const { elements, selectedElement } = get();
    let sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
    const index = sorted.findIndex((el) => el.id === id);
    if (index === -1 || index === sorted.length - 1) return;
    const target = sorted[index];
    sorted.splice(index, 1);
    sorted.push(target);
    const updatedElements = sorted.map((el, i) => ({ ...el, zIndex: i + 1 }));
    const updatedSelected = updatedElements.find(el => el.id === selectedElement?.id) ?? null;
    set({ elements: updatedElements, selectedElement: updatedSelected });
    get().pushHistory();
  },
  sendElementToBack: (id: string) => {
    const { elements, selectedElement } = get();
    let sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
    const index = sorted.findIndex((el) => el.id === id);
    if (index === -1 || index === 0) return;
    const target = sorted[index];
    sorted.splice(index, 1);
    sorted.unshift(target);
    const updatedElements = sorted.map((el, i) => ({ ...el, zIndex: i + 1 }));
    const updatedSelected = updatedElements.find(el => el.id === selectedElement?.id) ?? null;
    set({ elements: updatedElements, selectedElement: updatedSelected });
    get().pushHistory();
  },

  sendElementBackward: (id) => {
    const { elements, selectedElement } = get();

    let sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
    const index = sorted.findIndex((el) => el.id === id);
    if (index === -1 || index === 0) return; // already on bottom

    // Swap with the element directly below
    const temp = sorted[index];
    sorted[index] = sorted[index - 1];
    sorted[index - 1] = temp;

    // Re-assign z-index cleanly
    const updatedElements = sorted.map((el, i) => ({ ...el, zIndex: i + 1 }));

    const updatedSelected = updatedElements.find(el => el.id === selectedElement?.id) ?? null;

    set({ elements: updatedElements, selectedElement: updatedSelected });
    get().pushHistory();
  },

  alignElementToPage: (id: string, align: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'middle') => {
    const { elements, canvasWidth, canvasHeight, selectedElement } = get();
    const element = elements.find((el) => el.id === id);
    if (!element) return;
    const w = element.width;
    const h = element.height;
    // current element center
    const curCenterX = element.x + w / 2;
    const curCenterY = element.y + h / 2;

    let targetCenterX = curCenterX;
    let targetCenterY = curCenterY;

    switch (align) {
      case 'left':
        targetCenterX = w / 2;
        break;
      case 'right':
        targetCenterX = canvasWidth - w / 2;
        break;
      case 'center':
        targetCenterX = canvasWidth / 2;
        break;
      case 'top':
        targetCenterY = h / 2;
        break;
      case 'bottom':
        targetCenterY = canvasHeight - h / 2;
        break;
      case 'middle':
        targetCenterY = getViewportCenterY(get().zoom, canvasHeight);
        break;
    }

    const newX = Math.round(targetCenterX - w / 2);
    const newY = Math.round(targetCenterY - h / 2);

    const updated = elements.map((el) => (el.id === id ? { ...el, x: newX, y: newY } : el));
    const updatedSelected = (selectedElement && selectedElement.id === id) ? { ...selectedElement, x: newX, y: newY } as CanvasElement : selectedElement;
    set({ elements: updated, selectedElement: updatedSelected });
    get().pushHistory();
  },



  // ── History ───────────────────────────────────────────

  pushHistory: () => {
    const { elements, canvasBackground, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      elements: JSON.parse(JSON.stringify(elements)),
      canvasBackground: JSON.parse(JSON.stringify(canvasBackground)),
    });
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    const state = JSON.parse(JSON.stringify(history[newIndex]));
    set({
      elements: state.elements,
      canvasBackground: state.canvasBackground,
      historyIndex: newIndex,
      selectedElement: null
    });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    const state = JSON.parse(JSON.stringify(history[newIndex]));
    set({
      elements: state.elements,
      canvasBackground: state.canvasBackground,
      historyIndex: newIndex,
      selectedElement: null
    });
  },
  // ── Animation ────────────────────────────────────────
  updateAnimationProps: (id, props) => {
    const { elements, selectedElement } = get();
    const updated = elements.map((el) =>
      el.id === id
        ? { ...el, animationProps: { ...(el.animationProps ?? DEFAULT_ANIMATION_PROPS), ...props } }
        : el
    );
    const updatedSelected =
      selectedElement?.id === id
        ? { ...selectedElement, animationProps: { ...(selectedElement.animationProps ?? DEFAULT_ANIMATION_PROPS), ...props } }
        : selectedElement;
    set({ elements: updated, selectedElement: updatedSelected, activeGlobalAnimationPreset: null });
    get().pushHistory();
    get().triggerAnimationPreview();
  },

  applyGlobalAnimation: (presetId, preset) => {
    const { elements, selectedElement } = get();

    // Sort elements by Y coordinate (or zIndex) to determine sequential order.
    const sorted = [...elements].sort((a, b) => a.y - b.y);

    const updated = elements.map((el) => {
      const index = sorted.findIndex(e => e.id === el.id);
      const props = preset(index);
      return {
        ...el,
        animationProps: { ...(el.animationProps ?? DEFAULT_ANIMATION_PROPS), ...props }
      };
    });

    const updatedSelected = selectedElement
      ? updated.find(el => el.id === selectedElement.id) ?? null
      : null;

    set({ elements: updated, selectedElement: updatedSelected, activeGlobalAnimationPreset: presetId });
    get().pushHistory();
    get().triggerAnimationPreview();
  },

  triggerAnimationPreview: () => {
    set((state) => ({ animationPreviewTick: state.animationPreviewTick + 1 }));
  },

  // ── Reset về bản trắng ────────────────────────────────
  resetEditorToBlank: () => {
    set({
      ...INITIAL_STATE,
      elements: [],
      selectedElement: null,
      history: [{ elements: [], canvasBackground: INITIAL_BACKGROUND }],
      historyIndex: 0,
      cardId: null,
      templateId: null,
      music: null,
      canvasBackground: INITIAL_BACKGROUND,
      editorMode: 'card',
      isLoadingEditor: false,
      autoSaveStatus: 'idle',
      lastSavedData: null,
    });
  },

  // ── Auto-save ─────────────────────────────────────────
  setCardId: (id) => set({ cardId: id }),
  setAutoSaveStatus: (status) => set({ autoSaveStatus: status }),

  saveCanvasNow: async () => {
    let currentCardId = get().cardId;

    if (!currentCardId) {
      set({ autoSaveStatus: 'saving' });
      try {
        const newCard = await cardsApi.createCard({
          title: 'Thiết kế mới',
        });
        currentCardId = newCard.id;
        set({ cardId: currentCardId });

        // Cập nhật URL trên trình duyệt để thêm ?id=...
        const url = new URL(window.location.href);
        url.searchParams.set('id', currentCardId as string);
        window.history.replaceState({}, '', url.toString());
      } catch (err) {
        console.error('[saveCanvasNow] Create new card failed:', err);
        set({ autoSaveStatus: 'error' });
        return;
      }
    }

    const { elements, canvasBackground, music, canvasWidth, canvasHeight, autoScroll, autoScrollSpeed, coverPageProps, lastSavedData } = get();

    const currentDataStr = JSON.stringify({ elements, canvasBackground, music, canvasWidth, canvasHeight, autoScroll, autoScrollSpeed, coverPageProps });
    if (currentDataStr === lastSavedData) return;

    set({ autoSaveStatus: 'saving' });
    try {
      // Map elements → CanvasBlockPayload
      const blocks: CanvasBlockPayload[] = elements.map((el) => ({
        id: el.id,
        blockType:
          el.type === 'text' ? 'text'
            : el.type === 'image' ? 'image'
              : el.type === 'shape' ? 'shape'
                : el.type === 'countdown' ? 'countdown'
                  : el.type === 'map' ? 'map'
                    : el.type === 'qr_code' ? 'qr_code'
                      : el.type === 'calendar' ? 'calendar'
                        : el.type === 'album' ? 'gallery'
                          : el.type === 'form' ? 'rsvp_form'
                            : el.type === 'button_contact' ? 'button'
                              : 'text',
        posX: el.x,
        posY: el.y,
        width: el.width,
        height: el.height,
        rotation: el.rotation,
        zIndex: el.zIndex,
        content: (() => {
          if (el.type === 'text') return el.textProps as object ?? {};
          if (el.type === 'image') return el.imageProps as object ?? {};
          if (el.type === 'shape') return el.shapeProps as object ?? {};
          if (el.type === 'countdown') return el.countdownProps as object ?? {};
          if (el.type === 'map') return el.mapProps as object ?? {};
          if (el.type === 'qr_code') return el.qrGiftBoxProps as object ?? {};
          if (el.type === 'calendar') return el.calendarProps as object ?? {};
          if (el.type === 'album') return el.albumProps as object ?? {};
          if (el.type === 'form') return el.formProps as object ?? {};
          if (el.type === 'button_contact') return el.buttonContactProps as object ?? {};
          return {};
        })(),
        style: el.animationProps ? (el.animationProps as object) : {},
        isLocked: false,
        isVisible: true,
      }));

      const settings = {
        ...(music ? { music } : {}),
        canvasHeight: get().canvasHeight,
        canvasWidth: get().canvasWidth,
        autoScroll: get().autoScroll,
        autoScrollSpeed: get().autoScrollSpeed,
        coverPage: get().coverPageProps,
      };

      await cardsApi.saveCanvas(currentCardId as string, {
        blocks,
        background: canvasBackground as object,
        settings,
      });

      // DB đã lưu xong → báo 'saved' ngay, không chờ thumbnail
      set({ autoSaveStatus: 'saved', lastSavedData: currentDataStr });
      setTimeout(() => {
        const currentStatus = get().autoSaveStatus;
        if (currentStatus === 'saved') set({ autoSaveStatus: 'idle' });
      }, 3000);

      // Capture & upload thumbnail NGẦM (fire-and-forget, không block UI)
      void (async () => {
        try {
          const node = document.getElementById('editor-canvas-frame');
          if (node) {
            const canvas = await toCanvas(node, { cacheBust: true, useCORS: true, allowTaint: true } as any);
            const blob = await new Promise<Blob | null>((resolve) => {
              canvas.toBlob((b) => resolve(b), 'image/webp', 0.8);
            });
            if (blob) {
              await cardsApi.uploadCardThumbnail(currentCardId as string, blob);
            }
          }
        } catch (thumbErr) {
          console.warn('[saveCanvasNow] Thumbnail upload failed (non-critical):', thumbErr);
        }
      })();
    } catch (err) {
      console.error('[AutoSave] Failed:', err);
      set({ autoSaveStatus: 'error' });
    }
  },

  loadCardData: async (cardId: string) => {
    set({ cardId, editorMode: 'card', isLoadingEditor: true });
    try {
      const card = await cardsApi.getCard(cardId);
      // Map blocks → elements
      const elements = (card.blocks ?? []).map((block: any) => {
        const base = {
          id: block.id,
          x: block.posX,
          y: block.posY,
          width: block.width,
          height: block.height,
          rotation: block.rotation,
          zIndex: block.zIndex,
          isSelected: false,
          animationProps: block.style ?? undefined,
        };
        if (block.blockType === 'text') {
          return { ...base, type: 'text' as const, textProps: block.content };
        } else if (block.blockType === 'image') {
          return { ...base, type: 'image' as const, imageProps: block.content };
        } else if (block.blockType === 'shape') {
          return { ...base, type: 'shape' as const, shapeProps: block.content };
        } else if (block.blockType === 'countdown') {
          return { ...base, type: 'countdown' as const, countdownProps: block.content };
        } else if (block.blockType === 'map') {
          return { ...base, type: 'map' as const, mapProps: block.content };
        } else if (block.blockType === 'qr_code') {
          return { ...base, type: 'qr_code' as const, qrGiftBoxProps: block.content };
        } else if (block.blockType === 'calendar') {
          return { ...base, type: 'calendar' as const, calendarProps: block.content };
        } else if (block.blockType === 'gallery') {
          return { ...base, type: 'album' as const, albumProps: block.content };
        } else if (block.blockType === 'rsvp_form') {
          return { ...base, type: 'form' as const, formProps: block.content };
        } else if (block.blockType === 'button') {
          return { ...base, type: 'button_contact' as const, buttonContactProps: block.content };
        }
        return { ...base, type: 'text' as const, textProps: block.content };
      });

      const background = card.background ?? get().canvasBackground;
      const music = card.settings?.music ?? null;
      let height = card.canvasHeight ?? card.settings?.canvasHeight ?? (card.background as any)?.canvasHeight ?? get().canvasHeight;
      // Auto-expand height if elements are out of bounds
      if (elements.length > 0) {
        const maxElementY = Math.max(...elements.map((el: any) => el.y + el.height));
        if (maxElementY + 100 > height) {
          height = maxElementY + 100;
        }
      }
      const autoScroll = card.settings?.autoScroll ?? (card.background as any)?.autoScroll ?? false;
      const autoScrollSpeed = card.settings?.autoScrollSpeed ?? (card.background as any)?.autoScrollSpeed ?? 50;

      set({
        cardId,
        elements,
        canvasBackground: background,
        music,
        canvasWidth: card.settings?.canvasWidth ?? card.canvasWidth ?? get().canvasWidth,
        canvasHeight: height,
        autoScroll,
        autoScrollSpeed,
        coverPageProps: card.settings?.coverPage ?? DEFAULT_COVER_PAGE_PROPS,
        history: [{ elements, canvasBackground: background }],
        historyIndex: 0,
        selectedElement: null,
        isLoadingEditor: false,
      });
      set({ lastSavedData: JSON.stringify({ elements, canvasBackground: background, music, canvasWidth: card.canvasWidth ?? get().canvasWidth, canvasHeight: height, autoScroll, autoScrollSpeed, coverPageProps: card.settings?.coverPage ?? DEFAULT_COVER_PAGE_PROPS }) });
    } catch (err) {
      console.error('[loadCardData] Failed:', err);
      set({ isLoadingEditor: false });
    }
  },

  // ── Template Editor ────────────────────────────────────
  loadTemplateData: async (templateId: string) => {
    // mark loading state so UI can show a loading screen
    set({ templateId, editorMode: 'template', isLoadingEditor: true });
    try {
      const template = await templatesEditorApi.getTemplateCanvas(templateId);
      const elements = (template.blocks ?? []).map((block: any) => {
        const base = {
          id: block.id,
          x: block.posX,
          y: block.posY,
          width: block.width,
          height: block.height,
          rotation: block.rotation,
          zIndex: block.zIndex,
          isSelected: false,
          animationProps: block.style ?? undefined,
        };
        if (block.blockType === 'text') {
          return { ...base, type: 'text' as const, textProps: block.content };
        } else if (block.blockType === 'image') {
          return { ...base, type: 'image' as const, imageProps: block.content };
        } else if (block.blockType === 'shape') {
          return { ...base, type: 'shape' as const, shapeProps: block.content };
        } else if (block.blockType === 'countdown') {
          return { ...base, type: 'countdown' as const, countdownProps: block.content };
        } else if (block.blockType === 'map') {
          return { ...base, type: 'map' as const, mapProps: block.content };
        } else if (block.blockType === 'qr_code') {
          return { ...base, type: 'qr_code' as const, qrGiftBoxProps: block.content };
        } else if (block.blockType === 'calendar') {
          return { ...base, type: 'calendar' as const, calendarProps: block.content };
        } else if (block.blockType === 'gallery') {
          return { ...base, type: 'album' as const, albumProps: block.content };
        } else if (block.blockType === 'rsvp_form') {
          return { ...base, type: 'form' as const, formProps: block.content };
        } else if (block.blockType === 'button') {
          return { ...base, type: 'button_contact' as const, buttonContactProps: block.content };
        }
        return { ...base, type: 'text' as const, textProps: block.content };
      });

      const background = template.background ?? get().canvasBackground;
      let height = template.canvasHeight ?? template.background?.canvasHeight ?? get().canvasHeight;
      // Auto-expand height if elements are out of bounds
      if (elements.length > 0) {
        const maxElementY = Math.max(...elements.map((el: any) => el.y + el.height));
        if (maxElementY + 100 > height) {
          height = maxElementY + 100;
        }
      }
      const autoScroll = template.background?.autoScroll ?? false;
      const autoScrollSpeed = template.background?.autoScrollSpeed ?? 50;
      const music = template.background?.music ?? null;

      set({
        templateId,
        editorMode: 'template',
        elements,
        canvasBackground: background,
        music,
        canvasWidth: template.canvasWidth ?? get().canvasWidth,
        canvasHeight: height,
        autoScroll,
        autoScrollSpeed,
        coverPageProps: template.background?.coverPage ?? DEFAULT_COVER_PAGE_PROPS,
        history: [{ elements, canvasBackground: background }],
        historyIndex: 0,
        selectedElement: null,
        autoSaveStatus: 'idle',
        isLoadingEditor: false,
      });
      const mappedElements = get().elements;
      set({ lastSavedData: JSON.stringify({ elements: mappedElements, canvasBackground: background, music, canvasWidth: template.canvasWidth ?? get().canvasWidth, canvasHeight: height, autoScroll, autoScrollSpeed, coverPageProps: template.background?.coverPage ?? DEFAULT_COVER_PAGE_PROPS }) });
    } catch (err) {
      console.error('[loadTemplateData] Failed:', err);
      // ensure loading flag cleared on error
      set({ isLoadingEditor: false });
    }
  },

  saveTemplateNow: async () => {
    const { templateId, elements, canvasBackground, music, canvasWidth, canvasHeight, autoScroll, autoScrollSpeed, coverPageProps, lastSavedData } = get();
    if (!templateId) return;

    const currentDataStr = JSON.stringify({ elements, canvasBackground, music, canvasWidth, canvasHeight, autoScroll, autoScrollSpeed, coverPageProps });
    if (currentDataStr === lastSavedData) return;

    set({ autoSaveStatus: 'saving' });
    try {
      const blocks: CanvasBlockPayload[] = elements.map((el) => ({
        blockType:
          el.type === 'text' ? 'text'
            : el.type === 'image' ? 'image'
              : el.type === 'shape' ? 'shape'
                : el.type === 'countdown' ? 'countdown'
                  : el.type === 'map' ? 'map'
                    : el.type === 'qr_code' ? 'qr_code'
                      : el.type === 'calendar' ? 'calendar'
                        : el.type === 'album' ? 'gallery'
                          : el.type === 'form' ? 'rsvp_form'
                            : el.type === 'button_contact' ? 'button'
                              : 'text',
        posX: el.x,
        posY: el.y,
        width: el.width,
        height: el.height,
        rotation: el.rotation,
        zIndex: el.zIndex,
        content: (() => {
          if (el.type === 'text') return el.textProps as object ?? {};
          if (el.type === 'image') return el.imageProps as object ?? {};
          if (el.type === 'shape') return el.shapeProps as object ?? {};
          if (el.type === 'countdown') return el.countdownProps as object ?? {};
          if (el.type === 'map') return el.mapProps as object ?? {};
          if (el.type === 'qr_code') return el.qrGiftBoxProps as object ?? {};
          if (el.type === 'calendar') return el.calendarProps as object ?? {};
          if (el.type === 'album') return el.albumProps as object ?? {};
          if (el.type === 'form') return el.formProps as object ?? {};
          if (el.type === 'button_contact') return el.buttonContactProps as object ?? {};
          return {};
        })(),
        style: el.animationProps ? (el.animationProps as object) : {},
        isLocked: false,
      }));

      await templatesEditorApi.saveTemplateCanvas(templateId, {
        blocks,
        canvasWidth: get().canvasWidth,
        background: {
          ...(canvasBackground as object),
          canvasHeight: get().canvasHeight,
          autoScroll: get().autoScroll,
          autoScrollSpeed: get().autoScrollSpeed,
          coverPage: get().coverPageProps,
          music: get().music,
        },
      });

      // DB đã lưu xong → báo 'saved' ngay, không chờ thumbnail
      set({ autoSaveStatus: 'saved', lastSavedData: currentDataStr });
      setTimeout(() => {
        if (get().autoSaveStatus === 'saved') set({ autoSaveStatus: 'idle' });
      }, 3000);

      // Capture & upload thumbnail NGẦM (fire-and-forget, không block UI)
      void (async () => {
        try {
          const node = document.getElementById('editor-canvas-frame');
          if (node) {
            const canvas = await toCanvas(node, { cacheBust: true, useCORS: true, allowTaint: true } as any);
            const blob = await new Promise<Blob | null>((resolve) => {
              canvas.toBlob((b) => resolve(b), 'image/webp', 0.8);
            });
            if (blob) {
              await templatesEditorApi.uploadTemplateThumbnail(templateId, blob);
            }
          }
        } catch (thumbErr) {
          console.warn('[saveTemplateNow] Thumbnail upload failed (non-critical):', thumbErr);
        }
      })();
    } catch (err) {
      console.error('[saveTemplateNow] Failed:', err);
      set({ autoSaveStatus: 'error' });
    }
  },
}));


