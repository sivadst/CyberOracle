import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

# Determine the database URL: use SQLite if the default PostgreSQL URL is present
# or if PostgreSQL is not reachable.
_db_url = settings.DATABASE_URL
if "postgresql" in _db_url:
    # Fall back to SQLite for local development without PostgreSQL
    _db_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    _db_path = os.path.join(_db_dir, "cyberoracle.db")
    _db_url = f"sqlite+aiosqlite:///{_db_path}"

engine = create_async_engine(
    _db_url,
    echo=settings.DEBUG,
    # SQLite doesn't support pool_size/max_overflow the same way
    **({} if "sqlite" in _db_url else {
        "pool_size": settings.DB_POOL_SIZE,
        "max_overflow": settings.DB_MAX_OVERFLOW,
        "pool_pre_ping": True,
        "pool_recycle": 3600,
    })
)

async_session_factory = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncSession:
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def close_db():
    await engine.dispose()
