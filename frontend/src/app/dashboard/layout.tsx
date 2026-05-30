'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, LayoutDashboard, Activity, AlertTriangle, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CyberGrid } from '@/components/home/CyberGrid';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/alerts', label: 'Threat Alerts', icon: AlertTriangle },
  { href: '/dashboard/intelligence', label: 'AI Intel', icon: Activity },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#0a0e17] overflow-hidden selection:bg-[#00f0ff] selection:text-[#0a0e17]">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <CyberGrid />
      </div>
      
      {/* Sidebar */}
      <aside className="relative z-20 w-64 border-r border-[rgba(0,240,255,0.1)] bg-[rgba(10,14,23,0.8)] backdrop-blur-md flex flex-col h-full shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-[rgba(0,240,255,0.1)]">
          <Link href="/" className="flex items-center gap-2 group">
            <Shield className="w-6 h-6 text-[#00f0ff] group-hover:neon-glow transition-all" />
            <span className="font-black tracking-widest text-lg uppercase text-white group-hover:text-[#00f0ff] transition-colors">Cyber<span className="text-[#00f0ff]">Oracle</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold uppercase tracking-wider transition-all',
                  isActive 
                    ? 'nav-active bg-[rgba(0,240,255,0.1)] text-[#00f0ff]' 
                    : 'text-[#94a3b8] hover:bg-[rgba(17,24,39,0.8)] hover:text-white'
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-[rgba(0,240,255,0.1)]">
          <div className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[#64748b] hover:text-white transition-colors cursor-pointer uppercase tracking-wider">
            <LogOut className="w-4 h-4" />
            Sign Out
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 lg:p-10 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
