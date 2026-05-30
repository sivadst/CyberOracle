import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import logging

logger = logging.getLogger(__name__)


class AnomalyDetector:
    def __init__(self, contamination: float = 0.1, n_estimators: int = 100):
        self.model = IsolationForest(
            contamination=contamination,
            n_estimators=n_estimators,
            random_state=42,
            n_jobs=-1,
        )
        self.scaler = StandardScaler()
        self.is_fitted = False

    def fit(self, X: np.ndarray):
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled)
        self.is_fitted = True
        logger.info(f"AnomalyDetector fitted on {X.shape[0]} samples, {X.shape[1]} features")

    def predict(self, X: np.ndarray) -> np.ndarray:
        if not self.is_fitted:
            raise RuntimeError("Model not fitted")
        X_scaled = self.scaler.transform(X)
        return self.model.predict(X_scaled)

    def score_samples(self, X: np.ndarray) -> np.ndarray:
        if not self.is_fitted:
            raise RuntimeError("Model not fitted")
        X_scaled = self.scaler.transform(X)
        scores = self.model.score_samples(X_scaled)
        return 1 - (scores - scores.min()) / (scores.max() - scores.min() + 1e-8)

    def detect_anomalies(self, X: np.ndarray, threshold: float = 0.7) -> list[dict]:
        scores = self.score_samples(X)
        predictions = self.predict(X)

        results = []
        for i in range(len(X)):
            results.append({
                "index": i,
                "anomaly_score": float(scores[i]),
                "is_anomaly": bool(predictions[i] == -1),
                "above_threshold": bool(scores[i] > threshold),
            })
        return results

    @staticmethod
    def extract_features(log_data: dict) -> np.ndarray:
        features = [
            log_data.get("bytes_sent", 0),
            log_data.get("bytes_received", 0),
            log_data.get("duration", 0),
            log_data.get("packets", 0),
            log_data.get("src_port", 0),
            log_data.get("dst_port", 0),
            1 if log_data.get("protocol") == "TCP" else 0,
            1 if log_data.get("protocol") == "UDP" else 0,
            log_data.get("connection_count", 0),
            log_data.get("failed_logins", 0),
        ]
        return np.array(features).reshape(1, -1)
