from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import VendorRun

router = APIRouter(prefix="/runs", tags=["Runs History"])

@router.get("")
@router.get("/")
def list_runs(
    decision: Optional[str] = Query(None, description="Filter by APPROVED, PENDING, or REJECTED"),
    search: Optional[str] = Query(None, description="Search by vendor name or tax ID"),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    query = db.query(VendorRun)
    
    if decision:
        query = query.filter(VendorRun.decision == decision.upper())
        
    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            (VendorRun.company_name.ilike(search_pattern)) | 
            (VendorRun.tax_id.ilike(search_pattern)) |
            (VendorRun.run_id.ilike(search_pattern))
        )
        
    runs = query.order_by(VendorRun.created_at.desc()).limit(limit).all()
    
    results = []
    for r in runs:
        results.append({
            "id": r.id,
            "run_id": r.run_id,
            "company_name": r.company_name,
            "country": r.country,
            "tax_id": r.tax_id,
            "decision": r.decision,
            "reasons": r.reasons,
            "required_action": r.required_action,
            "created_at": r.created_at.isoformat()
        })
        
    return results

@router.get("/{run_id}")
def get_run_details(run_id: str, db: Session = Depends(get_db)):
    run = db.query(VendorRun).filter(VendorRun.run_id == run_id).first()
    if not run:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Run record with ID '{run_id}' not found."
        )
    return {
        "id": run.id,
        "run_id": run.run_id,
        "company_name": run.company_name,
        "vendor_email": run.vendor_email,
        "contact_person": run.contact_person,
        "country": run.country,
        "tax_id": run.tax_id,
        "bank_account_name": run.bank_account_name,
        "bank_account_number": run.bank_account_number,
        "bank_name": run.bank_name,
        "business_address": run.business_address,
        "submitted_documents": run.submitted_documents,
        "decision": run.decision,
        "reasons": run.reasons,
        "validation_checks": run.validation_checks,
        "required_action": run.required_action,
        "ai_insights": run.ai_insights,
        "created_at": run.created_at.isoformat()
    }

@router.delete("/{run_id}")
def delete_run(run_id: str, db: Session = Depends(get_db)):
    run = db.query(VendorRun).filter(VendorRun.run_id == run_id).first()
    if not run:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Run record with ID '{run_id}' not found."
        )
    db.delete(run)
    db.commit()
    return {"message": f"Run '{run_id}' deleted successfully."}
