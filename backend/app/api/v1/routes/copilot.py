from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.threat import ThreatEvent
from app.services.copilot import CopilotService

router = APIRouter(prefix="/copilot", tags=["AI Copilot"])
copilot_service = CopilotService()


class CopilotQuery(BaseModel):
    query: str
    context: dict | None = None
    threat_id: UUID | None = None


class CopilotResponse(BaseModel):
    response: str
    confidence: float
    recommendations: list[str]
    mitre_references: list[dict] | None = None
    related_threats: list[str] | None = None


class IncidentAnalysis(BaseModel):
    threat_id: UUID


class RemediationRequest(BaseModel):
    threat_id: UUID
    context: str | None = None


@router.post("/ask", response_model=CopilotResponse)
async def ask_copilot(
    data: CopilotQuery,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    threat_context = None
    if data.threat_id:
        result = await db.execute(
            select(ThreatEvent).where(ThreatEvent.id == data.threat_id)
        )
        threat = result.scalar_one_or_none()
        if threat:
            threat_context = {
                "title": threat.title,
                "severity": threat.severity.value,
                "category": threat.category.value,
                "source_ip": threat.source_ip,
                "mitre_tactic": threat.mitre_tactic,
                "mitre_technique": threat.mitre_technique,
            }

    response = await copilot_service.analyze_query(
        query=data.query,
        threat_context=threat_context,
        additional_context=data.context,
    )
    return response


@router.post("/analyze-incident")
async def analyze_incident(
    data: IncidentAnalysis,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = await db.execute(
        select(ThreatEvent).where(ThreatEvent.id == data.threat_id)
    )
    threat = result.scalar_one_or_none()
    if not threat:
        raise HTTPException(status_code=404, detail="Threat not found")

    analysis = await copilot_service.analyze_incident(threat)
    return analysis


@router.post("/remediation")
async def get_remediation(
    data: RemediationRequest,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = await db.execute(
        select(ThreatEvent).where(ThreatEvent.id == data.threat_id)
    )
    threat = result.scalar_one_or_none()
    if not threat:
        raise HTTPException(status_code=404, detail="Threat not found")

    remediation = await copilot_service.generate_remediation(threat, data.context)
    return remediation
