
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { LoadingState } from '../../components/LoadingState';
import { cardsApi } from '../../services/api';
import type { WeddingCard } from '../../services/api';
import { useToast, useConfirm } from '../../components/ToastProvider';
import { Edit3, Layout, X, Sparkles, LayoutTemplate, Eye, Copy, Trash2, ExternalLink } from 'lucide-react';

export const MyCards = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<WeddingCard[]>([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await cardsApi.list();
      setCards(data);
    } catch {
      toast.error('Không tải được danh sách thiệp');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, []);

  const handleDelete = async (card: WeddingCard) => {
    const ok = await confirm({
      title: `Xóa thiệp "${card.title}"?`,
      description: 'Toàn bộ dữ liệu, lời chúc và RSVP liên quan đến thiệp này sẽ bị xóa vĩnh viễn.',
      confirmText: 'Xóa thiệp',
      danger: true,
    });
    if (!ok) return;
    await cardsApi.remove(card.id);
    setCards((prev) => prev.filter((c) => c.id !== card.id));
    toast.success('Đã xóa thiệp');
  };

  const handleCopyLink = async (card: WeddingCard) => {
    if (!card.slug) {
      toast.warning('Thiệp này chưa được xuất bản, hãy xuất bản trước khi chia sẻ');
      return;
    }
    const url = `${window.location.origin}/thiep/${card.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Đã sao chép link thiệp');
    } catch {
      toast.error('Không thể sao chép, vui lòng thử lại');
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[80vh] p-8 relative">
        <div className="flex justify-between items-center mb-8">
          <div><h1 className="text-2xl font-bold text-gray-900">Thiệp của tôi</h1><p className="text-sm text-gray-500">Quản lý và theo dõi hiệu quả thiệp của bạn</p></div>
          <button onClick={() => setIsModalOpen(true)} className="bg-rose-500 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-rose-600"><Edit3 size={18}/> Tạo thiệp mới</button>
        </div>

        {loading ? (
          <LoadingState label="Đang tải thiệp của bạn..." />
        ) : cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-t border-gray-100">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-300 mb-4"><Layout size={32} /></div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Chưa có thiệp nào</h3>
            <p className="text-sm text-gray-500 mb-6 text-center">Tạo thiệp đầu tiên của bạn và chia sẻ khoảnh khắc đáng nhớ</p>
            <button onClick={() => setIsModalOpen(true)} className="bg-rose-500 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-rose-600"><Edit3 size={18}/> Tạo thiệp mới</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 border-t border-gray-100 pt-8">
            {cards.map((card) => (
              <div key={card.id} className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-32 bg-gradient-to-br from-rose-100 to-pink-50 flex items-center justify-center relative">
                  <span className="font-serif text-lg font-bold text-rose-400">{card.bride} & {card.groom}</span>
                  <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${card.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {card.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-900 text-sm truncate">{card.title}</h4>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Eye size={12} /> {card.views} lượt xem</p>
                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={() => navigate(`/editor?cardId=${card.id}`)} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                      <Edit3 size={13} /> Sửa
                    </button>
                    {card.slug && (
                      <a href={`/thiep/${card.slug}`} target="_blank" rel="noreferrer" className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50" title="Xem thiệp">
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <button onClick={() => handleCopyLink(card)} className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50" title="Sao chép link">
                      <Copy size={14} />
                    </button>
                    <button onClick={() => handleDelete(card)} className="flex items-center justify-center w-9 h-9 rounded-lg border border-red-100 text-red-400 hover:bg-red-50" title="Xóa thiệp">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-rose-500 p-6 text-white relative">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-white/80 hover:text-white"><X size={20}/></button>
                <h2 className="text-xl font-bold flex items-center gap-2"><Edit3 size={20}/> Tạo thiết kế mới</h2>
                <p className="text-rose-100 text-sm mt-1">Chọn cách bạn muốn bắt đầu</p>
              </div>
              <div className="p-6 space-y-4">
                <Link to="/editor" className="w-full flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-rose-200 hover:bg-rose-50 transition-all text-left">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-500 flex items-center justify-center shrink-0"><Edit3 size={20}/></div>
                  <div><h4 className="font-bold text-gray-900 text-sm">Thiết kế trống</h4><p className="text-xs text-gray-500 mt-1">Tự do sáng tạo trên canvas trắng</p></div>
                </Link>
                <Link to="/dashboard/templates" className="w-full flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all text-left">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-500 flex items-center justify-center shrink-0"><LayoutTemplate size={20}/></div>
                  <div><h4 className="font-bold text-gray-900 text-sm">Mẫu có sẵn</h4><p className="text-xs text-gray-500 mt-1">Khám phá bộ sưu tập mẫu chuyên nghiệp</p></div>
                </Link>
                <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100 text-xs text-orange-700">
                  <span className="font-bold flex items-center gap-1 mb-1"><Sparkles size={16}/> Cần hỗ trợ thiết kế VIP?</span>Liên hệ ngay đội ngũ Zenlove qua Zalo để có thiệp độc quyền.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};