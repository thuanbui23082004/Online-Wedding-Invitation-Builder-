import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from './DashboardLayout'
import DashboardPanel from '../components/DashboardPanel'
import { Check, X, Crown, Sparkles, Zap, ArrowRight, CreditCard, Star } from 'lucide-react'
import { useAuthStore } from '../../../store/authStore'

export const MyPlan: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [billing, setBilling] = useState<'monthly' | 'lifetime'>('lifetime')

  const isFree = !user?.currentPlanId || user.currentPlanId === '00000000-0000-0000-0000-000000000001'
  const isPro = user?.currentPlanId === '00000000-0000-0000-0000-000000000002'

  const plans = [
    {
      id: 'free',
      dbId: '00000000-0000-0000-0000-000000000001',
      name: 'Khởi đầu',
      tag: 'FREE',
      price: { monthly: '0đ', lifetime: '0đ' },
      period: 'Vĩnh viễn',
      isCurrent: isFree,
      color: 'text-zinc-600',
      tagBg: 'bg-zinc-100 text-zinc-600',
      icon: <Zap size={20} />,
      iconBg: 'bg-zinc-100',
      features: [
        { text: '1 thiệp cưới nghệ thuật', ok: true },
        { text: '10 ảnh lưu trữ đám cưới', ok: true },
        { text: '300 lượt xem / tháng', ok: true },
        { text: 'Quản lý RSVP & Lời chúc', ok: true },
        { text: 'Thư viện nhạc nền cơ bản', ok: true },
        { text: 'Xóa nền AI tự động', ok: false },
        { text: 'Tên miền riêng tùy chỉnh', ok: false },
        { text: 'Hỗ trợ kỹ thuật 24/7', ok: false },
      ],
    },
    {
      id: 'pro',
      dbId: '00000000-0000-0000-0000-000000000002',
      name: 'Chuyên nghiệp',
      tag: 'PRO',
      price: { monthly: '199.000đ', lifetime: '499.000đ' },
      period: billing === 'monthly' ? 'mỗi tháng' : 'thanh toán 1 lần',
      isCurrent: isPro,
      isHot: true,
      color: 'text-[rgb(235,76,76)]',
      tagBg: 'bg-[rgb(255,237,199)] text-[rgb(235,76,76)]',
      icon: <Crown size={20} />,
      iconBg: 'bg-[rgb(255,237,199)]',
      features: [
        { text: '5 thiệp cưới cao cấp', ok: true },
        { text: '100 ảnh lưu trữ HD', ok: true },
        { text: '5.000 lượt xem / tháng', ok: true },
        { text: 'Quản lý RSVP & Lời chúc', ok: true },
        { text: 'Chữ ký số khách mời', ok: true },
        { text: 'Nhạc nền chất lượng cao HD', ok: true },
        { text: 'Xóa nền AI không giới hạn', ok: true },
        { text: 'Tên miền riêng tùy chỉnh', ok: false },
        { text: 'Chat hỗ trợ ưu tiên 24/7', ok: true },
      ],
    },
    {
      id: 'premium',
      dbId: 'premium-mock-id',
      name: 'Cao cấp VIP',
      tag: 'PREMIUM',
      price: { monthly: '499.000đ', lifetime: '999.000đ' },
      period: billing === 'monthly' ? 'mỗi tháng' : 'thanh toán 1 lần',
      isCurrent: false,
      color: 'text-amber-600',
      tagBg: 'bg-amber-100 text-amber-700',
      icon: <Sparkles size={20} />,
      iconBg: 'bg-amber-50',
      features: [
        { text: 'Không giới hạn số thiệp', ok: true },
        { text: 'Không giới hạn ảnh lưu trữ', ok: true },
        { text: 'Không giới hạn lượt xem', ok: true },
        { text: 'Quản lý RSVP & Lời chúc', ok: true },
        { text: 'Ẩn hoàn toàn logo thương hiệu', ok: true },
        { text: 'Nhạc nền lossless HD cao cấp', ok: true },
        { text: 'Xóa nền AI không giới hạn', ok: true },
        { text: 'Tên miền riêng miễn phí (.com)', ok: true },
        { text: 'Thiết kế riêng 1:1 qua Zalo', ok: true },
      ],
    },
  ]

  return (
    <DashboardLayout title="Gói dịch vụ" subtitle="Chọn gói phù hợp với nhu cầu của bạn">
      <DashboardPanel className="p-6">
        <div className="max-w-5xl mx-auto space-y-7 pb-8">
          <div className="bg-gradient-to-r from-[rgb(255,237,199)]/40 to-[rgb(255,166,166)]/15 border border-[rgb(255,166,166)]/45 rounded-3xl p-5 flex flex-col sm:flex-row items-center gap-4 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-[rgb(235,76,76)] flex items-center justify-center text-white shadow-sm shadow-[rgb(255,166,166)]/30">
              <Crown size={20} />
            </div>
            <div className="text-center sm:text-left space-y-0.5">
              <div className="text-xs text-[rgb(235,76,76)] font-black tracking-wider uppercase">Gói dịch vụ hiện tại</div>
              <div className="text-sm font-bold text-zinc-800 leading-none">
                Bạn đang sử dụng <span className="text-[rgb(235,76,76)] font-extrabold">{isPro ? 'Chuyên nghiệp (PRO)' : 'Khởi đầu (FREE)'}</span>
              </div>
            </div>
            <div className="sm:ml-auto shrink-0 text-xs text-[rgb(235,76,76)] bg-[rgb(255,237,199)] border border-[rgb(255,166,166)] px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider">
              {isPro ? 'Không giới hạn tính năng' : 'Mở khóa bản Pro để dùng AI'}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="inline-flex bg-zinc-100 p-1 rounded-2xl gap-1 shadow-inner border border-zinc-200/40">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-200 cursor-pointer ${billing === 'monthly'
                  ? 'bg-white text-[rgb(235,76,76)] shadow-md border border-[rgb(255,166,166)]/20'
                  : 'text-zinc-500 hover:text-zinc-800'
                  }`}
              >
                Theo tháng
              </button>
              <button
                onClick={() => setBilling('lifetime')}
                className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-200 cursor-pointer ${billing === 'lifetime'
                  ? 'bg-white text-[rgb(235,76,76)] shadow-md border border-[rgb(255,166,166)]/20'
                  : 'text-zinc-500 hover:text-zinc-800'
                  }`}
              >
                Trọn đời
                <span className="ml-1.5 px-1.5 py-0.5 text-[9px] bg-emerald-500 text-white rounded-md font-black uppercase tracking-normal">TIẾT KIỆM</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {plans.map(plan => {
              const { icon, iconBg, ...serializablePlan } = plan
              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl overflow-hidden border transition-all ${plan.isHot ? 'border-[rgb(255,166,166)] shadow-xl shadow-[rgb(255,166,166)]/35 scale-[1.02]' : 'border-slate-100 shadow-sm bg-white'}`}
                  style={plan.isHot ? { background: 'linear-gradient(160deg, #fff, #fffbf2)' } : {}}
                >
                  {plan.isHot && (
                    <div className="py-2 text-center text-[10px] font-black text-white tracking-widest flex items-center justify-center gap-1 bg-gradient-to-r from-[rgb(235,76,76)] to-[rgb(255,112,112)]">
                      <Star size={11} className="fill-white" /> ĐƯỢC CHỌN NHIỀU NHẤT
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl ${plan.iconBg} flex items-center justify-center ${plan.color}`}>
                        {plan.icon}
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-400 uppercase tracking-wider">{plan.tag}</div>
                        <div className="text-sm font-black text-slate-800">{plan.name}</div>
                      </div>
                    </div>

                    <div className="mb-5">
                      <div className="flex items-end gap-1">
                        <span className={`text-4xl font-black ${plan.isCurrent ? 'text-slate-600' : plan.isHot ? 'text-[rgb(235,76,76)]' : 'text-amber-600'}`}>
                          {plan.price[billing]}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{plan.period}</div>
                    </div>

                    <ul className="space-y-2.5 mb-5">
                      {plan.features.map((f, i) => (
                        <li key={i} className={`flex items-center gap-2.5 text-xs ${f.ok ? 'text-slate-700' : 'text-slate-300'}`}>
                          {f.ok
                            ? <Check size={13} className="text-emerald-500 shrink-0" />
                            : <X size={13} className="text-slate-200 shrink-0" />
                          }
                          {f.text}
                        </li>
                      ))}
                    </ul>

                    {plan.isCurrent ? (
                      <button disabled className="w-full py-3 rounded-xl text-xs font-bold text-slate-400 bg-slate-100 cursor-not-allowed">
                        ✓ Gói đang dùng
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => navigate('/dashboard/payment', { state: { plan: serializablePlan } })}
                        className="w-full py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
                        style={plan.isHot
                          ? { background: 'linear-gradient(135deg, rgb(255, 112, 112), rgb(235, 76, 76))', boxShadow: '0 4px 16px rgba(235, 76, 76, 0.35)' }
                          : { background: 'linear-gradient(135deg, rgb(255, 166, 166), rgb(235, 76, 76))' }
                        }
                      >
                        <CreditCard size={13} /> Nâng cấp ngay <ArrowRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Câu hỏi thường gặp</h3>
            <div className="space-y-3">
              {[
                { q: 'Gói Trọn đời có nghĩa là gì?', a: 'Bạn chỉ cần trả một lần duy nhất và sử dụng mãi mãi, kể cả khi Zenlove ra tính năng mới.' },
                { q: 'Tôi có thể nâng/hạ cấp gói không?', a: 'Có thể nâng cấp bất kỳ lúc nào. Hạ cấp áp dụng từ chu kỳ thanh toán tiếp theo.' },
                { q: 'Phương thức thanh toán nào được hỗ trợ?', a: 'Chúng tôi hỗ trợ chuyển khoản ngân hàng, Momo, VNPay và thẻ Visa/Mastercard.' },
              ].map((faq, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-xl">
                  <div className="text-xs font-bold text-slate-700 mb-1">{faq.q}</div>
                  <div className="text-xs text-slate-500 leading-relaxed">{faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardPanel>
    </DashboardLayout>
  )
}