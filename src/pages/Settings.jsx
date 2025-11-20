import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../services/signalService';
import { motion } from 'framer-motion';
import { Save, Sliders, MessageSquare, Activity, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast'; // Uses the toaster we added to App.jsx

// Loading Spinner
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const Settings = () => {
  const [settings, setSettings] = useState({
    trackedPairs: '',
    atrMultiplier: 2.5,
    schedulerInterval: '15m',
    telegramToken: '',
    telegramGroupId: '',
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Load Settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const currentSettings = await getSettings();
        setSettings({
          ...currentSettings,
          trackedPairs: currentSettings.trackedPairs.join(', '), // Add space for readability
        });
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  // 2. Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  // 3. Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const settingsToSave = {
        ...settings,
        trackedPairs: settings.trackedPairs.split(',').map(p => p.trim()).filter(Boolean),
        atrMultiplier: parseFloat(settings.atrMultiplier),
      };

      await updateSettings(settingsToSave);
      toast.success('Configuration saved successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-6"><LoadingSpinner /></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold text-white mb-8 flex items-center gap-3"
      >
        <Sliders className="text-blue-500" />
        System Configuration
      </motion.h1>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-8 border border-white/10 relative overflow-hidden"
      >
        {/* Decorative gradient blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section: Trading Strategy */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-2">
              <Activity size={18} className="text-emerald-400" />
              Trading Strategy
            </h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-400 mb-2 group-focus-within:text-blue-400 transition-colors">
                  Tracked Currency Pairs
                </label>
                <input
                  type="text"
                  name="trackedPairs"
                  value={settings.trackedPairs}
                  onChange={handleChange}
                  placeholder="XAUUSD, EURUSD, GBPUSD"
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple pairs with commas.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-400 mb-2 group-focus-within:text-blue-400 transition-colors">
                    ATR Multiplier (SL/TP)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="atrMultiplier"
                    value={settings.atrMultiplier}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
                
                <div className="group">
                  <label className="block text-sm font-medium text-gray-400 mb-2 group-focus-within:text-blue-400 transition-colors">
                    Scan Interval
                  </label>
                  <select
                    name="schedulerInterval"
                    value={settings.schedulerInterval}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="15m" className="bg-gray-800">15 Minutes</option>
                    <option value="30m" className="bg-gray-800">30 Minutes</option>
                    <option value="1h" className="bg-gray-800">1 Hour</option>
                    <option value="4h" className="bg-gray-800">4 Hours</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Telegram */}
          <div className="space-y-5 pt-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-2">
              <MessageSquare size={18} className="text-blue-400" />
              Telegram Integration
            </h3>
            
            <div className="space-y-5">
              <div className="group">
                <label className="block text-sm font-medium text-gray-400 mb-2 group-focus-within:text-blue-400 transition-colors">
                  Bot Token
                </label>
                <input
                  type="password"
                  name="telegramToken"
                  value={settings.telegramToken}
                  onChange={handleChange}
                  placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-600 font-mono text-sm"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-400 mb-2 group-focus-within:text-blue-400 transition-colors">
                  Chat / Channel ID
                </label>
                <input
                  type="text"
                  name="telegramGroupId"
                  value={settings.telegramGroupId}
                  onChange={handleChange}
                  placeholder="-100123456789"
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-600 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className={`
                flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0
                ${isSaving 
                  ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-blue-500/30'}
              `}
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
};

export default Settings;