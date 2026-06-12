from pydantic import BaseModel
from datetime import datetime
from app.models.ioc import IOCType, IOCVerdict


class IOCCreate(BaseModel):
    type: IOCType
    value: str
    source: str | None = None
    tags: dict | None = None


class IOCEnrichRequest(BaseModel):
    type: IOCType
    value: str


class IOCResponse(BaseModel):
    id: str
    type: IOCType
    value: str
    verdict: IOCVerdict
    reputation_score: float
    confidence: float
    hit_count: int
    source: str | None
    tags: dict | None
    enrichment_data: dict | None
    geo_info: dict | None
    whois_data: dict | None
    is_whitelisted: bool
    first_seen: datetime
    last_seen: datetime

    class Config:
        from_attributes = True


class ThreatFeedStatus(BaseModel):
    feed_name: str
    last_updated: datetime | None
    total_iocs: int
    status: str


class CVEInfo(BaseModel):
    cve_id: str
    description: str
    severity: str
    cvss_score: float | None
    affected_products: list[str]
    references: list[str]
    published_date: datetime | None


class DomainReputation(BaseModel):
    domain: str
    risk_score: float
    categories: list[str]
    registrar: str | None
    creation_date: str | None
    dns_records: dict | None
    ssl_info: dict | None


class IPReputation(BaseModel):
    ip: str
    risk_score: float
    abuse_confidence: float
    country: str | None
    isp: str | None
    is_tor: bool
    is_vpn: bool
    is_proxy: bool
    open_ports: list[int]
    associated_threats: list[str]
