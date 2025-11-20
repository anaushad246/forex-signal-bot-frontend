import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  fetchAllSignals, 
  fetchLatestSignals, 
  getSystemStatus 
} from '../services/signalService';

// 1. Create the Context
const SignalContext = createContext();

// 2. Create a custom hook to make it easy to use the context
export const useSignals = () => {
  return useContext(SignalContext);
};

// 3. Create the Provider Component
export const SignalProvider = ({ children }) => {
  const [allSignals, setAllSignals] = useState([]);
  const [latestSignals, setLatestSignals] = useState([]);
  const [systemStatus, setSystemStatus] = useState({ node: 'offline', python: 'offline' });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch all data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [signalsData, latestData, statusData] = await Promise.all([
        fetchAllSignals(),
        fetchLatestSignals(),
        getSystemStatus()
      ]);

      setAllSignals(signalsData || []);
      setLatestSignals(latestData || []);
      setSystemStatus(statusData || { node: 'offline', python: 'offline' });

    } catch (err) {
      console.error("Error in SignalContext:", err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on initial component mount
  useEffect(() => {
    fetchData();

    // Optional: Set up auto-refresh polling
    const intervalId = setInterval(() => {
      fetchData(); // Refetch data every 15 minutes
    }, 15 * 60 * 1000); // 15 minutes

    // Clear interval on cleanup
    return () => clearInterval(intervalId);
  }, []);

  // 4. Define the value to be passed to consuming components
  const value = {
    allSignals,
    latestSignals,
    systemStatus,
    isLoading,
    error,
    refreshData: fetchData, // Expose a function to manually refresh
  };

  return (
    <SignalContext.Provider value={value}>
      {children}
    </SignalContext.Provider>
  );
};