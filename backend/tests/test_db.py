"""
Unit tests for database operations
"""

import pytest
import os
import tempfile
from sqlmodel import SQLModel, create_engine, Session
from app.db import create_db_and_tables, get_session
from app.models import User, Session as SessionModel


def test_create_db_and_tables():
    """Test database and table creation"""
    # Use in-memory database for testing
    engine = create_engine("sqlite:///:memory:", echo=False)
    SQLModel.metadata.create_all(engine)
    
    # Verify tables exist by creating a session
    with Session(engine) as session:
        user = User(username="test", email="test@example.com")
        session.add(user)
        session.commit()
        session.refresh(user)
        assert user.id is not None
        assert user.username == "test"


def test_get_session():
    """Test database session generator"""
    engine = create_engine("sqlite:///:memory:", echo=False)
    SQLModel.metadata.create_all(engine)
    
    # Mock get_session to use our test engine
    def test_get_session():
        with Session(engine) as session:
            yield session
    
    # Use the generator
    session_gen = test_get_session()
    session = next(session_gen)
    assert session is not None
    
    # Create and query
    user = User(username="test", email="test@example.com")
    session.add(user)
    session.commit()
    session.refresh(user)
    assert user.id is not None


def test_user_model():
    """Test User model creation and fields"""
    user = User(username="testuser", email="test@example.com")
    assert user.username == "testuser"
    assert user.email == "test@example.com"
    assert user.id is None  # Not saved yet
    assert user.created_at is not None  # Default factory should set it


def test_session_model():
    """Test Session model creation and fields"""
    session = SessionModel(
        user_id=1,
        skill_type="Drawing",
        score=85,
        feedback="Great work!"
    )
    assert session.user_id == 1
    assert session.skill_type == "Drawing"
    assert session.score == 85
    assert session.feedback == "Great work!"
    assert session.id is None  # Not saved yet
    assert session.timestamp is not None  # Default factory should set it


def test_session_model_score_validation():
    """Test Session model score validation"""
    # Valid scores
    session1 = SessionModel(user_id=1, skill_type="Drawing", score=0, feedback="Test")
    assert session1.score == 0
    
    session2 = SessionModel(user_id=1, skill_type="Drawing", score=100, feedback="Test")
    assert session2.score == 100
    
    session3 = SessionModel(user_id=1, skill_type="Drawing", score=50, feedback="Test")
    assert session3.score == 50

