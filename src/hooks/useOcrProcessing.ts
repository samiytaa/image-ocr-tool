import { ApiConfig, OcrFormData, SavedOcrItem } from '../types';
import { performOcrOnBase64, performBatchOcrOnBase64 } from '../services/ocrService';
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

  // 批量处理图片（分批次，带并发控制）
  const handleBatchProcess = async (files: File[]) => {
    if (!apiConfig.apiKey || !apiConfig.endpoint || !apiConfig.model) {
      setIsApiModalOpen(true);
      alert('检测到未完成接口参数设定。请在弹出的窗口中，输入您的多模态 API 端点、密钥并选择可用模型即可开启。');
      return;
    }

    const BATCH_SIZE = 10; // 每批处理10张
    const MAX_CONCURRENT = 2; // 最大并发数为2

    startBatch(files.length);
    setOcrLoading(true);
    updateProgress(0, '正在准备批量处理...');

    try {
      // 第一步：将所有图片转换为Base64
      const base64Images: { file: File; base64: string; index: number }[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        updateProgress(i + 1, `正在准备: ${file.name} (${i + 1}/${files.length})`);
        try {
          const base64Image = await getBase64FromFile(file);
          base64Images.push({ file, base64: base64Image, index: i });
        } catch (err) {
          console.error(`转换图片 ${file.name} 失败:`, err);
          incrementFail();
        }
      }

      if (base64Images.length === 0) {
        throw new Error('所有图片转换失败');
      }

      // 第二步：分批处理（均摊策略）
      const totalImages = base64Images.length;
      const batches: { file: File; base64: string; index: number }[][] = [];
      
      if (totalImages <= BATCH_SIZE) {
        // 图片数≤10，单批次处理
        batches.push(base64Images);
      } else {
        // 图片数>10，计算最优批次数和每批数量
        const batchCount = Math.ceil(totalImages / BATCH_SIZE);
        const imagesPerBatch = Math.ceil(totalImages / batchCount);
        
        for (let i = 0; i < totalImages; i += imagesPerBatch) {
          batches.push(base64Images.slice(i, i + imagesPerBatch));
        }
      }

      updateProgress(files.length, `准备完成，共 ${batches.length} 个批次，开始识别...`);

      // 第三步：根据批次数量决定是否并发
      let processedCount = 0;
      
      if (batches.length === 1 || files.length <= 10) {
        // 只有一个批次或图片数<=10，顺序处理
        for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
          const batch = batches[batchIndex];
          updateProgress(
            processedCount,
            `正在处理批次 ${batchIndex + 1}/${batches.length} (${batch.length}张图片)...`
          );
          
          await processBatch(batch, processedCount);
          processedCount += batch.length;
        }
      } else {
        // 多个批次且图片数>10，使用并发处理
        for (let i = 0; i < batches.length; i += MAX_CONCURRENT) {
          const concurrentBatches = batches.slice(i, i + MAX_CONCURRENT);
          
          updateProgress(
            processedCount,
            `并发处理批次 ${i + 1}-${Math.min(i + MAX_CONCURRENT, batches.length)}/${batches.length}...`
          );
          
          // 并发处理当前的多个批次
          await Promise.all(
            concurrentBatches.map((batch, idx) => 
              processBatch(batch, processedCount + idx * BATCH_SIZE)
            )
          );
          
          processedCount += concurrentBatches.reduce((sum, batch) => sum + batch.length, 0);
        }
      }

      setOcrLoading(false);
      completeBatch();
      setBatchFiles([]);
      
      const successCount = base64Images.length - (files.length - base64Images.length);
      const failCount = files.length - successCount;
      showToast(`批量处理完成！成功: ${successCount} 张，失败: ${failCount} 张`);
    } catch (err) {
      console.error('批量处理失败:', err);
      setOcrLoading(false);
      completeBatch();
      
      showToast(`批量处理失败: ${err instanceof Error ? err.message : '未知错误'}`);
    }
  };

  // 处理单个批次的辅助函数
  const processBatch = async (
    batch: { file: File; base64: string; index: number }[],
    startIndex: number
  ) => {
    try {
      const base64Array = batch.map(item => item.base64);
      const results = await performBatchOcrOnBase64(
        base64Array,
        apiConfig,
        option1,
        option2,
        option3
      );

      // 保存识别结果
      for (let i = 0; i < batch.length; i++) {
        const result = results[i];
        const item = batch[i];
        
        if (result) {
          const newItem: SavedOcrItem = {
            id: `${Date.now()}-${item.index}`,
            formData: result,
            timestamp: Date.now()
          };
          
          setSavedItems(prev => {
            const updated = [...prev, newItem];
            localStorage.setItem('savedOcrItems', JSON.stringify(updated));
            return updated;
          });
          
          incrementSuccess();
          updateProgress(startIndex + i + 1, `✓ ${item.file.name}`);
        } else {
          incrementFail();
          updateProgress(startIndex + i + 1, `✗ ${item.file.name}`);
        }
      }
    } catch (err) {
      console.error('批次处理失败:', err);
      // 该批次全部标记为失败
      for (let i = 0; i < batch.length; i++) {
        incrementFail();
      }
      throw err;
    }
  };

  return {
    handlePerformOcr,
    handleBatchProcess
  };
};
