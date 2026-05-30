"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Grid3X3 } from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

const TACTICS = [
  "Reconnaissance", "Resource Development", "Initial Access", "Execution",
  "Persistence", "Privilege Escalation", "Defense Evasion", "Credential Access",
  "Discovery", "Lateral Movement", "Collection", "Command and Control",
  "Exfiltration", "Impact",
];

export default function MitrePage() {
  const [heatmap, setHeatmap] = useState<{ tactic: string; technique: string; count: number }[]>([]);

  useEffect(() => {
    api.getMitreHeatmap().then(setHeatmap).catch(() => {});
  }, []);

  const tacticData = TACTICS.map((tactic) => {
    const techniques = heatmap.filter((h) => h.tactic === tactic);
    const total = techniques.reduce((sum, t) => sum + t.count, 0);
    return { tactic, techniques, total };
  });

  const maxCount = Math.max(...heatmap.map((h) => h.count), 1);

  function getHeatColor(count: number) {
    const intensity = count / maxCount;
    if (intensity > 0.7) return "bg-red-500/40 border-red-500/50";
    if (intensity > 0.4) return "bg-orange-500/30 border-orange-500/40";
    if (intensity > 0.1) return "bg-yellow-500/20 border-yellow-500/30";
    if (count > 0) return "bg-cyan-500/10 border-cyan-500/20";
    return "bg-transparent border-[#1e293b]";
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-3">
        <Grid3X3 className="w-7 h-7 text-cyan-400" />
        MITRE ATT&CK Matrix
      </h1>

      <div className="glass-card p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          {tacticData.map((td, i) => (
            <motion.div
              key={td.tactic}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="space-y-2"
            >
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold text-center truncate" title={td.tactic}>
                {td.tactic}
              </div>
              {td.total > 0 && (
                <div className="text-center text-xs text-cyan-400 font-mono">{td.total}</div>
              )}
              <div className="space-y-1.5">
                {td.techniques.length > 0 ? td.techniques.map((tech) => (
                  <div
                    key={tech.technique}
                    className={cn(
                      "p-2 rounded border text-center cursor-pointer transition-all hover:scale-105",
                      getHeatColor(tech.count)
                    )}
                  >
                    <div className="text-[10px] text-cyan-400 font-mono">{tech.technique}</div>
                    <div className="text-sm font-bold text-white">{tech.count}</div>
                  </div>
                )) : (
                  <div className="p-2 rounded border border-[#1e293b] text-center">
                    <div className="text-[10px] text-slate-600">No data</div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4">
        <span className="text-xs text-slate-500">Intensity:</span>
        <div className="flex items-center gap-2">
          {[
            { label: "Low", color: "bg-cyan-500/10" },
            { label: "Medium", color: "bg-yellow-500/20" },
            { label: "High", color: "bg-orange-500/30" },
            { label: "Critical", color: "bg-red-500/40" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1">
              <div className={cn("w-3 h-3 rounded", l.color)} />
              <span className="text-[10px] text-slate-500">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
