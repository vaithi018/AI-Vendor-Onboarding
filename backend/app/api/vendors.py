import uuid
import datetime
import shutil
from pathlib import Path
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, Form, File, UploadFile, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import VendorRun
from app.config import UPLOADS_DIR
from app.rules_engine import run_deterministic_rules
from app.ai_service import generate_ai_insights

router = APIRouter(prefix="/vendors", tags=["Vendors"])

def parse_bool(val: Any) -> bool:
    if isinstance(val, bool):
        return val
    if isinstance(val, str):
        return val.lower() in ["true", "1", "yes", "on"]
    return bool(val)

@router.post("/onboard")
@router.post("/onboard/")
async def onboard_vendor(
    company_name: str = Form(""),
    vendor_email: str = Form(""),
    contact_person: str = Form(""),
    country: str = Form(""),
    tax_id: str = Form(""),
    bank_account_name: str = Form(""),
    bank_account_number: str = Form(""),
    bank_name: str = Form(""),
    business_address: str = Form(""),
    # Boolean flags for synthetic document attachments
    has_tax_registration: Any = Form(False),
    has_compliance_doc: Any = Form(False),
    has_company_registration: Any = Form(False),
    # Uploaded file handles
    tax_registration_file: Optional[UploadFile] = File(None),
    compliance_doc_file: Optional[UploadFile] = File(None),
    company_registration_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    try:
        run_timestamp = datetime.datetime.utcnow()
        unique_suffix = run_timestamp.strftime("%Y%m%d%H%M%S") + "-" + uuid.uuid4().hex[:4].upper()
        run_id = f"RUN-{unique_suffix}"
        
        # Parse boolean values
        bool_tax_reg = parse_bool(has_tax_registration)
        bool_comp_doc = parse_bool(has_compliance_doc)
        bool_coi_doc = parse_bool(has_company_registration)

        # Create a run directory in uploads for saving files
        run_upload_dir = UPLOADS_DIR / run_id
        run_upload_dir.mkdir(parents=True, exist_ok=True)
        
        submitted_documents: List[Dict[str, Any]] = []
        submitted_doc_types: List[str] = []
        
        # Save Tax Registration File if uploaded or flagged
        if tax_registration_file and tax_registration_file.filename:
            file_path = run_upload_dir / tax_registration_file.filename
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(tax_registration_file.file, buffer)
            submitted_doc_types.append("tax_registration")
            submitted_documents.append({
                "type": "tax_registration",
                "label": "Tax Registration Document",
                "filename": tax_registration_file.filename,
                "file_path": str(file_path),
                "size": file_path.stat().st_size
            })
        elif bool_tax_reg:
            submitted_doc_types.append("tax_registration")
            submitted_documents.append({
                "type": "tax_registration",
                "label": "Tax Registration Document",
                "filename": "Tax_Registration_Certificate.pdf (Sample)",
                "size": 245000
            })

        # Save Compliance Document File if uploaded or flagged
        if compliance_doc_file and compliance_doc_file.filename:
            file_path = run_upload_dir / compliance_doc_file.filename
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(compliance_doc_file.file, buffer)
            submitted_doc_types.append("compliance_doc")
            submitted_documents.append({
                "type": "compliance_doc",
                "label": "Compliance Document",
                "filename": compliance_doc_file.filename,
                "file_path": str(file_path),
                "size": file_path.stat().st_size
            })
        elif bool_comp_doc:
            submitted_doc_types.append("compliance_doc")
            submitted_documents.append({
                "type": "compliance_doc",
                "label": "Compliance Document",
                "filename": "Compliance_Policy_Agreement.pdf (Sample)",
                "size": 180000
            })

        # Save Company Registration File if uploaded or flagged
        if company_registration_file and company_registration_file.filename:
            file_path = run_upload_dir / company_registration_file.filename
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(company_registration_file.file, buffer)
            submitted_doc_types.append("company_registration")
            submitted_documents.append({
                "type": "company_registration",
                "label": "Company Registration Document",
                "filename": company_registration_file.filename,
                "file_path": str(file_path),
                "size": file_path.stat().st_size
            })
        elif bool_coi_doc:
            submitted_doc_types.append("company_registration")
            submitted_documents.append({
                "type": "company_registration",
                "label": "Company Registration Document",
                "filename": "Certificate_of_Incorporation.pdf (Sample)",
                "size": 310000
            })

        vendor_data = {
            "company_name": company_name.strip(),
            "vendor_email": vendor_email.strip(),
            "contact_person": contact_person.strip(),
            "country": country.strip(),
            "tax_id": tax_id.strip(),
            "bank_account_name": bank_account_name.strip(),
            "bank_account_number": bank_account_number.strip(),
            "bank_name": bank_name.strip(),
            "business_address": business_address.strip()
        }

        # 1. Run deterministic decision engine
        rule_result = run_deterministic_rules(vendor_data, submitted_doc_types, submitted_documents)
        
        # 2. Run optional AI enrichment
        ai_insights = generate_ai_insights(
            vendor_data=vendor_data,
            deterministic_result=rule_result,
            document_summaries=submitted_documents
        )

        # 3. Store run record in database
        db_run = VendorRun(
            run_id=run_id,
            company_name=vendor_data["company_name"],
            vendor_email=vendor_data["vendor_email"],
            contact_person=vendor_data["contact_person"],
            country=vendor_data["country"],
            tax_id=vendor_data["tax_id"],
            bank_account_name=vendor_data["bank_account_name"],
            bank_account_number=vendor_data["bank_account_number"],
            bank_name=vendor_data["bank_name"],
            business_address=vendor_data["business_address"],
            submitted_documents=submitted_documents,
            decision=rule_result["decision"],
            reasons=rule_result["reasons"],
            validation_checks=rule_result["validation_checks"],
            required_action=rule_result["required_action"],
            ai_insights=ai_insights,
            created_at=run_timestamp
        )
        
        db.add(db_run)
        db.commit()
        db.refresh(db_run)

        return {
            "run_id": db_run.run_id,
            "company_name": db_run.company_name,
            "vendor_email": db_run.vendor_email,
            "contact_person": db_run.contact_person,
            "country": db_run.country,
            "tax_id": db_run.tax_id,
            "bank_account_name": db_run.bank_account_name,
            "bank_account_number": db_run.bank_account_number,
            "bank_name": db_run.bank_name,
            "business_address": db_run.business_address,
            "submitted_documents": db_run.submitted_documents,
            "decision": db_run.decision,
            "reasons": db_run.reasons,
            "validation_checks": db_run.validation_checks,
            "required_action": db_run.required_action,
            "ai_insights": db_run.ai_insights,
            "created_at": db_run.created_at.isoformat()
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while processing vendor submission: {str(e)}"
        )
