import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardOverview from './components/DashboardOverview';
import VendorForm from './components/VendorForm';
import LiveRunView from './components/LiveRunView';
import RunHistory from './components/RunHistory';
import RunDetailModal from './components/RunDetailModal';

import { checkHealth, onboardVendor, fetchRuns, deleteRun } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [healthInfo, setHealthInfo] = useState({ status: 'checking', openai_api_available: false });
  const [runs, setRuns] = useState([]);
  const [loadingRuns, setLoadingRuns] = useState(false);

  // Filters for history
  const [decisionFilter, setDecisionFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Live run state
  const [currentRunData, setCurrentRunData] = useState(null);
  const [initialPreset, setInitialPreset] = useState(null);

  // Modal detail view state
  const [selectedRunIdModal, setSelectedRunIdModal] = useState(null);

  // Load health check on mount
  useEffect(() => {
    checkHealth().then(data => setHealthInfo(data));
    loadRuns();
  }, []);

  // Reload runs when filters change
  useEffect(() => {
    loadRuns();
  }, [decisionFilter, searchQuery]);

  const loadRuns = async () => {
    setLoadingRuns(true);
    try {
      const data = await fetchRuns(decisionFilter, searchQuery);
      setRuns(data);
    } catch (err) {
      console.error('Failed to load runs:', err);
    } finally {
      setLoadingRuns(false);
    }
  };

  const handleOpenNewSubmission = () => {
    setInitialPreset(null);
    setActiveTab('submit');
  };

  const handleSelectScenario = (presetKey) => {
    setInitialPreset(presetKey);
    setActiveTab('submit');
  };

  const handleSubmitVendor = async (formDataPayload) => {
    const result = await onboardVendor(formDataPayload);
    setCurrentRunData(result);
    setInitialPreset(null);
    setActiveTab('live');
    // Refresh run list in background
    loadRuns();
  };

  const handleDeleteRun = async (runId) => {
    if (window.confirm(`Are you sure you want to delete run '${runId}'?`)) {
      try {
        await deleteRun(runId);
        loadRuns();
      } catch (err) {
        alert(err.message || 'Failed to delete run');
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenNewSubmission={handleOpenNewSubmission}
        healthInfo={healthInfo} 
      />

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '32px 24px' }}>
        
        {activeTab === 'dashboard' && (
          <DashboardOverview
            runs={runs}
            setActiveTab={setActiveTab}
            onSelectScenario={handleSelectScenario}
            onViewRunDetails={(runId) => setSelectedRunIdModal(runId)}
            loadingRuns={loadingRuns}
            refreshRuns={loadRuns}
          />
        )}

        {activeTab === 'submit' && (
          <VendorForm
            onSubmitSubmission={handleSubmitVendor}
            initialPreset={initialPreset}
          />
        )}

        {activeTab === 'live' && (
          <LiveRunView
            runData={currentRunData}
            onReset={handleOpenNewSubmission}
          />
        )}

        {activeTab === 'history' && (
          <RunHistory
            runs={runs}
            loading={loadingRuns}
            decisionFilter={decisionFilter}
            setDecisionFilter={setDecisionFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onViewDetails={(runId) => setSelectedRunIdModal(runId)}
            onDeleteRun={handleDeleteRun}
            onRefresh={loadRuns}
          />
        )}

      </main>

      {/* Detail Modal */}
      {selectedRunIdModal && (
        <RunDetailModal
          runId={selectedRunIdModal}
          onClose={() => setSelectedRunIdModal(null)}
        />
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '20px 24px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(11, 15, 25, 0.8)' }}>
        AI Vendor Onboarding & Verification System • Built for Case Study Demonstration • Powered by FastAPI & React
      </footer>

    </div>
  );
}
