import React from 'react';
import { Settings, Heart } from 'lucide-react';
import { ApiConfig } from '../types';

interface AppHeaderProps {
  apiConfig: ApiConfig;
  batchProgressIsProcessing: boolean;
  onSettingsClick: () => void;
  onAppreciationClick: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  apiConfig,
  batchProgressIsProcessing,
  onSettingsClick,
  onAppreciationClick
}) => {
  const isApiConfigured = !!(apiConfig.apiKey && apiConfig.endpoint && apiConfig.model);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#f5efe3] border-b border-[#ebdcae] shadow-sm">
      <div className="max-w-[1240px] w-full mx-auto px-3 sm:px-4 lg:px-6 py-2 flex flex-row items-center justify-between gap-1.5">
        <div className="text-left flex-1 min-w-0">
          <h1 className="font-heading font-black text-[#2b2621] text-base sm:text-lg tracking-wide flex items-center gap-1.5">
            <span className="p-1 bg-[#9e2a2b] text-[#fbfaf5] rounded-md shadow-xs shrink-0 font-serif text-xs">
              鸢
            </span>
            <span className="truncate">
              WIKI家具录入工具
            </span>
          </h1>
        </div>
        
        {/* Header Controls area containing continuous status badges & config trigger */}
        <div className={`flex items-center gap-1.5 shrink-0 ${batchProgressIsProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
          {/* 赞赏按钮 */}
          <button
            type="button"
            onClick={onAppreciationClick}
            className="flex items-center justify-center p-1.5 rounded-md font-bold cursor-pointer shadow-xs transition-all active:scale-95 bg-gradient-to-br from-[#fcdcd3] to-[#f5b3a4] hover:from-[#fac8bb] hover:to-[#f5a190] border border-[#f5b3a4]"
            title="助力开发者 - 感谢您的支持"
          >
            <Heart 
              className="w-3.5 h-3.5 stroke-[2.5] text-[#9e2a2b] fill-[#9e2a2b]/20"
            />
          </button>
          
          {/* API配置按钮 - 已隐藏 */}
          <button
            id="apiConfigBtn"
            type="button"
            onClick={onSettingsClick}
            className={`hidden flex items-center justify-center p-1.5 rounded-md font-bold cursor-pointer shadow-xs transition-all active:scale-95 ${
              isApiConfigured
                ? 'bg-[#e2f0d9] hover:bg-[#d4e7c5] border border-[#c3e0b2]'
                : 'bg-[#fcdcd3] hover:bg-[#fac8bb] border border-[#f5b3a4]'
            }`}
            title={
              isApiConfigured
                ? 'API 接口已连通 - 点击修改配置'
                : '需配置 API 参数 - 点击设置'
            }
          >
            <Settings 
              className={`w-3.5 h-3.5 stroke-[2.5] ${
                isApiConfigured
                  ? 'text-[#1d4436]'
                  : 'text-[#9e2a2b]'
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
