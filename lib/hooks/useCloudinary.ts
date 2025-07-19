import { useState } from 'react';
import { uploadImage, uploadDocument, deleteFile, UploadResult } from '../cloudinary/upload';

export const useCloudinary = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadProfileImage = async (file: File): Promise<UploadResult> => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const result = await uploadImage(file, 'checkdisout/profile-pictures');
      setUploadProgress(100);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadProjectBanner = async (file: File): Promise<UploadResult> => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const result = await uploadImage(file, 'checkdisout/project-banners');
      setUploadProgress(100);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadCertificate = async (file: File): Promise<UploadResult> => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const result = await uploadDocument(file, 'checkdisout/certificates');
      setUploadProgress(100);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = async (public_id: string): Promise<void> => {
    try {
      await deleteFile(public_id);
    } catch (error) {
      throw error;
    }
  };

  return {
    uploadProfileImage,
    uploadProjectBanner,
    uploadCertificate,
    removeFile,
    isUploading,
    uploadProgress,
  };
}; 