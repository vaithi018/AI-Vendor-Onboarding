from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class VendorSubmissionBase(BaseModel):
    company_name: str = Field(..., example="ABC Technologies Private Limited")
    vendor_email: str = Field(..., example="contact@abctech.com")
    contact_person: str = Field(..., example="Rahul Sharma")
    country: str = Field(..., example="India")
    tax_id: str = Field(..., example="27AAAAA0000A1Z5")
    bank_account_name: str = Field(..., example="ABC Technologies Private Limited")
    bank_account_number: str = Field(..., example="918273645019")
    bank_name: str = Field(..., example="HDFC Bank")
    business_address: str = Field(..., example="123 Tech Park, BKC, Mumbai, India")

class CheckDetail(BaseModel):
    passed: bool
    status: str # "PASSED", "FAILED", "WARNING", "MISSING"
    label: str
    message: str
    action: Optional[str] = None

class ValidationChecksSummary(BaseModel):
    required_fields: CheckDetail
    document_check: CheckDetail
    tax_id_check: CheckDetail
    name_match_check: CheckDetail

class DecisionResponse(BaseModel):
    run_id: str
    company_name: str
    vendor_email: str
    contact_person: str
    country: str
    tax_id: str
    bank_account_name: str
    bank_account_number: str
    bank_name: str
    business_address: str
    submitted_documents: List[Dict[str, Any]]
    decision: str # APPROVED, PENDING, REJECTED
    reasons: List[str]
    validation_checks: Dict[str, Any]
    required_action: Optional[str] = None
    ai_insights: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class RunListItem(BaseModel):
    run_id: str
    company_name: str
    country: str
    tax_id: str
    decision: str
    reasons: List[str]
    created_at: datetime

    class Config:
        from_attributes = True
