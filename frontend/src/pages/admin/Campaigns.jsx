import React, { useState, useEffect } from 'react';
import { Radio, Plus, Play, Pause, BarChart3, Download, Search, X, Upload, CheckCircle2 } from 'lucide-react';
import { campaignApi } from '../../api';

const AdminCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', daily_limit: 1000 });
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const res = await campaignApi.getCampaigns();
            setCampaigns(res.data || []);
        } catch (err) {
            console.error('Failed to fetch campaigns');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            await campaignApi.createCampaign(formData);
            fetchCampaigns();
            setIsModalOpen(false);
            setFormData({ name: '', description: '', daily_limit: 1000 });
        } catch (err) {
            console.error('Create failed');
        } finally {
            setFormLoading(false);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const nextStatus = currentStatus === 'running' ? 'paused' : 'running';
        try {
            await campaignApi.updateStatus(id, nextStatus);
            fetchCampaigns();
        } catch (err) {
            console.error('Status toggle failed');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-heading font-black text-indigo-900 tracking-tight">Outbound Campaigns</h1>
                    <p className="text-sm text-gray-500 mt-1">Deploy 1,000+ daily outreach attempts</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary h-11 px-6 flex items-center gap-2 shadow-lg shadow-indigo-100"
                >
                    <Plus size={18} /> New Campaign
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {[
                    { label: 'Total Campaigns', value: campaigns.length, icon: Radio, color: 'indigo' },
                    { label: 'Running', value: campaigns.filter(c => c.status === 'running').length, icon: Play, color: 'emerald' },
                    { label: 'Numbers Loaded', value: campaigns.reduce((acc, c) => acc + (c.total_numbers || 0), 0), icon: Upload, color: 'blue' },
                    { label: 'Calls Today', value: campaigns.reduce((acc, c) => acc + (c.calls_made_today || 0), 0), icon: Radio, color: 'amber' },
                    { label: 'Interested', value: '438', icon: CheckCircle2, color: 'emerald' }
                ].map((stat, i) => (
                    <div key={i} className="card p-5 bg-white border border-[#F0EEF8] shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl flex items-center justify-center`}>
                                <stat.icon size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
                                <h3 className="text-xl font-heading font-black text-indigo-900">{stat.value}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-2 py-20 text-center text-gray-400 font-bold animate-pulse">Initializing campaign matrix...</div>
                ) : campaigns.length === 0 ? (
                    <div className="col-span-2 card p-12 bg-white border-2 border-dashed border-[#F0EEF8] text-center">
                        <Radio size={40} className="text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No active campaigns detected</p>
                    </div>
                ) : campaigns.map(campaign => (
                    <div key={campaign.id} className="card p-6 bg-white border border-[#F0EEF8] shadow-lg shadow-indigo-900/5 group hover:border-indigo-400 transition-all">
                        <div className="flex items-start justify-between mb-6">
                           <div className="flex items-center gap-3">
                              <div className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${campaign.status === 'running' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                                 {campaign.status}
                              </div>
                              <h3 className="text-lg font-heading font-black text-indigo-900">{campaign.name}</h3>
                           </div>
                           <div className="flex items-center gap-1">
                              <button 
                                onClick={() => handleToggleStatus(campaign.id, campaign.status)}
                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                              >
                                 {campaign.status === 'running' ? <Pause size={18} /> : <Play size={18} />}
                              </button>
                           </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gray-400">
                                <span>Deployment Progress</span>
                                <span className="text-indigo-600">{Math.round(((campaign.calls_made_today || 0) / (campaign.total_numbers || 1)) * 100)}%</span>
                            </div>
                            <div className="h-2 w-full bg-indigo-50 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                                    style={{ width: `${Math.min(100, (campaign.calls_made_today / (campaign.total_numbers || 1)) * 100)}%` }} 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="p-3 bg-gray-50 rounded-xl">
                                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dialed Today</p>
                                   <p className="text-lg font-black text-indigo-950 mt-1">{campaign.calls_made_today}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Numbers</p>
                                   <p className="text-lg font-black text-indigo-950 mt-1">{campaign.total_numbers}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-6">
                           <button className="flex-1 btn-primary h-10 text-[10px] uppercase font-black tracking-widest shadow-none">
                              <BarChart3 size={14} className="mr-2" /> View Stats
                           </button>
                           <button className="px-4 h-10 border border-[#F0EEF8] rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                              <Download size={16} />
                           </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Campaign Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-indigo-900/20 backdrop-blur-sm z-[80] flex items-center justify-center p-6">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-8 animate-in zoom-in duration-200">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-heading font-black text-indigo-900">New Campaign</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-5">
                            <div className="space-y-1.5 font-bold">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Campaign Identity</label>
                                <input 
                                    required 
                                    className="input-field" 
                                    placeholder="e.g. Diwali Outreach 2026" 
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5 font-bold">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Daily Call Quantum</label>
                                <input 
                                    type="number" 
                                    className="input-field" 
                                    value={formData.daily_limit}
                                    onChange={e => setFormData({ ...formData, daily_limit: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5 font-bold">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Strategic Mission</label>
                                <textarea 
                                    className="input-field h-24" 
                                    placeholder="Brief description..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={formLoading}
                                className="w-full btn-primary h-12 rounded-2xl shadow-xl shadow-indigo-100 uppercase tracking-[0.2em] font-black text-xs"
                            >
                                {formLoading ? 'Provisioning...' : 'Initiate Operation'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCampaigns;
