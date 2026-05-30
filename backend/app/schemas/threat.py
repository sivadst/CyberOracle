from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from app.models.threat import ThreatSeverity, ThreatStatus, ThreatCategory


class ThreatCreate(BaseModel):
    title: str = Field(max_length=500)
    description: str | None = None
    severity: ThreatSeverity = ThreatSeverity.MEDIUM
    category: ThreatCategory = ThreatCategory.UNKNOWN
    source_ip: str | None = None
    destination_ip: str | None = None
    source_port: int | None = None
    destination_port: int | None = None
    protocol: str | None = None
    mitre_tactic: str | None = None
    mitre_technique: str | None = None
    raw_log: dict | None = None
    source_system: str | None = None


class ThreatUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    severity: ThreatSeverity | None = None
    status: ThreatStatus | None = None
    category: ThreatCategory | None = None
    mitre_tactic: str | None = None
    mitre_technique: str | None = None


class ThreatResponse(BaseModel):
    id: UUID
    title: str
    description: str | None
    severity: ThreatSeverity
    status: ThreatStatus
    category: ThreatCategory
    source_ip: str | None
    destination_ip: str | None
    source_port: int | None
    destination_port: int | None
    protocol: str | None
    mitre_tactic: str | None
    mitre_technique: str | None
    mitre_subtechnique: str | None
    kill_chain_phase: str | None
    confidence_score: float
    ml_prediction: str | None
    ml_confidence: float | None
    geo_data: dict | None
    source_system: str | None
    event_time: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class ThreatFilter(BaseModel):
    severity: ThreatSeverity | None = None
    status: ThreatStatus | None = None
    category: ThreatCategory | None = None
    source_ip: str | None = None
    mitre_tactic: str | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    search: str | None = None
    page: int = 1
    page_size: int = 50


class ThreatStats(BaseModel):
    total: int
    critical: int
    high: int
    medium: int
    low: int
    new_today: int
    active_investigations: int
