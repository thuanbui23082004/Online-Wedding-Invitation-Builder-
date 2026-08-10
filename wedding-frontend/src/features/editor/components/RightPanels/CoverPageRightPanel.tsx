import { useRef, useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { Section, Slider, ColorField, FontField } from './RightPanelShared';
import { Palette, Type, MousePointerClick, Star, Image as ImageIcon, Upload } from 'lucide-react';
import '../../styles/RightPanel.css';
import { LibraryPickerModal } from '../Widgets/LibraryPickerModal';

export function CoverPageRightPanel() {
  const { coverPageProps, updateCoverPageProps } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);

  const handleCustomPatternChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        updateCoverPageProps({ patternCustomImage: ev.target.result as string });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>


      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* 👫 Văn bản */}
        <Section title="Văn bản" icon={<Type size={16} />} defaultOpen={true}>
          <div className="rp-field">
            <span className="rp-label">Tên chú rể</span>
            <input
              type="text"
              className="rp-input"
              value={coverPageProps.groomName}
              onChange={(e) => updateCoverPageProps({ groomName: e.target.value })}
            />
          </div>
          <div className="rp-field">
            <span className="rp-label">Tên cô dâu</span>
            <input
              type="text"
              className="rp-input"
              value={coverPageProps.brideName}
              onChange={(e) => updateCoverPageProps({ brideName: e.target.value })}
            />
          </div>
          <FontField
            fontFamily={coverPageProps.nameFontFamily}
            onChange={(font) => updateCoverPageProps({ nameFontFamily: font })}
          />
          <Slider
            label="Cỡ chữ (Tên)"
            value={coverPageProps.nameFontSize}
            min={12} max={100} step={1}
            onChange={(val) => updateCoverPageProps({ nameFontSize: val })}
            onCommit={() => { }}
          />

          <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px solid var(--ed-border)' }} />

          <div className="rp-field">
            <span className="rp-label">Ngày cưới</span>
            <input
              type="text"
              className="rp-input"
              value={coverPageProps.date}
              onChange={(e) => updateCoverPageProps({ date: e.target.value })}
            />
          </div>
          <FontField
            fontFamily={coverPageProps.dateFontFamily}
            onChange={(font) => updateCoverPageProps({ dateFontFamily: font })}
          />
          <Slider
            label="Cỡ chữ (Ngày)"
            value={coverPageProps.dateFontSize}
            min={10} max={60} step={1}
            onChange={(val) => updateCoverPageProps({ dateFontSize: val })}
            onCommit={() => { }}
          />
        </Section>

        {/* 🎨 Màu nền */}
        <Section title="Màu sắc" icon={<Palette size={16} />} defaultOpen={false}>
          <ColorField
            label="Nền card"
            color={coverPageProps.bgColor}
            onChange={(c) => updateCoverPageProps({ bgColor: c })}
          />
          <ColorField
            label="Nền ngoài"
            color={coverPageProps.outerBgColor}
            onChange={(c) => updateCoverPageProps({ outerBgColor: c })}
          />
          <ColorField
            label="Màu chữ (Tên)"
            color={coverPageProps.nameColor}
            onChange={(c) => updateCoverPageProps({ nameColor: c })}
          />
          <ColorField
            label="Màu chữ (Ngày)"
            color={coverPageProps.dateColor}
            onChange={(c) => updateCoverPageProps({ dateColor: c })}
          />
        </Section>

        {/* 🔘 Nút bấm */}
        <Section title="Nút bấm" icon={<MousePointerClick size={16} />} defaultOpen={false}>
          <div className="rp-field">
            <span className="rp-label">Nhãn nút</span>
            <input
              type="text"
              className="rp-input"
              value={coverPageProps.buttonLabel}
              onChange={(e) => updateCoverPageProps({ buttonLabel: e.target.value })}
            />
          </div>
          <ColorField
            label="Màu nền"
            color={coverPageProps.buttonBgColor}
            onChange={(c) => updateCoverPageProps({ buttonBgColor: c })}
          />
          <ColorField
            label="Màu chữ"
            color={coverPageProps.buttonTextColor}
            onChange={(c) => updateCoverPageProps({ buttonTextColor: c })}
          />
          <Slider
            label="Bo góc"
            value={coverPageProps.buttonBorderRadius}
            min={0} max={100} step={1}
            onChange={(val) => updateCoverPageProps({ buttonBorderRadius: val })}
            onCommit={() => { }}
          />
        </Section>

        {/* 🐉 Họa tiết Rồng / Khác */}
        <Section title="Họa tiết" icon={<ImageIcon size={16} />} defaultOpen={false}>
          <label className="rp-field" style={{ cursor: 'pointer' }}>
            <span className="rp-label" style={{ margin: 0 }}>Hiển thị họa tiết</span>
            <input
              type="checkbox"
              checked={coverPageProps.showPattern}
              onChange={(e) => updateCoverPageProps({ showPattern: e.target.checked })}
            />
          </label>

          {coverPageProps.showPattern && (
            <>
              <div className="rp-field">
                <span className="rp-label">Kiểu</span>
                <select
                  className="rp-select"
                  value={coverPageProps.patternStyle}
                  onChange={(e) => updateCoverPageProps({ patternStyle: e.target.value as any })}
                >
                  <option value="red">Rồng đỏ truyền thống</option>
                  <option value="gold">Rồng vàng</option>
                  <option value="emerald">Rồng xanh ngọc</option>
                  <option value="custom">Tùy chỉnh (Tải ảnh)</option>
                  <option value="hidden">Ẩn</option>
                </select>
              </div>

              {coverPageProps.patternStyle === 'custom' && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: '#f1f5f9',
                        border: '1px dashed #cbd5e1',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        color: '#475569',
                        fontSize: '13px'
                      }}
                    >
                      <Upload size={16} /> Tải ảnh lên
                    </button>
                    <button
                      onClick={() => setIsLibraryModalOpen(true)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: '#f1f5f9',
                        border: '1px dashed #cbd5e1',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        color: '#475569',
                        fontSize: '13px'
                      }}
                    >
                      <ImageIcon size={16} /> Thư viện
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*,.svg"
                    onChange={handleCustomPatternChange}
                  />
                  {coverPageProps.patternCustomImage && (
                    <div style={{ marginTop: '8px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                      <img src={coverPageProps.patternCustomImage} alt="Custom Pattern" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                    </div>
                  )}
                </div>
              )}

              {coverPageProps.patternStyle !== 'custom' && (
                <ColorField
                  label="Màu tông"
                  color={coverPageProps.patternColor}
                  onChange={(c) => updateCoverPageProps({ patternColor: c })}
                />
              )}
              <Slider
                label="Độ mờ"
                value={coverPageProps.patternOpacity}
                min={0} max={100} step={1}
                onChange={(val) => updateCoverPageProps({ patternOpacity: val })}
                onCommit={() => { }}
              />
            </>
          )}
        </Section>

        {/* ✨ Hiệu ứng nổi */}
        <Section title="Hiệu ứng nổi" icon={<Star size={16} />} defaultOpen={false}>
          <label className="rp-field" style={{ cursor: 'pointer' }}>
            <span className="rp-label" style={{ margin: 0 }}>Bật hiệu ứng</span>
            <input
              type="checkbox"
              checked={coverPageProps.showEffect}
              onChange={(e) => updateCoverPageProps({ showEffect: e.target.checked })}
            />
          </label>

          {coverPageProps.showEffect && (
            <>
              <div className="rp-field">
                <span className="rp-label">Kiểu hạt</span>
                <select
                  className="rp-select"
                  value={coverPageProps.effectType}
                  onChange={(e) => updateCoverPageProps({ effectType: e.target.value as any })}
                >
                  <option value="hy">Chữ Hỷ (囍)</option>
                  <option value="cherry">Hoa anh đào</option>
                  <option value="yellow">Cánh hoa vàng</option>
                  <option value="heart">Tim đỏ</option>
                </select>
              </div>
              <ColorField
                label="Màu hạt"
                color={coverPageProps.effectColor}
                onChange={(c) => updateCoverPageProps({ effectColor: c })}
              />
              <Slider
                label="Số lượng"
                value={coverPageProps.effectParticleCount}
                min={10} max={100} step={1}
                onChange={(val) => updateCoverPageProps({ effectParticleCount: val })}
                onCommit={() => { }}
              />
              <Slider
                label="Tốc độ bay"
                value={coverPageProps.effectSpeed}
                min={10} max={200} step={1}
                onChange={(val) => updateCoverPageProps({ effectSpeed: val })}
                onCommit={() => { }}
              />
            </>
          )}
        </Section>
      </div>

      <LibraryPickerModal 
        isOpen={isLibraryModalOpen} 
        onClose={() => setIsLibraryModalOpen(false)} 
        onSelect={(url) => updateCoverPageProps({ patternCustomImage: url, patternStyle: 'custom' })}
      />
    </div>
  );
}
