import React, { useState, useRef } from 'react';
import { useEditorStore } from '../../../store/editorStore';
import type { CanvasElement, QrGiftBoxContent, BankAccount } from '../../../types/editor.types';
import { Section, Slider, LayoutIcon, AlignLeftIcon, AlignCenterIcon, AlignRightIcon } from '../RightPanelShared';
import { CustomColorPicker } from '../../CustomColorPicker';
import { assetsApi } from '../../../../../api/assetsApi';
import { QrGiftBoxModal } from '../../../../../pages/PublicInvite/elements/QrGiftBoxModal';

export interface QrGiftBoxPanelProps {
  element: CanvasElement;
}

const BANK_LIST = [
  'Vietcombank', 'Techcombank', 'BIDV', 'Agribank', 'VPBank',
  'MB Bank', 'ACB', 'Sacombank', 'TPBank', 'VietinBank', 'SHB', 'HDBank'
];

export function QrGiftBoxPanel({ element }: QrGiftBoxPanelProps) {
  const { updateQrGiftBoxProps, activeRightTab } = useEditorStore();
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showEnvelopeColorPicker, setShowEnvelopeColorPicker] = useState(false);
  const [showPopupHeaderBgPicker, setShowPopupHeaderBgPicker] = useState(false);
  const [showPopupHeaderTextColorPicker, setShowPopupHeaderTextColorPicker] = useState(false);
  const [showPopupBgPicker, setShowPopupBgPicker] = useState(false);
  const [showPopupTextColorPicker, setShowPopupTextColorPicker] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Local state for add/edit form
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [formRole, setFormRole] = useState<'bride' | 'groom'>('bride');
  const [formName, setFormName] = useState('');
  const [formBank, setFormBank] = useState(BANK_LIST[0]);
  const [formNumber, setFormNumber] = useState('');
  const [formQrUrl, setFormQrUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const qrFileInputRef = useRef<HTMLInputElement>(null);

  const props = element.qrGiftBoxProps;
  if (!props) return null;

  if (activeRightTab === 'effects') {
    return (
      <div className="right-panel-scroll">
        <div style={{ padding: 16, color: '#64748b', fontSize: 13, textAlign: 'center' }}>
          Tính năng hiệu ứng chưa hỗ trợ cho widget này.
        </div>
      </div>
    );
  }

  const handlePropChange = <K extends keyof QrGiftBoxContent>(key: K, value: QrGiftBoxContent[K]) => {
    updateQrGiftBoxProps(element.id, { [key]: value });
  };

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const asset = await assetsApi.uploadAsset(file);
      setFormQrUrl(asset.url);
    } catch (error) {
      console.error('Error uploading QR', error);
      alert('Lỗi upload mã QR.');
    } finally {
      setIsUploading(false);
    }
  };

  const openAddForm = () => {
    // Auto detect remaining role if 1 account exists
    const hasBride = (props.accounts || []).some(a => a.role === 'bride');
    const hasGroom = (props.accounts || []).some(a => a.role === 'groom');
    setFormRole(hasBride && !hasGroom ? 'groom' : 'bride');

    setFormName('');
    setFormBank(BANK_LIST[0]);
    setFormNumber('');
    setFormQrUrl(null);
    setEditingAccountId(null);
    setIsEditingAccount(true);
  };

  const openEditForm = (acc: BankAccount) => {
    setFormRole(acc.role);
    setFormName(acc.name);
    setFormBank(acc.bankName);
    setFormNumber(acc.accountNumber);
    setFormQrUrl(acc.qrImageUrl);
    setEditingAccountId(acc.id);
    setIsEditingAccount(true);
  };

  const saveAccount = () => {
    if (!formName.trim() || !formBank.trim() || !formNumber.trim()) {
      alert('Vui lòng điền đủ Tên, Ngân hàng và Số tài khoản');
      return;
    }

    const newAcc: BankAccount = {
      id: editingAccountId || Date.now().toString(),
      role: formRole,
      label: formRole === 'bride' ? 'Cô dâu' : 'Chú rể',
      name: formName,
      bankName: formBank,
      accountNumber: formNumber,
      qrImageUrl: formQrUrl
    };

    let newAccounts = [...props.accounts];
    if (editingAccountId) {
      newAccounts = newAccounts.map(a => a.id === editingAccountId ? newAcc : a);
    } else {
      newAccounts.push(newAcc);
    }

    handlePropChange('accounts', newAccounts);
    setIsEditingAccount(false);
  };

  const deleteAccount = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      handlePropChange('accounts', props.accounts.filter(a => a.id !== id));
    }
  };

  const canAddMore = props.accounts.length < 2;

  return (
    <div className="right-panel-scroll" style={{ paddingBottom: '40px' }}>
      {/* SECTION 1: Cài đặt Bao Lì Xì */}
      <Section title="Cấu hình bao lì xì" icon={<LayoutIcon />} defaultOpen>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: '#475569' }}>Màu sắc bao</span>
            <div
              onClick={() => setShowEnvelopeColorPicker(!showEnvelopeColorPicker)}
              style={{
                width: '28px', height: '28px', borderRadius: '6px',
                backgroundColor: props.envelopeColor || '#b91c1c',
                border: '1px solid #cbd5e1', cursor: 'pointer'
              }}
            />
            {showEnvelopeColorPicker && (
              <div style={{ position: 'absolute', right: 0, top: '36px', zIndex: 9999 }}>
                <CustomColorPicker
                  initialColor={props.envelopeColor || '#b91c1c'}
                  onChange={(c) => handlePropChange('envelopeColor', c.color)}
                  onClose={() => setShowEnvelopeColorPicker(false)}
                  alignRight={true}
                />
              </div>
            )}
          </div>
          <button
            onClick={() => setShowPreviewModal(true)}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', backgroundColor: '#f43f5e', color: '#fff', border: 'none', fontSize: '13px', fontWeight: 500, cursor: 'pointer', marginTop: '4px' }}
          >
            Xem thử hoạt ảnh hiển thị
          </button>
        </div>
      </Section>

      {/* SECTION 2: Bank Information */}
      <Section title="Thông tin người nhận" icon={<AlignLeftIcon />} defaultOpen>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>QR Bank</span>
          <button
            onClick={openAddForm}
            disabled={!canAddMore || isEditingAccount}
            title={!canAddMore ? "Tối đa 2 tài khoản" : ""}
            style={{
              padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: (!canAddMore || isEditingAccount) ? 'not-allowed' : 'pointer',
              backgroundColor: (!canAddMore || isEditingAccount) ? '#e2e8f0' : '#f43f5e', color: (!canAddMore || isEditingAccount) ? '#94a3b8' : '#fff', border: 'none'
            }}
          >
            + Thêm tài khoản
          </button>
        </div>

        {/* Existing Accounts */}
        {!isEditingAccount && (props.accounts || []).length === 0 && (
          <div style={{ padding: '16px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', color: '#94a3b8', fontSize: '13px', border: '1px dashed #cbd5e1' }}>
            Chưa có thông tin tài khoản
          </div>
        )}

        {!isEditingAccount && (props.accounts || []).map(acc => (
          <div key={acc.id} style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '8px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span style={{
                padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                backgroundColor: acc.role === 'bride' ? '#ffe4e6' : '#dbeafe',
                color: acc.role === 'bride' ? '#e11d48' : '#2563eb'
              }}>
                {acc.role === 'bride' ? 'Cô dâu' : 'Chú rể'}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => openEditForm(acc)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 2 }}>✏️</button>
                <button onClick={() => deleteAccount(acc.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 2 }}>🗑️</button>
              </div>
            </div>
            <div style={{ fontWeight: 600, fontSize: '13px', color: '#334155' }}>{acc.name}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{acc.bankName} - {acc.accountNumber}</div>
          </div>
        ))}

        {/* Inline Form */}
        {isEditingAccount && (
          <div style={{ padding: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#64748b' }}>Vai trò</label>
              <select className="rp-input" value={formRole} onChange={e => setFormRole(e.target.value as 'bride' | 'groom')} style={{ width: '100%' }}>
                <option value="bride">Cô dâu</option>
                <option value="groom">Chú rể</option>
              </select>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#64748b' }}>Tên chủ tài khoản</label>
              <input type="text" className="rp-input" value={formName} onChange={e => setFormName(e.target.value)} style={{ width: '100%' }} placeholder="VD: NGUYEN VAN A" />
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#64748b' }}>Tên ngân hàng</label>
              <select className="rp-input" value={formBank} onChange={e => setFormBank(e.target.value)} style={{ width: '100%' }}>
                {BANK_LIST.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#64748b' }}>Số tài khoản</label>
              <input type="text" className="rp-input" value={formNumber} onChange={e => setFormNumber(e.target.value.replace(/\D/g, '').slice(0, 20))} style={{ width: '100%' }} placeholder="VD: 1903..." />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#64748b' }}>Ảnh QR Code (Tùy chọn)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {formQrUrl ? <img src={formQrUrl} alt="QR" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '10px', color: '#94a3b8' }}>Chưa có</span>}
                </div>
                <input type="file" ref={qrFileInputRef} style={{ display: 'none' }} accept="image/*,.svg" onChange={handleQrUpload} />
                <button onClick={() => qrFileInputRef.current?.click()} disabled={isUploading} style={{ padding: '4px 12px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer' }}>
                  {isUploading ? 'Đang tải...' : 'Tải lên QR'}
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setIsEditingAccount(false)} style={{ padding: '6px 16px', borderRadius: '4px', backgroundColor: '#fff', border: '1px solid #cbd5e1', fontSize: '12px', cursor: 'pointer' }}>Hủy</button>
              <button onClick={saveAccount} style={{ padding: '6px 16px', borderRadius: '4px', backgroundColor: '#10b981', color: '#fff', border: 'none', fontSize: '12px', cursor: 'pointer' }}>Lưu</button>
            </div>
          </div>
        )}
      </Section>

      {/* SECTION 3: Text content */}
      <Section title="Hiệu ứng phong bao" icon={<LayoutIcon />} defaultOpen>
        <div style={{ marginBottom: '12px' }}>
          <input type="text" className="rp-input" value={props.title} onChange={(e) => handlePropChange('title', e.target.value)} style={{ width: '100%', fontWeight: 600 }} placeholder="Hộp Quà Yêu Thương" />
        </div>
        <div>
          <textarea className="rp-input" value={props.subtitle} onChange={(e) => handlePropChange('subtitle', e.target.value)} style={{ width: '100%', minHeight: '60px', fontSize: '13px', resize: 'vertical' }} placeholder="Nhập phụ đề..." />
        </div>
      </Section>

      {/* SECTION 4: Alignment */}
      <div className="rp-field" style={{ padding: '0 16px', marginTop: '16px' }}>
        <span className="rp-label">Căn chỉnh</span>
        <div className="rp-align-group" style={{ flex: 1 }}>
          {(['left', 'center', 'right'] as const).map(align => (
            <button
              key={align}
              className={`rp-align-btn ${props.alignment === align ? 'active' : ''}`}
              onClick={() => handlePropChange('alignment', align)}
            >
              {align === 'left' ? <AlignLeftIcon /> : align === 'center' ? <AlignCenterIcon /> : <AlignRightIcon />}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 5: Appearance */}
      <Section title="Cài đặt giao diện" icon={<LayoutIcon />}>
        <div className="rp-field" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="rp-label">Màu nền</span>
          <div
            onClick={() => setShowBgColorPicker(!showBgColorPicker)}
            style={{
              width: 24, height: 24, borderRadius: '50%',
              backgroundColor: props.backgroundColor || 'transparent',
              border: '1px solid #ccc', cursor: 'pointer',
              backgroundImage: props.backgroundColor === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : undefined,
              backgroundSize: '8px 8px', backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
            }}
          />
          {showBgColorPicker && (
            <div style={{ position: 'absolute', right: 0, top: 32, zIndex: 10 }}>
              <CustomColorPicker
                initialColor={props.backgroundColor}
                onChange={(c) => handlePropChange('backgroundColor', c.color)}
                onClose={() => setShowBgColorPicker(false)}
                alignRight={true}
              />
            </div>
          )}
        </div>

        <div className="rp-field" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <span className="rp-label">Màu nền Header (Popup)</span>
          <div
            onClick={() => setShowPopupHeaderBgPicker(!showPopupHeaderBgPicker)}
            style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: props.popupHeaderBgColor || '#8B2929', border: '1px solid #ccc', cursor: 'pointer' }}
          />
          {showPopupHeaderBgPicker && (
            <div style={{ position: 'absolute', right: 0, top: 32, zIndex: 10 }}>
              <CustomColorPicker initialColor={props.popupHeaderBgColor || '#8B2929'} onChange={(c) => handlePropChange('popupHeaderBgColor', c.color)} onClose={() => setShowPopupHeaderBgPicker(false)} alignRight={true} />
            </div>
          )}
        </div>

        <div className="rp-field" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <span className="rp-label">Màu chữ Header (Popup)</span>
          <div
            onClick={() => setShowPopupHeaderTextColorPicker(!showPopupHeaderTextColorPicker)}
            style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: props.popupHeaderTextColor || '#FFFFFF', border: '1px solid #ccc', cursor: 'pointer' }}
          />
          {showPopupHeaderTextColorPicker && (
            <div style={{ position: 'absolute', right: 0, top: 32, zIndex: 10 }}>
              <CustomColorPicker initialColor={props.popupHeaderTextColor || '#FFFFFF'} onChange={(c) => handlePropChange('popupHeaderTextColor', c.color)} onClose={() => setShowPopupHeaderTextColorPicker(false)} alignRight={true} />
            </div>
          )}
        </div>

        <div className="rp-field" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <span className="rp-label">Màu nền Popup</span>
          <div
            onClick={() => setShowPopupBgPicker(!showPopupBgPicker)}
            style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: props.popupBgColor || '#EAE0D5', border: '1px solid #ccc', cursor: 'pointer' }}
          />
          {showPopupBgPicker && (
            <div style={{ position: 'absolute', right: 0, top: 32, zIndex: 10 }}>
              <CustomColorPicker initialColor={props.popupBgColor || '#EAE0D5'} onChange={(c) => handlePropChange('popupBgColor', c.color)} onClose={() => setShowPopupBgPicker(false)} alignRight={true} />
            </div>
          )}
        </div>

        <div className="rp-field" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <span className="rp-label">Màu chữ Popup</span>
          <div
            onClick={() => setShowPopupTextColorPicker(!showPopupTextColorPicker)}
            style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: props.popupTextColor || '#4A4A4A', border: '1px solid #ccc', cursor: 'pointer' }}
          />
          {showPopupTextColorPicker && (
            <div style={{ position: 'absolute', right: 0, top: 32, zIndex: 10 }}>
              <CustomColorPicker initialColor={props.popupTextColor || '#4A4A4A'} onChange={(c) => handlePropChange('popupTextColor', c.color)} onClose={() => setShowPopupTextColorPicker(false)} alignRight={true} />
            </div>
          )}
        </div>

        <div style={{ marginTop: 16 }}>
          <Slider
            label="Độ mờ"
            value={props.opacity}
            min={0}
            max={1}
            step={0.01}
            onChange={(val) => handlePropChange('opacity', val)}
          />
        </div>
      </Section>

      <QrGiftBoxModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        content={props}
        isPreview={true}
      />
    </div>
  );
}
