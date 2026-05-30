<div align="center">

# 🛡️ CyberOracle

### Next-Gen AI Cyber Warfare & Threat Intelligence Ecosystem

[![Python](https://img.shields.io/badge/Python-3.11+-3776ab?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-7-dc382d?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**An autonomous AI-powered Security Operations Center (SOC) platform combining real-time threat detection, ML-driven analysis, MITRE ATT&CK integration, and an AI copilot for enterprise-grade cyber defense.**

[Features](#-features) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [Screenshots](#-screenshots) • [API Reference](#-api-reference)

</div>

---

## 🔮 Features

### Core Platform
- **🎯 Real-Time SOC Dashboard** — Live threat monitoring with WebSocket-powered telemetry streams
- **🤖 AI Copilot** — Natural language threat analysis, incident investigation, and automated remediation
- **🔍 IOC Intelligence Engine** — IP/Domain/Hash enrichment with reputation scoring
- **⚔️ MITRE ATT&CK Matrix** — Full tactic/technique mapping with heatmap visualization
- **📊 Advanced Analytics** — Threat timelines, severity distribution, attacker profiling
- **🚨 Alert Management** — SLA-tracked alerts with escalation workflows
- **🧠 ML Pipeline** — Anomaly detection, threat classification, phishing detection, attack clustering

### Technical Capabilities
- **39 REST API Endpoints** across auth, threats, alerts, intelligence, analytics, and copilot
- **WebSocket Engine** with room-based pub/sub for real-time data streaming
- **Celery Workers** for async feed ingestion, IOC enrichment, and threat scoring
- **JWT + RBAC Authentication** with API key support
- **Composite Threat Scoring** combining ML confidence, IOC reputation, MITRE coverage, and historical context
- **MITRE ATT&CK Kill Chain** mapping across 10 threat categories and 9 tactics

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CyberOracle Platform                          │
├────────────────────────────────┬────────────────────────────────────────┤
│         Frontend (Next.js 15)  │          Backend (FastAPI)             │
│  ┌───────────────────────────┐ │  ┌──────────────────────────────────┐ │
│  │  SOC Dashboard            │ │  │  API Layer (39 endpoints)        │ │
│  │  Threat Feed              │ │  │  ├── Auth (JWT + RBAC)           │ │
│  │  Alert Management         │ │  │  ├── Threats (CRUD + Stats)      │ │
│  │  Intelligence Explorer    │◄┼──┤  ├── Alerts (SLA + Escalation)   │ │
│  │  Analytics Center         │ │  │  ├── Intelligence (IOC Enrich)   │ │
│  │  MITRE ATT&CK Matrix     │ │  │  ├── Analytics (Dashboard)       │ │
│  │  AI Copilot Chat          │ │  │  └── Copilot (AI Analysis)       │ │
│  │  System Health            │ │  ├──────────────────────────────────┤ │
│  │  Settings                 │ │  │  Services                        │ │
│  └───────────────────────────┘ │  │  ├── Threat Engine               │ │
│                                │  │  ├── Intelligence Service         │ │
│  Tech: TypeScript, Tailwind,   │  │  ├── MITRE ATT&CK Mapper         │ │
│  Framer Motion, Recharts,      │  │  ├── Composite Scoring            │ │
│  Zustand, WebSocket Client     │  │  └── AI Copilot Service           │ │
├────────────────────────────────┤  ├──────────────────────────────────┤ │
│         ML Pipeline            │  │  WebSocket Engine                 │ │
│  ┌───────────────────────────┐ │  │  ├── Room-based Pub/Sub          │ │
│  │  Anomaly Detector (IF)    │ │  │  ├── Redis Bridge                │ │
│  │  Threat Classifier (GB)   │ │  │  └── Auto-Reconnect              │ │
│  │  Log Analyzer (NLP)       │ │  ├──────────────────────────────────┤ │
│  │  Phishing Detector        │ │  │  Data Layer                      │ │
│  │  Attack Clusterer (DBSCAN)│ │  │  ├── PostgreSQL (SQLAlchemy)     │ │
│  └───────────────────────────┘ │  │  ├── Redis (Cache + Pub/Sub)     │ │
├────────────────────────────────┤  │  └── Celery (Async Workers)      │ │
│         Infrastructure         │  └──────────────────────────────────┘ │
│  Docker Compose │ Nginx │ CI/CD│                                       │
└────────────────────────────────┴───────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- PostgreSQL 16
- Redis 7
- Docker (optional)

### Option 1: Docker Compose (Recommended)

```bash
cd infra
docker-compose up -d
```

This starts PostgreSQL, Redis, Backend API, Celery Workers, and Nginx.

### Option 2: Manual Setup

#### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp ../infra/.env.example .env
# Edit .env with your database credentials

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📸 Screenshots

### SOC Command Center
Real-time threat monitoring with live WebSocket feeds, severity distribution, and threat timeline.

### AI Copilot
Natural language interface for threat analysis with MITRE ATT&CK references and remediation suggestions.

### MITRE ATT&CK Matrix
Full 14-tactic matrix with heatmap visualization based on active threat data.

### Intelligence Explorer
IOC enrichment engine with IP/Domain reputation analysis and verdict scoring.

---

## 📡 API Reference

| Module | Endpoints | Description |
|--------|-----------|-------------|
| **Auth** | 5 | Register, login, refresh, profile, API keys |
| **Threats** | 8 | CRUD, search, stats, filter by severity/category |
| **Alerts** | 6 | CRUD, acknowledge, escalate, summary counts |
| **Intelligence** | 6 | IOC management, enrichment, IP/domain reputation |
| **Analytics** | 7 | Dashboard, timeline, severity, categories, MITRE heatmap |
| **Copilot** | 3 | AI query, incident analysis, remediation generation |
| **Health** | 2 | System status, service health |
| **WebSocket** | 1 | Real-time threat/alert streaming |

**Full API docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🧠 ML Models

| Model | Algorithm | Purpose |
|-------|-----------|---------|
| Anomaly Detector | Isolation Forest | Network traffic anomaly detection |
| Threat Classifier | Gradient Boosting | 11-class threat categorization |
| Log Analyzer | Regex NLP | Security log pattern matching + IOC extraction |
| Phishing Detector | Feature Heuristics | URL phishing classification |
| Attack Clusterer | DBSCAN | Campaign correlation & coordinated attack detection |

---

## 🗂️ Project Structure

```
CyberOracle/
├── backend/                    # FastAPI microservice
│   ├── app/
│   │   ├── api/v1/routes/     # 6 route modules (39 endpoints)
│   │   ├── core/              # Config, DB, Redis, Security
│   │   ├── models/            # 5 SQLAlchemy ORM models
│   │   ├── schemas/           # Pydantic validation schemas
│   │   ├── services/          # Business logic layer
│   │   ├── websocket/         # WS manager + handlers
│   │   └── main.py            # FastAPI application
│   └── alembic/               # Database migrations
├── frontend/                   # Next.js 15 application
│   └── src/
│       ├── app/               # App Router pages
│       │   ├── dashboard/     # 9 SOC pages
│       │   └── login/         # Authentication
│       ├── components/        # Reusable UI components
│       ├── lib/               # API client, WebSocket, utils
│       └── stores/            # Zustand state management
├── ml/                        # Machine learning pipeline
│   ├── models/                # 5 ML models
│   ├── pipelines/             # Training pipelines
│   └── utils/                 # ML utilities
├── workers/                   # Celery async workers
│   └── tasks/                 # Feed ingestion, IOC enrichment
├── infra/                     # Infrastructure
│   ├── docker/                # Dockerfiles
│   ├── nginx/                 # Reverse proxy config
│   └── docker-compose.yml     # Full stack orchestration
└── .github/workflows/         # CI/CD pipeline
```

---

## 🔒 Security

- JWT-based stateless authentication with refresh tokens
- Role-Based Access Control (RBAC): admin, analyst, viewer
- API key authentication for service-to-service communication
- Bcrypt password hashing
- CORS protection
- Rate limiting ready

---

## 📋 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, TailwindCSS, Framer Motion, Recharts, Zustand |
| Backend | FastAPI, Python 3.11, Pydantic v2, SQLAlchemy 2.0 |
| Database | PostgreSQL 16, Redis 7 |
| ML | scikit-learn, PyTorch, XGBoost |
| Workers | Celery with Redis broker |
| Infra | Docker, Nginx, GitHub Actions |
| Real-Time | WebSocket, Redis Pub/Sub |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with precision. Engineered for defense.**

⚡ CyberOracle — The Autonomous Cyber Defense Platform

</div>
