import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, XCircle, AlertTriangle, Cpu, Sparkles, ArrowLeft, RefreshCw, FileText } from 'lucide-react';
import DecisionCard from './DecisionCard';

export default function LiveRunView({ runData, onReset }) {
  const [completedSteps, setCompletedSteps] = useState(0);

  const stepsList = [
    { id: 1, label: 'Submission Received & Parsed', key: 'submission' },
    { id: 2, label: 'Required Field Presence Check', key: 'required_fields' },
    { id: 3, label: 'Compliance & Tax Document Verification', key: 'documents' },
    { id: 4, label: 'Tax ID Format Check (GSTIN / EIN)', key: 'tax_id' },
    { id: 5, label: 'Company Name vs Bank Account Name Match', key: 'name_match' },
    { id: 6, label: 'Decision Engine Execution & Audit Record Creation', key: 'decision' }
  ];

  useEffect(() => {
    setCompletedSteps(0);
    const interval = setInterval(() => {
      setCompletedSteps(prev => {
        if (prev < stepsList.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 400); // Step every 400ms

    return () => clearInterval(interval);
  }, [runData]);

  const isPipelineComplete = completedSteps >= stepsList.length;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-secondary" onClick={onReset}>
          <ArrowLeft size={16} /> Submit Another Vendor
        </button>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#a5b4fc' }}>
          Run ID: {runData?.run_id}
        </span>
      </div>

      {/* Live Pipeline Tracker */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={20} color="#818cf8" /> Live Automated Verification Process
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Executing deterministic verification rules & AI analysis pipeline
            </p>
          </div>

          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: isPipelineComplete ? 'var(--status-approved)' : '#f59e0b' }}>
            {isPipelineComplete ? '✓ Pipeline Complete' : `Processing Step ${completedSteps + 1} of ${stepsList.length}...`}
          </div>
        </div>

        {/* Steps List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {stepsList.map((step, idx) => {
            const isDone = completedSteps > idx;
            const isCurrent = completedSteps === idx;
            const isPending = completedSteps < idx;

            return (
              <div 
                key={step.id} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: isCurrent ? 'rgba(99, 102, 241, 0.15)' : isDone ? 'rgba(15, 23, 42, 0.6)' : 'rgba(15, 23, 42, 0.3)',
                  border: isCurrent ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.82rem' }}>
                  {isDone ? (
                    <CheckCircle2 size={22} color="var(--status-approved)" />
                  ) : isCurrent ? (
                    <RefreshCw size={20} color="#818cf8" className="pulsing-step" />
                  ) : (
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4b5563' }} />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: isDone || isCurrent ? '#f3f4f6' : '#6b7280' }}>
                    {step.label}
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                  {isDone ? (
                    <span style={{ color: 'var(--status-approved)' }}>Completed</span>
                  ) : isCurrent ? (
                    <span style={{ color: '#818cf8' }}>Evaluating...</span>
                  ) : (
                    <span style={{ color: '#6b7280' }}>Waiting</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prominent Final Decision Card (Renders when steps finish) */}
      {isPipelineComplete && (
        <DecisionCard runData={runData} />
      )}

    </div>
  );
}
