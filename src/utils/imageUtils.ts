// Helper utility: Base64 converter
export const getBase64FromImageUrl = (imageSrc: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!imageSrc) {
      reject(new Error('No image loaded'));
      return;
    }
    // If it is already base64, return pure base64 code block
    if (imageSrc.startsWith('data:image/')) {
      resolve(imageSrc.split(',')[1]);
      return;
    }

    // Fallback: draw image onto invisible canvas helper
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg').split(',')[1]);
      } else {
        reject(new Error('Failed to get 2D canvas context'));
      }
    };
    img.onerror = () => reject(new Error('Failed to render base64 image'));
    img.src = imageSrc;
  });
};

// 从文件读取 base64
export const getBase64FromFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const dataUrl = e.target.result as string;
        resolve(dataUrl.split(',')[1]);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsDataURL(file);
  });
};
