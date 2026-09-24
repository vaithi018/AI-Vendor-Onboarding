import React from 'react';
import { 
  CheckCircle2, Clock, XCircle, ArrowRight, Play, Shield, 
  FileText, Building, CreditCard, ChevronRight, Zap, RefreshCw 
} from 'lucide-react';

export default function DashboardOverview({ 
  runs, 
  setActiveTab, 
  onSelectScenario,
  onViewRunDetails,
  loadingRuns,
  refreshRuns 
}) {
  const total = runs.length;
  const approved = runs.filter(r => r.decision === 'APPROVED').length;
  const pending = runs.filter(r => r.decision === 'PENDING').length;
  const rejected = runs.filter(r => r.decision === 'REJECTED').length;

  const testScenarios = [
    {
      id: 1,
      title: "TEST 1 — Happy Path",
      expected: "APPROVED",
      badgeClass: "badge-approved",
      company: "ABC Technologies Private Limited",
      description: "Matching bank name, valid Indian GSTIN format, all documents provided.",
      presetKey: "happy_path"
    },
    {
      id: 2,
      title: "TEST 2 — Missing Document",
      expected: "PENDING",
      badgeClass: "badge-pending",
      company: "Bright Solutions Private Limited",
      description: "Valid fields and Tax ID, but Compliance document is missing.",
      presetKey: "missing_doc"
    },
    {
      id: 3,
      title: "TEST 3 — Bank Name Mismatch",
      expected: "PENDING",
      badgeClass: "badge-pending",
      company: "Nova Technologies vs XYZ Enterprises",
      description: "Company name and bank account name do not match.",
      presetKey: "name_mismatch"
    },
    {
      id: 4,
      title: "TEST 4 — Invalid Tax ID",
      expected: "REJECTED",
      badgeClass: "badge-rejected",
      company: "Delta Systems Private Limited",
      description: "Invalid GSTIN format Tax ID provided.",
      presetKey: "invalid_tax"
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span className="badge badge-ai" style={{ marginBottom: '10px' }}>
              <Zap size={14} /> Case Study Demo Application
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '6px 0 10px 0' }}>
              Automated Vendor Verification Engine
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '680px', fontSize: '0.95rem' }}>
              Submits vendor credentials, validates mandatory fields and required compliance documents, verifies Tax ID formats, compares Bank Account vs Company names, and outputs a deterministic decision.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={refreshRuns} disabled={loadingRuns}>
              <RefreshCw size={16} className={loadingRuns ? 'pulsing-step' : ''} />
              Refresh Runs
            </button>
            <button className="btn btn-primary" onClick={() => setActiveTab('submit')}>
              <Play size={16} />
              Start New Submission
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Submissions</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={20} color="#a5b4fc" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{total}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Persisted in SQLite database</div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--status-approved)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Approved</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--bg-approved)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={20} color="var(--status-approved)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-approved)' }}>{approved}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {total > 0 ? `${Math.round((approved / total) * 100)}% approval rate` : '0% approval rate'}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--status-pending)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Verification</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--bg-pending)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} color="var(--status-pending)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-pending)' }}>{pending}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Requires document/name action</div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--status-rejected)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Rejected</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--bg-rejected)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <XCircle size={20} color="var(--status-rejected)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--status-rejected)' }}>{rejected}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Invalid tax ID format</div>
        </div>

      </div>

      {/* Test Scenarios Quick Launcher */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
              ⚡ 4 Case-Study Test Scenarios (1-Click Test Launcher)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Click any scenario to pre-fill the form and test the automated verification pipeline live.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '16px' }}>
          {testScenarios.map((sc) => (
            <div 
              key={sc.id}
              className="glass-card glass-card-hover"
              style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px', cursor: 'pointer', background: 'rgba(15, 23, 42, 0.6)' }}
              onClick={() => onSelectScenario(sc.presetKey)}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#e0e7ff' }}>{sc.title}</span>
                  <span className={`badge ${sc.badgeClass}`}>{sc.expected}</span>
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                  {sc.company}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {sc.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#818cf8', fontWeight: 600 }}>
                Run Scenario <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent History Table Preview */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
            Recent Verification Runs
          </h3>
          <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem' }} onClick={() => setActiveTab('history')}>
            View Full History <ChevronRight size={16} />
          </button>
        </div>

        {runs.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No verification runs recorded yet. Start by submitting a vendor!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Run ID</th>
                  <th>Vendor Name</th>
                  <th>Date / Time</th>
                  <th>Decision</th>
                  <th>Primary Reason</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {runs.slice(0, 5).map((run) => (
                  <tr key={run.run_id} onClick={() => onViewRunDetails(run.run_id)}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 600, color: '#a5b4fc' }}>
                      {run.run_id}
                    </td>
                    <td style={{ fontWeight: 600 }}>{run.company_name}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {new Date(run.created_at).toLocaleString()}
                    </td>
                    <td>
                      <span className={`badge badge-${run.decision.toLowerCase()}`}>
                        {run.decision}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {run.reasons?.[0] || 'Verification complete.'}
                    </td>
                    <td>
                      <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
