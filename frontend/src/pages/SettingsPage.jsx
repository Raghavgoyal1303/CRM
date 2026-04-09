import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Settings, 
  Link as LinkIcon, 
  Camera,
  Eye,
  EyeOff,
  Copy,
  Info,
  CheckCircle2,
  Save,
  Zap,
  Globe,
  ShieldCheck,
  RefreshCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { settingsApi } from '../api';
import axios from 'axios';
import CommunicationSettings from './admin/CommunicationSettings';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [companySettings, setCompanySettings] = useState({
    name: '',
    email: '',
    auto_assignment: 0,
    exotel_key: '',
    exotel_token: '',
    exotel_sid: ''
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await settingsApi.getSettings();
      setCompanySettings(res.data);
    } catch (err) {
      console.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await settingsApi.updateSettings(companySettings);
      setMessage('Settings updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Company Profile', icon: Globe },
    { id: 'team', label: 'Team Governance', icon: Settings },
    { id: 'communication', label: 'Telephony (Exotel)', icon: LinkIcon },
    { id: 'outbound', label: 'Outbound Strategy', icon: Zap },
    { id: 'security', label: 'Access Control', icon: ShieldCheck },
  ];

  if (loading) {
    return <div className="p-20 text-center text-gray-400 font-bold animate-pulse">Establishing secure connection to core settings...</div>;
  }

  return (
    <div className="flex gap-10 animate-in fade-in duration-500 pb-20">
      {/* Sidebar Tabs */}
      <div className="w-[280px] shrink-0 space-y-2 pt-2">
        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-4">System Architecture</h2>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group ${
              activeTab === tab.id 
                ? 'bg-white shadow-xl shadow-indigo-900/5 border border-indigo-100 text-indigo-900 font-black' 
                : 'text-gray-400 hover:bg-white/50 hover:text-indigo-600'
            }`}
          >
            <div className="flex items-center gap-4">
               <tab.icon size={20} className={activeTab === tab.id ? 'text-indigo-600' : 'text-gray-300 group-hover:text-indigo-400'} />
               <span className="text-sm tracking-tight">{tab.label}</span>
            </div>
            {activeTab === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
          </button>
        ))}
      </div>

      {/* Content Panel */}
      <div className="flex-1 max-w-4xl">
        {message && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-in slide-in-from-top-4">
             <CheckCircle2 size={18} /> {message}
          </div>
        )}

        <div className="card !p-10 shadow-2xl shadow-indigo-900/[0.03]">
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateSettings} className="space-y-10">
              <div className="flex items-center gap-8">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-3xl bg-indigo-50 border-4 border-white shadow-xl flex items-center justify-center text-indigo-600 font-heading font-black text-3xl group-hover:bg-indigo-600 group-hover:text-white transition-all cursor-pointer">
                    {companySettings.name?.charAt(0) || user?.name.charAt(0)}
                  </div>
                  <button type="button" className="absolute -bottom-2 -right-2 p-3 bg-white text-indigo-600 rounded-2xl border border-[#F0EEF8] shadow-lg hover:scale-110 transition-transform">
                    <Camera size={18} />
                  </button>
                </div>
                <div>
                   <h3 className="text-2xl font-heading font-black text-indigo-900 tracking-tight">{companySettings.name}</h3>
                   <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest mt-1">Tenant Authority Node</p>
                   <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Protocol Active
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-2 focus-within:text-indigo-600 transition-colors">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Company Entity Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-[20px] px-5 py-4 text-sm font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={companySettings.name}
                    onChange={e => setCompanySettings({...companySettings, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2 focus-within:text-indigo-600 transition-colors">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Support Endpoint Email</label>
                  <input 
                    type="email" 
                    className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-[20px] px-5 py-4 text-sm font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={companySettings.email}
                    onChange={e => setCompanySettings({...companySettings, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                 <button 
                  type="submit" 
                  disabled={saving}
                  className="btn-primary h-12 px-10 rounded-2xl flex items-center gap-3 shadow-lg shadow-indigo-100 font-black text-xs uppercase tracking-widest"
                 >
                    {saving ? <RefreshCcw size={18} className="animate-spin" /> : <Save size={18} />}
                    Apply Profile Updates
                 </button>
              </div>
            </form>
          )}

          {activeTab === 'team' && (
            <div className="space-y-10">
               <div>
                  <h3 className="text-xl font-heading font-black text-indigo-900 mb-2">Team Governance</h3>
                  <p className="text-sm text-gray-400 font-medium">Configure lead distribution logic and operative access protocols.</p>
               </div>

               <div className="space-y-4">
                  <div className="p-6 bg-[#F9F7F4] rounded-[28px] border border-[#F0EEF8] flex items-center justify-between group hover:border-indigo-200 transition-all">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600">
                           <RefreshCcw size={22} />
                        </div>
                        <div>
                           <div className="text-sm font-black text-indigo-900 uppercase tracking-tight">Auto-assignment (Round Robin)</div>
                           <p className="text-[11px] text-gray-400 mt-0.5">Automatically rotate leads between active operatives.</p>
                        </div>
                     </div>
                     <button 
                      onClick={() => setCompanySettings({...companySettings, auto_assignment: companySettings.auto_assignment ? 0 : 1})}
                      className={`w-14 h-7 rounded-full relative transition-all duration-300 ${companySettings.auto_assignment ? 'bg-indigo-600 shadow-lg shadow-indigo-100' : 'bg-gray-200'}`}
                     >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${companySettings.auto_assignment ? 'right-1' : 'left-1'}`} />
                     </button>
                  </div>

                  <div className="p-6 bg-[#F9F7F4] rounded-[28px] border border-[#F0EEF8] flex items-center justify-between group hover:border-indigo-200 transition-all">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600">
                           <Zap size={22} />
                        </div>
                        <div>
                           <div className="text-sm font-black text-indigo-900 uppercase tracking-tight">Priority Escalation</div>
                           <p className="text-[11px] text-gray-400 mt-0.5">Mark leads as "High Interest" if they call multiple times.</p>
                        </div>
                     </div>
                     <button className="w-14 h-7 rounded-full bg-indigo-600 relative p-1 shadow-lg shadow-indigo-100">
                        <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm" />
                     </button>
                  </div>
               </div>

               <div className="flex justify-end pt-6">
                 <button 
                  onClick={handleUpdateSettings}
                  disabled={saving}
                  className="btn-primary h-12 px-10 rounded-2xl flex items-center gap-3 shadow-lg shadow-indigo-100 font-black text-xs uppercase tracking-widest"
                 >
                    {saving ? <RefreshCcw size={18} className="animate-spin" /> : <Save size={18} />}
                    Commit Logic Shift
                 </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-10">
               <div>
                  <h3 className="text-xl font-heading font-black text-indigo-900 mb-2">Access Control</h3>
                  <p className="text-sm text-gray-400 font-medium">Rotate access credentials regularly for maximum system integrity.</p>
               </div>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Access Cipher</label>
                     <input type="password" placeholder="••••••••" className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-[20px] px-5 py-4 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New System Cipher</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-[20px] px-5 py-4 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Cipher Shift</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-[20px] px-5 py-4 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                  </div>
               </div>

               <div className="flex justify-end pt-6">
                 <button className="btn-primary h-12 px-10 rounded-2xl flex items-center gap-3 shadow-lg shadow-indigo-100 font-black text-xs uppercase tracking-widest">
                    <Lock size={18} />
                    Rotate System Credentials
                 </button>
              </div>
            </div>
          )}

          {activeTab === 'communication' && (
            <div className="space-y-10">
               <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-heading font-black text-indigo-900 mb-2">Telephony Gateway Bridge</h3>
                    <p className="text-sm text-gray-400 font-medium">Configure encrypted voice intercept gateways for incoming/outgoing leads.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={() => setCompanySettings({...companySettings, telephony_provider: 'exotel'})}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black border tracking-widest transition-all ${companySettings.telephony_provider === 'exotel' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-400 border-gray-200'}`}
                    >
                      EXOTEL
                    </button>
                    <button 
                      type="button"
                      onClick={() => setCompanySettings({...companySettings, telephony_provider: 'acefone'})}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black border tracking-widest transition-all ${companySettings.telephony_provider === 'acefone' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-400 border-gray-200'}`}
                    >
                      ACEFONE (IN)
                    </button>
                  </div>
               </div>

               {companySettings.telephony_provider === 'acefone' ? (
                 <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Acefone API Token</label>
                        <input 
                          type="password" 
                          placeholder="eyJhbGci..."
                          className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-[20px] px-5 py-4 text-xs font-mono font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                          value={companySettings.acefone_api_key}
                          onChange={e => setCompanySettings({...companySettings, acefone_api_key: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Company Access ID (Optional)</label>
                        <input 
                          type="password" 
                          placeholder="Optional"
                          className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-[20px] px-5 py-4 text-xs font-mono font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                          value={companySettings.acefone_api_token}
                          onChange={e => setCompanySettings({...companySettings, acefone_api_token: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Acefone Webhook Transmission Endpoint</label>
                      <div className="flex gap-3">
                         <input 
                          readOnly 
                          value={`${import.meta.env.VITE_API_BASE_URL || window.location.origin}/api/webhook/telephony/acefone/${user.company_id}`} 
                          className="flex-1 bg-white border border-[#F0EEF8] rounded-xl px-4 py-3 text-xs font-mono text-gray-400 italic" 
                         />
                         <button 
                          type="button"
                          onClick={() => navigator.clipboard.writeText(`${import.meta.env.VITE_API_BASE_URL || window.location.origin}/api/webhook/telephony/acefone/${user.company_id}`)}
                          className="p-3 bg-white border border-[#F0EEF8] rounded-xl text-gray-400 hover:text-indigo-600 transition-colors"
                         >
                            <Copy size={18} />
                         </button>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold px-2 mt-2 leading-relaxed">
                         Configure this URL in your Acefone.in portal (Services &gt; Webhook) to automate lead capture and fair agent assignment.
                      </p>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Exotel API Key</label>
                        <input 
                          type="password" 
                          placeholder="sk_test_..."
                          className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-[20px] px-5 py-4 text-xs font-mono font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                          value={companySettings.exotel_key}
                          onChange={e => setCompanySettings({...companySettings, exotel_key: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Exotel Token</label>
                        <input 
                          type="password" 
                          placeholder="tk_test_..."
                          className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-[20px] px-5 py-4 text-xs font-mono font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                          value={companySettings.exotel_token}
                          onChange={e => setCompanySettings({...companySettings, exotel_token: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account SID</label>
                      <input 
                        type="text" 
                        placeholder="AC..."
                        className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-[20px] px-5 py-4 text-xs font-mono font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={companySettings.exotel_sid}
                        onChange={e => setCompanySettings({...companySettings, exotel_sid: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Webhook Transmission Gateway</label>
                      <div className="flex gap-3">
                         <input 
                          readOnly 
                          value={`${import.meta.env.VITE_API_BASE_URL || 'https://api.yourdomain.com'}/api/webhook/exotel/${user.company_id}`} 
                          className="flex-1 bg-white border border-[#F0EEF8] rounded-xl px-4 py-3 text-xs font-mono text-gray-400 italic" 
                         />
                         <button type="button" className="p-3 bg-white border border-[#F0EEF8] rounded-xl text-gray-400 hover:text-indigo-600 transition-colors">
                            <Copy size={18} />
                         </button>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold px-2 mt-2 leading-relaxed">
                         Configure this URL in your Exotel Passthru dashboard to begin capturing incoming lead transmissions.
                      </p>
                    </div>
                 </div>
               )}

               <div className="flex gap-4 pt-6 justify-end">
                 <button type="button" className="px-8 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-all">Test Signal</button>
                 <button 
                  onClick={handleUpdateSettings}
                  disabled={saving}
                  className="btn-primary h-12 px-10 rounded-2xl flex items-center gap-3 shadow-lg shadow-indigo-100 font-black text-xs uppercase tracking-widest"
                 >
                    {saving ? <RefreshCcw size={18} className="animate-spin" /> : <Save size={18} />}
                    Sync Gateway Bridge
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
