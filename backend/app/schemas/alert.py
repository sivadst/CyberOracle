from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from app.models.alert import AlertSeverity, AlertStatus


class AlertCreate(BaseModel):
    title: str
    description: str | None = None
    severity: AlertSeverity
    threat_event_id: UUID | None = None
    rule_name: str | None = None
    source: str | None = None
    alert_metadata: dict | None = None


class AlertUpdate(BaseModel):
    status: AlertStatus | None = None
    assigned_to: UUID | None = None
    remediation_notes: str | None = None


class AlertEscalate(BaseModel):
    escalated_to: UUID
    reason: str


class AlertResponse(BaseModel):
    id: UUID
    title: str
    description: str | None
    severity: AlertSeverity
    status: AlertStatus
    threat_event_id: UUID | None
    assigned_to: UUID | None
    escalated_to: UUID | None
    rule_name: str | None
    source: str | None
    ai_summary: str | None
    remediation_notes: str | None
    acknowledged_at: datetime | None
    resolved_at: datetime | None
    sla_deadline: datetime | None
    created_at: datetime

    class Config:
        from_attributes = True
