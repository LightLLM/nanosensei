# Testing Guide for NanoSensei

This document describes how to run the comprehensive test suite for NanoSensei.

## Backend Tests

### Setup

1. Install test dependencies:
```bash
cd backend
pip install -r requirements-dev.txt
```

### Running Tests

**Run all tests:**
```bash
pytest
```

**Run with verbose output:**
```bash
pytest -v
```

**Run specific test file:**
```bash
pytest tests/test_users.py
pytest tests/test_sessions.py
pytest tests/test_db.py
pytest tests/test_integration.py
```

**Run with coverage:**
```bash
pytest --cov=app --cov-report=html
```

### Test Files

- **`test_main.py`** - Basic API endpoint tests (health, root, basic CRUD)
- **`test_users.py`** - Comprehensive user endpoint tests:
  - User creation (success, duplicate username, validation)
  - User retrieval (success, not found)
  - User listing (empty, multiple users)
  - Email validation
- **`test_sessions.py`** - Comprehensive session endpoint tests:
  - Session creation (success, invalid user, invalid score)
  - Session listing (all, filtered by user, filtered by skill)
  - Session retrieval by ID
  - Session summary (empty, single skill, multiple skills)
  - Boundary testing (score 0, 100)
- **`test_db.py`** - Database operation tests:
  - Table creation
  - Model validation
  - Session management
- **`test_integration.py`** - Full workflow integration tests:
  - Complete user workflow
  - Complete session workflow
  - CORS headers
  - API documentation

### Test Coverage

The test suite covers:
- ✅ All API endpoints
- ✅ Success and error cases
- ✅ Input validation
- ✅ Database operations
- ✅ Edge cases and boundary conditions
- ✅ Integration workflows

**Total Test Count:** ~40+ tests

## Mobile App Tests

### Setup

1. Install test dependencies:
```bash
cd mobile
npm install
```

### Running Tests

**Run all tests:**
```bash
npm test
```

**Run in watch mode:**
```bash
npm run test:watch
```

**Run with coverage:**
```bash
npm run test:coverage
```

### Test Files

- **`LocalInferenceEngine.test.ts`** - On-device AI inference engine tests:
  - Valid inference result structure
  - Score range validation (0-100)
  - Feedback for different skill types (Drawing, Yoga, Punching, Guitar)
  - Deterministic results
  - Edge cases (unknown skills, different dimensions)
  - Engine initialization and cleanup

- **`BackendClient.test.ts`** - API client tests with mocked fetch:
  - Health check
  - User creation and retrieval
  - Session sync
  - Session fetching
  - Summary retrieval
  - Error handling (network errors, API errors, invalid JSON)

### Test Coverage

The test suite covers:
- ✅ AI inference engine logic
- ✅ API client methods
- ✅ Error handling
- ✅ Edge cases

**Total Test Count:** ~20+ tests

## CI/CD Integration

Tests are automatically run in CI via GitHub Actions (`.github/workflows/ci.yml`):
- Backend tests run on every push/PR
- Mobile type checking runs on every push/PR
- Docker build verification runs on every push/PR

## Writing New Tests

### Backend

1. Add test file to `backend/tests/`
2. Use fixtures from `conftest.py` for database setup
3. Follow naming: `test_<functionality>_<scenario>`
4. Test both success and error cases

Example:
```python
def test_create_user_success():
    """Test successful user creation"""
    response = client.post("/users", json={"username": "test"})
    assert response.status_code == 201
```

### Mobile

1. Add test file to `mobile/src/__tests__/`
2. Mock external dependencies (fetch, AsyncStorage)
3. Follow Jest conventions

Example:
```typescript
describe('MyComponent', () => {
  it('should work correctly', () => {
    expect(result).toBe(expected);
  });
});
```

## Test Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Use fixtures to reset state between tests
3. **Coverage**: Aim for >80% code coverage
4. **Naming**: Use descriptive test names
5. **Documentation**: Add docstrings to test functions
6. **Edge Cases**: Test boundary conditions and error cases

## Troubleshooting

### Backend Tests

**Import errors:**
- Ensure virtual environment is activated
- Install dependencies: `pip install -r requirements-dev.txt`

**Database errors:**
- Tests use in-memory SQLite, no setup needed
- Check that `conftest.py` fixtures are working

### Mobile Tests

**Jest not found:**
- Run `npm install` in `mobile/` directory
- Check that `jest` is in `devDependencies`

**Module resolution errors:**
- Check `jest.config.js` paths
- Verify `jest.setup.js` mocks are correct

## Coverage Goals

- **Backend:** >85% coverage
- **Mobile:** >70% coverage (UI components excluded)

Run coverage reports to identify gaps:
```bash
# Backend
pytest --cov=app --cov-report=html

# Mobile
npm run test:coverage
```

