"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  Activity,
  Zap,
  Eye,
  TrendingUp,
  Radio,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import api, {
  type DashboardData,
  type ThreatStats,
  type ThreatResponse,
  type AlertResponse,
  type TimelinePoint,
} from "@/lib/api";
import { cn, severityColors, statusColors, timeAgo, severityDotColors } from "@/lib/utils";
import { cyberSocket } from "@/lib/websocket";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SOCDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [stats, setStats] = useState<ThreatStats | null>(null);
  const [threats, setThreats] = useState<ThreatResponse[]>([]);
  const [alerts, setAlerts] = useState<AlertResponse[]>([]);
  const [timeline, setTimeline] = useState<TimelinePoint[]>([]);
  const [severityDist, setSeverityDist] = useState<Record<string, number>>({});
  const [categoryDist, setCategoryDist] = useState<Record<string, number>>({});
  const [topAttackers, setTopAttackers] = useState<{ ip: string; count: number }[]>([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [d, s, t, a, tl, sev, cat, att] = await Promise.all([
          api.getDashboard(),
          api.getThreatStats(),
          api.getThreats({ page_size: "10" }),
          api.getAlerts({ page_size: "10" }),
          api.getThreatTimeline(7),
          api.getThreatsBySeverity(),
          api.getThreatsByCategory(),
          api.getTopAttackers(5),
        ]);
        setDashboard(d);
        setStats(s);
        setThreats(t);
        setAlerts(a);
        setTimeline(tl);
        setSeverityDist(sev);
        setCategoryDist(cat);
        setTopAttackers(att);
      } catch {
        // API not running - show empty state
      } finally {
        setLoading(false);
      }
    }
    load();

    cyberSocket.connect();
    const unsub = cyberSocket.on("connection", (data) => {
      setWsConnected(data.status === "connected");
    });
    const unsubThreats = cyberSocket.on("stream:threats", (data) => {
      setThreats((prev) => [data.data as unknown as ThreatResponse, ...prev].slice(0, 10));
    });

    return () => {
      unsub();
      unsubThreats();
    };
  }, []);

  const statCards = [
    {
      label: "Total Threats",
      value: stats?.total ?? 0,
      icon: Shield,
      color: "from-cyan-500 to-blue-600",
      border: "border-l-cyan-500",
    },
    {
      label: "Critical Alerts",
      value: stats?.critical ?? 0,
      icon: AlertTriangle,
      color: "from-red-500 to-rose-600",
      border: "border-l-red-500",
    },
    {
      label: "Active Investigations",
      value: stats?.active_investigations ?? 0,
      icon: Activity,
      color: "from-orange-500 to-amber-600",
      border: "border-l-orange-500",
    },
    {
      label: "New Today",
      value: stats?.new_today ?? 0,
      icon: Zap,
      color: "from-emerald-500 to-green-600",
      border: "border-l-emerald-500",
    },
  ];

  const pieData = Object.entries(severityDist).map(([name, value]) => ({ name, value }));
  const pieColors = ["#ff073a", "#ff6b35", "#ffd60a", "#00f0ff", "#64748b"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-cyan-400 text-sm font-mono">INITIALIZING SOC SYSTEMS...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Shield className="w-7 h-7 text-cyan-400" />
            SOC Command Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time security operations & threat monitoring
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 glass-card px-3 py-1.5 text-xs">
            <Radio className={cn("w-3 h-3", wsConnected ? "text-green-400 cyber-pulse" : "text-red-400")} />
            <span className={wsConnected ? "text-green-400" : "text-red-400"}>
              {wsConnected ? "LIVE" : "OFFLINE"}
            </span>
          </div>
          <div className={cn(
            "glass-card px-3 py-1.5 text-xs font-mono uppercase tracking-wider",
            dashboard?.risk_level === "critical" ? "text-red-400 border-red-500/30" :
            dashboard?.risk_level === "high" ? "text-orange-400 border-orange-500/30" :
            "text-yellow-400 border-yellow-500/30"
          )}>
            RISK: {dashboard?.risk_level?.toUpperCase() || "CALCULATING"}
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={cn("glass-card glass-card-hover p-4 border-l-2", card.border)}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500 uppercase tracking-wider">{card.label}</span>
              <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center", card.color)}>
                <card.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white font-mono">{card.value.toLocaleString()}</div>
          </div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Threat Timeline */}
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Threat Timeline (7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={timeline}>
              <defs>
                <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00f0ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#1a1f2e",
                  border: "1px solid rgba(0,240,255,0.2)",
                  borderRadius: 8,
                  color: "#e2e8f0",
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="count" stroke="#00f0ff" fill="url(#threatGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Severity Distribution */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            Severity Distribution
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={pieColors[idx % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#1a1f2e",
                    border: "1px solid rgba(0,240,255,0.2)",
                    borderRadius: 8,
                    color: "#e2e8f0",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-600 text-sm">
              No threat data yet
            </div>
          )}
          <div className="flex flex-wrap gap-3 mt-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full" style={{ background: pieColors[i] }} />
                {d.name}: {d.value}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tables Row */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Threats */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Recent Threats
          </h3>
          <div className="space-y-2">
            {threats.length > 0 ? threats.slice(0, 6).map((t) => (
              <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors">
                <div className={cn("w-2 h-2 rounded-full flex-shrink-0", severityDotColors[t.severity] || "bg-slate-500")} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{t.title}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className={cn("px-1.5 py-0.5 rounded text-[10px]", severityColors[t.severity])}>
                      {t.severity.toUpperCase()}
                    </span>
                    {t.source_ip && <span>from {t.source_ip}</span>}
                    <span>{timeAgo(t.created_at)}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center text-slate-600 text-sm py-8">No threats detected</div>
            )}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            Active Alerts
          </h3>
          <div className="space-y-2">
            {alerts.length > 0 ? alerts.slice(0, 6).map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors">
                <div className={cn("w-2 h-2 rounded-full flex-shrink-0", severityDotColors[a.severity] || "bg-slate-500")} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{a.title}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className={cn("px-1.5 py-0.5 rounded text-[10px]", severityColors[a.severity])}>
                      {a.severity.toUpperCase()}
                    </span>
                    <span className={statusColors[a.status] || "text-slate-400"}>
                      {a.status.toUpperCase()}
                    </span>
                    <span>{timeAgo(a.created_at)}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center text-slate-600 text-sm py-8">No active alerts</div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Bottom Row - Top Attackers & Categories */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Attackers */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Top Threat Sources</h3>
          {topAttackers.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topAttackers} layout="vertical">
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="ip" tick={{ fill: "#94a3b8", fontSize: 11 }} width={120} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#1a1f2e", border: "1px solid rgba(0,240,255,0.2)", borderRadius: 8, color: "#e2e8f0", fontSize: 12 }}
                />
                <Bar dataKey="count" fill="#00f0ff" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-slate-600 text-sm">
              No attacker data
            </div>
          )}
        </div>

        {/* Category Distribution */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Threat Categories</h3>
          <div className="space-y-3">
            {Object.entries(categoryDist).length > 0 ? Object.entries(categoryDist).map(([cat, count]) => {
              const maxCount = Math.max(...Object.values(categoryDist));
              const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 capitalize">{cat.replace(/_/g, " ")}</span>
                    <span className="text-white font-mono">{count}</span>
                  </div>
                  <div className="h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    />
                  </div>
                </div>
              );
            }) : (
              <div className="text-center text-slate-600 text-sm py-8">No category data</div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
