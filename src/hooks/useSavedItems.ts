import { useState, useEffect } from 'react';
import { SavedOcrItem, OcrFormData } from '../types';

export const useSavedItems = () => {
  const [savedItems, setSavedItems] = useState<SavedOcrItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // 加载保存的项目
  useEffect(() => {
    const savedBatch = localStorage.getItem('savedOcrItems');
    if (savedBatch) {
      try {
        setSavedItems(JSON.parse(savedBatch));
      } catch (e) {
        console.error('Failed to load savedOcrItems:', e);
      }
    }
  }, []);

  const saveItems = (items: SavedOcrItem[]) => {
    setSavedItems(items);
    localStorage.setItem('savedOcrItems', JSON.stringify(items));
  };

  const addItem = (formData: OcrFormData): string => {
    const getCurrentPrefix = (name: string) => {
      const parts = name.split('·');
      return parts.length > 1 ? parts[0] : name;
    };

    const currentPrefix = getCurrentPrefix(formData.name1 || formData.name2 || formData.name3);
    
    const existingIndex = savedItems.findIndex(item => {
      const itemPrefix = getCurrentPrefix(item.formData.name1 || item.formData.name2 || item.formData.name3);
      return itemPrefix === currentPrefix;
    });

    let updated: SavedOcrItem[];
    let message: string;
    
    if (existingIndex !== -1) {
      updated = savedItems.map((item, index) => {
        if (index === existingIndex) {
          return {
            ...item,
            formData: { ...formData },
            timestamp: Date.now()
          };
        }
        return item;
      });
      message = `已覆盖重名家具"${currentPrefix}"的条目`;
    } else {
      const newItem: SavedOcrItem = {
        id: Date.now().toString(),
        formData: { ...formData },
        timestamp: Date.now()
      };
      updated = [...savedItems, newItem];
      message = '家具属性已成功并入暂存列表';
    }
    
    saveItems(updated);
    return message;
  };

  const updateItem = (id: string, formData: OcrFormData): void => {
    const updated = savedItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          formData: { ...formData }
        };
      }
      return item;
    });
    saveItems(updated);
  };

  const deleteItem = (id: string): void => {
    const remaining = savedItems.filter(item => item.id !== id);
    saveItems(remaining);
  };

  const clearAllItems = (): void => {
    setSavedItems([]);
    localStorage.removeItem('savedOcrItems');
  };

  return {
    savedItems,
    setSavedItems,
    editingId,
    setEditingId,
    addItem,
    updateItem,
    deleteItem,
    clearAllItems
  };
};
