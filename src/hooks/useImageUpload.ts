import { useState } from 'react';

export const useImageUpload = () => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [batchFiles, setBatchFiles] = useState<File[]>([]);

  const handleImageChange = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageSrc(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImageSrc('');
  };

  const handleBatchFilesChange = (files: File[]) => {
    setBatchFiles(files);
  };

  const handleRemoveBatchFile = (index: number) => {
    setBatchFiles(prev => prev.filter((_, i) => i !== index));
  };

  return {
    imageSrc,
    imageFile,
    batchFiles,
    handleImageChange,
    handleClearImage,
    handleBatchFilesChange,
    handleRemoveBatchFile,
    setBatchFiles
  };
};
