# 🛡️ AI Vendor Onboarding & Verification System

A complete, production-grade automated vendor onboarding web application built for automated compliance verification, document validation, tax format checking, and bank entity matching.

---

## 🌟 Overview

The **AI Vendor Onboarding & Verification System** automates the vendor risk intake workflow by evaluating submitted vendor credentials against strict deterministic validation rules, optionally enriched with OpenAI LLM risk insights.

### Core Decision Pipeline
`Vendor Submission` ➔ `Required Field Check` ➔ `Document Check` ➔ `Tax ID Validation` ➔ `Company Name vs Bank Account Name Check` ➔ `Deterministic Decision Engine` ➔ `Structured Decision & Audit Log`

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React (Vite) with a modern glassmorphic UI, responsive step-by-step verification pipeline animation, and pre-built 1-click test scenario presets.
- **Backend**: Python + FastAPI (RESTful JSON API with Pydantic validation and multipart file handling).
- **Database**: SQLite with SQLAlchemy ORM for audit persistence and history tracking.
- **AI Integration**: OpenAI API (`gpt-4o-mini`) for entity similarity reasoning & risk commentary (falls back gracefully to pure deterministic verification if no API key is provided).

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional)
python -m venv venv
# Activate on Windows:
.\venv\Scripts\activate
# Activate on macOS/Linux:
# source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# (Optional) Create .env file for OpenAI API key
cp .env.example .env

# Start FastAPI Backend Server (Runs on http://localhost:8000)
python run.py
```

### 3. Frontend Setup
```bash
# In a new terminal window, navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start Vite React Development Server (Runs on http://localhost:3000)
npm run dev
```

---

## 🧪 4 Case Study Test Scenarios (1-Click Preset Buttons)

The application includes 4 built-in preset scenario buttons on the submission page and dashboard:

| Test Scenario | Company Name | Bank Account Name | Tax ID | Missing Document | Expected Decision | Reason / Output |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TEST 1 — Happy Path** | ABC Technologies Private Limited | ABC Technologies Private Limited | `27AAAAA0000A1Z5` (Valid GSTIN) | None | `APPROVED` | All checks passed cleanly. |
| **TEST 2 — Missing Document** | Bright Solutions Private Limited | Bright Solutions Private Limited | `29BBBBB1111B2Z6` | Compliance Document | `PENDING` | Compliance document is missing. |
| **TEST 3 — Bank Name Mismatch** | Nova Technologies Private Limited | XYZ Enterprises | `33CCCCC2222C3Z7` | None | `PENDING` | Company name and bank account name do not match. |
| **TEST 4 — Invalid Tax ID** | Delta Systems Private Limited | Delta Systems Private Limited | `INVALID_GSTIN_123` | None | `REJECTED` | Tax ID format is invalid. |

---

## ⚙️ Deterministic Validation Rules Engine

1. **Required Fields Check**: Validates presence of Company Name, Vendor Email, Contact Person, Country, Tax ID, Bank Account Name, Bank Account Number, Bank Name, and Business Address. Missing fields set status to `PENDING`.
2. **Required Document Check**: Enforces presence of Tax Registration Document, Compliance Document, and Company Registration Document. Missing docs set status to `PENDING`.
3. **Tax ID Format Check**:
   - **India**: Enforces 15-character GSTIN regex (`^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$`).
   - **United States**: Enforces EIN format (`^\d{2}-?\d{7}$`).
   - **General**: Enforces minimum length and alphanumeric structure. Invalid format sets status to `REJECTED`.
4. **Company Name vs Bank Account Name Match**: Normalizes both strings by lowercasing, stripping punctuation, extra spaces, and legal suffixes (`Pvt Ltd`, `Private Limited`, `Ltd`, `Limited`, `Inc`, `Corp`, etc.). Mismatches set status to `PENDING`.

---

## 📡 API Endpoints Reference

- `GET /api/health`: Health status & OpenAI key availability
- `POST /api/vendors/onboard`: Submit vendor form + document uploads
- `GET /api/runs`: Fetch persisted verification runs list (supports `decision` and `search` filters)
- `GET /api/runs/{run_id}`: Fetch complete details for a specific run ID
- `DELETE /api/runs/{run_id}`: Delete a run record from audit history

---

## 🔒 Security & Key Storage

- API keys are read strictly from environment variables (`OPENAI_API_KEY`).
- No secret keys are exposed to the React frontend client.
- If no API key is provided, the application operates 100% deterministically without crashing.

---

## 🚀 Future Improvements

- Automated OCR document parsing for extracting text directly from uploaded PDFs.
- Official API integrations with government tax databases (e.g. GSTN portal for real-time verification).
- Webhook notifications for enterprise ERP/CRM onboarding updates.
