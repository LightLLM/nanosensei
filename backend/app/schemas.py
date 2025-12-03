"""
Pydantic schemas for API requests/responses
"""

from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# User schemas
class UserCreate(BaseModel):
    username: str
    email: Optional[EmailStr] = None


class UserResponse(BaseModel):
    id: int
    username: str
    email: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Session schemas
class SessionCreate(BaseModel):
    user_id: int
    skill_type: str
    score: int  # 0-100
    feedback: str
    metadata: Optional[str] = None


class SessionResponse(BaseModel):
    id: int
    user_id: int
    skill_type: str
    score: int
    feedback: str
    timestamp: datetime
    metadata: Optional[str] = None

    class Config:
        from_attributes = True


class SessionSummary(BaseModel):
    """Aggregated session statistics"""
    total_sessions: int
    average_score: float
    average_score_by_skill: dict[str, float]
    sessions_by_skill: dict[str, int]

