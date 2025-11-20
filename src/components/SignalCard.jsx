import React from 'react';
import { TrendingUp, TrendingDown, Clock, Activity, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const SignalCard = ({ signal, index }) => {
  const isBuy = signal.type === 'BUY';
  
  // Dynamic Theme based on signal type
  const theme = isBuy 
    ? { 
        border: 'border-emerald-500/30', 
        text: 'text-emerald-400', 
        bg: 'bg-emerald-500/10', 
        glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]', 
        blob: 'bg-emerald-500',
        gradient: 'from-emerald-500/20 to-transparent'
      } 
    : { 
        border: 'border-rose-500/30', 
        text: 'text-rose-400', 
        bg: 'bg-rose-500/10', 
        glow: 'shadow-[0_0_20px_rgba(244,63,94,0.15)]', 
        blob: 'bg-rose-500',
        gradient: 'from-rose-500/20 to-transparent'
      };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }} // Stagger effect using index
      className={`glass rounded-2xl p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 ${theme.glow}`}
    >
      
      {/* Animated Background Blob */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none ${theme.blob}`}
      />

      {/* Card Header */}
      <div className="flex justify-between items-start mb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-2xl font-black text-white tracking-wide">{signal.pair}</h3>
             {/* Live Pulse Dot */}
             <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isBuy ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isBuy ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock size={12} /> 
            <span>{new Date(signal.createdAt || Date.now()).toLocaleTimeString()}</span>
          </div>
        </div>
        
        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border backdrop-blur-md ${theme.bg} ${theme.text} ${theme.border}`}>
          {isBuy ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {signal.type}
        </span>
      </div>

      {/* Price Grid */}
      <div className="grid grid-cols-3 gap-2 mb-5 relative z-10">
        <PriceBox label="ENTRY" value={signal.entry} />
        <PriceBox 
            label="TP" 
            value={signal.tp} 
            color="text-emerald-400" 
            bg="bg-emerald-500/5" 
            border="border-emerald-500/20" 
        />
        <PriceBox 
            label="SL" 
            value={signal.sl} 
            color="text-rose-400" 
            bg="bg-rose-500/5" 
            border="border-rose-500/20" 
        />
      </div>

      {/* Footer Info */}
      <div className="relative z-10 pt-3 border-t border-white/5 flex justify-between items-center text-xs">
        <div className="flex items-center gap-1.5 text-gray-400 bg-white/5 px-2 py-1 rounded-md">
            <Activity size={12} /> 
            <span>{signal.strategy || 'Fibo Trend'}</span>
        </div>
        
        <div className={`flex items-center gap-1 font-medium ${signal.status === 'Pending' ? 'text-yellow-500' : 'text-gray-500'}`}>
            {signal.status || 'ACTIVE'}
            <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
        </div>
      </div>
    </motion.div>
  );
};

// Helper Component for the price boxes
const PriceBox = ({ label, value, color = "text-white", bg = "bg-white/5", border = "border-white/10" }) => (
    <div className={`p-2.5 rounded-xl border ${bg} ${border} transition-colors group-hover:bg-opacity-20`}>
        <span className={`text-[10px] uppercase tracking-wider font-bold opacity-60 block mb-0.5 ${color}`}>{label}</span>
        <div className={`font-mono font-bold text-sm ${color}`}>{value}</div>
    </div>
);

export default SignalCard;