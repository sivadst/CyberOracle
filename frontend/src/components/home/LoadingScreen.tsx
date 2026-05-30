"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0e17] overflow-hidden"
        >
          {/* Cyber Grid Background */}
          <div className="absolute inset-0 cyber-grid opacity-20" />
          
          <div className="relative z-10 flex flex-col items-center w-full max-w-md px-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8 text-center"
            >
              <h1 className="text-4xl font-mono font-bold tracking-[0.2em] text-[#00f0ff] neon-text">
                HOME.AI
              </h1>
              <p className="mt-2 text-xs tracking-[0.3em] text-[#94a3b8] uppercase">
                Neural Intelligence Command Center
              </p>
            </motion.div>

            <div className="w-full h-1 bg-[#1e293b] rounded-full overflow-hidden relative">
              <motion.div
                className="absolute top-0 left-0 h-full bg-[#00f0ff] shadow-[0_0_10px_#00f0ff]"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            
            <div className="flex justify-between w-full mt-4 text-xs font-mono text-[#00f0ff]">
              <span>SYS.BOOT_SEQ</span>
              <span>{Math.min(progress, 100)}%</span>
            </div>
            
            <div className="mt-8 text-xs font-mono text-[#64748b] w-full h-24 overflow-hidden relative mask-image-b">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex flex-col gap-1"
              >
                <p>{`> Initializing neural pathways... ${progress > 20 ? "DONE" : ""}`}</p>
                <p>{progress > 40 ? `> Loading cybernetic models... DONE` : ""}</p>
                <p>{progress > 60 ? `> Establishing telemetry uplink... DONE` : ""}</p>
                <p>{progress > 80 ? `> Bypassing mainframe security... DONE` : ""}</p>
                <p className="text-[#00f0ff]">{progress === 100 ? `> SYSTEM READY.` : ""}</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
