import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../dashboard/DashboardLayout'
import { Crown, ArrowRight, Heart, Search, Star } from 'lucide-react'

type FilterType = 'ALL' | 'FREE' | 'PRO'
type CategoryType = 'Tất cả' | 'Tối giản' | 'Cổ điển' | 'Hiện đại' | 'Thiên nhiên' | 'Sang trọng'

const templates = [
  {
    id: '1', name: 'Minimal Pure White', cat: 'Tối giản', pro: false, liked: false,
    rating: 4.8, uses: 234,
    colors: ['#fce4ec', '#fff9fb', '#f8bbd0'],
    gradient: 'linear-gradient(135deg, #fce4ec 0%, #fff9fb 50%, #fce4ec 100%)',
    previewText: { bride: 'An', groom: 'Bình', date: '20 · 09 · 2025' },
  },
  {
    id: '2', name: 'Vintage Floral Rose', cat: 'Cổ điển', pro: false, liked: true,
    rating: 4.9, uses: 412,
    gradient: 'linear-gradient(160deg, #f8e8d4 0%, #f5c6aa 50%, #e8a87c 100%)',
    previewText: { bride: 'Lan', groom: 'Tuấn', date: '12 · 12 · 2025' },
    colors: ['#f8e8d4', '#f5c6aa', '#e8a87c'],
  },
  {
    id: '3', name: 'Royal Gold Luxury', cat: 'Sang trọng', pro: true, liked: false,
    rating: 5.0, uses: 89,
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    previewText: { bride: 'Linh', groom: 'Huy', date: '08 · 03 · 2026' },
    colors: ['#ffd700', '#c9a227', '#a67c00'],
    dark: true,
  },
  {
    id: '4', name: 'Sunset Romance', cat: 'Hiện đại', pro: true, liked: false,
    rating: 4.7, uses: 156,
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    previewText: { bride: 'Mai', groom: 'Long', date: '14 · 02 · 2026' },
    colors: ['#ff9a9e', '#fecfef'],
  },
  {
    id: '5', name: 'Bohemian Green', cat: 'Thiên nhiên', pro: false, liked: false,
    rating: 4.6, uses: 178,
    gradient: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 50%, #a8d5b5 100%)',
    previewText: { bride: 'Thảo', groom: 'Nam', date: '05 · 05 · 2025' },
    colors: ['#d4edda', '#a8d5b5', '#6aab7c'],
  },
  {
    id: '6', name: 'Diamond Sparkle VIP', cat: 'Sang trọng', pro: true, liked: false,
    rating: 5.0, uses: 67,
    gradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    previewText: { bride: 'Ngọc', groom: 'Khoa', date: '30 · 04 · 2026' },
    colors: ['#2c3e50', '#3498db'],
    dark: true,
  },
  {
    id: '7', name: 'Pastel Spring', cat: 'Tối giản', pro: false, liked: true,
    rating: 4.5, uses: 321,
    gradient: 'linear-gradient(135deg, #e8d5f5 0%, #d4e8fa 50%, #fde8d8 100%)',
    previewText: { bride: 'Phương', groom: 'Minh', date: '21 · 06 · 2025' },
    colors: ['#e8d5f5', '#d4e8fa', '#fde8d8'],
  },
  {
    id: '8', name: 'Modern Ink', cat: 'Hiện đại', pro: true, liked: false,
    rating: 4.8, uses: 112,
    gradient: 'linear-gradient(135deg, #1c1c1c 0%, #2d2d2d 100%)',
    previewText: { bride: 'Yến', groom: 'Đức', date: '10 · 10 · 2025' },
    colors: ['#ffffff', '#e0e0e0'],
    dark: true,
  },
]

export const Templates: React.FC = () => {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<FilterType>('ALL')
  const [category, setCategory] = useState<CategoryType>('Tất cả')
  const [search, setSearch] = useState('')
  const [likes, setLikes] = useState<Set<string>>(new Set(templates.filter(t => t.liked).map(t => t.id)))
  const [hoverId, setHoverId] = useState<string | null>(null)

  const categories: CategoryType[] = ['Tất cả', 'Tối giản', 'Cổ điển', 'Hiện đại', 'Thiên nhiên', 'Sang trọng']

  const filtered = templates.filter(t => {
    const matchFilter = filter === 'ALL' || (filter === 'FREE' ? !t.pro : t.pro)
    const matchCat = category === 'Tất cả' || t.cat === category
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.cat.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchCat && matchSearch
  })

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setLikes(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
  const handleUseTemplate = (tpl: typeof templates[0]) => {
    navigate(`/editor?templateId=${tpl.id}&title=${encodeURIComponent(tpl.name)}&bride=${encodeURIComponent(tpl.previewText.bride)}&groom=${encodeURIComponent(tpl.previewText.groom)}`);
  }

  return (
    <DashboardLayout title="Kho mẫu thiệp" subtitle={`${templates.length} mẫu thiệp cưới được thiết kế bởi Zenlove`}>
      <div className="space-y-3 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm mẫu thiệp..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all shadow-sm"
            />
          </div>
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-1 shadow-sm">
            {(['ALL', 'FREE', 'PRO'] as FilterType[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {f === 'ALL' ? 'Tất cả' : f === 'FREE' ? 'Miễn phí' : <span className="flex items-center gap-1"><Crown size={10} /> Pro</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${category === cat ? 'border-rose-200 text-rose-600' : 'border-slate-100 text-slate-500 hover:border-slate-200 bg-white'}`}
              style={category === cat ? { background: '#fff8f9' } : {}}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-400 self-center">{filtered.length} mẫu</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(tpl => (
          <div
            key={tpl.id}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
            onMouseEnter={() => setHoverId(tpl.id)}
            onMouseLeave={() => setHoverId(null)}
          >
            <div className="relative aspect-[9/14] overflow-hidden" style={{ background: tpl.gradient }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                <div className={`text-[10px] font-bold tracking-[3px] mb-2 ${tpl.dark ? 'text-white/60' : 'text-rose-400'}`}>
                  WE'RE GETTING MARRIED
                </div>
                <div className={`text-2xl font-serif font-black text-center leading-tight ${tpl.dark ? 'text-white' : 'text-slate-800'}`}>
                  {tpl.previewText.bride}
                </div>
                <div className={`text-sm my-1 ${tpl.dark ? 'text-white/40' : 'text-rose-300'}`}>&</div>
                <div className={`text-2xl font-serif font-black text-center leading-tight ${tpl.dark ? 'text-white' : 'text-slate-800'}`}>
                  {tpl.previewText.groom}
                </div>
                <div className={`text-[10px] tracking-widest mt-3 ${tpl.dark ? 'text-white/50' : 'text-slate-400'}`}>
                  {tpl.previewText.date}
                </div>
                <div className="flex gap-1.5 mt-4">
                  {tpl.colors.map((c, i) => (
                    <div key={i} className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-sm" style={{ background: c }} />
                  ))}
                </div>
              </div>

              <div className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3 transition-opacity duration-200 ${hoverId === tpl.id ? 'opacity-100' : 'opacity-0'}`}>
                <button
                 onClick={() => handleUseTemplate(tpl)}
                  className="flex items-center gap-2 bg-white text-slate-800 px-5 py-2.5 rounded-xl text-sm font-bold shadow-xl hover:bg-slate-100 transition-colors"
                >
                  Dùng mẫu này <ArrowRight size={15} />
                </button>
                <button className="text-white text-xs font-medium underline opacity-80 hover:opacity-100 transition-opacity">
                  Xem trước →
                </button>
              </div>

              <div className="absolute top-3 left-3 flex gap-1.5">
                {tpl.pro && (
                  <span className="flex items-center gap-1 text-[10px] font-black text-white px-2 py-0.5 rounded-full shadow-md" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                    <Crown size={9} /> PRO
                  </span>
                )}
                {!tpl.pro && (
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shadow-md">
                    FREE
                  </span>
                )}
              </div>

              <button
                onClick={(e) => toggleLike(tpl.id, e)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                <Heart size={14} className={likes.has(tpl.id) ? 'text-rose-500 fill-rose-500' : 'text-slate-400'} />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{tpl.name}</h3>
                  <span className="text-[11px] text-slate-400">{tpl.cat}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-amber-500 flex-shrink-0">
                  <Star size={11} className="fill-amber-400 text-amber-400" />
                  <span className="font-bold">{tpl.rating}</span>
                  <span className="text-slate-400">({tpl.uses})</span>
                </div>
              </div>
              <button
                onClick={() => handleUseTemplate(tpl)}
                className="w-full mt-3 py-2 rounded-lg text-xs font-bold transition-all border border-slate-100 text-slate-600 hover:border-rose-200 hover:text-rose-600 hover:bg-rose-50"
              >
                Dùng ngay
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm text-slate-500">Không tìm thấy mẫu phù hợp</p>
          <button onClick={() => { setSearch(''); setFilter('ALL'); setCategory('Tất cả') }} className="text-xs text-rose-500 font-bold mt-2 hover:underline">Xóa bộ lọc</button>
        </div>
      )}
    </DashboardLayout>
  )
}