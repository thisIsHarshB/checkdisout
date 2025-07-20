import { useState } from 'react';
import { 
  uploadImage, 
  uploadDocument as uploadDocumentToCloudinary, 
  uploadCertificate as uploadCertificateToCloudinary,
  deleteFile, 
  UploadResult, 
  UploadProgress,
  validateImage,
  validateDocument,
  validateCertificate,
  FileValidation
} from '../cloudinary/upload';

export const useCloudinary = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const handleProgress = (progress: UploadProgress) => {
    setUploadProgress(progress);
  };

  const resetState = () => {
    setIsUploading(false);
    setError(null);
    setUploadProgress({ loaded: 0, total: 0, percentage: 0 });
  };

  const uploadProfileImage = async (file: File): Promise<UploadResult> => {
    setIsUploading(true);
    setError(null);
    
    try {
      const result = await uploadImage(file, 'checkdisout/profile-pictures', handleProgress);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setError(errorMessage);
      throw error;
    } finally {
      resetState();
    }
  };

  const uploadProjectBanner = async (file: File): Promise<UploadResult> => {
    setIsUploading(true);
    setError(null);
    
    try {
      const result = await uploadImage(file, 'checkdisout/project-banners', handleProgress);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setError(errorMessage);
      throw error;
    } finally {
      resetState();
    }
  };

  const uploadCertificate = async (file: File): Promise<UploadResult> => {
    setIsUploading(true);
    setError(null);
    
    try {
      const result = await uploadCertificateToCloudinary(file, 'checkdisout/certificates', handleProgress);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setError(errorMessage);
      throw error;
    } finally {
      resetState();
    }
  };

  const uploadDocument = async (file: File): Promise<UploadResult> => {
    setIsUploading(true);
    setError(null);
    
    try {
      const result = await uploadDocumentToCloudinary(file, 'checkdisout/documents', handleProgress);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setError(errorMessage);
      throw error;
    } finally {
      resetState();
    }
  };

  const removeFile = async (public_id: string): Promise<void> => {
    setError(null);
    try {
      await deleteFile(public_id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Delete failed';
      setError(errorMessage);
      throw error;
    }
  };

  // Validation functions
  const validateImageFile = (file: File): FileValidation => {
    return validateImage(file);
  };

  const validateDocumentFile = (file: File): FileValidation => {
    return validateDocument(file);
  };

  const validateCertificateFile = (file: File): FileValidation => {
    return validateCertificate(file);
  };

  return {
    uploadProfileImage,
    uploadProjectBanner,
    uploadCertificate,
    uploadDocument,
    removeFile,
    validateImageFile,
    validateDocumentFile,
    validateCertificateFile,
    isUploading,
    uploadProgress,
    error,
  };
}; 