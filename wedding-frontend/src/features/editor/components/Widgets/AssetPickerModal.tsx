import React, { useState, useEffect, useRef } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { assetsApi } from '../../../../api/assetsApi';
import { X, UploadCloud, Check } from 'lucide-react';
import { toast } from 'sonner';

interface AssetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrls: string[]) => void;
  multiple?: boolean;
}

export function AssetPickerModal({ isOpen, onClose, onSelect, multiple = true }: AssetPickerModalProps) {
  const { uploadedImages, fetchUploadedAssets, addUploadedImage } = useEditorStore();
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchUploadedAssets();
      setSelectedUrls([]); // Reset selection when opened
    }
  }, [isOpen, fetchUploadedAssets]);

  if (!isOpen) return null;

  const toggleSelect = (url: string) => {
    if (multiple) {
      setSelectedUrls((prev) => 
        prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
      );
    } else {
      // In single select mode, immediately select and close
      onSelect([url]);
      onClose();
    }
  };

  const handleConfirm = () => {
    onSelect(selectedUrls);
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newSelected: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      try {
        const asset = await assetsApi.uploadAsset(file);
        addUploadedImage({
          id: asset.id,
          src: asset.url,
          name: file.name,
          thumbnailSrc: asset.thumbnailUrl || asset.url,
        });
        newSelected.push(asset.url);
      } catch (error: any) {
        console.error('Lỗi khi tải ảnh lên:', error);
        toast.error(`Lỗi tải ảnh: ${file.name}`);
      }
    }

    setIsUploading(false);
    setSelectedUrls((prev) => [...prev, ...newSelected]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-[90vw] max-w-2xl max-h-[85vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Thêm ảnh vào Album</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            
            {/* Upload Button */}
            <div 
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`aspect-square border-2 border-dashed border-rose-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-rose-50 transition-colors text-rose-500 ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
            >
              <UploadCloud size={28} className="mb-2" />
              <span className="text-xs font-medium text-center px-1">
                {isUploading ? 'Đang tải...' : 'Tải ảnh lên'}
              </span>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple 
                accept="image/*,.svg"
                onChange={handleFileChange}
              />
            </div>

            {/* Asset Images */}
            {uploadedImages.map((img: import('../../types/editor.types').UploadedImage) => {
              const isSelected = selectedUrls.includes(img.src);
              return (
                <div 
                  key={img.id}
                  onClick={() => toggleSelect(img.src)}
                  className={`aspect-square rounded-lg overflow-hidden relative cursor-pointer group border-2 transition-all ${isSelected ? 'border-rose-500 shadow-md transform scale-[0.98]' : 'border-transparent shadow-sm'}`}
                >
                  <img src={img.thumbnailSrc ?? img.src} alt={img.name} className="w-full h-full object-cover" />
                  
                  {/* Overlay on hover or selected */}
                  <div className={`absolute inset-0 bg-black/20 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                  
                  {/* Check icon */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-sm animate-pulse">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {uploadedImages.length === 0 && !isUploading && (
            <p className="text-center text-gray-400 mt-8 text-sm">Chưa có ảnh nào trong thư viện (Asset) của bạn.</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            Đã chọn: <span className="text-rose-600">{selectedUrls.length} ảnh</span>
          </span>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Hủy
            </button>
            <button 
              onClick={handleConfirm}
              disabled={selectedUrls.length === 0}
              className="px-4 py-2 bg-rose-500 rounded-lg text-sm font-medium text-white hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
