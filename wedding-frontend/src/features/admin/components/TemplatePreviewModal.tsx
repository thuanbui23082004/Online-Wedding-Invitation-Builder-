import React, { useEffect, useRef, useState } from 'react';
import { templatesEditorApi } from '../../../api/templatesEditorApi';
import { X } from 'lucide-react';

interface TemplatePreviewModalProps {
  templateId: string | null;
  onClose: () => void;
}

export function TemplatePreviewModal({ templateId, onClose }: TemplatePreviewModalProps) {
  const [template, setTemplate] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!templateId) return;
    setLoading(true);
    templatesEditorApi.getTemplateCanvas(templateId)
      .then(t => setTemplate(t))
      .catch(err => console.error('Failed to load template canvas for preview', err))
      .finally(() => setLoading(false));
  }, [templateId]);

  // ensure viewport is scrolled to top when template loads
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = 0;
    scrollRef.current.scrollLeft = 0;
  }, [template]);

  if (!templateId) return null;

  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 920, maxHeight: '90vh', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div className="adm-modal-title">Xem trước Thiệp</div>
          <button className="adm-btn adm-btn-ghost adm-btn-icon" onClick={onClose} aria-label="Đóng"><X size={18} /></button>
        </div>

        {loading && <div style={{ padding: 20 }}>Đang tải...</div>}

        {!loading && template && (
          <div ref={scrollRef} style={{ overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: 12 }}>
            <div style={{ position: 'relative', width: template.canvasWidth || 500, height: template.canvasHeight || 700, background: '#fff', overflow: 'hidden', borderRadius: 12, border: '1px solid var(--adm-border)' }}>
              {/* background */}
              {template.background && template.background.type === 'solid' && (
                <div style={{ position: 'absolute', inset: 0, background: template.background.color }} />
              )}
              {template.background && template.background.type === 'gradient' && (
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(${template.background.gradientAngle ?? 0}deg, ${template.background.gradientFrom}, ${template.background.gradientTo})` }} />
              )}
              {template.background && template.background.type === 'image' && (
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${template.background.imageSrc || template.background.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'top', opacity: template.background.imageOpacity ?? 1 }} />
              )}

              {/* blocks */}
              {Array.isArray(template.blocks) && template.blocks.sort((a: any, b: any) => (a.zIndex || 0) - (b.zIndex || 0)).map((b: any) => {
                const style: React.CSSProperties = {
                  position: 'absolute',
                  left: b.posX ?? 0,
                  top: b.posY ?? 0,
                  width: b.width ?? 100,
                  height: b.height ?? 100,
                  transform: b.rotation ? `rotate(${b.rotation}deg)` : undefined,
                  overflow: 'hidden',
                  pointerEvents: 'none'
                };

                if (b.blockType === 'image' || b.blockType === 'gallery') {
                  const src = b.content?.src || b.content?.url || b.content?.imageSrc || b.content?.imageUrl || b.content?.thumbnailUrl;
                  return (
                    <img key={b.id} src={src} style={{ ...style, objectFit: 'cover' }} alt="preview" />
                  );
                }

                if (b.blockType === 'text') {
                  const txt = typeof b.content === 'string' ? b.content : b.content?.content || b.content?.text || '';
                  const fontFamily = b.content?.fontFamily || 'Inter, system-ui, sans-serif';
                  const fontSize = b.content?.fontSize || Math.min(24, (b.height ?? 100) * 0.2);
                  const color = b.content?.color || '#111827';
                  return (
                    <div key={b.id} style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily, fontSize, color, textAlign: 'center', padding: 6 }}>
                      <div style={{ width: '100%', whiteSpace: 'pre-wrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{txt}</div>
                    </div>
                  );
                }

                return <div key={b.id} style={{ ...style, border: '1px dashed rgba(0,0,0,0.05)' }} />;
              })}
            </div>
          </div>
        )}

        {!loading && !template && (
          <div style={{ padding: 12 }}>Không có dữ liệu hiển thị</div>
        )}
      </div>
    </div>
  );
}

export default TemplatePreviewModal;
