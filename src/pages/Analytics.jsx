import React, { useMemo } from 'react';
import { useSignals } from '../context/SignalContext';
import { motion } from 'framer-motion'; // 1. Import Motion
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

// Loading Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Professional Color Palette
const COLORS = {
  tp: '#10b981', // Emerald 500
  sl: '#f43f5e', // Rose 500
  pending: '#eab308', // Yellow 500
  grid: '#374151', // Gray 700
  text: '#9ca3af'  // Gray 400
};

// Custom Tooltip for Recharts (Glassmorphism style)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-3 rounded-lg border border-white/10 shadow-xl backdrop-blur-xl bg-gray-900/80">
        <p className="text-gray-200 font-bold text-sm mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-xs font-mono font-medium">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const { allSignals, isLoading, error } = useSignals();

  // --- Data Processing ---
  const analyticsData = useMemo(() => {
    const data = allSignals || [];
    const results = { 'Hit TP': 0, 'Hit SL': 0, 'Pending': 0 };
    let totalTrades = 0;
    
    data.forEach(signal => {
      const status = signal.status || 'Pending';
      if (status in results) results[status]++;
      if (status !== 'Pending') totalTrades++;
    });

    const pieData = Object.entries(results)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));

    const winRate = totalTrades > 0 ? ((results['Hit TP'] / totalTrades) * 100).toFixed(1) : 0;

    // Pair Stats
    const pairStats = {};
    data.forEach(signal => {
      if (!pairStats[signal.pair]) pairStats[signal.pair] = { name: signal.pair, wins: 0, losses: 0, total: 0 };
      if (signal.status === 'Hit TP') pairStats[signal.pair].wins++;
      else if (signal.status === 'Hit SL') pairStats[signal.pair].losses++;
      if (signal.status !== 'Pending') pairStats[signal.pair].total++;
    });

    const barData = Object.values(pairStats).map(pair => ({
      ...pair,
      winRate: pair.total > 0 ? ((pair.wins / pair.total) * 100).toFixed(1) : 0
    }));

    return { pieData, barData, totalTrades, winRate };
  }, [allSignals]);

  // --- Render States ---
  if (isLoading) return <div className="p-6"><LoadingSpinner /></div>;
  if (error) return <div className="p-6 text-red-400">Error loading analytics: {error}</div>;

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold text-white mb-8"
      >
        Performance Analytics
      </motion.h1>
      
      {!allSignals || allSignals.length === 0 ? (
        <div className="glass p-12 text-center text-gray-400 rounded-2xl border-dashed border-2 border-gray-700">
          No trading data available yet.
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* --- KPI Cards --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Signals" value={allSignals.length} />
            <StatCard title="Completed Trades" value={analyticsData.totalTrades} />
            <StatCard 
              title="Win Rate" 
              value={`${analyticsData.winRate}%`} 
              color={analyticsData.winRate >= 50 ? "text-emerald-400" : "text-rose-400"} 
            />
          </div>

          {/* --- Charts Grid --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Pie Chart */}
            <motion.div variants={itemVariants} className="glass p-6 rounded-2xl border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-5 bg-purple-500 rounded-full"></span>
                Overall Performance
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={analyticsData.pieData}
                      cx="50%" cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {analyticsData.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === 'Hit TP' ? COLORS.tp : entry.name === 'Hit SL' ? COLORS.sl : COLORS.pending} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Bar Chart */}
            <motion.div variants={itemVariants} className="glass p-6 rounded-2xl border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                 <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
                 Performance per Pair
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer>
                  <BarChart data={analyticsData.barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} opacity={0.3} />
                    <XAxis dataKey="name" stroke={COLORS.text} tick={{fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke={COLORS.text} tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    <Bar dataKey="wins" name="Wins" fill={COLORS.tp} radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="losses" name="Losses" fill={COLORS.sl} radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </div>
  );
};

// Helper Component for KPI Cards with Hover Effect
const StatCard = ({ title, value, color = "text-white" }) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 }
    }}
    className="glass p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
  >
    <div className="relative z-10">
      <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{title}</h4>
      <p className={`text-4xl font-black ${color} tracking-tight`}>{value}</p>
    </div>
    {/* Decorative Glow in background that appears on hover */}
    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors duration-500"></div>
  </motion.div>
);

export default Analytics;