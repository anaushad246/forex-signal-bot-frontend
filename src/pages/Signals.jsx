import React from 'react';
import { useSignals } from '../context/SignalContext';

// A simple loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Helper to get color class for signal type
const getTypeClass = (type) => {
  return type === 'BUY' ? 'text-green-400' : 'text-red-400';
};

// Helper to get color class for result
const getResultClass = (result) => {
  if (result === 'Hit TP') return 'text-green-400 font-medium';
  if (result === 'Hit SL') return 'text-red-400 font-medium';
  return 'text-yellow-300'; // For 'Pending'
};

const Signals = () => {
  // Get all signals data from our global context
  const { allSignals, isLoading, error } = useSignals();

  // 1. Handle Loading State
  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Signal History</h1>
        <LoadingSpinner />
      </div>
    );
  }

  // 2. Handle Error State
  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Signal History</h1>
        <div className="bg-red-800 border border-red-600 text-white p-4 rounded-lg">
          <strong>Error:</strong> Failed to load signal history.
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // 3. Handle Empty State
  const hasSignals = allSignals && allSignals.length > 0;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Signal History</h1>

      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full text-left text-sm text-gray-300">
          {/* Table Header */}
          <thead className="bg-gray-900 text-xs text-gray-400 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-3">Time</th>
              <th scope="col" className="px-6 py-3">Pair</th>
              <th scope="col" className="px-6 py-3">Signal</th>
              <th scope="col" className="px-6 py-3">Entry</th>
              <th scope="col" className="px-6 py-3">Take Profit</th>
              <th scope="col" className="px-6 py-3">Stop Loss</th>
              <th scope="col" className="px-6 py-3">Result</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-700">
            {hasSignals ? (
              allSignals.map((signal) => (
                <tr key={signal._id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(signal.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                    {signal.pair}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap font-bold ${getTypeClass(signal.type)}`}>
                    {signal.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{signal.entry}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{signal.tp}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{signal.sl}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${getResultClass(signal.status)}`}>
                    {signal.status || 'Pending'}
                  </td>
                </tr>
              ))
            ) : (
              /* This is the "No signals" row */
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                  No signals found in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Signals;