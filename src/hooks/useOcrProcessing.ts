import { ApiConfig, OcrFormData, SavedOcrItem } from '../types';
import { performOcrOnBase64 } from '../services/ocrService';
import { getBase64FromImageUrl, getBase64FromFile } from '../utils/imageUtils';

interface UseOcrProcessingProps {
  apiConfig: ApiConfig;
  option1: string;
  option2: string;
  option3: string;
  imageSrc: string;
  setOcrLoading: (loading: boolean) => void;
  setRawOcrText: (text: string) => void;
  setFormData: (data: OcrFormData) => void;
  showToast: (message: string) => void;
  setIsApiModalOpen: (open: boolean) => void;
  startBatch: (total: number) => void;
  updateProgress: (current: number, fileName: string) => void;
  incrementSuccess: () => void;
  incrementFail: () => void;
  completeBatch: () => void;
  setSavedItems: React.Dispatch<React.SetStateAction<SavedOcrItem[]>>;
  setBatchFiles: (files: File[]) => void;
}

export const useOcrProcessing = ({
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
}: UseOcrProcessingProps) => {
  // 单张图片 OCR 处理
  const handlePerformOcr = async () => {
    if (!apiConfig.apiKey || !apiConfig.endpoint || !apiConfig.model) {
      setIsApiModalOpen(true);
      alert('检测到未完成接口参数设定。请在弹出的窗口中，输入您的多模态 API 端点、密钥并选择可用模型即可开启。');
      return;
    }

    setOcrLoading(true);
    setRawOcrText('正在连接云端多模态大语言模型中...');

    try {
      const base64Image = await getBase64FromImageUrl(imageSrc);
      const result = await performOcrOnBase64(base64Image, apiConfig, option1, option2, option3);
      
      if (result) {
        setFormData(result);
        setRawOcrText('识别成功');
        
        // 自动暂存识别结果
        const getCurrentPrefix = (name: string) => {
          const parts = name.split('·');
          return parts.length > 1 ? parts[0] : name;
        };

        const currentPrefix = getCurrentPrefix(result.name1 || result.name2 || result.name3);
        
        setSavedItems(prev => {
          const existingIndex = prev.findIndex(item => {
            const itemPrefix = getCurrentPrefix(item.formData.name1 || item.formData.name2 || item.formData.name3);
            return itemPrefix === currentPrefix;
          });

          let updated: SavedOcrItem[];
          let message: string;
          
          if (existingIndex !== -1) {
            updated = prev.map((item, index) => {
              if (index === existingIndex) {
                return {
                  ...item,
                  formData: { ...result },
                  timestamp: Date.now()
                };
              }
              return item;
            });
            message = `识别成功并已自动暂存（已覆盖重名家具"${currentPrefix}"的条目）`;
          } else {
            const newItem: SavedOcrItem = {
              id: Date.now().toString(),
              formData: { ...result },
              timestamp: Date.now()
            };
            updated = [...prev, newItem];
            message = '识别成功并已自动暂存';
          }
          
          localStorage.setItem('savedOcrItems', JSON.stringify(updated));
          showToast(message);
          return updated;
        });
      } else {
        setRawOcrText('识别失败: 无法解析结果');
        showToast('识别失败 (未能成功自动填充属性, 请手动核对)');
      }
    } catch (err: any) {
      console.error('OCR Error:', err);
      setRawOcrText(`识别失败: ${err.message}`);
      alert('OCR 识别失败: ' + err.message);
    } finally {
      setOcrLoading(false);
    }
  };

  // 批量处理图片
  const handleBatchProcess = async (files: File[]) => {
    if (!apiConfig.apiKey || !apiConfig.endpoint || !apiConfig.model) {
      setIsApiModalOpen(true);
      alert('检测到未完成接口参数设定。请在弹出的窗口中，输入您的多模态 API 端点、密钥并选择可用模型即可开启。');
      return;
    }

    startBatch(files.length);
    setOcrLoading(true);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      updateProgress(i + 1, file.name);

      try {
        const base64Image = await getBase64FromFile(file);
        const result = await performOcrOnBase64(base64Image, apiConfig, option1, option2, option3);
        
        if (result) {
          const newItem: SavedOcrItem = {
            id: `${Date.now()}-${i}`,
            formData: result,
            timestamp: Date.now()
          };
          setSavedItems(prev => {
            const updated = [...prev, newItem];
            localStorage.setItem('savedOcrItems', JSON.stringify(updated));
            return updated;
          });
          successCount++;
          incrementSuccess();
        } else {
          failCount++;
          incrementFail();
        }

        // 添加延迟避免请求过快
        if (i < files.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (err) {
        console.error(`处理图片 ${file.name} 失败:`, err);
        failCount++;
        incrementFail();
      }
    }

    setOcrLoading(false);
    completeBatch();
    setBatchFiles([]);
    
    showToast(`批量处理完成！成功: ${successCount} 张，失败: ${failCount} 张`);
  };

  return {
    handlePerformOcr,
    handleBatchProcess
  };
};
