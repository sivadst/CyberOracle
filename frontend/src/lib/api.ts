const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface RequestOptions extends RequestInit {
  token?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("co_token", token);
      document.cookie = `auth-storage=${token}; path=/; max-age=86400; SameSite=Lax`;
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("co_token");
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("co_token");
      localStorage.removeItem("co_refresh");
      document.cookie = "auth-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;
    const authToken = token || this.getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(fetchOptions.headers as Record<string, string>),
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (response.status === 401) {
      this.clearToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    if (response.status === 204) return {} as T;
    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async del<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // Auth
  async login(email: string, password: string) {
    const res = await this.post<{
      access_token: string;
      refresh_token: string;
      expires_in: number;
    }>("/auth/login", { email, password });
    this.setToken(res.access_token);
    if (typeof window !== "undefined") {
      localStorage.setItem("co_refresh", res.refresh_token);
    }
    return res;
  }

  async register(data: { email: string; username: string; password: string; full_name?: string }) {
    return this.post("/auth/register", data);
  }

  async getMe() {
    return this.get<UserResponse>("/auth/me");
  }

  // Threats
  async getThreats(params?: Record<string, string>) {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.get<ThreatResponse[]>(`/threats${query}`);
  }

  async getThreatStats() {
    return this.get<ThreatStats>("/threats/stats");
  }

  async getThreat(id: string) {
    return this.get<ThreatResponse>(`/threats/${id}`);
  }

  async createThreat(data: Partial<ThreatResponse>) {
    return this.post<ThreatResponse>("/threats", data);
  }

  async updateThreat(id: string, data: Partial<ThreatResponse>) {
    return this.patch<ThreatResponse>(`/threats/${id}`, data);
  }

  // Alerts
  async getAlerts(params?: Record<string, string>) {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.get<AlertResponse[]>(`/alerts${query}`);
  }

  async getAlertCounts() {
    return this.get<Record<string, number>>("/alerts/summary/counts");
  }

  async updateAlert(id: string, data: Record<string, unknown>) {
    return this.patch<AlertResponse>(`/alerts/${id}`, data);
  }

  async escalateAlert(id: string, data: { escalated_to: string; reason: string }) {
    return this.post<AlertResponse>(`/alerts/${id}/escalate`, data);
  }

  // Intelligence
  async getIOCs(params?: Record<string, string>) {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.get<IOCResponse[]>(`/intelligence/iocs${query}`);
  }

  async enrichIOC(data: { type: string; value: string }) {
    return this.post<IOCResponse>("/intelligence/enrich", data);
  }

  async getIPReputation(ip: string) {
    return this.get<IPReputation>(`/intelligence/ip/${ip}`);
  }

  async getDomainReputation(domain: string) {
    return this.get<DomainReputation>(`/intelligence/domain/${domain}`);
  }

  async getIntelStats() {
    return this.get<Record<string, number>>("/intelligence/stats");
  }

  // Analytics
  async getDashboard() {
    return this.get<DashboardData>("/analytics/dashboard");
  }

  async getThreatTimeline(days = 7) {
    return this.get<TimelinePoint[]>(`/analytics/threats/timeline?days=${days}`);
  }

  async getThreatsBySeverity() {
    return this.get<Record<string, number>>("/analytics/threats/by-severity");
  }

  async getThreatsByCategory() {
    return this.get<Record<string, number>>("/analytics/threats/by-category");
  }

  async getTopAttackers(limit = 10) {
    return this.get<{ ip: string; count: number }[]>(`/analytics/threats/top-attackers?limit=${limit}`);
  }

  async getMitreHeatmap() {
    return this.get<{ tactic: string; technique: string; count: number }[]>(
      "/analytics/threats/mitre-heatmap"
    );
  }

  // Copilot
  async askCopilot(query: string, threatId?: string) {
    return this.post<CopilotResponse>("/copilot/ask", {
      query,
      threat_id: threatId,
    });
  }

  async analyzeIncident(threatId: string) {
    return this.post<IncidentAnalysis>("/copilot/analyze-incident", {
      threat_id: threatId,
    });
  }

  async getRemediation(threatId: string) {
    return this.post<RemediationResponse>("/copilot/remediation", {
      threat_id: threatId,
    });
  }

  // Health
  async getHealth() {
    const res = await fetch(
      (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/health"
    );
    return res.json();
  }
}

// Types
export interface UserResponse {
  id: string;
  email: string;
  username: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  avatar_url: string | null;
  last_login: string | null;
  created_at: string;
}

export interface ThreatResponse {
  id: string;
  title: string;
  description: string | null;
  severity: "critical" | "high" | "medium" | "low" | "info";
  status: string;
  category: string;
  source_ip: string | null;
  destination_ip: string | null;
  source_port: number | null;
  destination_port: number | null;
  protocol: string | null;
  mitre_tactic: string | null;
  mitre_technique: string | null;
  mitre_subtechnique: string | null;
  kill_chain_phase: string | null;
  confidence_score: number;
  ml_prediction: string | null;
  ml_confidence: number | null;
  geo_data: Record<string, unknown> | null;
  source_system: string | null;
  event_time: string;
  created_at: string;
}

export interface ThreatStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  new_today: number;
  active_investigations: number;
}

export interface AlertResponse {
  id: string;
  title: string;
  description: string | null;
  severity: "critical" | "high" | "medium" | "low";
  status: string;
  threat_event_id: string | null;
  assigned_to: string | null;
  escalated_to: string | null;
  rule_name: string | null;
  source: string | null;
  ai_summary: string | null;
  remediation_notes: string | null;
  acknowledged_at: string | null;
  resolved_at: string | null;
  sla_deadline: string | null;
  created_at: string;
}

export interface IOCResponse {
  id: string;
  type: string;
  value: string;
  verdict: "malicious" | "suspicious" | "benign" | "unknown";
  reputation_score: number;
  confidence: number;
  hit_count: number;
  source: string | null;
  tags: Record<string, unknown> | null;
  enrichment_data: Record<string, unknown> | null;
  geo_info: Record<string, unknown> | null;
  whois_data: Record<string, unknown> | null;
  is_whitelisted: boolean;
  first_seen: string;
  last_seen: string;
}

export interface IPReputation {
  ip: string;
  risk_score: number;
  abuse_confidence: number;
  country: string | null;
  isp: string | null;
  is_tor: boolean;
  is_vpn: boolean;
  is_proxy: boolean;
  open_ports: number[];
  associated_threats: string[];
}

export interface DomainReputation {
  domain: string;
  risk_score: number;
  categories: string[];
  registrar: string | null;
  creation_date: string | null;
  dns_records: Record<string, unknown> | null;
  ssl_info: Record<string, unknown> | null;
}

export interface DashboardData {
  total_threats: number;
  threats_today: number;
  open_alerts: number;
  critical_threats: number;
  total_iocs: number;
  threat_trend: string;
  risk_level: string;
}

export interface TimelinePoint {
  date: string;
  count: number;
}

export interface CopilotResponse {
  response: string;
  confidence: number;
  recommendations: string[];
  mitre_references: { tactic: string; technique: string; description?: string }[] | null;
  related_threats: string[] | null;
}

export interface IncidentAnalysis {
  threat_id: string;
  title: string;
  severity_assessment: string;
  category: string;
  attack_phase: string;
  mitre_mapping: Record<string, string> | null;
  risk_factors: string[];
  recommended_actions: string[];
  confidence: number;
}

export interface RemediationResponse {
  threat_id: string;
  category: string;
  severity: string;
  remediation_steps: {
    immediate: string[];
    short_term: string[];
    long_term: string[];
  };
  estimated_time: string;
  priority: string;
}

export const api = new ApiClient(API_BASE);
export default api;
