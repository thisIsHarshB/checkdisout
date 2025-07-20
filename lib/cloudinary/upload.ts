import cloudinary from './config';

export interface UploadResult {
  url: string;
  public_id: string;
  secure_url: string;
  format?: string;
  size?: number;
  width?: number;
  height?: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileValidation {
  isValid: boolean;
  error?: string;
}

// File validation constants
export const FILE_LIMITS = {
  IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  },
  DOCUMENT: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  CERTIFICATE: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
  },
};

// File validation functions
export const validateImage = (file: File): FileValidation => {
  if (!FILE_LIMITS.IMAGE.ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${FILE_LIMITS.IMAGE.ALLOWED_TYPES.join(', ')}`,
    };
  }

  if (file.size > FILE_LIMITS.IMAGE.MAX_SIZE) {
    return {
      isValid: false,
      error: `File size too large. Maximum size: ${FILE_LIMITS.IMAGE.MAX_SIZE / (1024 * 1024)}MB`,
    };
  }

  return { isValid: true };
};

export const validateDocument = (file: File): FileValidation => {
  if (!FILE_LIMITS.DOCUMENT.ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${FILE_LIMITS.DOCUMENT.ALLOWED_TYPES.join(', ')}`,
    };
  }

  if (file.size > FILE_LIMITS.DOCUMENT.MAX_SIZE) {
    return {
      isValid: false,
      error: `File size too large. Maximum size: ${FILE_LIMITS.DOCUMENT.MAX_SIZE / (1024 * 1024)}MB`,
    };
  }

  return { isValid: true };
};

export const validateCertificate = (file: File): FileValidation => {
  if (!FILE_LIMITS.CERTIFICATE.ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${FILE_LIMITS.CERTIFICATE.ALLOWED_TYPES.join(', ')}`,
    };
  }

  if (file.size > FILE_LIMITS.CERTIFICATE.MAX_SIZE) {
    return {
      isValid: false,
      error: `File size too large. Maximum size: ${FILE_LIMITS.CERTIFICATE.MAX_SIZE / (1024 * 1024)}MB`,
    };
  }

  return { isValid: true };
};

async function compressImage(file: File, quality = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Failed to get canvas context'));
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Compression failed'));
          resolve(new File([blob], file.name, { type: file.type }));
        },
        file.type,
        quality
      );
    };
    img.onerror = reject;
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const uploadImage = async (
  file: File, 
  folder: string = 'checkdisout',
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  // Validate file
  const validation = validateImage(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Compress image before upload
  let uploadFile = file;
  if (file.type === 'image/jpeg' || file.type === 'image/png') {
    uploadFile = await compressImage(file, 0.8);
  }

  const formData = new FormData();
  formData.append('file', uploadFile);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  formData.append('folder', folder);

  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress: UploadProgress = {
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        };
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const result = JSON.parse(xhr.responseText);
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            secure_url: result.secure_url,
            format: result.format,
            size: result.bytes,
            width: result.width,
            height: result.height,
          });
        } catch (error) {
          reject(new Error('Failed to parse upload response'));
        }
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed due to network error'));
    });

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  });
};

export const uploadDocument = async (
  file: File, 
  folder: string = 'checkdisout/documents',
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  // Validate file
  const validation = validateDocument(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  formData.append('folder', folder);
  formData.append('resource_type', 'raw');

  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress: UploadProgress = {
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        };
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const result = JSON.parse(xhr.responseText);
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            secure_url: result.secure_url,
            format: result.format,
            size: result.bytes,
          });
        } catch (error) {
          reject(new Error('Failed to parse upload response'));
        }
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed due to network error'));
    });

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`);
    xhr.send(formData);
  });
};

export const uploadCertificate = async (
  file: File, 
  folder: string = 'checkdisout/certificates',
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  // Validate file
  const validation = validateCertificate(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Determine if it's an image or document
  const isImage = file.type.startsWith('image/');
  let uploadFile = file;
  if (isImage && (file.type === 'image/jpeg' || file.type === 'image/png')) {
    uploadFile = await compressImage(file, 0.8);
  }
  const resourceType = isImage ? 'image' : 'raw';
  const endpoint = isImage ? 'image/upload' : 'raw/upload';

  const formData = new FormData();
  formData.append('file', uploadFile);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  formData.append('folder', folder);
  if (!isImage) {
    formData.append('resource_type', 'raw');
  }

  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress: UploadProgress = {
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        };
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const result = JSON.parse(xhr.responseText);
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            secure_url: result.secure_url,
            format: result.format,
            size: result.bytes,
            width: result.width,
            height: result.height,
          });
        } catch (error) {
          reject(new Error('Failed to parse upload response'));
        }
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed due to network error'));
    });

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${endpoint}`);
    xhr.send(formData);
  });
};

export const deleteFile = async (public_id: string): Promise<void> => {
  const response = await fetch('/api/cloudinary/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ public_id }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Delete failed');
  }
};

// Utility function to get file size in human readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}; 