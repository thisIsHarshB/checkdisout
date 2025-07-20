'use client';

import React from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import AuthGuard from './AuthGuard';
import Navbar from './Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <main className="lg:ml-64 transition-all duration-300">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
} 