'use client';

import React, { useState } from 'react';
import { useUserData } from '@/lib/context/UserDataContext';
import Button from '@/components/ui/Button';
import { ParticipationCard } from '@/components/cards/ParticipationCard';
import { Search, Filter, Users, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ParticipationsPage() {
  const { participations, participationsLoading, participationsError } = useUserData();
  const [searchTerm, setSearchTerm] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<'all' | 'online' | 'offline'>('all');

  // Filter participations based on search and filter
  const filteredParticipations = participations.filter(participation => {
    const matchesSearch = participation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participation.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participation.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = eventTypeFilter === 'all' || participation.eventType === eventTypeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleEdit = (id: string) => {
    // TODO: Implement edit functionality
    console.log('Edit participation:', id);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality
    console.log('Delete participation:', id);
  };

  const handleShare = (id: string) => {
    // TODO: Implement share functionality
    console.log('Share participation:', id);
  };

  if (participationsLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-8">
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

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="p-6 bg-card border border-border rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full animate-pulse"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
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
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (participationsError) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
              Error Loading Participations
            </h2>
            <p className="text-muted-foreground mb-6">
              {participationsError}
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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-heading font-bold text-foreground">
                My Participations
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Track your event participations and experiences
              </p>
            </div>
            <Link href="/participations/new">
              <Button size="lg" className="gap-2">
                <Users className="h-5 w-5" />
                Add Participation
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>{participations.length} total participations</span>
            <span>•</span>
            <span>{participations.filter(p => p.eventType === 'online').length} online events</span>
            <span>•</span>
            <span>{participations.filter(p => p.eventType === 'offline').length} offline events</span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search participations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>
          
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value as 'all' | 'online' | 'offline')}
            className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
          >
            <option value="all">All Events</option>
            <option value="online">Online Events</option>
            <option value="offline">Offline Events</option>
          </select>

          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setEventTypeFilter('all');
            }}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>

        {/* Participations Grid */}
        {filteredParticipations.length === 0 ? (
          <div className="text-center py-12">
            {participations.length === 0 ? (
              // Empty state when no participations exist
              <div className="space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-foreground">
                  No Participations Yet
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Start tracking your event participations. Add workshops, conferences, 
                  training sessions, and other events you've attended.
                </p>
                <Link href="/participations/new">
                  <Button size="lg" className="gap-2">
                    <Users className="h-5 w-5" />
                    Add Your First Participation
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
                  Try adjusting your search terms or filters.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setEventTypeFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParticipations.map((participation) => (
              <ParticipationCard
                key={participation.id}
                participation={participation}
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