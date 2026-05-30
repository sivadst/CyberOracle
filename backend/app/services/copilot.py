import logging
from app.models.threat import ThreatEvent
from app.services.mitre import mitre_service

logger = logging.getLogger(__name__)


class CopilotService:
    async def analyze_query(
        self,
        query: str,
        threat_context: dict | None = None,
        additional_context: dict | None = None,
    ) -> dict:
        recommendations = []
        confidence = 0.75
        mitre_refs = []

        keywords = query.lower()

        if any(w in keywords for w in ["malware", "virus", "trojan", "ransomware"]):
            recommendations = [
                "Isolate affected endpoints immediately",
                "Run full system scan with updated signatures",
                "Check for lateral movement indicators",
                "Review process execution logs for anomalies",
                "Block associated IOCs at network perimeter",
            ]
            mitre_refs = [{"tactic": "Execution", "technique": "T1204"}]
            confidence = 0.85

        elif any(w in keywords for w in ["phishing", "email", "spam"]):
            recommendations = [
                "Quarantine the email and block sender domain",
                "Check if any users clicked the link",
                "Review email gateway logs for similar messages",
                "Update email filtering rules",
                "Send security awareness notification to affected users",
            ]
            mitre_refs = [{"tactic": "Initial Access", "technique": "T1566"}]
            confidence = 0.9

        elif any(w in keywords for w in ["ddos", "dos", "flood", "traffic"]):
            recommendations = [
                "Enable DDoS mitigation on WAF/CDN",
                "Rate-limit traffic from suspicious sources",
                "Analyze traffic patterns for attack signatures",
                "Contact upstream ISP for traffic scrubbing",
            ]
            confidence = 0.8

        elif any(w in keywords for w in ["breach", "exfil", "data leak"]):
            recommendations = [
                "Identify scope of data exposure",
                "Preserve forensic evidence",
                "Notify incident response team",
                "Check DLP logs for unauthorized transfers",
                "Revoke compromised credentials immediately",
            ]
            confidence = 0.7

        else:
            recommendations = [
                "Review recent threat events for patterns",
                "Check IOC feeds for related indicators",
                "Monitor network traffic for anomalies",
                "Ensure all systems are patched to latest versions",
            ]
            confidence = 0.6

        if threat_context:
            category = threat_context.get("category", "")
            mapping = mitre_service.get_mapping(category)
            if mapping:
                mitre_refs.append({
                    "tactic": mapping["tactic"],
                    "technique": mapping["technique"],
                    "description": mapping["description"],
                })

        response_text = self._build_response(query, recommendations, threat_context)

        return {
            "response": response_text,
            "confidence": confidence,
            "recommendations": recommendations,
            "mitre_references": mitre_refs if mitre_refs else None,
            "related_threats": None,
        }

    async def analyze_incident(self, threat: ThreatEvent) -> dict:
        category = threat.category.value if threat.category else "unknown"
        mapping = mitre_service.get_mapping(category)

        analysis = {
            "threat_id": str(threat.id),
            "title": threat.title,
            "severity_assessment": threat.severity.value,
            "category": category,
            "attack_phase": mapping["kill_chain"] if mapping else "unknown",
            "mitre_mapping": mapping,
            "risk_factors": [],
            "timeline": [],
            "recommended_actions": [],
            "confidence": 0.0,
        }

        risk_factors = []
        if threat.severity.value in ("critical", "high"):
            risk_factors.append("High severity threat requiring immediate attention")
        if threat.source_ip:
            risk_factors.append(f"External source detected: {threat.source_ip}")
        if threat.confidence_score and threat.confidence_score > 0.8:
            risk_factors.append("High ML confidence in threat classification")
        analysis["risk_factors"] = risk_factors

        actions = [
            f"Investigate {category} activity from source {threat.source_ip or 'unknown'}",
            "Collect and preserve forensic artifacts",
            "Check for related IOCs across the infrastructure",
        ]
        if mapping:
            actions.append(f"Review MITRE {mapping['tactic']} - {mapping['technique']} playbook")
        analysis["recommended_actions"] = actions
        analysis["confidence"] = 0.75

        return analysis

    async def generate_remediation(self, threat: ThreatEvent, context: str | None = None) -> dict:
        category = threat.category.value if threat.category else "unknown"

        remediation_map = {
            "malware": {
                "immediate": [
                    "Isolate infected systems from network",
                    "Kill malicious processes",
                    "Quarantine malicious files",
                ],
                "short_term": [
                    "Run full AV scan across all endpoints",
                    "Update malware signatures",
                    "Patch exploited vulnerabilities",
                ],
                "long_term": [
                    "Implement application whitelisting",
                    "Deploy EDR solution",
                    "Enhance email filtering",
                ],
            },
            "phishing": {
                "immediate": [
                    "Block sender domain/IP",
                    "Remove phishing emails from mailboxes",
                    "Reset compromised credentials",
                ],
                "short_term": [
                    "Review email gateway rules",
                    "Scan for similar messages",
                    "Check for credential reuse",
                ],
                "long_term": [
                    "Implement DMARC/DKIM/SPF",
                    "Deploy advanced email security",
                    "Conduct phishing awareness training",
                ],
            },
        }

        default = {
            "immediate": ["Investigate and contain the threat", "Preserve evidence"],
            "short_term": ["Review security controls", "Update detection rules"],
            "long_term": ["Improve monitoring", "Update incident response procedures"],
        }

        steps = remediation_map.get(category, default)

        return {
            "threat_id": str(threat.id),
            "category": category,
            "severity": threat.severity.value,
            "remediation_steps": steps,
            "estimated_time": "2-4 hours" if threat.severity.value in ("critical", "high") else "4-8 hours",
            "priority": "P1" if threat.severity.value == "critical" else "P2",
        }

    def _build_response(self, query: str, recommendations: list, context: dict | None) -> str:
        parts = [f"Analysis of your query: \"{query}\""]
        if context:
            parts.append(
                f"Based on the associated threat ({context.get('category', 'N/A')} - "
                f"Severity: {context.get('severity', 'N/A')})"
            )
        parts.append("Recommended actions:")
        for i, rec in enumerate(recommendations, 1):
            parts.append(f"  {i}. {rec}")
        return "\n".join(parts)
