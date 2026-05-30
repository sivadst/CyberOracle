import logging
import json
from datetime import datetime, timezone
from app.core.redis import redis_manager
from app.services.mitre import mitre_service

logger = logging.getLogger(__name__)


class ThreatEngine:
    SEVERITY_WEIGHTS = {
        "critical": 1.0,
        "high": 0.8,
        "medium": 0.5,
        "low": 0.2,
        "info": 0.05,
    }

    async def process_threat(self, threat_data: dict) -> dict:
        category = threat_data.get("category", "unknown")
        tactic, technique = mitre_service.get_tactic_technique(category)
        kill_chain = mitre_service.get_kill_chain_phase(category)

        threat_data["mitre_tactic"] = tactic
        threat_data["mitre_technique"] = technique
        threat_data["kill_chain_phase"] = kill_chain

        threat_data["confidence_score"] = self._calculate_confidence(threat_data)

        await self._publish_threat(threat_data)

        return threat_data

    def _calculate_confidence(self, threat_data: dict) -> float:
        score = 0.3
        if threat_data.get("source_ip"):
            score += 0.1
        if threat_data.get("mitre_tactic"):
            score += 0.2
        if threat_data.get("raw_log"):
            score += 0.15
        if threat_data.get("ml_confidence"):
            score += threat_data["ml_confidence"] * 0.25
        return min(score, 1.0)

    async def _publish_threat(self, threat_data: dict):
        try:
            safe_data = {
                k: v for k, v in threat_data.items()
                if isinstance(v, (str, int, float, bool, type(None)))
            }
            safe_data["timestamp"] = datetime.now(timezone.utc).isoformat()
            await redis_manager.publish("threats", json.dumps(safe_data))
        except Exception as e:
            logger.error(f"Failed to publish threat: {e}")

    def triage_severity(self, threat_data: dict) -> str:
        score = 0.0
        category = threat_data.get("category", "")

        critical_categories = {"malware", "data_exfiltration", "command_and_control"}
        high_categories = {"intrusion", "privilege_escalation", "lateral_movement"}

        if category in critical_categories:
            score += 0.6
        elif category in high_categories:
            score += 0.4
        elif category == "reconnaissance":
            score += 0.1

        ml_conf = threat_data.get("ml_confidence", 0)
        score += ml_conf * 0.3

        if threat_data.get("source_ip") and not threat_data.get("destination_ip"):
            score += 0.1

        if score > 0.8:
            return "critical"
        elif score > 0.6:
            return "high"
        elif score > 0.3:
            return "medium"
        return "low"


threat_engine = ThreatEngine()
