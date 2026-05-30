import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export const severityColors: Record<string, string> = {
  critical: "text-red-400 bg-red-500/10 border-red-500/30",
  high: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  low: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  info: "text-slate-400 bg-slate-500/10 border-slate-500/30",
};

export const severityDotColors: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-cyan-500",
  info: "bg-slate-500",
};

export const verdictColors: Record<string, string> = {
  malicious: "text-red-400 bg-red-500/10",
  suspicious: "text-amber-400 bg-amber-500/10",
  benign: "text-green-400 bg-green-500/10",
  unknown: "text-slate-400 bg-slate-500/10",
};

export const statusColors: Record<string, string> = {
  open: "text-red-400",
  acknowledged: "text-yellow-400",
  investigating: "text-blue-400",
  escalated: "text-purple-400",
  resolved: "text-green-400",
  closed: "text-slate-400",
  new: "text-cyan-400",
  confirmed: "text-orange-400",
  mitigated: "text-emerald-400",
  false_positive: "text-slate-500",
};
