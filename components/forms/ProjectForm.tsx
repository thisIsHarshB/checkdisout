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

export const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const { uploadFile, uploadProgress, isUploading } = useCloudinary();
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    bannerImageUrl: initialData?.bannerImageUrl || '',
    githubUrl: initialData?.githubUrl || '',
    liveUrl: initialData?.liveUrl || '',
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

    if (formData.liveUrl && !isValidUrl(formData.liveUrl)) {
      newErrors.liveUrl = 'Please enter a valid URL';
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
      ...formData,
      teamMembers: formData.isSolo ? [] : formData.teamMembers
    };

    try {
      await onSubmit(projectData);
    } catch (error) {
      console.error('Error submitting project:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const url = await uploadFile(file, 'project-banners');
      setFormData(prev => ({ ...prev, bannerImageUrl: url }));
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
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
            <Code className="h-5 w-5 text-accent-foreground" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-foreground">
            {initialData ? 'Edit Project' : 'Add New Project'}
          </h2>
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Project Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., E-Commerce Platform"
              className={cn(errors.name && "border-destructive")}
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description * ({formData.description.length}/500)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your project, its features, and what you learned..."
              rows={4}
              maxLength={500}
              className={cn(
                "w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none",
                errors.description && "border-destructive"
              )}
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Banner Image Upload */}
        <div className="space-y-4 mt-6">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Banner Image</span>
          </div>
          
          <div className="space-y-4">
            {formData.bannerImageUrl && (
              <div className="relative h-48 bg-muted rounded-lg overflow-hidden">
                <Image
                  src={formData.bannerImageUrl}
                  alt="Project banner"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            )}
            
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Upload project banner (JPG, PNG, WebP)
              </p>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(file);
                  }
                }}
                className="hidden"
                id="banner-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="banner-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Choose Image'}
              </label>
              
              {isUploading && uploadProgress > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-accent-foreground h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{uploadProgress}%</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project Links */}
        <div className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                GitHub Repository
              </label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={formData.githubUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                  placeholder="https://github.com/username/repo"
                  className={cn("pl-10", errors.githubUrl && "border-destructive")}
                />
              </div>
              {errors.githubUrl && (
                <p className="text-sm text-destructive mt-1">{errors.githubUrl}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Live Demo URL
              </label>
              <div className="relative">
                <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={formData.liveUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                  placeholder="https://your-project.com"
                  className={cn("pl-10", errors.liveUrl && "border-destructive")}
                />
              </div>
              {errors.liveUrl && (
                <p className="text-sm text-destructive mt-1">{errors.liveUrl}</p>
              )}
            </div>
          </div>
        </div>

        {/* Technologies */}
        <div className="space-y-4 mt-6">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Technologies</span>
          </div>
          
          <div className="space-y-3">
            {formData.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent-foreground border border-accent/20 rounded-full text-sm"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="hover:text-accent-foreground/80"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <Input
                value={newTechnology}
                onChange={(e) => setNewTechnology(e.target.value)}
                placeholder="Add a technology"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
              />
              <Button
                type="button"
                onClick={addTechnology}
                disabled={!newTechnology.trim()}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Solo vs Team */}
        <div className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Project Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formData.isSolo}
                  onChange={() => setFormData(prev => ({ ...prev, isSolo: true, teamMembers: [] }))}
                  className="text-accent focus:ring-accent"
                />
                <User className="h-4 w-4" />
                <span>Solo Project</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={!formData.isSolo}
                  onChange={() => setFormData(prev => ({ ...prev, isSolo: false }))}
                  className="text-accent focus:ring-accent"
                />
                <Users className="h-4 w-4" />
                <span>Team Project</span>
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
                    className="flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-muted-foreground/80"
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
            {isLoading ? 'Saving...' : (initialData ? 'Update Project' : 'Add Project')}
          </Button>
        </div>
      </Card>
    </form>
  );
}; 