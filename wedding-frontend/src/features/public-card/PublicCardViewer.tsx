import React, { useState } from 'react';
import { Heart, Send, Music } from 'lucide-react';

export const PublicCardViewer = () => {
  const [play, setPlay] = useState(false);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [list, setList] = useState([ { name: 'Anh Tuấn', msg: 'Chúc hai em trăm năm hạnh phúc nhé! ❤️' } ]);

  const send = (e: React.FormEvent) => { e.preventDefault(); if(!name||!msg) return; setList([{name, msg}, ...list]); setName(''); setMsg(''); alert('Đã gửi lời chúc!'); };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center py-8 px-4 font-sans select-none">
      <div className="fixed top-6 z-50 bg-white/90 backdrop-blur px-5 py-2 rounded-full shadow-2xl flex items-center gap-3 border"><div className={`w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center ${play?'animate-spin':''}`}><Music size={14}/></div><span className="text-xs font-bold">Thanh & Thuận</span><button onClick={()=>setPlay(!play)} className="bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">{play?'Tắt':'▶ Nhạc'}</button></div>
      <div className="w-[390px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-8 border-slate-800 my-8 space-y-8 pb-10">
        <div className="relative h-[550px] bg-slate-100 flex flex-col justify-end p-8 text-center text-white"><img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80" className="absolute inset-0 w-full h-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"/><div className="relative z-10 space-y-2"><span className="text-[10px] tracking-widest text-rose-300 font-bold">SAVE THE DATE</span><h1 className="text-4xl font-serif font-bold">Thanh & Thuận</h1><p className="text-xs text-slate-300">12 . 12 . 2026</p></div></div>
        <div className="px-6"><div className="bg-rose-50 rounded-3xl p-6 text-center border border-rose-100"><h3 className="text-[10px] font-bold text-rose-600 uppercase mb-3">CÙNG ĐẾM NGƯỢC</h3><div className="grid grid-cols-4 gap-2">{[{n:'142',l:'Ngày'},{n:'08',l:'Giờ'},{n:'45',l:'Phút'},{n:'12',l:'Giây'}].map((t,i)=><div key={i} className="bg-white py-2.5 rounded-2xl shadow-sm"><span className="block text-lg font-black">{t.n}</span><span className="text-[9px] text-slate-400 font-bold">{t.l}</span></div>)}</div></div></div>
        <div className="px-6 space-y-3"><h2 className="text-lg font-bold text-slate-800 text-center">Xác Nhận RSVP</h2><form onSubmit={e=>{e.preventDefault();alert('Đã gửi RSVP!')}} className="bg-slate-50 p-5 rounded-3xl space-y-3 border"><input required placeholder="Tên của bạn..." className="w-full p-3 rounded-xl bg-white border text-xs outline-none focus:border-rose-500"/><button className="w-full py-3 bg-rose-500 text-white font-bold rounded-xl text-xs">Xác Nhận Tham Dự</button></form></div>
        <div className="px-6 space-y-4"><h2 className="text-base font-bold text-slate-800 flex items-center gap-2"><Heart size={16} className="text-rose-500 fill-rose-500"/> Sổ Lưu Niệm ({list.length})</h2><form onSubmit={send} className="space-y-2"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Tên của bạn..." className="w-full p-2.5 rounded-xl bg-slate-50 border text-xs outline-none"/><div className="relative"><input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Lời chúc..." className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-50 border text-xs outline-none"/><button className="absolute right-1.5 top-1.5 p-1.5 bg-rose-500 text-white rounded-lg"><Send size={12}/></button></div></form><div className="space-y-2 max-h-[220px] overflow-y-auto">{list.map((w,i)=><div key={i} className="bg-slate-50 p-3 rounded-xl"><span className="font-bold text-xs block">{w.name}</span><p className="text-xs text-slate-600 mt-0.5">{w.msg}</p></div>)}</div></div>
      </div>
    </div>
  );
};