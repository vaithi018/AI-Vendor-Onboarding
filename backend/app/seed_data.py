import datetime
from sqlalchemy.orm import Session
from app.models import VendorRun
from app.rules_engine import run_deterministic_rules

def seed_initial_demo_runs(db: Session):
    existing_count = db.query(VendorRun).count()
    if existing_count > 0:
        return

    base_time = datetime.datetime.utcnow() - datetime.timedelta(hours=4)

    scenarios = [
        {
            "run_id": "RUN-20260924-DEMO01",
            "vendor_data": {
                "company_name": "ABC Technologies Private Limited",
                "vendor_email": "finance@abctech.com",
                "contact_person": "Rahul Sharma",
                "country": "India",
                "tax_id": "27AAAAA0000A1Z5",
                "bank_account_name": "ABC Technologies Private Limited",
                "bank_account_number": "918273645019",
                "bank_name": "HDFC Bank",
                "business_address": "123 BKC Financial Center, Mumbai, India"
            },
            "doc_types": ["tax_registration", "compliance_doc", "company_registration"],
            "docs_info": [
                {"type": "tax_registration", "label": "Tax Registration Document", "filename": "GST_Certificate_ABC.pdf", "size": 210000},
                {"type": "compliance_doc", "label": "Compliance Document", "filename": "ISO27001_Compliance_ABC.pdf", "size": 185000},
                {"type": "company_registration", "label": "Company Registration Document", "filename": "COI_ABC_Tech.pdf", "size": 340000}
            ],
            "time_offset_minutes": 0
        },
        {
            "run_id": "RUN-20260924-DEMO02",
            "vendor_data": {
                "company_name": "Bright Solutions Private Limited",
                "vendor_email": "accounts@brightsolutions.in",
                "contact_person": "Priya Verma",
                "country": "India",
                "tax_id": "29BBBBB1111B2Z6",
                "bank_account_name": "Bright Solutions Private Limited",
                "bank_account_number": "501002938475",
                "bank_name": "ICICI Bank",
                "business_address": "45 MG Road, Bengaluru, India"
            },
            "doc_types": ["tax_registration", "company_registration"], # missing compliance_doc
            "docs_info": [
                {"type": "tax_registration", "label": "Tax Registration Document", "filename": "GST_Bright_Solutions.pdf", "size": 220000},
                {"type": "company_registration", "label": "Company Registration Document", "filename": "COI_Bright.pdf", "size": 290000}
            ],
            "time_offset_minutes": 35
        },
        {
            "run_id": "RUN-20260924-DEMO03",
            "vendor_data": {
                "company_name": "Nova Technologies Private Limited",
                "vendor_email": "admin@novatech.io",
                "contact_person": "Amit Patel",
                "country": "India",
                "tax_id": "33CCCCC2222C3Z7",
                "bank_account_name": "XYZ Enterprises",
                "bank_account_number": "002910394857",
                "bank_name": "State Bank of India",
                "business_address": "88 Cyber City, Gurugram, India"
            },
            "doc_types": ["tax_registration", "compliance_doc", "company_registration"],
            "docs_info": [
                {"type": "tax_registration", "label": "Tax Registration Document", "filename": "GSTIN_Nova.pdf", "size": 195000},
                {"type": "compliance_doc", "label": "Compliance Document", "filename": "Compliance_Nova.pdf", "size": 160000},
                {"type": "company_registration", "label": "Company Registration Document", "filename": "Registration_Nova.pdf", "size": 310000}
            ],
            "time_offset_minutes": 75
        },
        {
            "run_id": "RUN-20260924-DEMO04",
            "vendor_data": {
                "company_name": "Delta Systems Private Limited",
                "vendor_email": "billing@deltasystems.com",
                "contact_person": "Vikram Singh",
                "country": "India",
                "tax_id": "INVALID_GSTIN_999",
                "bank_account_name": "Delta Systems Private Limited",
                "bank_account_number": "112233445566",
                "bank_name": "Axis Bank",
                "business_address": "12 Tech Zone, Hyderabad, India"
            },
            "doc_types": ["tax_registration", "compliance_doc", "company_registration"],
            "docs_info": [
                {"type": "tax_registration", "label": "Tax Registration Document", "filename": "Tax_Doc_Delta.pdf", "size": 205000},
                {"type": "compliance_doc", "label": "Compliance Document", "filename": "Compliance_Delta.pdf", "size": 175000},
                {"type": "company_registration", "label": "Company Registration Document", "filename": "Certificate_Delta.pdf", "size": 280000}
            ],
            "time_offset_minutes": 110
        }
    ]

    for sc in scenarios:
        vdata = sc["vendor_data"]
        rules_res = run_deterministic_rules(vdata, sc["doc_types"])
        
        run_time = base_time + datetime.timedelta(minutes=sc["time_offset_minutes"])
        
        ai_mock = {
            "ai_enabled": False,
            "status": "SKIPPED",
            "risk_summary": f"Initial demo run seeded with decision: {rules_res['decision']}.",
            "recommendation": "Review vendor record details."
        }

        db_run = VendorRun(
            run_id=sc["run_id"],
            company_name=vdata["company_name"],
            vendor_email=vdata["vendor_email"],
            contact_person=vdata["contact_person"],
            country=vdata["country"],
            tax_id=vdata["tax_id"],
            bank_account_name=vdata["bank_account_name"],
            bank_account_number=vdata["bank_account_number"],
            bank_name=vdata["bank_name"],
            business_address=vdata["business_address"],
            submitted_documents=sc["docs_info"],
            decision=rules_res["decision"],
            reasons=rules_res["reasons"],
            validation_checks=rules_res["validation_checks"],
            required_action=rules_res["required_action"],
            ai_insights=ai_mock,
            created_at=run_time
        )
        db.add(db_run)
        
    db.commit()
