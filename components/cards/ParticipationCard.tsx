'use client';

import React, { useState } from 'react';
import { Participation, TeamMember } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DeleteModal } from '@/components/ui/DeleteModal';
import { 
  Users, 
  User, 
  Calendar, 
  Wifi, 
  Globe, 
  Edit, 
  Trash2, 
  Share2, 
  ExternalLink,
  Tag,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ParticipationCardProps {
  participation: Participation;
  onEdit?: (id: string, data: Partial<Participation>) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
  className?: string;
}

export const ParticipationCard: React.FC<ParticipationCardProps> = ({
  participation,
  onEdit,
  onDelete,
  onShare,
  className
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedData, setEditedData] = useState({
    title: participation.title || '',
    eventName: participation.eventName || '',
    description: participation.description || '',
    eventDate: new Date(participation.eventDate).toISOString().split('T')[0],
    eventType: participation.eventType || 'online',
    isSolo: participation.isSolo || false,
    tags: participation.tags || [],
    certificateUrl: participation.certificateUrl || '',
  });

  // Style definitions
  const fieldLabelStyle = "block text-sm font-semibold mb-2 text-neutral-300";
  const inputFieldStyle = "w-full bg-[#2a2a2e] rounded-lg px-4 py-2.5 text-white font-semibold shadow-[0_0_12px_rgba(0,255,255,0.25)] focus:outline-none focus:ring-2 focus:ring-cyan-400";
  const displayFieldStyle = "w-full bg-[#23241e] rounded-lg px-4 py-2.5 text-white font-semibold shadow-[0_0_12px_rgba(0,255,255,0.25)] min-h-[46px]";
  const badgeStyle = "px-3 py-1 text-xs font-semibold rounded-full bg-cyan-400/20 text-cyan-300";
  const tagBadgeStyle = "px-3 py-1 text-xs font-medium rounded-full bg-neutral-700 text-neutral-300";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditedData(prev => ({ ...prev, [name]: checked }));
  };
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
    setEditedData(prev => ({ ...prev, tags }));
  };
  const handleSave = () => {
    if (onEdit) {
      const dataToSave = {
        ...editedData,
        eventDate: new Date(editedData.eventDate),
      };
      onEdit(participation.id, dataToSave);
    }
    setIsEditing(false);
  };
  const handleCancel = () => {
    setEditedData({
      title: participation.title || '',
      eventName: participation.eventName || '',
      description: participation.description || '',
      eventDate: new Date(participation.eventDate).toISOString().split('T')[0],
      eventType: participation.eventType || 'online',
      isSolo: participation.isSolo || false,
      tags: participation.tags || [],
      certificateUrl: participation.certificateUrl || '',
    });
    setIsEditing(false);
  };

  const handleDeleteConfirm = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(participation.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting participation:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: participation.title,
          text: participation.description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const text = `${participation.title}\n${participation.description}\n${participation.eventName}`;
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    }
  };

  const renderDisplayView = () => (
    <>
      <div className='space-y-4'>
        <div>
          <label className={fieldLabelStyle}>Participation Title</label>
          <div className={displayFieldStyle}>{participation.title}</div>
        </div>
        <div>
          <label className={fieldLabelStyle}>Event Name</label>
          <div className={displayFieldStyle}>{participation.eventName}</div>
        </div>
        <div>
          <label className={fieldLabelStyle}>Event Date</label>
          <div className={displayFieldStyle}>{formatDate(participation.eventDate)}</div>
        </div>
        <div>
          <label className={fieldLabelStyle}>Event Type</label>
          <div className={displayFieldStyle}>{participation.eventType.charAt(0).toUpperCase() + participation.eventType.slice(1)}</div>
        </div>
        <div>
          <label className={fieldLabelStyle}>Description</label>
          <div className={displayFieldStyle}>{participation.description}</div>
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <span className={badgeStyle}>{participation.eventType}</span>
          <span className={badgeStyle}>{participation.isSolo ? 'Solo Effort' : 'Team Effort'}</span>
          {participation.certificateUrl && (
            <a href={participation.certificateUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg bg-purple-600/90 hover:bg-purple-600 text-white transition-colors">
              View Certificate <ExternalLink size={16} />
            </a>
          )}
        </div>
        {participation.tags?.length > 0 && (
          <div>
            <label className={fieldLabelStyle}>Tags</label>
            <div className="flex flex-wrap gap-2">
              {participation.tags.map((tag, index) => <span key={index} className={tagBadgeStyle}>{tag}</span>)}
            </div>
          </div>
        )}
      </div>
    </>
  );

  const renderEditView = () => (
    <div className='space-y-4'>
      <div>
        <label className={fieldLabelStyle}>Participation Title</label>
        <input type="text" name="title" value={editedData.title} onChange={handleInputChange} className={inputFieldStyle} />
      </div>
      <div>
        <label className={fieldLabelStyle}>Event Name</label>
        <input type="text" name="eventName" value={editedData.eventName} onChange={handleInputChange} className={inputFieldStyle} />
      </div>
      <div>
        <label className={fieldLabelStyle}>Event Date</label>
        <input type="date" name="eventDate" value={editedData.eventDate} onChange={handleInputChange} className={inputFieldStyle} />
      </div>
      <div>
        <label className={fieldLabelStyle}>Event Type</label>
        <select name="eventType" value={editedData.eventType} onChange={handleInputChange} className={inputFieldStyle}>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>
      <div>
        <label className={fieldLabelStyle}>Description</label>
        <textarea name="description" value={editedData.description} onChange={handleInputChange} rows={2} className={inputFieldStyle} />
      </div>
      <div>
        <label className={fieldLabelStyle}>Certificate URL</label>
        <input type="text" name="certificateUrl" value={editedData.certificateUrl} onChange={handleInputChange} className={inputFieldStyle} placeholder="https://example.com/certificate.pdf"/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center pt-8">
          <input type="checkbox" id={`isSolo-${participation.id}`} name="isSolo" checked={editedData.isSolo} onChange={handleCheckboxChange} className="h-5 w-5 rounded accent-cyan-400" />
          <label htmlFor={`isSolo-${participation.id}`} className="ml-2 text-neutral-300 select-none">Solo Effort</label>
        </div>
      </div>
      <div>
        <label className={fieldLabelStyle}>Tags (comma-separated)</label>
        <input type="text" name="tags" value={editedData.tags.join(', ')} onChange={handleTagsChange} className={inputFieldStyle} placeholder="Workshop, Conference, ..."/>
      </div>
    </div>
  );

  return (
    <Card className={cn("p-6 bg-[#1a1a1a] border-none rounded-xl shadow-[0_0_25px_rgba(0,255,255,0.1)] flex flex-col gap-4", className)}>
      {isEditing ? renderEditView() : renderDisplayView()}
      <div className="flex gap-4 mt-4">
        {isEditing ? (
          <>
            <button className="flex-1 text-white font-bold py-2.5 rounded-lg transition-all bg-neutral-600/90 hover:bg-neutral-600 shadow-lg" onClick={handleCancel}>Cancel</button>
            <button className="flex-1 text-black font-bold py-2.5 rounded-lg transition-all bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)] hover:shadow-[0_0_18px_rgba(34,211,238,1)]" onClick={handleSave}>Save</button>
          </>
        ) : (
          <>
            <button className="flex-1 text-white font-bold py-2.5 rounded-lg transition-all bg-red-600/90 hover:bg-red-600 shadow-[0_0_12px_rgba(239,68,68,0.7)] hover:shadow-[0_0_18px_rgba(239,68,68,0.9)]" onClick={() => onDelete && onDelete(participation.id)}>Delete</button>
            <button className="flex-1 text-black font-bold py-2.5 rounded-lg transition-all bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)] hover:shadow-[0_0_18px_rgba(34,211,238,1)]" onClick={() => setIsEditing(true)}>Edit</button>
            <button className="flex-1 text-white font-bold py-2.5 rounded-lg transition-all bg-purple-600/90 hover:bg-purple-600 shadow-[0_0_12px_rgba(147,51,234,0.7)] hover:shadow-[0_0_18px_rgba(147,51,234,0.9)]" onClick={() => onShare && onShare(participation.id)}>Share</button>
          </>
        )}
      </div>
    </Card>
  );
}; 

