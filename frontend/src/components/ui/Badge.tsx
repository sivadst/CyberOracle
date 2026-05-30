import React from 'react';
import { cn } from '@/lib/utils';
import { ThreatSeverity } from '@/types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  severity?: ThreatSeverity | 'success';
}

export function Badge({ children, severity, className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'px-2.5 py-0.5 rounded text-xs font-semibold tracking-wider uppercase border',
        !severity && 'bg-[rgba(0,240,255,0.1)] text-[#00f0ff] border-[rgba(0,240,255,0.3)]',
        severity === 'critical' && 'severity-critical',
        severity === 'high' && 'severity-high',
        severity === 'medium' && 'severity-medium',
        severity === 'low' && 'severity-low',
        severity === 'success' && 'bg-[rgba(57,255,20,0.15)] text-[#39ff14] border-[rgba(57,255,20,0.3)]',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
