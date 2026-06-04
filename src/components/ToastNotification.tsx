import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ToastNotificationProps {
  message: string;
  show: boolean;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ message, show }) => {
  if (!show) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-[#fbfaf5] border-2 border-[#ebdcae] px-3 py-2 rounded-lg shadow-xl flex items-center gap-1.5 text-xs font-bold text-[#1a1816] tracking-wide animate-fade-in ring-1 ring-stone-900/10">
      <CheckCircle className="w-3.5 h-3.5 text-[#1d4436]" />
      <span>{message}</span>
    </div>
  );
};
