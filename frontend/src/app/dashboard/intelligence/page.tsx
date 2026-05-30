"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Globe, Hash, Shield, RefreshCw } from "lucide-react";
import api, { type IOCResponse, type IPReputation } from "@/lib/api";
import { cn, verdictColors, timeAgo } from "@/lib/utils";

export default function IntelligencePage() {
  const [iocs, setIOCs] = useState<IOCResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrichQuery, setEnrichQuery] = useState("");
  const [enrichType, setEnrichType] = useState("ip");
  const [enrichResult, setEnrichResult] = useState<IOCResponse | null>(null);
  const [enriching, setEnriching] = useState(false);
  const [ipResult, setIpResult] = useState<IPReputation | null>(null);
  const [stats, setStats] = useState<Record<string, number>>({});

  useEffect(() => {
    async function load() {
      try {
        const [i, s] = await Promise.all([api.getIOCs({ page_size: "30" }), api.getIntelStats()]);
        setIOCs(i);
        setStats(s);
      } catch { /* empty */ } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleEnrich() {
    if (!enrichQuery) return;
    setEnriching(true);
    try {
      const result = await api.enrichIOC({ type: enrichType, value: enrichQuery });
      setEnrichResult(result);
      if (enrichType === "ip") {
        const ipRep = await api.getIPReputation(enrichQuery);
        setIpResult(ipRep);
      }
    } catch { /* empty */ } finally {
      setEnriching(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-3">
        <Search className="w-7 h-7 text-cyan-400" />
        Threat Intelligence
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total IOCs", value: stats.total_iocs ?? 0, icon: Hash },
          { label: "Malicious", value: stats.malicious ?? 0, icon: Shield },
          { label: "Suspicious", value: stats.suspicious ?? 0, icon: Globe },
          { label: "Active Feeds", value: stats.feeds_active ?? 0, icon: RefreshCw },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</span>
              <s.icon className="w-4 h-4 text-cyan-400/50" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Enrichment Panel */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4">IOC Enrichment Engine</h3>
        <div className="flex items-center gap-3">
          <select value={enrichType} onChange={(e) => setEnrichType(e.target.value)} className="text-xs px-3 py-2.5">
            <option value="ip">IP Address</option>
            <option value="domain">Domain</option>
            <option value="hash_sha256">SHA-256 Hash</option>
            <option value="hash_md5">MD5 Hash</option>
            <option value="url">URL</option>
          </select>
          <input
            value={enrichQuery}
            onChange={(e) => setEnrichQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEnrich()}
            placeholder="Enter IOC value..."
            className="flex-1 px-3 py-2.5 text-sm"
          />
          <button
            onClick={handleEnrich}
            disabled={enriching}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:from-cyan-400 disabled:opacity-50"
          >
            {enriching ? "Analyzing..." : "ENRICH"}
          </button>
        </div>

        {enrichResult && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#0d1117] border border-[#1e293b]">
              <h4 className="text-xs text-slate-500 uppercase mb-3">Verdict</h4>
              <div className="flex items-center gap-3">
                <span className={cn("px-3 py-1 rounded text-sm font-bold uppercase", verdictColors[enrichResult.verdict])}>
                  {enrichResult.verdict}
                </span>
                <span className="text-sm text-slate-300">Score: {(enrichResult.reputation_score * 100).toFixed(0)}%</span>
              </div>
              <div className="mt-3 text-xs text-slate-500 space-y-1">
                <div>Type: <span className="text-slate-300">{enrichResult.type}</span></div>
                <div>Hit Count: <span className="text-slate-300">{enrichResult.hit_count}</span></div>
                <div>First Seen: <span className="text-slate-300">{timeAgo(enrichResult.first_seen)}</span></div>
              </div>
            </div>
            {ipResult && (
              <div className="p-4 rounded-lg bg-[#0d1117] border border-[#1e293b]">
                <h4 className="text-xs text-slate-500 uppercase mb-3">IP Intelligence</h4>
                <div className="text-xs text-slate-500 space-y-1">
                  <div>Risk Score: <span className="text-red-400 font-bold">{(ipResult.risk_score * 100).toFixed(0)}%</span></div>
                  <div>Country: <span className="text-slate-300">{ipResult.country || "Unknown"}</span></div>
                  <div>Tor: <span className={ipResult.is_tor ? "text-red-400" : "text-green-400"}>{ipResult.is_tor ? "Yes" : "No"}</span></div>
                  <div>VPN: <span className={ipResult.is_vpn ? "text-yellow-400" : "text-green-400"}>{ipResult.is_vpn ? "Yes" : "No"}</span></div>
                  <div>Proxy: <span className={ipResult.is_proxy ? "text-yellow-400" : "text-green-400"}>{ipResult.is_proxy ? "Yes" : "No"}</span></div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* IOC Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full cyber-table">
          <thead>
            <tr>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Value</th>
              <th className="text-left px-4 py-3">Verdict</th>
              <th className="text-left px-4 py-3">Score</th>
              <th className="text-left px-4 py-3">Hits</th>
              <th className="text-left px-4 py-3">Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {loading ? Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>{Array.from({ length: 6 }).map((_, j) => (
                <td key={j} className="px-4 py-3"><div className="h-4 bg-slate-800 rounded animate-pulse w-20" /></td>
              ))}</tr>
            )) : iocs.length > 0 ? iocs.map((ioc) => (
              <tr key={ioc.id}>
                <td className="px-4 py-3 text-xs text-cyan-400 uppercase font-mono">{ioc.type}</td>
                <td className="px-4 py-3 text-sm text-white font-mono truncate max-w-[200px]">{ioc.value}</td>
                <td className="px-4 py-3">
                  <span className={cn("px-2 py-0.5 rounded text-[10px] font-semibold uppercase", verdictColors[ioc.verdict])}>
                    {ioc.verdict}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-white font-mono">{(ioc.reputation_score * 100).toFixed(0)}%</td>
                <td className="px-4 py-3 text-sm text-slate-400">{ioc.hit_count}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{timeAgo(ioc.last_seen)}</td>
              </tr>
            )) : (
              <tr><td colSpan={6} className="text-center py-12 text-slate-600">No IOCs found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
