"""
Basic tests for NanoSensei backend
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db import create_db_and_tables, engine
from sqlmodel import SQLModel

# Create test database
SQLModel.metadata.create_all(engine)

client = TestClient(app)


def test_health_check():
    """Test health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "NanoSensei backend is running"}


def test_root():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["message"] == "NanoSensei API"


def test_create_user():
    """Test user creation"""
    response = client.post(
        "/users",
        json={"username": "testuser", "email": "test@example.com"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"
    assert "id" in data


def test_get_user():
    """Test getting user"""
    # First create a user
    create_response = client.post(
        "/users",
        json={"username": "testuser2", "email": "test2@example.com"}
    )
    user_id = create_response.json()["id"]
    
    # Then get it
    response = client.get(f"/users/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser2"


def test_create_session():
    """Test session creation"""
    # First create a user
    user_response = client.post(
        "/users",
        json={"username": "sessionuser", "email": "session@example.com"}
    )
    user_id = user_response.json()["id"]
    
    # Create a session
    response = client.post(
        "/sessions",
        json={
            "user_id": user_id,
            "skill_type": "Drawing",
            "score": 85,
            "feedback": "Great work!"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["skill_type"] == "Drawing"
    assert data["score"] == 85
    assert data["user_id"] == user_id


def test_get_session_summary():
    """Test session summary"""
    # Create user
    user_response = client.post(
        "/users",
        json={"username": "summaryuser", "email": "summary@example.com"}
    )
    user_id = user_response.json()["id"]
    
    # Create multiple sessions
    client.post(
        "/sessions",
        json={
            "user_id": user_id,
            "skill_type": "Drawing",
            "score": 80,
            "feedback": "Good"
        }
    )
    client.post(
        "/sessions",
        json={
            "user_id": user_id,
            "skill_type": "Drawing",
            "score": 90,
            "feedback": "Excellent"
        }
    )
    
    # Get summary
    response = client.get(f"/sessions/summary?user_id={user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["total_sessions"] == 2
    assert data["average_score"] == 85.0
    assert "Drawing" in data["average_score_by_skill"]

