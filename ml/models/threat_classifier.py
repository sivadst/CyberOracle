import numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import cross_val_score
import logging

logger = logging.getLogger(__name__)

THREAT_LABELS = [
    "malware", "phishing", "intrusion", "dos", "data_exfiltration",
    "privilege_escalation", "lateral_movement", "command_and_control",
    "reconnaissance", "insider_threat", "benign",
]


class ThreatClassifier:
    def __init__(self):
        self.model = GradientBoostingClassifier(
            n_estimators=200,
            max_depth=6,
            learning_rate=0.1,
            random_state=42,
        )
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.label_encoder.fit(THREAT_LABELS)
        self.is_fitted = False

    def fit(self, X: np.ndarray, y: np.ndarray):
        X_scaled = self.scaler.fit_transform(X)
        y_encoded = self.label_encoder.transform(y)
        self.model.fit(X_scaled, y_encoded)
        self.is_fitted = True

        scores = cross_val_score(self.model, X_scaled, y_encoded, cv=3)
        logger.info(f"ThreatClassifier fitted. CV accuracy: {scores.mean():.4f} ± {scores.std():.4f}")

    def predict(self, X: np.ndarray) -> list[dict]:
        if not self.is_fitted:
            raise RuntimeError("Model not fitted")
        X_scaled = self.scaler.transform(X)
        predictions = self.model.predict(X_scaled)
        probabilities = self.model.predict_proba(X_scaled)

        results = []
        for i in range(len(X)):
            label = self.label_encoder.inverse_transform([predictions[i]])[0]
            confidence = float(probabilities[i].max())
            results.append({
                "prediction": label,
                "confidence": confidence,
                "probabilities": {
                    self.label_encoder.inverse_transform([j])[0]: float(probabilities[i][j])
                    for j in range(len(probabilities[i]))
                    if probabilities[i][j] > 0.05
                },
            })
        return results

    @staticmethod
    def extract_features(event: dict) -> np.ndarray:
        features = [
            event.get("src_port", 0),
            event.get("dst_port", 0),
            event.get("bytes_sent", 0),
            event.get("bytes_received", 0),
            event.get("duration", 0),
            event.get("packet_count", 0),
            1 if event.get("is_external") else 0,
            event.get("failed_attempts", 0),
            event.get("unique_destinations", 0),
            event.get("entropy", 0.0),
            len(event.get("raw_log", "")),
            event.get("time_of_day_hour", 12),
        ]
        return np.array(features).reshape(1, -1)
