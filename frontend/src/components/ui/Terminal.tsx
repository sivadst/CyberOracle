import React from 'react';
import { cn } from '@/lib/utils';

interface TerminalTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  typingDelay?: number; // in seconds
  typingDuration?: number; // in seconds
}

export function TerminalText({ text, className, typingDelay = 0, typingDuration = 1.5, ...props }: TerminalTextProps) {
  return (
    <span
      className={cn('inline-block typewriter-text font-mono text-sm neon-text', className)}
      style={{
        animationDuration: `${typingDuration}s, 0.75s`,
        animationDelay: `${typingDelay}s, ${typingDelay}s`,
        animationFillMode: 'both'
      }}
      {...props}
    >
      {text}
    </span>
  );
}
