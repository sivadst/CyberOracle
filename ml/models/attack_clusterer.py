import numpy as np
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler
import logging
from collections import defaultdict

logger = logging.getLogger(__name__)


class AttackClusterer:
    def __init__(self, eps: float = 0.5, min_samples: int = 3):
        self.model = DBSCAN(eps=eps, min_samples=min_samples, metric="euclidean")
        self.scaler = StandardScaler()

    def cluster_attacks(self, X: np.ndarray, metadata: list[dict] | None = None) -> dict:
        X_scaled = self.scaler.fit_transform(X)
        labels = self.model.fit_predict(X_scaled)

        n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
        n_noise = list(labels).count(-1)

        clusters = defaultdict(list)
        for i, label in enumerate(labels):
            entry = {"index": i, "cluster": int(label)}
            if metadata and i < len(metadata):
                entry.update(metadata[i])
            clusters[int(label)].append(entry)

        campaign_analysis = []
        for cluster_id, members in clusters.items():
            if cluster_id == -1:
                continue
            campaign_analysis.append({
                "campaign_id": cluster_id,
                "size": len(members),
                "members": members[:10],
                "likely_coordinated": len(members) >= 5,
            })

        return {
            "n_clusters": n_clusters,
            "n_noise_points": n_noise,
            "total_samples": len(X),
            "campaigns": sorted(campaign_analysis, key=lambda c: c["size"], reverse=True),
            "noise_points": clusters.get(-1, [])[:10],
        }

    @staticmethod
    def extract_features(events: list[dict]) -> np.ndarray:
        feature_matrix = []
        for event in events:
            features = [
                hash(event.get("source_ip", "")) % 10000,
                event.get("destination_port", 0),
                hash(event.get("category", "")) % 100,
                event.get("confidence_score", 0.0) * 100,
                hash(event.get("mitre_tactic", "")) % 100,
            ]
            feature_matrix.append(features)
        return np.array(feature_matrix)
