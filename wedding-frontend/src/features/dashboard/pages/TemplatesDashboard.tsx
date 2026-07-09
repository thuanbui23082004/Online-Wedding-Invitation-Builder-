import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import DashboardPanel from '../components/DashboardPanel';
import { templatesApi, type TemplateItem } from '../../../api/templatesApi';
import { cardsApi } from '../../../api/cardsApi';
import { toast } from 'sonner';
import { Palette, Eye, Search, Sparkles, X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TemplatesDashboard = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  
  // Preview modal states
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const res = await templatesApi.getTemplates();
      const items = Array.isArray(res) ? res : (res?.items || []);
      setTemplates(items);
    } catch (err) {
      console.error('Error fetching templates:', err);
      toast.error('Không thể tải danh sách mẫu thiệp cưới.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (previewTemplate && previewScrollRef.current) {
      previewScrollRef.current.scrollTop = 0;
    }
  }, [previewTemplate]);

  const handleUseTemplate = async (templateId: string, templateName: string) => {
    const loadingToast = toast.loading('Đang khởi tạo thiệp cưới của bạn...');
    try {
      const card = await cardsApi.createCard({
        title: `Thiệp cưới - ${templateName}`,
        templateId: templateId
      });
      toast.dismiss(loadingToast);
      toast.success('Tạo thiệp cưới từ mẫu thành công!');
      navigate(`/loading?next=${encodeURIComponent(`/design?id=${card.id}`)}&message=${encodeURIComponent('Đang mở trình thiết kế...')}`);
    } catch (err: any) {
      toast.dismiss(loadingToast);
      console.error('Error creating card from template:', err);
      toast.error(err.response?.data?.message || 'Không thể khởi tạo thiệp mời từ mẫu này.');
    }
  };

  const handleOpenPreview = async (template: TemplateItem) => {
    try {
      // Try to load full template details with blocks/detail images
      const detail = await templatesApi.getTemplateById(template.id);
      setPreviewTemplate(detail);
    } catch (err) {
      // Fallback to basic list data if detail endpoint fails
      setPreviewTemplate({
        ...template,
        detailImages: [template.thumbnailUrl || '']
      });
    }
  };

  // Compute categories
  const categories = [
    { key: 'ALL', name: 'Tất cả' },
    { key: 'WEDDING', name: 'Thiệp cưới' },
    { key: 'GRADUATION', name: 'Thiệp tốt nghiệp' },
    { key: 'EVENT', name: 'Sự kiện' },
    { key: 'REUNION', name: 'Kỷ niệm' },
    { key: 'BIRTHDAY', name: 'Sinh nhật' }
  ];

  // Filter templates
  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.category?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check match category
    const catSlug = t.category?.slug?.toUpperCase() || '';
    const matchesCategory = activeCategory === 'ALL' || catSlug.includes(activeCategory) || activeCategory.includes(catSlug);

    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <DashboardPanel className="p-4 md:p-8 min-h-[80vh] bg-transparent border-none shadow-none! select-none">
        
        {/* Modern Hero Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-rose-50 via-white to-pink-50/30 border border-rose-100/50 p-8 sm:p-10 mb-8 shadow-sm">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-pink-100/30 rounded-full blur-2xl pointer-events-none translate-y-1/3 -translate-x-1/4" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-100 text-[10px] font-black uppercase tracking-wider text-rose-500 mb-4">
              <Sparkles size={11} className="animate-spin duration-3000" />
              <span>Thiết kế chuyên nghiệp</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 font-inter tracking-tight leading-tight">
              Thư viện thiết kế <span className="text-[rgb(235,76,76)] font-handwritten text-[2.75rem] font-normal block sm:inline-block">Cao cấp</span>
            </h1>
            <p className="mt-2 text-sm text-zinc-550 font-inter font-medium leading-relaxed">
              Dễ dàng khởi tạo thiệp cưới di động chỉ trong 1 click. Lựa chọn phong cách yêu thích của bạn từ bộ sưu tập cao cấp và chỉnh sửa thông tin nhanh chóng.
            </p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white border border-slate-100 p-4 rounded-2xl shadow-2xs">
          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar scroll-smooth">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[rgb(235,76,76)] text-white shadow-sm shadow-[rgb(235,76,76)]/10'
                      : 'bg-slate-50 border border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm mẫu thiệp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[rgb(235,76,76)] focus:ring-1 focus:ring-[rgb(235,76,76)]/20 transition-all"
            />
          </div>
        </div>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-[2.25rem] p-4 h-[440px] flex flex-col justify-between">
                <div className="bg-slate-100 rounded-[1.75rem] w-full h-[280px]" />
                <div className="space-y-2 mt-4 flex-1">
                  <div className="bg-slate-200 h-4 rounded w-2/3" />
                  <div className="bg-slate-200 h-3 rounded w-1/2" />
                </div>
                <div className="bg-slate-200 h-10 rounded-xl w-full mt-4" />
              </div>
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl">
            <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-[rgb(235,76,76)] mb-4">
              <Palette size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-700 font-inter mb-1">Không tìm thấy mẫu nào</h3>
            <p className="text-xs text-zinc-400 font-inter font-medium text-center max-w-xs">
              Thử tìm kiếm với từ khóa khác hoặc chuyển danh mục bộ lọc.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white border border-slate-100 rounded-[2.25rem] p-4 shadow-xs hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-[450px] group relative overflow-hidden"
              >
                {/* Simulated Smartphone Screen Wrapper */}
                <div className="bg-slate-50 rounded-[1.75rem] w-full h-[280px] overflow-hidden relative border border-slate-100/50 shadow-inner">
                  {template.thumbnailUrl ? (
                    <img
                      src={template.thumbnailUrl}
                      alt={template.name}
                      className="w-full h-full object-cover object-top group-hover:object-bottom"
                      style={{ transition: 'object-position 4s ease-in-out' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-rose-200 bg-rose-50/20">
                      <Palette size={48} strokeWidth={1.5} />
                    </div>
                  )}

                  {/* VIP Badge */}
                  {template.isPremium && (
                    <span className="absolute top-3.5 right-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-white font-black text-[9px] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1 z-20">
                      <Sparkles size={8} /> VIP
                    </span>
                  )}

                  {/* Glassmorphic Hover Action Panel */}
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex flex-col items-center justify-center gap-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <button
                      onClick={() => handleOpenPreview(template)}
                      className="px-5 py-2.5 rounded-full bg-white hover:bg-rose-50 text-slate-800 hover:text-[rgb(235,76,76)] font-bold text-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer border-none shadow-md"
                    >
                      <Eye size={14} /> Xem mẫu
                    </button>
                    <button
                      onClick={() => handleUseTemplate(template.id, template.name)}
                      className="px-5 py-2.5 rounded-full bg-[rgb(235,76,76)] hover:bg-[rgb(255,112,112)] text-white font-bold text-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer border-none shadow-md"
                    >
                      <Palette size={14} /> Thiết kế ngay
                    </button>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="mt-4 px-1 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-black text-rose-500 bg-rose-50 border border-rose-100/50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {template.category?.name || 'Mẫu thiết kế'}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 mt-2 line-clamp-1 group-hover:text-[rgb(235,76,76)] transition-colors">
                      {template.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                    <span className="text-[10px] font-bold text-slate-400">
                      Lượt dùng: <span className="text-slate-700 font-semibold">{template.useCount || 0}</span>
                    </span>
                    <button
                      onClick={() => handleUseTemplate(template.id, template.name)}
                      className="bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-[rgb(235,76,76)] px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors border border-transparent hover:border-rose-150 cursor-pointer"
                    >
                      Dùng mẫu <Palette size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardPanel>

      {/* Interactive Template Carousel Preview Drawer/Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <div className="fixed inset-0 z-150 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewTemplate(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Dialog Container */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative bg-white w-full max-w-4xl h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden z-10 border border-slate-100 flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={() => setPreviewTemplate(null)}
                className="absolute right-6 top-6 z-50 p-2.5 rounded-full bg-white/90 backdrop-blur-xs hover:bg-rose-50 text-slate-500 hover:text-[rgb(235,76,76)] shadow-sm border border-slate-150 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Left Side: Dynamic Mobile Mockup Preview Slider */}
              <div className="flex-1 bg-slate-50 flex items-center justify-center p-6 relative border-b md:border-b-0 md:border-r border-slate-100">
                
                {/* Clean Card Viewport (no mockup device frame) */}
                <div className="relative w-full max-w-[340px] h-[65vh] rounded-[2rem] overflow-hidden bg-white border border-slate-100 shadow-xl flex flex-col">
                  {/* Scrollable Viewport */}
                  <div 
                    ref={previewScrollRef}
                    className="w-full h-full overflow-y-auto overflow-x-hidden bg-white relative flex flex-col"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    <style>{`
                      .no-scrollbar-inner::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>
                    <div className="flex flex-col w-full no-scrollbar-inner">
                      {(previewTemplate.detailImages && previewTemplate.detailImages.length > 0
                        ? previewTemplate.detailImages
                        : [previewTemplate.thumbnailUrl || '']
                      ).map((imgUrl: string, idx: number) => (
                        <img
                          key={idx}
                          src={imgUrl}
                          alt={`Page ${idx + 1}`}
                          className="w-full h-auto object-contain block"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Info Panel */}
              <div className="w-full md:w-[350px] p-8 flex flex-col justify-between h-full bg-white">
                <div className="space-y-6 text-left">
                  <div>
                    <span className="bg-rose-50 text-[rgb(235,76,76)] text-[9px] font-black tracking-widest px-3 py-1 rounded-full border border-rose-100 uppercase">
                      {previewTemplate.category?.name || 'WEDDING'}
                    </span>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight leading-snug mt-3">
                      {previewTemplate.name}
                    </h3>
                  </div>

                  <div className="border-t border-dashed border-slate-100 pt-5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-amber-500" /> Đặc điểm nổi bật
                    </h4>
                    <ul className="text-xs text-slate-500 font-medium leading-relaxed space-y-2 pl-0 list-none">
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-emerald-500 stroke-[3px]" /> Tích hợp hiệu ứng chuyển cảnh mượt mà
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-emerald-500 stroke-[3px]" /> Hỗ trợ tự động cuộn trang (AutoScroll)
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={12} className="text-emerald-500 stroke-[3px]" /> Thích hợp hiển thị tối ưu trên di động
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setPreviewTemplate(null);
                      handleUseTemplate(previewTemplate.id, previewTemplate.name);
                    }}
                    className="w-full py-3.5 rounded-xl bg-[rgb(235,76,76)] hover:bg-[rgb(255,112,112)] text-white font-bold text-sm shadow-md shadow-[rgb(235,76,76)]/10 hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                  >
                    <Palette size={16} /> Sử dụng mẫu này
                  </button>
                  <button
                    onClick={() => setPreviewTemplate(null)}
                    className="w-full py-3.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 bg-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                  >
                    Hủy xem thử
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};
