'use client';

import React, { useState } from 'react';
import { Project } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Users, User, Github, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onEdit?: (id: string, updatedData: Project) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onShare,
  className
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: project.name || '',
    description: project.description || '',
    technologies: project.technologies || [],
    isSolo: project.isSolo || false,
    teamMembers: project.teamMembers || [],
    tags: project.tags || [],
    githubUrl: project.githubUrl || '',
  });

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
          title: project.name,
          text: project.description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const text = `${project.name}\n${project.description}\n${project.githubUrl || ''}`;
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
    setEditedData(prev => ({ ...prev, tags }));
  };
  const handleTechChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const technologies = value.split(',').map(t => t.trim()).filter(Boolean);
    setEditedData(prev => ({ ...prev, technologies }));
  };
  const handleSave = () => {
    if (onEdit) {
      onEdit(project.id, {
        ...project,
        ...editedData,
      });
    }
    setIsEditing(false);
  };
  const handleCancel = () => {
    setEditedData({
      name: project.name || '',
      description: project.description || '',
      technologies: project.technologies || [],
      isSolo: project.isSolo || false,
      teamMembers: project.teamMembers || [],
      tags: project.tags || [],
      githubUrl: project.githubUrl || '',
    });
    setIsEditing(false);
  };

  // Card container: remove border
  return (
    <div
      className={cn(
        "p-6 bg-[#1a1a1a] border-none rounded-xl shadow-[0_0_25px_rgba(0,255,255,0.1)] flex flex-col gap-4",
        className
      )}
      style={{ fontFamily: 'var(--font-space-grotesk)' }}
    >
      {isEditing ? (
        <>
          <div>
            <label className="block text-white mb-2">Project Name</label>
            <input
              name="name"
              value={editedData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-transparent rounded-lg text-white font-semibold shadow-[0_0_12px_rgba(0,255,255,0.25)] min-h-[46px] focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div>
            <label className="block text-white mb-2">Description</label>
            <textarea
              name="description"
              value={editedData.description}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-2.5 bg-transparent rounded-lg text-white font-semibold shadow-[0_0_12px_rgba(0,255,255,0.25)] min-h-[46px] focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div>
            <label className="block text-white mb-2">Technologies (comma-separated)</label>
            <input
              name="technologies"
              value={editedData.technologies.join(', ')}
              onChange={handleTechChange}
              className="w-full px-4 py-2.5 bg-transparent rounded-lg text-white font-semibold shadow-[0_0_12px_rgba(0,255,255,0.25)] min-h-[46px] focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div>
            <label className="block text-white mb-2">Tags (comma-separated)</label>
            <input
              name="tags"
              value={editedData.tags.join(', ')}
              onChange={handleTagsChange}
              className="w-full px-4 py-2.5 bg-transparent rounded-lg text-white font-semibold shadow-[0_0_12px_rgba(0,255,255,0.25)] min-h-[46px] focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div>
            <label className="block text-white mb-2">GitHub Link</label>
            <input
              name="githubUrl"
              value={editedData.githubUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-transparent rounded-lg text-white font-semibold shadow-[0_0_12px_rgba(0,255,255,0.25)] min-h-[46px] focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div className="flex gap-4 mt-4">
            <button className="flex-1 text-white font-bold py-2.5 rounded-lg transition-all bg-neutral-600/90 hover:bg-neutral-600 shadow-lg" onClick={handleCancel}>Cancel</button>
            <button className="flex-1 text-black font-bold py-2.5 rounded-lg transition-all bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)] hover:shadow-[0_0_18px_rgba(34,211,238,1)]" onClick={handleSave}>Save</button>
          </div>
        </>
      ) : (
        <>
          {/* Project Name */}
          <div>
            <label className="block text-white mb-2">Project Name</label>
            <div className="w-full px-4 py-2.5 bg-transparent rounded-lg text-white font-semibold shadow-[0_0_12px_rgba(0,255,255,0.25)] min-h-[46px]">{project.name}</div>
          </div>
          <div>
            <label className="block text-white mb-2">Description</label>
            <div className="w-full px-4 py-2.5 bg-transparent rounded-lg text-white font-semibold shadow-[0_0_12px_rgba(0,255,255,0.25)] min-h-[46px]">{project.description}</div>
          </div>
          {project.technologies.length > 0 && (
            <div>
              <label className="block text-white mb-2">Technologies</label>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, idx) => (
                  <span key={idx} className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-400/20 text-cyan-300 shadow-[0_0_8px_#00fff7]">{tech}</span>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="block text-white mb-2">Project Type</label>
            <div className="w-full px-4 py-2.5 bg-transparent rounded-lg text-white font-semibold shadow-[0_0_12px_rgba(0,255,255,0.25)] min-h-[46px] flex items-center gap-2">
              {project.isSolo ? <User className="h-4 w-4 text-cyan-300" /> : <Users className="h-4 w-4 text-cyan-300" />}
              {project.isSolo ? 'Solo Project' : 'Team Project'}
            </div>
          </div>
          {!project.isSolo && project.teamMembers && project.teamMembers.length > 0 && (
            <div>
              <label className="block text-white mb-2">Team Members</label>
              <div className="flex flex-wrap gap-2">
                {project.teamMembers.map((member, idx) => (
                  <span key={idx} className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-400/20 text-cyan-300 shadow-[0_0_8px_#00fff7]">
                    {member.name}{member.role ? ` (${member.role})` : ''}
                  </span>
                ))}
              </div>
            </div>
          )}
          {project.tags.length > 0 && (
            <div>
              <label className="block text-white mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 text-xs font-medium rounded-full bg-neutral-700 text-neutral-300">{tag}</span>
                ))}
              </div>
            </div>
          )}
          {project.githubUrl && (
            <div>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/90 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-[0_0_12px_rgba(147,51,234,0.7)] transition-colors mt-2"
              >
                <Github className="h-4 w-4" />
                View on GitHub
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
          <div className="flex gap-4 mt-4">
            {onDelete && (
              <button
                onClick={() => onDelete(project.id)}
                className="flex-1 text-white font-bold py-2.5 rounded-lg transition-all bg-red-600/90 hover:bg-red-600 shadow-[0_0_12px_rgba(239,68,68,0.7)] hover:shadow-[0_0_18px_rgba(239,68,68,0.9)]"
              >
                Delete
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 text-black font-bold py-2.5 rounded-lg transition-all bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)] hover:shadow-[0_0_18px_rgba(34,211,238,1)]"
              >
                Edit
              </button>
            )}
            <button
              onClick={handleShare}
              className="flex-1 text-white font-bold py-2.5 rounded-lg transition-all bg-purple-600/90 hover:bg-purple-600 shadow-[0_0_12px_rgba(147,51,234,0.7)] hover:shadow-[0_0_18px_rgba(147,51,234,0.9)]"
            >
              Share
            </button>
          </div>
        </>
      )}
    </div>
  );
}; 