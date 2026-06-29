import {
  Settings, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, ArrowUp,ArrowDown,
  Layers,ChevronDown,ChevronUp,
  Link2,Unlink2,Plus
} from 'lucide-react';
import { useState, useRef } from 'react';
import * as fabric from 'fabric';
import type {  } from '../../../types/editor';

interface RightPanelProps {
  selectedProps: any;
  onChangeText: (v: string) => void;
  onChangeFontSize: (v: number) => void;
  onChangeColor: (v: string) => void;
  onChangeFontFamily: (v: string) => void;
  onChangeTextAlign: (v: string) => void;
  onChangeOpacity: (v: number) => void;
  onToggleBold: () => void;
  onToggleItalic: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onDelete: () => void;
  onUpdateProp?: (key: string, value: any) => void;
  onUpdateWidgetData?: (key: string, value: any) => void;
}

const FONT_OPTIONS = [
  { value: 'serif', label: 'Times New Roman · Cổ điển' },
  { value: 'sans-serif', label: 'Inter / Helvetica · Hiện đại' },
  { value: 'cursive', label: 'Great Vibes · Chữ ký uốn lượn' },
  { value: "'Alex Brush', cursive", label: 'Alex Brush · Thanh lịch' },
  { value: "'Pacifico', cursive", label: 'Pacifico · Nét cọ tròn' },
  { value: "'Pinyon Script', cursive", label: 'Pinyon Script · Quý tộc' },
];

export const EditorRightPanel = ({
  selectedProps,
  onChangeText, onChangeFontSize,
  onChangeColor,onChangeFontFamily,
  onChangeTextAlign,onChangeOpacity,
  onToggleBold,onToggleItalic,
  onBringForward,onSendBackward,
  onUpdateProp,onUpdateWidgetData,
}: RightPanelProps) => {
  
  const [openBorder, setOpenBorder] = useState(true);
  const [openShadow, setOpenShadow] = useState(true);
  const [showQrAccountForm, setShowQrAccountForm] = useState(false);
  const [qrAccountForm, setQrAccountForm] = useState<{
    displayName: string;
    recipientName: string;
    bankName: string;
    accountNumber: string;
    qrImageUrl: string;
  }>({
    displayName: 'Cô dâu',
    recipientName: '',
    bankName: '',
    accountNumber: '',
    qrImageUrl: '',
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const [linkCorners, setLinkCorners] = useState(true);
  const [hasTextShadow, setHasTextShadow] = useState(false);
  const [hasBoxShadow, setHasBoxShadow] = useState(false);

  if (!selectedProps) {
    return (
      <aside className="w-80 shrink-0 select-none bg-white border-l border-slate-100 p-6 overflow-y-auto font-sans text-slate-700 h-full">
        <div className="flex items-center gap-2 pb-5 border-b border-slate-100 text-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
            <Settings size={16} />
          </div>
          <h2 className="text-sm font-bold tracking-tight">Cấu hình trang thiệp</h2>
        </div>

        <div className="py-5 space-y-5 text-xs">
          <div>
            <label className="font-semibold text-slate-500 block mb-1.5">Tên gói thiệp *</label>
            <input
              defaultValue="Tên thiệp cưới của bạn"
              className="w-full rounded-xl border border-slate-200 p-2.5 font-medium text-slate-800 outline-none transition-colors focus:border-rose-400 focus:ring-1 focus:ring-rose-100"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-500 block mb-1.5">Đường dẫn thiệp (Slug)</label>
            <div className="flex overflow-hidden rounded-xl border border-slate-200">
              <span className="bg-slate-50 px-2.5 py-2.5 text-slate-400">youlove.me/</span>
              <input
                defaultValue="thiep cuoi"
                className="w-full bg-slate-50 px-2.5 py-2.5 font-mono font-bold text-rose-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-500 block mb-1.5">Mật khẩu bảo vệ (Tùy chọn)</label>
            <input
              type="password"
              placeholder="Để trống nếu công khai"
              className="w-full rounded-xl border border-slate-200 p-2.5 outline-none transition-colors focus:border-rose-400 focus:ring-1 focus:ring-rose-100"
            />
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-[11px] text-amber-800">
            💡 Thiệp đang ở chế độ <strong>Bản nháp</strong>. Nhấn nút Xuất bản ở góc trên để công khai.
          </div>
        </div>
      </aside>
    );
  }

  const isText = selectedProps.type === 'textbox' || selectedProps.type === 'i-text';
  const wt = selectedProps.widgetType;
  const wd = selectedProps.widgetData || {};

  return (
    <aside className="w-80 shrink-0 select-none bg-white border-l border-slate-100 p-6 flex flex-col font-sans shadow-[-8px_0_24px_-12px_rgba(0,0,0,0.05)] h-full overflow-y-auto">
      <div className="space-y-5 pr-1 pb-6">
  
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-600">
            <Layers size={11} /> {selectedProps.type} {wt && `(Widget)`}
          </span>
          <div className="flex gap-1">
            <button onClick={onBringForward} title="Đưa lên lớp trước" className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800">
              <ArrowUp size={16} />
            </button>
            <button onClick={onSendBackward} title="Đưa xuống lớp sau" className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800">
              <ArrowDown size={16} />
            </button>
          </div>
        </div>

        {wt && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 space-y-4 shadow-inner">
            <div className="text-[11px] font-black text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
              ⚙️ Thiết lập Tiện ích
            </div>

            {wt === 'countdown' && (
              <div className="space-y-3.5 text-xs font-medium text-slate-700">
                <div>
                  <label className="block mb-1 text-slate-500 font-semibold">Chọn ngày</label>
                  <input type="date" value={wd.date || '2026-06-29'} onChange={e => onUpdateWidgetData?.('date', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-rose-400"/>
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 font-semibold">Chọn giờ</label>
                  <input type="time" value={wd.time || '18:30'} onChange={e => onUpdateWidgetData?.('time', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-rose-400"/>
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 font-semibold">Hướng hiển thị</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => onUpdateWidgetData?.('orientation', 'horizontal')} className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${wd.orientation !== 'vertical' ? 'bg-rose-500 text-white border-rose-500 shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>Ngang</button>
                    <button type="button" onClick={() => onUpdateWidgetData?.('orientation', 'vertical')} className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${wd.orientation === 'vertical' ? 'bg-rose-500 text-white border-rose-500 shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>Dọc</button>
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 font-semibold">Ngôn ngữ</label>
                  <div className="flex gap-4 pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold"><input type="radio" checked={wd.lang !== 'en'} onChange={() => onUpdateWidgetData?.('lang', 'vi')} className="accent-rose-500 h-4 w-4"/> Tiếng Việt</label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold"><input type="radio" checked={wd.lang === 'en'} onChange={() => onUpdateWidgetData?.('lang', 'en')} className="accent-rose-500 h-4 w-4"/> Tiếng Anh</label>
                  </div>
                </div>
              </div>
            )}

            {wt === 'map' && (
              <div className="space-y-3.5 text-xs font-medium text-slate-700">
                <div className="bg-sky-50 text-sky-700 p-2.5 rounded-xl text-[10px] font-semibold leading-relaxed">💡 Tọa độ có thể tự động lấy từ địa chỉ hoặc nhập thủ công!</div>
                <div>
                  <label className="block mb-1 text-rose-500 font-black">* Địa chỉ</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Nhập địa chỉ nhà hàng, tư gia..." value={wd.address || ''} onChange={e => onUpdateWidgetData?.('address', e.target.value)} className="flex-1 rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-rose-400"/>
                    <button type="button" onClick={() => onUpdateWidgetData?.('address', wd.address || '')} className="px-3 py-2 rounded-xl bg-rose-500 text-white text-xs font-black">Tìm vị trí</button>
                  </div>
                  <div className="text-[10px] text-slate-400 italic pt-1">Yêu cầu `VITE_GOOGLE_MAPS_API_KEY` để tải bản đồ</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block mb-1 text-slate-400 font-bold">Latitude</label>
                    <input type="text" placeholder="Vĩ độ" value={wd.lat || ''} onChange={e => onUpdateWidgetData?.('lat', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none"/>
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-400 font-bold">Longitude</label>
                    <input type="text" placeholder="Kinh độ" value={wd.lng || ''} onChange={e => onUpdateWidgetData?.('lng', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none"/>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 font-bold">
                  <span className="text-slate-600">Tỉ lệ Zoom</span>
                  <input type="number" value={wd.zoom || 15} onChange={e => onUpdateWidgetData?.('zoom', Number(e.target.value))} className="w-16 border rounded-xl p-2 text-center bg-white outline-none focus:border-rose-400"/>
                </div>
              </div>
            )}

            {wt === 'qr' && (
              <div className="space-y-3.5 text-xs font-medium text-slate-700">
                <div className="text-[10px] text-slate-400 italic leading-relaxed">Thêm thông tin tài khoản ngân hàng. Khi click vào icon này sẽ hiển thị form thêm tài khoản như hình.</div>
                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold text-slate-600">QR Bank</span>
                  <button
                    type="button"
                    onClick={() => setShowQrAccountForm(true)}
                    className="bg-rose-500 hover:bg-rose-600 text-white text-[10px] px-2.5 py-1.5 rounded-lg font-black flex items-center gap-1 shadow-sm"
                  >
                    <Plus size={11} /> Thêm tài khoản
                  </button>
                </div>

                {!showQrAccountForm ? (
                  <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center text-slate-400 bg-white text-[11px] font-bold shadow-inner">Chưa có thông tin tài khoản</div>
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm space-y-4 text-[11px] text-slate-700">
                    <div>
                      <div className="text-sm font-black text-slate-900">Thêm tài khoản mới</div>
                      <div className="text-[10px] text-slate-400">Hãy đảm bảo rằng thông tin ngân hàng chính xác trước khi lưu.</div>
                    </div>

                    <div>
                      <label className="block mb-1 text-rose-500 font-black text-[10px] uppercase tracking-[0.2em]">Tên hiển thị</label>
                      <select
                        value={qrAccountForm.displayName}
                        onChange={e => setQrAccountForm(prev => ({ ...prev, displayName: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:border-rose-400"
                      >
                        <option>Cô dâu</option>
                        <option>Chú rể</option>
                        <option>Cô dâu & Chú rể</option>
                        <option>Gia đình</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 font-bold text-slate-600">Tên người nhận</label>
                      <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={qrAccountForm.recipientName}
                        onChange={e => setQrAccountForm(prev => ({ ...prev, recipientName: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-rose-400"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-bold text-slate-600">Tên ngân hàng</label>
                      <input
                        type="text"
                        placeholder="Tên ngân hàng"
                        value={qrAccountForm.bankName}
                        onChange={e => setQrAccountForm(prev => ({ ...prev, bankName: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-rose-400"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-bold text-slate-600">Số tài khoản</label>
                      <input
                        type="text"
                        placeholder="Số tài khoản"
                        value={qrAccountForm.accountNumber}
                        onChange={e => setQrAccountForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-rose-400"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-bold text-slate-600">Mã QR chuyển khoản</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-black text-slate-700 hover:bg-slate-100"
                        >
                          Tải lên mới
                        </button>
                        <button
                          type="button"
                          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-black text-slate-700 hover:bg-slate-100"
                        >
                          Chọn ảnh có sẵn
                        </button>
                      </div>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setQrAccountForm(prev => ({ ...prev, qrImageUrl: URL.createObjectURL(file) }));
                          }
                        }}
                      />
                      {qrAccountForm.qrImageUrl && (
                        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center">
                          <img src={qrAccountForm.qrImageUrl} alt="QR preview" className="mx-auto h-24 w-24 object-contain rounded-xl" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowQrAccountForm(false);
                          setQrAccountForm({
                            displayName: 'Cô dâu',
                            recipientName: '',
                            bankName: '',
                            accountNumber: '',
                            qrImageUrl: '',
                          });
                        }}
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateWidgetData?.('accountInfo', qrAccountForm);
                          setShowQrAccountForm(false);
                        }}
                        className="flex-1 rounded-xl bg-rose-500 py-2 text-[11px] font-black text-white hover:bg-rose-600"
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block mb-1 font-bold text-slate-600">Tiêu đề khi hiển thị</label>
                  <input type="text" value={wd.title || 'Hộp Quà Yêu Thương'} onChange={e => onUpdateWidgetData?.('title', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-rose-400"/>
                </div>
              </div>
            )}

            {wt === 'contact' && (
              <div className="space-y-3.5 text-xs font-medium text-slate-700">
                <div>
                  <label className="block mb-1 font-bold text-slate-600">Số điện thoại</label>
                  <input type="text" placeholder="Ví dụ: 0987654321" value={wd.phone || ''} onChange={e => onUpdateWidgetData?.('phone', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-rose-400"/>
                </div>
                <div>
                  <label className="block mb-1 font-bold text-slate-600">Nội dung nút</label>
                  <input type="text" value={wd.buttonText || 'Liên hệ'} onChange={e => onUpdateWidgetData?.('buttonText', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-2.5 outline-none focus:border-rose-400"/>
                </div>
                <div className="flex items-center justify-between font-bold text-slate-600 pt-1">
                  <span>Hiển thị Icon</span>
                  <button type="button" onClick={() => onUpdateWidgetData?.('showIcon', wd.showIcon === false ? true : false)} className={`relative inline-flex h-5.5 w-10 items-center rounded-full transition-colors ${wd.showIcon !== false ? 'bg-rose-500' : 'bg-slate-200'}`}>
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${wd.showIcon !== false ? 'translate-x-[21px]' : 'translate-x-0.5'}`}/>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {isText && (
          <>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Nội dung</label>
              <textarea rows={3} value={selectedProps.text || ''} onChange={(e) => onChangeText(e.target.value)} className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium outline-none transition-colors focus:bg-white focus:border-rose-400 focus:ring-1 focus:ring-rose-100"/>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Phông chữ</label>
              <select value={selectedProps.fontFamily || 'serif'} onChange={(e) => onChangeFontFamily(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none transition-colors focus:border-rose-400">
                {FONT_OPTIONS.map((f) => (<option key={f.value} value={f.value}>{f.label}</option>))}
              </select>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wide">Cỡ chữ</label>
                <input type="number" value={selectedProps.fontSize || 24} onChange={(e) => onChangeFontSize(Number(e.target.value))} className="w-full rounded-lg border border-slate-200 p-2 text-xs font-mono outline-none focus:border-rose-400"/>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wide">Kiểu</label>
                <div className="flex overflow-hidden rounded-lg border border-slate-200">
                  <button onClick={onToggleBold} className={`p-2 transition-colors ${selectedProps.fontWeight === 'bold' ? 'bg-rose-500 text-white' : 'bg-slate-50 hover:bg-slate-100'}`}><Bold size={14} /></button>
                  <button onClick={onToggleItalic} className={`p-2 transition-colors ${selectedProps.fontStyle === 'italic' ? 'bg-rose-500 text-white' : 'bg-slate-50 hover:bg-slate-100'}`}><Italic size={14} /></button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Căn lề</label>
              <div className="grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
                {[{ id: 'left', i: AlignLeft }, { id: 'center', i: AlignCenter }, { id: 'right', i: AlignRight }].map((b) => (
                  <button key={b.id} onClick={() => onChangeTextAlign(b.id)} className={`flex justify-center rounded-lg py-1.5 transition-all ${selectedProps.textAlign === b.id ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><b.i size={16} /></button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 mt-2">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide">Khoảng cách chữ</label>
                <input type="range" min="-100" max="800" value={selectedProps.charSpacing || 0} onChange={(e) => onUpdateProp?.('charSpacing', Number(e.target.value))} className="w-full accent-rose-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer"/>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide">Khoảng cách dòng</label>
                <input type="range" min="0.5" max="3" step="0.1" value={selectedProps.lineHeight || 1.16} onChange={(e) => onUpdateProp?.('lineHeight', Number(e.target.value))} className="w-full accent-rose-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer"/>
              </div>
            </div>
          </>
        )}

        <div className="pt-2">
          <div className="mb-2 flex justify-between text-xs font-semibold text-slate-600">
            <span>Độ mờ</span>
            <span className="text-rose-500">{Math.round((selectedProps.opacity ?? 1) * 100)}%</span>
          </div>
          <input type="range" min="0" max="100" value={(selectedProps.opacity ?? 1) * 100} onChange={(e) => onChangeOpacity(Number(e.target.value) / 100)} className="w-full accent-rose-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer"/>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1.5">Màu sắc</label>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2">
            <input type="color" value={selectedProps.fill || '#000000'} onChange={(e) => onChangeColor(e.target.value)} className="h-8 w-8 cursor-pointer rounded-lg border-0 bg-transparent"/>
            <span className="font-mono text-xs font-bold uppercase text-slate-700">{selectedProps.fill}</span>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl bg-white overflow-hidden mt-2">
          <button onClick={() => setOpenBorder(!openBorder)} className="flex items-center gap-2 w-full p-3 font-bold text-sm text-slate-700 hover:bg-slate-50">
            {openBorder ? <ChevronDown size={16}/> : <ChevronUp size={16}/>}
            Đường viền
          </button>
          
          {openBorder && (
            <div className="p-4 pt-0 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs font-bold text-slate-600">Kiểu</span>
                <div className="relative w-36">
                  <select 
                    onChange={e => {
                      const val = e.target.value;
                      onUpdateProp?.('strokeDashArray', val === 'dashed' ? [6,6] : val === 'dotted' ? [2,2] : null);
                    }} 
                    className="w-full py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none appearance-none"
                  >
                    <option value="solid">Nét liền</option>
                    <option value="dashed">Nét đứt</option>
                    <option value="dotted">Nét chấm</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none"/>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Vị trí</span>
                <div className="relative w-36">
                  <select className="w-full py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none appearance-none">
                    <option>Toàn bộ</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none"/>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Màu viền</span>
                <div className="relative w-6 h-6 rounded-full border border-slate-200 overflow-hidden shadow-sm">
                  <input type="color" value={selectedProps.stroke || '#000000'} onChange={e => onUpdateProp?.('stroke', e.target.value)} className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer"/>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-600 block">Kích thước</span>
                <div className="flex items-center gap-3">
                  <input type="range" min="0" max="30" value={selectedProps.strokeWidth || 0} onChange={e => onUpdateProp?.('strokeWidth', Number(e.target.value))} className="flex-1 accent-rose-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer"/>
                  <input type="number" value={selectedProps.strokeWidth || 0} onChange={e => onUpdateProp?.('strokeWidth', Number(e.target.value))} className="w-14 py-1 bg-white border border-slate-200 rounded-lg text-center font-mono text-xs font-bold text-slate-700 outline-none focus:border-rose-400"/>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-600">Bo góc</span>
                  <button onClick={() => setLinkCorners(!linkCorners)} className={`transition-colors ${linkCorners ? 'text-slate-800' : 'text-slate-400'}`}>
                    {linkCorners ? <Link2 size={14}/> : <Unlink2 size={14}/>}
                  </button>
                </div>
                <div className="relative flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-slate-400 gap-3">
                  <div className="flex justify-between w-full px-4 items-center text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="text-lg">┌</span>
                      <input type="number" value={selectedProps.rx || 0} onChange={e => { onUpdateProp?.('rx', Number(e.target.value)); if(linkCorners) onUpdateProp?.('ry', Number(e.target.value)); }} className="w-12 py-1.5 text-center bg-white border border-slate-200 rounded-lg text-slate-700 outline-none focus:border-rose-400 shadow-sm"/>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <input type="number" value={selectedProps.ry || 0} onChange={e => { onUpdateProp?.('ry', Number(e.target.value)); if(linkCorners) onUpdateProp?.('rx', Number(e.target.value)); }} className="w-12 py-1.5 text-center bg-white border border-slate-200 rounded-lg text-slate-700 outline-none focus:border-rose-400 shadow-sm"/>
                      <span className="text-lg">┐</span>
                    </span>
                  </div>
                  
                  <div className="w-14 h-8 bg-slate-200/80 rounded border border-slate-300 shadow-inner"/>
                  
                  <div className="flex justify-between w-full px-4 items-center text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="text-lg">└</span>
                      <input type="number" value={selectedProps.rx || 0} onChange={e => { onUpdateProp?.('rx', Number(e.target.value)); if(linkCorners) onUpdateProp?.('ry', Number(e.target.value)); }} className="w-12 py-1.5 text-center bg-white border border-slate-200 rounded-lg text-slate-700 outline-none focus:border-rose-400 shadow-sm"/>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <input type="number" value={selectedProps.ry || 0} onChange={e => { onUpdateProp?.('ry', Number(e.target.value)); if(linkCorners) onUpdateProp?.('rx', Number(e.target.value)); }} className="w-12 py-1.5 text-center bg-white border border-slate-200 rounded-lg text-slate-700 outline-none focus:border-rose-400 shadow-sm"/>
                      <span className="text-lg">┘</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border border-slate-200 rounded-xl bg-white overflow-hidden mt-3">
          <button onClick={() => setOpenShadow(!openShadow)} className="flex items-center gap-2 w-full p-3 font-bold text-sm text-slate-700 hover:bg-slate-50">
            {openShadow ? <ChevronDown size={16}/> : <ChevronUp size={16}/>}
            Đổ bóng
          </button>

          {openShadow && (
            <div className="space-y-4 p-4 pt-0 border-t border-slate-100 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 italic">Đổ bóng văn bản:</span>
                <button type="button" onClick={() => { const n = !hasTextShadow; setHasTextShadow(n); onUpdateProp?.('shadow', n ? new fabric.Shadow({color:'rgba(0,0,0,0.3)', blur:5, offsetX:2, offsetY:2}) : null); }} className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${hasTextShadow ? 'bg-slate-400' : 'bg-slate-200'}`}>
                  <span className={`absolute text-[9px] font-bold uppercase ${hasTextShadow ? 'left-2 text-white' : 'right-2 text-slate-500'}`}>{hasTextShadow ? 'Bật' : 'Tắt'}</span>
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${hasTextShadow ? 'translate-x-[22px]' : 'translate-x-0.5'}`}/>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 italic">Đổ bóng khối:</span>
                <button type="button" onClick={() => { const n = !hasBoxShadow; setHasBoxShadow(n); onUpdateProp?.('shadow', n ? new fabric.Shadow({color:'rgba(0,0,0,0.15)', blur:15, offsetX:0, offsetY:10}) : null); }} className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${hasBoxShadow ? 'bg-slate-400' : 'bg-slate-200'}`}>
                  <span className={`absolute text-[9px] font-bold uppercase ${hasBoxShadow ? 'left-2 text-white' : 'right-2 text-slate-500'}`}>{hasBoxShadow ? 'Bật' : 'Tắt'}</span>
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${hasBoxShadow ? 'translate-x-[22px]' : 'translate-x-0.5'}`}/>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};