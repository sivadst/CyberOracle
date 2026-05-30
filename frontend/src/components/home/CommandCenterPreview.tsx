"use client";

import { motion } from "framer-motion";
import { ResponsiveContainer, Tooltip, AreaChart, Area, CartesianGrid } from "recharts";
import { Activity, ShieldAlert, Wifi, Database } from "lucide-react";
import { useEffect, useState } from "react";

const generateData = () => {
  return Array.from({ length: 20 }).map((_, i) => ({
    name: i,
    value: Math.floor(Math.random() * 60) + 40,
    latency: Math.floor(Math.random() * 30) + 10,
  }));
};

export default function CommandCenterPreview() {
  const [data, setData] = useState(generateData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1), { 
          name: prev[prev.length - 1].name + 1, 
          value: Math.floor(Math.random() * 60) + 40,
          latency: Math.floor(Math.random() * 30) + 10,
        }];
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tight">
            Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#bf5af2]">Telemetry</span>
          </h2>
          <p className="text-[#94a3b8] max-w-xl">
            Real-time neural network activity and system diagnostics processed through the CyberOracle core.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 glass-card p-6 hud-brackets interactive"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-[#e2e8f0]">
                <Activity size={18} className="text-[#00f0ff]" />
                <h3 className="font-mono text-sm uppercase">Neural Throughput</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#39ff14] cyber-pulse" />
                <span className="text-xs font-mono text-[#39ff14]">LIVE</span>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.05)" vertical={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(17,24,39,0.9)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '4px' }}
                    itemStyle={{ color: '#00f0ff' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#00f0ff" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Side Metrics */}
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card p-6 flex-1 flex flex-col justify-between interactive stat-card-active"
            >
              <div className="flex items-center justify-between text-[#94a3b8] mb-2">
                <span className="text-xs font-mono uppercase">System Latency</span>
                <Wifi size={14} />
              </div>
              <div>
                <div className="text-4xl font-light text-white mb-1">
                  {data[data.length - 1].latency}<span className="text-lg text-[#64748b]">ms</span>
                </div>
                <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden mt-4">
                  <div 
                    className="h-full bg-[#00f0ff] transition-all duration-500" 
                    style={{ width: `${(data[data.length - 1].latency / 40) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-card p-6 flex-1 flex flex-col justify-between interactive stat-card-high"
            >
              <div className="flex items-center justify-between text-[#94a3b8] mb-2">
                <span className="text-xs font-mono uppercase">Threat Level</span>
                <ShieldAlert size={14} className="text-[#ff6b35]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#ff6b35] mb-1 uppercase tracking-widest">
                  Elevated
                </div>
                <p className="text-xs text-[#64748b]">3 active anomalies detected in sector 7G.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-card p-6 flex-1 flex flex-col justify-between interactive stat-card-success"
            >
              <div className="flex items-center justify-between text-[#94a3b8] mb-2">
                <span className="text-xs font-mono uppercase">Core Database</span>
                <Database size={14} className="text-[#39ff14]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1 uppercase">
                  Optimal
                </div>
                <p className="text-xs text-[#64748b]">Sync rate: 99.99%</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
