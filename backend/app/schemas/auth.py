from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from uuid import UUID
from app.models.user import UserRole


class UserRegister(BaseModel):
    email: EmailStr
    username: str = Field(min_length=3, max_length=100)
    password: str = Field(min_length=8, max_length=128)
    full_name: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenRefresh(BaseModel):
    refresh_token: str


class UserResponse(BaseModel):
    id: UUID
    email: str
    username: str
    full_name: str | None
    role: UserRole
    is_active: bool
    avatar_url: str | None
    last_login: datetime | None
    created_at: datetime

    class Config:
        from_attributes = True


class APIKeyResponse(BaseModel):
    api_key: str
    message: str = "Store this key securely. It won't be shown again."
