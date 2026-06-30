
import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as fabric from 'fabric';
import { EditorSidebar } from './components/EditorSidebar';
import { EditorRightPanel } from './components/EditorRightPanel';
import type { ActiveTool} from '../../types/editor';
import { Eye, RotateCcw, RotateCw, Plus, Trash2, X, ZoomIn, ZoomOut, Sparkles, Copy, Layers, ArrowUp, ArrowDown, Loader2, Check } from 'lucide-react';
import { cardsApi } from '../../services/api';
import type { WeddingCard } from '../../services/api';
import { useToast, useConfirm } from '../../components/ToastProvider';

const MOCK_TEMPLATE_DB: Record<string, any> = {
  'blank': {
    background: '#ffffff',
    objects: [],
  },
  '1': {
    background: '#ffffff',
    objects: [
      { type: 'textbox', text: 'SAVE THE DATE', left: 0, top: 120, width: 390, fontSize: 11, fill: '#e11d48', textAlign: 'center', fontWeight: 'bold', charSpacing: 200 },
      { type: 'textbox', text: '{{BRIDE}}', left: 0, top: 260, width: 390, fontSize: 48, fontFamily: 'serif', textAlign: 'center', fill: '#1e293b', fontStyle: 'italic' },
      { type: 'textbox', text: '&', left: 0, top: 330, width: 390, fontSize: 24, fontFamily: 'serif', textAlign: 'center', fill: '#cbd5e1' },
      { type: 'textbox', text: '{{GROOM}}', left: 0, top: 370, width: 390, fontSize: 48, fontFamily: 'serif', textAlign: 'center', fill: '#1e293b', fontStyle: 'italic' },
    ],
  },
  '2': {
    background: '#f8e8d4',
    objects: [
      { type: 'textbox', text: 'LỄ THÀNH HÔN', left: 0, top: 100, width: 390, fontSize: 14, fill: '#8b5a2b', textAlign: 'center', fontWeight: 'bold', charSpacing: 150 },
      { type: 'textbox', text: '{{BRIDE}}', left: 0, top: 200, width: 390, fontSize: 52, fontFamily: 'cursive', textAlign: 'center', fill: '#8b5a2b' },
      { type: 'textbox', text: '{{GROOM}}', left: 0, top: 320, width: 390, fontSize: 52, fontFamily: 'cursive', textAlign: 'center', fill: '#8b5a2b' },
    ],
  },
  '3': {
    background: '#1a1a2e',
    objects: [
      { type: 'textbox', text: '{{BRIDE}}', left: 0, top: 220, width: 390, fontSize: 44, fontFamily: 'serif', textAlign: 'center', fill: '#ffd700', fontWeight: 'bold' },
      { type: 'textbox', text: '{{GROOM}}', left: 0, top: 330, width: 390, fontSize: 44, fontFamily: 'serif', textAlign: 'center', fill: '#ffd700', fontWeight: 'bold' },
    ],
  },
  '4': {
    background: '#ff9a9e',
    objects: [
      { type: 'textbox', text: '{{BRIDE}} & {{GROOM}}', left: 0, top: 220, width: 390, fontSize: 38, fontFamily: 'sans-serif', textAlign: 'center', fill: '#ffffff', fontWeight: 'bold' },
    ],
  },
};

const CardParticleEngine = ({ effectType }: { effectType: string | null }) => {
  if (!effectType) return null;

  const getEffectConfig = () => {
    switch (effectType) {
      case 'flower': return { icons: ['🌸', '🌺', '💮', '🥀'], type: 'fall', count: 18 };
      case 'bubble': return { icons: ['🫧', '◯', '⚪'], type: 'rise', count: 22 };
      case 'heart': return { icons: ['❤️', '💖', '💕', '💗', '🫶'], type: 'rise', count: 18 };
      case 'snow': return { icons: ['❄️', '❅', '❆'], type: 'fall', count: 28 };
      case 'firework': return { icons: ['🎆', '🎇', '✨', '💥'], type: 'burst', count: 8 };
      case 'candle': return { icons: ['🕯️'], type: 'candle', count: 6 };
      default: return { icons: ['✨'], type: 'fall', count: 10 };
    }
  };

  const config = getEffectConfig();

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden select-none">
      <style>{`
        @keyframes animFall {
          0% { transform: translateY(0px) translateX(0) rotate(0deg); opacity: 0; }
          15% { opacity: 0.9; }
          85% { opacity: 0.9; }
          100% { transform: translateY(880px) translateX(30px) rotate(360deg); opacity: 0; }
        }
        @keyframes animRise {
          0% { transform: translateY(0px) translateX(0) scale(0.6) rotate(0deg); opacity: 0; }
          15% { opacity: 0.9; }
          85% { opacity: 0.9; }
          100% { transform: translateY(-880px) translateX(-25px) scale(1.2) rotate(-20deg); opacity: 0; }
        }
        @keyframes animBurst {
          0% { transform: scale(0); opacity: 1; }
          50% { transform: scale(1.6); opacity: 0.9; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes animCandle {
          0%, 100% { opacity: 1; transform: scale(1); filter: drop-shadow(0 0 8px rgba(255,180,0,0.8)); }
          50% { opacity: 0.7; transform: scale(0.97); filter: drop-shadow(0 0 3px rgba(255,180,0,0.3)); }
        }
      `}</style>

      {Array.from({ length: config.count }).map((_, i) => {
        const icon = config.icons[i % config.icons.length];
        const leftPos = Math.random() * 90 + 5; 
        
        let size = 16 + Math.random() * 14; 
        let animStyle = '';
        let startTop = '';

        if (config.type === 'fall') {
          const dur = 4 + Math.random() * 4; 
          const negativeDelay = -(Math.random() * dur); 
          animStyle = `animFall ${dur}s linear infinite ${negativeDelay}s`;
          startTop = '-20px';
        } 
        else if (config.type === 'rise') {
          const dur = 4 + Math.random() * 4; 
          const negativeDelay = -(Math.random() * dur); 
          animStyle = `animRise ${dur}s linear infinite ${negativeDelay}s`;
          startTop = '860px'; 
        } 
        else if (config.type === 'burst') {
          const dur = 1.2 + Math.random() * 1.5;
          animStyle = `animBurst ${dur}s ease-out infinite ${Math.random() * 2}s`;
          startTop = `${10 + Math.random() * 45}%`;
          size += 12;
        } 
        else if (config.type === 'candle') {
          const dur = 1 + Math.random();
          animStyle = `animCandle ${dur}s ease-in-out infinite ${Math.random()}s`;
          startTop = `${82 + Math.random() * 12}%`;
          size = 26 + Math.random() * 8;
        }

        return (
          <span
            key={i}
            className="absolute block"style={{ left: `${leftPos}%`, top: startTop,fontSize: `${size}px`, animation: animStyle,
            }}
          >
            {icon}
          </span>
        );
      })}
    </div>
  );
};

export const WeddingCanvasEditor: React.FC = () => {
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const confirm = useConfirm();
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  const passedCardId = searchParams.get('cardId');
  const passedTplId = searchParams.get('templateId') || 'blank';
  const passedBride = searchParams.get('bride') || 'Cô Dâu';
  const passedGroom = searchParams.get('groom') || 'Chú Rể';
  const passedTitle = searchParams.get('title') || `${passedBride} & ${passedGroom}`;

  const [activeTool, setActiveTool] = useState<ActiveTool>('select');
  const [selectedProps, setSelectedProps] = useState<any>(null); 
  const [showPublishModal, setShowPublishModal] = useState(false);

  const [canvasWidth, setCanvasWidth] = useState(390);
  const [canvasHeight, setCanvasHeight] = useState(844);
  const [zoomRatio, setZoomRatio] = useState(1);
  const [activeEffect, setActiveEffect] = useState<string | null>(null);

  const [toolbarPos, setToolbarPos] = useState({ show: false, top: 0, left: 0 });
  const [showLayerMenu, setShowLayerMenu] = useState(false); 
  
  const [pages, setPages] = useState([
    { id: 'p1', name: 'Trang Bìa (Cover)', data: null as any },
  ]);
  const [activePageIndex, setActivePageIndex] = useState(0);

  const [_card, setCard] = useState<WeddingCard | null>(null);
  const [cardId, setCardId] = useState<string | null>(passedCardId);
  const [isReady, setIsReady] = useState(false); 
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  const [publishForm, setPublishForm] = useState({ weddingDate: '', weddingTime: '18:30', venue: '' });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (passedCardId) {
          const existing = await cardsApi.get(passedCardId);
          if (!active) return;
          setCard(existing);
          setCardId(existing.id);
          setPublishForm({
            weddingDate: existing.weddingDate || '',
            weddingTime: existing.weddingTime || '18:30',
            venue: existing.venue || '',
          });
          if (existing.canvasData?.pages?.length) {
            setPages(existing.canvasData.pages);
            if (existing.canvasData.canvasWidth) setCanvasWidth(existing.canvasData.canvasWidth);
            if (existing.canvasData.canvasHeight) setCanvasHeight(existing.canvasData.canvasHeight);
          }
        } else {
          const draft = await cardsApi.create({ title: passedTitle, bride: passedBride, groom: passedGroom });
          if (!active) return;
          setCard(draft);
          setCardId(draft.id);
        }
      } catch (e: any) {
        toast.error(e?.message || 'Không thể khởi tạo thiệp, vui lòng thử lại');
      } finally {
        if (active) setIsReady(true);
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!isReady || !canvasElRef.current) return;

    const canvas = new fabric.Canvas(canvasElRef.current, { 
      width: canvasWidth, 
      height: canvasHeight,
      preserveObjectStacking: true 
    });
    fabricRef.current = canvas;

    fabric.Object.prototype.set({
      borderColor: '#f43f5e',
      cornerColor: '#ffffff',
      cornerStrokeColor: '#f43f5e',
      cornerSize: 10,
      transparentCorners: false,
    });
    

    const existingPageData = pages[0]?.data;

    if (existingPageData) {
      canvas.loadFromJSON(existingPageData, () => canvas.renderAll());
    } else {

      const templateLayout = MOCK_TEMPLATE_DB[passedTplId] || MOCK_TEMPLATE_DB['blank'];
      canvas.backgroundColor = templateLayout.background;

      const customObjects = templateLayout.objects.map((obj: any) => {
        if (obj.type === 'textbox') {
          return { ...obj, text: obj.text.replace(/{{BRIDE}}/g, passedBride).replace(/{{GROOM}}/g, passedGroom) };
        }
        return obj;
      });

      canvas.loadFromJSON({ background: templateLayout.background, objects: customObjects }, () => {
        canvas.renderAll();
        setPages((prev) => {
          const newPages = [...prev];
          newPages[0].data = canvas.toJSON();
          return newPages;
        });
      });
    }

    const updateToolbar = () => {
      const obj = canvas.getActiveObject() as any;
      if (!obj) {
        setToolbarPos({ show: false, top: 0, left: 0 });
        setShowLayerMenu(false);
        setSelectedProps(null);
        return;
      }

      const bound = obj.getBoundingRect();
      setToolbarPos({
        show: true,
        top: bound.top - 55,
        left: bound.left + (bound.width / 2)
      });

      setSelectedProps({
        type: obj.type, text: obj.text,
        fontSize: obj.fontSize, fill: obj.fill,
        fontFamily: obj.fontFamily, textAlign: obj.textAlign,
        opacity: obj.opacity, fontWeight: obj.fontWeight,
        fontStyle: obj.fontStyle, strokeWidth: obj.strokeWidth,
        stroke: obj.stroke, charSpacing: obj.charSpacing,
        lineHeight: obj.lineHeight, rx: obj.rx, ry: obj.ry,
        backgroundColor: obj.backgroundColor,
        widgetType: obj.data?.widgetType,
        widgetData: obj.data?.widgetData || {}
      });
    };

    canvas.on('selection:created', updateToolbar);
    canvas.on('selection:updated', updateToolbar);
    canvas.on('selection:cleared', updateToolbar);
    canvas.on('object:moving', updateToolbar);
    canvas.on('object:scaling', updateToolbar);
    canvas.on('object:rotating', updateToolbar);

    return () => {
      canvas.dispose();
    };
   
  }, [isReady, passedTplId, passedBride, passedGroom, canvasWidth, canvasHeight]);

  const updateProp = (key: string, val: any) => {
    const obj = fabricRef.current?.getActiveObject() as any;
    if (obj) {
      obj.set(key, val);
      fabricRef.current?.renderAll();
      setSelectedProps((prev: any) => (prev ? { ...prev, [key]: val } : prev));
    }
  };

  const computeCountdownValues = (dateStr: string, timeStr: string) => {
    const target = new Date(`${dateStr}T${timeStr}:00`);
    if (Number.isNaN(target.getTime())) return ['00', '00', '00', '00'];
    let diff = Math.max(0, target.getTime() - Date.now());
    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const minutes = Math.floor(diff / 60000);
    diff -= minutes * 60000;
    const seconds = Math.floor(diff / 1000);
    return [
      String(days).padStart(2, '0'),
      String(hours).padStart(2, '0'),
      String(minutes).padStart(2, '0'),
      String(seconds).padStart(2, '0'),
    ];
  };

  const refreshCountdownWidgets = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const objects = canvas.getObjects();

    let needsRender = false;
    objects.forEach((obj: any) => {
      if (obj.data?.widgetType === 'countdown') {
        const data = obj.data.widgetData || { date: '2026-06-29', time: '18:30', lang: 'vi' };
        const values = computeCountdownValues(data.date, data.time);
        let widgetChanged = false;
        const children = obj.getObjects?.() || [];
        children.forEach((child: any) => {
          if (child?.widgetItemId?.startsWith('countdown-value-')) {
            const part = Number(child.widgetItemId.split('-').pop());
            if (part >= 0 && values[part] && child.text !== values[part]) {
              child.set('text', values[part]);
              widgetChanged = true;
            }
          }
          if (child?.widgetItemId?.startsWith('countdown-label-')) {
            const part = Number(child.widgetItemId.split('-').pop());
            const label = part === 0 ? (data.lang === 'en' ? 'Days' : 'Ngày')
              : part === 1 ? (data.lang === 'en' ? 'Hours' : 'Giờ')
              : part === 2 ? (data.lang === 'en' ? 'Minutes' : 'Phút')
              : (data.lang === 'en' ? 'Seconds' : 'Giây');
            if (child.text !== label) {
              child.set('text', label);
              widgetChanged = true;
            }
          }
        });
        if (widgetChanged) {
          obj.addWithUpdate?.();
          needsRender = true;
        }
      }
    });
    if (needsRender) {
      canvas.renderAll();
    }
  };

  useEffect(() => {
    const interval = setInterval(refreshCountdownWidgets, 1000);
    refreshCountdownWidgets();
    return () => clearInterval(interval);
  }, []);

  const GM_APY_KEY = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';

  const loadStaticMapForObject = async (mapObj: any, lat: string | number, lng: string | number, zoom = 15, useGoogle = false) => {
    try {
      const wRect = mapObj.getObjects().find((o: any) => o.type === 'rect');
      const rectWidth = wRect?.width || 320;
      const rectHeight = wRect?.height || 200;
      const width = Math.max(200, Math.round(rectWidth));
      const height = Math.max(120, Math.round(rectHeight));
      let mapUrl = '';
      if (useGoogle && GM_APY_KEY) {
        mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&scale=2&markers=color:red%7C${lat},${lng}&key=${GM_APY_KEY}`;
      } else {
        mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&markers=${lat},${lng},red-pushpin`;
      }
      const img = await fabric.Image.fromURL(mapUrl, { crossOrigin: 'anonymous' } as any) as any;
      if (!img) return;
      img.set({ originX: 'center', originY: 'center', left: 0, top: 0 });
      if (wRect) {
        img.scaleToWidth(wRect.width || width);
      }
      const existing = mapObj.getObjects().find((o: any) => o.type === 'image');
      if (existing) mapObj.remove(existing);
      mapObj.addWithUpdate?.(img);
      fabricRef.current?.renderAll();
    } catch (e) {
      console.error('[map] failed to load static map', e);
    }
  };

  const geocodeAddress = async (address: string) => {
    try {
      if (GM_APY_KEY) {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GM_APY_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data && data.results && data.results[0]) {
          const loc = data.results[0].geometry.location;
          return { lat: loc.lat, lng: loc.lng, provider: 'google' };
        }
      }
      const nom = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
      const r2 = await fetch(nom, { headers: { 'User-Agent': 'OnlineWeddingEditor/1.0' } });
      const d2 = await r2.json();
      if (d2 && d2[0]) {
        return { lat: Number(d2[0].lat), lng: Number(d2[0].lon), provider: 'nominatim' };
      }
    } catch (e) {
      console.error('[map] geocode error', e);
    }
    return null;
  };

  const updateWidgetData = (key: string, val: any) => {
    const obj = fabricRef.current?.getActiveObject() as any;
    if (obj && obj.data && obj.data.widgetType) {
      obj.data.widgetData = { ...obj.data.widgetData, [key]: val };
    
      if (obj.data.widgetType === 'contact') {
        const textNode = obj.getObjects().find((o: any) => o.widgetItemId === 'btnText');
        if (textNode) {
          textNode.set('text', (obj.data.widgetData.showIcon !== false ? '📞 ' : '') + (obj.data.widgetData.buttonText || 'Liên hệ'));
          obj.addWithUpdate();
        }
        const phoneNode = obj.getObjects().find((o: any) => o.widgetItemId === 'contactPhone');
        if (phoneNode) {
          phoneNode.set('text', obj.data.widgetData.phone || '');
          obj.addWithUpdate();
        }
      }
      if (obj.data.widgetType === 'map' && ['address','lat','lng','zoom'].includes(key)) {
        const textNode = obj.getObjects().find((o: any) => o.widgetItemId === 'mapText');
        if (textNode) { textNode.set('text', obj.data.widgetData.address || val || 'Tọa độ GPS...'); }
        (async () => {
          const wd = obj.data.widgetData || {};
          if (key === 'address' && wd.address) {
            const g = await geocodeAddress(wd.address);
            if (g) {
              obj.data.widgetData.lat = g.lat;
              obj.data.widgetData.lng = g.lng;
              await loadStaticMapForObject(obj, g.lat, g.lng, wd.zoom || 15, g.provider === 'google');
            }
          } else if (wd.lat && wd.lng) {
            await loadStaticMapForObject(obj, wd.lat, wd.lng, wd.zoom || 15, !!GM_APY_KEY);
          }
          obj.addWithUpdate?.();
        })();
      }
      if (obj.data.widgetType === 'qr' && key === 'title') {
        const textNode = obj.getObjects().find((o: any) => o.widgetItemId === 'qrTitle');
        if (textNode) { textNode.set('text', val || 'Hộp Quà Yêu Thương'); obj.addWithUpdate(); }
      }
      if (obj.data.widgetType === 'countdown' && ['date', 'time', 'lang'].includes(key)) {
        const data = obj.data.widgetData || {};
        const values = computeCountdownValues(data.date, data.time);
        obj.getObjects().forEach((child: any) => {
          if (child?.text && typeof child.text === 'string' && child.widgetItemId?.startsWith('countdown-value-')) {
            const part = Number(child.widgetItemId.split('-').pop());
            if (part >= 0 && values[part]) child.set('text', values[part]);
          }
          if (child?.text && typeof child.text === 'string' && child.widgetItemId?.startsWith('countdown-label-')) {
            const part = Number(child.widgetItemId.split('-').pop());
            if (part === 0) child.set('text', data.lang === 'en' ? 'Days' : 'Ngày');
            if (part === 1) child.set('text', data.lang === 'en' ? 'Hours' : 'Giờ');
            if (part === 2) child.set('text', data.lang === 'en' ? 'Minutes' : 'Phút');
            if (part === 3) child.set('text', data.lang === 'en' ? 'Seconds' : 'Giây');
          }
        });
        obj.addWithUpdate();
      }
      
      fabricRef.current?.renderAll();
      setSelectedProps((prev: any) => prev ? { ...prev, widgetData: obj.data.widgetData } : prev);
    }
  };

  const handleDuplicate = () => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!obj || !canvas) return;
    obj.clone().then((clonedObj: any) => {
      clonedObj.set({ left: obj.left! + 20, top: obj.top! + 20, evented: true });
      canvas.add(clonedObj);
      canvas.setActiveObject(clonedObj);
      canvas.requestRenderAll();
    });
  };

  const deleteObj = () => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (obj) {
      canvas?.remove(obj);
      canvas?.discardActiveObject();
      canvas?.renderAll();
      setSelectedProps(null);
      setToolbarPos({ show: false, top: 0, left: 0 });
    }
  };

  const switchPage = (index: number) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const updatedPages = [...pages];
    updatedPages[activePageIndex].data = canvas.toJSON();
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    if (updatedPages[index].data) {
      canvas.loadFromJSON(updatedPages[index].data, () => canvas.renderAll());
    } else {
      const pageTitle = new fabric.Textbox(updatedPages[index].name, {
        left: 0,
        top: 200,
        width: canvasWidth,
        fontSize: 32,
        textAlign: 'center',
        fill: '#94a3b8',
      });
      canvas.add(pageTitle);
    }
    setPages(updatedPages);
    setActivePageIndex(index);
    setSelectedProps(null);
  };

  const handleDeletePage = async (idx: number) => {
    const ok = await confirm({
      title: 'Xóa trang này?',
      description: 'Nội dung của trang sẽ bị xóa khỏi thiệp.',
      confirmText: 'Xóa trang',
      danger: true,
    });
    if (!ok) return;
    const newP = pages.filter((_, i) => i !== idx);
    setPages(newP);
    switchPage(0);
  };

  const handleAddText = (txt: string, sz: number, style?: Record<string, unknown>) => {
    const t = new fabric.Textbox(txt, { left: 40, top: 250, width: canvasWidth - 80, fontSize: sz, textAlign: 'center', ...style });
    fabricRef.current?.add(t);
    fabricRef.current?.setActiveObject(t);
  };

  const handleAddShape = (type: string) => {
    let obj: any = null;
    const center = { left: canvasWidth / 2 - 50, top: canvasHeight / 2 - 50 };

    if (type.startsWith('rect-color:')) {
      const color = type.split(':')[1];
      handleChangeBackground(color, false);
      return;
    }

    switch (type) {
      case 'rect':
        obj = new fabric.Rect({ ...center, width: 100, height: 100, fill: 'transparent', stroke: '#333', strokeWidth: 2 });
        break;
      case 'rect-fill':
        obj = new fabric.Rect({ ...center, width: 100, height: 100, fill: '#475569' });
        break;
      case 'circle':
        obj = new fabric.Circle({ ...center, radius: 50, fill: 'transparent', stroke: '#333', strokeWidth: 2 });
        break;
      case 'circle-fill':
        obj = new fabric.Circle({ ...center, radius: 50, fill: '#475569' });
        break;
      case 'triangle':
        obj = new fabric.Triangle({ ...center, width: 100, height: 100, fill: '#475569' });
        break;
      case 'line':
        obj = new fabric.Line([50, 100, 250, 100], { left: center.left, top: center.top, stroke: '#333', strokeWidth: 2 });
        break;
      case 'divider-simple':
        obj = new fabric.Line([0, 0, 260, 0], { left: canvasWidth / 2 - 130, top: center.top, stroke: '#94a3b8', strokeWidth: 1 });
        break;
      case 'divider-dot':
        obj = new fabric.Line([0, 0, 260, 0], { left: canvasWidth / 2 - 130, top: center.top, stroke: '#94a3b8', strokeWidth: 2, strokeDashArray: [2, 6] });
        break;
      case 'star':
        obj = new fabric.Text('★', { ...center, fontSize: 48, fill: '#475569' });
        break;
      case 'heart':
        obj = new fabric.Text('♥', { ...center, fontSize: 48, fill: '#475569' });
        break;
      default:
        break;
    }
    if (obj) {
      fabricRef.current?.add(obj);
      fabricRef.current?.setActiveObject(obj);
    }
  };

  const handleAddImage = (url: string) => {
    fabric.Image.fromURL(url, { crossOrigin: 'anonymous' }).then((img) => {
      img.scaleToWidth(canvasWidth * 0.6);
      img.set({ left: (canvasWidth - img.getScaledWidth()) / 2, top: 250 });
      fabricRef.current?.add(img);
      fabricRef.current?.setActiveObject(img);
    });
  };

  const handleAddWidget = (widgetType: string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const cx = canvasWidth / 2;
    const cy = canvasHeight / 2;
    let widgetObj: any;

    if (widgetType === 'contact') {
      const rect = new fabric.Rect({ width: 200, height: 50, fill: '#e11d48', rx: 25, ry: 25, originX: 'center', originY: 'center' });
      const text = new (fabric as any).IText('📞 Liên hệ', { fontSize: 18, fill: '#ffffff', fontFamily: 'sans-serif', fontWeight: 'bold', originX: 'center', originY: 'center', editable: true, selectable: true });
      (text as any).widgetItemId = 'btnText';
      const phoneText = new (fabric as any).IText('', { fontSize: 12, fill: '#0f172a', fontFamily: 'sans-serif', originX: 'center', top: 30, editable: true, selectable: true });
      (phoneText as any).widgetItemId = 'contactPhone';
      widgetObj = new fabric.Group([rect, text], { left: cx - 100, top: cy - 25, subTargetCheck: true });
      widgetObj.data = { widgetType: 'contact', widgetData: { phone: '', buttonText: 'Liên hệ', showIcon: true } };
      widgetObj.addWithUpdate?.(phoneText);
    } 
    else if (widgetType === 'countdown') {
      const blocks = [];
      const labels = ['Ngày', 'Giờ', 'Phút', 'Giây'];
      const values = computeCountdownValues('2026-06-29', '18:30');
      const wrapper = new fabric.Rect({ width: 300, height: 90, fill: 'transparent', stroke: '#e11d48', strokeWidth: 1, strokeDashArray: [4, 4], originX: 'center', originY: 'center' });
      blocks.push(wrapper);
      for(let i=0; i<4; i++) {
        const offsetX = (i - 1.5) * 70;
        const box = new fabric.Rect({ width: 60, height: 70, fill: '#000000', rx: 12, ry: 12, originX: 'center', originY: 'center', left: offsetX });
        const valText = new fabric.Text(values[i], { fill: '#ffffff', fontSize: 20, fontWeight: 'bold', originX: 'center', top: -15, left: offsetX });
        (valText as any).widgetItemId = `countdown-value-${i}`;
        const lblText = new fabric.Text(labels[i], { fill: '#cbd5e1', fontSize: 12, originX: 'center', top: 15, left: offsetX });
        (lblText as any).widgetItemId = `countdown-label-${i}`;
        blocks.push(box, valText, lblText);
      }
      widgetObj = new fabric.Group(blocks, { left: cx - 150, top: cy - 45 });
      widgetObj.data = { widgetType: 'countdown', widgetData: { date: '2026-06-29', time: '18:30', orientation: 'horizontal', lang: 'vi' } };
    }
    else if (widgetType === 'map') {
      const rect = new fabric.Rect({ width: 320, height: 200, fill: '#f1f5f9', rx: 8, ry: 8, stroke: '#cbd5e1', strokeWidth: 1, originX: 'center', originY: 'center' });
      const pin = new fabric.Text('📍', { fontSize: 40, originX: 'center', top: -30 });
      const text = new fabric.Text('Bản đồ hiển thị tại đây', { fontSize: 14, fill: '#334155', fontFamily: 'sans-serif', fontWeight: 'bold', originX: 'center', top: 30 });
      (text as any).widgetItemId = 'mapText';
      widgetObj = new fabric.Group([rect, pin, text], { left: cx - 160, top: cy - 100 });
      widgetObj.data = { widgetType: 'map', widgetData: { address: '', lat: '', lng: '', zoom: 15 } };
      (async () => {
        const wd = widgetObj.data.widgetData || {};
        if (wd.lat && wd.lng) {
          await loadStaticMapForObject(widgetObj, wd.lat, wd.lng, wd.zoom || 15, !!GM_APY_KEY);
        } else {
          await loadStaticMapForObject(widgetObj, 21.0278, 105.8342, wd.zoom || 13, !!GM_APY_KEY);
        }
      })();
    }
    else if (widgetType === 'qr') {
      const rect = new fabric.Rect({ width: 220, height: 220, fill: '#ffffff', rx: 16, ry: 16, stroke: '#f43f5e', strokeWidth: 2, strokeDashArray: [6, 6], originX: 'center', originY: 'center' });
      const icon = new fabric.Text('🎁', { fontSize: 80, originX: 'center', top: -40 });
      const title = new fabric.Text('Hộp Quà Yêu Thương', { fontSize: 16, fill: '#be123c', fontFamily: 'sans-serif', fontWeight: 'bold', originX: 'center', top: 50 });
      (title as any).widgetItemId = 'qrTitle';
      const sub = new fabric.Text('Click để xem mã QR', { fontSize: 12, fill: '#94a3b8', fontFamily: 'sans-serif', originX: 'center', top: 75 });
      widgetObj = new fabric.Group([rect, icon, title, sub], { left: cx - 110, top: cy - 110 });
      widgetObj.data = { widgetType: 'qr', widgetData: { title: 'Hộp Quà Yêu Thương' } };
    }

    if (widgetObj) {
      canvas.add(widgetObj);
      canvas.setActiveObject(widgetObj);
    }
  };

  const handleChangeBackground = (value: string, isImage = false) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    if (isImage) {
      fabric.Image.fromURL(value, { crossOrigin: 'anonymous' }).then((img) => {
        img.set({
          scaleX: canvasWidth / (img.width || canvasWidth),
          scaleY: canvasHeight / (img.height || canvasHeight),
          left: 0,
          top: 0,
        });
        canvas.backgroundImage = img;
        canvas.renderAll();
      });
      return;
    }

    canvas.backgroundImage = undefined;

    if (value.startsWith('linear-gradient')) {
      const hexMatches = value.match(/#([0-9a-fA-F]{3,6})/g) || ['#ffffff', '#ffffff'];
      const colorStops = hexMatches.map((c, i) => ({
        offset: hexMatches.length > 1 ? i / (hexMatches.length - 1) : 0,
        color: c,
      }));
      const gradient = new fabric.Gradient({
        type: 'linear',
        coords: { x1: 0, y1: 0, x2: canvasWidth, y2: canvasHeight },
        colorStops,
      });
      canvas.set('backgroundColor', gradient as any);
      canvas.renderAll();
      return;
    }

    canvas.backgroundColor = value;
    canvas.renderAll();
  };
  const handleResizeCanvas = (w: number, h: number) => {
    setCanvasWidth(w);
    setCanvasHeight(h);
    fabricRef.current?.setDimensions({ width: w, height: h });
  };

  const buildCanvasPayload = () => {
    const canvas = fabricRef.current;
    const updatedPages = [...pages];
    if (canvas) {
      updatedPages[activePageIndex] = { ...updatedPages[activePageIndex], data: canvas.toJSON() };
    }
    setPages(updatedPages);
    return { pages: updatedPages, canvasWidth, canvasHeight };
  };

  const handleSaveDraft = async () => {
    if (!cardId) return;
    try {
      setIsSavingDraft(true);
      const payload = buildCanvasPayload();
      await cardsApi.saveDraft(cardId, payload);
      toast.success('Đã lưu bản nháp');
    } catch (e: any) {
      toast.error(e?.message || 'Lưu nháp thất bại');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const openPublishModal = () => {
    if (!cardId) return;
    setShowPublishModal(true);
  };

  const handleConfirmPublish = async () => {
    if (!cardId) return;
    if (!publishForm.weddingDate) {
      toast.warning('Vui lòng chọn ngày cưới trước khi xuất bản');
      return;
    }
    try {
      setIsPublishing(true);
      const payload = buildCanvasPayload();
      await cardsApi.update(cardId, {
        weddingDate: publishForm.weddingDate,
        weddingTime: publishForm.weddingTime,
        venue: publishForm.venue,
      });
      const published = await cardsApi.publish(cardId, payload);
      setCard(published);
      setPublishedUrl(`${window.location.origin}/thiep/${published.slug}`);
      toast.success('Xuất bản thiệp thành công!');
    } catch (e: any) {
      toast.error(e?.message || 'Xuất bản thất bại, vui lòng thử lại');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopyPublishedLink = async () => {
    if (!publishedUrl) return;
    try {
      await navigator.clipboard.writeText(publishedUrl);
      toast.success('Đã sao chép link thiệp');
    } catch {
      toast.error('Không thể sao chép link');
    }
  };

  const closePublishModal = () => {
    setShowPublishModal(false);
    setPublishedUrl(null);
  };

  if (!isReady) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#f3f1f6]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 size={28} className="animate-spin text-rose-500" />
          <p className="text-sm font-medium">Đang khởi tạo trình thiết kế...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen select-none flex-col overflow-hidden bg-[#f3f1f6] font-sans">
      <header className="z-20 flex h-14 shrink-0 items-center justify-between bg-[#161620] px-6 text-white shadow-sm">
        <div className="flex items-center space-x-6">
          <Link to="/dashboard/my-cards" className="flex items-center gap-2 text-xl font-black text-white hover:opacity-80">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-600 text-sm shadow-sm shadow-rose-500/40">
              L
            </span>
            loveyou
          </Link>
          <div className="flex space-x-1 text-slate-400">
            <button className="rounded-lg p-2 hover:bg-white/10 hover:text-white" title="Hoàn tác">
              <RotateCcw size={16} />
            </button>
            <button className="rounded-lg p-2 hover:bg-white/10 hover:text-white" title="Làm lại">
              <RotateCw size={16} />
            </button>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300 md:flex">
          <Sparkles size={13} />
          Đang chỉnh sửa: Trang {activePageIndex + 1} · {canvasWidth}×{canvasHeight}
        </div>

        <div className="flex items-center space-x-3">
          <button className="rounded-lg bg-white/10 px-4 py-1.5 text-xs font-bold text-slate-200 transition-colors hover:bg-white/20">
            <Eye size={14} className="mr-1 inline" />
            Xem trước
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={isSavingDraft}
            className="flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-1.5 text-xs font-bold text-slate-200 transition-colors hover:bg-white/20 disabled:opacity-60"
          >
            {isSavingDraft ? <Loader2 size={13} className="animate-spin" /> : null}
            {isSavingDraft ? 'Đang lưu...' : 'Lưu nháp'}
          </button>
          <button
            onClick={openPublishModal}
            className="rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 px-5 py-1.5 text-xs font-bold text-white shadow-md shadow-rose-500/30 transition-opacity hover:opacity-90"
          >
            Xuất bản
          </button>
        </div>
      </header>

      <div className="relative flex flex-1 overflow-hidden">
        <EditorSidebar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          onAddText={handleAddText}
          onAddShape={handleAddShape}
          onAddImage={handleAddImage}
          onAddWidget={handleAddWidget}
          onChangeBackground={handleChangeBackground}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          onResizeCanvas={handleResizeCanvas}

          activeEffect={activeEffect}
          onSelectEffect={(id) => setActiveEffect(id === activeEffect ? null : id)}
        />

        <main
          className="relative flex flex-1 items-center justify-center overflow-auto pb-24"
          style={{ backgroundImage: 'radial-gradient(#d8d5e0 1px, transparent 1px)', backgroundSize: '20px 20px', backgroundColor: '#eeecf2' }}
        >
          <div className="absolute left-6 top-6 z-10 flex items-center space-x-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <button onClick={() => setZoomRatio(Math.max(0.5, zoomRatio - 0.1))} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
              <ZoomOut size={16} />
            </button>
            <span className="flex w-12 items-center justify-center text-center font-mono text-xs font-bold text-slate-700">
              {Math.round(zoomRatio * 100)}%
            </span>
            <button onClick={() => setZoomRatio(Math.min(2, zoomRatio + 0.1))} className="rounded-lg bg-rose-50 p-1.5 text-rose-500 hover:bg-rose-100">
              <ZoomIn size={16} />
            </button>
          </div>

          <div className="relative transition-transform duration-200" style={{ transform: `scale(${zoomRatio})`, transformOrigin: 'center center' }}>
            <div className="relative overflow-hidden bg-white shadow-[0_4px_30px_rgba(0,0,0,0.07)] transition-all duration-300" style={{ width: canvasWidth, height: canvasHeight }}>
              <canvas ref={canvasElRef} />
              <CardParticleEngine effectType={activeEffect} />

              {toolbarPos.show && (
                <div 
                  className="absolute z-50 flex items-center bg-white rounded-xl shadow-2xl border border-slate-200 px-1 py-1 transform -translate-x-1/2 animate-in fade-in zoom-in-95 duration-200"
                  style={{ top: toolbarPos.top, left: toolbarPos.left }}
                >
                  <button onClick={handleDuplicate} title="Nhân bản" className="p-2 text-slate-600 hover:bg-slate-50 hover:text-rose-500 rounded-lg"><Copy size={15}/></button>
                  <button onClick={deleteObj} title="Xóa" className="p-2 text-slate-600 hover:bg-slate-50 hover:text-red-500 rounded-lg"><Trash2 size={15}/></button>
                  <div className="w-px h-5 bg-slate-200 mx-1"/>
                  
                  <div className="relative">
                    <button onClick={() => setShowLayerMenu(!showLayerMenu)} className={`p-2 rounded-lg flex items-center ${showLayerMenu ? 'bg-slate-50 text-rose-500' : 'text-slate-600 hover:bg-slate-50'}`}><Layers size={15}/></button>
                    {showLayerMenu && (
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-1.5 text-xs font-medium">
                        <button onClick={() => { const obj = fabricRef.current?.getActiveObject(); if(obj) { fabricRef.current?.bringObjectToFront(obj); fabricRef.current?.renderAll(); setShowLayerMenu(false); } }} className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"><ArrowUp size={13}/> Đưa lên trên cùng</button>
                        <button onClick={() => { const obj = fabricRef.current?.getActiveObject(); if(obj) { fabricRef.current?.sendObjectToBack(obj); fabricRef.current?.renderAll(); setShowLayerMenu(false); } }} className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"><ArrowDown size={13}/> Đưa xuống dưới cùng</button>
                        <div className="h-px bg-slate-100 my-1"/>
                        <button onClick={() => { const obj = fabricRef.current?.getActiveObject(); if(obj) { fabricRef.current?.bringObjectForward(obj); fabricRef.current?.renderAll(); setShowLayerMenu(false); } }} className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"><ArrowUp size={13} className="opacity-40"/> Đưa lên 1 lớp</button>
                        <button onClick={() => { const obj = fabricRef.current?.getActiveObject(); if(obj) { fabricRef.current?.sendObjectBackwards(obj); fabricRef.current?.renderAll(); setShowLayerMenu(false); } }} className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"><ArrowDown size={13} className="opacity-40"/> Đưa xuống 1 lớp</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-slate-700/60 bg-slate-900/90 p-1.5 shadow-2xl backdrop-blur-md">
            {pages.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => switchPage(idx)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  activePageIndex === idx ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{idx + 1}. {p.name}</span>
                {pages.length > 1 && (
                  <Trash2
                    size={12}
                    className="opacity-40 hover:text-rose-200 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePage(idx);
                    }}
                  />
                )}
              </button>
            ))}
            <button
              onClick={() => setPages([...pages, { id: 'p' + Date.now(), name: 'Trang mới ' + (pages.length + 1), data: null }])}
              className="flex items-center gap-1 rounded-xl bg-white/10 p-2 text-xs font-bold text-white hover:bg-white/20"
            >
              <Plus size={14} /> Thêm trang
            </button>
          </div>
        </main>

        <EditorRightPanel
          selectedProps={selectedProps}
          onChangeText={(v: any) => updateProp('text', v)}
          onChangeFontSize={(v: any) => updateProp('fontSize', v)}
          onChangeColor={(v: any) => updateProp('fill', v)}
          onChangeFontFamily={(v: any) => updateProp('fontFamily', v)}
          onChangeTextAlign={(v: any) => updateProp('textAlign', v)}
          onChangeOpacity={(v: any) => updateProp('opacity', v)}
          onToggleBold={() => updateProp('fontWeight', selectedProps?.fontWeight === 'bold' ? 'normal' : 'bold')}
          onToggleItalic={() => updateProp('fontStyle', selectedProps?.fontStyle === 'italic' ? 'normal' : 'italic')}
          onBringForward={() => {
            const obj = fabricRef.current?.getActiveObject();
            if (obj) {
              fabricRef.current?.bringObjectForward(obj);
              fabricRef.current?.renderAll();
            }
          }}
          onSendBackward={() => {
            const obj = fabricRef.current?.getActiveObject();
            if (obj) {
              fabricRef.current?.sendObjectBackwards(obj);
              fabricRef.current?.renderAll();
            }
          }}
          onDelete={deleteObj}
          onUpdateProp={(k: string, v: any) => updateProp(k, v)}
          onUpdateWidgetData={updateWidgetData}
        />
      </div>

      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-2xl">
            <button onClick={closePublishModal} className="absolute right-6 top-6 text-slate-400 hover:text-slate-700">
              <X size={20} />
            </button>

            {publishedUrl ? (
              <>
                <div className="space-y-2 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-600">
                    <Check size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Xuất bản thành công!</h3>
                  <p className="text-xs text-slate-500">Chia sẻ link bên dưới để khách mời xem thiệp của bạn.</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <span className="flex-1 truncate text-xs font-medium text-slate-600">{publishedUrl}</span>
                  <button onClick={handleCopyPublishedLink} className="shrink-0 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-600">
                    Sao chép
                  </button>
                </div>
                <a
                  href={publishedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full rounded-xl border border-slate-200 py-3 text-center text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Xem thiệp công khai
                </a>
              </>
            ) : (
              <>
                <div className="space-y-2 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-xl font-bold text-rose-600">✓</div>
                  <h3 className="text-xl font-bold text-slate-900">Sẵn sàng xuất bản!</h3>
                  <p className="text-xs text-slate-500">Điền thông tin tiệc cưới để khách mời xem được lịch trình &amp; đếm ngược.</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">NGÀY CƯỚI <span className="text-rose-500">*</span></label>
                    <input
                      type="date"
                      value={publishForm.weddingDate}
                      onChange={(e) => setPublishForm({ ...publishForm, weddingDate: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">GIỜ TỔ CHỨC</label>
                    <input
                      type="time"
                      value={publishForm.weddingTime}
                      onChange={(e) => setPublishForm({ ...publishForm, weddingTime: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">ĐỊA ĐIỂM</label>
                    <input
                      value={publishForm.venue}
                      onChange={(e) => setPublishForm({ ...publishForm, venue: e.target.value })}
                      placeholder="VD: Trung tâm Hội nghị Riverside..."
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    />
                  </div>
                </div>

                <button
                  onClick={handleConfirmPublish}
                  disabled={isPublishing}
                  className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 py-4 text-sm font-bold text-white shadow-lg shadow-rose-500/30 transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isPublishing && <Loader2 size={16} className="animate-spin" />}
                  {isPublishing ? 'Đang xuất bản...' : 'Xác nhận Phát hành'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};