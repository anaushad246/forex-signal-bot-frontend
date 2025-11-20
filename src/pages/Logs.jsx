import React, { useState, useEffect } from 'react';
import { fetchLogs } from '../services/signalService';

// A simple loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Helper to style log levels
const getLogLevelClass = (level) => {
  if (level === 'ERROR') return 'text-red-400';
  if (level === 'WARN') return 'text-yellow-400';
  if (level === 'INFO') return 'text-blue-400';
  if (level === 'SUCCESS') return 'text-green-400';
  return 'text-gray-400'; // for 'DEBUG' or other
};

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logs when the component mounts
  useEffect(() => {
    const loadLogs = async () => {
      try {
        setIsLoading(true);
        const logsData = await fetchLogs();
        // We reverse the logs to show the newest ones at the top
        setLogs(logsData.reverse() || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch logs');
      } finally {
        setIsLoading(false);
      }
    };

    loadLogs();
  }, []); // Empty dependency array means this runs once on mount

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return (
        <div className="bg-red-800 border border-red-600 text-white p-4 rounded-lg">
          <strong>Error:</strong> Failed to load system logs.
          <p>{error}</p>
        </div>
      );
    }

    if (!logs || logs.length === 0) {
      return (
        <div className="text-center text-gray-400 py-12">
          No log entries found.
        </div>
      );
    }

    // This is the main log display
    return (
      <div className="font-mono text-sm">
        {logs.map((log) => (
          <div key={log._id} className="border-b border-gray-700 py-2 flex">
            {/* Timestamp */}
            <span className="text-gray-500 mr-4">
              {new Date(log.timestamp).toLocaleString()}
            </span>
            {/* Log Level */}
            <span className={`font-bold w-20 ${getLogLevelClass(log.level)}`}>
              [{log.source || 'SYSTEM'} {log.level}]
            </span>
            {/* Message */}
            <span className="text-gray-200">{log.message}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">System Logs</h1>
        <button
          onClick={() => {
            // Re-run the fetch
            setLogs([]); // Clear logs to show loading
            setError(null);
            setIsLoading(true);
            fetchLogs()
              .then(data => setLogs(data.reverse() || []))
              .catch(err => setError(err.message || 'Failed to fetch logs'))
              .finally(() => setIsLoading(false));
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh Logs'}
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default Logs;