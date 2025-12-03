"""
Comprehensive unit tests for user endpoints
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


def test_create_user_success():
    """Test successful user creation"""
    response = client.post(
        "/users",
        json={"username": "newuser", "email": "newuser@example.com"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == "newuser@example.com"
    assert "id" in data
    assert "created_at" in data


def test_create_user_without_email():
    """Test user creation without email"""
    response = client.post(
        "/users",
        json={"username": "user_no_email"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "user_no_email"
    assert data["email"] is None


def test_create_user_duplicate_username():
    """Test creating user with duplicate username"""
    # Create first user
    client.post("/users", json={"username": "duplicate", "email": "first@example.com"})
    
    # Try to create duplicate
    response = client.post(
        "/users",
        json={"username": "duplicate", "email": "second@example.com"}
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"].lower()


def test_get_user_success():
    """Test getting existing user"""
    # Create user
    create_response = client.post(
        "/users",
        json={"username": "getuser", "email": "get@example.com"}
    )
    user_id = create_response.json()["id"]
    
    # Get user
    response = client.get(f"/users/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == user_id
    assert data["username"] == "getuser"
    assert data["email"] == "get@example.com"


def test_get_user_not_found():
    """Test getting non-existent user"""
    response = client.get("/users/99999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_list_users_empty():
    """Test listing users when none exist"""
    response = client.get("/users")
    assert response.status_code == 200
    assert response.json() == []


def test_list_users_multiple():
    """Test listing multiple users"""
    # Create multiple users
    client.post("/users", json={"username": "user1", "email": "user1@example.com"})
    client.post("/users", json={"username": "user2", "email": "user2@example.com"})
    client.post("/users", json={"username": "user3"})
    
    response = client.get("/users")
    assert response.status_code == 200
    users = response.json()
    assert len(users) == 3
    assert all("id" in user for user in users)
    assert all("username" in user for user in users)


def test_create_user_invalid_email_format():
    """Test user creation with invalid email format"""
    response = client.post(
        "/users",
        json={"username": "invalid_email", "email": "not-an-email"}
    )
    # Pydantic should validate email format
    assert response.status_code == 422  # Validation error


def test_create_user_missing_username():
    """Test user creation without required username"""
    response = client.post("/users", json={"email": "test@example.com"})
    assert response.status_code == 422  # Validation error

