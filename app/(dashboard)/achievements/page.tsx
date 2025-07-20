'use client';

import React, { useState, useEffect } from 'react';
import { useUserData } from '@/lib/context/UserDataContext';
import { AchievementCard } from '@/components/cards/AchievementCard';
import { Plus, Trophy, Filter, Search } from 'lucide-react';
import Link from 'next/link';
import { Achievement } from '@/lib/types';
import { useAchievements } from '@/lib/hooks/useFirestore';

export default function AchievementsPage() {
  const { achievements: contextAchievements, achievementsLoading, achievementsError } = useUserData();
  const { updateAchievement } = useAchievements();
  const [achievements, setAchievements] = useState(contextAchievements);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<'all' | 'online' | 'offline'>('all');

  // Sync local state with context when contextAchievements change
  useEffect(() => {
    setAchievements(contextAchievements);
  }, [contextAchievements]);

  const filteredAchievements = achievements.filter(achievement => {
    const searchString = (
      achievement.title +
      achievement.description +
      achievement.eventName +
      achievement.tags.join(' ')
    ).toLowerCase();
    
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesFilter = eventTypeFilter === 'all' || achievement.eventType === eventTypeFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Updated handleEdit function to accept id and updatedData
  const handleEdit = async (id: string, updatedData: Partial<Achievement>) => {
    setAchievements(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
    await updateAchievement(id, updatedData);
  };

  const handleDelete = (id: string) => {
    console.log('Delete achievement:', id);
  };

  const handleShare = (id: string) => {
    console.log('Share achievement:', id);
  };

  if (achievementsLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        {/* ... skeleton JSX ... */}
      </div>
    );
  }

  if (achievementsError) {
    return (
      <div className="min-h-screen bg-background p-6">
        {/* ... error JSX ... */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6" style={{ color: '#7fffd4', textShadow: '0 0 10px #7fffd4, 0 0 20px #7fffd4', fontFamily: 'var(--font-space-grotesk)' }}>
          CheckDisOut - Achievements
        </h1>
        {/* Stats and Add Achievement */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
            <span className="px-4 py-2 rounded-lg bg-[#2a2a2e] text-cyan-200 font-semibold text-sm shadow-[0_0_8px_rgba(0,255,255,0.15)]">{achievements.length} total achievements</span>
            <span className="px-4 py-2 rounded-lg bg-[#2a2a2e] text-cyan-200 font-semibold text-sm shadow-[0_0_8px_rgba(0,255,255,0.15)]">{achievements.filter(a => a.eventType === 'online').length} online events</span>
            <span className="px-4 py-2 rounded-lg bg-[#2a2a2e] text-cyan-200 font-semibold text-sm shadow-[0_0_8px_rgba(0,255,255,0.15)]">{achievements.filter(a => a.eventType === 'offline').length} offline events</span>
          </div>
          <Link href="/add-to-portfolio" className="flex-shrink-0">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-bold transition-all bg-purple-600/90 hover:bg-purple-600 shadow-[0_0_12px_rgba(147,51,234,0.7)] hover:shadow-[0_0_18px_rgba(147,51,234,0.9)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121212] focus:ring-cyan-400">
              <Plus className="h-5 w-5" />
              Add Achievement
            </button>
          </Link>
        </div>
        {/* Search Bar & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-300 pointer-events-none" />
            <input
              type="text"
              placeholder="Search achievements..."
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
        {/* Achievements Grid */}
        {filteredAchievements.length === 0 ? (
          <div className="text-center py-16">
            <Trophy className="mx-auto h-12 w-12 text-neutral-600 mb-4" />
            <h2 className="text-2xl font-bold text-neutral-400" style={{fontFamily: 'var(--font-space-grotesk)'}}>No Achievements Found</h2>
            <p className="text-neutral-500 mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
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