from celery import Celery

celery_app = Celery(
    "cyberoracle",
    broker="redis://localhost:6379/2",
    backend="redis://localhost:6379/3",
    include=[
        "workers.tasks.feed_ingestion",
        "workers.tasks.ioc_enrichment",
        "workers.tasks.threat_scoring",
        "workers.tasks.alert_pipeline",
    ],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=300,
    task_soft_time_limit=240,
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
    broker_connection_retry_on_startup=True,
    beat_schedule={
        "ingest-feeds-every-5m": {
            "task": "workers.tasks.feed_ingestion.ingest_all_feeds",
            "schedule": 300.0,
        },
        "score-threats-every-1m": {
            "task": "workers.tasks.threat_scoring.score_pending_threats",
            "schedule": 60.0,
        },
    },
)
