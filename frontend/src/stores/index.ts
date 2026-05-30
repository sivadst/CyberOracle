import { create } from "zustand";
import api, {
  type UserResponse,
  type DashboardData,
  type ThreatResponse,
  type AlertResponse,
  type ThreatStats,
} from "@/lib/api";

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async (email, password) => {
    await api.login(email, password);
    const user = await api.getMe();
    set({ user: user, isAuthenticated: true, isLoading: false });
  },
  logout: () => {
    api.clearToken();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
  loadUser: async () => {
    try {
      if (!api.getToken()) {
        set({ isLoading: false });
        return;
      }
      const user = await api.getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

interface DashboardState {
  data: DashboardData | null;
  stats: ThreatStats | null;
  threats: ThreatResponse[];
  alerts: AlertResponse[];
  isLoading: boolean;
  error: string | null;
  wsConnected: boolean;
  setWsConnected: (v: boolean) => void;
  loadDashboard: () => Promise<void>;
  loadThreats: (params?: Record<string, string>) => Promise<void>;
  loadAlerts: (params?: Record<string, string>) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  data: null,
  stats: null,
  threats: [],
  alerts: [],
  isLoading: false,
  error: null,
  wsConnected: false,
  setWsConnected: (v) => set({ wsConnected: v }),
  loadDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const [data, stats] = await Promise.all([api.getDashboard(), api.getThreatStats()]);
      set({ data, stats, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },
  loadThreats: async (params) => {
    try {
      const threats = await api.getThreats(params);
      set({ threats });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },
  loadAlerts: async (params) => {
    try {
      const alerts = await api.getAlerts(params);
      set({ alerts });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },
}));
