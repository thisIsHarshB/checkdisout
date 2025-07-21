'use client';

import React, { useState } from 'react';
import { User } from '@/lib/types';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useCloudinary } from '@/lib/hooks/useCloudinary';
import { 
  User as UserIcon, 
  Plus, 
  X, 
  Upload, 
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Award,
  Code,
  Camera
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// REQUIRED PROFILE FIELDS IN DATABASE:
// name: string
// email: string
// phone: string
// location: string
// bio: string
// profilePictureURL: string
// website: string
// github: string
// linkedin: string
// twitter: string
// instagram: string
// qualities: string[]
// skills: string[]
//
// All these fields should be present in the user's document in the database for full profile functionality.

interface ProfileFormProps {
  initialData: User;
  onSubmit: (data: Partial<User>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const { uploadProfileImage, uploadProgress, isUploading } = useCloudinary();
  
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    location: initialData.location || '',
    bio: initialData.bio || '',
    profilePictureURL: initialData.profilePictureURL || '',
    website: initialData.website || '',
    github: initialData.github || '',
    linkedin: initialData.linkedin || '',
    twitter: initialData.twitter || '',
    instagram: initialData.instagram || '',
    qualities: initialData.qualities || [],
    skills: initialData.skills || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newQuality, setNewQuality] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    if (formData.github && !isValidGitHubUrl(formData.github)) {
      newErrors.github = 'Please enter a valid GitHub URL';
    }

    if (formData.linkedin && !isValidLinkedInUrl(formData.linkedin)) {
      newErrors.linkedin = 'Please enter a valid LinkedIn URL';
    }

    if (formData.twitter && !isValidTwitterUrl(formData.twitter)) {
      newErrors.twitter = 'Please enter a valid Twitter URL';
    }

    if (formData.instagram && !isValidInstagramUrl(formData.instagram)) {
      newErrors.instagram = 'Please enter a valid Instagram URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidGitHubUrl = (url: string) => {
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+$/;
    return githubRegex.test(url);
  };

  const isValidLinkedInUrl = (url: string) => {
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+$/;
    return linkedinRegex.test(url);
  };

  const isValidTwitterUrl = (url: string) => {
    const twitterRegex = /^https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+$/;
    return twitterRegex.test(url);
  };

  const isValidInstagramUrl = (url: string) => {
    const instagramRegex = /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+$/;
    return instagramRegex.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const result = await uploadProfileImage(file);
      setFormData(prev => ({ ...prev, profilePictureURL: result.url }));
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const addQuality = () => {
    if (newQuality.trim() && !formData.qualities.includes(newQuality.trim())) {
      setFormData(prev => ({
        ...prev,
        qualities: [...prev.qualities, newQuality.trim()]
      }));
      setNewQuality('');
    }
  };

  const removeQuality = (qualityToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      qualities: prev.qualities.filter(quality => quality !== qualityToRemove)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-4 sm:p-6 bg-[#181A16] border-none">
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4 sm:mb-6">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-[#f1ffe7]" />
          </div>
          <h2 className="text-lg sm:text-2xl font-heading font-bold text-[#f1ffe7]">
            Edit Profile
          </h2>
        </div>

        {/* Profile Picture */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-[#f1ffe7]" />
            <span className="text-sm font-medium text-[#f1ffe7]">Profile Picture</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              {formData.profilePictureURL ? (
                <div className="w-20 h-20 rounded-full overflow-hidden bg-muted">
                  <Image
                    src={formData.profilePictureURL}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-[#f1ffe7]" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
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
                id="profile-picture-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="profile-picture-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-[#f1ffe7] rounded-lg hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Choose Image'}
              </label>
              
              {isUploading && uploadProgress.percentage > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-[#f1ffe7] mt-1">{uploadProgress.percentage}%</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-[#f1ffe7]">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#f1ffe7] mb-1 sm:mb-2">
                Full Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your Name"
                className={cn(errors.name && "border-destructive", "w-full min-h-[44px] px-4 py-3 bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium shadow-[inset_0_0_12px_2px_rgba(0,255,255,0.35)]")}
              />
              {errors.name && (
                <p className="text-xs sm:text-sm text-destructive mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#f1ffe7] mb-1 sm:mb-2">
                Email *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="you@example.com"
                className={cn(errors.email && "border-destructive", "w-full min-h-[44px] px-4 py-3 bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium shadow-[inset_0_0_12px_2px_rgba(0,255,255,0.35)]")}
              />
              {errors.email && (
                <p className="text-xs sm:text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#f1ffe7] mb-1 sm:mb-2">
                Phone Number
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
                className={cn(errors.phone && "border-destructive", "w-full min-h-[44px] px-4 py-3 bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium shadow-[inset_0_0_12px_2px_rgba(0,255,255,0.35)]")}
              />
              {errors.phone && (
                <p className="text-xs sm:text-sm text-destructive mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#f1ffe7] mb-1 sm:mb-2">
                Location
              </label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City, Country"
                className={cn(errors.location && "border-destructive", "w-full min-h-[44px] px-4 py-3 bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium shadow-[inset_0_0_12px_2px_rgba(0,255,255,0.35)]")}
              />
              {errors.location && (
                <p className="text-xs sm:text-sm text-destructive mt-1">{errors.location}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#f1ffe7] mb-1 sm:mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself, your background, and what you're passionate about..."
              rows={4}
              className={cn(errors.bio && "border-destructive", "w-full px-4 py-4 bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium resize-none shadow-[inset_0_0_12px_2px_rgba(0,255,255,0.35)]")}
            />
            {errors.bio && (
              <p className="text-xs sm:text-sm text-destructive mt-1">{errors.bio}</p>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-[#f1ffe7]">Social Links</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#f1ffe7] mb-1 sm:mb-2">
                Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#f1ffe7]" />
                <Input
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://yourwebsite.com"
                  className={cn("pl-10", errors.website && "border-destructive", "w-full min-h-[44px] px-4 py-3 bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium shadow-[inset_0_0_12px_2px_rgba(0,255,255,0.35)]")}
                />
              </div>
              {errors.website && (
                <p className="text-xs sm:text-sm text-destructive mt-1">{errors.website}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#f1ffe7] mb-1 sm:mb-2">
                GitHub
              </label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#f1ffe7]" />
                <Input
                  value={formData.github}
                  onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                  placeholder="https://github.com/username"
                  className={cn("pl-10", errors.github && "border-destructive", "w-full min-h-[44px] px-4 py-3 bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium shadow-[inset_0_0_12px_2px_rgba(0,255,255,0.35)]")}
                />
              </div>
              {errors.github && (
                <p className="text-xs sm:text-sm text-destructive mt-1">{errors.github}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#f1ffe7] mb-1 sm:mb-2">
                LinkedIn
              </label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#f1ffe7]" />
                <Input
                  value={formData.linkedin}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                  placeholder="https://linkedin.com/in/username"
                  className={cn("pl-10", errors.linkedin && "border-destructive", "w-full min-h-[44px] px-4 py-3 bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium shadow-[inset_0_0_12px_2px_rgba(0,255,255,0.35)]")}
                />
              </div>
              {errors.linkedin && (
                <p className="text-xs sm:text-sm text-destructive mt-1">{errors.linkedin}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#f1ffe7] mb-1 sm:mb-2">
                Twitter
              </label>
              <div className="relative">
                <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#f1ffe7]" />
                <Input
                  value={formData.twitter}
                  onChange={(e) => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                  placeholder="https://twitter.com/username"
                  className={cn("pl-10", errors.twitter && "border-destructive", "w-full min-h-[44px] px-4 py-3 bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium shadow-[inset_0_0_12px_2px_rgba(0,255,255,0.35)]")}
                />
              </div>
              {errors.twitter && (
                <p className="text-xs sm:text-sm text-destructive mt-1">{errors.twitter}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#f1ffe7] mb-1 sm:mb-2">
                Instagram
              </label>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#f1ffe7]" />
                <Input
                  value={formData.instagram}
                  onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                  placeholder="https://instagram.com/username"
                  className={cn("pl-10", errors.instagram && "border-destructive", "w-full min-h-[44px] px-4 py-3 bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium shadow-[inset_0_0_12px_2px_rgba(0,255,255,0.35)]")}
                />
              </div>
              {errors.instagram && (
                <p className="text-xs sm:text-sm text-destructive mt-1">{errors.instagram}</p>
              )}
            </div>
          </div>
        </div>

        {/* Qualities */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-[#f1ffe7]" />
            <span className="text-sm font-medium text-[#f1ffe7]">Personal Qualities</span>
          </div>
          
          <div className="space-y-3">
            {formData.qualities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.qualities.map((quality, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-[#00fff7]/10 text-[#00fff7] rounded-full text-base font-semibold flex items-center gap-2"
                  >
                    {quality}
                    <button
                      type="button"
                      onClick={() => removeQuality(quality)}
                      className="text-[#00fff7] hover:text-[#7fffd4]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <Input
                value={newQuality}
                onChange={(e) => setNewQuality(e.target.value)}
                placeholder="Add a quality (e.g., Creative, Analytical)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addQuality())}
                className="w-full min-h-[44px] px-4 py-3 bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium shadow-[inset_0_0_12px_2px_rgba(0,255,255,0.35)]"
              />
              <Button
                type="button"
                onClick={addQuality}
                disabled={!newQuality.trim()}
                className="bg-[#00fff7] text-[#f1ffe7] rounded-full px-5 py-2 font-bold"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-[#f1ffe7]" />
            <span className="text-sm font-medium text-[#f1ffe7]">Technical Skills</span>
          </div>
          
          <div className="space-y-3">
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-[#00fff7]/10 text-[#00fff7] rounded-full text-base font-semibold flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-[#00fff7] hover:text-[#7fffd4]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill (e.g., React, Python)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="w-full min-h-[44px] px-4 py-3 bg-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-medium shadow-[inset_0_0_12px_2px_rgba(0,255,255,0.35)]"
              />
              <Button
                type="button"
                onClick={addSkill}
                disabled={!newSkill.trim()}
                className="bg-[#00fff7] text-[#f1ffe7] rounded-full px-5 py-2 font-bold"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full sm:w-auto min-h-[44px] border-none text-[#00fff7] bg-transparent hover:bg-[#00fff7]/10 rounded-lg px-6 py-3"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || isUploading}
            className="w-full sm:w-auto min-h-[44px] gap-2 bg-[#00fff7] text-[#181A16] font-bold rounded-lg px-6 py-3 shadow-[0_0_12px_2px_rgba(0,255,255,0.18)] hover:bg-[#7fffd4]"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Card>
    </form>
  );
}; 