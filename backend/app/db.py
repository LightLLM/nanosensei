"""
Database setup using SQLModel
"""

from sqlmodel import SQLModel, create_engine, Session
import os

# Database file path (will be created in /app/data in Docker, or local in dev)
# For local dev, creates backend/data/ directory
# For Docker, uses /app/data/ directory
DATABASE_DIR = os.getenv("DATABASE_DIR", os.path.join(os.path.dirname(__file__), "..", "data"))
os.makedirs(DATABASE_DIR, exist_ok=True)

DATABASE_URL = f"sqlite:///{DATABASE_DIR}/nanosensei.db"

# Create engine
engine = create_engine(DATABASE_URL, echo=False)


def get_session():
    """Get database session"""
    with Session(engine) as session:
        yield session


def create_db_and_tables():
    """Create database tables"""
    SQLModel.metadata.create_all(engine)

