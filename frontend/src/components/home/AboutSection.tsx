"use client";

import { motion } from "framer-motion";
import InteractiveGlobe from "./InteractiveGlobe";

export default function AboutSection() {
  return (
    <section className="py-32 relative overflow-hidden bg-[#0a0e17]">
      <div className="container px-6 mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16">
        
        <div className="w-full lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono text-[#bf5af2] uppercase bg-[#bf5af2]/10 border border-[#bf5af2]/20 rounded-full mb-6">
              System Architect
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight">
              Visionary <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bf5af2] to-[#00f0ff]">Engineering</span>
            </h2>
            
            <div className="space-y-6 text-[#94a3b8] text-lg font-light">
              <p>
                We do not just build applications; we engineer intelligent, autonomous ecosystems. Our mission is to bridge the gap between human intuition and machine precision.
              </p>
              <p>
                Every line of code is treated as a synapse in a global neural network. From deep space threat analysis to local grid optimization, the architecture is designed for zero latency and absolute reliability.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-[rgba(255,255,255,0.05)] pt-10">
              <div>
                <div className="text-4xl font-bold text-white mb-2 font-mono">10^9</div>
                <div className="text-xs text-[#64748b] uppercase tracking-widest">Parameters Processed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2 font-mono">0.1ms</div>
                <div className="text-xs text-[#64748b] uppercase tracking-widest">Global Latency</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="w-full lg:w-1/2 relative h-[500px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <InteractiveGlobe />
            {/* Holographic overlay rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[#00f0ff]/20 rounded-full animate-[spin_10s_linear_infinite] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-[#bf5af2]/20 rounded-full animate-[spin_15s_linear_infinite_reverse] pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
