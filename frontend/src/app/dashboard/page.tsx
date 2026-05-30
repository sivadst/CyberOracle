import React from 'react';
import { ThreatSeverityCards } from '@/components/dashboard/ThreatSeverityCards';
import { WorldMap } from '@/components/dashboard/WorldMap';
import { LiveThreatFeed } from '@/components/dashboard/LiveThreatFeed';
import { SystemHealthMonitoring } from '@/components/dashboard/SystemHealthMonitoring';
import { Card } from '@/components/ui/Card';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* Header section could go here if not in layout */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">Command <span className="text-[#00f0ff]">Center</span></h1>
          <p className="text-sm text-[#94a3b8] font-mono mt-1">v4.0.2 // AI Defense Matrix Active</p>
        </div>
        <div className="hidden md:flex gap-2">
          <div className="px-3 py-1 bg-[rgba(57,255,20,0.1)] border border-[rgba(57,255,20,0.3)] rounded text-xs text-[#39ff14] font-mono uppercase font-bold tracking-wider">
            All Systems Nominal
          </div>
        </div>
      </div>

      <ThreatSeverityCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="h-[400px] p-0 overflow-hidden relative">
            <div className="absolute top-4 left-4 z-20">
              <h3 className="font-mono text-[#00f0ff] uppercase text-sm font-bold tracking-wider drop-shadow-md">Global Attack Vectors</h3>
            </div>
            <WorldMap />
          </Card>
          <SystemHealthMonitoring />
        </div>
        <div className="lg:col-span-1">
          <LiveThreatFeed />
        </div>
      </div>
    </div>
  );
}
