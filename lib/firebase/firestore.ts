import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot,
  writeBatch,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import { User, Achievement, Participation, Project } from '@/lib/types';

// ============================================================================
// TYPES
// ============================================================================

export interface FirestoreResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface FirestoreListResponse<T> {
  success: boolean;
  data?: T[];
  error?: string;
}

export interface FirestoreQueryOptions {
  limit?: number;
  orderBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  where?: {
    field: string;
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=';
    value: any;
  }[];
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const handleError = (error: any): string => {
  console.error('Firestore error:', error);
  return error.message || 'An unexpected error occurred';
};

const convertTimestamp = (timestamp: Timestamp | null): Date | null => {
  return timestamp ? timestamp.toDate() : null;
};

const convertToTimestamp = (date: Date | string | null): Timestamp | null => {
  if (!date) return null;
  if (typeof date === 'string') {
    return Timestamp.fromDate(new Date(date));
  }
  return Timestamp.fromDate(date);
};

// ============================================================================
// USERS COLLECTION
// ============================================================================

const USERS_COLLECTION = 'users';

export const userHelpers = {
  // Create user
  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreResponse<User>> {
    try {
      const userWithTimestamps = {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, USERS_COLLECTION), userWithTimestamps);
      const newUser: User = {
        id: docRef.id,
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return { success: true, data: newUser };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  // Get user by ID
  async getById(userId: string): Promise<FirestoreResponse<User>> {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { success: false, error: 'User not found' };
      }

      const userData = docSnap.data();
      const user: User = {
        id: docSnap.id,
        ...userData,
        createdAt: convertTimestamp(userData.createdAt) || new Date(),
        updatedAt: convertTimestamp(userData.updatedAt) || new Date(),
      } as User;

      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  // Get user by email
  async getByEmail(email: string): Promise<FirestoreResponse<User>> {
    try {
      const q = query(
        collection(db, USERS_COLLECTION),
        where('email', '==', email),
        limit(1)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { success: false, error: 'User not found' };
      }

      const docSnap = querySnapshot.docs[0];
      const userData = docSnap.data();
      const user: User = {
        id: docSnap.id,
        ...userData,
        createdAt: convertTimestamp(userData.createdAt) || new Date(),
        updatedAt: convertTimestamp(userData.updatedAt) || new Date(),
      } as User;

      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  // Update user
  async update(userId: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<FirestoreResponse<User>> {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(docRef, updateData);

      // Get updated user
      const updatedUser = await this.getById(userId);
      return updatedUser;
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  // Delete user
  async delete(userId: string): Promise<FirestoreResponse<void>> {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  // Get all users
  async getAll(options?: FirestoreQueryOptions): Promise<FirestoreListResponse<User>> {
    try {
      let q = collection(db, USERS_COLLECTION);

      if (options?.where) {
        options.where.forEach(condition => {
          q = query(q, where(condition.field, condition.operator, condition.value));
        });
      }

      if (options?.orderBy) {
        q = query(q, orderBy(options.orderBy.field, options.orderBy.direction));
      }

      if (options?.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      const users: User[] = [];

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const user: User = {
          id: doc.id,
          ...userData,
          createdAt: convertTimestamp(userData.createdAt) || new Date(),
          updatedAt: convertTimestamp(userData.updatedAt) || new Date(),
        } as User;
        users.push(user);
      });

      return { success: true, data: users };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },
};

// ============================================================================
// ACHIEVEMENTS COLLECTION
// ============================================================================

const ACHIEVEMENTS_COLLECTION = 'achievements';

export const achievementHelpers = {
  // Create achievement
  async create(achievementData: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreResponse<Achievement>> {
    try {
      const achievementWithTimestamps = {
        ...achievementData,
        eventDate: convertToTimestamp(achievementData.eventDate),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, ACHIEVEMENTS_COLLECTION), achievementWithTimestamps);
      const newAchievement: Achievement = {
        id: docRef.id,
        ...achievementData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return { success: true, data: newAchievement };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  // Get achievement by ID
  async getById(achievementId: string): Promise<FirestoreResponse<Achievement>> {
    try {
      const docRef = doc(db, ACHIEVEMENTS_COLLECTION, achievementId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { success: false, error: 'Achievement not found' };
      }

      const achievementData = docSnap.data();
      const achievement: Achievement = {
        id: docSnap.id,
        ...achievementData,
        eventDate: convertTimestamp(achievementData.eventDate) || new Date(),
        createdAt: convertTimestamp(achievementData.createdAt) || new Date(),
        updatedAt: convertTimestamp(achievementData.updatedAt) || new Date(),
      } as Achievement;

      return { success: true, data: achievement };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  // Get achievements by user ID
  async getByUserId(userId: string, options?: FirestoreQueryOptions): Promise<FirestoreListResponse<Achievement>> {
    try {
      let q = query(
        collection(db, ACHIEVEMENTS_COLLECTION),
        where('userId', '==', userId)
      );

      if (options?.orderBy) {
        q = query(q, orderBy(options.orderBy.field, options.orderBy.direction));
      } else {
        q = query(q, orderBy('eventDate', 'desc'));
      }

      if (options?.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      const achievements: Achievement[] = [];

      querySnapshot.forEach((doc) => {
        const achievementData = doc.data();
        const achievement: Achievement = {
          id: doc.id,
          ...achievementData,
          eventDate: convertTimestamp(achievementData.eventDate) || new Date(),
          createdAt: convertTimestamp(achievementData.createdAt) || new Date(),
          updatedAt: convertTimestamp(achievementData.updatedAt) || new Date(),
        } as Achievement;
        achievements.push(achievement);
      });

      return { success: true, data: achievements };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  // Update achievement
  async update(achievementId: string, updates: Partial<Omit<Achievement, 'id' | 'createdAt'>>): Promise<FirestoreResponse<Achievement>> {
    try {
      const docRef = doc(db, ACHIEVEMENTS_COLLECTION, achievementId);
      const updateData = {
        ...updates,
        eventDate: updates.eventDate ? convertToTimestamp(updates.eventDate) : undefined,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(docRef, updateData);

      // Get updated achievement
      const updatedAchievement = await this.getById(achievementId);
      return updatedAchievement;
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  // Delete achievement
  async delete(achievementId: string): Promise<FirestoreResponse<void>> {
    try {
      const docRef = doc(db, ACHIEVEMENTS_COLLECTION, achievementId);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  // Get all achievements
  async getAll(options?: FirestoreQueryOptions): Promise<FirestoreListResponse<Achievement>> {
    try {
      let q = collection(db, ACHIEVEMENTS_COLLECTION);

      if (options?.where) {
        options.where.forEach(condition => {
          q = query(q, where(condition.field, condition.operator, condition.value));
        });
      }

      if (options?.orderBy) {
        q = query(q, orderBy(options.orderBy.field, options.orderBy.direction));
      } else {
        q = query(q, orderBy('eventDate', 'desc'));
      }

      if (options?.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      const achievements: Achievement[] = [];

      querySnapshot.forEach((doc) => {
        const achievementData = doc.data();
        const achievement: Achievement = {
          id: doc.id,
          ...achievementData,
          eventDate: convertTimestamp(achievementData.eventDate) || new Date(),
          createdAt: convertTimestamp(achievementData.createdAt) || new Date(),
          updatedAt: convertTimestamp(achievementData.updatedAt) || new Date(),
        } as Achievement;
        achievements.push(achievement);
      });

      return { success: true, data: achievements };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },
};

// ============================================================================
// PARTICIPATIONS COLLECTION
// ============================================================================

const PARTICIPATIONS_COLLECTION = 'participations';

export const participationHelpers = {
  // Create participation
  async create(participationData: Omit<Participation, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreResponse<Participation>> {
    try {
      const participationWithTimestamps = {
        ...participationData,
        eventDate: convertToTimestamp(participationData.eventDate),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, PARTICIPATIONS_COLLECTION), participationWithTimestamps);
      const newParticipation: Participation = {
        id: docRef.id,
        ...participationData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return { success: true, data: newParticipation };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  // Get participation by ID
  async getById(participationId: string): Promise<FirestoreResponse<Participation>> {
    try {
      const docRef = doc(db, PARTICIPATIONS_COLLECTION, participationId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { success: false, error: 'Participation not found' };
      }

      const participationData = docSnap.data();
      const participation: Participation = {
        id: docSnap.id,
        ...participationData,
        eventDate: convertTimestamp(participationData.eventDate) || new Date(),
        createdAt: convertTimestamp(participationData.createdAt) || new Date(),
        updatedAt: convertTimestamp(participationData.updatedAt) || new Date(),
      } as Participation;

      return { success: true, data: participation };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  // Get participations by user ID
  async getByUserId(userId: string, options?: FirestoreQueryOptions): Promise<FirestoreListResponse<Participation>> {
    try {
      let q = query(
        collection(db, PARTICIPATIONS_COLLECTION),
        where('userId', '==', userId)
      );

      if (options?.orderBy) {
        q = query(q, orderBy(options.orderBy.field, options.orderBy.direction));
      } else {
        q = query(q, orderBy('eventDate', 'desc'));
      }

      if (options?.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      const participations: Participation[] = [];

      querySnapshot.forEach((doc) => {
        const participationData = doc.data();
        const participation: Participation = {
          id: doc.id,
          ...participationData,
          eventDate: convertTimestamp(participationData.eventDate) || new Date(),
          createdAt: convertTimestamp(participationData.createdAt) || new Date(),
          updatedAt: convertTimestamp(participationData.updatedAt) || new Date(),
        } as Participation;
        participations.push(participation);
      });

      return { success: true, data: participations };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  // Update participation
  async update(participationId: string, updates: Partial<Omit<Participation, 'id' | 'createdAt'>>): Promise<FirestoreResponse<Participation>> {
    try {
      const docRef = doc(db, PARTICIPATIONS_COLLECTION, participationId);
      const updateData = {
        ...updates,
        eventDate: updates.eventDate ? convertToTimestamp(updates.eventDate) : undefined,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(docRef, updateData);

      // Get updated participation
      const updatedParticipation = await this.getById(participationId);
      return updatedParticipation;
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  // Delete participation
  async delete(participationId: string): Promise<FirestoreResponse<void>> {
    try {
      const docRef = doc(db, PARTICIPATIONS_COLLECTION, participationId);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  // Get all participations
  async getAll(options?: FirestoreQueryOptions): Promise<FirestoreListResponse<Participation>> {
    try {
      let q = collection(db, PARTICIPATIONS_COLLECTION);

      if (options?.where) {
        options.where.forEach(condition => {
          q = query(q, where(condition.field, condition.operator, condition.value));
        });
      }

      if (options?.orderBy) {
        q = query(q, orderBy(options.orderBy.field, options.orderBy.direction));
      } else {
        q = query(q, orderBy('eventDate', 'desc'));
      }

      if (options?.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      const participations: Participation[] = [];

      querySnapshot.forEach((doc) => {
        const participationData = doc.data();
        const participation: Participation = {
          id: doc.id,
          ...participationData,
          eventDate: convertTimestamp(participationData.eventDate) || new Date(),
          createdAt: convertTimestamp(participationData.createdAt) || new Date(),
          updatedAt: convertTimestamp(participationData.updatedAt) || new Date(),
        } as Participation;
        participations.push(participation);
      });

      return { success: true, data: participations };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },
};

// ============================================================================
// PROJECTS COLLECTION
// ============================================================================

const PROJECTS_COLLECTION = 'projects';

export const projectHelpers = {
  // Create project
  async create(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreResponse<Project>> {
    try {
      const projectWithTimestamps = {
        ...projectData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), projectWithTimestamps);
      const newProject: Project = {
        id: docRef.id,
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return { success: true, data: newProject };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  // Get project by ID
  async getById(projectId: string): Promise<FirestoreResponse<Project>> {
    try {
      const docRef = doc(db, PROJECTS_COLLECTION, projectId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { success: false, error: 'Project not found' };
      }

      const projectData = docSnap.data();
      const project: Project = {
        id: docSnap.id,
        ...projectData,
        createdAt: convertTimestamp(projectData.createdAt) || new Date(),
        updatedAt: convertTimestamp(projectData.updatedAt) || new Date(),
      } as Project;

      return { success: true, data: project };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  // Get projects by user ID
  async getByUserId(userId: string, options?: FirestoreQueryOptions): Promise<FirestoreListResponse<Project>> {
    try {
      let q = query(
        collection(db, PROJECTS_COLLECTION),
        where('userId', '==', userId)
      );

      if (options?.orderBy) {
        q = query(q, orderBy(options.orderBy.field, options.orderBy.direction));
      } else {
        q = query(q, orderBy('createdAt', 'desc'));
      }

      if (options?.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      const projects: Project[] = [];

      querySnapshot.forEach((doc) => {
        const projectData = doc.data();
        const project: Project = {
          id: doc.id,
          ...projectData,
          createdAt: convertTimestamp(projectData.createdAt) || new Date(),
          updatedAt: convertTimestamp(projectData.updatedAt) || new Date(),
        } as Project;
        projects.push(project);
      });

      return { success: true, data: projects };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  // Update project
  async update(projectId: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<FirestoreResponse<Project>> {
    try {
      const docRef = doc(db, PROJECTS_COLLECTION, projectId);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(docRef, updateData);

      // Get updated project
      const updatedProject = await this.getById(projectId);
      return updatedProject;
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  // Delete project
  async delete(projectId: string): Promise<FirestoreResponse<void>> {
    try {
      const docRef = doc(db, PROJECTS_COLLECTION, projectId);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  // Get all projects
  async getAll(options?: FirestoreQueryOptions): Promise<FirestoreListResponse<Project>> {
    try {
      let q = collection(db, PROJECTS_COLLECTION);

      if (options?.where) {
        options.where.forEach(condition => {
          q = query(q, where(condition.field, condition.operator, condition.value));
        });
      }

      if (options?.orderBy) {
        q = query(q, orderBy(options.orderBy.field, options.orderBy.direction));
      } else {
        q = query(q, orderBy('createdAt', 'desc'));
      }

      if (options?.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      const projects: Project[] = [];

      querySnapshot.forEach((doc) => {
        const projectData = doc.data();
        const project: Project = {
          id: doc.id,
          ...projectData,
          createdAt: convertTimestamp(projectData.createdAt) || new Date(),
          updatedAt: convertTimestamp(projectData.updatedAt) || new Date(),
        } as Project;
        projects.push(project);
      });

      return { success: true, data: projects };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },
};

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

export const batchHelpers = {
  // Create multiple documents in a batch
  async createMultiple<T extends { id?: string }>(
    collectionName: string,
    documents: Omit<T, 'id'>[]
  ): Promise<FirestoreResponse<string[]>> {
    try {
      const batch = writeBatch(db);
      const docRefs: string[] = [];

      documents.forEach((doc) => {
        const docRef = doc(collection(db, collectionName));
        batch.set(docRef, {
          ...doc,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        docRefs.push(docRef.id);
      });

      await batch.commit();
      return { success: true, data: docRefs };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },

  // Delete multiple documents in a batch
  async deleteMultiple(collectionName: string, documentIds: string[]): Promise<FirestoreResponse<void>> {
    try {
      const batch = writeBatch(db);

      documentIds.forEach((id) => {
        const docRef = doc(db, collectionName, id);
        batch.delete(docRef);
      });

      await batch.commit();
      return { success: true };
    } catch (error) {
      return { success: false, error: handleError(error) };
    }
  },
};

// ============================================================================
// REAL-TIME LISTENERS
// ============================================================================

export const realtimeHelpers = {
  // Listen to user changes
  onUserChange(userId: string, callback: (user: User | null) => void) {
    const docRef = doc(db, USERS_COLLECTION, userId);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        const user: User = {
          id: doc.id,
          ...userData,
          createdAt: convertTimestamp(userData.createdAt) || new Date(),
          updatedAt: convertTimestamp(userData.updatedAt) || new Date(),
        } as User;
        callback(user);
      } else {
        callback(null);
      }
    });
  },

  // Listen to user's achievements
  onUserAchievementsChange(userId: string, callback: (achievements: Achievement[]) => void) {
    const q = query(
      collection(db, ACHIEVEMENTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('eventDate', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const achievements: Achievement[] = [];
      querySnapshot.forEach((doc) => {
        const achievementData = doc.data();
        const achievement: Achievement = {
          id: doc.id,
          ...achievementData,
          eventDate: convertTimestamp(achievementData.eventDate) || new Date(),
          createdAt: convertTimestamp(achievementData.createdAt) || new Date(),
          updatedAt: convertTimestamp(achievementData.updatedAt) || new Date(),
        } as Achievement;
        achievements.push(achievement);
      });
      callback(achievements);
    });
  },

  // Listen to user's participations
  onUserParticipationsChange(userId: string, callback: (participations: Participation[]) => void) {
    const q = query(
      collection(db, PARTICIPATIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('eventDate', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const participations: Participation[] = [];
      querySnapshot.forEach((doc) => {
        const participationData = doc.data();
        const participation: Participation = {
          id: doc.id,
          ...participationData,
          eventDate: convertTimestamp(participationData.eventDate) || new Date(),
          createdAt: convertTimestamp(participationData.createdAt) || new Date(),
          updatedAt: convertTimestamp(participationData.updatedAt) || new Date(),
        } as Participation;
        participations.push(participation);
      });
      callback(participations);
    });
  },

  // Listen to user's projects
  onUserProjectsChange(userId: string, callback: (projects: Project[]) => void) {
    const q = query(
      collection(db, PROJECTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const projects: Project[] = [];
      querySnapshot.forEach((doc) => {
        const projectData = doc.data();
        const project: Project = {
          id: doc.id,
          ...projectData,
          createdAt: convertTimestamp(projectData.createdAt) || new Date(),
          updatedAt: convertTimestamp(projectData.updatedAt) || new Date(),
        } as Project;
        projects.push(project);
      });
      callback(projects);
    });
  },
}; 