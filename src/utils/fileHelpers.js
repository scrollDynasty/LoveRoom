export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };
  
  export const getFileType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const videoTypes = ['mp4', 'webm', 'ogg'];
    const documentTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'];
  
    if (imageTypes.includes(extension)) return 'image';
    if (videoTypes.includes(extension)) return 'video';
    if (documentTypes.includes(extension)) return 'document';
    return 'other';
  };
  
  export const validateFile = (file) => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'video/webm',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
  
    if (file.size > maxSize) {
      throw new Error('File size exceeds 100MB limit');
    }
  
    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not supported');
    }
  
    return true;
  };