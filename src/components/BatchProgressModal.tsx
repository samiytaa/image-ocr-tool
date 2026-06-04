import React from 'react';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { BatchProgressState } from '../hooks/useBatchProgress';

interface BatchProgressModalProps {
  batchProgress: BatchProgressState;
}

export const BatchProgressModal: React.FC<BatchProgressModalProps> = ({ batchProgress }) => {
  if (!batchProgress.isProcessing) return null;

  const progressPercentage = Math.round((batchProgress.current / batchProgress.total) * 100);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 border-2 border-[#ebdcae]">
        <div className="space-y-4">
          {/* 标题 */}
          <div className="flex items-center gap-2 text-[#2b2621]">
            <Loader2 className="w-5 h-5 animate-spin text-[#9e2a2b]" />
            <h3 className="font-heading font-black text-base">批量处理中...</h3>
          </div>

          {/* 进度信息 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-stone-600 font-medium">
                正在处理: {batchProgress.current} / {batchProgress.total}
              </span>
              <span className="text-stone-600 font-bold">
                {progressPercentage}%
              </span>
            </div>

            {/* 进度条 */}
            <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#1d4436] to-[#2d6550] transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* 当前文件名 */}
            <p className="text-xs text-stone-500 truncate">
              当前文件: {batchProgress.currentFileName}
            </p>

            {/* 成功/失败统计 */}
            <div className="flex gap-4 text-xs pt-2 border-t border-stone-200">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                <span className="text-stone-600">成功: <strong className="text-green-600">{batchProgress.successCount}</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-stone-600">失败: <strong className="text-orange-600">{batchProgress.failCount}</strong></span>
              </div>
            </div>
          </div>

          {/* 提示信息 */}
          <p className="text-xs text-stone-400 text-center pt-2">
            请勿关闭页面，处理完成后会自动关闭此窗口
          </p>
        </div>
      </div>
    </div>
  );
};
