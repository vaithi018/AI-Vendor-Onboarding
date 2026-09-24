import React, { useState, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';
import DecisionCard from './DecisionCard';
import { fetchRunDetails } from '../services/api';

export default function RunDetailModal({ runId, onClose }) {
  const [runData, setRunData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!runId) return;

    setLoading(true);
    setError('');

    fetchRunDetails(runId)
      .then(data => {
        setRunData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load run details');
        setLoading(false);
      });
  }, [runId]);

  if (!runId) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }} onClick={onClose}>
      
      <div 
        style={{
          width: '100%',
          maxWidth: '960px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-color)',
            color: '#ffffff',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {loading ? (
          <div className="glass-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <RefreshCw size={28} className="pulsing-step" style={{ margin: '0 auto 12px auto' }} />
            Loading complete run details for {runId}...
          </div>
        ) : error ? (
          <div className="glass-card" style={{ padding: '40px', color: 'var(--status-rejected)', textAlign: 'center' }}>
            {error}
          </div>
        ) : (
          <DecisionCard runData={runData} />
        )}
      </div>

    </div>
  );
}
