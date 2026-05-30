'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ThreatEvent } from '@/types';
import { TerminalText } from '@/components/ui/Terminal';

// Mock initial data
const initialThreats: ThreatEvent[] = [
  { id: 't-1', timestamp: new Date(Date.now() - 5000).toISOString(), type: 'SQL Injection Attempt', severity: 'high', sourceIp: '192.168.1.105', target: 'Database-Cluster-01', description: 'Malformed SQL query detected on auth endpoint.', confidence: 92 },
  { id: 't-2', timestamp: new Date(Date.now() - 15000).toISOString(), type: 'Unauthorized Access', severity: 'critical', sourceIp: '45.33.22.11', target: 'Admin-Panel', description: 'Multiple failed login attempts followed by bypass.', confidence: 98 },
];

export function LiveThreatFeed() {
  const [threats, setThreats] = useState<ThreatEvent[]>(initialThreats);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mock WebSocket simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const severities: ('critical' | 'high' | 'medium' | 'low')[] = ['critical', 'high', 'medium', 'low'];
      const types = ['DDoS Attack', 'Malware Signature', 'Zero-Day Exploit', 'Port Scan', 'Data Exfiltration'];
      
      const newThreat: ThreatEvent = {
        id: `t-${Math.random().toString(36).substring(7)}`,
        timestamp: new Date().toISOString(),
        type: types[Math.floor(Math.random() * types.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        sourceIp: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
        target: `Node-${Math.floor(Math.random() * 100)}`,
        description: 'Anomaly detected by AI Behavioral Engine.',
        confidence: Math.floor(Math.random() * 20) + 80
      };

      setThreats(prev => [newThreat, ...prev].slice(0, 50));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-4 border-b border-[rgba(0,240,255,0.1)] pb-2">
        <h3 className="font-mono text-[#00f0ff] uppercase text-sm font-bold tracking-wider flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#ff073a] alert-critical-flash" />
          Live Threat Feed
        </h3>
        <span className="text-[10px] text-[#94a3b8] uppercase tracking-widest font-mono">WS_CONN: ESTABLISHED</span>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3" ref={scrollRef}>
        {threats.map((threat, index) => (
          <div key={threat.id} className="flex flex-col gap-1 p-3 bg-[rgba(10,14,23,0.5)] rounded border border-[rgba(30,41,59,0.5)] hover:border-[rgba(0,240,255,0.2)] transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Badge severity={threat.severity}>{threat.severity}</Badge>
                <span className="font-mono text-xs text-[#e2e8f0] font-bold">{threat.type}</span>
              </div>
              <span className="font-mono text-[10px] text-[#64748b]">
                {new Date(threat.timestamp).toLocaleTimeString()}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase text-[#64748b] tracking-wider">Source</span>
                <span className="text-xs font-mono text-[#ff6b35]">{threat.sourceIp}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase text-[#64748b] tracking-wider">Target</span>
                <span className="text-xs font-mono text-[#00f0ff]">{threat.target}</span>
              </div>
            </div>
            
            <div className="mt-2 text-xs text-[#94a3b8]">
              {index === 0 ? (
                <TerminalText text={`> ${threat.description} (AI Conf: ${threat.confidence}%)`} typingDuration={1} />
              ) : (
                `> ${threat.description} (AI Conf: ${threat.confidence}%)`
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
