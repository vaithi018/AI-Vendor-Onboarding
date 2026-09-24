import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Eye, Trash2, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function RunHistory({ 
  runs, 
  loading, 
  decisionFilter, 
  setDecisionFilter, 
  searchQuery, 
  setSearchQuery, 
  onViewDetails, 
  onDeleteRun,
  onRefresh 
}) {
  return (
    <div className="glass-card" style={{ padding: '28px' }}>
      
      {/* Table Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
            Audit Run History
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            SQLite persisted log of all automated vendor onboarding verification runs.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={onRefresh} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'pulsing-step' : ''} />
          Refresh Audit Trail
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        
        {/* Search Box */}
        <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '40px' }}
            placeholder="Search by Vendor Name, Tax ID, or Run ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Decision Filters */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          {['', 'APPROVED', 'PENDING', 'REJECTED'].map((filter) => (
            <button
              key={filter}
              onClick={() => setDecisionFilter(filter)}
              className={`btn ${decisionFilter === filter ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              {filter || 'ALL DECISIONS'}
            </button>
          ))}
        </div>

      </div>

      {/* History Table */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw size={24} className="pulsing-step" style={{ margin: '0 auto 10px auto' }} />
          Loading run history from database...
        </div>
      ) : runs.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No verification runs match your current filters.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Run ID</th>
                <th>Vendor Name</th>
                <th>Country</th>
                <th>Date / Time</th>
                <th>Decision</th>
                <th>Primary Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr key={run.run_id} onClick={() => onViewDetails(run.run_id)}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 600, color: '#a5b4fc' }}>
                    {run.run_id}
                  </td>
                  <td style={{ fontWeight: 600, color: '#f3f4f6' }}>{run.company_name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{run.country}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    {new Date(run.created_at).toLocaleString()}
                  </td>
                  <td>
                    <span className={`badge badge-${run.decision.toLowerCase()}`}>
                      {run.decision}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {run.reasons?.[0] || 'Verification complete.'}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                        onClick={() => onViewDetails(run.run_id)}
                      >
                        <Eye size={14} /> View
                      </button>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '4px 8px', fontSize: '0.78rem', color: '#ef4444' }}
                        onClick={() => onDeleteRun(run.run_id)}
                        title="Delete run record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
