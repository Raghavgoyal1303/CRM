import React, { useState, useEffect } from 'react';
import { UserCheck, Search, Filter, Download, ExternalLink, Calendar, Phone, MessageSquare, Tag, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { campaignApi } from '../../api';

const OutboundLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await campaignApi.getInterestedLeads();
            setLeads(res.data || []);
        } catch (err) {
            console.error('Failed to fetch outbound leads');
        } finally {
            setLoading(false);
        }
    };

    const handleConvert = async (id) => {
        try {
            await campaignApi.convertToCrmLead(id);
            fetchLeads();
        } catch (err) {
            console.error('Conversion failed');
        }
    };

    const filteredLeads = leads.filter(l => 
        (l.phone_number?.includes(search) || l.name?.toLowerCase().includes(search.toLowerCase())) &&
        (filter === 'all' || l.status === filter)
    );

    const stats = {
        total: leads.length,
        converted: leads.filter(l => l.converted_to_lead).length,
        reminders: leads.filter(l => l.status === 'reminder_set').length,
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-heading font-black text-indigo-900 tracking-tight">Interested Leads</h1>
                    <p className="text-sm text-gray-500 mt-1">High-intent prospects captured from campaigns</p>
                </div>
                <button className="h-11 px-6 bg-white border border-[#F0EEF8] rounded-2xl flex items-center gap-2 font-black text-xs uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm">
                    <Download size={18} /> Export Global Excel
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Interested Prospects', value: stats.total, icon: UserCheck, color: 'indigo' },
                    { label: 'Converted to CRM', value: stats.converted, icon: CheckCircle2, color: 'emerald' },
                    { label: 'Pending Reminders', value: stats.reminders, icon: Calendar, color: 'amber' },
                    { label: 'Site Visits', value: '42', icon: Phone, color: 'blue' }
                ].map((stat, i) => (
                    <div key={i} className={`card p-4 bg-white border border-[#F0EEF8] shadow-sm`}>
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

            <div className="card !p-4 flex flex-wrap items-center gap-4 bg-white border border-[#F0EEF8]">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        className="input-field pl-10 h-10 border-none bg-gray-50" 
                        placeholder="Search by name or digits..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <select className="input-field h-10 w-44 bg-gray-50 border-none" value={filter} onChange={e => setFilter(e.target.value)}>
                    <option value="all">All Prospects</option>
                    <option value="new">New Intent</option>
                    <option value="reminder_set">Follow-up Set</option>
                    <option value="converted">Migrated to CRM</option>
                </select>
            </div>

            <div className="card !p-0 overflow-hidden bg-white border border-[#F0EEF8] shadow-xl shadow-indigo-900/5">
                <table className="w-full text-left">
                    <thead className="bg-[#F9F7F4] border-b border-[#F0EEF8]">
                        <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <th className="px-6 py-4">Prospect Identity</th>
                            <th className="px-6 py-4">Campaign Node</th>
                            <th className="px-6 py-4">Project Intent</th>
                            <th className="px-6 py-4">Budget Range</th>
                            <th className="px-5 py-4">Site Visit</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EEF8]">
                        {loading ? (
                           <tr><td colSpan="6" className="px-6 py-20 text-center text-gray-400 font-bold animate-pulse">Scanning intent matrix...</td></tr>
                        ) : filteredLeads.length === 0 ? (
                           <tr><td colSpan="6" className="px-6 py-20 text-center text-gray-400 italic">No interested leads found in the repository.</td></tr>
                        ) : filteredLeads.map(lead => (
                           <tr key={lead.id} className="hover:bg-[#FAFAFA] transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-heading font-black text-xs shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                                            {lead.name?.charAt(0) || <UserCheck size={14} />}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-indigo-900">{lead.name || 'Unknown Contact'}</span>
                                            <span className="text-[11px] font-mono text-gray-400">{lead.phone_number}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                   <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest leading-none block w-fit">
                                      {lead.campaign_name || 'Direct Entry'}
                                   </span>
                                </td>
                                <td className="px-6 py-5 text-sm font-medium text-gray-600">{lead.project_location || '—'}</td>
                                <td className="px-6 py-5">
                                   <span className="text-xs font-black text-indigo-900">{lead.budget || '—'}</span>
                                </td>
                                <td className="px-6 py-5 text-sm text-gray-500">{lead.site_visit_date ? new Date(lead.site_visit_date).toLocaleDateString() : 'Pending'}</td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {lead.converted_to_lead ? (
                                           <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5">
                                              <ShieldCheck size={12} /> Migrated
                                           </div>
                                        ) : (
                                           <button 
                                            onClick={() => handleConvert(lead.id)}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                                           >
                                              Inject into CRM
                                           </button>
                                        )}
                                        <button className="p-2 text-gray-300 hover:text-indigo-600 transition-colors">
                                            <ExternalLink size={18} />
                                        </button>
                                    </div>
                                </td>
                           </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OutboundLeads;
