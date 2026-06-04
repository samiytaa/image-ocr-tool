import { useState } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ 
    message: '', 
    show: false 
  });

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => {
      setToast({ message: '', show: false });
    }, 4000);
  };

  return {
    toast,
    showToast
  };
};
