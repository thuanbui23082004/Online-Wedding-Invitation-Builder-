import React, { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { CreditCard, Copy, Check, Clock, X, Tag, ArrowLeft } from 'lucide-react'

// Khi nối Backend thật, các giá trị này nên lấy từ API POST /orders -> trả về mã đơn + thông tin chuyển khoản.
const BANK_INFO = {
  bankName: 'MBBank',
  accountNumber: '221225668',
  accountName: 'NGUYEN VAN A',
}
const parsePriceK = (raw?: string) => {
  if (!raw) return 0
  const cleaned = raw.replace(/\./g, '').trim()
  if (cleaned.toUpperCase().endsWith('K')) {
    return parseInt(cleaned.slice(0, -1), 10) * 1000
  }
  return parseInt(cleaned, 10) || 0
}

const formatVND = (n: number) => n.toLocaleString('vi-VN') + 'đ'

const formatMMSS = (totalSeconds: number) => {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export const PaymentQR: React.FC = () => {
  const navigate = useNavigate()
  const { state } = useLocation() as { state?: { plan?: any } }
  const plan = state?.plan

  const [secondsLeft, setSecondsLeft] = useState(600) // 10 phút
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [promo, setPromo] = useState('')
  const [promoError, setPromoError] = useState('')
  const [discountPct, setDiscountPct] = useState(0)

  const transferContent = useMemo(() => 'ZLP' + Math.floor(1000 + Math.random() * 9000), [])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(timer)
  }, [secondsLeft])

  if (!plan) {
    return <Navigate to="/dashboard/plan" replace />
  }

  const basePrice = parsePriceK(plan.price?.monthly)
  const originalPrice = Math.round((basePrice * 1.75) / 1000) * 1000
  const baseDiscountPct = originalPrice > 0 ? Math.round((1 - basePrice / originalPrice) * 100) : 0
  const amount = Math.round((basePrice * (1 - discountPct / 100)) / 1000) * 1000

  const handleApplyPromo = () => {
    const code = promo.trim().toUpperCase()
    if (!code) {
      setPromoError('Vui lòng nhập mã giảm giá.')
      return
    }
    if (code === 'ZEN10') {
      setDiscountPct(10)
      setPromoError('')
    } else {
      setDiscountPct(0)
      setPromoError('Mã giảm giá không hợp lệ hoặc đã hết hạn.')
    }
  }

  const handleCopy = async (field: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 1500)
    } catch {
    }
  }

  const handleCancel = () => {
    if (confirm('Bạn có chắc muốn hủy giao dịch này?')) {
      navigate('/dashboard/plan')
    }
  }

  const qrPayload = `Ngan hang: ${BANK_INFO.bankName} | STK: ${BANK_INFO.accountNumber} | ND: ${transferContent} | So tien: ${amount}`
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=${encodeURIComponent(qrPayload)}`

  const expired = secondsLeft <= 0

  return (
    <div className="min-h-screen bg-[#fdfbfc] px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <Link to="/dashboard/plan" className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600">
          <ArrowLeft size={14} /> Quay lại trang gói dịch vụ
        </Link>

        <div className="mb-7 text-center">
          <h1 className="text-2xl font-black text-slate-900">Thanh toán nâng cấp gói {plan.name}</h1>
          <p className="mt-1.5 text-sm text-slate-500">Hoàn tất chuyển khoản để kích hoạt gói dịch vụ ngay lập tức</p>
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-rose-100 bg-rose-50/40 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-600">{plan.tag}</span>
            <div>
              <p className="text-sm font-black text-slate-800">{plan.name} Plan</p>
              <p className="text-xs">
                <span className="font-black text-rose-600">{formatVND(amount)}</span>{' '}
                <span className="text-slate-300 line-through">{formatVND(originalPrice)}</span>{' '}
                <span className="font-bold text-rose-500">-{discountPct > 0 ? discountPct + baseDiscountPct : baseDiscountPct}%</span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div>
              <div className="flex gap-2">
                <input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="Mã giảm giá (VD: ZEN10)"
                  className="w-44 rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-100"
                />
                <button
                  onClick={handleApplyPromo}
                  className="flex shrink-0 items-center gap-1 rounded-xl bg-rose-500 px-3 text-xs font-bold text-white transition-colors hover:bg-rose-600"
                >
                  <Tag size={12} /> Áp dụng
                </button>
              </div>
              {promoError && <p className="mt-1 text-[11px] font-medium text-rose-500">{promoError}</p>}
              {discountPct > 0 && !promoError && <p className="mt-1 text-[11px] font-medium text-emerald-600">Đã áp dụng giảm thêm {discountPct}%! 🎉</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <CreditCard size={18} className="text-rose-500" /> Thông tin chuyển khoản
            </h2>

            <div className="divide-y divide-slate-100">
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-500">Ngân hàng</span>
                <span className="text-sm font-bold text-slate-800">{BANK_INFO.bankName}</span>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-500">Số tài khoản</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-slate-800">{BANK_INFO.accountNumber}</span>
                  <button
                    onClick={() => handleCopy('stk', BANK_INFO.accountNumber)}
                    className="flex items-center gap-1 rounded-md bg-rose-50 px-2 py-1 text-[11px] font-bold text-rose-500 hover:bg-rose-100"
                  >
                    {copiedField === 'stk' ? <Check size={11} /> : <Copy size={11} />} {copiedField === 'stk' ? 'Đã chép' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-500">Tên người nhận</span>
                <span className="text-sm font-bold text-slate-800">{BANK_INFO.accountName}</span>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-500">Nội dung CK</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-rose-600">{transferContent}</span>
                  <button
                    onClick={() => handleCopy('content', transferContent)}
                    className="flex items-center gap-1 rounded-md bg-rose-50 px-2 py-1 text-[11px] font-bold text-rose-500 hover:bg-rose-100"
                  >
                    {copiedField === 'content' ? <Check size={11} /> : <Copy size={11} />} {copiedField === 'content' ? 'Đã chép' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-500">Số tiền</span>
                <span className="text-xl font-black text-rose-600">{formatVND(amount)}</span>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-white ${expired ? 'bg-slate-400' : 'bg-linear-to-r from-rose-500 to-pink-600'}`}
            >
              <Clock size={18} className="shrink-0" />
              <span className="text-sm font-medium">{expired ? 'Giao dịch đã hết hạn' : 'Giao dịch kết thúc trong'}</span>
              {!expired && (
                <span className="ml-auto flex gap-1 font-mono text-base font-black">
                  <span className="rounded-md bg-white/20 px-2 py-0.5">{formatMMSS(secondsLeft).slice(0, 2)}</span>
                  :
                  <span className="rounded-md bg-white/20 px-2 py-0.5">{formatMMSS(secondsLeft).slice(3, 5)}</span>
                </span>
              )}
            </div>

            <button
              onClick={handleCancel}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-50"
            >
              <X size={14} /> Hủy giao dịch
            </button>

            <p className="text-center text-[11px] leading-relaxed text-slate-400">
              Vui lòng chuyển khoản đúng <strong>nội dung</strong> và <strong>số tiền</strong> để hệ thống tự động xác nhận trong 1-3 phút.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-5 rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm">
            <div>
              <h2 className="text-base font-bold text-slate-900">Quét QR để thanh toán</h2>
              <p className="mt-1 text-xs text-slate-400">Mở ứng dụng ngân hàng và quét mã QR bên dưới</p>
            </div>

            <div className="relative rounded-2xl border-2 border-dashed border-rose-200 p-4">
              <span className="absolute -left-0.5 -top-0.5 h-5 w-5 rounded-tl-2xl border-l-4 border-t-4 border-rose-400" />
              <span className="absolute -right-0.5 -top-0.5 h-5 w-5 rounded-tr-2xl border-r-4 border-t-4 border-rose-400" />
              <span className="absolute -bottom-0.5 -left-0.5 h-5 w-5 rounded-bl-2xl border-b-4 border-l-4 border-rose-400" />
              <span className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-br-2xl border-b-4 border-r-4 border-rose-400" />
              <img src={qrImageUrl} alt="Mã QR thanh toán" className="h-64 w-64 rounded-lg object-contain" />
            </div>

            <div>
              <p className="text-xs text-slate-400">Số tiền thanh toán</p>
              <p className="text-3xl font-black text-rose-600">{formatVND(amount)}</p>
            </div>

            <div className="w-full rounded-xl bg-slate-50 p-4 text-left text-xs text-slate-600">
              <p className="font-bold text-slate-800">{BANK_INFO.bankName}</p>
              <p className="mt-0.5 font-bold text-slate-800">{BANK_INFO.accountName}</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-mono">{BANK_INFO.accountNumber}</span>
                <button
                  onClick={() => handleCopy('stk2', BANK_INFO.accountNumber)}
                  className="flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[11px] font-bold text-rose-500 shadow-sm hover:bg-rose-50"
                >
                  {copiedField === 'stk2' ? <Check size={11} /> : <Copy size={11} />} {copiedField === 'stk2' ? 'Đã chép' : 'Copy'}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">Hỗ trợ mọi ứng dụng có chuẩn VietQR để thanh toán đơn hàng.</p>
          </div>
        </div>
      </div>
    </div>
  )
}