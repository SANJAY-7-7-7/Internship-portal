// Centralized API client helper
const rawEnvUrl = (import.meta.env.VITE_API_URL || '').trim();

// Normalize base URL: strip trailing slashes and prevent duplicate /api if already provided
const API_BASE_URL = rawEnvUrl
  .replace(/\/+$/, '')
  .replace(/\/api$/, '');

export { API_BASE_URL };

/**
 * Generic fetch wrapper with normalized URL construction, JSON header management,
 * and robust error handling.
 */
async function request(endpoint, options = {}) {
  // Ensure endpoint starts with '/' and retains '/api' prefix
  let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!cleanEndpoint.startsWith('/api')) {
    cleanEndpoint = `/api${cleanEndpoint}`;
  }

  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const config = {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, config);

    let parsedData = null;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      parsedData = await response.json();
    } else {
      const rawText = await response.text();
      parsedData = { message: rawText };
    }

    if (!response.ok) {
      const errorMsg =
        parsedData?.error ||
        parsedData?.message ||
        `Request failed with status code ${response.status}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = parsedData;
      throw error;
    }

    return parsedData;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.toLowerCase().includes('fetch')) {
      throw new Error(
        'Unable to reach the server. Please check your network connection or verify that the backend service is running.'
      );
    }
    throw err;
  }
}

// API methods
export const getInternships = () => request('/api/internships');

export const getInternshipById = (id) =>
  request(`/api/internships/${encodeURIComponent(id)}`);

export const submitApplication = (payload) =>
  request('/api/applications', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getApplications = () => request('/api/applications');

export const getHealthStatus = () => request('/api/health');
