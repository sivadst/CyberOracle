"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Server, Database, Wifi, Cpu, HardDrive, Activity } from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { cyberSocket } from "@/lib/websocket";

export default function HealthPage() {
  const [health, setHealth] = useState<Record<string, unknown> | null>(null);
  const [wsStatus, setWsStatus] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const h = await api.getHealth();
        setHealth(h);
      } catch { /* empty */ } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 15000);

    const unsub = cyberSocket.on("connection", (data) => {
      setWsStatus(data.status === "connected");
    });

    return () => { clearInterval(interval); unsub(); };
  }, []);

  const services = [
    { name: "FastAPI Backend", status: health ? "operational" : "down", icon: Server, detail: "Port 8000" },
    { name: "PostgreSQL", status: health?.database === "connected" ? "operational" : "down", icon: Database, detail: "Port 5432" },
    { name: "Redis", status: health?.redis === "connected" ? "operational" : "down", icon: HardDrive, detail: "Port 6379" },
    { name: "WebSocket", status: wsStatus ? "operational" : "degraded", icon: Wifi, detail: `${health?.websocket_connections ?? 0} connections` },
    { name: "Celery Workers", status: "monitoring", icon: Cpu, detail: "4 workers" },
    { name: "ML Pipeline", status: "standby", icon: Activity, detail: "5 models loaded" },
  ];

  const statusStyle: Record<string, string> = {
    operational: "text-green-400 bg-green-500/10",
    degraded: "text-yellow-400 bg-yellow-500/10",
    down: "text-red-400 bg-red-500/10",
    monitoring: "text-blue-400 bg-blue-500/10",
    standby: "text-slate-400 bg-slate-500/10",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-3">
        <Heart className="w-7 h-7 text-cyan-400" />
        System Health
      </h1>

      {/* Overall Status */}
      <div className="glass-card p-6 text-center">
        <div className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold",
          health ? "text-green-400 bg-green-500/10 border border-green-500/20" : "text-red-400 bg-red-500/10 border border-red-500/20"
        )}>
          <div className={cn("w-2 h-2 rounded-full", health ? "bg-green-400 cyber-pulse" : "bg-red-400")} />
          {health ? "ALL SYSTEMS OPERATIONAL" : "SYSTEMS OFFLINE — START BACKEND"}
        </div>
      </div>

      {/* Service Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((svc, i) => (
          <motion.div
            key={svc.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card glass-card-hover p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <svc.icon className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-medium text-white">{svc.name}</span>
              </div>
              <span className={cn("px-2 py-1 rounded text-[10px] uppercase font-semibold", statusStyle[svc.status])}>
                {svc.status}
              </span>
            </div>
            <div className="text-xs text-slate-500">{svc.detail}</div>
            <div className="mt-3 h-1 bg-[#1e293b] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: svc.status === "operational" ? "100%" : svc.status === "degraded" ? "60%" : "20%" }}
                transition={{ duration: 1 }}
                className={cn("h-full rounded-full", svc.status === "operational" ? "bg-green-500" : svc.status === "degraded" ? "bg-yellow-500" : "bg-red-500")}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
