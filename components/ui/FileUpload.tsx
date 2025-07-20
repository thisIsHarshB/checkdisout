'use client';

import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, File, Image, FileText } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: (file: File) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  multiple?: boolean;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

interface FileWithPreview extends File {
  preview?: string;
}

const FileUpload = ({
  onFileSelect,
  onFileRemove,
  acceptedTypes = ['image/*', 'application/pdf'],
  maxSize = 10, // 10MB default
  multiple = false,
  label,
  helperText,
  error,
  disabled = false,
  className
}: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isValidType) {
      return `File type ${file.type} is not supported`;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    return null;
  }, [acceptedTypes, maxSize]);

  const processFiles = useCallback((files: FileList) => {
    const validFiles: FileWithPreview[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        const fileWithPreview = file as FileWithPreview;
        if (file.type.startsWith('image/')) {
          fileWithPreview.preview = URL.createObjectURL(file);
        }
        validFiles.push(fileWithPreview);
      }
    });

    if (errors.length > 0) {
      console.error('File validation errors:', errors);
      // You could show these errors in a toast or error state
    }

    if (validFiles.length > 0) {
      if (multiple) {
        setSelectedFiles(prev => [...prev, ...validFiles]);
        validFiles.forEach(file => onFileSelect(file));
      } else {
        setSelectedFiles(validFiles);
        onFileSelect(validFiles[0]);
      }
    }
  }, [validateFile, multiple, onFileSelect]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      processFiles(files);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files) {
      processFiles(files);
    }
  }, [processFiles]);

  const handleRemoveFile = (fileToRemove: FileWithPreview) => {
    setSelectedFiles(prev => prev.filter(file => file !== fileToRemove));
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    onFileRemove?.(fileToRemove);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-400" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-400" />;
    }
    return <File className="h-8 w-8 text-gray-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}

      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200",
          "hover:border-gray-500 cursor-pointer",
          isDragOver && "border-blue-500 bg-blue-500/10",
          error && "border-red-500",
          disabled && "opacity-50 cursor-not-allowed",
          selectedFiles.length > 0 ? "border-gray-600" : "border-gray-600"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-300 mb-2">
          {isDragOver ? 'Drop files here' : 'Drag and drop files here, or click to select'}
        </p>
        <p className="text-sm text-gray-400">
          Supported formats: {acceptedTypes.join(', ')} (Max {maxSize}MB)
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={acceptedTypes.join(',')}
        multiple={multiple}
        onChange={handleFileInputChange}
        disabled={disabled}
      />

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="h-10 w-10 object-cover rounded"
                  />
                ) : (
                  getFileIcon(file)
                )}
                <div>
                  <p className="text-sm font-medium text-white">{file.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveFile(file)}
                className="p-1 hover:bg-gray-600 rounded transition-colors"
                disabled={disabled}
              >
                <X className="h-4 w-4 text-gray-400 hover:text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default FileUpload; 