import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Float, Integer, DateTime, Text, Enum as SAEnum, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
import enum


class IOCType(str, enum.Enum):
    IP = "ip"
    DOMAIN = "domain"
    URL = "url"
    HASH_MD5 = "hash_md5"
    HASH_SHA1 = "hash_sha1"
    HASH_SHA256 = "hash_sha256"
    EMAIL = "email"
    FILE_NAME = "file_name"
    CVE = "cve"
    MUTEX = "mutex"
    REGISTRY_KEY = "registry_key"


class IOCVerdict(str, enum.Enum):
    MALICIOUS = "malicious"
    SUSPICIOUS = "suspicious"
    BENIGN = "benign"
    UNKNOWN = "unknown"


class IOC(Base):
    __tablename__ = "iocs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type: Mapped[IOCType] = mapped_column(SAEnum(IOCType), nullable=False, index=True)
    value: Mapped[str] = mapped_column(String(2048), nullable=False, index=True)
    verdict: Mapped[IOCVerdict] = mapped_column(
        SAEnum(IOCVerdict), default=IOCVerdict.UNKNOWN, index=True
    )

    reputation_score: Mapped[float] = mapped_column(Float, default=0.0)
    confidence: Mapped[float] = mapped_column(Float, default=0.0)
    hit_count: Mapped[int] = mapped_column(Integer, default=0)

    source: Mapped[str | None] = mapped_column(String(255), nullable=True)
    tags: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    enrichment_data: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    geo_info: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    whois_data: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    is_whitelisted: Mapped[bool] = mapped_column(Boolean, default=False)
    associated_threats: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    first_seen: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    last_seen: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
