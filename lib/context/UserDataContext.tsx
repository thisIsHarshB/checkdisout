'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useUser, useAchievements, useParticipations, useProjects } from '@/lib/hooks/useFirestore';
import { User, Achievement, Participation, Project } from '@/lib/types';

interface UserDataContextType {
  // User data
  user: User | null;
  userLoading: boolean;
  userError: string | null;
  
  // Achievements
  achievements: Achievement[];
  achievementsLoading: boolean;
  achievementsError: string | null;
  
  // Participations
  participations: Participation[];
  participationsLoading: boolean;
  participationsError: string | null;
  
  // Projects
  projects: Project[];
  projectsLoading: boolean;
  projectsError: string | null;
  
  // Overall loading state
  isLoading: boolean;
  
  // Actions
  refreshUser: () => Promise<void>;
  refreshAchievements: () => Promise<void>;
  refreshParticipations: () => Promise<void>;
  refreshProjects: () => Promise<void>;
  refreshAll: () => Promise<void>;
  
  // Stats
  stats: {
    totalAchievements: number;
    totalParticipations: number;
    totalProjects: number;
    recentAchievements: Achievement[];
    recentParticipations: Participation[];
    recentProjects: Project[];
  };
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

interface UserDataProviderProps {
  children: ReactNode;
}

export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  const { user: authUser } = useAuth();
  
  // Use the existing hooks
  const { user, loading: userLoading, error: userError, updateUser, deleteUser } = useUser();
  const { 
    achievements, 
    loading: achievementsLoading, 
    error: achievementsError,
    createAchievement,
    updateAchievement,
    deleteAchievement,
    getAchievement
  } = useAchievements();
  const { 
    participations, 
    loading: participationsLoading, 
    error: participationsError,
    createParticipation,
    updateParticipation,
    deleteParticipation,
    getParticipation
  } = useParticipations();
  const { 
    projects, 
    loading: projectsLoading, 
    error: projectsError,
    createProject,
    updateProject,
    deleteProject,
    getProject
  } = useProjects();

  // Refresh functions (these will trigger re-fetches)
  const refreshUser = async () => {
    // The hooks handle real-time updates automatically
    return Promise.resolve();
  };

  const refreshAchievements = async () => {
    // The hooks handle real-time updates automatically
    return Promise.resolve();
  };

  const refreshParticipations = async () => {
    // The hooks handle real-time updates automatically
    return Promise.resolve();
  };

  const refreshProjects = async () => {
    // The hooks handle real-time updates automatically
    return Promise.resolve();
  };

  const refreshAll = async () => {
    // The hooks handle real-time updates automatically
    return Promise.resolve();
  };

  // Calculate stats
  const stats = {
    totalAchievements: achievements.length,
    totalParticipations: participations.length,
    totalProjects: projects.length,
    recentAchievements: achievements
      .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
      .slice(0, 3),
    recentParticipations: participations
      .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
      .slice(0, 3),
    recentProjects: projects
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3),
  };

  // Overall loading state
  const isLoading = userLoading || achievementsLoading || participationsLoading || projectsLoading;

  const value: UserDataContextType = {
    // User data
    user,
    userLoading,
    userError,
    
    // Achievements
    achievements,
    achievementsLoading,
    achievementsError,
    
    // Participations
    participations,
    participationsLoading,
    participationsError,
    
    // Projects
    projects,
    projectsLoading,
    projectsError,
    
    // Overall loading state
    isLoading,
    
    // Actions
    refreshUser,
    refreshAchievements,
    refreshParticipations,
    refreshProjects,
    refreshAll,
    
    // Stats
    stats,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}; 