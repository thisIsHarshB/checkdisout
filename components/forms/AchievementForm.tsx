'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useCloudinary } from '@/lib/hooks/useCloudinary';
import { 
  Trophy, 
  Users, 
  User, 
  Plus, 
  X, 
  Upload, 
  Calendar,
  Wifi,
  Globe,
  Award,
  Tag,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementFormProps {
  initialData?: Partial<Achievement>;
  onSubmit: (data: Omit<Achievement, 'id' | 'createdAt'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AchievementForm: React.FC<AchievementFormProps & { resetOnCancel?: boolean }> = ({
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
    position: initialData?.position || '',
    isSolo: initialData?.isSolo ?? true,
    teamMembers: initialData?.teamMembers || [],
    certificateUrl: initialData?.certificateUrl || '',
    tags: initialData?.tags || []
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
      newErrors.teamMembers = 'At least one team member is required for team achievements';
    }

    if (formData.position && isNaN(Number(formData.position))) {
      newErrors.position = 'Position must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const achievementData = {
      ...formData,
      eventDate: new Date(formData.eventDate),
      position: formData.position ? Number(formData.position) : undefined,
      teamMembers: formData.isSolo ? [] : formData.teamMembers,
      description: formData.description || '',
      eventName: formData.eventName || '',
      eventType: formData.eventType || 'online',
      tags: formData.tags || [],
      certificateUrl: formData.certificateUrl || '',
    };

    try {
      await onSubmit(achievementData);
    } catch (error) {
      console.error('Error submitting achievement:', error);
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
      position: initialData?.position || '',
      isSolo: initialData?.isSolo ?? true,
      teamMembers: initialData?.teamMembers || [],
      certificateUrl: initialData?.certificateUrl || '',
      tags: initialData?.tags || []
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
            <Trophy className="h-5 w-5 text-[#00fff7]" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-[#7fffd4]" style={{ textShadow: '0 0 10px #7fffd4, 0 0 20px #7fffd4' }}>
            {initialData ? 'Edit Achievement' : 'Add New Achievement'}
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column */}
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-base font-semibold text-white mb-2">Achievement Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., First Place in Hackathon"
                className={cn('w-full min-h-[44px] bg-transparent border-none rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium', errors.title && 'border-destructive')}
              />
              {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-base font-semibold text-white mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your achievement, what you accomplished, and the impact..."
                rows={4}
                className={cn('w-full px-3 py-2 bg-transparent border-none rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium resize-none', errors.description && 'border-destructive')}
              />
              {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
            </div>
            <div>
              <label className="block text-base font-semibold text-white mb-2">Event Name *</label>
              <Input
                value={formData.eventName}
                onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
                placeholder="e.g., National Coding Olympiad"
                className={cn('w-full min-h-[44px] bg-transparent border-none rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium', errors.eventName && 'border-destructive')}
              />
              {errors.eventName && <p className="text-xs text-destructive mt-1">{errors.eventName}</p>}
            </div>
            <div>
              <label className="block text-base font-semibold text-white mb-2">Event Date *</label>
              <Input
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                className={cn('w-full min-h-[44px] bg-transparent border-none rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium', errors.eventDate && 'border-destructive')}
              />
              {errors.eventDate && <p className="text-xs text-destructive mt-1">{errors.eventDate}</p>}
            </div>
            <div>
              <label className="block text-base font-semibold text-white mb-2">Event Type</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="radio"
                    value="online"
                    checked={formData.eventType === 'online'}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventType: e.target.value as 'online' | 'offline' }))}
                    className="accent-[#00fff7] w-5 h-5 focus:ring-2 focus:ring-[#00fff7] border-none"
                  />
                  Online
                </label>
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="radio"
                    value="offline"
                    checked={formData.eventType === 'offline'}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventType: e.target.value as 'online' | 'offline' }))}
                    className="accent-[#00fff7] w-5 h-5 focus:ring-2 focus:ring-[#00fff7] border-none"
                  />
                  Offline
                </label>
              </div>
            </div>
            <div>
              <label className="block text-base font-semibold text-white mb-2">Position/Ranking</label>
              <Input
                type="number"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                placeholder="e.g., 1 (for 1st place)"
                className={cn('w-full min-h-[44px] bg-transparent border-none rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium', errors.position && 'border-destructive')}
              />
              {errors.position && <p className="text-xs text-destructive mt-1">{errors.position}</p>}
            </div>
          </div>
          {/* Divider */}
          <div className="hidden md:block w-px bg-[#00fff7] mx-4" />
          {/* Right column */}
          <div className="flex-1 space-y-6">
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
            {/* Team Members - only show if Team is selected */}
            {!formData.isSolo && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#00fff7]" />
                  <span className="text-base font-medium text-white">Team Members</span>
                </div>
                {formData.teamMembers.length > 0 && (
                  <div className="space-y-2">
                    {formData.teamMembers.map((member, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-[#23272a] rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-white">{member.name}</p>
                          {member.role && (
                            <p className="text-sm text-[#00fff7]">{member.role}</p>
                          )}
                        </div>
                        <Button type="button" size="sm" variant="ghost" onClick={() => removeTeamMember(index)} className="text-destructive hover:text-destructive">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
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
              <label className="block text-base font-semibold text-white mb-2">Certificate</label>
              <Input
                value={formData.certificateUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, certificateUrl: e.target.value }))}
                placeholder="Certificate URL or upload"
                className="w-full min-h-[44px] bg-transparent border-none rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-white mb-2">Tags</label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  className="bg-transparent border-none rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} disabled={!newTag.trim()} className="gap-2 bg-[#00fff7] text-black rounded-full px-4 py-2 font-bold">+
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="flex items-center gap-1 px-3 py-1 bg-[#00fff7]/10 text-[#00fff7] border border-[#00fff7]/20 rounded-full text-sm">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-[#00fff7]/80">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
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
            disabled={isLoading}
            className="w-32 py-3 rounded-lg font-bold text-lg bg-[#7c3aed] text-white shadow-[0_0_12px_rgba(124,58,237,0.7)] hover:bg-[#a78bfa] border-none"
          >
            {isLoading ? 'Saving...' : (initialData ? 'Update Achievement' : 'Submit')}
          </Button>
        </div>
      </Card>
    </form>
  );
}; 