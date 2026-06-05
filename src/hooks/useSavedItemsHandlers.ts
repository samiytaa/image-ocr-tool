import { OcrFormData } from '../types';

interface UseSavedItemsHandlersProps {
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  formData: OcrFormData;
  setFormData: (data: OcrFormData) => void;
  setRawOcrText: (text: string) => void;
  handleClearImage: () => void;
  showToast: (message: string) => void;
  addItem: (formData: OcrFormData) => string;
  updateItem: (id: string, formData: OcrFormData) => void;
}

export const useSavedItemsHandlers = ({
  editingId,
  setEditingId,
  formData,
  setFormData,
  setRawOcrText,
  handleClearImage,
  showToast,
  addItem,
  updateItem
}: UseSavedItemsHandlersProps) => {
  const handleSaveBatch = () => {
    if (!formData.name1.trim() && !formData.name2.trim() && !formData.name3.trim()) {
      alert('请确保家具组合名称预览中至少有一条有效数据！');
      return;
    }

    if (editingId) {
      // Edit mode: update existing item
      updateItem(editingId, formData);
      setEditingId(null);
      showToast('暂存家具条目更新成功');
    } else {
      // Add mode
      const message = addItem(formData);
      showToast(message);
    }

    // Reset fields & raw outcomes to clear space for the next import
    setFormData({
      name1: '',
      name2: '',
      name3: '',
      usage: '',
      description: '',
      obtain: '',
      obtain1: '',
      obtain2: '',
      obtain3: '',
      quality: '',
      gridSize: ''
    });
    handleClearImage();
    setRawOcrText('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name1: '',
      name2: '',
      name3: '',
      usage: '',
      description: '',
      obtain: '',
      obtain1: '',
      obtain2: '',
      obtain3: '',
      quality: '',
      gridSize: ''
    });
    setRawOcrText('');
    showToast('已取消本次家具数据编辑');
  };

  return {
    handleSaveBatch,
    handleCancelEdit
  };
};
