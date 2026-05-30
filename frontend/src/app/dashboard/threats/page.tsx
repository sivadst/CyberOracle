"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Filter, RefreshCw } from "lucide-react";
import api, { type ThreatResponse } from "@/lib/api";
import { cn, severityColors, statusColors, timeAgo } from "@/lib/utils";
import { cyberSocket } from "@/lib/websocket";

export default function ThreatsPage() {
  const [threats, setThreats] = useState<ThreatResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [severity, setSeverity] = useState<string>("");
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    try {
      const params: Record<string, string> = { page_size: "50" };
      if (severity) params.severity = severity;
      if (search) params.search = search;
      const data = await api.getThreats(params);
      setThreats(data);
    } catch { /* empty */ } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [severity]);

  useEffect(() => {
    const unsub = cyberSocket.on("stream:threats", (data) => {
      setThreats((prev) => [data.data as unknown as ThreatResponse, ...prev].slice(0, 50));
    });
    return unsub;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Activity className="w-7 h-7 text-cyan-400" />
          Live Threat Feed
        </h1>
        <button onClick={load} className="glass-card px-3 py-2 text-xs text-slate-400 hover:text-white flex items-center gap-2">
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 glass-card px-3 py-2">
          <Filter className="w-3 h-3 text-slate-500" />
          <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="!bg-transparent !border-none text-xs text-slate-300 !p-0">
            <option value="">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <input
          placeholder="Search threats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          className="!bg-transparent glass-card px-3 py-2 text-xs text-slate-300 w-64"
        />
      </div>

      {/* Threat Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full cyber-table">
          <thead>
            <tr>
              <th className="text-left px-4 py-3">Threat</th>
              <th className="text-left px-4 py-3">Severity</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Source IP</th>
              <th className="text-left px-4 py-3">MITRE</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-slate-800 rounded animate-pulse w-20" />
                    </td>
                  ))}
                </tr>
              ))
            ) : threats.length > 0 ? threats.map((t) => (
              <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="cursor-pointer">
                <td className="px-4 py-3">
                  <div className="text-sm text-white max-w-[200px] truncate">{t.title}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("px-2 py-1 rounded text-[10px] font-semibold uppercase", severityColors[t.severity])}>
                    {t.severity}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-400 capitalize">{t.category?.replace(/_/g, " ")}</td>
                <td className="px-4 py-3 text-xs font-mono text-slate-300">{t.source_ip || "—"}</td>
                <td className="px-4 py-3 text-xs text-cyan-400 font-mono">{t.mitre_technique || "—"}</td>
                <td className="px-4 py-3">
                  <span className={cn("text-xs capitalize", statusColors[t.status])}>{t.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{timeAgo(t.created_at)}</td>
              </motion.tr>
            )) : (
              <tr><td colSpan={7} className="text-center py-12 text-slate-600">No threats found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
