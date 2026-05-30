from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from datetime import datetime, timezone, timedelta
from uuid import UUID
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.threat import ThreatEvent, ThreatSeverity, ThreatStatus
from app.schemas.threat import (
    ThreatCreate, ThreatUpdate, ThreatResponse, ThreatFilter, ThreatStats,
)

router = APIRouter(prefix="/threats", tags=["Threat Events"])


@router.get("", response_model=list[ThreatResponse])
async def list_threats(
    severity: ThreatSeverity | None = None,
    status: ThreatStatus | None = None,
    source_ip: str | None = None,
    search: str | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = select(ThreatEvent).order_by(ThreatEvent.event_time.desc())

    if severity:
        query = query.where(ThreatEvent.severity == severity)
    if status:
        query = query.where(ThreatEvent.status == status)
    if source_ip:
        query = query.where(ThreatEvent.source_ip == source_ip)
    if search:
        query = query.where(
            or_(
                ThreatEvent.title.ilike(f"%{search}%"),
                ThreatEvent.description.ilike(f"%{search}%"),
            )
        )

    query = query.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("", response_model=ThreatResponse, status_code=201)
async def create_threat(
    data: ThreatCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    threat = ThreatEvent(**data.model_dump())
    db.add(threat)
    await db.flush()
    await db.refresh(threat)
    return threat


@router.get("/stats", response_model=ThreatStats)
async def get_threat_stats(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)

    total = await db.scalar(select(func.count(ThreatEvent.id)))
    critical = await db.scalar(
        select(func.count(ThreatEvent.id)).where(ThreatEvent.severity == ThreatSeverity.CRITICAL)
    )
    high = await db.scalar(
        select(func.count(ThreatEvent.id)).where(ThreatEvent.severity == ThreatSeverity.HIGH)
    )
    medium = await db.scalar(
        select(func.count(ThreatEvent.id)).where(ThreatEvent.severity == ThreatSeverity.MEDIUM)
    )
    low = await db.scalar(
        select(func.count(ThreatEvent.id)).where(ThreatEvent.severity == ThreatSeverity.LOW)
    )
    new_today = await db.scalar(
        select(func.count(ThreatEvent.id)).where(ThreatEvent.created_at >= today)
    )
    active = await db.scalar(
        select(func.count(ThreatEvent.id)).where(
            ThreatEvent.status == ThreatStatus.INVESTIGATING
        )
    )

    return ThreatStats(
        total=total or 0,
        critical=critical or 0,
        high=high or 0,
        medium=medium or 0,
        low=low or 0,
        new_today=new_today or 0,
        active_investigations=active or 0,
    )


@router.get("/{threat_id}", response_model=ThreatResponse)
async def get_threat(
    threat_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = await db.execute(select(ThreatEvent).where(ThreatEvent.id == threat_id))
    threat = result.scalar_one_or_none()
    if not threat:
        raise HTTPException(status_code=404, detail="Threat not found")
    return threat


@router.patch("/{threat_id}", response_model=ThreatResponse)
async def update_threat(
    threat_id: UUID,
    data: ThreatUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = await db.execute(select(ThreatEvent).where(ThreatEvent.id == threat_id))
    threat = result.scalar_one_or_none()
    if not threat:
        raise HTTPException(status_code=404, detail="Threat not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(threat, field, value)

    await db.flush()
    await db.refresh(threat)
    return threat


@router.delete("/{threat_id}", status_code=204)
async def delete_threat(
    threat_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = await db.execute(select(ThreatEvent).where(ThreatEvent.id == threat_id))
    threat = result.scalar_one_or_none()
    if not threat:
        raise HTTPException(status_code=404, detail="Threat not found")
    await db.delete(threat)
