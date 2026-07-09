import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Globe,
  Lock,
  Eye,
  Image as ImageIcon,
  Copy,
  Check,
  ExternalLink,
  Edit2,
  Trash2,
  BarChart2
} from 'lucide-react';

export interface CardItem {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string | null;
  isPublished: boolean;
  viewCount: number;
  updatedAt: string;
}

export interface CardItemProps {
  card: CardItem;
  onDelete: (id: string) => void;
}

export function CardItem({ card, onDelete }: CardItemProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const fullLink = `${window.location.origin}/view/${card.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleView = () => {
    if (card.isPublished) {
      window.open(`/view/${card.slug}`, '_blank');
    } else {
      window.open(`/view/${card.slug}?preview=true`, '_blank');
    }
  };

  const handleDeleteClick = () => {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
    } else {
      setIsDeleting(true);
      onDelete(card.id);
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full transition-all hover:shadow-md">
      {/* Preview Thumbnail with Absolute Header */}
      <div
        className="relative w-full aspect-[4/3] bg-slate-50 overflow-hidden group cursor-pointer border-b border-slate-100"
        onClick={handleView}
      >
        {/* Header Overlay */}
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-3 pointer-events-none">
          {card.isPublished ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50/95 backdrop-blur-sm shadow-sm border border-emerald-100/50 text-emerald-600 rounded-full text-xs font-semibold">
              <Globe size={14} /> Công khai
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/95 backdrop-blur-sm shadow-sm border border-slate-200/50 text-slate-600 rounded-full text-xs font-semibold">
              <Lock size={14} /> Bản nháp
            </span>
          )}
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm shadow-sm border border-slate-100 px-2.5 py-1 rounded-full text-slate-600 text-xs font-bold pointer-events-auto">
            <Eye size={14} />
            <span>{card.viewCount.toLocaleString('vi-VN')}</span>
          </div>
        </div>

        {card.thumbnailUrl ? (
          <img
            src={card.thumbnailUrl}
            alt={card.title}
            className="w-full h-full object-cover object-top transition-all ease-linear group-hover:object-bottom"
            style={{ transitionDuration: '8s' }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-gradient-to-b from-slate-50 to-slate-100">
            <ImageIcon size={48} className="opacity-20 mb-3" />
            <span className="text-sm font-medium">Chưa có ảnh preview</span>
          </div>
        )}

        {/* Overlay mờ nhẹ báo hiệu click */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
      </div>

      {/* Info */}
      <div className="p-4 pb-2.5 flex flex-col gap-1">
        <h3 className="font-bold text-slate-800 text-base truncate leading-tight" title={card.title}>
          {card.title}
        </h3>
        <div className="text-[11.5px] font-medium text-slate-500">
          Cập nhật: {formatDistanceToNow(new Date(card.updatedAt), { addSuffix: true, locale: vi })}
        </div>
      </div>

      {/* Link */}
      <div className="px-4 pb-3.5">
        <div className="flex items-center justify-between bg-slate-50 rounded-lg p-1.5 border border-slate-200 transition-colors hover:border-slate-300">
          <span className="flex-1 text-[12px] text-slate-500 truncate px-2 font-medium select-all" title={fullLink}>
            {fullLink.replace(/^https?:\/\//, '')}
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-white rounded-md transition-all"
            title="Copy link"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-3.5 flex gap-2">
        <button
          onClick={handleView}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-[13px] font-semibold transition-colors"
        >
          <ExternalLink size={14} />
          {card.isPublished ? 'Xem thực tế' : 'Xem demo'}
        </button>
        <button
          onClick={() => navigate(`/loading?next=${encodeURIComponent(`/design?id=${card.id}`)}&message=${encodeURIComponent('Đang mở trình thiết kế...')}`)}
          className="px-3.5 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors flex items-center justify-center"
          title="Chỉnh sửa"
        >
          <Edit2 size={15} />
        </button>

        {/* Delete Inline Confirm */}
        {isConfirmingDelete ? (
          <div className="flex gap-1">
            <button
              onClick={() => setIsConfirmingDelete(false)}
              className="px-3 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-[12px] font-semibold transition-colors"
            >
              Huỷ
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="px-3 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-[12px] font-semibold transition-colors flex items-center justify-center"
            >
              Xóa?
            </button>
          </div>
        ) : (
          <button
            onClick={handleDeleteClick}
            className="px-3.5 py-2 border border-red-100 text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors flex items-center justify-center"
            title="Xóa thiệp"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* Footer / Detail Stats */}
      <div className="px-4 pb-4 mt-auto">
        <button
          onClick={() => navigate(`/dashboard/cards/${card.id}`)}
          className="w-full flex items-center justify-center gap-1.5 py-2 bg-[rgb(235,76,76)] hover:bg-rose-700 text-white rounded-lg text-[13px] font-bold transition-all shadow-sm shadow-rose-500/20 active:scale-[0.98]"
        >
          <BarChart2 size={14} />
          Xem chi tiết
        </button>
      </div>
    </div>
  );
}

export function CardItemSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm w-full animate-pulse">
      {/* Thumbnail with Absolute Header */}
      <div className="relative w-full aspect-[4/3] bg-slate-100">
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-3">
          <div className="w-24 h-6 bg-slate-200/80 rounded-full" />
          <div className="w-12 h-6 bg-slate-200/80 rounded-full" />
        </div>
      </div>
      <div className="p-4 pb-2.5 flex flex-col gap-1">
        <div className="w-3/4 h-5 bg-slate-100 rounded-md" />
        <div className="w-1/2 h-3 bg-slate-100 rounded-md" />
      </div>
      <div className="px-4 pb-3.5">
        <div className="w-full h-9 bg-slate-50 rounded-lg border border-slate-100" />
      </div>
      <div className="px-4 pb-3.5 flex gap-2">
        <div className="flex-1 h-9 bg-slate-100 rounded-lg" />
        <div className="w-10 h-9 bg-slate-100 rounded-lg" />
        <div className="w-10 h-9 bg-slate-100 rounded-lg" />
      </div>
      <div className="px-4 pb-4 mt-auto">
        <div className="w-full h-9 bg-slate-50 rounded-lg" />
      </div>
    </div>
  );
}
