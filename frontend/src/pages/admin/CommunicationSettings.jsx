import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, Save, BellRing, Smartphone, Clock, ShieldCheck, Zap, Info } from 'lucide-react';
import { autoResponseApi } from '../../api';

const CommunicationSettings = () => {
    const [settings, setSettings] = useState({
        sms_enabled: false,
        sms_template: 'Hi, we missed your call. We will call you back shortly.',
        sms_delay_minutes: 2,
        whatsapp_enabled: false,
        whatsapp_template: 'Hello! Thanks for reaching out. Here is our brochure.',
        whatsapp_brochure_url: '',
        whatsapp_followup_enabled: false,
        whatsapp_followup_hours: 2,
        msg91_api_key: '',
        msg91_sender_id: '',
        whatsapp_api_key: '',
        whatsapp_number: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('sequence');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await autoResponseApi.getSettings();
            setSettings(prev => ({ ...prev, ...res.data }));
        } catch (err) {
            console.error('Failed to fetch settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await autoResponseApi.updateSettings(settings);
            // Also update company specific keys if changed
            // await settingsApi.updateSettings({ ... });
        } catch (err) {
            console.error('Save failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-heading font-black text-indigo-900 tracking-tight text-left">Communication Strategy</h1>
                    <p className="text-sm text-gray-500 mt-1">Configure automated missed-call sequences and provider keys</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary h-11 px-8 flex items-center gap-2 shadow-lg shadow-indigo-100"
                >
                    <Save size={18} /> {saving ? 'Archiving...' : 'Consolidate Strategy'}
                </button>
            </header>

            <div className="flex items-center gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit">
                {[
                    { id: 'sequence', label: 'Missed Call Sequence', icon: Zap },
                    { id: 'keys', label: 'API Credentials', icon: ShieldCheck }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'sequence' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* SMS Auto-Response */}
                    <div className="card bg-white border border-[#F0EEF8] shadow-sm p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                    <MessageSquare size={24} />
                                </div>
                                <h3 className="text-lg font-heading font-black text-indigo-900">SMS Missed Call Protocol</h3>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer" 
                                  checked={settings.sms_enabled} 
                                  onChange={e => setSettings({ ...settings, sms_enabled: e.target.checked })} 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-start gap-3">
                               <Info size={18} className="text-indigo-600 mt-1 shrink-0" />
                               <p className="text-[11px] text-indigo-900 leading-relaxed font-medium italic">
                                  Trigger logic: If a call from a prospect is missed/unanswered, dispatch this SMS after the configured delay.
                               </p>
                            </div>
                            <div className="space-y-1.5 font-bold">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Response Delay (Minutes)</label>
                                <div className="flex items-center gap-3">
                                   <input 
                                     type="number" 
                                     className="input-field w-24" 
                                     value={settings.sms_delay_minutes}
                                     onChange={e => setSettings({ ...settings, sms_delay_minutes: e.target.value })}
                                   />
                                   <span className="text-xs text-gray-400 font-black uppercase tracking-widest italic">Wait before dispatch</span>
                                </div>
                            </div>
                            <div className="space-y-1.5 font-bold">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">SMS Template Node</label>
                                <textarea 
                                    className="input-field h-32 leading-relaxed" 
                                    placeholder="e.g. Sorry we missed you..."
                                    value={settings.sms_template}
                                    onChange={e => setSettings({ ...settings, sms_template: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp Auto-Response */}
                    <div className="card bg-white border border-[#F0EEF8] shadow-sm p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                    <Send size={24} />
                                </div>
                                <h3 className="text-lg font-heading font-black text-indigo-900">WhatsApp Sequential Follow-up</h3>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer" 
                                  checked={settings.whatsapp_followup_enabled} 
                                  onChange={e => setSettings({ ...settings, whatsapp_followup_enabled: e.target.checked })} 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                               <Zap size={18} className="text-emerald-600 mt-1 shrink-0" />
                               <p className="text-[11px] text-emerald-900 leading-relaxed font-medium italic">
                                  Secondary protocol: If no inbound reply is received to the SMS within X hours, dispatch this strategic WhatsApp.
                               </p>
                            </div>
                            <div className="space-y-1.5 font-bold">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Wait Duration (Hours)</label>
                                <div className="flex items-center gap-3">
                                   <input 
                                     type="number" 
                                     className="input-field w-24" 
                                     value={settings.whatsapp_followup_hours}
                                     onChange={e => setSettings({ ...settings, whatsapp_followup_hours: e.target.value })}
                                   />
                                   <span className="text-xs text-gray-400 font-black uppercase tracking-widest italic">Hours after missed call</span>
                                </div>
                            </div>
                            <div className="space-y-1.5 font-bold">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">WA Message Template</label>
                                <textarea 
                                    className="input-field h-32 leading-relaxed" 
                                    placeholder="Strategic follow-up content..."
                                    value={settings.whatsapp_template}
                                    onChange={e => setSettings({ ...settings, whatsapp_template: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card bg-white border border-[#F0EEF8] shadow-sm p-10 max-w-2xl mx-auto space-y-8">
                    <div className="text-center space-y-2">
                        <ShieldCheck size={48} className="text-indigo-600 mx-auto" />
                        <h3 className="text-xl font-heading font-black text-indigo-900">API Credentials Matrix</h3>
                        <p className="text-xs text-gray-400 uppercase font-black tracking-widest">Secure key management for multi-channel dispatch</p>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-1.5 font-bold">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">MSG91 API KEY</label>
                                <input type="password" placeholder="Matrix Key" className="input-field" value={settings.msg91_api_key} onChange={e => setSettings({...settings, msg91_api_key: e.target.value})} />
                           </div>
                           <div className="space-y-1.5 font-bold">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">MSG91 SENDER ID</label>
                                <input placeholder="e.g. INFOMA" className="input-field" value={settings.msg91_sender_id} onChange={e => setSettings({...settings, msg91_sender_id: e.target.value})} />
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-1.5 font-bold">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">WhatsApp API KEY</label>
                                <input type="password" placeholder="Protocol Key" className="input-field" value={settings.whatsapp_api_key} onChange={e => setSettings({...settings, whatsapp_api_key: e.target.value})} />
                           </div>
                           <div className="space-y-1.5 font-bold">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">WhatsApp Number</label>
                                <input placeholder="Verified Number" className="input-field" value={settings.whatsapp_number} onChange={e => setSettings({...settings, whatsapp_number: e.target.value})} />
                           </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunicationSettings;
