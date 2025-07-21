'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import {
  Home,
  GraduationCap,
  FileCode2,
  LayoutGrid,
  FileUp,
  CirclePlus,
  CircleUser,
  LogOut
} from 'lucide-react';

const navIcons = [
  { href: '/dashboard', icon: Home },
  { href: '/achievements', icon: GraduationCap },
  { href: '/participations', icon: FileCode2 },
  { href: '/projects', icon: LayoutGrid },
  { href: '/export-portfolio', icon: FileUp },
];
const bottomIcons = [
  { href: '/add-to-portfolio', icon: CirclePlus },
  { href: '/profile', icon: CircleUser },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="fixed left-0 top-0 h-full w-24 bg-[#23241e] flex flex-col items-center justify-between py-4 z-50 border-r border-black font-primary">
      <style jsx global>{`
        .navbar-glow:hover {
          color: #f1ffe7 !important;
          filter: drop-shadow(0 0 8px #f1ffe7) drop-shadow(0 0 16px #f1ffe7);
        }
      `}</style>
      {/* Top: CDO */}
      <div className="flex flex-col items-center gap-8 w-full font-heading">
        <Link href="/dashboard">
          <div
            className="text-2xl font-bold text-gray-100 mb-6 tracking-widest font-heading cursor-pointer"
            style={{ textShadow: '0 0 8px #f1ffe7', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            CDO
          </div>
        </Link>
        <div className="flex flex-col gap-10 w-full items-center">
          {navIcons.map(({ href, icon: Icon }, i) => (
            <Link key={href} href={href} className="flex items-center justify-center w-full group">
              <Icon
                className={`h-6 w-6 mx-auto transition-colors navbar-glow ${
                  pathname === href ? 'text-[#00D4FF]' : 'text-[#f1ffe7]'
                }`}
              />
            </Link>
          ))}
        </div>
      </div>
      {/* Bottom: Add & Profile & Logout */}
      <div className="flex flex-col gap-8 mb-10 w-full items-center">
        {bottomIcons.map(({ href, icon: Icon }, i) => (
          <Link key={href} href={href} className="flex items-center justify-center w-full group">
            <Icon
              className={`h-6 w-6 mx-auto transition-colors navbar-glow ${
                pathname === href ? 'text-[#00D4FF]' : 'text-[#e0ffe0]'
              }`}
            />
          </Link>
        ))}
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full group"
          title="Logout"
        >
          <LogOut className="h-6 w-6 mx-auto transition-colors navbar-glow text-[#ff6b6b] hover:text-[#ff5252]" />
        </button>
      </div>
    </div>
  );
} 