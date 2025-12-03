"""
Pytest configuration and shared fixtures
"""

import pytest
import os
from sqlmodel import SQLModel, create_engine, Session
from app.db import engine
from app.models import User, Session as SessionModel

# Use in-memory database for tests
TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(TEST_DATABASE_URL, echo=False)


@pytest.fixture(autouse=True)
def setup_test_db():
    """Create and drop test database tables for each test"""
    SQLModel.metadata.create_all(test_engine)
    yield
    SQLModel.metadata.drop_all(test_engine)


@pytest.fixture
def db_session():
    """Provide a database session for tests"""
    with Session(test_engine) as session:
        yield session


@pytest.fixture
def sample_user(db_session):
    """Create a sample user for testing"""
    user = User(username="testuser", email="test@example.com")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def sample_session(db_session, sample_user):
    """Create a sample session for testing"""
    session = SessionModel(
        user_id=sample_user.id,
        skill_type="Drawing",
        score=85,
        feedback="Great work!"
    )
    db_session.add(session)
    db_session.commit()
    db_session.refresh(session)
    return session

