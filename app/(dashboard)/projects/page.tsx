'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { Search, Filter, Code } from 'lucide-react';
import Link from 'next/link';
import { useProjects } from '@/lib/hooks/useFirestore';
import { Project } from '@/lib/types';

export default function ProjectsPage() {
  const { projects, error, updateProject } = useProjects(undefined, { limit: 10 });
  const [searchTerm, setSearchTerm] = useState('');
  const [technologyFilter, setTechnologyFilter] = useState('all');

  // Get unique technologies for filter
  const allTechnologies = Array.from(
    new Set(projects.flatMap(project => project.technologies))
  ).sort();

  // Filter projects based on search and filter
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = technologyFilter === 'all' || 
                         project.technologies.includes(technologyFilter);
    
    return matchesSearch && matchesFilter;
  });

  // Remove Load More and update edit handler for in-place editing
  const handleEdit = async (id: string, updatedData: Partial<Project>) => {
    await updateProject(id, updatedData);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality
    console.log('Delete project:', id);
  };

  const handleShare = (id: string) => {
    // TODO: Implement share functionality
    console.log('Share project:', id);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
              Error Loading Projects
            </h2>
            <p className="text-muted-foreground mb-6">
              {error}
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Always render the main content, regardless of loading state
  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans p-6" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-heading font-bold text-[#7fffd4]" style={{ textShadow: '0 0 10px #7fffd4, 0 0 20px #7fffd4' }}>
                My Projects
              </h1>
              <p className="text-lg text-cyan-200 mt-2">
                Showcase your development projects and contributions
              </p>
            </div>
            <Link href="/projects/new">
              <Button size="lg" className="gap-2 bg-purple-600/90 hover:bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.7)]">
                <Code className="h-5 w-5" />
                Add Project
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-cyan-200">
            <span className="px-4 py-2 rounded-lg bg-[#2a2a2e] font-semibold shadow-[0_0_8px_rgba(0,255,255,0.15)]">{projects.length} total projects</span>
            <span>•</span>
            <span className="px-4 py-2 rounded-lg bg-[#2a2a2e] font-semibold shadow-[0_0_8px_rgba(0,255,255,0.15)]">{projects.filter(p => p.isSolo).length} solo projects</span>
            <span>•</span>
            <span className="px-4 py-2 rounded-lg bg-[#2a2a2e] font-semibold shadow-[0_0_8px_rgba(0,255,255,0.15)]">{projects.filter(p => !p.isSolo).length} team projects</span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
            />
          </div>
          
          <select
            value={technologyFilter}
            onChange={(e) => setTechnologyFilter(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
          >
            <option value="all">All Technologies</option>
            {allTechnologies.map(tech => (
              <option key={tech} value={tech}>{tech}</option>
            ))}
          </select>

          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setTechnologyFilter('all');
            }}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>

        {/* Projects List */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            {projects.length === 0 ? (
              // Empty state when no projects exist
              <div className="space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Code className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-foreground">
                  No Projects Yet
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Start building your portfolio by adding your first project. 
                  Showcase your coding skills, creativity, and problem-solving abilities.
                </p>
                <Link href="/projects/new">
                  <Button size="lg" className="gap-2">
                    <Code className="h-5 w-5" />
                    Add Your First Project
                  </Button>
                </Link>
              </div>
            ) : (
              // No results from search/filter
              <div className="space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-foreground">
                  No Results Found
                </h2>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or technology filter.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setTechnologyFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onShare={handleShare}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 