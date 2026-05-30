import re
import numpy as np
from urllib.parse import urlparse
import logging

logger = logging.getLogger(__name__)

SUSPICIOUS_URL_KEYWORDS = [
    "login", "verify", "secure", "update", "confirm", "account",
    "suspend", "unusual", "alert", "click", "here", "password",
    "bank", "paypal", "microsoft", "apple", "google",
]

SUSPICIOUS_TLDS = {
    ".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".buzz",
    ".club", ".work", ".click", ".link", ".info",
}


class PhishingDetector:
    def __init__(self):
        self.url_patterns = [re.compile(kw, re.IGNORECASE) for kw in SUSPICIOUS_URL_KEYWORDS]

    def analyze_url(self, url: str) -> dict:
        features = self._extract_url_features(url)
        score = self._calculate_phishing_score(features)

        return {
            "url": url,
            "phishing_score": score,
            "is_phishing": score > 0.6,
            "risk_level": (
                "critical" if score > 0.8
                else "high" if score > 0.6
                else "medium" if score > 0.4
                else "low"
            ),
            "features": features,
        }

    def _extract_url_features(self, url: str) -> dict:
        try:
            parsed = urlparse(url if "://" in url else f"http://{url}")
        except Exception:
            return {"error": "Invalid URL"}

        hostname = parsed.hostname or ""
        path = parsed.path or ""

        features = {
            "url_length": len(url),
            "hostname_length": len(hostname),
            "path_length": len(path),
            "num_dots": hostname.count("."),
            "num_hyphens": hostname.count("-"),
            "num_digits_in_hostname": sum(c.isdigit() for c in hostname),
            "has_ip": bool(re.match(r"^\d+\.\d+\.\d+\.\d+$", hostname)),
            "has_at_symbol": "@" in url,
            "has_double_slash_in_path": "//" in path,
            "num_subdomains": max(hostname.count(".") - 1, 0),
            "is_https": parsed.scheme == "https",
            "has_suspicious_tld": any(hostname.endswith(tld) for tld in SUSPICIOUS_TLDS),
            "num_params": len(parsed.query.split("&")) if parsed.query else 0,
            "suspicious_keyword_count": sum(
                1 for p in self.url_patterns if p.search(url)
            ),
            "has_port": bool(parsed.port and parsed.port not in (80, 443)),
        }
        return features

    def _calculate_phishing_score(self, features: dict) -> float:
        if "error" in features:
            return 0.5

        score = 0.0
        if features["url_length"] > 75:
            score += 0.1
        if features["has_ip"]:
            score += 0.25
        if features["has_at_symbol"]:
            score += 0.2
        if not features["is_https"]:
            score += 0.05
        if features["has_suspicious_tld"]:
            score += 0.2
        if features["num_subdomains"] > 3:
            score += 0.15
        if features["suspicious_keyword_count"] > 2:
            score += 0.15
        if features["num_digits_in_hostname"] > 4:
            score += 0.1
        if features["has_port"]:
            score += 0.1

        return min(score, 1.0)

    def batch_analyze(self, urls: list[str]) -> list[dict]:
        return [self.analyze_url(url) for url in urls]
