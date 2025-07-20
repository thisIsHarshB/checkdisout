'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useCloudinary } from '@/lib/hooks/useCloudinary';
import { 
  Users, 
  User, 
  Plus, 
  X, 
  Upload, 
  Calendar,
  Wifi,
  Globe,
  Tag,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ParticipationFormProps {
  initialData?: Partial<Participation>;
  onSubmit: (data: Omit<Participation, 'id' | 'createdAt'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ParticipationForm: React.FC<ParticipationFormProps & { resetOnCancel?: boolean }> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  resetOnCancel = false
}) => {
  const { uploadFile, uploadProgress, isUploading } = useCloudinary();
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    eventName: initialData?.eventName || '',
    eventDate: initialData?.eventDate ? new Date(initialData.eventDate).toISOString().split('T')[0] : '',
    eventType: initialData?.eventType || 'online',
    isSolo: initialData?.isSolo ?? true,
    teamMembers: initialData?.teamMembers || [],
    certificateUrl: initialData?.certificateUrl || '',
    tags: initialData?.tags || [],
    githubUrl: initialData?.githubUrl || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState('');
  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    role: '',
    linkedin: '',
    github: ''
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.eventName.trim()) {
      newErrors.eventName = 'Event name is required';
    }

    if (!formData.eventDate) {
      newErrors.eventDate = 'Event date is required';
    }

    if (!formData.isSolo && formData.teamMembers.length === 0) {
      newErrors.teamMembers = 'At least one team member is required for team participations';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const participationData = {
      ...formData,
      eventDate: new Date(formData.eventDate),
      teamMembers: formData.isSolo ? [] : formData.teamMembers
    };

    try {
      await onSubmit(participationData);
    } catch (error) {
      console.error('Error submitting participation:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const url = await uploadFile(file, 'certificates');
      setFormData(prev => ({ ...prev, certificateUrl: url }));
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addTeamMember = () => {
    if (newTeamMember.name.trim()) {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, { ...newTeamMember }]
      }));
      setNewTeamMember({ name: '', role: '', linkedin: '', github: '' });
    }
  };

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  const handleReset = () => {
    setFormData({
      title: initialData?.title || '',
      description: initialData?.description || '',
      eventName: initialData?.eventName || '',
      eventDate: initialData?.eventDate ? new Date(initialData.eventDate).toISOString().split('T')[0] : '',
      eventType: initialData?.eventType || 'online',
      isSolo: initialData?.isSolo ?? true,
      teamMembers: initialData?.teamMembers || [],
      certificateUrl: initialData?.certificateUrl || '',
      tags: initialData?.tags || [],
      githubUrl: initialData?.githubUrl || ''
    });
    setErrors({});
    setNewTag('');
    setNewTeamMember({ name: '', role: '', linkedin: '', github: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-8 bg-[#181A16] border-none rounded-xl shadow-[0_0_25px_rgba(0,255,255,0.1)]">
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#00fff7]/10 rounded-full flex items-center justify-center">
            <Users className="h-5 w-5 text-[#00fff7]" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-[#7fffd4]" style={{ textShadow: '0 0 10px #7fffd4, 0 0 20px #7fffd4' }}>
            {initialData ? 'Edit Participation' : 'Add New Participation'}
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column */}
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-base font-semibold text-white mb-2">Competition Name *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Attended React Conference 2024"
                className={cn(
                  'w-full min-h-[44px] bg-transparent border-2 border-[#00fff7] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium',
                  errors.title && 'border-destructive'
                )}
              />
              {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-base font-semibold text-white mb-2">Competition Date *</label>
              <Input
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                className={cn('w-full min-h-[44px] bg-transparent border-2 border-[#00fff7] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium', errors.eventDate && 'border-destructive')}
              />
              {errors.eventDate && <p className="text-xs text-destructive mt-1">{errors.eventDate}</p>}
            </div>
            <div>
              <label className="block text-base font-semibold text-white mb-2">Organizing Body *</label>
              <Input
                value={formData.eventName}
                onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
                placeholder="e.g., React Summit 2024"
                className={cn('w-full min-h-[44px] bg-transparent border-2 border-[#00fff7] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium', errors.eventName && 'border-destructive')}
              />
              {errors.eventName && <p className="text-xs text-destructive mt-1">{errors.eventName}</p>}
            </div>
            <div>
              <label className="block text-base font-semibold text-white mb-2">Mode of Competition</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="radio"
                    value="online"
                    checked={formData.eventType === 'online'}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventType: e.target.value as 'online' | 'offline' }))}
                    className="accent-[#00fff7] w-5 h-5 border-2 border-[#00fff7] rounded focus:ring-2 focus:ring-[#00fff7]"
                  />
                  Online
                </label>
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="radio"
                    value="offline"
                    checked={formData.eventType === 'offline'}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventType: e.target.value as 'online' | 'offline' }))}
                    className="accent-[#00fff7] w-5 h-5 border-2 border-[#00fff7] rounded focus:ring-2 focus:ring-[#00fff7]"
                  />
                  Offline
                </label>
              </div>
            </div>
            <div>
              <label className="block text-base font-semibold text-white mb-2">Event Link/Location</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Event link or location"
                className="w-full min-h-[44px] bg-transparent border-2 border-[#00fff7] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-white mb-2">Participation Type</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="radio"
                    checked={formData.isSolo}
                    onChange={() => setFormData(prev => ({ ...prev, isSolo: true, teamMembers: [] }))}
                    className="accent-[#00fff7] w-5 h-5 focus:ring-2 focus:ring-[#00fff7] border-none"
                  />
                  Solo
                </label>
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="radio"
                    checked={!formData.isSolo}
                    onChange={() => setFormData(prev => ({ ...prev, isSolo: false }))}
                    className="accent-[#00fff7] w-5 h-5 focus:ring-2 focus:ring-[#00fff7] border-none"
                  />
                  Team
                </label>
              </div>
            </div>
          </div>
          {/* Divider */}
          <div className="hidden md:block w-px bg-[#00fff7] mx-4" />
          {/* Right column */}
          <div className="flex-1 space-y-6">
            {/* Team Members - only show if Team is selected */}
            {!formData.isSolo && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#00fff7]" />
                  <span className="text-base font-medium text-white">Team Members</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#181A16] rounded-lg">
                  <div>
                    <label className="block text-base font-medium text-white mb-1">Name *</label>
                    <Input
                      value={newTeamMember.name}
                      onChange={(e) => setNewTeamMember(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Team member name"
                      className="bg-transparent border-none rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-white mb-1">Role</label>
                    <Input
                      value={newTeamMember.role}
                      onChange={(e) => setNewTeamMember(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="e.g., Frontend Developer"
                      className="bg-transparent border-none rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium w-full"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-base font-medium text-white mb-1">LinkedIn</label>
                    <Input
                      value={newTeamMember.linkedin}
                      onChange={(e) => setNewTeamMember(prev => ({ ...prev, linkedin: e.target.value }))}
                      placeholder="LinkedIn profile URL"
                      className="bg-transparent border-none rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium w-full"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button type="button" onClick={addTeamMember} disabled={!newTeamMember.name.trim()} className="gap-2 bg-[#00fff7] text-black rounded-full px-4 py-2 font-bold">
                      <Plus className="h-4 w-4" />
                      Add Team Member
                    </Button>
                  </div>
                </div>
                {errors.teamMembers && <p className="text-sm text-destructive">{errors.teamMembers}</p>}
              </div>
            )}
            <div>
              <label className="block text-base font-semibold text-white mb-2">Upload Certificate:</label>
              <Input
                value={formData.certificateUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, certificateUrl: e.target.value }))}
                placeholder="Certificate URL or upload"
                className="w-full min-h-[44px] bg-transparent border-2 border-[#00fff7] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-white mb-2">GitHub Link</label>
              <Input
                value={formData.githubUrl || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                placeholder="GitHub repository link (optional)"
                className="w-full min-h-[44px] bg-transparent border-2 border-[#00fff7] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium"
              />
            </div>
          </div>
        </div>
        {/* Form Actions */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={resetOnCancel ? handleReset : onCancel}
            className="w-32 py-3 rounded-lg font-bold text-lg bg-[#23272a] text-white border-none"
            disabled={isLoading}
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={isLoading || isUploading}
            className="w-32 py-3 rounded-lg font-bold text-lg bg-[#7c3aed] text-white shadow-[0_0_12px_rgba(124,58,237,0.7)] hover:bg-[#a78bfa] border-none"
          >
            {isLoading ? 'Saving...' : (initialData ? 'Update Participation' : 'Submit')}
          </Button>
        </div>
      </Card>
    </form>
  );
}; 