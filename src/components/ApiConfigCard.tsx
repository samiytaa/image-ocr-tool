import React, { useState } from 'react';
import { Settings, Eye, EyeOff, Globe, Key, Sliders, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { ApiConfig } from '../types';

interface ApiConfigCardProps {
  config: ApiConfig;
  onConfigChange: (newConfig: ApiConfig) => void;
  onSave: () => void;
  status: { text: string; isError: boolean; isSuccess: boolean };
  setStatus: React.Dispatch<React.SetStateAction<{ text: string; isError: boolean; isSuccess: boolean }>>;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApiConfigCard({
  config,
  onConfigChange,
  onSave,
  status,
  setStatus,
  isOpen,
  onClose
}: ApiConfigCardProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [fetching, setFetching] = useState(false);

  if (!isOpen) return null;

  // Fetch models from OpenAI-compatible endpoint
  const fetchModels = async () => {
    if (!config.endpoint) {
      alert('请先输入 API 端点');
      return;
    }
    if (!config.apiKey) {
      alert('请先输入 API Key');
      return;
    }

    setFetching(true);
    setStatus({ text: '正在拉取模型列表...', isError: false, isSuccess: false });

    try {
      // Build OpenAI models URL
      const cleanEndpoint = config.endpoint.replace(/\/$/, '');
      const modelsUrl = `${cleanEndpoint}/models`;

      const response = await fetch(modelsUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      let modelsList: string[] = [];
      if (data.data && Array.isArray(data.data)) {
        modelsList = data.data
          .map((m: any) => m.id || m.name)
          .filter((m: string) => m);
      } else if (Array.isArray(data)) {
        modelsList = data.map((m: any) => m.id || m.name || m).filter((m: string) => m);
      } else {
        throw new Error('无法解析模型列表格式');
      }

      if (modelsList.length === 0) {
        throw new Error('未找到可用模型');
      }

      // Filter vision models as in original script
      const visionModels = modelsList.filter((m: string) =>
        m.toLowerCase().includes('vision') ||
        m.toLowerCase().includes('gpt-4') ||
        m.toLowerCase().includes('claude') ||
        m.toLowerCase().includes('gemini')
      );

      const finalModels = visionModels.length > 0 ? visionModels : modelsList;

      onConfigChange({
        ...config,
        availableModels: finalModels,
        model: finalModels[0] || ''
      });

      setStatus({
        text: `成功拉取 ${finalModels.length} 个模型`,
        isError: false,
        isSuccess: true
      });

      setTimeout(() => {
        setStatus({ text: '', isError: false, isSuccess: false });
      }, 3000);

    } catch (err: any) {
      console.error('Fetch models error:', err);
      setStatus({
        text: `拉取模型失败: ${err.message}`,
        isError: true,
        isSuccess: false
      });
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs transition-opacity duration-300">
      {/* Click backdrop to exit */}
      <div 
        className="absolute inset-0 cursor-default bg-transparent" 
        onClick={onClose} 
      />
      
      {/* Modal Dialog Content Container: Styled like Chinese classical bamboo scroll/box */}
      <div className="relative bg-[#fdfbf6] border-2 border-[#ebdcae] rounded-md shadow-2xl w-full max-w-lg overflow-hidden transition-all duration-300 transform scale-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Header: Ancient Cinnabar-Red & Ink Accents */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#f4ebd0] border-b border-[#ebdcae]">
          <div className="flex items-center gap-2">
            <Settings className="w-4.5 h-4.5 text-[#9e2a2b] shrink-0" />
            <h3 className="font-heading font-black text-[#2b2621] text-sm tracking-wide">
              API 接口配置参数
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-[#9e2a2b] hover:bg-[#ebdcae]/40 rounded-md transition-colors cursor-pointer text-xs font-semibold"
          >
            ✕
          </button>
        </div>

        {/* Modal Body / Inputs Area with Chinese Calligraphic border decorations */}
        <div className="p-6 space-y-4 overflow-y-auto">
          
          {/* API Endpoint Input */}
          <div className="space-y-1">
            <label htmlFor="apiEndpoint" className="block text-xs font-bold text-[#5c4a37] flex items-center gap-1.5 select-none">
              <Globe className="w-3.5 h-3.5 text-[#a8885d]" />
              API端点（默认配置，不可修改）
            </label>
            <input
              type="password"
              id="apiEndpoint"
              className="w-full h-10 px-3.5 bg-stone-100 text-xs text-stone-600 rounded-md border border-[#e2d9c5] cursor-not-allowed font-mono"
              placeholder="https://api.example.com/v1"
              value="****************************************"
              readOnly
              disabled
            />
          </div>

          {/* API Key Input */}
          <div className="space-y-1">
            <label htmlFor="apiKey" className="block text-xs font-bold text-[#5c4a37] flex items-center gap-1.5 select-none">
              <Key className="w-3.5 h-3.5 text-[#a8885d]" />
              API秘钥（默认配置，不可修改）
            </label>
            <div className="relative">
              <input
                type="password"
                id="apiKey"
                className="w-full h-10 pl-3.5 pr-10 bg-stone-100 text-xs text-stone-600 rounded-md border border-[#e2d9c5] cursor-not-allowed font-mono"
                placeholder="请输入您的 API Key"
                value="****************************************"
                readOnly
                disabled
              />
              <button
                type="button"
                disabled
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-stone-300 cursor-not-allowed"
                title="默认配置已加密"
              >
                <EyeOff className="w-4 h-4 text-stone-300" />
              </button>
            </div>
          </div>

          {/* Model Select with compact layout */}
          <div className="space-y-1">
            <label htmlFor="modelSelect" className="block text-xs font-bold text-[#5c4a37] flex items-center gap-1.5 select-none">
              <Sliders className="w-3.5 h-3.5 text-[#a8885d]" />
              模型选择（默认配置，不可修改）
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                id="modelSelect"
                className="flex-1 min-w-0 h-10 px-3 bg-stone-100 text-stone-600 cursor-not-allowed text-xs rounded-md border border-[#e2d9c5] font-mono"
                value="****************************************"
                readOnly
                disabled
              />
              <button
                type="button"
                onClick={fetchModels}
                disabled
                className="h-10 py-2 px-4 bg-stone-100 text-stone-400 cursor-not-allowed font-black text-xs rounded-md flex items-center justify-center gap-1.5 border border-[#e2d9c5] shrink-0"
                title="已使用默认配置"
              >
                <RefreshCw className="w-4 h-4 text-stone-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#fcfaf2]/90 px-6 py-4 border-t border-[#ebdcae] flex items-center justify-between gap-3.5">
          <div className="flex-1 p-2 rounded-md flex items-center gap-1.5 text-xs font-semibold bg-[#e2f0d9] text-[#1d4436] border border-[#c3e0b2]">
            <CheckCircle className="w-3.5 h-3.5 text-[#1d4436] shrink-0" />
            <span className="truncate">当前使用默认配置（无需手动保存）</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 bg-[#9e2a2b] hover:bg-[#802021] text-white font-bold text-xs rounded-md shadow-xs transition-transform flex items-center justify-center gap-1.5 cursor-pointer h-10 active:scale-95"
          >
            关闭
          </button>
        </div>

      </div>
    </div>
  );
}

