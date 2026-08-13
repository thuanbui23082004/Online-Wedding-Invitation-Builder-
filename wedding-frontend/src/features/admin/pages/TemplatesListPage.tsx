import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Trash2, CheckCircle, Archive, Crown, Loader2, X, Check, ExternalLink } from 'lucide-react';
import { adminApi, type AdminTemplate } from '../api/adminApi';
import { useNavigate } from 'react-router-dom';

const STATUS_COLORS: Record<string, string> = {
  published: 'adm-badge-green',
  draft: 'adm-badge-yellow',
  archived: 'adm-badge-gray',
};

const STATUS_LABELS: Record<string, string> = {
  published: 'Đã xuất bản',
  draft: 'Bản nháp',
  archived: 'Đã lưu trữ',
};

export function TemplatesListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [premiumFilter, setPremiumFilter] = useState('all');
  const [viewMode] = useState<'grid' | 'list'>('grid');

  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplatePremium, setNewTemplatePremium] = useState(false);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const [PreviewComponent, setPreviewComponent] = useState<React.ComponentType<any> | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError('');
      const params: any = { page, limit: 12 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (premiumFilter !== 'all') params.isPremium = premiumFilter === 'premium';

      const res = await adminApi.getTemplates(params);

      // Backend returns { items, total, page, totalPages }
      const items = (res as any).items || res.data || [];
      setTemplates(items);

      setTotalPages((res as any).totalPages || res.pagination?.totalPages || 1);
      setTotal((res as any).total || res.pagination?.total || 0);
    } catch (err: any) {
      console.error('Error fetching templates:', err);
      setError('Lỗi khi tải danh sách template');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [debouncedSearch, statusFilter, premiumFilter, page]);

  // dynamic import preview modal when requested (avoids `require` in browser TS)
  useEffect(() => {
    let mounted = true;
    if (!previewTemplateId) {
      setPreviewComponent(null);
      setPreviewLoading(false);
      return;
    }
    setPreviewLoading(true);
    void import('../components/TemplatePreviewModal')
      .then((mod) => {
        if (!mounted) return;
        setPreviewComponent(() => mod.default ?? mod.TemplatePreviewModal ?? null);
      })
      .catch((err) => {
        console.error('Failed to load TemplatePreviewModal', err);
        setPreviewComponent(null);
      })
      .finally(() => {
        if (mounted) setPreviewLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [previewTemplateId]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!window.confirm(`Bạn có chắc muốn đổi trạng thái thành ${STATUS_LABELS[newStatus]}?`)) return;
    try {
      await adminApi.updateTemplateStatus(id, newStatus);
      fetchTemplates();
    } catch (err) {
      alert('Lỗi cập nhật trạng thái');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xoá template này? Hành động này không thể hoàn tác.')) return;
    try {
      await adminApi.deleteTemplate(id);
      fetchTemplates();
    } catch (err) {
      alert('Lỗi khi xoá template');
    }
  };

  const handleCreateTemplate = async () => {
    if (!newTemplateName.trim()) {
      alert('Vui lòng nhập tên template');
      return;
    }

    // Generate simple slug
    const slug = newTemplateName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now();

    try {
      const res = await adminApi.createTemplate({
        name: newTemplateName,
        slug,
        isPremium: newTemplatePremium
      });

      setShowCreateModal(false);
      setNewTemplateName('');
      setNewTemplatePremium(false);

      // Navigate to the editor for the new template
      navigate(`/design/template?templateId=${res.id}`);
    } catch (err) {
      console.error('Create error:', err);
      alert('Lỗi khi tạo template mới');
    }
  };

  // Thumbnail placeholder colors
  const thumbColors = ['#fce7f3', '#fef3c7', '#d1fae5', '#ede9fe', '#fce7f3', '#dbeafe', '#fef9c3', '#f3e8ff'];

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        {/* Row 1: Search + Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="adm-search" style={{ flex: 1, margin: 0 }}>
            <Search className="adm-search-icon" />
            <input placeholder="Tìm theo tên template..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="adm-btn adm-btn-primary" onClick={() => setShowCreateModal(true)} style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
            <Plus size={15} /> 
            <span className="adm-desktop-only">Tạo template mới</span>
            <span className="adm-mobile-only">Tạo mới</span>
          </button>
        </div>

        {/* Row 2: Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <select className="adm-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã xuất bản</option>
            <option value="draft">Bản nháp</option>
            <option value="archived">Đã lưu trữ</option>
          </select>
          <select className="adm-select" value={premiumFilter} onChange={e => { setPremiumFilter(e.target.value); setPage(1); }}>
            <option value="all">Tất cả gói</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', animation: 'adm-fade-in 0.2s ease-out' }}>
          <div style={{ background: '#ffffff', borderRadius: 24, width: 460, maxWidth: '95vw', maxHeight: '90vh', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

            {/* Header */}
            <div className="adm-gradient-header" style={{
              padding: '24px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ background: 'rgba(255,255,255,0.25)', padding: 10, borderRadius: 14, display: 'flex' }}>
                  <Plus size={24} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>Tạo Template Mới</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 4 }}>
                    Bắt đầu một mẫu thiết kế mới.
                  </div>
                </div>
              </div>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'rgba(0,0,0,0.1)', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 12, color: '#ffffff', transition: 'all 0.2s', display: 'flex' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.1)'; }}
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 32, overflowY: 'auto', flex: 1 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 8 }}>Tên template <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: '#f8fafc', color: '#0f172a', transition: 'all 0.2s', border: '1px solid #e2e8f0', outline: 'none', boxSizing: 'border-box' }}
                  placeholder="VD: Thiệp cưới hiện đại..."
                  value={newTemplateName}
                  onChange={e => setNewTemplateName(e.target.value)}
                  autoFocus
                  onFocus={e => { e.target.style.borderColor = 'var(--adm-pink)'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 4px rgba(244, 63, 94, 0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: 16, border: '1px solid #f1f5f9' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#334155' }}>
                  <input
                    type="checkbox"
                    checked={newTemplatePremium}
                    onChange={e => setNewTemplatePremium(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: '#f59e0b', cursor: 'pointer' }}
                  />
                  <Crown size={16} color="#f59e0b" /> Đây là template Premium (Yêu cầu nâng cấp)
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', padding: '20px 32px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', flexShrink: 0 }}>
              <button className="adm-btn adm-btn-outline" style={{ padding: '12px 24px', fontSize: 14, borderRadius: 12, fontWeight: 600, color: '#475569', borderColor: '#cbd5e1' }} onClick={() => setShowCreateModal(false)}>
                Hủy
              </button>
              <button
                className="adm-btn adm-btn-primary"
                style={{ padding: '12px 32px', fontSize: 14, borderRadius: 12, fontWeight: 600, display: 'flex', gap: 8, boxShadow: '0 4px 12px rgba(244, 63, 94, 0.25)' }}
                onClick={handleCreateTemplate}
                disabled={!newTemplateName.trim()}
              >
                <Check size={16} strokeWidth={2.5} /> Tạo và chuyển đến Editor
              </button>
            </div>
          </div>
        </div>
      )}

        {previewTemplateId && (
          previewLoading ? (
            <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
              <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
                <Loader2 className="animate-spin" /> Đang tải xem trước...
              </div>
            </div>
          ) : PreviewComponent ? (
            <PreviewComponent templateId={previewTemplateId} onClose={() => { setPreviewTemplateId(null); setPreviewComponent(null); }} />
          ) : null
        )}

      {error && <div style={{ padding: 12, backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: 6, marginBottom: 16 }}>{error}</div>}

      {/* Grid */}
      {loading && templates.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
          <Loader2 className="animate-spin" size={32} color="var(--adm-primary)" />
        </div>
      ) : (
        <div className="adm-template-grid">
          {templates.map((t, i) => (
            <div key={t.id} className="adm-template-card">
              {/* Thumbnail */}
              <div className="adm-template-thumb" style={{ background: t.thumbnailUrl ? '#f3f4f6' : thumbColors[i % thumbColors.length], backgroundImage: t.thumbnailUrl ? `url(${t.thumbnailUrl})` : 'none', backgroundSize: 'cover', backgroundPosition: 'top' }}>
                {!t.thumbnailUrl && <div style={{ fontSize: 40 }}>💌</div>}
                {/* Overlay actions */}
                <div className="adm-template-thumb-overlay">
                  <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={() => navigate(`/design/template?templateId=${t.id}`)}>
                    <Edit3 size={13} /> Sửa
                  </button>
                 
                  <button className="adm-btn adm-btn-outline adm-btn-sm" style={{ background: 'rgba(255,255,255,0.9)' }} onClick={() => window.open(`/view-template/${t.id}`, '_blank')}>
                    <ExternalLink size={13} /> Xem
                  </button>

                  <button className="adm-btn adm-btn-danger-ghost adm-btn-sm" style={{ background: 'rgba(255,255,255,0.9)', color: '#ef4444' }} onClick={() => handleDelete(t.id)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="adm-template-info">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6, marginBottom: 8 }}>
                  <div className="adm-template-name">{t.name}</div>
                  {t.isPremium && (
                    <span className="adm-badge adm-badge-yellow" style={{ flexShrink: 0, fontSize: 10 }}>
                      <Crown size={9} /> Pro
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className={`adm-badge ${STATUS_COLORS[t.status]}`} style={{ fontSize: 11 }}>
                    {STATUS_LABELS[t.status]}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--adm-text-muted)' }}>{t.useCount ?? t.usageCount ?? 0} lần dùng</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--adm-text-muted)', marginTop: 4 }}>
                  {t.category?.name || 'Không có danh mục'}
                </div>
                {/* Quick status actions */}
                <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
                  {t.status !== 'published' && (
                    <button className="adm-btn adm-btn-outline adm-btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: 11 }} onClick={() => handleUpdateStatus(t.id, 'published')}>
                      <CheckCircle size={12} /> Publish
                    </button>
                  )}
                  {t.status === 'published' && (
                    <button className="adm-btn adm-btn-outline adm-btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: 11 }} onClick={() => handleUpdateStatus(t.id, 'archived')}>
                      <Archive size={12} /> Archive
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && templates.length === 0 && !error && (
        <div className="adm-empty">
          <div style={{ fontSize: 48 }}>🎨</div>
          <p style={{ fontWeight: 600 }}>Không tìm thấy template</p>
          <p style={{ fontSize: 13 }}>Thử thay đổi bộ lọc hoặc tạo template mới</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          <button className="adm-btn adm-btn-outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Trước</button>
          <span style={{ display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: 500 }}>
            Trang {page} / {totalPages}
          </span>
          <button className="adm-btn adm-btn-outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Sau</button>
        </div>
      )}
    </div>
  );
}
