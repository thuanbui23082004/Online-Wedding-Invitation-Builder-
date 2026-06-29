import {
  Check ,Clock, Heart,Image as ImageIcon, Layers,MapPin, MousePointer2,
  Music, Palette, Pause,PhoneCall, Play, QrCode,AlertTriangle, Cloud, Crown, Sliders, Folder,
  Search, Sparkles, Square, Star, Type, Upload, Volume2,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ActiveTool } from '../../../types/editor';

interface SidebarProps {
  activeTool: ActiveTool;
  setActiveTool: (tool: ActiveTool) => void;
  onAddText: (text: string, size: number, style?: Record<string, unknown>) => void;
  onAddShape: (type: string) => void;
  onAddImage: (url: string) => void;
  onAddWidget: (type: string, text: string, color: string) => void;
  onChangeBackground: (value: string, isImage?: boolean) => void;
  canvasWidth: number;
  canvasHeight: number;
  onResizeCanvas: (w: number, h: number) => void;
  activeEffect?: string | null;
  onSelectEffect?: (effectId: string) => void;
}

const TOOLS: { id: ActiveTool; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
  { id: 'image', label: 'Hình ảnh', Icon: ImageIcon },
  { id: 'bg', label: 'Nền', Icon: Layers },
  { id: 'text', label: 'Văn bản', Icon: Type },
  { id: 'shape', label: 'Công cụ', Icon: Square },
  { id: 'elements', label: 'Stock', Icon: Sparkles },
  { id: 'select', label: 'Tiện ích', Icon: MousePointer2 },
  { id: 'music', label: 'Nhạc nền', Icon: Music },
  { id: 'map', label: 'Hiệu ứng', Icon: MapPin },
];

const STOCK_CATEGORIES = ['Tất cả', 'Yếu tố đám cưới', 'Nhân vật', 'Hoa cưới', 'Khung viền', 'Chữ nghệ thuật'];

const STOCK_IMAGES = [
  { cat: 'Yếu tố đám cưới', name: 'Nhẫn cưới', url: '/stickers/wedding.png' },
  { cat: 'Yếu tố đám cưới', name: 'cầu hôn', url: '/stickers/wedding1.png' },
  { cat: 'Yếu tố đám cưới', name: 'Chữ hỷ', url: '/stickers/chuhy.png' },
   { cat: 'Yếu tố đám cưới', name: 'Cc', url: '/stickers/love-letter.png' },
  { cat: 'Nhân vật', name: 'Cô dâu', url: '/stickers/cd.png' },
  { cat: 'Nhân vật', name: 'Đôi uyên ương', url: '/stickers/wedding-couple1.png' },
  { cat: 'Hoa cưới', name: 'Hoa cưới', url: '/stickers/flowers.png' },
  { cat: 'Khung viền', name: 'khung', url: '/stickers/wedding-arch.png' },
  { cat: 'Chữ nghệ thuật', name: 'Cẩm tú cầu', url: '/stickers/chu2.png' },
];

const MUSIC_TRACKS = [
  { title: 'Hơn Cả Yêu', artist: 'Đức Phúc', duration: '5:43', genre: 'V-Pop', url: 'music/Hơn Cả Yêu (Tropical).mp3' },
  { title: 'Mình Cưới Nhau Đi', artist: 'Bùi Anh Tuấn, Hiền Hồ', duration: '4:52', genre: 'V-Pop', url: 'music/Mình Cưới Nhau Đi.mp3' },
  { title: 'Ngày Đầu Tiên', artist: 'Đức Phúc', duration: '3:28', genre: 'V-Pop', url: 'music/Ngày Đầu Tiên.mp3' },
  { title: 'Ta Là Của Nhau', artist: 'Ông Cao Thắng, Đông Nhi', duration: '4:15', genre: 'V-Pop', url: 'music/Ta Là Của Nhau.mp3' },
  { title: 'Beautiful In White', artist: 'Shane Filan', duration: '3:52', genre: 'Ballad', url: 'music/Beautiful In White.mp3' },
  { title: 'Perfect', artist: 'Ed Sheeran', duration: '4:23', genre: 'Pop', url: 'music/Perfect.mp3' },
];

const BG_COLORS = [
  '#ffffff', '#fce4ec', '#f3e5f5', '#e3f2fd', '#e8f5e9',
  '#fff8e1', '#fff3e0', '#fafafa', '#1a1a2e', '#0d1117',
  '#f8f0e3', '#e8ddd0', '#d4c5a9', '#2d3436', '#6c5ce7',
];

const BG_GRADIENTS = [
  'linear-gradient(135deg, #fce4ec, #fff9fb)',
  'linear-gradient(135deg, #e3f2fd, #bbdefb)',
  'linear-gradient(135deg, #f3e5f5, #e1bee7)',
  'linear-gradient(160deg, #f8e8d4, #e8a87c)',
  'linear-gradient(135deg, #1a1a2e, #0f3460)',
  'linear-gradient(135deg, #ff9a9e, #fecfef)',
  'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
  'linear-gradient(135deg, #d4edda, #a8d5b5)',
];

const EFFECTS_LIST = [
  { id: 'flower', label: 'Hoa rơi lãng mạn 🌸' },
  { id: 'bubble', label: 'Bong bóng nổi 🫧' },
  { id: 'heart', label: 'Tim bay lên ❤️' },
  { id: 'snow', label: 'Tuyết rơi ❄️' },
  { id: 'firework', label: 'Pháo hoa 🎆' },
  { id: 'candle', label: 'Nến lung linh 🕯️' },
];

export const EditorSidebar: React.FC<SidebarProps> = ({
  activeTool,
  setActiveTool, onAddText,onAddShape,
  onAddImage,onAddWidget,onChangeBackground,
  activeEffect,onSelectEffect
}) => {
  const [stockCat, setStockCat] = useState('Tất cả');
  const [stockSearch, setStockSearch] = useState('');
  const [playingTrack, setPlayingTrack] = useState<number | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
  const [musicSearch, setMusicSearch] = useState('');
  const [musicTab, setMusicTab] = useState<'library' | 'my-music'>('library');
  const fileRef = useRef<HTMLInputElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const audio = new Audio();
    audioPlayerRef.current = audio;
    audio.onended = () => setPlayingTrack(null);
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const togglePlay = (idx: number, url: string) => {
    if (!audioPlayerRef.current) return;
    
    if (playingTrack === idx) {
      audioPlayerRef.current.pause();
      setPlayingTrack(null);
    } else {
      audioPlayerRef.current.src = url;
      audioPlayerRef.current.play();
      setPlayingTrack(idx);
    }
  };

  const filteredStock = STOCK_IMAGES.filter(
    (s) => (stockCat === 'Tất cả' || s.cat === stockCat) && s.name.toLowerCase().includes(stockSearch.toLowerCase())
  );
  const filteredMusic = MUSIC_TRACKS.filter(
    (t) => t.title.toLowerCase().includes(musicSearch.toLowerCase()) || t.artist.toLowerCase().includes(musicSearch.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onAddImage(url);
    }
  };

  const handleBgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChangeBackground(url, true);
    }
  };

  const SHAPES = [
    { id: 'rect', label: 'Chữ nhật', node: <div className="h-5 w-8 rounded border-2 border-slate-500" /> },
    { id: 'rect-fill', label: 'Hình đặc', node: <div className="h-5 w-8 rounded bg-slate-500" /> },
    { id: 'circle', label: 'Hình tròn', node: <div className="h-6 w-6 rounded-full border-2 border-slate-500" /> },
    { id: 'circle-fill', label: 'Tròn đặc', node: <div className="h-6 w-6 rounded-full bg-slate-500" /> },
    { id: 'triangle', label: 'Tam giác', node: <div style={{ width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderBottom: '24px solid #64748b' }} /> },
    { id: 'line', label: 'Đường thẳng', node: <div className="h-0.5 w-8 bg-slate-500" /> },
    { id: 'star', label: 'Ngôi sao', node: <Star size={22} className="fill-slate-500 text-slate-500" /> },
    { id: 'heart', label: 'Trái tim', node: <Heart size={22} className="fill-slate-500 text-slate-500" /> },
  ];

  return (
    <aside className="z-10 flex h-full shrink-0 select-none border-r border-slate-100 bg-white shadow-sm">
      <div className="flex w-[72px] flex-col items-center gap-1 overflow-y-auto border-r border-slate-100 bg-slate-50/60 py-4">
        {TOOLS.map(({ id, label, Icon }) => {
          const active = activeTool === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTool(id)}
              title={label}
              className={`mb-0.5 flex h-12 w-14 flex-col items-center justify-center rounded-xl transition-all ${
                active ? 'bg-rose-500 text-white shadow-md shadow-rose-200' : 'text-slate-400 hover:bg-white hover:text-slate-700'
              }`}
            >
              <Icon size={19} />
              <span className="mt-0.5 text-[9px] font-semibold leading-tight">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex w-72 flex-col overflow-hidden bg-white">
        {activeTool === 'image' && (
          <div className="flex h-full flex-col overflow-hidden">
            <div className="shrink-0 border-b border-slate-100 px-4 pb-3 pt-4">
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-700">Hình ảnh</h4>
              <button
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 py-2.5 text-xs font-bold text-white shadow-sm shadow-rose-200 transition-opacity hover:opacity-90"
              >
                <Upload size={14} /> Tải ảnh lên (Max 10MB)
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

              <div className="relative mt-2">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={stockSearch}
                  onChange={(e) => setStockSearch(e.target.value)}
                  placeholder="Tìm ảnh, sticker..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs outline-none transition-colors focus:border-rose-300"
                />
              </div>
            </div>

            <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-slate-100 px-3 py-2">
              {STOCK_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setStockCat(cat)}
                  className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-[10px] font-bold transition-all ${
                    stockCat === cat ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <div className="grid grid-cols-3 gap-1.5">
                {filteredStock.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => onAddImage(s.url)}
                    className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-slate-100 bg-slate-50 transition-all hover:border-rose-300 hover:shadow-md"
                  >
                    <img src={s.url} alt={s.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                ))}
              </div>
              {filteredStock.length === 0 && <div className="py-8 text-center text-xs text-slate-400">Không tìm thấy ảnh</div>}
            </div>
          </div>
        )}

        {activeTool === 'bg' && (
          <div className="flex-1 space-y-5 overflow-y-auto p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Nền trang thiệp</h4>

            <div>
              <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Màu nền</div>
              <div className="grid grid-cols-5 gap-1.5">
                {BG_COLORS.map((c) => (
                  <div
                    key={c}
                    onClick={() => onChangeBackground(c, false)}
                    className="aspect-square cursor-pointer rounded-lg border border-slate-200 shadow-sm transition-transform hover:scale-110"
                    style={{ background: c }}
                  />
                ))}
                <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-slate-400 transition-all hover:border-rose-400 hover:text-rose-500">
                  <Palette size={14} />
                  <input type="color" className="hidden h-0 w-0" onChange={(e) => onChangeBackground(e.target.value, false)} />
                </label>
              </div>
            </div>

            <div>
              <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Màu chuyển sắc</div>
              <div className="grid grid-cols-4 gap-1.5">
                {BG_GRADIENTS.map((g, i) => (
                  <div
                    key={i}
                    onClick={() => onChangeBackground(g, false)}
                    className="aspect-square cursor-pointer rounded-lg border border-slate-200 shadow-sm transition-transform hover:scale-110"
                    style={{ background: g }}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Ảnh nền</div>
              <button
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-2.5 text-xs text-slate-400 transition-all hover:border-rose-300 hover:text-rose-500"
              >
                <Upload size={13} /> Tải ảnh nền lên
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleBgFileUpload} />
            </div>
          </div>
        )}

        {activeTool === 'text' && (
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Thêm văn bản</h4>
            <div className="space-y-2">
              <button onClick={() => onAddText('Cô dâu & Chú rể', 42, { fontFamily: 'serif', fontWeight: 'bold' })} className="w-full rounded-xl border border-slate-100 bg-slate-50 p-4 text-left transition-all hover:border-rose-200 hover:bg-rose-50">
                <div className="font-serif text-2xl font-bold text-slate-800">+ Tiêu đề lớn</div>
                <div className="mt-0.5 text-[10px] text-slate-400">Tên cô dâu chú rể · Cỡ 42px</div>
              </button>
              <button onClick={() => onAddText('TRÂN TRỌNG KÍNH MỜI', 18, { fontFamily: 'sans-serif', fontWeight: '600', charSpacing: 200 })} className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-left transition-all hover:border-rose-200 hover:bg-rose-50">
                <div className="text-sm font-semibold tracking-[0.2em] text-slate-700">+ TIÊU ĐỀ PHỤ</div>
              </button>
              <button onClick={() => onAddText('12 · 12 · 2025', 22, { fontFamily: 'serif', fill: '#c06080' })} className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-left transition-all hover:border-rose-200 hover:bg-rose-50">
                <div className="font-serif text-base text-rose-400">+ Ngày tháng · 22px</div>
              </button>
            </div>
          </div>
        )}

        {activeTool === 'shape' && (
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Hình khối & Đường kẻ</h4>
            <div>
              <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Hình cơ bản</div>
              <div className="grid grid-cols-4 gap-2">
                {SHAPES.map((sh) => (
                  <button key={sh.id} onClick={() => onAddShape(sh.id)} title={sh.label} className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 p-3 transition-all hover:border-rose-200 hover:bg-rose-50">
                    {sh.node}
                    <span className="text-center text-[9px] leading-tight text-slate-500">{sh.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTool === 'elements' && (
          <div className="flex h-full flex-col overflow-hidden">
            <div className="shrink-0 px-4 pb-2 pt-4">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-700">Thư viện Stock</h4>
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={stockSearch} onChange={(e) => setStockSearch(e.target.value)} placeholder="Tìm thành phần nhanh..." className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs outline-none focus:border-rose-300"/>
              </div>
              <div className="mt-2 flex gap-1 overflow-x-auto pb-1">
                {STOCK_CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setStockCat(cat)} className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-[10px] font-bold ${stockCat === cat ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500'}`}>{cat}</button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-3 pb-4">
              {STOCK_CATEGORIES.filter((c) => c !== 'Tất cả').map((cat) => {
                const items = STOCK_IMAGES.filter((s) => s.cat === cat && s.name.toLowerCase().includes(stockSearch.toLowerCase()));
                if (stockCat !== 'Tất cả' && stockCat !== cat) return null;
                if (items.length === 0) return null;
                return (
                  <div key={cat} className="mb-4">
                    <div className="mb-1.5 text-[10px] font-bold uppercase text-slate-500">{cat}</div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {items.slice(0, 6).map((s, i) => (
                        <div key={i} onClick={() => onAddImage(s.url)} className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-slate-100 bg-slate-50 transition-all hover:border-rose-300 hover:shadow-md">
                          <img src={s.url} alt={s.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTool === 'select' && (
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Khối tương tác đặc biệt</h4>
            {[
              { type: 'countdown', icon: <Clock size={20} className="text-rose-500" />, title: 'Đồng hồ đếm ngược', sub: 'Tự động đếm đến ngày cưới', text: '⏳ ĐẾM NGƯỢC\n142 Ngày : 08 Giờ : 45 Phút', color: '#fff1f2', bg: 'bg-rose-50', border: 'border-rose-100', titleColor: 'text-rose-800' },
              { type: 'map', icon: <MapPin size={20} className="text-emerald-600" />, title: 'Bản đồ Google Maps', sub: 'Mở định vị GPS khi khách bấm', text: '📍 BẢN ĐỒ CHỈ ĐƯỜNG\nNhà hàng White Palace — TP.HCM', color: '#f0fdf4', bg: 'bg-emerald-50', border: 'border-emerald-100', titleColor: 'text-emerald-800' },
              { type: 'qr', icon: <QrCode size={20} className="text-blue-600" />, title: 'Mã QR hộp mừng cưới', sub: 'Chuyển khoản nhanh Momo/Bank', text: '💳 QR MỪNG CƯỚI\nVietcombank - 0123456789', color: '#eff6ff', bg: 'bg-blue-50', border: 'border-blue-100', titleColor: 'text-blue-800' },
              { type: 'contact', icon: <PhoneCall size={20} className="text-slate-700" />, title: 'Nút Liên hệ', sub: 'Gọi điện thoại nhanh chóng', text: '📞 LIÊN HỆ\n0987 654 321', color: '#f8fafc', bg: 'bg-slate-50', border: 'border-slate-100', titleColor: 'text-slate-800' },
            ].map((w) => (
              <button key={w.type} onClick={() => onAddWidget(w.type, w.text, w.color)} className={`group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all hover:opacity-90 ${w.bg} ${w.border}`}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm transition-transform group-hover:scale-110">{w.icon}</div>
                <div><div className={`text-xs font-bold ${w.titleColor}`}>{w.title}</div><div className="mt-0.5 text-[10px] text-slate-500">{w.sub}</div></div>
              </button>
            ))}
          </div>
        )}

        {activeTool === 'music' && (
          <div className="flex h-full flex-col overflow-hidden bg-white font-sans">
            
            <div className="shrink-0 p-4 pb-2 border-b border-slate-100 space-y-3.5">
              <div className="flex rounded-full bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setMusicTab('library')}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold transition-all ${
                    musicTab === 'library' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Music size={13} /> Thư viện nhạc
                </button>
                <button
                  type="button"
                  onClick={() => setMusicTab('my-music')}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold transition-all ${
                    musicTab === 'my-music' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Cloud size={13} /> Nhạc của tôi
                </button>
              </div>

              <div className="space-y-1.5 pt-0.5">
                <span className="text-[11px] font-bold text-slate-500 block">Nhạc đang chọn</span>
                {selectedTrack !== null ? (
                  <div className="flex items-center justify-between rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-xs font-bold text-rose-700 animate-in fade-in">
                    <span className="truncate flex items-center gap-1.5">
                      <Music size={14} className="text-rose-500 shrink-0 animate-bounce"/>
                      {MUSIC_TRACKS[selectedTrack]?.title || 'Bài hát đã chọn'}
                    </span>
                    <button onClick={() => setSelectedTrack(null)} className="text-[10px] text-rose-400 hover:text-rose-600 underline">Bỏ chọn</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-xl bg-amber-50/80 border border-amber-200/60 p-2.5 text-xs text-amber-700 font-medium">
                    <AlertTriangle size={15} className="text-amber-500 shrink-0" />
                    <span>Chưa chọn bài nào</span>
                  </div>
                )}
              </div>
            </div>

            {musicTab === 'library' ? (
              <>
                <div className="px-4 pt-3 pb-1 shrink-0">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={musicSearch} onChange={(e) => setMusicSearch(e.target.value)} placeholder="Tìm bài nhạc..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-rose-300 focus:bg-white transition-colors"/>
                  </div>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto p-3">
                  {filteredMusic.map((track, i) => (
                    <div key={i} className={`rounded-xl border p-3 transition-all ${selectedTrack === i ? 'border-rose-300 bg-rose-50' : 'bg-slate-50 hover:border-slate-200'}`}>
                      <div className="flex items-center gap-2.5">
                        <button onClick={() => togglePlay(i, track.url)} className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white ${playingTrack === i ? 'text-rose-500 border-rose-300 shadow-sm' : 'text-slate-500'}`}>
                          {playingTrack === i ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
                        </button>
                        <div className="min-w-0 flex-1"><div className="truncate text-xs font-bold text-slate-800">{track.title}</div><div className="text-[10px] text-slate-400 mt-0.5">{track.artist}</div></div>
                        <button onClick={() => setSelectedTrack(i)} className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[10px] font-bold border transition-all ${selectedTrack === i ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-slate-600 hover:text-rose-500'}`}>
                          {selectedTrack === i ? <Check size={11} /> : 'Chọn'}
                        </button>
                      </div>
                      {playingTrack === i && (<div className="mt-2 flex items-center gap-0.5 px-1"><Volume2 size={10} className="mr-1 text-rose-400" />{Array.from({ length: 24 }).map((_, j) => (<div key={j} className="w-0.5 rounded-full bg-rose-400" style={{ height: `${8 + Math.sin(j * 0.8) * 6}px`, opacity: 0.6 + Math.random() * 0.4, animation: `pulse ${0.5 + Math.random() * 0.5}s ease-in-out infinite alternate` }} />))}</div>)}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-center animate-in fade-in zoom-in-95 duration-200">
                <div className="rounded-3xl border border-slate-200/80 bg-slate-50/50 p-6 text-center space-y-4 shadow-sm">
                  
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-dashed border-rose-300 bg-rose-50 text-rose-500 shadow-inner">
                    <Music size={24} className="animate-pulse" />
                  </div>

                  <div className="space-y-1.5 px-1">
                    <h4 className="text-sm font-black text-slate-800 tracking-tight">Tính năng dành cho gói Premium</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      Tải lên nhạc riêng để thiệp trở nên độc đáo và mang đậm dấu ấn cá nhân.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-1 text-[11px] font-bold text-slate-600">
                    <div className="rounded-xl bg-slate-100/90 border border-slate-200/60 py-2 px-3 flex items-center justify-center gap-2">
                      <Cloud size={14} className="text-rose-500"/> Upload MP3, WAV, M4A
                    </div>
                    <div className="rounded-xl bg-slate-100/90 border border-slate-200/60 py-2 px-3 flex items-center justify-center gap-2">
                      <Sliders size={14} className="text-rose-500"/> Tùy chỉnh âm thanh
                    </div>
                    <div className="rounded-xl bg-slate-100/90 border border-slate-200/60 py-2 px-3 flex items-center justify-center gap-2">
                      <Folder size={14} className="text-rose-500"/> Lưu trữ nhạc cá nhân
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="button"
                      onClick={() => navigate('/dashboard/payment')}
                      className="w-full rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 py-3 text-xs font-black text-white shadow-lg shadow-rose-500/25 hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                    >
                      <Crown size={15} /> Nâng cấp lên Premium
                    </button>
                    <div className="mt-3 text-[10px] text-slate-400 font-semibold">
                      Gói hiện tại: <span className="text-slate-800 font-black tracking-wide">FREE</span>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        {activeTool === 'map' && (
          <div className="flex-1 space-y-2 overflow-y-auto p-4">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-700">Hiệu ứng trang thiệp</h4>
            {EFFECTS_LIST.map((ef) => {
              const isSelected = activeEffect === ef.id;
              return (
                <button
                  key={ef.id}
                  onClick={() => onSelectEffect?.(ef.id)}
                  className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-xs font-bold transition-all ${
                    isSelected 
                      ? 'border-rose-500 bg-rose-50 text-rose-600 shadow-sm' 
                      : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-purple-200 hover:bg-purple-50'
                  }`}
                >
                  <span>{ef.label}</span>
                  {isSelected ? <Check size={16} className="text-rose-500"/> : <Sparkles size={14} className="text-slate-300" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};