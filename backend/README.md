# NanoSensei Backend

FastAPI backend for NanoSensei, optimized for AWS Graviton (arm64) deployment.

## Features

- User management
- Session storage and retrieval
- Session analytics and summaries
- RESTful API with automatic OpenAPI documentation

## Local Development

### Prerequisites

- Python 3.11+
- pip

### Setup

1. Create virtual environment:
```bash
cd backend
python -m venv .venv
```

2. Activate virtual environment:

**Windows:**
```bash
.venv\Scripts\activate
```

**macOS/Linux:**
```bash
source .venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:

**Option 1 (recommended):**
```bash
python run_local.py
```

**Option 2:**
```bash
cd app
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: `http://localhost:8000`
- Docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Health Check
```bash
curl http://localhost:8000/health
```

### Create User
```bash
curl -X POST http://localhost:8000/users \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com"}'
```

### Get User
```bash
curl http://localhost:8000/users/1
```

### Create Session
```bash
curl -X POST http://localhost:8000/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "skill_type": "Drawing",
    "score": 85,
    "feedback": "Great form! Keep practicing your strokes."
  }'
```

### List Sessions
```bash
# All sessions
curl http://localhost:8000/sessions

# Filter by user
curl http://localhost:8000/sessions?user_id=1

# Filter by skill type
curl http://localhost:8000/sessions?skill_type=Drawing
```

### Get Session Summary
```bash
curl http://localhost:8000/sessions/summary?user_id=1
```

## Database

The backend uses SQLite for simplicity. The database file is stored in:
- Local dev: `backend/data/nanosensei.db`
- Docker: `/app/data/nanosensei.db`

For production, consider migrating to PostgreSQL or another production database.

## Testing

Run tests:
```bash
pytest
```

## Architecture Notes

- **SQLModel**: Combines SQLAlchemy and Pydantic for type-safe database models
- **FastAPI**: Modern, fast web framework with automatic API documentation
- **Arm64 optimized**: Designed to run efficiently on AWS Graviton instances

## Deployment

See [`../infra/DEPLOY_AWS_GRAVITON.md`](../infra/DEPLOY_AWS_GRAVITON.md) for AWS Graviton deployment instructions.

