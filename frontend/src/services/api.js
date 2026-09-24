const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const checkHealth = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    console.error('API Health check error:', err);
    return { status: 'down', openai_api_available: false };
  }
};

export const onboardVendor = async (formData) => {
  const res = await fetch(`${API_BASE_URL}/vendors/onboard`, {
    method: 'POST',
    body: formData, // Multipart form data
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Server error during submission' }));
    throw new Error(errorData.detail || 'Failed to submit vendor onboarding form');
  }
  
  return await res.json();
};

export const fetchRuns = async (decisionFilter = '', searchQuery = '') => {
  const params = new URLSearchParams();
  if (decisionFilter) params.append('decision', decisionFilter);
  if (searchQuery) params.append('search', searchQuery);

  const res = await fetch(`${API_BASE_URL}/runs?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch run history');
  }
  return await res.json();
};

export const fetchRunDetails = async (runId) => {
  const res = await fetch(`${API_BASE_URL}/runs/${runId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch details for run ${runId}`);
  }
  return await res.json();
};

export const deleteRun = async (runId) => {
  const res = await fetch(`${API_BASE_URL}/runs/${runId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Failed to delete run ${runId}`);
  }
  return await res.json();
};
