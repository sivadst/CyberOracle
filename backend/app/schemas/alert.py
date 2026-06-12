from pydantic import BaseModel
from datetime import datetime
from app.models.alert import AlertSeverity, AlertStatus


class AlertCreate(BaseModel):
    title: str
    description: str | None = None
    severity: AlertSeverity
    threat_event_id: str | None = None
    rule_name: str | None = None
    source: str | None = None
    alert_metadata: dict | None = None


class AlertUpdate(BaseModel):
    status: AlertStatus | None = None
    assigned_to: str | None = None
    remediation_notes: str | None = None


class AlertEscalate(BaseModel):
    escalated_to: str
    reason: str


class AlertResponse(BaseModel):
    id: str
    title: str
    description: str | None
    severity: AlertSeverity
    status: AlertStatus
    threat_event_id: str | None
    assigned_to: str | None
    escalated_to: str | None
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
