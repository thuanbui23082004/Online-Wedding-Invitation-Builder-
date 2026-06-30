import React, { useState } from 'react'
import { DashboardLayout } from './DashboardLayout'
import { User, Lock, Camera, Crown, Check, Eye, EyeOff, Shield, Globe, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'

type Tab = 'info' | 'security' | 'notifications'

export const AccountProfile: React.FC = () => {
  const [tab, setTab] = useState<Tab>('info')
  const [showPwd, setShowPwd] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    fullName: 'Nguyen Van A',
    email: 'nguyenA@example.com',
    phone: '',
    dob: '',
    bio: '',
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'info', label: 'Thông tin cá nhân', icon: <User size={13} /> },
    { key: 'security', label: 'Mật khẩu & Bảo mật', icon: <Lock size={13} /> },
    { key: 'notifications', label: 'Cài đặt thông báo', icon: <Smartphone size={13} /> },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
        
        <div className="bg-white rounded-4xl border border-rose-100/50 shadow-[0_15px_40px_rgba(244,63,94,0.01)] p-6">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center text-2xl font-black shadow-md shadow-rose-200">
                N
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white hover:bg-rose-600 transition-all cursor-pointer">
                <Camera size={11} />
              </button>
            </div>
            
            <div className="flex-1 text-center sm:text-left space-y-1">
              <h2 className="text-lg font-black text-zinc-800 font-poppins">{form.fullName}</h2>
              <p className="text-xs text-zinc-400 font-poppins font-medium">{form.email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="flex items-center gap-1 text-[10px] font-black tracking-wider uppercase text-amber-600 bg-amber-50 border border-amber-100/60 px-2.5 py-0.5 rounded-md shadow-2xs">
                  <Crown size={10} /> FREE PLAN
                </span>
                <span className="flex items-center gap-1 text-[10px] font-black tracking-wider uppercase text-emerald-600 bg-emerald-50 border border-emerald-100/60 px-2.5 py-0.5 rounded-md shadow-2xs">
                  <Shield size={10} /> ĐÃ XÁC MINH
                </span>
              </div>
            </div>

            <Link
              to="/dashboard/plan"
              className="w-full sm:w-auto text-center text-xs font-bold text-white px-5 py-3 rounded-xl transition-all shadow-sm shadow-rose-500/10 hover:shadow-rose-500/20 active:scale-95 bg-rose-600 hover:bg-rose-700 cursor-pointer"
            >
              Nâng cấp Pro
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-4xl border border-rose-100/50 shadow-[0_15px_40px_rgba(244,63,94,0.01)] overflow-hidden">
          <div className="flex border-b border-rose-100/30 bg-zinc-50/40 p-2 gap-1">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${tab === t.key ? 'bg-white border border-rose-100/40 text-rose-500 shadow-2xs' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {tab === 'info' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider">TÊN HIỂN THỊ <span className="text-rose-500">*</span></label>
                    <input
                      value={form.fullName}
                      onChange={e => setForm({ ...form, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-800 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider">EMAIL <span className="text-zinc-350">(KHÔNG THỂ THAY ĐỔI)</span></label>
                    <input
                      value={form.email}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-zinc-100 text-sm text-zinc-400 bg-zinc-50 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider">SỐ ĐIỆN THOẠI</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="Nhập số điện thoại..."
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-800 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider">NGÀY SINH</label>
                    <input
                      type="date"
                      value={form.dob}
                      onChange={e => setForm({ ...form, dob: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-650 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all bg-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider">GIỚI THIỆU</label>
                  <textarea
                    rows={3}
                    value={form.bio}
                    onChange={e => setForm({ ...form, bio: e.target.value })}
                    placeholder="Viết vài dòng giới thiệu về bạn..."
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-800 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all bg-white resize-none"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                  <button
                    onClick={handleSave}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white text-xs font-bold transition-all hover:bg-rose-700 active:scale-95 bg-rose-600 cursor-pointer shadow-sm shadow-rose-500/10"
                  >
                    {saved ? <><Check size={14} /> Đã lưu!</> : 'Lưu thay đổi'}
                  </button>
                  <span className="text-[11px] text-zinc-400 font-poppins font-medium text-center sm:text-left">Dữ liệu cá nhân sẽ cập nhật đồng bộ lập tức</span>
                </div>
              </div>
            )}

            {tab === 'security' && (
              <div className="max-w-md space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider">MẬT KHẨU HIỆN TẠI</label>
                  <div className="relative">
                    <input 
                      type={showPwd ? 'text' : 'password'} 
                      placeholder="Nhập mật khẩu hiện tại..."
                      className="w-full px-4 py-3 pr-10 rounded-xl border border-zinc-200 text-sm text-zinc-800 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all bg-white" 
                    />
                    <button 
                      onClick={() => setShowPwd(!showPwd)} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                    >
                      {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider">MẬT KHẨU MỚI</label>
                  <input 
                    type="password" 
                    placeholder="Nhập mật khẩu mới (≥ 8 ký tự)..."
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-800 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all bg-white" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider">XÁC NHẬN MẬT KHẨU MỚI</label>
                  <input 
                    type="password" 
                    placeholder="Nhập lại mật khẩu mới..."
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-800 outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all bg-white" 
                  />
                </div>
                
                <button className="px-6 py-3 rounded-xl text-white text-xs font-bold bg-zinc-800 hover:bg-zinc-900 active:scale-95 transition-all cursor-pointer shadow-sm shadow-zinc-500/10">
                  Cập nhật mật khẩu
                </button>
                
                <div className="p-4 bg-sky-50/40 rounded-2xl border border-sky-100/50 leading-relaxed">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-700 mb-1">
                    <Globe size={13} /> Đăng nhập bằng mạng xã hội
                  </div>
                  <p className="text-[11px] text-sky-600 font-medium font-poppins">
                    Tài khoản của bạn hiện liên kết thông tin với Google. Bạn có thể sử dụng email này để đăng nhập trực tiếp.
                  </p>
                </div>
              </div>
            )}

            {tab === 'notifications' && (
              <div className="space-y-4">
                {[
                  { label: 'Lời chúc mới từ khách mời', sub: 'Nhận thông báo khi có lời chúc mới cần duyệt', on: true },
                  { label: 'Khách RSVP xác nhận tham dự', sub: 'Thông báo mỗi khi có khách phản hồi tham dự', on: true },
                  { label: 'Báo cáo lượt xem hàng tuần', sub: 'Email tổng hợp số lượt xem thiệp mỗi tuần', on: false },
                  { label: 'Thông báo hết hạn gói dịch vụ', sub: 'Nhắc nhở 7 ngày trước khi gói hết hạn', on: true },
                ].map((n, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-zinc-50/50 rounded-2xl border border-zinc-100">
                    <div className="space-y-0.5">
                      <div className="text-sm font-semibold text-zinc-700 font-poppins">{n.label}</div>
                      <div className="text-xs text-zinc-400 font-poppins font-medium">{n.sub}</div>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${n.on ? 'bg-rose-500' : 'bg-zinc-200'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-xs transition-all ${n.on ? 'left-5' : 'left-0.5'}`} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-red-100/50 shadow-[0_15px_40px_rgba(239,68,68,0.01)] p-6 space-y-4">
          <h4 className="text-[10px] font-black text-red-500 uppercase tracking-wider">Vùng nguy hiểm</h4>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-bold text-zinc-700 font-poppins">Xóa tài khoản vĩnh viễn</div>
              <div className="text-xs text-zinc-400 font-poppins font-medium">Hành động này hoàn tác thì tất cả thiệp mời cưới và dữ liệu sẽ bị xóa hoàn toàn.</div>
            </div>
            <button className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-red-500 border border-red-200/50 rounded-xl hover:bg-red-50/30 transition-colors active:scale-95 cursor-pointer">
              Xóa tài khoản
            </button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}