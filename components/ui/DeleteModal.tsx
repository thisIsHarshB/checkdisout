'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import Button from './Button';
import { Trash2, AlertTriangle } from 'lucide-react';

const Modal = dynamic(() => import('./Modal').then(mod => mod.Modal || mod.default), { ssr: false });

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  loading = false,
  title = 'Delete',
  description = 'Are you sure you want to delete this item? This action cannot be undone.'
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
        <Trash2 className="h-6 w-6 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-center text-foreground">{title}</h3>
      <p className="text-sm text-center text-muted-foreground">{description}</p>
      <div className="flex gap-2 mt-4">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onDelete} loading={loading}>
          Delete
        </Button>
      </div>
    </div>
  </Modal>
); 