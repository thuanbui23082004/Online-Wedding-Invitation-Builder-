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
    { key: 'info', label: 'Thông tin cá nhân', icon: <User size={14} /> },
    { key: 'security', label: 'Mật khẩu & Bảo mật', icon: <Lock size={14} /> },
    { key: 'notifications', label: 'Thông báo', icon: <Smartphone size={14} /> },
  ]

  return (
    <DashboardLayout title="Tài khoản" subtitle="Quản lý thông tin cá nhân và bảo mật tài khoản">
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl font-black shadow-md">N</div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white hover:bg-rose-600 transition-colors">
                <Camera size={11} />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-black text-slate-800">{form.fullName}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{form.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                  <Crown size={10} /> FREE PLAN
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  <Shield size={10} /> Đã xác minh
                </span>
              </div>
            </div>
            <Link
              to="/dashboard/plan"
              className="flex-shrink-0 text-xs font-bold text-white px-3 py-2 rounded-lg transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #e8607a, #c4395a)' }}
            >
              Nâng cấp Pro
            </Link>
          </div>
        </div>


        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-100">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold border-b-2 transition-all ${tab === t.key ? 'border-rose-500 text-rose-600 bg-rose-50/50' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <div className="p-6">
           
            {tab === 'info' && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">TÊN HIỂN THỊ <span className="text-rose-500">*</span></label>
                    <input
                      value={form.fullName}
                      onChange={e => setForm({ ...form, fullName: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">EMAIL <span className="text-slate-300">(không thể sửa)</span></label>
                    <input
                      value={form.email}
                      disabled
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-100 text-sm text-slate-400 bg-slate-50 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">SỐ ĐIỆN THOẠI</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="Nhập số điện thoại..."
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">NGÀY SINH</label>
                    <input
                      type="date"
                      value={form.dob}
                      onChange={e => setForm({ ...form, dob: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-600 outline-none focus:border-rose-400 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">GIỚI THIỆU</label>
                  <textarea
                    rows={3}
                    value={form.bio}
                    onChange={e => setForm({ ...form, bio: e.target.value })}
                    placeholder="Viết vài dòng giới thiệu về bạn..."
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all resize-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-bold transition-all hover:opacity-90 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #e8607a, #c4395a)' }}
                  >
                    {saved ? <><Check size={15} /> Đã lưu!</> : 'Lưu thay đổi'}
                  </button>
                  <span className="text-xs text-slate-400">Thông tin sẽ được cập nhật ngay lập tức</span>
                </div>
              </div>
            )}

            {tab === 'security' && (
              <div className="max-w-sm space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">MẬT KHẨU HIỆN TẠI</label>
                  <div className="relative">
                    <input type={showPwd ? 'text' : 'password'} placeholder="Nhập mật khẩu hiện tại..."
                      className="w-full px-3 py-2.5 pr-10 rounded-lg border border-slate-200 text-sm outline-none focus:border-rose-400 transition-all" />
                    <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">MẬT KHẨU MỚI</label>
                  <input type="password" placeholder="Nhập mật khẩu mới (≥ 8 ký tự)..."
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-rose-400 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">XÁC NHẬN MẬT KHẨU MỚI</label>
                  <input type="password" placeholder="Nhập lại mật khẩu mới..."
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-rose-400 transition-all" />
                </div>
                <button className="px-5 py-2.5 rounded-lg text-white text-sm font-bold bg-slate-800 hover:bg-slate-900 transition-all">
                  Cập nhật mật khẩu
                </button>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700 mb-1"><Globe size={12} /> Đăng nhập mạng xã hội</div>
                  <p className="text-[11px] text-blue-500">Tài khoản của bạn đang liên kết với Google. Mật khẩu sẽ dùng để đăng nhập bằng email.</p>
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
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <div className="text-sm font-semibold text-slate-700">{n.label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{n.sub}</div>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${n.on ? 'bg-rose-500' : 'bg-slate-200'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${n.on ? 'left-5' : 'left-0.5'}`} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-red-100 shadow-sm p-5">
          <h4 className="text-xs font-black text-red-500 uppercase tracking-wider mb-3">Vùng nguy hiểm</h4>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-700">Xóa tài khoản</div>
              <div className="text-xs text-slate-400">Hành động này hoàn tác thì tất cả dữ liệu sẽ bị xóa</div>
            </div>
            <button className="px-3 py-2 text-xs font-bold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
              Xóa tài khoản
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}