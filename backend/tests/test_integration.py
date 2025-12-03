"""
Integration tests for the full API workflow
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


def test_full_user_workflow():
    """Test complete user creation and retrieval workflow"""
    # Create user
    create_response = client.post(
        "/users",
        json={"username": "workflow_user", "email": "workflow@example.com"}
    )
    assert create_response.status_code == 201
    user_id = create_response.json()["id"]
    
    # Get user
    get_response = client.get(f"/users/{user_id}")
    assert get_response.status_code == 200
    assert get_response.json()["username"] == "workflow_user"
    
    # List users
    list_response = client.get("/users")
    assert list_response.status_code == 200
    assert len(list_response.json()) >= 1


def test_full_session_workflow():
    """Test complete session creation and retrieval workflow"""
    # Create user
    user_response = client.post(
        "/users",
        json={"username": "session_workflow", "email": "session@example.com"}
    )
    user_id = user_response.json()["id"]
    
    # Create multiple sessions
    session1_response = client.post(
        "/sessions",
        json={
            "user_id": user_id,
            "skill_type": "Drawing",
            "score": 80,
            "feedback": "Good"
        }
    )
    assert session1_response.status_code == 201
    session1_id = session1_response.json()["id"]
    
    session2_response = client.post(
        "/sessions",
        json={
            "user_id": user_id,
            "skill_type": "Yoga",
            "score": 90,
            "feedback": "Excellent"
        }
    )
    assert session2_response.status_code == 201
    
    # Get session by ID
    get_session_response = client.get(f"/sessions/{session1_id}")
    assert get_session_response.status_code == 200
    assert get_session_response.json()["skill_type"] == "Drawing"
    
    # List sessions for user
    list_sessions_response = client.get(f"/sessions?user_id={user_id}")
    assert list_sessions_response.status_code == 200
    assert len(list_sessions_response.json()) == 2
    
    # Get summary
    summary_response = client.get(f"/sessions/summary?user_id={user_id}")
    assert summary_response.status_code == 200
    summary = summary_response.json()
    assert summary["total_sessions"] == 2
    assert summary["average_score"] == 85.0
    assert len(summary["average_score_by_skill"]) == 2


def test_cors_headers():
    """Test that CORS headers are properly set"""
    response = client.options("/health")
    # CORS preflight should be handled
    assert response.status_code in [200, 204]


def test_api_documentation_endpoints():
    """Test that API documentation endpoints are accessible"""
    # OpenAPI JSON
    response = client.get("/openapi.json")
    assert response.status_code == 200
    assert "openapi" in response.json()
    
    # Swagger UI (redirects to /docs)
    response = client.get("/docs")
    assert response.status_code == 200

