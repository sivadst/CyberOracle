import logging
from workers.celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(name="workers.tasks.threat_scoring.score_pending_threats")
def score_pending_threats():
    logger.info("Scoring pending threats")
    return {"scored": 0, "status": "complete"}


@celery_app.task(name="workers.tasks.threat_scoring.score_single_threat")
def score_single_threat(threat_id: str):
    logger.info(f"Scoring threat: {threat_id}")
    return {"threat_id": threat_id, "score": 0.0}
