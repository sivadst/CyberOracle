'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ShieldAlert, ActivitySquare, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThreatSeverityCards() {
  const cards = [
    { title: 'Critical Threats', value: 3, label: 'Active', icon: ShieldAlert, color: '#ff073a', variant: 'critical' },
    { title: 'High Severity', value: 12, label: 'Investigating', icon: ActivitySquare, color: '#ff6b35', variant: 'high' },
    { title: 'AI Confidence', value: '98.5%', label: 'Precision', icon: Zap, color: '#00f0ff', variant: 'active' },
    { title: 'System Status', value: 'Secured', label: 'Nodes Online', icon: ShieldCheck, color: '#39ff14', variant: 'success' },
  ] as const;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card variant={card.variant} className="p-5 flex flex-col justify-between h-32">
              <div className="flex justify-between items-start">
                <span className="text-[#94a3b8] font-mono text-xs uppercase">{card.title}</span>
                <Icon size={16} color={card.color} />
              </div>
              <div>
                <div className="text-3xl font-black text-white">{card.value}</div>
                <div className="text-[10px] uppercase font-bold tracking-widest mt-1" style={{ color: card.color }}>
                  {card.label}
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
