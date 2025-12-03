"""
NanoSensei FastAPI Backend
Optimized for AWS Graviton (arm64) deployment
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import create_db_and_tables
from app.api import routes_users, routes_sessions

app = FastAPI(
    title="NanoSensei API",
    description="On-device AI skill coach backend - optimized for AWS Graviton",
    version="1.0.0"
)

# CORS middleware for mobile app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your mobile app domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(routes_users.router, prefix="/users", tags=["users"])
app.include_router(routes_sessions.router, prefix="/sessions", tags=["sessions"])


@app.on_event("startup")
async def startup_event():
    """Create database tables on startup"""
    create_db_and_tables()


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "message": "NanoSensei backend is running"}


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "NanoSensei API",
        "docs": "/docs",
        "health": "/health"
    }

