import React, { useState } from 'react';
import { Settings, Shield, Lock, Bell, Database, Save, AlertTriangle } from 'lucide-react';

const SuperSettings = () => {
  const [activeTab, setActiveTab] = useState('platform');

  const tabs = [
    { id: 'platform', label: 'Platform Settings', icon: Settings },
    { id: 'security', label: 'Security & Auth', icon: Shield },
    { id: 'database', label: 'Database & Sync', icon: Database },
    { id: 'notifications', label: 'Alerts', icon: Bell },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-2xl font-heading font-black text-indigo-900 tracking-tight">System Configuration</h1>
        <p className="text-sm text-gray-500 mt-1">Global platform parameters and security overrides.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="w-full lg:w-64 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-indigo-600 shadow-sm border border-[#F0EEF8]' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="flex-1">
          <div className="card space-y-8">
            {activeTab === 'platform' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900">General Parameters</h3>
                  <p className="text-xs text-gray-500 mt-1 text-primary font-black uppercase tracking-widest">Environment: Production (v1.0.4)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#6B7280]">Platform Name</label>
                    <input className="input-field" defaultValue="Tricity Verified CRM Engine" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#6B7280]">Support Email</label>
                    <input className="input-field" defaultValue="support@Tricity Verified.io" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#6B7280]">Default Trial Days</label>
                    <input type="number" className="input-field" defaultValue="14" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#6B7280]">Plan Code Prefix</label>
                    <input className="input-field" defaultValue="LF-2025" />
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                   <AlertTriangle className="text-amber-500 flex-shrink-0" size={24} />
                   <div>
                      <p className="text-sm font-bold text-amber-900">Maintenance Mode</p>
                      <p className="text-xs text-amber-700 mt-0.5">Enabling this will block all tenant access except for Super Admins. Use with caution.</p>
                      <button className="mt-3 px-4 py-1.5 bg-amber-200 text-amber-900 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-amber-300">Enable Maintenance</button>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900">Global Security Overrides</h3>
                </div>
                
                <div className="space-y-4">
                   <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-10 h-6 bg-emerald-500 rounded-full relative flex items-center px-1">
                         <div className="w-4 h-4 bg-white rounded-full shadow-sm translate-x-4" />
                      </div>
                      <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600">Force Multi-Factor Authentication (MFA)</span>
                   </label>
                   <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-10 h-6 bg-gray-200 rounded-full relative flex items-center px-1">
                         <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                      <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600">Allow Admin Self-Provisioning</span>
                   </label>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-[#6B7280]">JWT Expiration Policy</label>
                  <select className="input-field h-10 w-full">
                    <option>8 Hours (Business Session)</option>
                    <option>24 Hours (Conservative)</option>
                    <option>7 Days (Persistent)</option>
                  </select>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button className="btn-primary h-12 px-8 flex items-center gap-2 shadow-xl shadow-indigo-200">
                <Save size={18} /> Persist Global State
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperSettings;

