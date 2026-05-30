'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card } from '@/components/ui/Card';

const mockData = Array.from({ length: 20 }).map((_, i) => ({
  time: `${i}s ago`,
  cpu: Math.floor(Math.random() * 40) + 20,
  network: Math.floor(Math.random() * 100) + 50,
}));

export function SystemHealthMonitoring() {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3 h-72 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-mono text-[#00f0ff] uppercase text-sm font-bold tracking-wider">Neural Engine Telemetry</h3>
        <span className="text-xs text-[#39ff14] bg-[rgba(57,255,20,0.1)] px-2 py-1 rounded">Optimal</span>
      </div>
      <div className="w-full h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#bf5af2" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#bf5af2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(17,24,39,0.9)', borderColor: 'rgba(0,240,255,0.2)', borderRadius: '8px' }}
              itemStyle={{ color: '#00f0ff' }}
            />
            <Area type="monotone" dataKey="cpu" stroke="#00f0ff" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
            <Area type="monotone" dataKey="network" stroke="#bf5af2" strokeWidth={2} fillOpacity={1} fill="url(#colorNetwork)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
