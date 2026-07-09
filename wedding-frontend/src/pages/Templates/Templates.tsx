import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import { templatesData, type TemplateItem } from '../../data/templates';
import TemplateModal from '../../components/TemplateModal';
import { Heart, Palette, Eye } from 'lucide-react';
import { Button } from '../../components/button';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingBackgroundHearts from '../../components/FloatingBackgroundHearts';
import { Header } from '../../components/Header';
import { templatesApi } from '../../api/templatesApi';
import { cardsApi } from '../../api/cardsApi';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';

export const Templates: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [dbTemplates, setDbTemplates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTemplates = async () => {
        setIsLoading(true);
        try {
            const res = await templatesApi.getTemplates();
            const items = Array.isArray(res) ? res : (res?.items || []);
            setDbTemplates(items);
        } catch (err) {
            console.error('Error fetching templates:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const categories = [
        { key: 'ALL', name: 'Tất cả' },
        { key: 'WEDDING', name: 'Thiệp cưới' },
        { key: 'GRADUATION', name: 'Thiệp tốt nghiệp' },
        { key: 'EVENT', name: 'Sự kiện' },
        { key: 'REUNION', name: 'Kỷ niệm' },
        { key: 'WISH', name: 'Lời chúc' },
        { key: 'BIRTHDAY', name: 'Thiệp sinh nhật' },
        { key: 'YEAR_END', name: 'Thiệp Tất Niên' },
        { key: 'OTHER', name: 'Khác' }
    ] as const;

    const toggleFavorite = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
        );
    };

    const handleOpenModal = (item: any) => {
        const formattedItem: TemplateItem = {
            id: typeof item.id === 'string' ? parseInt(item.id.replace(/\D/g, '')) || 99 : item.id,
            title: item.name || item.title,
            code: item.slug || item.code || 'DL-2026',
            tag: item.category?.name || item.tag || 'WEDDING',
            price: item.isPremium ? 'VIP' : 'Miễn phí',
            mainImage: item.thumbnailUrl || item.mainImage,
            detailImages: item.detailImages || [item.thumbnailUrl || item.mainImage],
            description: item.description || `Mẫu thiết kế thiệp cưới tuyệt đẹp phong cách hiện đại từ DearLove.`
        };
        setSelectedTemplate(formattedItem);
        setIsModalOpen(true);
    };

    const handleUseTemplate = async (templateId: string, templateName: string) => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để bắt đầu tự tạo thiệp cưới!');
            navigate('/login');
            return;
        }
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
            console.error('Error creating card:', err);
            toast.error(err.response?.data?.message || 'Không thể tạo thiệp mời từ mẫu này.');
        }
    };

    const templatesToRender = dbTemplates.length > 0 ? dbTemplates : templatesData;

    const filteredTemplates = templatesToRender.filter(template => {
        if (selectedCategory === 'ALL') return true;
        const tag = (template.tag || template.category?.slug || '').toUpperCase();
        return tag.includes(selectedCategory) || selectedCategory.includes(tag);
    });

    return (
        <div className="min-h-screen bg-white flex flex-col font-poppins select-none relative overflow-hidden">
            <FloatingBackgroundHearts />
            <Header />

            {/* Main Content Area */}
            <motion.main
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex-1 max-w-[90rem] mx-auto w-full px-4 md:px-8 pt-32 pb-24 space-y-10 relative z-10"
            >

                {/* Header & Typography Section */}
                <div className="text-center space-y-4">
                    <div className="flex justify-center items-center gap-1.5 text-sm text-zinc-400 font-medium font-poppins">
                        <span>Trang chủ</span>
                        <span className="text-zinc-300 font-normal">&gt;</span>
                        <span className="text-zinc-800 font-semibold">Mẫu thiệp</span>
                    </div>

                    <div className="flex justify-center pt-2">
                        <svg width="48" height="8" viewBox="0 0 48 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 4.5C6.33333 1.83333 10.6667 7.16667 16 4.5C21.3333 1.83333 25.6667 7.16667 31 4.5C36.3333 1.83333 40.6667 7.16667 46 4.5" stroke="rgb(255,166,166)" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                    </div>
 
                    {/* Page Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight leading-tight pt-1">
                        Mẫu thiệp <span className="text-[rgb(235,76,76)] font-handwritten text-[2.75rem] md:text-[3.75rem] font-normal pl-1 inline-block -rotate-1">online đẹp</span>
                    </h1>
 
                    <div className="relative inline-block max-w-2xl mx-auto px-4">
                        <p className="text-zinc-500 font-poppins font-medium text-sm md:text-base leading-relaxed">
                            Khám phá bộ sưu tập mẫu thiệp điện tử đa dạng: cưới, sinh nhật, sự kiện, kỷ niệm từ <span className="font-semibold text-[rgb(235,76,76)]">DearLove</span>
                        </p>
                        <span className="absolute -right-2 -bottom-2 text-amber-400 animate-pulse hidden md:inline-block">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z" />
                            </svg>
                        </span>
                    </div>
                </div>
 
                <div className="flex justify-center border-b border-zinc-100 pb-6">
                    <div className="flex gap-3 overflow-x-auto pb-2 px-4 max-w-full no-scrollbar scroll-smooth">
                        {categories.map((cat) => {
                            const isSelected = selectedCategory === cat.key;
                            return (
                                <button
                                    key={cat.key}
                                    onClick={() => setSelectedCategory(cat.key)}
                                    className={`px-5 py-2 rounded-full text-sm font-semibold tracking-tight transition-all duration-300 border whitespace-nowrap cursor-pointer ${isSelected
                                        ? 'border-[rgb(255,166,166)] text-[rgb(235,76,76)] bg-[rgb(255,237,199)]/40 shadow-xs'
                                        : 'border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 bg-white shadow-xs'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
 
                <div className="relative">
                    <AnimatePresence mode="wait">
                        {filteredTemplates.length > 0 ? (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 15 }}
                                transition={{ duration: 0.4 }}
                                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
                            >
                                {filteredTemplates.map((item) => {
                                    const idNum = typeof item.id === 'string' ? parseInt(item.id.replace(/\D/g, '')) || 99 : item.id;
                                    const isFav = favorites.includes(idNum);
                                    
                                    const imageSrc = item.thumbnailUrl || item.mainImage;
                                    const titleText = item.name || item.title;
                                    const categoryTag = item.category?.name || item.tag || 'WEDDING';
                                    const codeText = item.slug || item.code || 'DL-2026';
                                    const priceText = item.isPremium ? 'VIP' : 'Miễn phí';

                                    return (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-white rounded-[2rem] overflow-hidden border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.015)] hover:shadow-[0_15px_35px_rgba(235,76,76,0.06)] hover:-translate-y-1 transition-all duration-500 group cursor-pointer flex flex-col"
                                            onClick={() => handleOpenModal(item)}
                                        >
                                            <div className="relative aspect-[3/4.2] overflow-hidden bg-zinc-50">
                                                {imageSrc ? (
                                                    <img
                                                        src={imageSrc}
                                                        alt={titleText}
                                                        className="w-full h-full object-cover object-top group-hover:object-bottom"
                                                        style={{ transition: 'object-position 4s ease-in-out' }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-rose-200 bg-rose-50/20">
                                                        <Palette size={48} strokeWidth={1.5} />
                                                    </div>
                                                )}
 
                                                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-[9px] font-black tracking-widest text-zinc-800 px-3 py-1 rounded-full border border-zinc-100 shadow-xs uppercase font-poppins">
                                                    {categoryTag}
                                                </span>
 
                                                <button
                                                    onClick={(e) => toggleFavorite(idNum, e)}
                                                    className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-xs transition-all duration-300 border shadow-xs ${isFav
                                                        ? 'bg-[rgb(255,237,199)] border-[rgb(255,166,166)]/45 text-[rgb(235,76,76)] hover:bg-[rgb(255,166,166)]/30'
                                                        : 'bg-white/90 border-zinc-100 text-zinc-400 hover:text-[rgb(235,76,76)] hover:bg-white'
                                                        }`}
                                                >
                                                    <Heart size={14} fill={isFav ? "currentColor" : "none"} />
                                                </button>
 
                                                <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                                                    <div className="space-y-2.5 w-full text-center">
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleOpenModal(item);
                                                            }}
                                                            className="w-full rounded-full bg-white hover:bg-[rgb(255,237,199)] text-[rgb(235,76,76)] font-bold text-xs py-2.5 shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95 duration-200"
                                                        >
                                                            <Eye size={14} /> Xem chi tiết
                                                        </Button>
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleUseTemplate(item.id, titleText);
                                                            }}
                                                            className="w-full rounded-full bg-[rgb(235,76,76)] hover:bg-[rgb(255,112,112)] text-white font-bold text-xs py-2.5 shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95 duration-200"
                                                        >
                                                            <Palette size={14} /> Sử dụng mẫu này
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
 
                                            <div className="p-4 space-y-1 text-left">
                                                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-poppins">
                                                    <span>Mã: {codeText}</span>
                                                    <span className="text-[rgb(235,76,76)] bg-[rgb(255,237,199)] px-2 py-0.5 rounded-md lowercase">{priceText}</span>
                                                </div>
                                                <h3 className="font-bold text-zinc-800 text-sm tracking-tight leading-snug truncate group-hover:text-[rgb(235,76,76)] transition-colors duration-300">
                                                    {titleText}
                                                </h3>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-20 text-center space-y-4"
                            >
                                <div className="text-zinc-300 text-5xl">🔍</div>
                                <h3 className="font-bold text-zinc-700 text-lg">Không tìm thấy mẫu thiệp nào</h3>
                                <p className="text-sm text-zinc-400 font-medium max-w-sm mx-auto">
                                    Thử chọn danh mục khác xem sao nhé!
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.main>

            <TemplateModal
                template={selectedTemplate}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <Footer />
        </div>
    );
};

export default Templates;