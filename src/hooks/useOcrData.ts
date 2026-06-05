import { useState } from 'react';
import { OcrFormData } from '../types';

export const useOcrData = () => {
  const [rawOcrText, setRawOcrText] = useState('');
  const [ocrLoading, setOcrLoading] = useState(false);
  const [formData, setFormData] = useState<OcrFormData>({
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

  const resetFormData = () => {
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
  };

  return {
    rawOcrText,
    setRawOcrText,
    ocrLoading,
    setOcrLoading,
    formData,
    setFormData,
    resetFormData
  };
};
