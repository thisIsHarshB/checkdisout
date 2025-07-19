import cloudinary from './config';

export interface UploadResult {
  url: string;
  public_id: string;
  secure_url: string;
}

export const uploadImage = async (file: File, folder: string = 'checkdisout'): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  formData.append('folder', folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const result = await response.json();
  return {
    url: result.secure_url,
    public_id: result.public_id,
    secure_url: result.secure_url,
  };
};

export const uploadDocument = async (file: File, folder: string = 'checkdisout/documents'): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  formData.append('folder', folder);
  formData.append('resource_type', 'raw');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const result = await response.json();
  return {
    url: result.secure_url,
    public_id: result.public_id,
    secure_url: result.secure_url,
  };
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
    throw new Error('Delete failed');
  }
}; 