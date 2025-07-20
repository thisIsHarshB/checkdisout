'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser, AuthState } from '../types';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle, 
  logout, 
  onAuthStateChange,
  getCurrentUser 
} from '../firebase/auth';

interface AuthContextType extends AuthState {
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSignInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const authUser = await signInWithEmail(email, password);
      setUser(authUser);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      setError(null);
      const authUser = await signUpWithEmail(email, password, displayName);
      setUser(authUser);
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const authUser = await signInWithGoogle();
      setUser(authUser);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      setError(null);
      await logout();
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'Failed to logout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signInWithEmail: handleSignInWithEmail,
    signUpWithEmail: handleSignUpWithEmail,
    signInWithGoogle: handleSignInWithGoogle,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 