from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, extract
from datetime import datetime, timezone, timedelta
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.threat import ThreatEvent, ThreatSeverity, ThreatStatus, ThreatCategory
from app.models.alert import Alert, AlertStatus
from app.models.ioc import IOC

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/dashboard")
async def dashboard_overview(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    now = datetime.now(timezone.utc)
    today = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_ago = now - timedelta(days=7)

    total_threats = await db.scalar(select(func.count(ThreatEvent.id))) or 0
    threats_today = await db.scalar(
        select(func.count(ThreatEvent.id)).where(ThreatEvent.created_at >= today)
    ) or 0
    open_alerts = await db.scalar(
        select(func.count(Alert.id)).where(Alert.status == AlertStatus.OPEN)
    ) or 0
    critical_threats = await db.scalar(
        select(func.count(ThreatEvent.id)).where(
            ThreatEvent.severity == ThreatSeverity.CRITICAL
        )
    ) or 0
    total_iocs = await db.scalar(select(func.count(IOC.id))) or 0

    return {
        "total_threats": total_threats,
        "threats_today": threats_today,
        "open_alerts": open_alerts,
        "critical_threats": critical_threats,
        "total_iocs": total_iocs,
        "threat_trend": "increasing" if threats_today > 10 else "stable",
        "risk_level": "critical" if critical_threats > 5 else "high" if critical_threats > 0 else "moderate",
    }


@router.get("/threats/timeline")
async def threat_timeline(
    days: int = Query(7, ge=1, le=90),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    start = datetime.now(timezone.utc) - timedelta(days=days)
    result = await db.execute(
        select(
            func.date(ThreatEvent.event_time).label("date"),
            func.count(ThreatEvent.id).label("count"),
        )
        .where(ThreatEvent.event_time >= start)
        .group_by(func.date(ThreatEvent.event_time))
        .order_by(func.date(ThreatEvent.event_time))
    )
    return [{"date": str(row.date), "count": row.count} for row in result.all()]


@router.get("/threats/by-severity")
async def threats_by_severity(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = await db.execute(
        select(ThreatEvent.severity, func.count(ThreatEvent.id).label("count"))
        .group_by(ThreatEvent.severity)
    )
    return {row.severity.value: row.count for row in result.all()}


@router.get("/threats/by-category")
async def threats_by_category(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = await db.execute(
        select(ThreatEvent.category, func.count(ThreatEvent.id).label("count"))
        .group_by(ThreatEvent.category)
    )
    return {row.category.value: row.count for row in result.all()}


@router.get("/threats/top-attackers")
async def top_attackers(
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = await db.execute(
        select(ThreatEvent.source_ip, func.count(ThreatEvent.id).label("count"))
        .where(ThreatEvent.source_ip.is_not(None))
        .group_by(ThreatEvent.source_ip)
        .order_by(func.count(ThreatEvent.id).desc())
        .limit(limit)
    )
    return [{"ip": row.source_ip, "count": row.count} for row in result.all()]


@router.get("/threats/mitre-heatmap")
async def mitre_heatmap(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = await db.execute(
        select(
            ThreatEvent.mitre_tactic,
            ThreatEvent.mitre_technique,
            func.count(ThreatEvent.id).label("count"),
        )
        .where(ThreatEvent.mitre_tactic.is_not(None))
        .group_by(ThreatEvent.mitre_tactic, ThreatEvent.mitre_technique)
    )
    return [
        {"tactic": row.mitre_tactic, "technique": row.mitre_technique, "count": row.count}
        for row in result.all()
    ]
