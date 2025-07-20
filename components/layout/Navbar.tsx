'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  Home,
  Trophy,
  Users,
  FolderOpen,
  User,
  Upload,
  Plus,
  GraduationCap,
  RefreshCw,
  Grid3X3
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'main' | 'secondary';
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/dashboard', icon: Home, category: 'main' },
  { label: 'Achievements', href: '/achievements', icon: GraduationCap, category: 'main' },
  { label: 'Participations', href: '/participations', icon: RefreshCw, category: 'main' },
  { label: 'Projects', href: '/projects', icon: Grid3X3, category: 'main' },
  { label: 'Export Portfolio', href: '/export', icon: Upload, category: 'main' },
  { label: 'Add To Portfolio', href: '/add-to-portfolio', icon: Plus, category: 'secondary' },
  { label: 'Profile', href: '/profile', icon: User, category: 'secondary' },
];

export default function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobile = () => {
    setIsMobileOpen(false);
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const mainNavItems = navItems.filter(item => item.category === 'main');
  const secondaryNavItems = navItems.filter(item => item.category === 'secondary');

  const NavbarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-800">
      {/* CDO Header */}
      <div className="px-4 py-6 border-b border-gray-800">
        <div className="text-center">
          <h1 className="text-xl font-heading font-bold text-gray-100">
            CDO
          </h1>
        </div>
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile ? closeMobile : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                "text-gray-300 hover:text-white hover:bg-gray-800",
                active && "text-white bg-gray-800",
                isCollapsed && !isMobile && "justify-center"
              )}
            >
              <Icon className="h-5 w-5" />
              {(!isCollapsed || isMobile) && (
                <span className="font-sans text-sm">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Secondary Navigation Items */}
      <nav className="px-4 py-4 space-y-2">
        {secondaryNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile ? closeMobile : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                "text-gray-300 hover:text-white hover:bg-gray-800",
                active && "text-white bg-gray-800",
                isCollapsed && !isMobile && "justify-center"
              )}
            >
              <Icon className="h-5 w-5" />
              {(!isCollapsed || isMobile) && (
                <span className="font-sans text-sm">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="px-4 py-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all duration-200",
            "text-gray-300 hover:text-white hover:bg-red-600",
            isCollapsed && !isMobile && "justify-center"
          )}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {(!isCollapsed || isMobile) && (
            <span className="font-sans text-sm">Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Navbar */}
      <div className={cn(
        "fixed left-0 top-0 h-full z-40 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <NavbarContent />
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Mobile Navbar */}
      <div className={cn(
        "fixed left-0 top-0 h-full z-50 transition-transform duration-300 lg:hidden",
        isMobileOpen ? "translate-x-0" : "-translate-x-full",
        "w-64"
      )}>
        <NavbarContent isMobile />
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg border border-gray-700 lg:hidden"
        aria-label="Toggle navigation"
      >
        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Main Content Spacer */}
      <div className={cn(
        "transition-all duration-300",
        isCollapsed ? "lg:ml-16" : "lg:ml-64"
      )} />
    </>
  );
} 