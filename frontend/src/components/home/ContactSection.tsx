"use client";

import { motion } from "framer-motion";
import { Terminal, MessageSquare, Briefcase, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ContactSection() {
  return (
    <section className="py-24 relative bg-[#0a0e17]">
      <div className="container px-6 mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto glass-card p-10 md:p-16 border-t-4 border-t-[#00f0ff] relative overflow-hidden"
        >
          {/* Animated background gradient */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#00f0ff] opacity-10 rounded-full blur-[80px]" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tight">
                Establish <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#94a3b8]">Connection</span>
              </h2>
              <p className="text-[#94a3b8] max-w-sm">
                Open a secure comm channel to discuss architecture, deployment, or alliance parameters.
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full md:w-auto">
              <Link href="mailto:transmission@home.ai" className="group flex items-center justify-between gap-4 px-6 py-4 bg-[#111827] border border-[rgba(0,240,255,0.2)] rounded-sm hover:border-[#00f0ff] hover:bg-[#00f0ff]/5 transition-all interactive">
                <div className="flex items-center gap-3 text-white">
                  <Mail size={18} className="text-[#00f0ff]" />
                  <span className="font-mono text-sm uppercase">Initialize Email</span>
                </div>
                <ArrowRight size={16} className="text-[#64748b] group-hover:text-[#00f0ff] group-hover:translate-x-1 transition-all" />
              </Link>

              <div className="flex gap-4 justify-center md:justify-start mt-4">
                {[
                  { icon: Terminal, link: "https://github.com", color: "hover:text-white hover:border-white" },
                  { icon: MessageSquare, link: "https://twitter.com", color: "hover:text-[#00f0ff] hover:border-[#00f0ff]" },
                  { icon: Briefcase, link: "https://linkedin.com", color: "hover:text-[#bf5af2] hover:border-[#bf5af2]" }
                ].map((social, i) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={i}
                      href={social.link}
                      target="_blank"
                      className={`w-12 h-12 flex items-center justify-center rounded-full border border-[#1e293b] text-[#64748b] transition-all bg-[#111827] interactive ${social.color}`}
                    >
                      <Icon size={20} />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-[rgba(255,255,255,0.05)] flex flex-col md:flex-row justify-between items-center text-xs font-mono text-[#64748b]">
            <p>SYSTEM.VERSION: 4.2.1-BETA</p>
            <p className="mt-2 md:mt-0">© {new Date().getFullYear()} HOME.AI. ALL RIGHTS RESERVED.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
