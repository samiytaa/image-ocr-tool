import React, { useState, useEffect } from 'react';
import ApiConfigCard from './components/ApiConfigCard';
import PresetOptionsCard from './components/PresetOptionsCard';
import ImageUploadCard from './components/ImageUploadCard';
import OcrResultsCard from './components/OcrResultsCard';
import ExportCard from './components/ExportCard';
import SavedItemsCard from './components/SavedItemsCard';
import { AppHeader } from './components/AppHeader';
import { ToastNotification } from './components/ToastNotification';
import { BatchProgressModal } from './components/BatchProgressModal';
import { AppreciationModal } from './components/AppreciationModal';

import { useApiConfig } from './hooks/useApiConfig';
import { usePresetConfig } from './hooks/usePresetConfig';
import { useImageUpload } from './hooks/useImageUpload';
import { useOcrData } from './hooks/useOcrData';
import { useSavedItems } from './hooks/useSavedItems';
import { useBatchProgress } from './hooks/useBatchProgress';
import { useToast } from './hooks/useToast';
import { useOcrProcessing } from './hooks/useOcrProcessing';
import { useSavedItemsHandlers } from './hooks/useSavedItemsHandlers';
import { useItemEditHandlers } from './hooks/useItemEditHandlers';

const USAGE_COUNT_KEY = 'ocr_tool_usage_count';
const USAGE_THRESHOLD = 50;

export default function App() {
  const [isAppreciationModalOpen, setIsAppreciationModalOpen] = useState(false);
  const [usageCount, setUsageCount] = useState(() => {
    const saved = localStorage.getItem(USAGE_COUNT_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });

  // Toast
  const { toast, showToast } = useToast();

  // 检查使用次数并触发赞赏窗口
  const incrementUsageCount = () => {
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem(USAGE_COUNT_KEY, newCount.toString());

    if (newCount >= USAGE_THRESHOLD) {
      setIsAppreciationModalOpen(true);
      // 重置计数
      setUsageCount(0);
      localStorage.setItem(USAGE_COUNT_KEY, '0');
    }
  };

  // API Configuration
  const {
    apiConfig,
    setApiConfig,
    apiStatus,
    setApiStatus,
    isApiModalOpen,
    setIsApiModalOpen,
    handleSaveApiConfig
  } = useApiConfig();

  // Preset Configuration
  const {
    option1,
    setOption1,
    option2,
    setOption2,
    option3,
    setOption3,
    nameConfigs,
    selectedConfigKey,
    handleSelectConfig,
    handleSavePresetConfig,
    handleDeletePresetConfig
  } = usePresetConfig(showToast);

  // Image Upload
  const {
    imageSrc,
    batchFiles,
    handleImageChange,
    handleClearImage,
    handleBatchFilesChange,
    handleRemoveBatchFile,
    setBatchFiles
  } = useImageUpload();

  // OCR Data
  const {
    rawOcrText,
    setRawOcrText,
    ocrLoading,
    setOcrLoading,
    formData,
    setFormData
  } = useOcrData();

  // Saved Items
  const {
    savedItems,
    setSavedItems,
    editingId,
    setEditingId,
    addItem,
    updateItem,
    deleteItem,
    clearAllItems
  } = useSavedItems();

  // Batch Progress
  const {
    batchProgress,
    startBatch,
    updateProgress,
    incrementSuccess,
    incrementFail,
    completeBatch
  } = useBatchProgress();

  // OCR Processing
  const { handlePerformOcr, handleBatchProcess } = useOcrProcessing({
    apiConfig,
    option1,
    option2,
    option3,
    imageSrc,
    setOcrLoading,
    setRawOcrText,
    setFormData,
    showToast,
    setIsApiModalOpen,
    startBatch,
    updateProgress,
    incrementSuccess,
    incrementFail,
    completeBatch,
    setSavedItems,
    setBatchFiles
  });

  // 包装 OCR 处理函数以增加使用计数
  const handlePerformOcrWithCount = async () => {
    await handlePerformOcr();
    incrementUsageCount();
  };

  const handleBatchProcessWithCount = async () => {
    await handleBatchProcess();
    incrementUsageCount();
  };

  // Saved Items Handlers
  const { handleSaveBatch, handleCancelEdit } = useSavedItemsHandlers({
    editingId,
    setEditingId,
    formData,
    setFormData,
    setRawOcrText,
    handleClearImage,
    showToast,
    addItem,
    updateItem
  });

  // Item Edit Handlers
  const { handleEditItem, handleDeleteItem, handleClearAllItems } = useItemEditHandlers({
    setEditingId,
    setFormData,
    setRawOcrText,
    deleteItem,
    clearAllItems,
    showToast,
    editingId
  });

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* 批量处理遮罩层和进度条 */}
      <BatchProgressModal batchProgress={batchProgress} />
      
      {/* Toast Alert Banner */}
      <ToastNotification message={toast.message} show={toast.show} />

      {/* 固定顶部导航栏 */}
      <AppHeader
        apiConfig={apiConfig}
        batchProgressIsProcessing={batchProgress.isProcessing}
        onSettingsClick={() => setIsApiModalOpen(true)}
        onAppreciationClick={() => setIsAppreciationModalOpen(true)}
      />

      {/* Main Container */}
      <div className="max-w-[1240px] w-full mx-auto space-y-3 sm:space-y-4 px-3 sm:px-4 lg:px-6 pt-16 pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-start">
          
          {/* Left panel inputs / configurations */}
          <div className="lg:col-span-5 space-y-3">
            {/* 1. 男主家具颜色 / presets selection */}
            <div className={batchProgress.isProcessing ? 'opacity-50 pointer-events-none' : ''}>
              <PresetOptionsCard
                option1={option1}
                setOption1={setOption1}
                option2={option2}
                setOption2={setOption2}
                option3={option3}
                setOption3={setOption3}
                nameConfigs={nameConfigs}
                selectedConfigKey={selectedConfigKey}
                onSelectConfig={handleSelectConfig}
                onSaveConfig={handleSavePresetConfig}
                onDeleteConfig={handleDeletePresetConfig}
              />
            </div>

            {/* 2. 本地图片选择 */}
            <div className={batchProgress.isProcessing ? 'opacity-50 pointer-events-none' : ''}>
              <ImageUploadCard
                imageSrc={imageSrc}
                onImageChange={handleImageChange}
                onPerformOcr={handlePerformOcrWithCount}
                ocrDisabled={!imageSrc}
                ocrLoading={ocrLoading}
                onClearImage={handleClearImage}
                onBatchProcess={handleBatchProcessWithCount}
                batchFiles={batchFiles}
                onBatchFilesChange={handleBatchFilesChange}
                onRemoveBatchFile={handleRemoveBatchFile}
              />
            </div>
          </div>

          {/* Right panel outputs / modifications / spreadsheets */}
          <div className={`lg:col-span-7 space-y-3 ${batchProgress.isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* 3. OCR 原始输出 & 校对表单 */}
            <OcrResultsCard
              rawOcrText={rawOcrText}
              formData={formData}
              onFormChange={setFormData}
              editingId={editingId}
              onSaveBatch={handleSaveBatch}
              onCancelEdit={handleCancelEdit}
            />

            {/* 4. 表格数据生成 & 导出 */}
            <ExportCard
              formData={formData}
              savedItems={savedItems}
              showSuccessToast={showToast}
            />

            {/* 5. 结果条目区域 */}
            <SavedItemsCard
              items={savedItems}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onClearAll={handleClearAllItems}
              editingId={editingId}
            />
          </div>
        </div>
      </div>

      {/* API Connections Modal - 已隐藏 */}
      <div className="hidden">
        <ApiConfigCard
          config={apiConfig}
          onConfigChange={setApiConfig}
          onSave={handleSaveApiConfig}
          status={apiStatus}
          setStatus={setApiStatus}
          isOpen={isApiModalOpen}
          onClose={() => setIsApiModalOpen(false)}
        />
      </div>

      {/* 赞赏码弹窗 */}
      <AppreciationModal
        isOpen={isAppreciationModalOpen}
        onClose={() => setIsAppreciationModalOpen(false)}
      />
    </div>
  );
}
