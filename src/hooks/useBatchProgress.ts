import { useState } from 'react';

export interface BatchProgressState {
  isProcessing: boolean;
  current: number;
  total: number;
  currentFileName: string;
  successCount: number;
  failCount: number;
}

export const useBatchProgress = () => {
  const [batchProgress, setBatchProgress] = useState<BatchProgressState>({
    isProcessing: false,
    current: 0,
    total: 0,
    currentFileName: '',
    successCount: 0,
    failCount: 0
  });

  const startBatch = (total: number) => {
    setBatchProgress({
      isProcessing: true,
      current: 0,
      total,
      currentFileName: '',
      successCount: 0,
      failCount: 0
    });
  };

  const updateProgress = (current: number, fileName: string) => {
    setBatchProgress(prev => ({
      ...prev,
      current,
      currentFileName: fileName
    }));
  };

  const incrementSuccess = () => {
    setBatchProgress(prev => ({
      ...prev,
      successCount: prev.successCount + 1
    }));
  };

  const incrementFail = () => {
    setBatchProgress(prev => ({
      ...prev,
      failCount: prev.failCount + 1
    }));
  };

  const completeBatch = () => {
    setBatchProgress({
      isProcessing: false,
      current: 0,
      total: 0,
      currentFileName: '',
      successCount: 0,
      failCount: 0
    });
  };

  return {
    batchProgress,
    startBatch,
    updateProgress,
    incrementSuccess,
    incrementFail,
    completeBatch
  };
};
