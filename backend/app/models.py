import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from app.database import Base

class VendorRun(Base):
    __tablename__ = "vendor_runs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    run_id = Column(String(50), unique=True, index=True, nullable=False)
    
    company_name = Column(String(255), nullable=False)
    vendor_email = Column(String(255), nullable=False)
    contact_person = Column(String(255), nullable=False)
    country = Column(String(100), nullable=False)
    tax_id = Column(String(100), nullable=False)
    bank_account_name = Column(String(255), nullable=False)
    bank_account_number = Column(String(100), nullable=False)
    bank_name = Column(String(255), nullable=False)
    business_address = Column(Text, nullable=False)
    
    submitted_documents = Column(JSON, nullable=False, default=list) # List of doc names/types uploaded
    decision = Column(String(20), nullable=False) # APPROVED, PENDING, REJECTED
    reasons = Column(JSON, nullable=False, default=list) # List of reason strings
    validation_checks = Column(JSON, nullable=False, default=dict) # Details of checks
    required_action = Column(Text, nullable=True) # Action item if not approved
    ai_insights = Column(JSON, nullable=True) # AI analysis result if available
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
