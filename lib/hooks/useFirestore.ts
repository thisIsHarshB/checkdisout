'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  userHelpers,
  achievementHelpers,
  participationHelpers,
  projectHelpers,
  realtimeHelpers,
  FirestoreResponse,
  FirestoreListResponse,
  FirestoreQueryOptions
} from '@/lib/firebase/firestore';
import { User, Achievement, Participation, Project } from '@/lib/types';

// ============================================================================
// USER HOOKS
// ============================================================================

export const useUser = (userId?: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: authUser } = useAuth();

  const targetUserId = userId || authUser?.uid;

  useEffect(() => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = realtimeHelpers.onUserChange(targetUserId, (userData) => {
      setUser(userData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [targetUserId]);

  const updateUser = useCallback(async (updates: Partial<Omit<User, 'id' | 'createdAt'>>) => {
    if (!targetUserId) return { success: false, error: 'No user ID provided' };

    setError(null);
    const result = await userHelpers.update(targetUserId, updates);
    
    if (!result.success) {
      setError(result.error || 'Failed to update user');
    }
    
    return result;
  }, [targetUserId]);

  const deleteUser = useCallback(async () => {
    if (!targetUserId) return { success: false, error: 'No user ID provided' };

    setError(null);
    const result = await userHelpers.delete(targetUserId);
    
    if (!result.success) {
      setError(result.error || 'Failed to delete user');
    }
    
    return result;
  }, [targetUserId]);

  return {
    user,
    loading,
    error,
    updateUser,
    deleteUser,
  };
};

// ============================================================================
// ACHIEVEMENT HOOKS
// ============================================================================

export const useAchievements = (userId?: string, options?: FirestoreQueryOptions) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const { user: authUser } = useAuth();

  const targetUserId = userId || authUser?.uid;
  const pageSize = options?.limit || 10;

  const fetchAchievements = useCallback(async (startAfterDoc?: any) => {
    setLoading(true);
    setError(null);
    try {
      const queryOptions: FirestoreQueryOptions = {
        ...options,
        limit: pageSize,
        startAfter: startAfterDoc || undefined,
      };
      const result = await achievementHelpers.getByUserId(targetUserId, queryOptions);
      if (result.success && result.data) {
        setAchievements(prev => startAfterDoc ? [...prev, ...result.data!] : result.data!);
        setLastDoc(result.data.length > 0 ? result.data[result.data.length - 1] : null);
      } else {
        setError(result.error || 'Failed to fetch achievements');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [targetUserId, options, pageSize]);

  useEffect(() => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }
    fetchAchievements();
  }, [targetUserId, fetchAchievements]);

  const fetchMore = () => {
    if (lastDoc) fetchAchievements(lastDoc);
  };

  const createAchievement = useCallback(async (achievementData: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!targetUserId) return { success: false, error: 'No user ID provided' };

    setError(null);
    const result = await achievementHelpers.create({
      ...achievementData,
      userId: targetUserId,
    });
    
    if (!result.success) {
      setError(result.error || 'Failed to create achievement');
    }
    
    return result;
  }, [targetUserId]);

  const updateAchievement = useCallback(async (achievementId: string, updates: Partial<Omit<Achievement, 'id' | 'createdAt'>>) => {
    setError(null);
    const result = await achievementHelpers.update(achievementId, updates);
    
    if (!result.success) {
      setError(result.error || 'Failed to update achievement');
    }
    
    return result;
  }, []);

  const deleteAchievement = useCallback(async (achievementId: string) => {
    setError(null);
    const result = await achievementHelpers.delete(achievementId);
    
    if (!result.success) {
      setError(result.error || 'Failed to delete achievement');
    }
    
    return result;
  }, []);

  const getAchievement = useCallback(async (achievementId: string) => {
    setError(null);
    const result = await achievementHelpers.getById(achievementId);
    
    if (!result.success) {
      setError(result.error || 'Failed to get achievement');
    }
    
    return result;
  }, []);

  return {
    achievements,
    loading,
    error,
    fetchMore,
    createAchievement,
    updateAchievement,
    deleteAchievement,
    getAchievement,
  };
};

// ============================================================================
// PARTICIPATION HOOKS
// ============================================================================

export const useParticipations = (userId?: string, options?: FirestoreQueryOptions) => {
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const { user: authUser } = useAuth();

  const targetUserId = userId || authUser?.uid;
  const pageSize = options?.limit || 10;

  const fetchParticipations = useCallback(async (startAfterDoc?: any) => {
    setLoading(true);
    setError(null);
    try {
      const queryOptions: FirestoreQueryOptions = {
        ...options,
        limit: pageSize,
        startAfter: startAfterDoc || undefined,
      };
      const result = await participationHelpers.getByUserId(targetUserId, queryOptions);
      if (result.success && result.data) {
        setParticipations(prev => startAfterDoc ? [...prev, ...result.data!] : result.data!);
        setLastDoc(result.data.length > 0 ? result.data[result.data.length - 1] : null);
      } else {
        setError(result.error || 'Failed to fetch participations');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [targetUserId, options, pageSize]);

  useEffect(() => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }
    fetchParticipations();
  }, [targetUserId, fetchParticipations]);

  const fetchMore = () => {
    if (lastDoc) fetchParticipations(lastDoc);
  };

  const createParticipation = useCallback(async (participationData: Omit<Participation, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!targetUserId) return { success: false, error: 'No user ID provided' };

    setError(null);
    const result = await participationHelpers.create({
      ...participationData,
      userId: targetUserId,
    });
    
    if (!result.success) {
      setError(result.error || 'Failed to create participation');
    }
    
    return result;
  }, [targetUserId]);

  const updateParticipation = useCallback(async (participationId: string, updates: Partial<Omit<Participation, 'id' | 'createdAt'>>) => {
    setError(null);
    const result = await participationHelpers.update(participationId, updates);
    
    if (!result.success) {
      setError(result.error || 'Failed to update participation');
    }
    
    return result;
  }, []);

  const deleteParticipation = useCallback(async (participationId: string) => {
    setError(null);
    const result = await participationHelpers.delete(participationId);
    
    if (!result.success) {
      setError(result.error || 'Failed to delete participation');
    }
    
    return result;
  }, []);

  const getParticipation = useCallback(async (participationId: string) => {
    setError(null);
    const result = await participationHelpers.getById(participationId);
    
    if (!result.success) {
      setError(result.error || 'Failed to get participation');
    }
    
    return result;
  }, []);

  return {
    participations,
    loading,
    error,
    fetchMore,
    createParticipation,
    updateParticipation,
    deleteParticipation,
    getParticipation,
  };
};

// ============================================================================
// PROJECT HOOKS
// ============================================================================

export const useProjects = (userId?: string, options?: FirestoreQueryOptions) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const { user: authUser } = useAuth();

  const targetUserId = userId || authUser?.uid;
  const pageSize = options?.limit || 10;

  const fetchProjects = useCallback(async (startAfterDoc?: any) => {
    setLoading(true);
    setError(null);
    try {
      const queryOptions: FirestoreQueryOptions = {
        ...options,
        limit: pageSize,
        startAfter: startAfterDoc || undefined,
      };
      const result = await projectHelpers.getByUserId(targetUserId, queryOptions);
      if (result.success && result.data) {
        setProjects(prev => startAfterDoc ? [...prev, ...result.data!] : result.data!);
        setLastDoc(result.data.length > 0 ? result.data[result.data.length - 1] : null);
      } else {
        setError(result.error || 'Failed to fetch projects');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [targetUserId, options, pageSize]);

  useEffect(() => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }
    fetchProjects();
  }, [targetUserId, fetchProjects]);

  const fetchMore = () => {
    if (lastDoc) fetchProjects(lastDoc);
  };

  const createProject = useCallback(async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!targetUserId) return { success: false, error: 'No user ID provided' };

    setError(null);
    const result = await projectHelpers.create({
      ...projectData,
      userId: targetUserId,
    });
    
    if (!result.success) {
      setError(result.error || 'Failed to create project');
    }
    
    return result;
  }, [targetUserId]);

  const updateProject = useCallback(async (projectId: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
    setError(null);
    const result = await projectHelpers.update(projectId, updates);
    
    if (!result.success) {
      setError(result.error || 'Failed to update project');
    }
    
    return result;
  }, []);

  const deleteProject = useCallback(async (projectId: string) => {
    setError(null);
    const result = await projectHelpers.delete(projectId);
    
    if (!result.success) {
      setError(result.error || 'Failed to delete project');
    }
    
    return result;
  }, []);

  const getProject = useCallback(async (projectId: string) => {
    setError(null);
    const result = await projectHelpers.getById(projectId);
    
    if (!result.success) {
      setError(result.error || 'Failed to get project');
    }
    
    return result;
  }, []);

  return {
    projects,
    loading,
    error,
    fetchMore,
    createProject,
    updateProject,
    deleteProject,
    getProject,
  };
};

// ============================================================================
// GENERAL DATA HOOKS
// ============================================================================

export const useFirestoreData = <T>(
  collectionName: string,
  queryOptions?: FirestoreQueryOptions
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let result: FirestoreListResponse<T>;

      switch (collectionName) {
        case 'users':
          result = await userHelpers.getAll(queryOptions) as FirestoreListResponse<T>;
          break;
        case 'achievements':
          result = await achievementHelpers.getAll(queryOptions) as FirestoreListResponse<T>;
          break;
        case 'participations':
          result = await participationHelpers.getAll(queryOptions) as FirestoreListResponse<T>;
          break;
        case 'projects':
          result = await projectHelpers.getAll(queryOptions) as FirestoreListResponse<T>;
          break;
        default:
          throw new Error(`Unknown collection: ${collectionName}`);
      }

      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [collectionName, queryOptions]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

// ============================================================================
// STATISTICS HOOKS
// ============================================================================

export const useUserStats = (userId?: string) => {
  const { user: authUser } = useAuth();
  const targetUserId = userId || authUser?.uid;

  const { achievements } = useAchievements(targetUserId);
  const { participations } = useParticipations(targetUserId);
  const { projects } = useProjects(targetUserId);

  const stats = {
    totalAchievements: achievements.length,
    totalParticipations: participations.length,
    totalProjects: projects.length,
    recentAchievements: achievements.slice(0, 5),
    recentParticipations: participations.slice(0, 5),
    recentProjects: projects.slice(0, 5),
  };

  return stats;
};

// ============================================================================
// CONVENIENCE FUNCTIONS FOR ADD-TO-PORTFOLIO PAGE
// ============================================================================

export const addAchievement = async (userId: string, data: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
  if (!userId) {
    throw new Error('User not authenticated');
  }
  const result = await achievementHelpers.create({
    ...data,
    userId,
  });
  if (!result.success) {
    throw new Error(result.error || 'Failed to create achievement');
  }
  return result;
};

export const addParticipation = async (userId: string, data: Omit<Participation, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
  if (!userId) {
    throw new Error('User not authenticated');
  }
  const result = await participationHelpers.create({
    ...data,
    userId,
  });
  if (!result.success) {
    throw new Error(result.error || 'Failed to create participation');
  }
  return result;
};

export const addProject = async (userId: string, data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
  if (!userId) {
    throw new Error('User not authenticated');
  }
  const result = await projectHelpers.create({
    ...data,
    userId,
  });
  if (!result.success) {
    throw new Error(result.error || 'Failed to create project');
  }
  return result;
}; 