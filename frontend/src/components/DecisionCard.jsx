import React from 'react';
import { 
  CheckCircle2, Clock, XCircle, AlertTriangle, FileText, 
  Building, CreditCard, ShieldCheck, Sparkles, AlertCircle, Info 
} from 'lucide-react';

export default function DecisionCard({ runData }) {
  if (!runData) return null;

  const {
    run_id,
    company_name,
    vendor_email,
    contact_person,
    country,
    tax_id,
    bank_account_name,
    bank_account_number,
    bank_name,
    submitted_documents = [],
    decision,
    reasons = [],
    validation_checks = {},
    required_action,
    ai_insights,
    created_at
  } = runData;

  const getCardTheme = () => {
    switch (decision) {
      case 'APPROVED':
        return {
          gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
          borderColor: 'var(--border-approved)',
          badgeClass: 'badge-approved',
          icon: <CheckCircle2 size={36} color="var(--status-approved)" />,
          textColor: 'var(--status-approved)',
          title: 'VENDOR ONBOARDING APPROVED'
        };
      case 'PENDING':
        return {
          gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
          borderColor: 'var(--border-pending)',
          badgeClass: 'badge-pending',
          icon: <Clock size={36} color="var(--status-pending)" />,
          textColor: 'var(--status-pending)',
          title: 'VENDOR ONBOARDING PENDING ACTION'
        };
      case 'REJECTED':
        return {
          gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
          borderColor: 'var(--border-rejected)',
          badgeClass: 'badge-rejected',
          icon: <XCircle size={36} color="var(--status-rejected)" />,
          textColor: 'var(--status-rejected)',
          title: 'VENDOR ONBOARDING REJECTED'
        };
      default:
        return {
          gradient: 'rgba(15, 23, 42, 0.9)',
          borderColor: 'var(--border-color)',
          badgeClass: '',
          icon: <Info size={36} />,
          textColor: 'var(--text-main)',
          title: 'DECISION PROCESSED'
        };
    }
  };

  const theme = getCardTheme();

  return (
    <div className="glass-card" style={{ padding: '32px', background: theme.gradient, borderColor: theme.borderColor, boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4)' }}>
      
      {/* Prominent Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {theme.icon}
          <div>
            <span className={`badge ${theme.badgeClass}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
              {decision}
            </span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '6px 0 2px 0', letterSpacing: '-0.02em' }}>
              {company_name}
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Contact: {contact_person} ({vendor_email})
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Run Reference ID</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.95rem', color: '#a5b4fc' }}>
            {run_id}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dark)', marginTop: '2px' }}>
            {new Date(created_at).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Decision Summary & Reasons Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', margin: '24px 0' }}>
        
        {/* Left Column: Reasons & Mandatory Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e0e7ff', marginBottom: '10px' }}>
              Decision Summary & Evaluation Reasons
            </h4>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {reasons.map((r, i) => (
                  <li key={i} style={{ fontSize: '0.88rem', color: '#f3f4f6', lineHeight: '1.4' }}>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Required Action Box (When not approved) */}
          {required_action && (
            <div style={{ padding: '16px', borderRadius: '12px', background: decision === 'REJECTED' ? 'var(--bg-rejected)' : 'var(--bg-pending)', border: decision === 'REJECTED' ? '1px solid var(--border-rejected)' : '1px solid var(--border-pending)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem', color: decision === 'REJECTED' ? 'var(--status-rejected)' : 'var(--status-pending)', marginBottom: '4px' }}>
                <AlertTriangle size={18} /> Required Vendor / Admin Action
              </div>
              <div style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: 500 }}>
                {required_action}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Key Vendor Identifiers & Documents */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e0e7ff', marginBottom: '0' }}>
            Submitted Data Identifiers
          </h4>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Country</span>
              <strong style={{ color: '#f3f4f6' }}>{country}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Tax ID</span>
              <strong style={{ fontFamily: 'var(--font-mono)', color: '#a5b4fc' }}>{tax_id}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Bank Name</span>
              <strong style={{ color: '#f3f4f6' }}>{bank_name}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Bank Account Name</span>
              <strong style={{ color: '#f3f4f6' }}>{bank_account_name}</strong>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Submitted Verification Documents ({submitted_documents.length})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {submitted_documents.map((doc, idx) => (
                <div key={idx} style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '0.78rem', color: '#c7d2fe', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={14} /> {doc.label || doc.filename}
                </div>
              ))}
              {submitted_documents.length === 0 && (
                <div style={{ fontSize: '0.8rem', color: 'var(--status-pending)' }}>No documents submitted</div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Validation Checks Matrix Grid */}
      <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e0e7ff', marginBottom: '14px' }}>
          Detailed Validation Checks Performed
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          
          {Object.keys(validation_checks).map((key) => {
            const check = validation_checks[key];
            const isPassed = check.passed;
            return (
              <div 
                key={key}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: isPassed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                  border: isPassed ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f3f4f6' }}>
                    {check.label || key}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isPassed ? 'var(--status-approved)' : 'var(--status-rejected)' }}>
                    {isPassed ? 'PASS' : 'FAIL'}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.3' }}>
                  {check.message}
                </p>
              </div>
            );
          })}

        </div>
      </div>

      {/* Optional AI Risk Insights Callout */}
      {ai_insights && ai_insights.risk_summary && (
        <div style={{ marginTop: '20px', padding: '16px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.25)', display: 'flex', gap: '14px' }}>
          <Sparkles size={24} color="#c084fc" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e9d5ff', marginBottom: '2px' }}>
              AI Compliance Risk Analysis & Insights
            </div>
            <p style={{ fontSize: '0.82rem', color: '#d8b4fe', margin: 0, lineHeight: '1.4' }}>
              {ai_insights.risk_summary}
            </p>
            {ai_insights.recommendation && (
              <div style={{ fontSize: '0.78rem', color: '#c084fc', marginTop: '6px', fontWeight: 600 }}>
                Recommendation: {ai_insights.recommendation}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
