import re
from typing import Dict, List, Any, Optional

def normalize_business_name(name: str) -> str:
    if not name:
        return ""
    # Convert to lowercase
    normalized = name.lower().strip()
    
    # Remove punctuation
    normalized = re.sub(r'[^\w\s]', ' ', normalized)
    
    # Common business suffixes to strip
    suffixes = [
        r'\bprivate limited\b', r'\bpvt ltd\b', r'\bltd\b', r'\blimited\b',
        r'\binc\b', r'\bincorporated\b', r'\bcorp\b', r'\bcorporation\b',
        r'\bllc\b', r'\bgmbh\b', r'\bco\b', r'\bcompany\b', r'\bplc\b',
        r'\benterprises\b', r'\bsolutions\b', r'\btech\b', r'\btechnologies\b'
    ]
    
    # We strip common corporate suffixes (pvt ltd, private limited, ltd, limited, inc, corp, etc.)
    corporate_legal_suffixes = [
        r'\bprivate limited\b', r'\bpvt ltd\b', r'\bltd\b', r'\blimited\b',
        r'\binc\b', r'\bincorporated\b', r'\bcorp\b', r'\bcorporation\b',
        r'\bllc\b', r'\bgmbh\b', r'\bplc\b'
    ]
    
    for suffix in corporate_legal_suffixes:
        normalized = re.sub(suffix, '', normalized)
        
    # Clean up whitespace
    normalized = re.sub(r'\s+', ' ', normalized).strip()
    return normalized

def validate_tax_id(tax_id: str, country: str) -> Dict[str, Any]:
    tax_id_clean = (tax_id or "").strip().upper()
    country_clean = (country or "").strip().lower()
    
    if not tax_id_clean:
        return {
            "valid": False,
            "status": "FAILED",
            "message": "Tax ID is missing or empty.",
            "rule": "Tax ID Presence"
        }
        
    # GSTIN validation for India
    # Format: 2 digits (state code), 10 char PAN (5 letters, 4 digits, 1 letter), 1 entity digit/char, 'Z', 1 check digit/char
    gstin_pattern = r'^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
    
    # US EIN pattern: XX-XXXXXXX or XXXXXXXXX
    us_ein_pattern = r'^\d{2}-?\d{7}$'

    if country_clean in ["india", "in"]:
        if re.match(gstin_pattern, tax_id_clean):
            return {
                "valid": True,
                "status": "PASSED",
                "message": f"Tax ID '{tax_id_clean}' matches valid Indian GSTIN format.",
                "rule": "India GSTIN Format Validation"
            }
        else:
            return {
                "valid": False,
                "status": "FAILED",
                "message": f"Tax ID '{tax_id_clean}' format is invalid for India (Expected GSTIN format e.g. 27AAAAA0000A1Z5). Note: This is format validation only.",
                "rule": "India GSTIN Format Validation"
            }
    elif country_clean in ["united states", "usa", "us"]:
        if re.match(us_ein_pattern, tax_id_clean):
            return {
                "valid": True,
                "status": "PASSED",
                "message": f"Tax ID '{tax_id_clean}' matches valid US EIN format.",
                "rule": "US EIN Format Validation"
            }
        else:
            return {
                "valid": False,
                "status": "FAILED",
                "message": f"Tax ID '{tax_id_clean}' format is invalid for US (Expected EIN format e.g. 12-3456789). Note: This is format validation only.",
                "rule": "US EIN Format Validation"
            }
    else:
        # General country validation: at least 5 alphanumeric chars
        if len(tax_id_clean) >= 5 and re.match(r'^[A-Z0-9\-\.]+$', tax_id_clean):
            return {
                "valid": True,
                "status": "PASSED",
                "message": f"Tax ID '{tax_id_clean}' passes standard format check for {country}.",
                "rule": "General Tax ID Format Validation"
            }
        else:
            return {
                "valid": False,
                "status": "FAILED",
                "message": f"Tax ID '{tax_id_clean}' format is invalid for {country}.",
                "rule": "General Tax ID Format Validation"
            }

def run_deterministic_rules(
    vendor_data: Dict[str, str],
    submitted_doc_types: List[str]
) -> Dict[str, Any]:
    """
    Executes core deterministic validation rules with strict priority:
    1. Invalid critical information (Tax ID format invalid) -> REJECTED
    2. Missing information / missing documents -> PENDING
    3. Name mismatch requiring verification -> PENDING
    4. All checks passed -> APPROVED
    """
    
    reasons: List[str] = []
    actions: List[str] = []
    
    # --- 1. Required Fields Check ---
    mandatory_fields = [
        ("company_name", "Company Name"),
        ("vendor_email", "Vendor Email"),
        ("contact_person", "Contact Person"),
        ("country", "Country"),
        ("tax_id", "Tax ID"),
        ("bank_account_name", "Bank Account Name"),
        ("bank_account_number", "Bank Account Number"),
        ("bank_name", "Bank Name"),
        ("business_address", "Business Address")
    ]
    
    missing_fields = []
    for field_key, field_label in mandatory_fields:
        val = vendor_data.get(field_key)
        if not val or not str(val).strip():
            missing_fields.append(field_label)
            
    if missing_fields:
        fields_check_result = {
            "passed": False,
            "status": "FAILED",
            "label": "Required Fields Check",
            "message": f"Missing required field(s): {', '.join(missing_fields)}.",
            "details": missing_fields
        }
        reasons.append(f"Required information missing: {', '.join(missing_fields)}.")
        actions.append(f"Provide missing required field(s): {', '.join(missing_fields)}.")
    else:
        fields_check_result = {
            "passed": True,
            "status": "PASSED",
            "label": "Required Fields Check",
            "message": "All mandatory fields are present."
        }

    # --- 2. Required Documents Check ---
    # Standard required document types: tax_registration, compliance_doc, company_registration
    required_docs = [
        ("tax_registration", "Tax Registration Document"),
        ("compliance_doc", "Compliance Document"),
        ("company_registration", "Company Registration Document")
    ]
    
    doc_types_set = set(submitted_doc_types)
    missing_docs = []
    
    for doc_key, doc_label in required_docs:
        if doc_key not in doc_types_set:
            missing_docs.append(doc_label)
            
    if missing_docs:
        doc_check_result = {
            "passed": False,
            "status": "FAILED",
            "label": "Document Check",
            "message": f"Missing required document(s): {', '.join(missing_docs)}.",
            "missing_documents": missing_docs
        }
        for doc in missing_docs:
            reasons.append(f"{doc} is missing.")
            actions.append(f"Upload the {doc.lower()}.")
    else:
        doc_check_result = {
            "passed": True,
            "status": "PASSED",
            "label": "Document Check",
            "message": "All required documents are provided."
        }

    # --- 3. Tax ID Format Validation ---
    tax_id_val = vendor_data.get("tax_id", "")
    country_val = vendor_data.get("country", "")
    tax_check_res = validate_tax_id(tax_id_val, country_val)
    
    if not tax_check_res["valid"]:
        tax_id_check_result = {
            "passed": False,
            "status": "FAILED",
            "label": "Tax ID Format Check",
            "message": tax_check_res["message"]
        }
        reasons.append("Tax ID format is invalid.")
        actions.append("Provide a valid Tax ID.")
    else:
        tax_id_check_result = {
            "passed": True,
            "status": "PASSED",
            "label": "Tax ID Format Check",
            "message": tax_check_res["message"]
        }

    # --- 4. Company Name vs Bank Account Name Match ---
    company_name = vendor_data.get("company_name", "")
    bank_account_name = vendor_data.get("bank_account_name", "")
    
    norm_company = normalize_business_name(company_name)
    norm_bank = normalize_business_name(bank_account_name)
    
    # Check exact normalized match or subset match
    names_match = False
    if norm_company and norm_bank:
        if norm_company == norm_bank:
            names_match = True
        elif norm_company in norm_bank or norm_bank in norm_company:
            names_match = True
            
    if names_match:
        name_match_check_result = {
            "passed": True,
            "status": "PASSED",
            "label": "Company vs Bank Name Check",
            "message": f"Company name matches bank account name ('{company_name}' vs '{bank_account_name}')."
        }
    else:
        name_match_check_result = {
            "passed": False,
            "status": "FAILED",
            "label": "Company vs Bank Name Check",
            "message": f"Company name ('{company_name}') and bank account name ('{bank_account_name}') do not match."
        }
        reasons.append("Company name and bank account name do not match.")
        actions.append("Verify bank account ownership or provide supporting documentation.")

    # --- Decision Priority Engine ---
    # 1. Invalid Tax ID -> REJECTED
    # 2. Missing fields or missing documents -> PENDING
    # 3. Name mismatch -> PENDING
    # 4. All checks passed -> APPROVED
    
    final_decision = "APPROVED"
    
    if not tax_check_res["valid"]:
        final_decision = "REJECTED"
    elif missing_fields or missing_docs or not names_match:
        final_decision = "PENDING"
    else:
        final_decision = "APPROVED"
        reasons = [
            "All required fields are present",
            "All required documents are provided",
            "Tax ID format is valid",
            "Company name matches bank account name"
        ]
        
    required_action_str = " | ".join(actions) if actions else None
    
    return {
        "decision": final_decision,
        "reasons": reasons,
        "required_action": required_action_str,
        "validation_checks": {
            "required_fields": fields_check_result,
            "document_check": doc_check_result,
            "tax_id_check": tax_id_check_result,
            "name_match_check": name_match_check_result
        }
    }
