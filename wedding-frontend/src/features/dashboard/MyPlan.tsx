import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from './DashboardLayout'
import { Check, X, Crown, Sparkles, Zap, ArrowRight, CreditCard, Star } from 'lucide-react'

export const MyPlan: React.FC = () => {
  const navigate = useNavigate()
  const [billing, setBilling] = useState<'monthly' | 'lifetime'>('lifetime')

  const plans = [
    {
      id: 'free',
      name: 'Khởi đầu',
      tag: 'FREE',
      price: { monthly: '0', lifetime: '0' },
      period: 'Vĩnh viễn',
      isCurrent: true,
      color: 'text-slate-600',
      tagBg: 'bg-slate-100 text-slate-600',
      icon: <Zap size={20} />,
      iconBg: 'bg-slate-100',
      features: [
        { text: '1 thiệp cưới', ok: true },
        { text: '10 ảnh lưu trữ', ok: true },
        { text: '300 lượt xem / tháng', ok: true },
        { text: 'RSVP & Lời chúc', ok: true },
        { text: 'Thư viện nhạc', ok: true },
        { text: 'Nhạc nền cơ bản', ok: true },
        { text: 'Xóa nền AI', ok: false },
        { text: 'Tên miền riêng', ok: false },
        { text: 'Hỗ trợ 24/7', ok: false },
      ],
    },
    {
      id: 'pro',
      name: 'Chuyên nghiệp',
      tag: 'PRO',
      price: { monthly: '199K' },
      period: billing === 'monthly' ? '/ tháng' : 'Dùng trọn đời',
      isHot: true,
      color: 'text-rose-600',
      tagBg: 'bg-rose-100 text-rose-600',
      icon: <Crown size={20} />,
      iconBg: 'bg-rose-50',
      features: [
        { text: '5 thiệp cưới', ok: true },
        { text: '100 ảnh HD', ok: true },
        { text: '5.000 lượt xem / tháng', ok: true },
        { text: 'RSVP & Lời chúc', ok: true },
        { text: 'Chữ ký khách mời', ok: true },
        { text: 'Nhạc nền HD', ok: true },
        { text: 'Xóa nền AI', ok: true },
        { text: 'Tên miền riêng', ok: false },
        { text: 'Chat hỗ trợ ưu tiên', ok: true },
      ],
    },
    {
      id: 'premium',
      name: 'Cao cấp VIP',
      tag: 'PREMIUM',
      price: { monthly: '499K' },
      period: billing === 'monthly' ? '/ tháng' : 'Dùng trọn đời',
      color: 'text-amber-600',
      tagBg: 'bg-amber-100 text-amber-700',
      icon: <Sparkles size={20} />,
      iconBg: 'bg-amber-50',
      features: [
        { text: 'Không giới hạn thiệp', ok: true },
        { text: 'Không giới hạn ảnh', ok: true },
        { text: 'Không giới hạn lượt xem', ok: true },
        { text: 'RSVP & Lời chúc', ok: true },
        { text: 'Ẩn hoàn toàn thương hiệu', ok: true },
        { text: 'Nhạc nền HD Lossless', ok: true },
        { text: 'Xóa nền AI không giới hạn', ok: true },
        { text: 'Tên miền riêng (.com)', ok: true },
        { text: 'Thiết kế 1:1 qua Zalo', ok: true },
      ],
    },
  ]

  return (
    <DashboardLayout title="Gói dịch vụ" subtitle="Chọn gói phù hợp với nhu cầu của bạn">
      <div className="max-w-5xl mx-auto space-y-7 pb-8">
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-5 py-3.5 flex items-center gap-3">
          <Crown size={18} className="text-amber-500 shrink-0" />
          <div className="text-sm text-amber-700">
            Bạn đang dùng <strong>Free Plan</strong>. Nâng cấp ngay để mở khóa AI xóa nền, HD music và thiệp không giới hạn.
          </div>
          <div className="ml-auto shrink-0 text-xs text-amber-600 font-bold">Còn 300 lượt xem</div>
        </div>

        <div className="flex justify-center">
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${billing === 'monthly' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
             
              Gói dịch vụ 
              <span className="text-[10px] bg-emerald-10"></span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {plans.map(plan => {
            const { icon, iconBg, ...serializablePlan } = plan
            return (
              <div
                key={plan.id}
                className={`rounded-2xl overflow-hidden border transition-all ${plan.isHot ? 'border-rose-200 shadow-xl shadow-rose-100/50 scale-[1.02]' : 'border-slate-100 shadow-sm bg-white'}`}
                style={plan.isHot ? { background: 'linear-gradient(160deg, #fff, #fff5f7)' } : {}}
              >
                {plan.isHot && (
                  <div className="py-1.5 text-center text-[11px] font-black text-white tracking-wider" style={{ background: 'linear-gradient(135deg, #e8607a, #c4395a)' }}>
                   <Star />ĐƯỢC CHỌN NHIỀU NHẤT
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
                      <span className={`text-4xl font-black ${plan.isCurrent ? 'text-slate-600' : plan.isHot ? 'text-rose-600' : 'text-amber-600'}`}>
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
                        ? { background: 'linear-gradient(135deg, #e8607a, #c4395a)', boxShadow: '0 4px 16px rgba(232,96,122,0.35)' }
                        : { background: 'linear-gradient(135deg, #b45309, #92400e)' }
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
    </DashboardLayout>
  )
}