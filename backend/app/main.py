import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.api import health, vendors, runs
from app.models import VendorRun

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure DB tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Vendor Onboarding & Verification API",
    description="Automated vendor onboarding system with deterministic validation engine, AI risk insights, and persistent audit history.",
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

DEMO_RUN_IDS = [
    "RUN-20260924-DEMO01",
    "RUN-20260924-DEMO02",
    "RUN-20260924-DEMO03",
    "RUN-20260924-DEMO04",
    "RUN-20260924-DEMO05"
]

def cleanup_legacy_demo_records(db):
    """Safely cleans up any legacy seeded demo records without affecting real submissions."""
    try:
        deleted = db.query(VendorRun).filter(
            (VendorRun.run_id.in_(DEMO_RUN_IDS)) | (VendorRun.run_id.ilike("%DEMO%"))
        ).delete(synchronize_session=False)
        if deleted > 0:
            db.commit()
            logger.info(f"Cleaned up {deleted} legacy demo run(s) from database.")
    except Exception as e:
        db.rollback()
        logger.warning(f"Legacy demo records cleanup warning: {e}")

@app.on_event("startup")
def on_startup():
    logger.info("Initializing database connection and schema...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        cleanup_legacy_demo_records(db)
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "message": "AI Vendor Onboarding & Verification API is running.",
        "documentation": "/docs",
        "health_check": "/api/health"
    }
