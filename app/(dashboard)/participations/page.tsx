'use client';

import React, { useState } from 'react';
import { useUserData } from '@/lib/context/UserDataContext';
import Button from '@/components/ui/Button';
import { ParticipationCard } from '@/components/cards/ParticipationCard';
import { Search, Filter, Users, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { useParticipations } from '@/lib/hooks/useFirestore';
import { Participation } from '@/lib/types';

export default function ParticipationsPage() {
  const { participations: contextParticipations, participationsLoading, participationsError } = useUserData();
  const { updateParticipation } = useParticipations();
  const [participations, setParticipations] = useState(contextParticipations);
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

  const handleEdit = async (id: string, updatedData: Partial<Participation>) => {
    setParticipations(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    await updateParticipation(id, updatedData);
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
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <SkeletonLoader width="33%" height={32} className="mb-2" />
            <SkeletonLoader width="50%" height={16} />
          </div>

          {/* Search and Filter Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4">
            <SkeletonLoader height={40} className="flex-1" />
            <SkeletonLoader height={40} width={128} />
            <SkeletonLoader height={40} width={128} />
          </div>

          {/* Single Column Skeleton */}
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="space-y-4">
                <SkeletonLoader height={192} />
                <div className="p-6 bg-card border border-border rounded-lg space-y-4">
                  <div className="flex items-center gap-3">
                    <SkeletonLoader width={40} height={40} shape="circle" />
                    <div className="space-y-2 flex-1">
                      <SkeletonLoader height={20} />
                      <SkeletonLoader height={12} width="33%" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <SkeletonLoader height={16} />
                    <SkeletonLoader height={16} width="80%" />
                    <SkeletonLoader height={16} width="60%" />
                  </div>
                  <div className="flex gap-2">
                    <SkeletonLoader height={24} width={64} />
                    <SkeletonLoader height={24} width={80} />
                  </div>
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
    <div className="min-h-screen bg-[#121212] text-white font-sans p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6" style={{ color: '#7fffd4', textShadow: '0 0 10px #7fffd4, 0 0 20px #7fffd4', fontFamily: 'var(--font-space-grotesk)' }}>
          CheckDisOut - Participations
        </h1>
        {/* Stats and Add Participation */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
            <span className="px-4 py-2 rounded-lg bg-[#2a2a2e] text-cyan-200 font-semibold text-sm shadow-[0_0_8px_rgba(0,255,255,0.15)]">{participations.length} total participations</span>
            <span className="px-4 py-2 rounded-lg bg-[#2a2a2e] text-cyan-200 font-semibold text-sm shadow-[0_0_8px_rgba(0,255,255,0.15)]">{participations.filter(p => p.eventType === 'online').length} online events</span>
            <span className="px-4 py-2 rounded-lg bg-[#2a2a2e] text-cyan-200 font-semibold text-sm shadow-[0_0_8px_rgba(0,255,255,0.15)]">{participations.filter(p => p.eventType === 'offline').length} offline events</span>
          </div>
          <Link href="/add-to-portfolio" className="flex-shrink-0">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-bold transition-all bg-purple-600/90 hover:bg-purple-600 shadow-[0_0_12px_rgba(147,51,234,0.7)] hover:shadow-[0_0_18px_rgba(147,51,234,0.9)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121212] focus:ring-cyan-400">
              <Plus className="h-5 w-5" />
              Add Participation
            </button>
          </Link>
        </div>
        {/* Search Bar & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-300 pointer-events-none" />
            <input
              type="text"
              placeholder="Search participations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-[#2a2a2e] rounded-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-[0_0_12px_rgba(0,255,255,0.15)] placeholder-cyan-200/70"
            />
          </div>
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value as 'all' | 'online' | 'offline')}
            className="px-4 py-2.5 bg-[#2a2a2e] rounded-lg text-cyan-200 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-[0_0_12px_rgba(0,255,255,0.15)]"
          >
            <option value="all">All Events</option>
            <option value="online">Online Events</option>
            <option value="offline">Offline Events</option>
          </select>
          <button
            onClick={() => {
              setSearchTerm('');
              setEventTypeFilter('all');
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2a2a2e] rounded-lg text-cyan-200 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-[0_0_12px_rgba(0,255,255,0.15)] hover:bg-cyan-400/10 transition-colors"
          >
            <Filter className="h-4 w-4" />
            Clear Filters
          </button>
        </div>
        {/* Participations Grid */}
        {filteredParticipations.length === 0 ? (
          <div className="text-center py-16">
            <Users className="mx-auto h-12 w-12 text-neutral-600 mb-4" />
            <h2 className="text-2xl font-bold text-neutral-400" style={{fontFamily: 'var(--font-space-grotesk)'}}>No Participations Found</h2>
            <p className="text-neutral-500 mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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