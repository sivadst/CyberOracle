'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function CyberGrid() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base Grid */}
      <div className="absolute inset-0 cyber-grid opacity-30" />
      
      {/* Moving Scan Line */}
      <div className="scan-line" />
      
      {/* Radial Gradient overlay to focus center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[rgba(10,14,23,0.8)] to-[#0a0e17]" />
      
      {/* Floating Particles/Nodes */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#00f0ff] rounded-full neon-glow"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            opacity: Math.random() * 0.5 + 0.1
          }}
          animate={{
            y: [null, Math.random() * -100 - 50],
            opacity: [null, 0]
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}
