type WSHandler = (data: Record<string, unknown>) => void;

export class CyberSocket {
  private ws: WebSocket | null = null;
  private handlers: Map<string, Set<WSHandler>> = new Map();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private clientId: string;
  private url: string;
  private isConnected = false;

  constructor(clientId?: string) {
    this.clientId = clientId || `co_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    this.url = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    try {
      this.ws = new WebSocket(`${this.url}/ws/${this.clientId}`);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.emit("connection", { status: "connected", clientId: this.clientId });
        this.subscribe("threats");
        this.subscribe("alerts");
        this.subscribe("soc_feed");
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.emit(data.type, data);
        } catch {
          // ignore malformed messages
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.emit("connection", { status: "disconnected" });
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this.emit("connection", { status: "error" });
      };
    } catch {
      this.scheduleReconnect();
    }
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  subscribe(room: string) {
    this.send({ action: "subscribe", room });
  }

  unsubscribe(room: string) {
    this.send({ action: "unsubscribe", room });
  }

  on(event: string, handler: WSHandler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
    return () => this.handlers.get(event)?.delete(handler);
  }

  off(event: string, handler: WSHandler) {
    this.handlers.get(event)?.delete(handler);
  }

  private emit(event: string, data: Record<string, unknown>) {
    this.handlers.get(event)?.forEach((handler) => handler(data));
    this.handlers.get("*")?.forEach((handler) => handler({ ...data, _event: event }));
  }

  private send(data: Record<string, unknown>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  private startHeartbeat() {
    setInterval(() => {
      if (this.isConnected) {
        this.send({ action: "ping" });
      }
    }, 30000);
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 3000);
  }

  get connected() {
    return this.isConnected;
  }
}

export const cyberSocket = new CyberSocket();
