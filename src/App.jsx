import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Icons for the mobile toggle
import { Toaster } from 'react-hot-toast'; // Notification popup container

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Signals from './pages/Signals';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Logs from './pages/Logs';

function App() {
  // State to toggle sidebar on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f1115]">
      
      {/* 1. Toast Notification Container */}
      <Toaster position="top-right" toastOptions={{
        className: 'glass text-white',
        style: { background: '#1f2937', color: '#fff', border: '1px solid #374151' }
      }}/>

      {/* 2. Mobile Overlay (only visible on mobile when sidebar is open) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 3. Sidebar Container with Slide Animation */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar />
      </div>
      
      {/* 4. Main Content Area */}
      <div className="flex-1 flex flex-col relative w-full min-w-0">
        
        {/* Mobile Header (Hamburger Menu) */}
        <div className="md:hidden flex items-center justify-between p-4 glass border-b border-white/10">
             <span className="font-bold text-xl text-white tracking-tight">FX AlgoBot</span>
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-300 hover:text-white transition-colors">
                {isSidebarOpen ? <X size={24}/> : <Menu size={24}/>}
             </button>
        </div>

        {/* Desktop Navbar */}
        <div className="hidden md:block">
            <Navbar />
        </div>
        
        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/signals" element={<Signals />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/logs" element={<Logs />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;