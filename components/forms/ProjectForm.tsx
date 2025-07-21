'use client';

import React, { useState } from 'react';
import { Project, TeamMember } from '@/lib/types';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useCloudinary } from '@/lib/hooks/useCloudinary';
import { 
  Code, 
  Users, 
  User, 
  Plus, 
  X, 
  Upload, 
  Github,
  ExternalLink,
  Tag,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ProjectFormProps {
  initialData?: Partial<Project>;
  onSubmit: (data: Omit<Project, 'id' | 'createdAt'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps & { resetOnCancel?: boolean }> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  resetOnCancel = false
}) => {
  const { uploadProjectBanner, uploadProgress, isUploading } = useCloudinary();
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    githubUrl: initialData?.githubUrl || '',
    isSolo: initialData?.isSolo ?? true,
    teamMembers: initialData?.teamMembers || [],
    technologies: initialData?.technologies || [],
    tags: initialData?.tags || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState('');
  const [newTechnology, setNewTechnology] = useState('');
  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    role: '',
    linkedin: '',
    github: ''
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (!formData.isSolo && formData.teamMembers.length === 0) {
      newErrors.teamMembers = 'At least one team member is required for team projects';
    }

    if (formData.githubUrl && !isValidGitHubUrl(formData.githubUrl)) {
      newErrors.githubUrl = 'Please enter a valid GitHub URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidGitHubUrl = (url: string) => {
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-._]+$/;
    return githubRegex.test(url);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const projectData = {
      name: formData.name,
      description: formData.description,
      githubUrl: formData.githubUrl,
      isSolo: formData.isSolo,
      teamMembers: formData.isSolo ? [] : formData.teamMembers,
      technologies: formData.technologies,
      tags: formData.tags,
      userId: '', // Placeholder, should be set by backend/parent
      updatedAt: new Date(),
    };

    try {
      await onSubmit(projectData);
    } catch (error) {
      console.error('Error submitting project:', error);
    }
  };

  const handleReset = () => {
    setFormData({
      name: initialData?.name || '',
      description: initialData?.description || '',
      githubUrl: initialData?.githubUrl || '',
      isSolo: initialData?.isSolo ?? true,
      teamMembers: initialData?.teamMembers || [],
      technologies: initialData?.technologies || [],
      tags: initialData?.tags || []
    });
    setErrors({});
    setNewTag('');
    setNewTechnology('');
    setNewTeamMember({ name: '', role: '', linkedin: '', github: '' });
  };

  const handleImageUpload = async (file: File) => {
    try {
      const result = await uploadProjectBanner(file);
      // setFormData(prev => ({ ...prev, bannerImageUrl: result.url })); // Removed
    } catch (error) {
      console.error('Error uploading image:', error);
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

  const addTechnology = () => {
    if (newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }));
      setNewTechnology('');
    }
  };

  const removeTechnology = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
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
      <Card className="p-8 bg-[#181A16] border-none rounded-xl shadow-[0_0_25px_rgba(0,255,255,0.1)]">
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#00fff7]/10 rounded-full flex items-center justify-center">
            <Code className="h-5 w-5 text-[#00fff7]" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-[#7fffd4]" style={{ textShadow: '0 0 10px #7fffd4, 0 0 20px #7fffd4' }}>
            {initialData ? 'Edit Project' : 'Add New Project'}
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column */}
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-base font-semibold text-white mb-2">Project Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Project Name"
                className={cn('w-full min-h-[44px] bg-transparent border-2 border-[#00fff7] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium px-4 py-3', errors.name && 'border-destructive')}
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-base font-semibold text-white mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your project, its features, and what you learned..."
                rows={4}
                maxLength={500}
                className={cn('w-full px-4 py-4 bg-transparent border-2 border-[#00fff7] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium resize-none', errors.description && 'border-destructive')}
              />
              {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
            </div>
            <div>
              <label className="block text-base font-semibold text-white mb-2">Technologies</label>
              <div className="flex gap-2">
                <Input
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  placeholder="Add a technology"
                  className="bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium w-full shadow-[inset_0_0_12px_2px_rgba(0,255,255,0.35)]"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                />
                <Button type="button" onClick={addTechnology} disabled={!newTechnology.trim()} className="gap-2 bg-[#00fff7] text-black rounded-full px-4 py-2 font-bold">+
                </Button>
              </div>
              {formData.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.technologies.map((tech, index) => (
                    <span key={index} className="flex items-center gap-1 px-3 py-1 bg-[#00fff7]/10 text-[#00fff7] border border-[#00fff7]/20 rounded-full text-sm">
                      {tech}
                      <button type="button" onClick={() => removeTechnology(tech)} className="hover:text-[#00fff7]/80">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-base font-semibold text-white mb-2">Tags</label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  className="bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium w-full shadow-[inset_0_0_12px_2px_rgba(0,255,255,0.35)]"
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
          {/* Divider */}
          <div className="hidden md:block w-px bg-[#00fff7] mx-4" />
          {/* Right column */}
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-base font-semibold text-white mb-2">GitHub Repository</label>
              <Input
                value={formData.githubUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                placeholder="https://github.com/username/repo"
                className={cn('w-full min-h-[44px] bg-transparent border-2 border-[#00fff7] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium px-4 py-3', errors.githubUrl && 'border-destructive')}
              />
              {errors.githubUrl && <p className="text-xs text-destructive mt-1">{errors.githubUrl}</p>}
            </div>
            <div>
              <label className="block text-base font-semibold text-white mb-2">Project Type</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="radio"
                    checked={formData.isSolo}
                    onChange={() => setFormData(prev => ({ ...prev, isSolo: true, teamMembers: [] }))}
                    className="accent-[#00fff7] w-5 h-5 focus:ring-2 focus:ring-[#00fff7] border-none"
                  />
                  Solo Project
                </label>
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="radio"
                    checked={!formData.isSolo}
                    onChange={() => setFormData(prev => ({ ...prev, isSolo: false }))}
                    className="accent-[#00fff7] w-5 h-5 focus:ring-2 focus:ring-[#00fff7] border-none"
                  />
                  Team Project
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#181A16] rounded-lg">
                  <div>
                    <label className="block text-base font-medium text-white mb-1">Name *</label>
                    <Input
                      value={newTeamMember.name}
                      onChange={(e) => setNewTeamMember(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Team member name"
                      className="bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium w-full shadow-[inset_0_0_12px_2px_rgba(0,255,255,0.35)]"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-white mb-1">Role</label>
                    <Input
                      value={newTeamMember.role}
                      onChange={(e) => setNewTeamMember(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="e.g., Frontend Developer"
                      className="bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium w-full shadow-[inset_0_0_12px_2px_rgba(0,255,255,0.35)]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-base font-medium text-white mb-1">LinkedIn</label>
                    <Input
                      value={newTeamMember.linkedin}
                      onChange={(e) => setNewTeamMember(prev => ({ ...prev, linkedin: e.target.value }))}
                      placeholder="LinkedIn profile URL"
                      className="bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium w-full shadow-[inset_0_0_12px_2px_rgba(0,255,255,0.35)]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-base font-medium text-white mb-1">GitHub</label>
                    <Input
                      value={newTeamMember.github}
                      onChange={(e) => setNewTeamMember(prev => ({ ...prev, github: e.target.value }))}
                      placeholder="GitHub profile URL"
                      className="bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium w-full shadow-[inset_0_0_12px_2px_rgba(0,255,255,0.35)]"
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
            {isLoading ? 'Saving...' : (initialData ? 'Update Project' : 'Submit')}
          </Button>
        </div>
      </Card>
    </form>
  );
}; 