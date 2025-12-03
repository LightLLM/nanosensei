"""
User management API routes
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session as DBSession, select
from app.db import get_session
from app.models import User
from app.schemas import UserCreate, UserResponse

router = APIRouter()


@router.post("", response_model=UserResponse, status_code=201)
def create_user(user: UserCreate, db: DBSession = Depends(get_session)):
    """Create a new user"""
    # Check if username already exists
    existing = db.exec(select(User).where(User.username == user.username)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: DBSession = Depends(get_session)):
    """Get user by ID"""
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("", response_model=list[UserResponse])
def list_users(db: DBSession = Depends(get_session)):
    """List all users"""
    users = db.exec(select(User)).all()
    return users

