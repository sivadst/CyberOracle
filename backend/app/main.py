import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.core.config import settings
from app.core.database import init_db, close_db
from app.core.redis import redis_manager
from app.websocket.handlers import websocket_endpoint
from app.websocket.manager import ws_manager
from app.services.ai_threat_simulator import threat_simulator
from app.api.v1.routes import auth, threats, alerts, intelligence, analytics, copilot

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger("cyberoracle")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("═══ CyberOracle Engine Starting ═══")
    await init_db()
    logger.info("✓ Database initialized")

    try:
        await redis_manager.connect()
        logger.info("✓ Redis connected")
        asyncio.create_task(ws_manager.start_redis_listener())
    except Exception as e:
        logger.warning(f"Redis unavailable (running without real-time features): {e}")

    logger.info("═══ CyberOracle Engine Online ═══")
    threat_simulator.start()
    yield

    logger.info("═══ CyberOracle Engine Shutting Down ═══")
    await threat_simulator.stop()
    await redis_manager.disconnect()
    await close_db()


app = FastAPI(
    title="CyberOracle",
    description="Next-Gen AI Cyber Warfare & Threat Intelligence Ecosystem",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(threats.router, prefix=settings.API_V1_PREFIX)
app.include_router(alerts.router, prefix=settings.API_V1_PREFIX)
app.include_router(intelligence.router, prefix=settings.API_V1_PREFIX)
app.include_router(analytics.router, prefix=settings.API_V1_PREFIX)
app.include_router(copilot.router, prefix=settings.API_V1_PREFIX)

app.add_api_websocket_route("/ws/{client_id}", websocket_endpoint)


@app.get("/", tags=["Health"])
async def root():
    return {
        "name": "CyberOracle",
        "version": "1.0.0",
        "status": "operational",
        "engine": "AI Cyber Warfare & Threat Intelligence",
    }


@app.get("/health", tags=["Health"])
async def health():
    redis_ok = False
    try:
        await redis_manager.client.ping()
        redis_ok = True
    except Exception:
        pass

    return {
        "status": "healthy",
        "database": "connected",
        "redis": "connected" if redis_ok else "disconnected",
        "websocket_connections": ws_manager.active_count,
    }
