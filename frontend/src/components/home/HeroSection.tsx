"use client";

import { motion } from "framer-motion";
import { ChevronDown, Terminal, Cpu } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00f0ff] opacity-10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container relative z-10 px-6 mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono text-[#00f0ff] uppercase bg-[#00f0ff]/10 border border-[#00f0ff]/20 rounded-full mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
          System Online
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-[#94a3b8] mb-6"
        >
          <span className="block">NEURAL INTELLIGENCE</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#bf5af2] neon-text">
            COMMAND CENTER
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="max-w-2xl text-lg md:text-xl text-[#94a3b8] mb-10 font-light"
        >
          The epicenter of next-generation AI architecture. Powering the future of telemetry, cybernetics, and autonomous decision ecosystems.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/dashboard" className="group relative inline-flex items-center justify-center px-8 py-4 font-mono text-sm font-bold text-[#0a0e17] uppercase bg-[#00f0ff] rounded-sm overflow-hidden interactive hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all">
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black" />
            <span className="relative flex items-center gap-2">
              <Terminal size={16} />
              Initialize System
            </span>
            <div className="absolute inset-0 w-full h-full border-2 border-white/20 rounded-sm group-hover:border-white/50 transition-colors" />
          </Link>
          
          <button className="group px-8 py-4 font-mono text-sm font-bold text-white uppercase bg-transparent border border-[#1e293b] rounded-sm hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/5 transition-all interactive flex items-center gap-2">
            <Cpu size={16} className="text-[#00f0ff]" />
            View Ecosystem
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#64748b]"
        >
          <span className="text-[10px] font-mono tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={16} className="text-[#00f0ff]" />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Grid overlay bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0e17] to-transparent z-10 pointer-events-none" />
    </section>
  );
}
