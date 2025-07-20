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

export const AchievementForm: React.FC<AchievementFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
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
      teamMembers: formData.isSolo ? [] : formData.teamMembers
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-foreground">
            {initialData ? 'Edit Achievement' : 'Add New Achievement'}
          </h2>
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Achievement Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., First Place in Hackathon"
              className={cn(errors.title && "border-destructive")}
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your achievement, what you accomplished, and the impact..."
              rows={4}
              className={cn(
                "w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none",
                errors.description && "border-destructive"
              )}
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Event Name *
              </label>
              <Input
                value={formData.eventName}
                onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
                placeholder="e.g., TechCrunch Hackathon 2024"
                className={cn(errors.eventName && "border-destructive")}
              />
              {errors.eventName && (
                <p className="text-sm text-destructive mt-1">{errors.eventName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Event Date *
              </label>
              <Input
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                className={cn(errors.eventDate && "border-destructive")}
              />
              {errors.eventDate && (
                <p className="text-sm text-destructive mt-1">{errors.eventDate}</p>
              )}
            </div>
          </div>
        </div>

        {/* Event Type and Position */}
        <div className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Event Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="online"
                    checked={formData.eventType === 'online'}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventType: e.target.value as 'online' | 'offline' }))}
                    className="text-primary focus:ring-primary"
                  />
                  <Wifi className="h-4 w-4" />
                  <span>Online</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="offline"
                    checked={formData.eventType === 'offline'}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventType: e.target.value as 'online' | 'offline' }))}
                    className="text-primary focus:ring-primary"
                  />
                  <Globe className="h-4 w-4" />
                  <span>Offline</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Position/Ranking
              </label>
              <Input
                type="number"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                placeholder="e.g., 1 (for 1st place)"
                className={cn(errors.position && "border-destructive")}
              />
              {errors.position && (
                <p className="text-sm text-destructive mt-1">{errors.position}</p>
              )}
            </div>
          </div>
        </div>

        {/* Solo vs Team */}
        <div className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Participation Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formData.isSolo}
                  onChange={() => setFormData(prev => ({ ...prev, isSolo: true, teamMembers: [] }))}
                  className="text-primary focus:ring-primary"
                />
                <User className="h-4 w-4" />
                <span>Solo</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={!formData.isSolo}
                  onChange={() => setFormData(prev => ({ ...prev, isSolo: false }))}
                  className="text-primary focus:ring-primary"
                />
                <Users className="h-4 w-4" />
                <span>Team</span>
              </label>
            </div>
          </div>

          {/* Team Members */}
          {!formData.isSolo && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Team Members</span>
              </div>
              
              {formData.teamMembers.length > 0 && (
                <div className="space-y-2">
                  {formData.teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{member.name}</p>
                        {member.role && (
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        )}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeTeamMember(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-border rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Name *
                  </label>
                  <Input
                    value={newTeamMember.name}
                    onChange={(e) => setNewTeamMember(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Team member name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Role
                  </label>
                  <Input
                    value={newTeamMember.role}
                    onChange={(e) => setNewTeamMember(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="e.g., Frontend Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    LinkedIn
                  </label>
                  <Input
                    value={newTeamMember.linkedin}
                    onChange={(e) => setNewTeamMember(prev => ({ ...prev, linkedin: e.target.value }))}
                    placeholder="LinkedIn profile URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    GitHub
                  </label>
                  <Input
                    value={newTeamMember.github}
                    onChange={(e) => setNewTeamMember(prev => ({ ...prev, github: e.target.value }))}
                    placeholder="GitHub profile URL"
                  />
                </div>
                <div className="md:col-span-2">
                  <Button
                    type="button"
                    onClick={addTeamMember}
                    disabled={!newTeamMember.name.trim()}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Team Member
                  </Button>
                </div>
              </div>
              
              {errors.teamMembers && (
                <p className="text-sm text-destructive">{errors.teamMembers}</p>
              )}
            </div>
          )}
        </div>

        {/* Certificate Upload */}
        <div className="space-y-4 mt-6">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Certificate</span>
          </div>
          
          <div className="space-y-4">
            {formData.certificateUrl && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Certificate uploaded:</p>
                <a
                  href={formData.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 text-sm"
                >
                  View Certificate
                </a>
              </div>
            )}
            
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Upload certificate (PDF, JPG, PNG)
              </p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file);
                  }
                }}
                className="hidden"
                id="certificate-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="certificate-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Choose File'}
              </label>
              
              {isUploading && uploadProgress > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{uploadProgress}%</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-4 mt-6">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Tags</span>
          </div>
          
          <div className="space-y-3">
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-primary/80"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button
                type="button"
                onClick={addTag}
                disabled={!newTag.trim()}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || isUploading}
            className="gap-2"
          >
            {isLoading ? 'Saving...' : (initialData ? 'Update Achievement' : 'Add Achievement')}
          </Button>
        </div>
      </Card>
    </form>
  );
}; 