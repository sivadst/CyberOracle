import logging
from app.models.ioc import IOCType

logger = logging.getLogger(__name__)

MITRE_ATTACK_MAPPING = {
    "malware": {
        "tactic": "Execution",
        "technique": "T1204",
        "description": "User Execution",
        "kill_chain": "installation",
    },
    "phishing": {
        "tactic": "Initial Access",
        "technique": "T1566",
        "description": "Phishing",
        "kill_chain": "delivery",
    },
    "intrusion": {
        "tactic": "Initial Access",
        "technique": "T1190",
        "description": "Exploit Public-Facing Application",
        "kill_chain": "exploitation",
    },
    "dos": {
        "tactic": "Impact",
        "technique": "T1499",
        "description": "Endpoint Denial of Service",
        "kill_chain": "actions_on_objectives",
    },
    "data_exfiltration": {
        "tactic": "Exfiltration",
        "technique": "T1041",
        "description": "Exfiltration Over C2 Channel",
        "kill_chain": "actions_on_objectives",
    },
    "privilege_escalation": {
        "tactic": "Privilege Escalation",
        "technique": "T1068",
        "description": "Exploitation for Privilege Escalation",
        "kill_chain": "exploitation",
    },
    "lateral_movement": {
        "tactic": "Lateral Movement",
        "technique": "T1021",
        "description": "Remote Services",
        "kill_chain": "lateral_movement",
    },
    "command_and_control": {
        "tactic": "Command and Control",
        "technique": "T1071",
        "description": "Application Layer Protocol",
        "kill_chain": "command_and_control",
    },
    "reconnaissance": {
        "tactic": "Reconnaissance",
        "technique": "T1595",
        "description": "Active Scanning",
        "kill_chain": "reconnaissance",
    },
    "insider_threat": {
        "tactic": "Collection",
        "technique": "T1005",
        "description": "Data from Local System",
        "kill_chain": "actions_on_objectives",
    },
}

KILL_CHAIN_PHASES = [
    "reconnaissance",
    "weaponization",
    "delivery",
    "exploitation",
    "installation",
    "command_and_control",
    "lateral_movement",
    "actions_on_objectives",
]


class MitreService:
    def get_mapping(self, category: str) -> dict | None:
        return MITRE_ATTACK_MAPPING.get(category)

    def get_kill_chain_phase(self, category: str) -> str | None:
        mapping = self.get_mapping(category)
        return mapping["kill_chain"] if mapping else None

    def get_tactic_technique(self, category: str) -> tuple[str | None, str | None]:
        mapping = self.get_mapping(category)
        if mapping:
            return mapping["tactic"], mapping["technique"]
        return None, None

    def get_all_tactics(self) -> list[str]:
        return list(set(m["tactic"] for m in MITRE_ATTACK_MAPPING.values()))

    def get_techniques_for_tactic(self, tactic: str) -> list[dict]:
        return [
            {"technique": m["technique"], "description": m["description"], "category": cat}
            for cat, m in MITRE_ATTACK_MAPPING.items()
            if m["tactic"] == tactic
        ]


mitre_service = MitreService()
