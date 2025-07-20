'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
}

interface ModalHeaderProps {
  children: React.ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
}

interface ModalContentProps {
  children: React.ReactNode;
}

interface ModalFooterProps {
  children: React.ReactNode;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/40',
        isOpen ? 'block' : 'hidden'
      )}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          "relative w-full bg-gray-800 rounded-lg shadow-2xl border border-gray-700",
          "transform transition-all duration-200 ease-out",
          sizes[size]
        )}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

const ModalHeader = ({ children, onClose, showCloseButton = true }: ModalHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
      <div className="text-lg font-semibold text-white">
        {children}
      </div>
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 text-gray-400 hover:text-white" />
        </button>
      )}
    </div>
  );
};

const ModalContent = ({ children }: ModalContentProps) => {
  return (
    <div className="px-6 py-4">
      {children}
    </div>
  );
};

const ModalFooter = ({ children }: ModalFooterProps) => {
  return (
    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-700 bg-gray-750">
      {children}
    </div>
  );
};

export { Modal, ModalHeader, ModalContent, ModalFooter }; 