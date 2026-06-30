
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Send, Music, MapPin, Loader2 } from 'lucide-react';
import { cardsApi, wishesApi, rsvpApi } from '../../services/api';
import type { WeddingCard, Wish } from '../../services/api';
import { useToast } from '../../components/ToastProvider';

const computeCountdown = (dateStr: string, timeStr: string) => {
  const target = new Date(`${dateStr}T${timeStr || '00:00'}:00`);
  if (Number.isNaN(target.getTime())) return { days: '00', hours: '00', minutes: '00', seconds: '00' };
  let diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / 86400000); diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
  const minutes = Math.floor(diff / 60000); diff -= minutes * 60000;
  const seconds = Math.floor(diff / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return { days: pad(days), hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) };
};

export const PublicCardViewer = () => {
  const { slug } = useParams<{ slug: string }>();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [card, setCard] = useState<WeddingCard | null>(null);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [countdown, setCountdown] = useState(computeCountdown('', ''));

  const [play, setPlay] = useState(false);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [sendingWish, setSendingWish] = useState(false);

  const [rsvpName, setRsvpName] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpAttending, setRsvpAttending] = useState<'yes' | 'no'>('yes');
  const [rsvpGuests, setRsvpGuests] = useState(1);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [sendingRsvp, setSendingRsvp] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    (async () => {
      try {
        const c = await cardsApi.getBySlug(slug);
        if (!active) return;
        const realWishes = await wishesApi.listForCard(c.id);
        if (!active) return;
        setCard(c);
        setWishes(realWishes);
      } catch {
        if (active) setNotFound(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    if (!card) return;
    setCountdown(computeCountdown(card.weddingDate, card.weddingTime));
    const interval = setInterval(() => {
      setCountdown(computeCountdown(card.weddingDate, card.weddingTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [card]);

  const handleSendWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!card || !name.trim() || !msg.trim()) {
      toast.warning('Vui lòng nhập đầy đủ tên và lời chúc');
      return;
    }
    try {
      setSendingWish(true);
      const wish = await wishesApi.create(card.id, { name, message: msg });
      setWishes((prev) => [wish, ...prev]);
      setName('');
      setMsg('');
      toast.success('Đã gửi lời chúc, cảm ơn bạn!');
    } catch {
      toast.error('Gửi lời chúc thất bại, vui lòng thử lại');
    } finally {
      setSendingWish(false);
    }
  };

  const handleSendRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!card || !rsvpName.trim()) {
      toast.warning('Vui lòng nhập tên của bạn');
      return;
    }
    try {
      setSendingRsvp(true);
      await rsvpApi.create(card.id, {
        name: rsvpName,
        phone: rsvpPhone,
        attending: rsvpAttending,
        guestCount: rsvpGuests,
      });
      setRsvpSubmitted(true);
      toast.success('Đã gửi xác nhận tham dự!');
    } catch {
      toast.error('Gửi RSVP thất bại, vui lòng thử lại');
    } finally {
      setSendingRsvp(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 size={28} className="animate-spin text-rose-400" />
          <p className="text-sm font-medium">Đang tải thiệp cưới...</p>
        </div>
      </div>
    );
  }

  if (notFound || !card) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center px-6">
        <Heart size={48} className="text-rose-500/40 mb-4" />
        <h1 className="text-white text-xl font-bold mb-2">Không tìm thấy thiệp cưới</h1>
        <p className="text-slate-400 text-sm max-w-sm">Đường dẫn này không tồn tại hoặc thiệp đã bị gỡ xuống. Vui lòng kiểm tra lại link bạn nhận được.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center py-8 px-4 font-sans select-none">
      <div className="fixed top-6 z-50 bg-white/90 backdrop-blur px-5 py-2 rounded-full shadow-2xl flex items-center gap-3 border">
        <div className={`w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center ${play ? 'animate-spin' : ''}`}><Music size={14}/></div>
        <span className="text-xs font-bold">{card.bride} &amp; {card.groom}</span>
        <button onClick={() => setPlay(!play)} className="bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">{play ? 'Tắt' : '▶ Nhạc'}</button>
      </div>

      <div className="w-[390px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-8 border-slate-800 my-8 space-y-8 pb-10">
        <div className="relative h-[550px] bg-slate-100 flex flex-col justify-end p-8 text-center text-white">
          <img
            src={card.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80'}
            className="absolute inset-0 w-full h-full object-cover"
            alt="Ảnh cưới"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"/>
          <div className="relative z-10 space-y-2">
            <span className="text-[10px] tracking-widest text-rose-300 font-bold">SAVE THE DATE</span>
            <h1 className="text-4xl font-serif font-bold">{card.bride} &amp; {card.groom}</h1>
            <p className="text-xs text-slate-300">
              {card.weddingDate ? new Date(card.weddingDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Ngày cưới sẽ được cập nhật'}
            </p>
          </div>
        </div>

        <div className="px-6">
          <div className="bg-rose-50 rounded-3xl p-6 text-center border border-rose-100">
            <h3 className="text-[10px] font-bold text-rose-600 uppercase mb-3">CÙNG ĐẾM NGƯỢC</h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                { n: countdown.days, l: 'Ngày' },
                { n: countdown.hours, l: 'Giờ' },
                { n: countdown.minutes, l: 'Phút' },
                { n: countdown.seconds, l: 'Giây' },
              ].map((t, i) => (
                <div key={i} className="bg-white py-2.5 rounded-2xl shadow-sm">
                  <span className="block text-lg font-black">{t.n}</span>
                  <span className="text-[9px] text-slate-400 font-bold">{t.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {card.venue && (
          <div className="px-6">
            <div className="flex items-start gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="h-9 w-9 rounded-xl bg-rose-100 text-rose-500 flex items-center justify-center shrink-0"><MapPin size={16} /></div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Địa điểm tổ chức</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{card.venue}</p>
                {card.weddingTime && <p className="text-xs text-slate-400 mt-0.5">Lúc {card.weddingTime}</p>}
              </div>
            </div>
          </div>
        )}

        <div className="px-6 space-y-3">
          <h2 className="text-lg font-bold text-slate-800 text-center">Xác Nhận RSVP</h2>
          {rsvpSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5 text-center">
              <p className="text-sm font-bold text-emerald-700">Đã ghi nhận phản hồi của bạn!</p>
              <p className="text-xs text-emerald-600 mt-1">Cảm ơn bạn đã xác nhận tham dự.</p>
            </div>
          ) : (
            <form onSubmit={handleSendRsvp} className="bg-slate-50 p-5 rounded-3xl space-y-3 border">
              <input
                required
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
                placeholder="Tên của bạn..."
                className="w-full p-3 rounded-xl bg-white border text-xs outline-none focus:border-rose-500"
              />
              <input
                value={rsvpPhone}
                onChange={(e) => setRsvpPhone(e.target.value)}
                placeholder="Số điện thoại (không bắt buộc)..."
                className="w-full p-3 rounded-xl bg-white border text-xs outline-none focus:border-rose-500"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRsvpAttending('yes')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border ${rsvpAttending === 'yes' ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-slate-500 border-slate-200'}`}
                >
                  Sẽ tham dự
                </button>
                <button
                  type="button"
                  onClick={() => setRsvpAttending('no')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border ${rsvpAttending === 'no' ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-slate-500 border-slate-200'}`}
                >
                  Xin phép vắng
                </button>
              </div>
              {rsvpAttending === 'yes' && (
                <div className="flex items-center justify-between bg-white border rounded-xl px-3 py-2">
                  <span className="text-xs font-semibold text-slate-600">Số người tham dự</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setRsvpGuests((g) => Math.max(1, g - 1))} className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold">-</button>
                    <span className="text-xs font-bold w-4 text-center">{rsvpGuests}</span>
                    <button type="button" onClick={() => setRsvpGuests((g) => Math.min(10, g + 1))} className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold">+</button>
                  </div>
                </div>
              )}
              <button disabled={sendingRsvp} className="w-full py-3 bg-rose-500 text-white font-bold rounded-xl text-xs disabled:opacity-60">
                {sendingRsvp ? 'Đang gửi...' : 'Xác Nhận Tham Dự'}
              </button>
            </form>
          )}
        </div>

        <div className="px-6 space-y-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2"><Heart size={16} className="text-rose-500 fill-rose-500"/> Sổ Lưu Niệm ({wishes.length})</h2>
          <form onSubmit={handleSendWish} className="space-y-2">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Tên của bạn..." className="w-full p-2.5 rounded-xl bg-slate-50 border text-xs outline-none"/>
            <div className="relative">
              <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Lời chúc..." className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-50 border text-xs outline-none"/>
              <button disabled={sendingWish} className="absolute right-1.5 top-1.5 p-1.5 bg-rose-500 text-white rounded-lg disabled:opacity-60"><Send size={12}/></button>
            </div>
          </form>
          <div className="space-y-2 max-h-[220px] overflow-y-auto">
            {wishes.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Chưa có lời chúc nào, hãy là người đầu tiên!</p>
            ) : (
              wishes.map((w) => (
                <div key={w.id} className="bg-slate-50 p-3 rounded-xl">
                  <span className="font-bold text-xs block">{w.name}</span>
                  <p className="text-xs text-slate-600 mt-0.5">{w.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};