import re
import logging
import numpy as np

logger = logging.getLogger(__name__)

SUSPICIOUS_PATTERNS = {
    "brute_force": [
        r"failed (?:login|password|auth)",
        r"invalid (?:user|credentials)",
        r"authentication fail",
        r"access denied",
    ],
    "privilege_escalation": [
        r"sudo",
        r"privilege",
        r"root access",
        r"admin escalat",
        r"setuid",
    ],
    "data_exfiltration": [
        r"large (?:upload|transfer)",
        r"unusual (?:data|traffic) volume",
        r"dns tunnel",
        r"exfiltrat",
    ],
    "malware": [
        r"malware",
        r"trojan",
        r"ransomware",
        r"backdoor",
        r"keylogger",
        r"rootkit",
    ],
    "reconnaissance": [
        r"port scan",
        r"nmap",
        r"enumerat",
        r"fingerprint",
        r"network scan",
    ],
    "c2_communication": [
        r"beacon",
        r"callback",
        r"command.?and.?control",
        r"c2",
        r"reverse shell",
    ],
}


class LogAnalyzer:
    def __init__(self):
        self._compiled_patterns: dict[str, list[re.Pattern]] = {}
        for category, patterns in SUSPICIOUS_PATTERNS.items():
            self._compiled_patterns[category] = [
                re.compile(p, re.IGNORECASE) for p in patterns
            ]

    def analyze_log(self, log_text: str) -> dict:
        matches = {}
        total_score = 0.0

        for category, patterns in self._compiled_patterns.items():
            category_matches = []
            for pattern in patterns:
                found = pattern.findall(log_text)
                if found:
                    category_matches.extend(found)

            if category_matches:
                matches[category] = {
                    "count": len(category_matches),
                    "matched_terms": list(set(category_matches))[:5],
                }
                total_score += min(len(category_matches) * 0.15, 0.5)

        risk_level = (
            "critical" if total_score > 0.8
            else "high" if total_score > 0.5
            else "medium" if total_score > 0.2
            else "low"
        )

        return {
            "risk_score": min(total_score, 1.0),
            "risk_level": risk_level,
            "category_matches": matches,
            "primary_category": max(matches, key=lambda k: matches[k]["count"]) if matches else None,
            "log_length": len(log_text),
            "suspicious": bool(matches),
        }

    def batch_analyze(self, logs: list[str]) -> list[dict]:
        return [self.analyze_log(log) for log in logs]

    def extract_iocs_from_log(self, log_text: str) -> dict:
        ip_pattern = re.compile(r'\b(?:\d{1,3}\.){3}\d{1,3}\b')
        domain_pattern = re.compile(r'\b(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\b')
        hash_md5 = re.compile(r'\b[a-fA-F0-9]{32}\b')
        hash_sha256 = re.compile(r'\b[a-fA-F0-9]{64}\b')
        url_pattern = re.compile(r'https?://[^\s<>"]+')

        return {
            "ips": list(set(ip_pattern.findall(log_text))),
            "domains": list(set(domain_pattern.findall(log_text)))[:20],
            "md5_hashes": list(set(hash_md5.findall(log_text))),
            "sha256_hashes": list(set(hash_sha256.findall(log_text))),
            "urls": list(set(url_pattern.findall(log_text))),
        }
