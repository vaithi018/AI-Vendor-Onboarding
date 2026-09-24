import React, { useState } from 'react';
import { 
  Building, Mail, User, Globe, FileCheck, CreditCard, 
  MapPin, Upload, Sparkles, CheckCircle2, AlertCircle, Play, FileText 
} from 'lucide-react';

export default function VendorForm({ onSubmitSubmission, initialPreset }) {
  const [formData, setFormData] = useState({
    company_name: 'ABC Technologies Private Limited',
    vendor_email: 'contact@abctech.com',
    contact_person: 'Rahul Sharma',
    country: 'India',
    tax_id: '27AAAAA0000A1Z5',
    bank_account_name: 'ABC Technologies Private Limited',
    bank_account_number: '918273645019',
    bank_name: 'HDFC Bank',
    business_address: '123 BKC Financial Center, Mumbai, India',
    has_tax_registration: true,
    has_compliance_doc: true,
    has_company_registration: true
  });

  const [files, setFiles] = useState({
    tax_registration_file: null,
    compliance_doc_file: null,
    company_registration_file: null
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Preset quick-fills
  const loadPreset = (presetKey) => {
    setErrorMessage('');
    if (presetKey === 'happy_path') {
      setFormData({
        company_name: 'ABC Technologies Private Limited',
        vendor_email: 'contact@abctech.com',
        contact_person: 'Rahul Sharma',
        country: 'India',
        tax_id: '27AAAAA0000A1Z5',
        bank_account_name: 'ABC Technologies Private Limited',
        bank_account_number: '918273645019',
        bank_name: 'HDFC Bank',
        business_address: '123 BKC Financial Center, Mumbai, India',
        has_tax_registration: true,
        has_compliance_doc: true,
        has_company_registration: true
      });
    } else if (presetKey === 'missing_doc') {
      setFormData({
        company_name: 'Bright Solutions Private Limited',
        vendor_email: 'accounts@brightsolutions.in',
        contact_person: 'Priya Verma',
        country: 'India',
        tax_id: '29BBBBB1111B2Z6',
        bank_account_name: 'Bright Solutions Private Limited',
        bank_account_number: '501002938475',
        bank_name: 'ICICI Bank',
        business_address: '45 MG Road, Bengaluru, India',
        has_tax_registration: true,
        has_compliance_doc: false, // MISSING
        has_company_registration: true
      });
    } else if (presetKey === 'name_mismatch') {
      setFormData({
        company_name: 'Nova Technologies Private Limited',
        vendor_email: 'admin@novatech.io',
        contact_person: 'Amit Patel',
        country: 'India',
        tax_id: '33CCCCC2222C3Z7',
        bank_account_name: 'XYZ Enterprises', // MISMATCH
        bank_account_number: '002910394857',
        bank_name: 'State Bank of India',
        business_address: '88 Cyber City, Gurugram, India',
        has_tax_registration: true,
        has_compliance_doc: true,
        has_company_registration: true
      });
    } else if (presetKey === 'invalid_tax') {
      setFormData({
        company_name: 'Delta Systems Private Limited',
        vendor_email: 'billing@deltasystems.com',
        contact_person: 'Vikram Singh',
        country: 'India',
        tax_id: 'INVALID_GSTIN_123', // INVALID TAX ID
        bank_account_name: 'Delta Systems Private Limited',
        bank_account_number: '112233445566',
        bank_name: 'Axis Bank',
        business_address: '12 Tech Zone, Hyderabad, India',
        has_tax_registration: true,
        has_compliance_doc: true,
        has_company_registration: true
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e, fileType) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFiles(prev => ({ ...prev, [fileType]: selectedFile }));
      // Also ensure standard boolean flag is true
      if (fileType === 'tax_registration_file') setFormData(p => ({ ...p, has_tax_registration: true }));
      if (fileType === 'compliance_doc_file') setFormData(p => ({ ...p, has_compliance_doc: true }));
      if (fileType === 'company_registration_file') setFormData(p => ({ ...p, has_company_registration: true }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        payload.append(key, formData[key]);
      });

      if (files.tax_registration_file) payload.append('tax_registration_file', files.tax_registration_file);
      if (files.compliance_doc_file) payload.append('compliance_doc_file', files.compliance_doc_file);
      if (files.company_registration_file) payload.append('company_registration_file', files.company_registration_file);

      await onSubmitSubmission(payload, formData);
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
              New Vendor Submission Form
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Fill in vendor company details, banking information, and attach mandatory verification documents.
            </p>
          </div>

          <div className="badge badge-ai">
            <Sparkles size={14} /> Real-time Verification Engine
          </div>
        </div>

        {/* Preset scenario bar */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '10px' }}>
            ⚡ CASE STUDY PRESETS — Quick-fill form to test scenarios:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button type="button" className="btn btn-scenario" onClick={() => loadPreset('happy_path')}>
              ✅ TEST 1: Happy Path (Approved)
            </button>
            <button type="button" className="btn btn-scenario" onClick={() => loadPreset('missing_doc')}>
              ⚠️ TEST 2: Missing Document (Pending)
            </button>
            <button type="button" className="btn btn-scenario" onClick={() => loadPreset('name_mismatch')}>
              ⚠️ TEST 3: Bank Name Mismatch (Pending)
            </button>
            <button type="button" className="btn btn-scenario" onClick={() => loadPreset('invalid_tax')}>
              ❌ TEST 4: Invalid Tax ID (Rejected)
            </button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-rejected)', border: '1px solid var(--border-rejected)', color: 'var(--status-rejected)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertCircle size={20} />
          <div>
            <div style={{ fontWeight: 700 }}>Submission Error</div>
            <div style={{ fontSize: '0.85rem' }}>{errorMessage}</div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Section 1: Company & Contact Information */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#e0e7ff' }}>
            <Building size={18} color="#818cf8" /> Company & Contact Credentials
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            
            <div className="form-group">
              <label className="form-label">
                Company Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="company_name"
                className="form-input"
                placeholder="e.g. ABC Technologies Private Limited"
                value={formData.company_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Vendor Email Address <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="email"
                name="vendor_email"
                className="form-input"
                placeholder="e.g. contact@abctech.com"
                value={formData.vendor_email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Contact Person Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="contact_person"
                className="form-input"
                placeholder="e.g. Rahul Sharma"
                value={formData.contact_person}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Country of Incorporation <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                name="country"
                className="form-select"
                value={formData.country}
                onChange={handleInputChange}
                required
              >
                <option value="India">India (GSTIN Validation)</option>
                <option value="United States">United States (EIN Validation)</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Singapore">Singapore</option>
                <option value="Germany">Germany</option>
                <option value="Canada">Canada</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">
                Tax ID Number (GSTIN / EIN) <span style={{ color: '#ef4444' }}>*</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                  Format Validation Enforced (India format: 27AAAAA0000A1Z5)
                </span>
              </label>
              <input
                type="text"
                name="tax_id"
                className="form-input"
                style={{ fontFamily: 'var(--font-mono)' }}
                placeholder="e.g. 27AAAAA0000A1Z5"
                value={formData.tax_id}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">
                Registered Business Address <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                name="business_address"
                className="form-textarea"
                rows={2}
                placeholder="Full official registered office address..."
                value={formData.business_address}
                onChange={handleInputChange}
                required
              />
            </div>

          </div>
        </div>

        {/* Section 2: Banking Information */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#e0e7ff' }}>
            <CreditCard size={18} color="#38bdf8" /> Banking & Settlement Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">
                Bank Account Name <span style={{ color: '#ef4444' }}>*</span>
                <span style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 400 }}>
                  Will be validated against Company Name
                </span>
              </label>
              <input
                type="text"
                name="bank_account_name"
                className="form-input"
                placeholder="Exact name registered on vendor bank account..."
                value={formData.bank_account_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Bank Account Number <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="bank_account_number"
                className="form-input"
                style={{ fontFamily: 'var(--font-mono)' }}
                placeholder="e.g. 918273645019"
                value={formData.bank_account_number}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Bank Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="bank_name"
                className="form-input"
                placeholder="e.g. HDFC Bank / Chase Bank"
                value={formData.bank_name}
                onChange={handleInputChange}
                required
              />
            </div>

          </div>
        </div>

        {/* Section 3: Document Verification Uploads */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#e0e7ff' }}>
              <FileCheck size={18} color="#34d399" /> Mandatory Compliance Documents
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              (All 3 documents required for approval)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            
            {/* Tax Registration Document */}
            <div style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={16} color="#a5b4fc" /> Tax Registration Document
              </div>
              <label className="form-checkbox-card">
                <input
                  type="checkbox"
                  name="has_tax_registration"
                  checked={formData.has_tax_registration}
                  onChange={handleInputChange}
                />
                <span style={{ fontSize: '0.82rem' }}>Include Tax Certificate (Sample)</span>
              </label>
              <div className="file-upload-zone" onClick={() => document.getElementById('tax-file-input').click()}>
                <Upload size={20} color="#818cf8" style={{ margin: '0 auto 6px auto' }} />
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {files.tax_registration_file ? files.tax_registration_file.name : 'Or click to upload PDF/Doc file'}
                </div>
                <input
                  id="tax-file-input"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileChange(e, 'tax_registration_file')}
                />
              </div>
            </div>

            {/* Compliance Document */}
            <div style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={16} color="#a5b4fc" /> Compliance Document
              </div>
              <label className="form-checkbox-card">
                <input
                  type="checkbox"
                  name="has_compliance_doc"
                  checked={formData.has_compliance_doc}
                  onChange={handleInputChange}
                />
                <span style={{ fontSize: '0.82rem' }}>Include Compliance Agreement (Sample)</span>
              </label>
              <div className="file-upload-zone" onClick={() => document.getElementById('comp-file-input').click()}>
                <Upload size={20} color="#818cf8" style={{ margin: '0 auto 6px auto' }} />
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {files.compliance_doc_file ? files.compliance_doc_file.name : 'Or click to upload PDF/Doc file'}
                </div>
                <input
                  id="comp-file-input"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileChange(e, 'compliance_doc_file')}
                />
              </div>
            </div>

            {/* Company Registration Document */}
            <div style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={16} color="#a5b4fc" /> Company Registration Document
              </div>
              <label className="form-checkbox-card">
                <input
                  type="checkbox"
                  name="has_company_registration"
                  checked={formData.has_company_registration}
                  onChange={handleInputChange}
                />
                <span style={{ fontSize: '0.82rem' }}>Include Incorporation Certificate (Sample)</span>
              </label>
              <div className="file-upload-zone" onClick={() => document.getElementById('coi-file-input').click()}>
                <Upload size={20} color="#818cf8" style={{ margin: '0 auto 6px auto' }} />
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {files.company_registration_file ? files.company_registration_file.name : 'Or click to upload PDF/Doc file'}
                </div>
                <input
                  id="coi-file-input"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileChange(e, 'company_registration_file')}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Submit Action */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '10px' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }} disabled={submitting}>
            <Play size={18} />
            {submitting ? 'Running Verification Pipeline...' : 'Submit & Execute Onboarding Checks'}
          </button>
        </div>

      </form>
    </div>
  );
}
