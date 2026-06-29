// ============================================================
// EDITOR STORE - Zustand state management for the editor
// ============================================================

import { create } from 'zustand';
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

// ── Default property sets ────────────────────────────────
export const DEFAULT_ANIMATION_PROPS: AnimationProperties = {
  entryEnabled: false,
  entryEffect: 'none',
  entryDuration: 1,
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
  borderColor: '#e0c4a8',
  borderRadius: 4,
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowColor: 'rgba(0,0,0,0.3)',
  letterSpacing: 0,
  lineHeight: 1.5,
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
  setCropElementId: (id: string | null) => void;
  updateElementCrop: (id: string, cropData: ImageCropData, newWidth: number, newHeight: number) => void;
  updateCanvasBackground: (props: Partial<BackgroundProperties>) => void;
  addRecentColor: (color: string) => void;
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
  activeTool: 'text',
  selectedElement: INITIAL_ELEMENTS[0],
  elements: INITIAL_ELEMENTS,
  uploadedImages: [],
  uploadedMusics: [],
  zoom: 100,
  showGrid: true,
  canvasWidth: 400,
  canvasHeight: 566,
  cropElementId: null,
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
};

// ── Store ─────────────────────────────────────────────────
export const useEditorStore = create<EditorState & EditorActions>((set, get) => ({
  ...INITIAL_STATE,

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
      y: 80 + Math.random() * 100,
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
    const defaultY = y !== undefined ? y : 50 + Math.random() * 80;
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

  // ── Add shape element ─────────────────────────────────
  addShapeElement: (shapeType) => {
    const { elements } = get();
    const id = `el-shape-${Date.now()}`;
    const x = 50 + Math.random() * 80;
    const y = 50 + Math.random() * 80;

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



  // ── Update text prop ──────────────────────────────────
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
  }
}));

