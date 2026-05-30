from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from uuid import UUID
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.ioc import IOC, IOCType, IOCVerdict
from app.schemas.intelligence import (
    IOCCreate, IOCEnrichRequest, IOCResponse, IPReputation, DomainReputation,
)
from app.services.intelligence import IntelligenceService

router = APIRouter(prefix="/intelligence", tags=["Threat Intelligence"])
intel_service = IntelligenceService()


@router.get("/iocs", response_model=list[IOCResponse])
async def list_iocs(
    type: IOCType | None = None,
    verdict: IOCVerdict | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = select(IOC).order_by(IOC.last_seen.desc())
    if type:
        query = query.where(IOC.type == type)
    if verdict:
        query = query.where(IOC.verdict == verdict)
    query = query.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/iocs", response_model=IOCResponse, status_code=201)
async def create_ioc(
    data: IOCCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    existing = await db.execute(
        select(IOC).where((IOC.type == data.type) & (IOC.value == data.value))
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="IOC already exists")

    ioc = IOC(**data.model_dump())
    db.add(ioc)
    await db.flush()
    await db.refresh(ioc)
    return ioc


@router.post("/enrich", response_model=IOCResponse)
async def enrich_ioc(
    data: IOCEnrichRequest,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = await db.execute(
        select(IOC).where((IOC.type == data.type) & (IOC.value == data.value))
    )
    ioc = result.scalar_one_or_none()

    enrichment = await intel_service.enrich_ioc(data.type, data.value)

    if not ioc:
        ioc = IOC(type=data.type, value=data.value)
        db.add(ioc)

    ioc.enrichment_data = enrichment.get("enrichment_data")
    ioc.reputation_score = enrichment.get("reputation_score", 0.0)
    ioc.verdict = IOCVerdict(enrichment.get("verdict", "unknown"))
    ioc.geo_info = enrichment.get("geo_info")
    ioc.hit_count += 1

    await db.flush()
    await db.refresh(ioc)
    return ioc


@router.get("/ip/{ip_address}", response_model=IPReputation)
async def check_ip_reputation(
    ip_address: str,
    current_user: dict = Depends(get_current_user),
):
    return await intel_service.get_ip_reputation(ip_address)


@router.get("/domain/{domain}", response_model=DomainReputation)
async def check_domain_reputation(
    domain: str,
    current_user: dict = Depends(get_current_user),
):
    return await intel_service.get_domain_reputation(domain)


@router.get("/stats")
async def intelligence_stats(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    total = await db.scalar(select(func.count(IOC.id)))
    malicious = await db.scalar(
        select(func.count(IOC.id)).where(IOC.verdict == IOCVerdict.MALICIOUS)
    )
    suspicious = await db.scalar(
        select(func.count(IOC.id)).where(IOC.verdict == IOCVerdict.SUSPICIOUS)
    )
    return {
        "total_iocs": total or 0,
        "malicious": malicious or 0,
        "suspicious": suspicious or 0,
        "feeds_active": 4,
    }
