import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Radio, PieChart, Settings, FileText, Zap } from 'lucide-react';

const Sidebar = () => {
  
  // Helper to define how links look (Active vs Inactive)
  const getNavLinkClass = ({ isActive }) => {
    return `relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group overflow-hidden ${
      isActive
        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/10 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)] border border-blue-500/20'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`;
  };

  return (
    // Note: We removed 'w-64' here because App.jsx controls the width now
    <div className="h-full glass flex flex-col shrink-0 border-r border-white/5">
      
      {/* Logo Area */}
      <div className="p-8 mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
            <Zap size={24} className="text-blue-400 fill-blue-400/20" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight leading-tight">
              FX AlgoBot
            </h2>
            <span className="text-[10px] text-blue-400 font-medium tracking-widest uppercase">
              Pro Terminal
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        
        <div className="px-4 mb-2 mt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Main Menu
        </div>

        <NavLink to="/" className={getNavLinkClass}>
          <LayoutDashboard size={20} />
          <span className="font-medium">Dashboard</span>
          {/* Active indicator dot */}
          <span className="absolute right-4 w-1.5 h-1.5 rounded-full bg-blue-400 opacity-0 group-[.active]:opacity-100 shadow-[0_0_8px_rgba(96,165,250,0.8)] transition-opacity" />
        </NavLink>

        <NavLink to="/signals" className={getNavLinkClass}>
          <Radio size={20} />
          <span className="font-medium">Signals</span>
        </NavLink>

        <NavLink to="/analytics" className={getNavLinkClass}>
          <PieChart size={20} />
          <span className="font-medium">Analytics</span>
        </NavLink>

        <div className="px-4 mb-2 mt-8 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          System
        </div>

        <NavLink to="/logs" className={getNavLinkClass}>
          <FileText size={20} />
          <span className="font-medium">System Logs</span>
        </NavLink>

        <NavLink to="/settings" className={getNavLinkClass}>
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </NavLink>
      </nav>
      
      {/* Footer Area */}
      <div className="p-6 mt-auto">
        <div className="glass rounded-xl p-4 bg-gradient-to-b from-white/5 to-transparent border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wide">System Online</span>
          </div>
          <div className="text-[10px] text-gray-500">
            v2.0.1 Stable • <span className="text-gray-400">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;