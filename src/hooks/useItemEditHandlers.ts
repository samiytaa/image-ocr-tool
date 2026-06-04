import { SavedOcrItem, OcrFormData } from '../types';

interface UseItemEditHandlersProps {
  setEditingId: (id: string | null) => void;
  setFormData: (data: OcrFormData) => void;
  setRawOcrText: (text: string) => void;
  deleteItem: (id: string) => void;
  clearAllItems: () => void;
  showToast: (message: string) => void;
  editingId: string | null;
}

export const useItemEditHandlers = ({
  setEditingId,
  setFormData,
  setRawOcrText,
  deleteItem,
  clearAllItems,
  showToast,
  editingId
}: UseItemEditHandlersProps) => {
  const handleEditItem = (item: SavedOcrItem) => {
    setEditingId(item.id);
    setFormData({ ...item.formData });
    setRawOcrText(`正在编辑暂存家具记录："${item.formData.name1.split('·')[0]}"\n属性校正完成后，点击下方"更新暂存条目"即可保存。`);
    
    // Scroll smoothly to results curation zone
    const targetElement = document.getElementById('ocrTextOutput') || document.body;
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleDeleteItem = (id: string) => {
    deleteItem(id);
    showToast('该家具暂存已移出');
    
    if (editingId === id) {
      setEditingId(null);
      setFormData({
        name1: '',
        name2: '',
        name3: '',
        usage: '',
        description: '',
        obtain: '',
        quality: '',
        gridSize: ''
      });
    }
  };

  const handleClearAllItems = () => {
    clearAllItems();
    setEditingId(null);
    showToast('暂存列表已清空，现在可以开始全新的一轮录入。');
  };

  return {
    handleEditItem,
    handleDeleteItem,
    handleClearAllItems
  };
};
