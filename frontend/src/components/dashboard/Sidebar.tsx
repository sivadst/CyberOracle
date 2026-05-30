"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Shield,
  Activity,
  AlertTriangle,
  Search,
  BarChart3,
  Bot,
  Grid3X3,
  Heart,
  Settings,
  LogOut,
  ChevronLeft,
  Radio,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/stores";

const navItems = [
  { href: "/dashboard", label: "SOC Dashboard", icon: Shield },
  { href: "/dashboard/threats", label: "Threat Feed", icon: Activity },
  { href: "/dashboard/alerts", label: "Alerts", icon: AlertTriangle },
  { href: "/dashboard/intelligence", label: "Intelligence", icon: Search },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/mitre", label: "MITRE ATT&CK", icon: Grid3X3 },
  { href: "/dashboard/copilot", label: "AI Copilot", icon: Bot },
  { href: "/dashboard/health", label: "System Health", icon: Heart },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 240 }}
      className="fixed left-0 top-0 h-screen bg-[#0d1117] border-r border-[#1e293b]/50 z-50 flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-[#1e293b]/50">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col"
            >
              <span className="text-sm font-bold text-white tracking-wide">
                CyberOracle
              </span>
              <span className="text-[10px] text-cyan-400/60 uppercase tracking-widest">
                Threat Intel
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Live Status */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-[#1e293b]/30">
          <div className="flex items-center gap-2 text-xs">
            <Radio className="w-3 h-3 text-green-400 cyber-pulse" />
            <span className="text-green-400">LIVE</span>
            <span className="text-slate-500">| SOC Active</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                  )}
                >
                  <Icon className={cn("w-4 h-4 flex-shrink-0", isActive && "text-cyan-400")} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {isActive && !collapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User & Collapse */}
      <div className="border-t border-[#1e293b]/50 p-3">
        {!collapsed && user && (
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
              {user.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">
                {user.username}
              </div>
              <div className="text-[10px] text-slate-500 truncate">{user.role}</div>
            </div>
            <button
              onClick={logout}
              className="text-slate-500 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.03] transition-colors"
        >
          <ChevronLeft
            className={cn(
              "w-4 h-4 transition-transform duration-300",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </div>
    </motion.aside>
  );
}
