export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface ThreatEvent {
  id: string;
  timestamp: string;
  type: string;
  severity: ThreatSeverity;
  sourceIp: string;
  target: string;
  description: string;
  confidence: number;
}

export interface SystemHealth {
  cpuUsage: number;
  ramUsage: number;
  networkTraffic: number; // in MB/s
  activeConnections: number;
  status: 'optimal' | 'warning' | 'critical';
}

export interface AITaskStatus {
  taskId: string;
  status: 'scanning' | 'analyzing' | 'mitigating' | 'completed';
  progress: number;
  currentAction: string;
}
