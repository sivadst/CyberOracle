'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'critical' | 'high' | 'success' | 'active';
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, variant = 'default', hoverEffect = true, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          'glass-card p-4 flex flex-col gap-2 relative overflow-hidden',
          hoverEffect && 'glass-card-hover transition-all duration-300',
          variant === 'critical' && 'stat-card-critical',
          variant === 'high' && 'stat-card-high',
          variant === 'success' && 'stat-card-success',
          variant === 'active' && 'stat-card-active',
          className
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        <div className="hud-brackets absolute inset-0 pointer-events-none" />
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
