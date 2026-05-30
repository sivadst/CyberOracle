from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from app.core.database import get_db
from app.core.security import get_current_user


async def get_current_active_user(current_user: dict = Depends(get_current_user)):
    return current_user


async def get_session(db: AsyncSession = Depends(get_db)):
    return db
