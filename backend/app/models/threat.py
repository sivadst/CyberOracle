import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, DateTime, Text, Enum as SAEnum, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
import enum


class ThreatSeverity(str, enum.Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


class ThreatStatus(str, enum.Enum):
    NEW = "new"
    INVESTIGATING = "investigating"
    CONFIRMED = "confirmed"
    MITIGATED = "mitigated"
    FALSE_POSITIVE = "false_positive"
    CLOSED = "closed"


class ThreatCategory(str, enum.Enum):
    MALWARE = "malware"
    PHISHING = "phishing"
    INTRUSION = "intrusion"
    DOS = "dos"
    DATA_EXFIL = "data_exfiltration"
    PRIVILEGE_ESCALATION = "privilege_escalation"
    LATERAL_MOVEMENT = "lateral_movement"
    C2 = "command_and_control"
    RECONNAISSANCE = "reconnaissance"
    INSIDER_THREAT = "insider_threat"
    UNKNOWN = "unknown"


class ThreatEvent(Base):
    __tablename__ = "threat_events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(500), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    severity: Mapped[ThreatSeverity] = mapped_column(
        SAEnum(ThreatSeverity), default=ThreatSeverity.MEDIUM, index=True
    )
    status: Mapped[ThreatStatus] = mapped_column(
        SAEnum(ThreatStatus), default=ThreatStatus.NEW, index=True
    )
    category: Mapped[ThreatCategory] = mapped_column(
        SAEnum(ThreatCategory), default=ThreatCategory.UNKNOWN, index=True
    )

    source_ip: Mapped[str | None] = mapped_column(String(45), nullable=True, index=True)
    destination_ip: Mapped[str | None] = mapped_column(String(45), nullable=True)
    source_port: Mapped[int | None] = mapped_column(Integer, nullable=True)
    destination_port: Mapped[int | None] = mapped_column(Integer, nullable=True)
    protocol: Mapped[str | None] = mapped_column(String(20), nullable=True)

    mitre_tactic: Mapped[str | None] = mapped_column(String(100), nullable=True, index=True)
    mitre_technique: Mapped[str | None] = mapped_column(String(100), nullable=True)
    mitre_subtechnique: Mapped[str | None] = mapped_column(String(100), nullable=True)
    kill_chain_phase: Mapped[str | None] = mapped_column(String(50), nullable=True)

    confidence_score: Mapped[float] = mapped_column(Float, default=0.0)
    ml_prediction: Mapped[str | None] = mapped_column(String(100), nullable=True)
    ml_confidence: Mapped[float | None] = mapped_column(Float, nullable=True)

    raw_log: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    indicators: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    geo_data: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    organization_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True, index=True)
    source_system: Mapped[str | None] = mapped_column(String(100), nullable=True)
    event_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
