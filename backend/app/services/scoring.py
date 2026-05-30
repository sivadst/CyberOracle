import logging

logger = logging.getLogger(__name__)


class ScoringService:
    WEIGHTS = {
        "ml_confidence": 0.30,
        "ioc_reputation": 0.25,
        "mitre_coverage": 0.15,
        "historical_frequency": 0.15,
        "severity_base": 0.15,
    }

    SEVERITY_BASE_SCORES = {
        "critical": 1.0,
        "high": 0.8,
        "medium": 0.5,
        "low": 0.2,
        "info": 0.05,
    }

    def calculate_composite_score(
        self,
        ml_confidence: float = 0.0,
        ioc_reputation: float = 0.0,
        mitre_mapped: bool = False,
        historical_hits: int = 0,
        severity: str = "medium",
    ) -> dict:
        ml_score = ml_confidence * self.WEIGHTS["ml_confidence"]
        ioc_score = ioc_reputation * self.WEIGHTS["ioc_reputation"]
        mitre_score = (0.8 if mitre_mapped else 0.0) * self.WEIGHTS["mitre_coverage"]

        freq_normalized = min(historical_hits / 100.0, 1.0)
        hist_score = freq_normalized * self.WEIGHTS["historical_frequency"]

        base = self.SEVERITY_BASE_SCORES.get(severity, 0.5)
        sev_score = base * self.WEIGHTS["severity_base"]

        total = ml_score + ioc_score + mitre_score + hist_score + sev_score

        if total > 0.8:
            priority = "P1 - Critical"
        elif total > 0.6:
            priority = "P2 - High"
        elif total > 0.3:
            priority = "P3 - Medium"
        else:
            priority = "P4 - Low"

        return {
            "composite_score": round(total, 4),
            "priority": priority,
            "breakdown": {
                "ml_component": round(ml_score, 4),
                "ioc_component": round(ioc_score, 4),
                "mitre_component": round(mitre_score, 4),
                "historical_component": round(hist_score, 4),
                "severity_component": round(sev_score, 4),
            },
        }


scoring_service = ScoringService()
