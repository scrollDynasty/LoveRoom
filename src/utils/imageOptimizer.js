export const optimizeImage = async (file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) => {
    if (!file.type.startsWith('image/')) {
      return file;
    }
  
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
  
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
  
          let width = img.width;
          let height = img.height;
  
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
  
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
  
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
  
          canvas.toBlob(
            (blob) => {
              const optimizedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(optimizedFile);
            },
            'image/jpeg',
            quality
          );
        };
      };
    });
  };
  
  export const createThumbnail = async (file, maxWidth = 300, maxHeight = 300) => {
    if (!file.type.startsWith('image/')) {
      return null;
    }
  
    const optimizedFile = await optimizeImage(file, maxWidth, maxHeight, 0.7);
    return optimizedFile;
  };