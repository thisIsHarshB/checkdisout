'use client';

import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import Button from './Button';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#23272a] rounded-xl p-6 w-full max-w-md mx-4 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-[#00fff7]/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-[#7fffd4]">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#00fff7]/10 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5 text-[#bafffa]" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-[#bafffa] leading-relaxed">
            {message}
            {itemName && (
              <span className="font-semibold text-[#7fffd4]"> "{itemName}"</span>
            )}
            ?
          </p>
          <p className="text-sm text-[#bafffa]/70 mt-2">
            This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            disabled={isLoading}
            className="flex-1 border-[#00fff7]/30 text-[#00fff7] hover:bg-[#00fff7]/10"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
}; 