from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timezone
from uuid import UUID
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.alert import Alert, AlertStatus
from app.schemas.alert import AlertCreate, AlertUpdate, AlertEscalate, AlertResponse

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("", response_model=list[AlertResponse])
async def list_alerts(
    status: AlertStatus | None = None,
    severity: str | None = None,
    assigned_to: UUID | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = select(Alert).order_by(Alert.created_at.desc())
    if status:
        query = query.where(Alert.status == status)
    if assigned_to:
        query = query.where(Alert.assigned_to == assigned_to)
    query = query.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("", response_model=AlertResponse, status_code=201)
async def create_alert(
    data: AlertCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    alert = Alert(**data.model_dump())
    db.add(alert)
    await db.flush()
    await db.refresh(alert)
    return alert


@router.get("/{alert_id}", response_model=AlertResponse)
async def get_alert(
    alert_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = await db.execute(select(Alert).where(Alert.id == alert_id))
    alert = result.scalar_one_or_none()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert


@router.patch("/{alert_id}", response_model=AlertResponse)
async def update_alert(
    alert_id: UUID,
    data: AlertUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = await db.execute(select(Alert).where(Alert.id == alert_id))
    alert = result.scalar_one_or_none()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(alert, field, value)

    if data.status == AlertStatus.ACKNOWLEDGED and not alert.acknowledged_at:
        alert.acknowledged_at = datetime.now(timezone.utc)
    elif data.status == AlertStatus.RESOLVED and not alert.resolved_at:
        alert.resolved_at = datetime.now(timezone.utc)

    await db.flush()
    await db.refresh(alert)
    return alert


@router.post("/{alert_id}/escalate", response_model=AlertResponse)
async def escalate_alert(
    alert_id: UUID,
    data: AlertEscalate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = await db.execute(select(Alert).where(Alert.id == alert_id))
    alert = result.scalar_one_or_none()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.status = AlertStatus.ESCALATED
    alert.escalated_to = data.escalated_to
    alert.remediation_notes = (alert.remediation_notes or "") + f"\nEscalated: {data.reason}"
    await db.flush()
    await db.refresh(alert)
    return alert


@router.get("/summary/counts")
async def alert_counts(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    counts = {}
    for s in AlertStatus:
        count = await db.scalar(select(func.count(Alert.id)).where(Alert.status == s))
        counts[s.value] = count or 0
    return counts
