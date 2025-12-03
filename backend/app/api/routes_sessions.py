"""
Session management API routes
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session as DBSession, select, func
from app.db import get_session
from app.models import Session, User
from app.schemas import SessionCreate, SessionResponse, SessionSummary

router = APIRouter()


@router.post("", response_model=SessionResponse, status_code=201)
def create_session(session_data: SessionCreate, db: DBSession = Depends(get_session)):
    """Create a new coaching session"""
    # Verify user exists
    user = db.get(User, session_data.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Validate score range
    if not (0 <= session_data.score <= 100):
        raise HTTPException(status_code=400, detail="Score must be between 0 and 100")
    
    db_session = Session(**session_data.dict())
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session


@router.get("", response_model=list[SessionResponse])
def list_sessions(
    user_id: int = Query(None, description="Filter by user ID"),
    skill_type: str = Query(None, description="Filter by skill type"),
    db: DBSession = Depends(get_session)
):
    """List sessions with optional filters"""
    query = select(Session)
    
    if user_id:
        query = query.where(Session.user_id == user_id)
    if skill_type:
        query = query.where(Session.skill_type == skill_type)
    
    query = query.order_by(Session.timestamp.desc())
    sessions = db.exec(query).all()
    return sessions


@router.get("/summary", response_model=SessionSummary)
def get_session_summary(
    user_id: int = Query(..., description="User ID for summary"),
    db: DBSession = Depends(get_session)
):
    """Get aggregated session statistics for a user"""
    # Verify user exists
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get all sessions for user
    sessions = db.exec(
        select(Session).where(Session.user_id == user_id)
    ).all()
    
    if not sessions:
        return SessionSummary(
            total_sessions=0,
            average_score=0.0,
            average_score_by_skill={},
            sessions_by_skill={}
        )
    
    # Calculate aggregates
    total_sessions = len(sessions)
    average_score = sum(s.score for s in sessions) / total_sessions
    
    # Group by skill type
    skill_scores: dict[str, list[int]] = {}
    skill_counts: dict[str, int] = {}
    
    for s in sessions:
        if s.skill_type not in skill_scores:
            skill_scores[s.skill_type] = []
            skill_counts[s.skill_type] = 0
        skill_scores[s.skill_type].append(s.score)
        skill_counts[s.skill_type] += 1
    
    # Calculate average per skill
    average_score_by_skill = {
        skill: sum(scores) / len(scores)
        for skill, scores in skill_scores.items()
    }
    
    return SessionSummary(
        total_sessions=total_sessions,
        average_score=average_score,
        average_score_by_skill=average_score_by_skill,
        sessions_by_skill=skill_counts
    )


@router.get("/{session_id}", response_model=SessionResponse)
def get_session(session_id: int, db: DBSession = Depends(get_session)):
    """Get session by ID"""
    db_session = db.get(Session, session_id)
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
    return db_session

