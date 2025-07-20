'use client';

import React, { useState } from 'react';
import { useUserData } from '@/lib/context/UserDataContext';
import Button from '@/components/ui/Button';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { Search, Filter, Code, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ProjectsPage() {
  const { projects, projectsLoading, projectsError } = useUserData();
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

  const handleEdit = (id: string) => {
    // TODO: Implement edit functionality
    console.log('Edit project:', id);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality
    console.log('Delete project:', id);
  };

  const handleShare = (id: string) => {
    // TODO: Implement share functionality
    console.log('Share project:', id);
  };

  if (projectsLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse w-1/3"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
          </div>

          {/* Search and Filter Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="h-10 bg-muted rounded animate-pulse flex-1"></div>
            <div className="h-10 bg-muted rounded animate-pulse w-32"></div>
            <div className="h-10 bg-muted rounded animate-pulse w-32"></div>
          </div>

          {/* Single Column Skeleton */}
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="space-y-4">
                <div className="h-48 bg-muted rounded animate-pulse"></div>
                <div className="p-6 bg-card border border-border rounded-lg space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-5 bg-muted rounded animate-pulse"></div>
                      <div className="h-3 bg-muted rounded animate-pulse w-1/3"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 bg-muted rounded animate-pulse w-4/5"></div>
                    <div className="h-4 bg-muted rounded animate-pulse w-3/5"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted rounded animate-pulse w-16"></div>
                    <div className="h-6 bg-muted rounded animate-pulse w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (projectsError) {
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
              {projectsError}
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-heading font-bold text-foreground">
                My Projects
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Showcase your development projects and contributions
              </p>
            </div>
            <Link href="/projects/new">
              <Button size="lg" className="gap-2">
                <Code className="h-5 w-5" />
                Add Project
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>{projects.length} total projects</span>
            <span>•</span>
            <span>{projects.filter(p => p.isSolo).length} solo projects</span>
            <span>•</span>
            <span>{projects.filter(p => !p.isSolo).length} team projects</span>
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
          <div className="space-y-6">
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