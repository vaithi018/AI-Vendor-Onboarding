from fastapi import APIRouter
from app.config import OPENAI_API_KEY

router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AI Vendor Onboarding & Verification System",
        "openai_api_available": bool(OPENAI_API_KEY),
        "database": "connected"
    }
