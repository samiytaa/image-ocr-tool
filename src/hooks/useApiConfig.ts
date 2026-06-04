import { useState } from 'react';
import { ApiConfig } from '../types';
import { decryptConfig } from '../utils/encryption';

export const useApiConfig = () => {
  const [apiConfig, setApiConfig] = useState<ApiConfig>(() => {
    const defaultConfig = decryptConfig();
    return {
      endpoint: defaultConfig.endpoint,
      apiKey: defaultConfig.apiKey,
      model: defaultConfig.model,
      availableModels: [defaultConfig.model]
    };
  });
  
  const [apiStatus, setApiStatus] = useState({ 
    text: '', 
    isError: false, 
    isSuccess: false 
  });
  
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  const handleSaveApiConfig = () => {
    setApiStatus({ 
      text: '当前使用默认配置（无需保存）', 
      isError: false, 
      isSuccess: true 
    });
    setTimeout(() => {
      setApiStatus({ text: '', isError: false, isSuccess: false });
    }, 3000);
  };

  return {
    apiConfig,
    setApiConfig,
    apiStatus,
    setApiStatus,
    isApiModalOpen,
    setIsApiModalOpen,
    handleSaveApiConfig
  };
};
