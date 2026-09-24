import React from 'react';
import { ShieldCheck, Cpu, Clock, PlusCircle, LayoutDashboard, Sparkles, Activity } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, healthInfo }) {
  const isAiActive = healthInfo?.openai_api_available;

  return (
    <header className="glass-card" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)' }}>
            <ShieldCheck size={26} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
              <span className="text-gradient">AI Vendor Onboarding</span> & Verification
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Automated Compliance & Risk Verification Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('submit')}
            className={`btn ${activeTab === 'submit' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <PlusCircle size={16} />
            New Submission
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Clock size={16} />
            Run History
          </button>
        </nav>

        {/* System & AI Engine Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className={`badge ${isAiActive ? 'badge-ai' : 'badge-pending'}`} style={{ padding: '6px 14px', fontSize: '0.75rem' }}>
            {isAiActive ? <Sparkles size={14} /> : <Cpu size={14} />}
            {isAiActive ? 'AI Engine Active (OpenAI)' : 'Deterministic Rules Active'}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#9ca3af' }}>
            <Activity size={14} color="#10b981" />
            <span style={{ color: '#10b981', fontWeight: 600 }}>System Healthy</span>
          </div>
        </div>

      </div>
    </header>
  );
}
