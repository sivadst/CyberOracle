"use client";

import { Settings as SettingsIcon, Key, Bell, Shield, Globe } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-3">
        <SettingsIcon className="w-7 h-7 text-cyan-400" />
        Configuration
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Configuration */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" /> API Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">Backend URL</label>
              <input defaultValue="http://localhost:8000" className="w-full px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">WebSocket URL</label>
              <input defaultValue="ws://localhost:8000" className="w-full px-3 py-2.5 text-sm" />
            </div>
          </div>
        </div>

        {/* Threat Intelligence Keys */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" /> API Keys
          </h3>
          <div className="space-y-4">
            {["VirusTotal", "AbuseIPDB", "Shodan", "OTX AlienVault"].map((name) => (
              <div key={name}>
                <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">{name}</label>
                <input type="password" placeholder="••••••••" className="w-full px-3 py-2.5 text-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" /> Notifications
          </h3>
          <div className="space-y-3">
            {[
              { label: "Critical threat alerts", defaultChecked: true },
              { label: "New IOC detections", defaultChecked: true },
              { label: "SLA breach warnings", defaultChecked: true },
              { label: "System health degradation", defaultChecked: false },
              { label: "Daily threat summary", defaultChecked: false },
            ].map((n) => (
              <label key={n.label} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked={n.defaultChecked}
                  className="!w-4 !h-4 !rounded !border-slate-600 !bg-transparent accent-cyan-500" />
                <span className="text-sm text-slate-300">{n.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" /> Security
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">Session Timeout (minutes)</label>
              <input type="number" defaultValue={30} className="w-full px-3 py-2.5 text-sm" />
            </div>
            <button className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-sm hover:bg-red-500/20 transition-colors">
              Regenerate API Key
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:from-cyan-400 neon-glow">
          Save Configuration
        </button>
      </div>
    </div>
  );
}
