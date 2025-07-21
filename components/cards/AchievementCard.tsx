'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { Achievement } from '@/lib/types'; // NOTE: Assumes this type is updated to include all new fields from your DB
import { Card } from '@/components/ui/Card';
import { DeleteModal } from '@/components/ui/DeleteModal';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
  onEdit?: (id: string, updatedData: Partial<Achievement>) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
  className?: string;
}

const formatEventDate = (startDate: Date, endDate?: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const startStr = new Date(startDate).toLocaleDateString('en-US', options);

  if (endDate) {
    const endStr = new Date(endDate).toLocaleDateString('en-US', options);
    return `${startStr} - ${endStr}`;
  }
  
  return startStr;
};


export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  onEdit,
  onDelete,
  onShare,
  className
}) => {
  
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // Expanded state to include all fields from the database
  const [editedData, setEditedData] = useState({
    title: achievement.title || '',
    position: achievement.position || '',
    eventName: achievement.eventName || '',
    description: achievement.description || '',
    eventDate: new Date(achievement.eventDate).toISOString().split('T')[0],
    eventType: achievement.eventType || 'online',
    isSolo: achievement.isSolo || false,
    tags: achievement.tags || [],
    certificateUrl: achievement.certificateUrl || '',
  });

  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  
  // Style definitions
  const fieldLabelStyle = "block text-sm font-semibold mb-2 text-neutral-300";
  const inputFieldStyle = "w-full bg-[#2a2a2e] rounded-lg px-4 py-2.5 text-white font-semibold shadow-[0_0_12px_rgba(0,255,255,0.25)] focus:outline-none focus:ring-2 focus:ring-cyan-400";
  const displayFieldStyle = "w-full bg-[#2a2a2e] rounded-lg px-4 py-2.5 text-white font-semibold shadow-[0_0_12px_rgba(0,255,255,0.25)] min-h-[46px]";
  const displayTextAreaStyle = "w-full bg-[#2a2a2e] rounded-lg px-4 py-2.5 text-white font-semibold shadow-[0_0_12px_rgba(0,255,255,0.25)] resize-none overflow-hidden block";
  const badgeStyle = "px-3 py-1 text-xs font-semibold rounded-full bg-cyan-400/20 text-cyan-300";
  const tagBadgeStyle = "px-3 py-1 text-xs font-medium rounded-full bg-neutral-700 text-neutral-300";

  useLayoutEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.style.height = 'auto';
      descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
    }
  }, [isEditing, editedData.description]);

  // Updated handler to include Select elements
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditedData(prev => ({...prev, [name]: checked }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const tags = value.split(',').map(tag => tag.trim()).filter(Boolean); // filter Boolean removes empty tags
    setEditedData(prev => ({ ...prev, tags }));
  };

  const handleSave = () => {
    if (onEdit) {
      const dataToSave = {
        ...editedData,
        eventDate: new Date(editedData.eventDate),
        position: editedData.position === '' ? undefined : Number(editedData.position),
      };
      onEdit(achievement.id, dataToSave);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset state to include all original achievement data
    setEditedData({
      title: achievement.title || '',
      position: achievement.position || '',
      eventName: achievement.eventName || '',
      description: achievement.description || '',
      eventDate: new Date(achievement.eventDate).toISOString().split('T')[0],
      eventType: achievement.eventType || 'online',
      isSolo: achievement.isSolo || false,
      tags: achievement.tags || [],
      certificateUrl: achievement.certificateUrl || '',
    });
    setIsEditing(false);
  };

  const handleDeleteConfirm = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(achievement.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting achievement:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper function to render the display view for clarity
  const renderDisplayView = () => (
    <>
      <div className='space-y-4'>
        <div>
            <label className={fieldLabelStyle}>Competition Name</label>
            <div className={displayFieldStyle}>{achievement.title}</div>
        </div>
        <div>
            <label className={fieldLabelStyle}>Position</label>
            <div className={displayFieldStyle}>{achievement.position}</div>
        </div>
        <div>
            <label className={fieldLabelStyle}>Competition Date</label>
            <div className={displayFieldStyle}>{formatEventDate(achievement.eventDate)}</div>
        </div>
        <div>
            <label className={fieldLabelStyle}>Organizing Body</label>
            <div className={displayFieldStyle}>{achievement.eventName || ''}</div>
        </div>
        {achievement.description && (
            <div>
            <label className={fieldLabelStyle}>Description</label>
            <div ref={descriptionRef as unknown as React.RefObject<HTMLDivElement>} className={displayTextAreaStyle}>{achievement.description}</div>
            </div>
        )}
      </div>
      <div className="space-y-4 mt-2">
        <div className="flex flex-wrap items-center gap-4">
          <span className={badgeStyle}>{achievement.eventType}</span>
          <span className={badgeStyle}>{achievement.isSolo ? 'Solo Effort' : 'Team Effort'}</span>
          {achievement.certificateUrl && (
            <a href={achievement.certificateUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg bg-purple-600/90 hover:bg-purple-600 text-white transition-colors">
              View Certificate <ExternalLink size={16} />
            </a>
          )}
        </div>
        {achievement.tags?.length > 0 && (
          <div>
            <label className={fieldLabelStyle}>Tags</label>
            <div className="flex flex-wrap gap-2">
              {achievement.tags.map((tag, index) => <span key={index} className={tagBadgeStyle}>{tag}</span>)}
            </div>
          </div>
        )}
      </div>
    </>
  );

  // Helper function to render the edit view
  const renderEditView = () => (
    <div className='space-y-4'>
      <div>
        <label className={fieldLabelStyle}>Competition Name</label>
        <input type="text" name="title" value={editedData.title} onChange={handleInputChange} className={inputFieldStyle} />
      </div>
      <div>
        <label className={fieldLabelStyle}>Position</label>
        <input type="text" name="position" value={editedData.position} onChange={handleInputChange} className={inputFieldStyle} />
      </div>
      <div>
        <label className={fieldLabelStyle}>Competition Date</label>
        <input type="date" name="eventDate" value={editedData.eventDate} onChange={handleInputChange} className={inputFieldStyle} />
      </div>
      <div>
        <label className={fieldLabelStyle}>Organizing Body</label>
        <input type="text" name="eventName" value={editedData.eventName} onChange={handleInputChange} className={inputFieldStyle} />
      </div>
      <div>
        <label className={fieldLabelStyle}>Description</label>
        <textarea name="description" ref={descriptionRef} value={editedData.description} onChange={handleInputChange} rows={1} className={`${inputFieldStyle} resize-none overflow-hidden`} />
      </div>
      <div>
        <label className={fieldLabelStyle}>Certificate URL</label>
        <input type="text" name="certificateUrl" value={editedData.certificateUrl} onChange={handleInputChange} className={inputFieldStyle} placeholder="https://example.com/certificate.pdf"/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={fieldLabelStyle}>Event Type</label>
          <select name="eventType" value={editedData.eventType} onChange={handleInputChange} className={inputFieldStyle}>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>
        <div className="flex items-center pt-8">
            <input type="checkbox" id={`isSolo-${achievement.id}`} name="isSolo" checked={editedData.isSolo} onChange={handleCheckboxChange} className="h-5 w-5 rounded accent-cyan-400" />
            <label htmlFor={`isSolo-${achievement.id}`} className="ml-2 text-neutral-300 select-none">Solo Effort</label>
        </div>
      </div>
      <div>
          <label className={fieldLabelStyle}>Tags (comma-separated)</label>
          <input type="text" name="tags" value={editedData.tags.join(', ')} onChange={handleTagsChange} className={inputFieldStyle} placeholder="Web Dev, Hackathon, ..."/>
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
            <button className="flex-1 text-white font-bold py-2.5 rounded-lg transition-all bg-red-600/90 hover:bg-red-600 shadow-[0_0_12px_rgba(239,68,68,0.7)] hover:shadow-[0_0_18px_rgba(239,68,68,0.9)]" onClick={() => setShowDeleteModal(true)}>Delete</button>
            <button className="flex-1 text-black font-bold py-2.5 rounded-lg transition-all bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)] hover:shadow-[0_0_18px_rgba(34,211,238,1)]" onClick={() => setIsEditing(true)}>Edit</button>
            <button className="flex-1 text-white font-bold py-2.5 rounded-lg transition-all bg-purple-600/90 hover:bg-purple-600 shadow-[0_0_12px_rgba(147,51,234,0.7)] hover:shadow-[0_0_18px_rgba(147,51,234,0.9)]" onClick={() => onShare && onShare(achievement.id)}>Share</button>
          </>
        )}
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Achievement"
        message="Are you sure you want to delete this achievement"
        itemName={achievement.title}
        isLoading={isDeleting}
      />
    </Card>
  );
};