import logging
from workers.celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(name="workers.tasks.alert_pipeline.process_alert")
def process_alert(threat_id: str, severity: str):
    logger.info(f"Processing alert for threat {threat_id} (severity: {severity})")
    return {"threat_id": threat_id, "alert_created": True}


@celery_app.task(name="workers.tasks.alert_pipeline.check_sla_breaches")
def check_sla_breaches():
    logger.info("Checking for SLA breaches")
    return {"breached": 0}
