import React, { useRef, useState, useEffect } from 'react';
import { Upload, ImageIcon, Sparkles, Loader2, Images, Clipboard, X } from 'lucide-react';

interface ImageUploadCardProps {
  imageSrc: string;
  onImageChange: (file: File) => void;
  onPerformOcr: () => void;
  ocrDisabled: boolean;
  ocrLoading: boolean;
  onClearImage: () => void;
  onBatchProcess: (files: File[]) => void;
  batchFiles: File[];
  onBatchFilesChange: (files: File[]) => void;
  onRemoveBatchFile: (index: number) => void;
}

export default function ImageUploadCard({
  imageSrc,
  onImageChange,
  onPerformOcr,
  ocrDisabled,
  ocrLoading,
  onClearImage,
  onBatchProcess,
  batchFiles,
  onBatchFilesChange,
  onRemoveBatchFile
}: ImageUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const batchFileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processingMode, setProcessingMode] = useState<'single' | 'batch'>('single');
  const [showPasteHint, setShowPasteHint] = useState(false);

  // 处理模式切换时清理对应的数据
  const handleModeChange = (mode: 'single' | 'batch') => {
    setProcessingMode(mode);
    if (mode === 'single') {
      // 切换到单张模式时清空批量文件
      onBatchFilesChange([]);
    } else {
      // 切换到批量模式时清空单张图片
      onClearImage();
    }
  };

  // 监听全局粘贴事件
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const imageFiles: File[] = [];
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            imageFiles.push(file);
          }
        }
      }

      if (imageFiles.length > 0) {
        e.preventDefault();
        
        if (processingMode === 'single') {
          // 单张模式：只使用第一张图片
          onImageChange(imageFiles[0]);
          setShowPasteHint(true);
          setTimeout(() => setShowPasteHint(false), 2000);
        } else {
          // 批量模式：处理所有图片
          handleBatchFiles(imageFiles);
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [processingMode, onImageChange, onBatchProcess]);

  // Trigger file dialog
  const triggerFileDialog = () => {
    if (processingMode === 'single') {
      fileInputRef.current?.click();
    } else {
      batchFileInputRef.current?.click();
    }
  };

  // Drag handles
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (processingMode === 'single') {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
          onImageChange(file);
        } else {
          alert('请选择有效的图片文件');
        }
      } else {
        // 批量处理模式
        const imageFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        if (imageFiles.length === 0) {
          alert('请选择有效的图片文件');
          return;
        }
        handleBatchFiles(imageFiles);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageChange(e.target.files[0]);
    }
  };

  const handleBatchFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const imageFiles = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
      if (imageFiles.length === 0) {
        alert('请选择有效的图片文件');
        return;
      }
      handleBatchFiles(imageFiles);
    }
  };

  const handleBatchFiles = (files: File[]) => {
    if (files.length === 0) return;
    
    // 合并现有文件和新文件
    const combinedFiles = [...batchFiles, ...files];
    
    // 限制最多60张
    if (combinedFiles.length > 60) {
      alert(`最多只能上传60张图片，当前已有${batchFiles.length}张，最多还能添加${60 - batchFiles.length}张`);
      const allowedFiles = files.slice(0, 60 - batchFiles.length);
      if (allowedFiles.length > 0) {
        onBatchFilesChange([...batchFiles, ...allowedFiles]);
      }
      return;
    }
    
    onBatchFilesChange(combinedFiles);
  };

  return (
    <div className="classical-card overflow-hidden transition-all duration-300 hover:shadow-sm relative">
      
      {/* Header featuring soft icons and traditional Chinese calligraphy header style */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#f4ebd0] border-b border-[#ebdcae]">
        <div className="flex items-center gap-2.5">
          <ImageIcon className="w-4.5 h-4.5 text-[#9e2a2b] stroke-[2]" />
          <h3 className="font-heading font-black text-sm tracking-wide text-[#2b2621]">
            上传图片
          </h3>
          <div className="flex items-center gap-1 text-[10px] text-stone-500 bg-white/60 px-2 py-0.5 rounded border border-[#ebdcae]/50">
            <Clipboard className="w-3 h-3" />
            <span>支持 Ctrl+V 粘贴</span>
          </div>
        </div>
      </div>
      
      {/* 粘贴提示动画 */}
      {showPasteHint && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 bg-[#1d4436] text-white px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 text-xs font-bold animate-fade-in">
          <Clipboard className="w-3.5 h-3.5" />
          <span>已从剪切板粘贴图片</span>
        </div>
      )}

      <div className="p-6 space-y-5">
        {/* 处理模式选择 */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleModeChange('single')}
            className={`flex-1 px-3 py-2 rounded-lg font-bold text-xs transition-all ${
              processingMode === 'single'
                ? 'bg-[#1d4436] text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              单张处理
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('batch')}
            className={`flex-1 px-3 py-2 rounded-lg font-bold text-xs transition-all ${
              processingMode === 'batch'
                ? 'bg-[#1d4436] text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Images className="w-3.5 h-3.5" />
              批量处理
              {batchFiles.length > 0 && (
                <span className="bg-white text-[#1d4436] px-1.5 py-0.5 rounded text-[10px] font-black">
                  {batchFiles.length}
                </span>
              )}
            </div>
          </button>
        </div>

        <input
          type="file"
          id="imageUpload"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <input
          type="file"
          id="batchImageUpload"
          ref={batchFileInputRef}
          onChange={handleBatchFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />

        {/* Drag Drop Area & Visual Preview - always clickable to trigger file dialog */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileDialog}
          className={`relative min-h-[300px] rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-6 transition-all cursor-pointer ${
            (processingMode === 'single' && imageSrc) || (processingMode === 'batch' && batchFiles.length > 0)
              ? 'border-[#ebdcae] bg-white'
              : 'hover:border-[#9e2a2b] border-[#ebdcae]/75 bg-[#fdfaf5]'
          } ${isDragging ? 'border-[#9e2a2b] bg-[#f4ebd0]/55' : ''}`}
        >
          {/* 单张模式：显示单个图片预览 */}
          {processingMode === 'single' && imageSrc ? (
            <div className="relative group max-w-full flex justify-center items-center h-full">
              <img
                id="uploadedImage"
                src={imageSrc}
                alt="Uploaded view"
                className="max-h-[350px] object-contain rounded-md shadow-2xs border border-[#ebdcae]/40"
              />
              {/* Dim backdrop and spinner during loading */}
              {ocrLoading && (
                <div 
                  id="loadingSpinner"
                  className="absolute inset-0 bg-white/90 backdrop-blur-3xs flex flex-col items-center justify-center gap-3 rounded-md animate-fade-in"
                >
                  <Loader2 className="w-8 h-8 text-[#9e2a2b] animate-spin" />
                  <span className="text-sm font-black text-[#2b2621] tracking-wide font-heading">多模态 OCR 智能识别中</span>
                  <span className="text-xs text-[#a8885d] text-center max-w-[280px]">正在精准析出家具的名称、用处、类型、品质及占格数据...</span>
                </div>
              )}
            </div>
          ) : processingMode === 'batch' && batchFiles.length > 0 ? (
            /* 批量模式：显示图片网格 */
            <div className="w-full h-full" onClick={(e) => e.stopPropagation()}>
              <div className="overflow-y-auto max-h-[350px] mb-3">
                <div className="grid grid-cols-3 gap-2 p-2">
                  {batchFiles.map((file, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover rounded-md border-2 border-[#ebdcae] shadow-xs"
                      />
                      {/* 删除按钮 */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveBatchFile(index);
                        }}
                        className="absolute -top-1.5 -right-1.5 bg-[#9e2a2b] hover:bg-[#7e1a1b] text-white rounded-full p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-md"
                        title="移除此图片"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {/* 文件名提示 */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-1 py-0.5 truncate rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity">
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 追加图片按钮 */}
              {batchFiles.length < 60 && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      batchFileInputRef.current?.click();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#f4ebd0] hover:bg-[#ebdcae] border-2 border-dashed border-[#9e2a2b]/50 hover:border-[#9e2a2b] rounded-lg text-sm font-bold text-stone-700 transition-all"
                  >
                    <Upload className="w-4 h-4 text-[#9e2a2b]" />
                    继续添加图片 ({batchFiles.length}/60)
                  </button>
                </div>
              )}
              
              {/* 达到上限提示 */}
              {batchFiles.length >= 60 && (
                <div className="flex justify-center">
                  <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs font-bold text-amber-700">
                    已达到上限 (60/60)
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* 无图片时：显示上传提示 */
            <div className="space-y-3 text-center p-6 select-none">
              <div className="mx-auto w-12 h-12 rounded-full bg-[#f4ebd0]/70 flex items-center justify-center border border-[#ebdcae]">
                {processingMode === 'single' ? (
                  <Upload className="w-5.5 h-5.5 text-[#9e2a2b]" />
                ) : (
                  <Images className="w-5.5 h-5.5 text-[#9e2a2b]" />
                )}
              </div>
              <div className="space-y-1">
                <p id="imagePlaceholder" className="text-sm font-bold text-stone-700">
                  {processingMode === 'single' 
                    ? '点击这里选择本地图片，或拖拽图片到此'
                    : '点击选择多张图片，或拖拽多张图片到此'}
                </p>
                <p className="text-[11px] text-stone-400 font-medium">
                  {processingMode === 'single'
                    ? '支持 PNG, JPG, JPEG, WEBP 格式 | 可使用 Ctrl+V 粘贴'
                    : '批量模式：最多可上传60张图片 | 将分批处理所有图片并自动存入暂存列表'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* OCR Button Row placed below the image box - 仅在单张模式下显示 */}
        {processingMode === 'single' && (
          <div className="pt-2 flex gap-2">
            <button
              id="ocrButton"
              type="button"
              disabled={ocrDisabled || ocrLoading}
              onClick={onPerformOcr}
              className="flex-1 h-11 bg-[#1d4436] hover:bg-[#153429] disabled:bg-stone-100 disabled:text-stone-300 disabled:border-stone-200 disabled:cursor-not-allowed text-white font-bold text-xs tracking-wide rounded-lg shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              {ocrLoading ? (
                <>
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                  识别中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#ebdcae] fill-[#ebdcae]/10" />
                  开始识别
                </>
              )}
            </button>
            {imageSrc && (
              <button
                type="button"
                onClick={onClearImage}
                disabled={ocrLoading}
                className="h-11 px-4 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed text-stone-700 font-bold text-xs rounded-lg border border-stone-300 flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0"
                title="清空图片"
              >
                <X className="w-3.5 h-3.5" />
                清空
              </button>
            )}
          </div>
        )}

        {/* 批量处理按钮 - 仅在批量模式下显示 */}
        {processingMode === 'batch' && (
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              disabled={batchFiles.length === 0 || ocrLoading}
              onClick={() => onBatchProcess(batchFiles)}
              className="flex-1 h-11 bg-[#9e2a2b] hover:bg-[#7e1a1b] disabled:bg-stone-100 disabled:text-stone-300 disabled:border-stone-200 disabled:cursor-not-allowed text-white font-bold text-xs tracking-wide rounded-lg shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              {ocrLoading ? (
                <>
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                  处理中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#ebdcae] fill-[#ebdcae]/10" />
                  批量识别 ({batchFiles.length})
                </>
              )}
            </button>
            {batchFiles.length > 0 && (
              <button
                type="button"
                onClick={() => onBatchFilesChange([])}
                disabled={ocrLoading}
                className="h-11 px-4 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed text-stone-700 font-bold text-xs rounded-lg border border-stone-300 flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0"
                title="清空所有图片"
              >
                <X className="w-3.5 h-3.5" />
                清空
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

