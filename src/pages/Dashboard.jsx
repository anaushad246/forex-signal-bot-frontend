import React from 'react';
import { useSignals } from '../context/SignalContext';
import SystemStatus from '../components/SystemStatus';
import SignalCard from '../components/SignalCard';
import { motion } from 'framer-motion'; // Import Motion

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const Dashboard = () => {
  const { latestSignals, isLoading, error } = useSignals();

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Live Dashboard</h1>
        <SystemStatus />
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Live Dashboard</h1>
        <SystemStatus />
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl mt-6">
          <strong>Error:</strong> Failed to load data. {error}
        </div>
      </div>
    );
  }

  const hasSignals = latestSignals && latestSignals.length > 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold text-white mb-8"
      >
        Live Dashboard
      </motion.h1>

      <div className="mb-10">
        <SystemStatus />
      </div>

      <motion.h2 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-white mb-5 flex items-center gap-2"
      >
        <span className="w-1 h-6 bg-blue-500 rounded-full block"></span>
        Latest Signals
      </motion.h2>

      {hasSignals ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestSignals.map((signal, index) => (
            // PASSING THE INDEX HERE IS KEY FOR STAGGERED ANIMATION
            <SignalCard key={signal._id} signal={signal} index={index} />
          ))}
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-gray-400 text-lg">No active signals at the moment.</p>
          <p className="text-sm text-gray-600 mt-2">The bot is scanning the markets...</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;