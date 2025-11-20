import React from 'react';
import { useSignals } from '../context/SignalContext';
import { Server, Activity, Cpu } from 'lucide-react';

const StatusIndicator = ({ status, label, icon: Icon }) => {
  const isOnline = status === 'online';
  
  return (
    <div className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-xl border border-white/5">
      <div className={`p-2 rounded-lg ${isOnline ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
        <Icon size={18} />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
          <span className={`text-sm font-bold ${isOnline ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isOnline ? 'Operational' : 'Offline'}
          </span>
        </div>
      </div>
    </div>
  );
};

const SystemStatus = () => {
  const { systemStatus } = useSignals();

  return (
    <div className="glass p-1 rounded-2xl flex flex-col sm:flex-row gap-2 overflow-hidden">
      <div className="flex-1">
        <StatusIndicator 
          status={systemStatus?.node || 'offline'} 
          label="Node.js Engine" 
          icon={Server} 
        />
      </div>
      <div className="flex-1">
        <StatusIndicator 
          status={systemStatus?.python || 'offline'} 
          label="Python Logic" 
          icon={Cpu} 
        />
      </div>
      <div className="flex-1">
        <StatusIndicator 
          status="online" 
          label="Database" 
          icon={Activity} 
        />
      </div>
    </div>
  );
};

export default SystemStatus;