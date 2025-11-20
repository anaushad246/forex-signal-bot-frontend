import api from './api';

/**
 * Fetches all signals from the database.
 * This will be used for the 'Signal History' page.
 * (Corresponds to your backend's GET /api/v1/signals)
 */
export const fetchAllSignals = async () => {
  try {
    const response = await api.get('/signals');
    return response.data.data; // Assuming your API returns data in { data: [...] }
  } catch (error) {
    console.error('Error fetching all signals:', error);
    throw error; // Re-throw to be handled by the component
  }
};

/**
 * Fetches the latest signal for each pair.
 * This will be used for the 'Live Dashboard'.
 * (You may need to create this endpoint in your Node.js backend)
 */
export const fetchLatestSignals = async () => {
  try {
    // NOTE: You'll need to create this endpoint.
    // If it doesn't exist, we can use fetchAllSignals() for now.
    const response = await api.get('/signals/latest'); 
    return response.data.data;
  } catch (error) {
    console.error('Error fetching latest signals:', error);
    throw error;
  }
};

/**
 * Fetches the system status (e.g., backend online status).
 * (You will need to create this endpoint: GET /api/v1/status)
 */
export const getSystemStatus = async () => {
  try {
    // This endpoint should return { python: 'online', node: 'online' }
    const response = await api.get('/system-status');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching system status:', error);
    throw error;
  }
};

/**
 * Fetches real-time logs.
 * (You will need to create this endpoint: GET /api/v1/logs)
 */
export const fetchLogs = async () => {
  try {
    const response = await api.get('/logs');
    return response.data.data; // Assuming { logs: [...] }
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw error;
  }
};


// ... (inside src/services/signalService.js, after your other functions)

/**
 * Fetches the current application settings.
 * (You will need to create this endpoint: GET /api/v1/settings)
 */
export const getSettings = async () => {
  try {
    const response = await api.get('/settings');
    // Assuming API returns { status: 'success', data: { settings } }
    return response.data.data; 
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

/**
 * Updates the application settings.
 * (You will need to create this endpoint: POST /api/v1/settings)
 */
export const updateSettings = async (settingsData) => {
  try {
    const response = await api.post('/settings', settingsData);
    // Assuming API returns { status: 'success', data: { updatedSettings } }
    return response.data.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};
// You can add more functions here as needed, e.g.:
// export const updateSettings = (settings) => api.post('/settings', settings);
// export const testTelegramSend = (signal) => api.post('/telegram/test-send', signal);