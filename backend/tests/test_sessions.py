"""
Comprehensive unit tests for session endpoints
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db import create_db_and_tables, engine
from sqlmodel import SQLModel

# Create test database
SQLModel.metadata.create_all(engine)

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    """Reset database before each test"""
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)
    yield
    SQLModel.metadata.drop_all(engine)


@pytest.fixture
def test_user():
    """Create a test user for session tests"""
    response = client.post(
        "/users",
        json={"username": "testuser", "email": "test@example.com"}
    )
    return response.json()


def test_create_session_success(test_user):
    """Test successful session creation"""
    response = client.post(
        "/sessions",
        json={
            "user_id": test_user["id"],
            "skill_type": "Drawing",
            "score": 85,
            "feedback": "Great work!"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["skill_type"] == "Drawing"
    assert data["score"] == 85
    assert data["feedback"] == "Great work!"
    assert data["user_id"] == test_user["id"]
    assert "id" in data
    assert "timestamp" in data


def test_create_session_with_metadata(test_user):
    """Test session creation with metadata"""
    response = client.post(
        "/sessions",
        json={
            "user_id": test_user["id"],
            "skill_type": "Yoga",
            "score": 90,
            "feedback": "Excellent form",
            "metadata": '{"pose": "warrior", "duration": 30}'
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["metadata"] == '{"pose": "warrior", "duration": 30}'


def test_create_session_invalid_user():
    """Test session creation with non-existent user"""
    response = client.post(
        "/sessions",
        json={
            "user_id": 99999,
            "skill_type": "Drawing",
            "score": 85,
            "feedback": "Test"
        }
    )
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_create_session_invalid_score_negative(test_user):
    """Test session creation with negative score"""
    response = client.post(
        "/sessions",
        json={
            "user_id": test_user["id"],
            "skill_type": "Drawing",
            "score": -10,
            "feedback": "Test"
        }
    )
    assert response.status_code == 422  # Validation error from Pydantic


def test_create_session_invalid_score_too_high(test_user):
    """Test session creation with score > 100"""
    response = client.post(
        "/sessions",
        json={
            "user_id": test_user["id"],
            "skill_type": "Drawing",
            "score": 150,
            "feedback": "Test"
        }
    )
    assert response.status_code == 422  # Validation error from Pydantic


def test_create_session_boundary_scores(test_user):
    """Test session creation with boundary scores (0 and 100)"""
    # Score 0
    response1 = client.post(
        "/sessions",
        json={
            "user_id": test_user["id"],
            "skill_type": "Drawing",
            "score": 0,
            "feedback": "Needs improvement"
        }
    )
    assert response1.status_code == 201
    assert response1.json()["score"] == 0
    
    # Score 100
    response2 = client.post(
        "/sessions",
        json={
            "user_id": test_user["id"],
            "skill_type": "Drawing",
            "score": 100,
            "feedback": "Perfect!"
        }
    )
    assert response2.status_code == 201
    assert response2.json()["score"] == 100


def test_list_sessions_all(test_user):
    """Test listing all sessions"""
    # Create multiple sessions
    client.post("/sessions", json={
        "user_id": test_user["id"],
        "skill_type": "Drawing",
        "score": 80,
        "feedback": "Good"
    })
    client.post("/sessions", json={
        "user_id": test_user["id"],
        "skill_type": "Yoga",
        "score": 90,
        "feedback": "Excellent"
    })
    
    response = client.get("/sessions")
    assert response.status_code == 200
    sessions = response.json()
    assert len(sessions) == 2
    assert all("id" in s for s in sessions)


def test_list_sessions_filter_by_user(test_user):
    """Test filtering sessions by user_id"""
    # Create another user
    user2_response = client.post("/users", json={"username": "user2"})
    user2_id = user2_response.json()["id"]
    
    # Create sessions for both users
    client.post("/sessions", json={
        "user_id": test_user["id"],
        "skill_type": "Drawing",
        "score": 80,
        "feedback": "User1 session"
    })
    client.post("/sessions", json={
        "user_id": user2_id,
        "skill_type": "Yoga",
        "score": 90,
        "feedback": "User2 session"
    })
    
    # Filter by user_id
    response = client.get(f"/sessions?user_id={test_user['id']}")
    assert response.status_code == 200
    sessions = response.json()
    assert len(sessions) == 1
    assert sessions[0]["user_id"] == test_user["id"]
    assert sessions[0]["skill_type"] == "Drawing"


def test_list_sessions_filter_by_skill_type(test_user):
    """Test filtering sessions by skill_type"""
    # Create sessions with different skill types
    client.post("/sessions", json={
        "user_id": test_user["id"],
        "skill_type": "Drawing",
        "score": 80,
        "feedback": "Drawing session"
    })
    client.post("/sessions", json={
        "user_id": test_user["id"],
        "skill_type": "Yoga",
        "score": 90,
        "feedback": "Yoga session"
    })
    client.post("/sessions", json={
        "user_id": test_user["id"],
        "skill_type": "Drawing",
        "score": 85,
        "feedback": "Another drawing"
    })
    
    # Filter by skill_type
    response = client.get("/sessions?skill_type=Drawing")
    assert response.status_code == 200
    sessions = response.json()
    assert len(sessions) == 2
    assert all(s["skill_type"] == "Drawing" for s in sessions)


def test_list_sessions_filter_by_both(test_user):
    """Test filtering sessions by both user_id and skill_type"""
    # Create another user
    user2_response = client.post("/users", json={"username": "user2"})
    user2_id = user2_response.json()["id"]
    
    # Create sessions
    client.post("/sessions", json={
        "user_id": test_user["id"],
        "skill_type": "Drawing",
        "score": 80,
        "feedback": "User1 Drawing"
    })
    client.post("/sessions", json={
        "user_id": test_user["id"],
        "skill_type": "Yoga",
        "score": 90,
        "feedback": "User1 Yoga"
    })
    client.post("/sessions", json={
        "user_id": user2_id,
        "skill_type": "Drawing",
        "score": 85,
        "feedback": "User2 Drawing"
    })
    
    # Filter by both
    response = client.get(f"/sessions?user_id={test_user['id']}&skill_type=Drawing")
    assert response.status_code == 200
    sessions = response.json()
    assert len(sessions) == 1
    assert sessions[0]["user_id"] == test_user["id"]
    assert sessions[0]["skill_type"] == "Drawing"


def test_get_session_by_id(test_user):
    """Test getting session by ID"""
    # Create session
    create_response = client.post("/sessions", json={
        "user_id": test_user["id"],
        "skill_type": "Drawing",
        "score": 85,
        "feedback": "Test feedback"
    })
    session_id = create_response.json()["id"]
    
    # Get session
    response = client.get(f"/sessions/{session_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == session_id
    assert data["skill_type"] == "Drawing"
    assert data["score"] == 85


def test_get_session_not_found():
    """Test getting non-existent session"""
    response = client.get("/sessions/99999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_get_session_summary_empty(test_user):
    """Test session summary with no sessions"""
    response = client.get(f"/sessions/summary?user_id={test_user['id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["total_sessions"] == 0
    assert data["average_score"] == 0.0
    assert data["average_score_by_skill"] == {}
    assert data["sessions_by_skill"] == {}


def test_get_session_summary_single_skill(test_user):
    """Test session summary with single skill type"""
    # Create multiple sessions for same skill
    client.post("/sessions", json={
        "user_id": test_user["id"],
        "skill_type": "Drawing",
        "score": 80,
        "feedback": "Good"
    })
    client.post("/sessions", json={
        "user_id": test_user["id"],
        "skill_type": "Drawing",
        "score": 90,
        "feedback": "Excellent"
    })
    client.post("/sessions", json={
        "user_id": test_user["id"],
        "skill_type": "Drawing",
        "score": 85,
        "feedback": "Great"
    })
    
    response = client.get(f"/sessions/summary?user_id={test_user['id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["total_sessions"] == 3
    assert data["average_score"] == 85.0
    assert "Drawing" in data["average_score_by_skill"]
    assert data["average_score_by_skill"]["Drawing"] == 85.0
    assert data["sessions_by_skill"]["Drawing"] == 3


def test_get_session_summary_multiple_skills(test_user):
    """Test session summary with multiple skill types"""
    # Create sessions for different skills
    client.post("/sessions", json={
        "user_id": test_user["id"],
        "skill_type": "Drawing",
        "score": 80,
        "feedback": "Good"
    })
    client.post("/sessions", json={
        "user_id": test_user["id"],
        "skill_type": "Drawing",
        "score": 90,
        "feedback": "Excellent"
    })
    client.post("/sessions", json={
        "user_id": test_user["id"],
        "skill_type": "Yoga",
        "score": 75,
        "feedback": "Good"
    })
    client.post("/sessions", json={
        "user_id": test_user["id"],
        "skill_type": "Yoga",
        "score": 85,
        "feedback": "Great"
    })
    
    response = client.get(f"/sessions/summary?user_id={test_user['id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["total_sessions"] == 4
    assert data["average_score"] == 82.5
    assert len(data["average_score_by_skill"]) == 2
    assert "Drawing" in data["average_score_by_skill"]
    assert "Yoga" in data["average_score_by_skill"]
    assert data["average_score_by_skill"]["Drawing"] == 85.0
    assert data["average_score_by_skill"]["Yoga"] == 80.0
    assert data["sessions_by_skill"]["Drawing"] == 2
    assert data["sessions_by_skill"]["Yoga"] == 2


def test_get_session_summary_invalid_user():
    """Test session summary with non-existent user"""
    response = client.get("/sessions/summary?user_id=99999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_get_session_summary_missing_user_id():
    """Test session summary without user_id parameter"""
    response = client.get("/sessions/summary")
    assert response.status_code == 422  # Validation error

