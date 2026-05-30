import logging
from workers.celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(name="workers.tasks.ioc_enrichment.enrich_ioc")
def enrich_ioc(ioc_type: str, ioc_value: str):
    logger.info(f"Enriching IOC: {ioc_type}={ioc_value}")
    return {"type": ioc_type, "value": ioc_value, "enriched": True}


@celery_app.task(name="workers.tasks.ioc_enrichment.batch_enrich")
def batch_enrich(iocs: list[dict]):
    logger.info(f"Batch enriching {len(iocs)} IOCs")
    results = []
    for ioc in iocs:
        results.append(enrich_ioc(ioc["type"], ioc["value"]))
    return results
