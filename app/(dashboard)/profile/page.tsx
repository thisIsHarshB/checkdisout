'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserData } from '@/lib/context/UserDataContext';
import { ProfileForm } from '@/components/forms/ProfileForm';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  User, 
  Edit, 
  Save, 
  X, 
  ChevronDown, 
  ChevronUp,
  Download,
  Trophy,
  Users,
  Code,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Award,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useUser } from '@/lib/hooks/useFirestore';
import { useAchievements, useParticipations, useProjects } from '@/lib/hooks/useFirestore';
import { useAuth } from '@/lib/context/AuthContext';

interface DropdownSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: 'purple' | 'blue';
  content: React.ReactNode;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const { user, userLoading, userError, refreshUser } = useUserData();
  const [isEditMode, setIsEditMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic-info']);
  const [isSaving, setIsSaving] = useState(false);
  const { updateUser } = useUser();

  // Fetch achievements, participations, projects from Firestore
  const { achievements, loading: achievementsLoading } = useAchievements(authUser?.uid);
  const { participations, loading: participationsLoading } = useParticipations(authUser?.uid);
  const { projects, loading: projectsLoading } = useProjects(authUser?.uid);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleProfileUpdate = async (data: any) => {
    setIsSaving(true);
    try {
      const result = await updateUser(data);
      if (result.success) {
        await refreshUser();
        setIsEditMode(false);
        // Show success feedback (you can add a toast notification here if needed)
        console.log('Profile updated successfully!');
      } else {
        console.error('Failed to update profile:', result.error);
        // You can add error handling/notification here
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // You can add error handling/notification here
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-8 bg-muted rounded animate-pulse w-1/3"></div>
          <div className="h-64 bg-muted rounded animate-pulse"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-16 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            Error Loading Profile
          </h2>
          <p className="text-muted-foreground mb-6">
            {userError || 'Unable to load profile data'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const dropdownSections: DropdownSection[] = [
    {
      id: 'basic-info',
      title: 'Basic Information',
      icon: <User className="h-5 w-5" />,
      color: 'purple',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Full Name
              </label>
              <p className="text-foreground">{user.name || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Email
              </label>
              <p className="text-foreground">{user.email || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Phone
              </label>
              <p className="text-foreground">{user.phone || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Location
              </label>
              <p className="text-foreground">{user.location || 'Not provided'}</p>
            </div>
          </div>
          {user.bio && (
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Bio
              </label>
              <p className="text-foreground">{user.bio}</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'social-links',
      title: 'Social Links',
      icon: <Globe className="h-5 w-5" />,
      color: 'blue',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.website && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                {user.website}
              </a>
            </div>
          )}
          {user.github && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Github className="h-4 w-4 text-muted-foreground" />
              <a href={user.github} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                {user.github}
              </a>
            </div>
          )}
          {user.linkedin && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Linkedin className="h-4 w-4 text-muted-foreground" />
              <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                {user.linkedin}
              </a>
            </div>
          )}
          {user.twitter && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Twitter className="h-4 w-4 text-muted-foreground" />
              <a href={user.twitter} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                {user.twitter}
              </a>
            </div>
          )}
          {user.instagram && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Instagram className="h-4 w-4 text-muted-foreground" />
              <a href={user.instagram} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                {user.instagram}
              </a>
            </div>
          )}
          {!user.website && !user.github && !user.linkedin && !user.twitter && !user.instagram && (
            <p className="text-muted-foreground col-span-2">No social links added yet</p>
          )}
        </div>
      )
    },
    {
      id: 'qualities',
      title: 'Personal Qualities',
      icon: <Award className="h-5 w-5" />,
      color: 'purple',
      content: (
        <div>
          {user.qualities && user.qualities.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.qualities.map((quality, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-800 border border-purple-200 rounded-full text-sm"
                >
                  {quality}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No qualities added yet</p>
          )}
        </div>
      )
    },
    {
      id: 'skills',
      title: 'Technical Skills',
      icon: <Code className="h-5 w-5" />,
      color: 'blue',
      content: (
        <div>
          {user.skills && user.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 border border-blue-200 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No skills added yet</p>
          )}
        </div>
      )
    },
    {
      id: 'achievements',
      title: 'Recent Achievements',
      icon: <Trophy className="h-5 w-5" />,
      color: 'purple',
      content: (
        <div>
          {achievementsLoading ? (
            <div className="text-center py-6 text-[#00fff7]">Loading achievements...</div>
          ) : achievements && achievements.length > 0 ? (
            <div className="space-y-3">
              {achievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="p-3 bg-[#181A16] rounded-lg">
                  <h4 className="font-medium text-[#7fffd4]">{achievement.title}</h4>
                  <p className="text-sm text-[#bafffa]">{achievement.eventName}</p>
                  <p className="text-xs text-[#00fff7] mt-1">
                    {formatDate(achievement.eventDate)}
                  </p>
                </div>
              ))}
              {achievements.length > 3 && (
                <Button
                  variant="outline"
                  onClick={() => router.push('/achievements')}
                  className="w-full border-none text-[#00fff7] hover:bg-[#00fff7]/10 hover:text-[#7fffd4] font-bold rounded-lg"
                >
                  View All Achievements ({achievements.length})
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Trophy className="h-8 w-8 text-[#00fff7] mx-auto mb-2" />
              <p className="text-[#bafffa]">No achievements yet</p>
              <Button
                variant="outline"
                onClick={() => router.push('/add-to-portfolio')}
                className="mt-2 border-none text-[#00fff7] hover:bg-[#00fff7]/10 hover:text-[#7fffd4] font-bold rounded-lg"
              >
                Add Achievement
              </Button>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'participations',
      title: 'Recent Participations',
      icon: <Users className="h-5 w-5" />,
      color: 'blue',
      content: (
        <div>
          {participationsLoading ? (
            <div className="text-center py-6 text-[#00fff7]">Loading participations...</div>
          ) : participations && participations.length > 0 ? (
            <div className="space-y-3">
              {participations.slice(0, 3).map((participation) => (
                <div key={participation.id} className="p-3 bg-[#181A16] rounded-lg">
                  <h4 className="font-medium text-[#7fffd4]">{participation.title}</h4>
                  <p className="text-sm text-[#bafffa]">{participation.eventName}</p>
                  <p className="text-xs text-[#00fff7] mt-1">
                    {formatDate(participation.eventDate)}
                  </p>
                </div>
              ))}
              {participations.length > 3 && (
                <Button
                  variant="outline"
                  onClick={() => router.push('/participations')}
                  className="w-full border-none text-[#00fff7] hover:bg-[#00fff7]/10 hover:text-[#7fffd4] font-bold rounded-lg"
                >
                  View All Participations ({participations.length})
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Users className="h-8 w-8 text-[#00fff7] mx-auto mb-2" />
              <p className="text-[#bafffa]">No participations yet</p>
              <Button
                variant="outline"
                onClick={() => router.push('/add-to-portfolio')}
                className="mt-2 border-none text-[#00fff7] hover:bg-[#00fff7]/10 hover:text-[#7fffd4] font-bold rounded-lg"
              >
                Add Participation
              </Button>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'projects',
      title: 'Recent Projects',
      icon: <Code className="h-5 w-5" />,
      color: 'purple',
      content: (
        <div>
          {projectsLoading ? (
            <div className="text-center py-6 text-[#00fff7]">Loading projects...</div>
          ) : projects && projects.length > 0 ? (
            <div className="space-y-3">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="p-3 bg-[#181A16] rounded-lg">
                  <h4 className="font-medium text-[#7fffd4]">{project.name}</h4>
                  <p className="text-sm text-[#bafffa] line-clamp-2">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-[#00fff7]/10 text-[#00fff7] text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-[#23272a] text-[#00fff7] text-xs rounded">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {projects.length > 3 && (
                <Button
                  variant="outline"
                  onClick={() => router.push('/projects')}
                  className="w-full border-none text-[#00fff7] hover:bg-[#00fff7]/10 hover:text-[#7fffd4] font-bold rounded-lg"
                >
                  View All Projects ({projects.length})
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Code className="h-8 w-8 text-[#00fff7] mx-auto mb-2" />
              <p className="text-[#bafffa]">No projects yet</p>
              <Button
                variant="outline"
                onClick={() => router.push('/add-to-portfolio')}
                className="mt-2 border-none text-[#00fff7] hover:bg-[#00fff7]/10 hover:text-[#7fffd4] font-bold rounded-lg"
              >
                Add Project
              </Button>
            </div>
          )}
        </div>
      )
    }
  ];

  if (isEditMode) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center p-6">
        <div className="max-w-3xl w-full mx-auto">
          <Card className="p-8 bg-[#181A16] border-none shadow-[0_0_32px_4px_rgba(0,255,255,0.18)]">
            <ProfileForm
              initialData={user}
              onSubmit={handleProfileUpdate}
              onCancel={() => setIsEditMode(false)}
              isLoading={isSaving}
            />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] p-6 text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-heading font-bold text-[#7fffd4]" style={{ textShadow: '0 0 10px #7fffd4, 0 0 20px #7fffd4' }}>
            Profile
          </h1>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/export')}
              className="gap-2 border-none text-[#00fff7] hover:bg-[#00fff7]/10 hover:text-[#7fffd4] font-bold rounded-lg px-6 py-3"
            >
              <Download className="h-4 w-4 text-[#00fff7]" />
              Export Portfolio
            </Button>
            <Button
              onClick={() => setIsEditMode(true)}
              className="gap-2 bg-[#00fff7] text-black font-bold rounded-lg px-6 py-3 shadow-[0_0_12px_2px_rgba(0,255,255,0.18)] hover:bg-[#7fffd4]"
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Profile Header */}
        <Card className="p-6 bg-[#181A16] border-none">
          <div className="flex items-center gap-6">
            <div className="relative">
              {user.profilePictureURL ? (
                <div className="w-24 h-24 rounded-full overflow-hidden bg-[#23272a]">
                  <Image
                    src={user.profilePictureURL}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#23272a] flex items-center justify-center">
                  <User className="h-12 w-12 text-[#00fff7]" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-heading font-bold text-[#7fffd4] mb-2" style={{ textShadow: '0 0 10px #7fffd4' }}>
                {user.name || 'Your Name'}
              </h2>
              <p className="text-[#bafffa] mb-3">
                {user.bio || 'Add a bio to tell people about yourself'}
              </p>
              <div className="flex items-center gap-4 text-sm text-[#00fff7]">
                {user.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Dropdown Sections */}
        <div className="space-y-4">
          {dropdownSections.map((section) => (
            <Card
              key={section.id}
              className="overflow-hidden transition-all duration-200 bg-[#181A16] border-none"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 transition-colors bg-[#101212] hover:bg-[#101212]/80 border-none outline-none focus:ring-2 focus:ring-[#00fff7]",
                  expandedSections.includes(section.id) && 'shadow-[0_0_16px_2px_rgba(0,255,255,0.18)]'
                )}
                style={{ boxShadow: expandedSections.includes(section.id) ? '0 0 16px 2px rgba(0,255,255,0.18)' : undefined }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#00fff7]/10 text-[#00fff7]">
                    {section.icon}
                  </div>
                  <h3 className="font-semibold text-[#7fffd4]">{section.title}</h3>
                </div>
                {expandedSections.includes(section.id) ? (
                  <ChevronUp className="h-5 w-5 text-[#00fff7]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#00fff7]" />
                )}
              </button>
              {expandedSections.includes(section.id) && (
                <div className="p-4">
                  {/* Neon/cyan themed content for each section */}
                  {section.id === 'qualities' && user.qualities && user.qualities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.qualities.map((quality, index) => (
                        <span key={index} className="px-3 py-1 bg-[#00fff7]/10 text-[#00fff7] rounded-full text-sm">
                          {quality}
                        </span>
                      ))}
                    </div>
                  ) : section.id === 'skills' && user.skills && user.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-[#00fff7]/10 text-[#00fff7] rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : section.content}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 