# Backend Tests

Comprehensive unit and integration tests for the NanoSensei backend.

## Running Tests

### Run all tests
```bash
cd backend
pytest
```

### Run with verbose output
```bash
pytest -v
```

### Run specific test file
```bash
pytest tests/test_users.py
```

### Run with coverage
```bash
pytest --cov=app --cov-report=html
```

## Test Structure

- `test_main.py` - Basic API endpoint tests
- `test_users.py` - Comprehensive user endpoint tests
- `test_sessions.py` - Comprehensive session endpoint tests
- `test_db.py` - Database operation tests
- `test_integration.py` - Full workflow integration tests
- `conftest.py` - Shared pytest fixtures

## Test Coverage

### User Endpoints
- ✅ Create user (success, duplicate, validation)
- ✅ Get user (success, not found)
- ✅ List users (empty, multiple)

### Session Endpoints
- ✅ Create session (success, invalid user, invalid score)
- ✅ List sessions (all, filtered by user, filtered by skill)
- ✅ Get session by ID
- ✅ Get session summary (empty, single skill, multiple skills)

### Database
- ✅ Table creation
- ✅ Model validation
- ✅ Session management

### Integration
- ✅ Full user workflow
- ✅ Full session workflow
- ✅ CORS headers
- ✅ API documentation

## Writing New Tests

1. Use fixtures from `conftest.py` for database setup
2. Follow the naming convention: `test_<functionality>_<scenario>`
3. Use descriptive docstrings
4. Test both success and error cases
5. Use `@pytest.fixture(autouse=True)` for database cleanup

## Example Test

```python
def test_create_user_success():
    """Test successful user creation"""
    response = client.post(
        "/users",
        json={"username": "newuser", "email": "newuser@example.com"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "newuser"
```

