import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.api import health, vendors, runs
from app.seed_data import seed_initial_demo_runs

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Vendor Onboarding & Verification API",
    description="Automated vendor onboarding system with deterministic validation engine, AI risk insights, and SQLite audit history.",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite default dev server on port 3000 / 5173 / any localhost port)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api")
app.include_router(vendors.router, prefix="/api")
app.include_router(runs.router, prefix="/api")

@app.on_event("startup")
def on_startup():
    logger.info("Initializing database and seeding demo scenarios...")
    db = SessionLocal()
    try:
        seed_initial_demo_runs(db)
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "message": "AI Vendor Onboarding & Verification API is running.",
        "documentation": "/docs",
        "health_check": "/api/health"
    }
