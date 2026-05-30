"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, ArrowUpCircle } from "lucide-react";
import api, { type AlertResponse } from "@/lib/api";
import { cn, severityColors, statusColors, timeAgo } from "@/lib/utils";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertResponse[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  async function load() {
    setLoading(true);
    try {
      const params: Record<string, string> = { page_size: "50" };
      if (filter) params.status = filter;
      const [a, c] = await Promise.all([api.getAlerts(params), api.getAlertCounts()]);
      setAlerts(a);
      setCounts(c);
    } catch { /* empty */ } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [filter]);

  async function handleAcknowledge(id: string) {
    await api.updateAlert(id, { status: "acknowledged" });
    load();
  }

  async function handleResolve(id: string) {
    await api.updateAlert(id, { status: "resolved" });
    load();
  }

  const statusTabs = ["", "open", "acknowledged", "investigating", "escalated", "resolved"];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-3">
        <AlertTriangle className="w-7 h-7 text-orange-400" />
        Alert Management
      </h1>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {statusTabs.map((s) => (
          <button
            key={s || "all"}
            onClick={() => setFilter(s)}
            className={cn(
              "glass-card p-3 text-center transition-all",
              filter === s && "border-cyan-500/30 bg-cyan-500/5"
            )}
          >
            <div className="text-2xl font-bold text-white font-mono">
              {s ? (counts[s] ?? 0) : Object.values(counts).reduce((a, b) => a + b, 0)}
            </div>
            <div className={cn("text-[10px] uppercase tracking-wider mt-1", s ? statusColors[s] : "text-slate-400")}>
              {s || "All"}
            </div>
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card p-4 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-1/3 mb-2" />
              <div className="h-3 bg-slate-800 rounded w-1/2" />
            </div>
          ))
        ) : alerts.length > 0 ? alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card glass-card-hover p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn("px-2 py-0.5 rounded text-[10px] font-semibold uppercase", severityColors[alert.severity])}>
                    {alert.severity}
                  </span>
                  <span className={cn("text-xs capitalize", statusColors[alert.status])}>
                    {alert.status}
                  </span>
                  {alert.rule_name && (
                    <span className="text-xs text-slate-500">Rule: {alert.rule_name}</span>
                  )}
                </div>
                <h3 className="text-sm font-medium text-white">{alert.title}</h3>
                {alert.description && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{alert.description}</p>
                )}
                <div className="text-xs text-slate-600 mt-2">{timeAgo(alert.created_at)}</div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                {alert.status === "open" && (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors"
                  >
                    <CheckCircle className="w-3 h-3" /> ACK
                  </button>
                )}
                {["open", "acknowledged", "investigating"].includes(alert.status) && (
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs text-green-400 bg-green-500/10 hover:bg-green-500/20 transition-colors"
                  >
                    <ArrowUpCircle className="w-3 h-3" /> Resolve
                  </button>
                )}
              </div>
            </div>
            {alert.ai_summary && (
              <div className="mt-3 p-2 rounded bg-cyan-500/5 border border-cyan-500/10 text-xs text-cyan-300">
                <span className="font-semibold text-cyan-400">AI Summary:</span> {alert.ai_summary}
              </div>
            )}
          </motion.div>
        )) : (
          <div className="glass-card p-12 text-center text-slate-600">No alerts found</div>
        )}
      </div>
    </div>
  );
}
