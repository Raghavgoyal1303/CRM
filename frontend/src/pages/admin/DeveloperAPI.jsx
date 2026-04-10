import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Plus, 
  Activity, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldAlert,
  Server,
  Zap,
  Globe,
  Trash2,
  X,
  Lock,
  ChevronRight,
  Info
} from 'lucide-react';
import { developerApi } from '../../api';

const DeveloperAPI = () => {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGenModal, setShowGenModal] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [revealedKey, setRevealedKey] = useState(null);
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    environment: 'live',
    rate_limit: 1000,
    permissions: { leads: ['create', 'read'], analytics: ['read'] }
  });

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await developerApi.listKeys();
      setKeys(res.data || []);
    } catch (err) {
      console.error('Failed to load keys');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      const res = await developerApi.generateKey(formData);
      setRevealedKey(res.data.key);
      setShowGenModal(false);
      fetchKeys();
    } catch (err) {
      alert('Generation failed');
    }
  };

  const handleRevoke = async (id) => {
    if (!window.confirm('Revoke this key? All integrations using it will immediately fail.')) return;
    try {
      await developerApi.revokeKey(id);
      fetchKeys();
    } catch (err) {
      alert('Revoke failed');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = {
    active: keys.filter(k => k.is_active).length,
    calls: keys.reduce((acc, k) => acc + (k.calls_this_month || 0), 0),
    latency: '142ms'
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-black text-indigo-900 tracking-tight">Developer API</h1>
          <p className="text-gray-500 font-medium mt-1 uppercase text-[10px] tracking-widest font-black">Secure Ingestion Infrastructure</p>
        </div>
        <button 
          onClick={() => setShowGenModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 hover:-translate-y-1 transition-all"
        >
          <Plus size={18} /> Generate New Key
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-indigo-900 rounded-[40px] p-10 text-white relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
          <Code2 size={160} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Live API Bridge Active</span>
          </div>
          <h2 className="text-3xl font-black mb-4 italic tracking-tight">Enterprise Scale Ingestion</h2>
          <p className="text-indigo-200 font-medium leading-relaxed mb-8 text-lg">
            Directly push leads from IVR systems, Facebook Ads, or custom forms. 
            Built for reliability with atomic transaction logging and de-duplication.
          </p>
          <button 
            onClick={() => setShowDocs(true)}
            className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-indigo-50 transition-all shadow-xl"
          >
            <Globe size={18} /> Integrated Documentation <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Keys', value: stats.active, icon: ShieldAlert, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'API Calls (30d)', value: stats.calls, icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Avg Latency', value: stats.latency, icon: Server, color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map((stat, idx) => (
          <div key={idx} className="card p-8 group">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
              <stat.icon size={28} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-heading font-black text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Keys Table */}
      <div className="card !p-0 overflow-hidden">
        <div className="p-8 border-b border-[#F0EEF8] flex items-center justify-between bg-white">
          <h3 className="font-heading font-black text-indigo-900 tracking-tight flex items-center gap-2 text-xl">
             API Management Vault
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F9F7F4] border-b border-[#F0EEF8]">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Identifier</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Signature</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Environment</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Volume (30d)</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEF8] bg-white">
              {keys.map((key) => (
                <tr key={key.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-bold text-indigo-900">{key.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{key.description || 'no description'}</p>
                  </td>
                  <td className="px-8 py-6">
                    <code className="text-[11px] font-mono bg-gray-100 px-3 py-1.5 rounded-xl text-indigo-600 font-bold border border-gray-200">
                      {key.key_preview}...
                    </code>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      key.environment === 'live' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {key.environment}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className="flex-1 min-w-[100px] bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-full rounded-full transition-all duration-1000" 
                            style={{ width: `${Math.min((key.calls_this_month / key.rate_limit) * 100, 100)}%` }} 
                          />
                       </div>
                       <span className="text-[10px] font-black text-indigo-900 tabular-nums">
                          {key.calls_this_month} / {key.rate_limit}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleRevoke(key.id)}
                      className="p-3 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {keys.length === 0 && !loading && (
                <tr>
                   <td colSpan="5" className="px-8 py-20 text-center">
                      <Lock size={40} className="text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-400 font-bold text-sm italic">No active keys found in the secure vault.</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#18181A] rounded-[40px] p-10 shadow-3xl border border-gray-800 relative overflow-hidden group">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                 <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                 <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest font-mono">ingestion_demo.js</span>
           </div>
           <pre className="text-indigo-400 font-mono text-sm leading-8">
{`const response = await fetch('${import.meta.env.VITE_API_BASE_URL || 'https://api.yourdomain.com'}/api/webhook/ivr', {
  method: 'POST',
  headers: {
    'X-API-Key': 'lf_live_xxxxxxxxxxxxxxxxxxxxxxxx',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    phone: '9000000000',
    name: 'Strategic Lead',
    source: 'main_ivr',
    notes: 'Interested in plot scheme'
  })
});`}
           </pre>
           <button 
             onClick={() => copyToClipboard('// code sample...')}
             className="absolute top-10 right-10 p-3 bg-gray-800 text-gray-400 rounded-2xl hover:text-white transition-all border border-gray-700"
           >
              {copied ? <Check size={18} /> : <Copy size={18} />}
           </button>
        </div>

        <div className="card !p-10 border-indigo-100 flex flex-col">
           <h3 className="font-heading font-black text-indigo-900 tracking-tight text-xl mb-8 flex items-center gap-2">
              <ShieldAlert size={20} className="text-rose-500" /> API Error Index
           </h3>
           <div className="space-y-4 flex-1">
              {[
                { code: '401', label: 'Missing Cipher', desc: 'Invalid or missing X-API-Key' },
                { code: '403', label: 'Access Denied', desc: 'Insufficient permissions for this key' },
                { code: '429', label: 'Rate Restricted', desc: 'Monthly volume limit reached' },
                { code: '500', label: 'System Fault', desc: 'Backend sync failed, check database' },
              ].map((err, idx) => (
                <div key={idx} className="flex items-start gap-5 p-5 rounded-[24px] bg-gray-50 border border-gray-100 hover:border-indigo-100 transition-all cursor-help group">
                   <span className="font-mono font-black text-rose-500 py-1 text-lg">{err.code}</span>
                   <div>
                      <p className="text-sm font-black text-indigo-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{err.label}</p>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">{err.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* MODAL: SHIELDED GENERATION (NEW KEY) */}
      {showGenModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-indigo-900/40 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[40px] shadow-4xl p-10 relative border border-white">
              <button onClick={() => setShowGenModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-indigo-900 transition-colors">
                 <X size={24} />
              </button>
              <h3 className="text-2xl font-black text-indigo-900 mb-2 italic">Generate API Key</h3>
              <p className="text-gray-500 text-sm font-medium mb-8">Establish a new bridge to external metadata providers.</p>
              
              <form onSubmit={handleGenerate} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Key Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Exotel IVR Primary"
                      className="w-full bg-gray-50 border-gray-100 rounded-2xl h-14 px-6 focus:ring-2 focus:ring-indigo-600 text-sm font-bold"
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Environment</label>
                       <select 
                         className="w-full bg-gray-50 border-gray-100 rounded-2xl h-14 px-4 focus:ring-2 focus:ring-indigo-600 text-sm font-bold appearance-none"
                         onChange={(e) => setFormData({...formData, environment: e.target.value})}
                       >
                          <option value="live">ðŸš€ Live Production</option>
                          <option value="test">ðŸ§ª Test/Sandbox</option>
                       </select>
                    </div>
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Monthly Limit</label>
                       <input 
                         type="number" 
                         defaultValue={1000}
                         className="w-full bg-gray-50 border-gray-100 rounded-2xl h-14 px-6 focus:ring-2 focus:ring-indigo-600 text-sm font-bold"
                         onChange={(e) => setFormData({...formData, rate_limit: parseInt(e.target.value)})}
                       />
                    </div>
                 </div>
                 <button className="w-full bg-indigo-900 text-white h-16 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-200 mt-4 hover:-translate-y-1 transition-all">
                    Initialize Access Cipher
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* MODAL: SECRET REVEAL (ONE TIME) */}
      {revealedKey && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in zoom-in-95 duration-300">
           <div className="bg-white w-full max-w-xl rounded-[48px] shadow-4xl p-12 text-center border-t-8 border-emerald-500">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                 <Lock size={48} />
              </div>
              <h3 className="text-3xl font-black text-indigo-900 mb-4 tracking-tight">Security Handshake Complete</h3>
              <p className="text-[#6B7280] font-medium leading-relaxed mb-10 max-w-md mx-auto">
                 This is your unique API Secret. <span className="text-rose-500 font-bold">Copy it immediately.</span> 
                 For security reasons, we will never show this full key again.
              </p>
              
              <div className="relative group mb-10">
                 <div className="bg-gray-100 p-8 rounded-[32px] border-2 border-gray-200 font-mono text-xl font-black text-indigo-600 break-all cursor-pointer select-all" onClick={() => copyToClipboard(revealedKey)}>
                    {revealedKey}
                    <div className="absolute top-4 right-4 text-emerald-500 flex items-center gap-1">
                       <Check size={16} />
                       <span className="text-[10px] font-black uppercase">Click to copy</span>
                    </div>
                 </div>
              </div>

              <button 
                onClick={() => { setRevealedKey(null); setCopied(false); }}
                className="w-full bg-emerald-600 text-white h-16 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-emerald-200 hover:scale-105 transition-all"
              >
                I have Secured the Key
              </button>
           </div>
        </div>
      )}

      {/* SLIDE-OVER: DOCUMENTATION */}
      {showDocs && (
        <div className="fixed inset-0 z-[150] flex justify-end animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-indigo-900/20 backdrop-blur-sm" onClick={() => setShowDocs(false)} />
           <div className="relative w-full max-w-2xl bg-white h-full shadow-4xl animate-in slide-in-from-right duration-500 overflow-y-auto outline-none">
              <div className="p-10 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                 <div>
                    <h3 className="text-2xl font-black text-indigo-900 italic tracking-tight">Lead Ingestion Specifications</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Tricity Verified API Version 1.0.4</p>
                 </div>
                 <button onClick={() => setShowDocs(false)} className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:text-indigo-900 transition-colors">
                    <X size={24} />
                 </button>
              </div>
              <div className="p-10 pros font-medium text-gray-600 space-y-10">
                 <section className="space-y-6">
                    <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-xs">
                       <div className="w-6 h-[2px] bg-indigo-600" />
                       Authentication Protocol
                    </div>
                    <p className="leading-relaxed">All requests must include your unique **API Key** in the request headers. Do not expose this key in public client-side code.</p>
                    <div className="p-6 bg-gray-50 rounded-3xl border border-indigo-50 font-mono text-sm">
                       <span className="text-rose-500">X-API-Key</span>: YOUR_ACCESS_CIPHER
                    </div>
                 </section>

                 <section className="space-y-6">
                    <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-xs">
                       <div className="w-6 h-[2px] bg-indigo-600" />
                       Ingestion Gateway
                    </div>
                    <p className="leading-relaxed">Submit primary lead data to the following secure endpoint. Supports global E.164 formats.</p>
                    <div className="p-6 bg-indigo-900 text-indigo-100 rounded-3xl font-mono text-sm break-all">
                       POST {import.meta.env.VITE_API_BASE_URL || 'https://api.yourdomain.com'}/api/webhook/ivr
                    </div>
                 </section>

                 <section className="space-y-6">
                    <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-xs">
                       <div className="w-6 h-[2px] bg-indigo-600" />
                       JSON Payload Structure
                    </div>
                    <div className="bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden">
                       <table className="w-full text-left text-xs">
                          <thead className="bg-gray-100 p-4 block">
                             <tr className="flex justify-between items-center px-4 py-3 uppercase font-black tracking-widest text-gray-400">
                                <th>Param</th>
                                <th>Required</th>
                             </tr>
                          </thead>
                          <tbody className="p-4 block space-y-4">
                             <tr className="flex justify-between items-start border-b border-gray-100 pb-4">
                                <td>
                                   <p className="font-bold text-indigo-900">phone</p>
                                   <p className="text-[10px] text-gray-500 font-medium mt-1">E.164 suggested</p>
                                </td>
                                <td className="text-rose-500 font-black uppercase">Yes</td>
                             </tr>
                             <tr className="flex justify-between items-start border-b border-gray-100 pb-4">
                                <td>
                                   <p className="font-bold text-indigo-900">name</p>
                                   <p className="text-[10px] text-gray-500 font-medium mt-1">Full profile name</p>
                                </td>
                                <td className="text-gray-400 font-black uppercase">No</td>
                             </tr>
                             <tr className="flex justify-between items-start">
                                <td>
                                   <p className="font-bold text-indigo-900">source</p>
                                   <p className="text-[10px] text-gray-500 font-medium mt-1">e.g. facebook_ads</p>
                                </td>
                                <td className="text-gray-400 font-black uppercase">No</td>
                             </tr>
                          </tbody>
                       </table>
                    </div>
                 </section>

                 <div className="p-8 bg-emerald-50 rounded-[32px] border border-emerald-100 flex items-start gap-4">
                    <Info size={24} className="text-emerald-600 flex-shrink-0" />
                    <p className="text-sm text-emerald-800 font-medium italic">
                       Every request made with your API Key is logged in real-time. Unauthorized attempts will trigger account suspension.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperAPI;

