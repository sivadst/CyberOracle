'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TerminalText } from '@/components/ui/Terminal';
import { Shield, Activity, Lock, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export function HeroSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center py-20">
      <motion.div 
        className="max-w-5xl w-full flex flex-col items-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(0,240,255,0.3)] bg-[rgba(0,240,255,0.05)] backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
          <span className="text-xs font-mono text-[#00f0ff] tracking-widest uppercase">Defense Matrix Online</span>
        </motion.div>
        
        <motion.h1 
          variants={item}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-white uppercase drop-shadow-2xl"
        >
          Cyber<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0088ff] neon-text">Oracle</span>
        </motion.h1>
        
        <motion.div variants={item} className="h-8 mb-10 flex items-center justify-center">
          <TerminalText 
            text="> INITIALIZING AI THREAT PREDICTION NEURAL NET..." 
            className="text-lg md:text-xl text-[#00f0ff] opacity-80"
            typingDuration={2.5}
          />
        </motion.div>
        
        <motion.p 
          variants={item}
          className="text-xl md:text-2xl text-[#94a3b8] max-w-3xl mb-14 font-light leading-relaxed"
        >
          Next-generation threat intelligence and autonomous cyber warfare prediction ecosystem. Securing the future through predictive AI analytics.
        </motion.p>
        
        <motion.div variants={item} className="flex flex-col sm:flex-row gap-6 mb-24 w-full justify-center">
          <Link href="/dashboard" className="group relative px-10 py-5 bg-[#00f0ff] text-[#0a0e17] font-bold uppercase tracking-wider rounded-md overflow-hidden transition-all hover:scale-105 neon-glow flex items-center justify-center gap-3">
            <span className="relative z-10 text-lg">Enter Command Center</span>
            <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity z-0" />
          </Link>
        </motion.div>

        {/* Feature Cards */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
          <Card hoverEffect className="bg-[rgba(17,24,39,0.7)] border-[rgba(0,240,255,0.15)] p-8">
            <div className="w-12 h-12 rounded-lg bg-[rgba(0,240,255,0.1)] flex items-center justify-center mb-6 border border-[rgba(0,240,255,0.2)]">
              <Activity className="w-6 h-6 text-[#00f0ff]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Real-Time Threat Feed</h3>
            <p className="text-base text-[#94a3b8] leading-relaxed">Live streaming of global cyber attack events, zero-day vulnerabilities, and CVE alerts over low-latency WebSockets.</p>
          </Card>
          
          <Card hoverEffect className="bg-[rgba(17,24,39,0.7)] border-[rgba(0,240,255,0.15)] p-8">
            <div className="w-12 h-12 rounded-lg bg-[rgba(57,255,20,0.1)] flex items-center justify-center mb-6 border border-[rgba(57,255,20,0.2)]">
              <Shield className="w-6 h-6 text-[#39ff14]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Predictive AI Engine</h3>
            <p className="text-base text-[#94a3b8] leading-relaxed">Machine learning models that analyze behavioral anomalies and calculate risk severity instantaneously.</p>
          </Card>
          
          <Card hoverEffect className="bg-[rgba(17,24,39,0.7)] border-[rgba(0,240,255,0.15)] p-8">
            <div className="w-12 h-12 rounded-lg bg-[rgba(255,7,58,0.1)] flex items-center justify-center mb-6 border border-[rgba(255,7,58,0.2)]">
              <Lock className="w-6 h-6 text-[#ff073a]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Global Attack Map</h3>
            <p className="text-base text-[#94a3b8] leading-relaxed">Interactive 3D visualization of cyber warfare vectors, plotting origin and destination IPs globally.</p>
          </Card>
        </motion.div>

      </motion.div>
    </div>
  );
}
