import asyncio
import random
import uuid
import logging
from datetime import datetime, timezone
from app.websocket.manager import ws_manager
from app.core.redis import redis_manager

logger = logging.getLogger(__name__)

class AIThreatSimulator:
    def __init__(self):
        self.is_running = False
        self._task = None
        self.threat_types = [
            "SQL Injection Attempt",
            "DDoS Attack Signature",
            "Zero-Day Exploit",
            "Unauthorized Access",
            "Data Exfiltration",
            "Lateral Movement",
            "Ransomware Encryption Pattern"
        ]
        self.severities = ["critical", "high", "medium", "low"]
        self.targets = ["DB-Cluster-01", "Auth-Service", "Admin-Panel", "Payment-Gateway", "API-Gateway"]

    def _generate_threat(self):
        return {
            "id": f"t-{uuid.uuid4().hex[:8]}",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "type": random.choice(self.threat_types),
            "severity": random.choice(self.severities),
            "sourceIp": f"{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}",
            "target": random.choice(self.targets),
            "description": "Anomaly detected by AI Behavioral Engine.",
            "confidence": random.randint(80, 99)
        }

    async def _simulate_loop(self):
        logger.info("AI Threat Simulator Background Task Started.")
        while self.is_running:
            try:
                # Generate a random threat
                threat_data = self._generate_threat()
                
                # We can broadcast directly via WebSocket manager or through Redis
                # If Redis is connected, publish to channel. Otherwise broadcast directly.
                try:
                    import json
                    await redis_manager.client.publish("threats", json.dumps(threat_data))
                except (RuntimeError, Exception):
                    await ws_manager.broadcast({
                        "type": "stream:threats",
                        "data": threat_data
                    }, room="global")
                
                # Sleep for random interval between 2 and 7 seconds
                await asyncio.sleep(random.uniform(2.0, 7.0))
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Simulator error: {e}")
                await asyncio.sleep(5)
        
        logger.info("AI Threat Simulator Background Task Stopped.")

    def start(self):
        if not self.is_running:
            self.is_running = True
            self._task = asyncio.create_task(self._simulate_loop())

    async def stop(self):
        if self.is_running:
            self.is_running = False
            if self._task:
                self._task.cancel()
                try:
                    await self._task
                except asyncio.CancelledError:
                    pass

threat_simulator = AIThreatSimulator()
