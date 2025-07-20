// ============================================================================
// CORE DATA MODELS
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  location?: string;
  bio?: string;
  profilePictureUrl?: string; // Cloudinary URL
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  qualities: string[]; // e.g., ["Creative", "Problem Solver", "Team Player"]
  skills: string[]; // e.g., ["React", "TypeScript", "Node.js"]
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  name: string;
  role?: string;
  email?: string;
  linkedin?: string;
  github?: string;
}

export interface Achievement {
  id: string;
  userId: string;
  title: string;
  description: string;
  eventName: string;
  eventType: 'online' | 'offline';
  eventDate: Date;
  position?: number; // 1st, 2nd, 3rd place, etc.
  isSolo: boolean;
  teamMembers?: TeamMember[];
  certificateUrl?: string; // Cloudinary URL
  certificatePublicId?: string; // For deletion
  tags: string[]; // e.g., ["Hackathon", "Web Development", "AI"]
  createdAt: Date;
  updatedAt: Date;
}

export interface Participation {
  id: string;
  userId: string;
  title: string;
  description: string;
  eventName: string;
  eventType: 'online' | 'offline';
  eventDate: Date;
  isSolo: boolean;
  teamMembers?: TeamMember[];
  certificateUrl?: string; // Cloudinary URL
  certificatePublicId?: string; // For deletion
  tags: string[]; // e.g., ["Workshop", "Conference", "Training"]
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  bannerImageUrl?: string; // Cloudinary URL
  bannerImagePublicId?: string; // For deletion
  isSolo: boolean;
  teamMembers?: TeamMember[];
  technologies: string[]; // e.g., ["React", "Node.js", "MongoDB"]
  tags: string[]; // e.g., ["Full Stack", "E-commerce", "API"]
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface AchievementFormData {
  title: string;
  description: string;
  eventName: string;
  eventType: 'online' | 'offline';
  eventDate: string; // ISO date string
  position?: number;
  isSolo: boolean;
  teamMembers: TeamMember[];
  certificate?: File;
  tags: string[];
}

export interface ParticipationFormData {
  title: string;
  description: string;
  eventName: string;
  eventType: 'online' | 'offline';
  eventDate: string; // ISO date string
  isSolo: boolean;
  teamMembers: TeamMember[];
  certificate?: File;
  tags: string[];
}

export interface ProjectFormData {
  name: string;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  bannerImage?: File;
  isSolo: boolean;
  teamMembers: TeamMember[];
  technologies: string[];
  tags: string[];
}

export interface ProfileFormData {
  name: string;
  phone?: string;
  location?: string;
  bio?: string;
  profilePicture?: File;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  qualities: string[];
  skills: string[];
}

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  metadata?: {
    creationTime?: string;
    lastSignInTime?: string;
  };
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

// ============================================================================
// CONTEXT TYPES
// ============================================================================

export interface UserDataState {
  user: User | null;
  achievements: Achievement[];
  participations: Participation[];
  projects: Project[];
  loading: boolean;
  error: string | null;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UploadResponse {
  url: string;
  public_id: string;
  secure_url: string;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface CardProps {
  data: Achievement | Participation | Project;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
}

export interface FormProps {
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  initialData?: any;
  loading?: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type ContentType = 'achievement' | 'participation' | 'project';

export type EventType = 'online' | 'offline';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type Status = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export type Phase = 'phase1' | 'phase2' | 'phase3' | 'phase4' | 'phase5' | 'phase6' | 'phase7' | 'phase8';

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: ValidationError[];
} 