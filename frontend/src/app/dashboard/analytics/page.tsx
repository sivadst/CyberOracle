"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
} from "recharts";
import api, { type TimelinePoint } from "@/lib/api";

const chartStyle = { background: "#1a1f2e", border: "1px solid rgba(0,240,255,0.2)", borderRadius: 8, color: "#e2e8f0", fontSize: 12 };
const COLORS = ["#ff073a", "#ff6b35", "#ffd60a", "#00f0ff", "#39ff14", "#bf5af2", "#f472b6", "#64748b"];

export default function AnalyticsPage() {
  const [timeline, setTimeline] = useState<TimelinePoint[]>([]);
  const [severity, setSeverity] = useState<Record<string, number>>({});
  const [category, setCategory] = useState<Record<string, number>>({});
  const [attackers, setAttackers] = useState<{ ip: string; count: number }[]>([]);
  const [mitre, setMitre] = useState<{ tactic: string; technique: string; count: number }[]>([]);
  const [days, setDays] = useState(7);

  useEffect(() => {
    async function load() {
      const [t, s, c, a, m] = await Promise.all([
        api.getThreatTimeline(days),
        api.getThreatsBySeverity(),
        api.getThreatsByCategory(),
        api.getTopAttackers(10),
        api.getMitreHeatmap(),
      ]);
      setTimeline(t);
      setSeverity(s);
      setCategory(c);
      setAttackers(a);
      setMitre(m);
    }
    load().catch(() => {});
  }, [days]);

  const catData = Object.entries(category).map(([name, value]) => ({ name: name.replace(/_/g, " "), value }));
  const sevData = Object.entries(severity).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-cyan-400" />
          Threat Analytics
        </h1>
        <div className="flex gap-2">
          {[7, 14, 30, 90].map((d) => (
            <button key={d} onClick={() => setDays(d)}
              className={`glass-card px-3 py-1.5 text-xs ${days === d ? "text-cyan-400 border-cyan-500/30" : "text-slate-500"}`}>
              {d}D
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Threat Volume Over Time</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={timeline}>
              <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00f0ff" stopOpacity={0.3} /><stop offset="100%" stopColor="#00f0ff" stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="date" tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartStyle} />
              <Area type="monotone" dataKey="count" stroke="#00f0ff" fill="url(#ag)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={catData} cx="50%" cy="50%" outerRadius={90} innerRadius={45} paddingAngle={3} dataKey="value" label={({ name, percent }: { name: string; percent?: number }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={chartStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Top Threat Sources</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={attackers} layout="vertical">
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="ip" tick={{ fill: "#94a3b8", fontSize: 10 }} width={110} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartStyle} />
              <Bar dataKey="count" fill="#00f0ff" radius={[0, 4, 4, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Severity Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={sevData}>
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartStyle} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={30}>
                {sevData.map((entry, i) => {
                  const colors: Record<string, string> = { critical: "#ff073a", high: "#ff6b35", medium: "#ffd60a", low: "#00f0ff", info: "#64748b" };
                  return <Cell key={i} fill={colors[entry.name] || "#64748b"} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MITRE Heatmap Preview */}
      {mitre.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">MITRE ATT&CK Heatmap</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {mitre.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="p-3 rounded-lg border border-[#1e293b] bg-red-500/5 hover:bg-red-500/10 transition-colors cursor-pointer">
                <div className="text-[10px] text-slate-500 uppercase">{m.tactic}</div>
                <div className="text-xs text-cyan-400 font-mono mt-1">{m.technique}</div>
                <div className="text-lg font-bold text-white mt-1">{m.count}</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
