import logging
import ipaddress
import hashlib
from app.models.ioc import IOCType

logger = logging.getLogger(__name__)


class IntelligenceService:
    async def enrich_ioc(self, ioc_type: IOCType, value: str) -> dict:
        if ioc_type == IOCType.IP:
            return await self._enrich_ip(value)
        elif ioc_type == IOCType.DOMAIN:
            return await self._enrich_domain(value)
        elif ioc_type in (IOCType.HASH_MD5, IOCType.HASH_SHA1, IOCType.HASH_SHA256):
            return await self._enrich_hash(value)
        elif ioc_type == IOCType.URL:
            return await self._enrich_url(value)
        return {"verdict": "unknown", "reputation_score": 0.0, "enrichment_data": {}}

    async def _enrich_ip(self, ip: str) -> dict:
        try:
            addr = ipaddress.ip_address(ip)
            is_private = addr.is_private
            is_loopback = addr.is_loopback
        except ValueError:
            return {"verdict": "unknown", "reputation_score": 0.0}

        if is_private or is_loopback:
            return {
                "verdict": "benign",
                "reputation_score": 0.0,
                "enrichment_data": {"type": "private/loopback"},
                "geo_info": {"country": "Internal", "city": "N/A"},
            }

        score = self._calculate_ip_risk_score(ip)
        verdict = "malicious" if score > 0.7 else "suspicious" if score > 0.4 else "unknown"

        return {
            "verdict": verdict,
            "reputation_score": score,
            "enrichment_data": {
                "ip_version": 4 if addr.version == 4 else 6,
                "is_global": addr.is_global,
            },
            "geo_info": {
                "country": "Unknown",
                "city": "Unknown",
                "latitude": 0.0,
                "longitude": 0.0,
            },
        }

    async def _enrich_domain(self, domain: str) -> dict:
        score = self._calculate_domain_risk_score(domain)
        verdict = "malicious" if score > 0.7 else "suspicious" if score > 0.4 else "unknown"

        return {
            "verdict": verdict,
            "reputation_score": score,
            "enrichment_data": {
                "domain_length": len(domain),
                "tld": domain.split(".")[-1] if "." in domain else "",
                "subdomain_count": domain.count("."),
            },
        }

    async def _enrich_hash(self, hash_value: str) -> dict:
        return {
            "verdict": "unknown",
            "reputation_score": 0.0,
            "enrichment_data": {
                "hash_type": "md5" if len(hash_value) == 32
                else "sha1" if len(hash_value) == 40
                else "sha256" if len(hash_value) == 64
                else "unknown",
            },
        }

    async def _enrich_url(self, url: str) -> dict:
        suspicious_patterns = ["bit.ly", "tinyurl", ".tk", ".ml", "login", "verify", "secure"]
        score = sum(0.15 for p in suspicious_patterns if p in url.lower())
        score = min(score, 1.0)
        verdict = "malicious" if score > 0.7 else "suspicious" if score > 0.4 else "unknown"

        return {
            "verdict": verdict,
            "reputation_score": score,
            "enrichment_data": {"url_length": len(url)},
        }

    def _calculate_ip_risk_score(self, ip: str) -> float:
        h = int(hashlib.md5(ip.encode()).hexdigest(), 16) % 100
        return h / 100.0

    def _calculate_domain_risk_score(self, domain: str) -> float:
        score = 0.0
        suspicious_tlds = {".xyz", ".tk", ".ml", ".ga", ".cf", ".top", ".buzz"}
        for tld in suspicious_tlds:
            if domain.endswith(tld):
                score += 0.3
        if len(domain) > 30:
            score += 0.2
        if domain.count(".") > 3:
            score += 0.15
        if any(c.isdigit() for c in domain.split(".")[0]):
            score += 0.1
        return min(score, 1.0)

    async def get_ip_reputation(self, ip: str) -> dict:
        enrichment = await self._enrich_ip(ip)
        return {
            "ip": ip,
            "risk_score": enrichment["reputation_score"],
            "abuse_confidence": enrichment["reputation_score"] * 100,
            "country": enrichment.get("geo_info", {}).get("country"),
            "isp": None,
            "is_tor": False,
            "is_vpn": False,
            "is_proxy": False,
            "open_ports": [],
            "associated_threats": [],
        }

    async def get_domain_reputation(self, domain: str) -> dict:
        enrichment = await self._enrich_domain(domain)
        return {
            "domain": domain,
            "risk_score": enrichment["reputation_score"],
            "categories": [],
            "registrar": None,
            "creation_date": None,
            "dns_records": None,
            "ssl_info": None,
        }
