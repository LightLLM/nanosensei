"""
SQLModel database models
"""

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class User(SQLModel, table=True):
    """User model"""
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Session(SQLModel, table=True):
    """NanoSensei coaching session model"""
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    skill_type: str = Field(index=True)  # e.g., "Drawing", "Yoga", "Punching", "Guitar"
    score: int = Field(ge=0, le=100)  # Score from 0-100
    feedback: str  # Coaching feedback text
    timestamp: datetime = Field(default_factory=datetime.utcnow, index=True)
    metadata: Optional[str] = None  # JSON string for additional data

