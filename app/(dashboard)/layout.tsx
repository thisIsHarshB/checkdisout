'use client';

import React from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import AuthGuard from '@/components/layout/AuthGuard';
import Navbar from '@/components/layout/Navbar';
import { UserDataProvider } from '@/lib/context/UserDataContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <UserDataProvider>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="lg:ml-24 transition-all duration-300">
            {children}
          </main>
        </div>
      </UserDataProvider>
    </AuthGuard>
  );
} 