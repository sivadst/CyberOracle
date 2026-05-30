"use client";

import { motion } from "framer-motion";
import { ExternalLink, Shield, Eye, Map, Rocket } from "lucide-react";
import Link from "next/link";

const projects = [
  {
    id: "cyberoracle",
    title: "CyberOracle",
    description: "Predictive threat intelligence matrix. Analyzes global cyber anomalies before they materialize.",
    icon: Shield,
    color: "#00f0ff",
    status: "Active",
    metrics: ["99.9% Accuracy", "<12ms Latency"],
    link: "/dashboard"
  },
  {
    id: "lifelens",
    title: "LifeLens AI",
    description: "Biometric and cognitive state analysis. Real-time human telemetry interpretation.",
    icon: Eye,
    color: "#bf5af2",
    status: "Beta",
    metrics: ["8.4M Models", "Neural Sync"],
    link: "#"
  },
  {
    id: "smartcommutex",
    title: "SmartCommuteX",
    description: "Autonomous grid optimization. Traffic and transit routing driven by quantum algorithms.",
    icon: Map,
    color: "#39ff14",
    status: "Deployed",
    metrics: ["Smart City V2", "Zero Delay"],
    link: "#"
  },
  {
    id: "nasaneo",
    title: "NASA NEO",
    description: "Near-Earth Object trajectory prediction. Deep space hazard analysis system.",
    icon: Rocket,
    color: "#ff6b35",
    status: "Classified",
    metrics: ["Deep Space Network", "Orbital Lock"],
    link: "#"
  }
];

export default function ProjectEcosystem() {
  return (
    <section className="py-24 relative bg-[#0a0e17] border-t border-[rgba(0,240,255,0.05)]">
      <div className="absolute inset-0 cyber-grid opacity-10" />
      
      <div className="container px-6 mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tight">
              Ecosystem <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#bf5af2]">Matrix</span>
            </h2>
            <p className="text-[#94a3b8] max-w-xl">
              Interconnected autonomous systems powering security, intelligence, and exploration.
            </p>
          </div>
          <Link href="/projects" className="group flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase hover:text-white transition-colors">
            View All Systems <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative glass-card p-8 interactive overflow-hidden"
              >
                {/* Hover Gradient Background */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${project.color}, transparent 70%)` }}
                />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-8">
                    <div 
                      className="p-3 rounded-lg border bg-[#0a0e17]"
                      style={{ borderColor: `${project.color}33`, color: project.color }}
                    >
                      <Icon size={24} />
                    </div>
                    <span 
                      className="text-xs font-mono px-2 py-1 border rounded-sm"
                      style={{ borderColor: `${project.color}40`, color: project.color, backgroundColor: `${project.color}10` }}
                    >
                      {project.status}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#00f0ff] transition-colors">{project.title}</h3>
                  <p className="text-[#94a3b8] mb-8 flex-grow">{project.description}</p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex gap-4">
                      {project.metrics.map((metric, i) => (
                        <div key={i} className="text-xs font-mono text-[#64748b]">
                          <span className="block w-2 h-0.5 bg-[#1e293b] mb-1" />
                          {metric}
                        </div>
                      ))}
                    </div>
                    <Link 
                      href={project.link}
                      className="w-10 h-10 rounded-full border border-[rgba(0,240,255,0.2)] flex items-center justify-center text-[#00f0ff] group-hover:bg-[#00f0ff] group-hover:text-[#0a0e17] transition-all"
                    >
                      <ExternalLink size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
