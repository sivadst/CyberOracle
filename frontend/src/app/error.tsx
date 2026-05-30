"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error("SOC System Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center p-4">
      <div className="glass-card hud-brackets max-w-md w-full p-8 border-red-500/30 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-red-500/5 alert-critical-flash" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          
          <h2 className="text-xl font-bold text-white mb-2 font-mono tracking-wider">
            SYSTEM FAILURE DETECTED
          </h2>
          
          <p className="text-slate-400 text-sm mb-8 font-mono bg-black/20 p-3 rounded border border-red-500/10">
            {error.message || "An unexpected anomaly occurred in the SOC telemetry pipeline."}
          </p>
          
          <button
            onClick={() => reset()}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors font-mono text-sm uppercase tracking-wider"
          >
            <RefreshCw className="w-4 h-4" />
            Reboot Subsystem
          </button>
        </div>
      </div>
    </div>
  );
}
