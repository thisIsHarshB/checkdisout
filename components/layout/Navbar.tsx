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
  Settings,
  LogOut,
  Menu,
  X,
  Award,
  Calendar,
  BarChart3
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Achievements', href: '/achievements', icon: Trophy },
  { label: 'Participations', href: '/participations', icon: Award },
  { label: 'Projects', href: '/projects', icon: FolderOpen },
  { label: 'Team', href: '/team', icon: Users },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Settings', href: '/settings', icon: Settings },
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

  const NavbarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={cn(
      "flex flex-col h-full",
      isMobile ? "w-full" : "w-full"
    )}>
      {/* Logo Section */}
      <div className={cn(
        "flex items-center px-4 py-6 border-b border-gray-700",
        isCollapsed && !isMobile ? "justify-center" : "justify-between"
      )}>
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CDO</span>
          </div>
          {(!isCollapsed || isMobile) && (
            <span className="text-xl font-bold text-white font-['Space_Grotesk']">
              CheckDisOut
            </span>
          )}
        </Link>
        
        {!isMobile && (
          <button
            onClick={toggleCollapse}
            className="p-1 rounded-lg hover:bg-gray-700 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <Menu className="h-4 w-4 text-gray-400" />
            ) : (
              <X className="h-4 w-4 text-gray-400" />
            )}
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile ? closeMobile : undefined}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200",
                "hover:bg-gray-700 hover:text-white",
                active 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "text-gray-300",
                isCollapsed && !isMobile && "justify-center"
              )}
            >
              <Icon className={cn(
                "h-5 w-5",
                isCollapsed && !isMobile && "h-6 w-6"
              )} />
              {(!isCollapsed || isMobile) && (
                <span className="font-medium">{item.label}</span>
              )}
              {item.badge && (!isCollapsed || isMobile) && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="px-4 py-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors duration-200",
            "text-gray-300 hover:bg-red-600 hover:text-white",
            isCollapsed && !isMobile && "justify-center"
          )}
        >
          <LogOut className={cn(
            "h-5 w-5",
            isCollapsed && !isMobile && "h-6 w-6"
          )} />
          {(!isCollapsed || isMobile) && (
            <span className="font-medium">Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Navbar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-700 z-40 transition-all duration-300",
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
        "fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-700 z-50 transition-transform duration-300 lg:hidden",
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
        <Menu className="h-5 w-5 text-white" />
      </button>

      {/* Main Content Spacer */}
      <div className={cn(
        "transition-all duration-300",
        isCollapsed ? "lg:ml-16" : "lg:ml-64"
      )} />
    </>
  );
} 