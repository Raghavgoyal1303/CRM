import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, Search, Filter, Phone, CheckCircle2, XCircle, Clock, ExternalLink } from 'lucide-react';
import { communicationApi } from '../../api';

const AdminCommunications = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [channelFilter, setChannelFilter] = useState('all');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await communicationApi.getLogs();
            setLogs(res.data || []);
        } catch (err) {
            console.error('Failed to fetch communication logs');
        } finally {
            setLoading(false);
        }
    };

    const filtered = logs.filter(log => 
        (log.phone_number?.includes(search) || log.message_text?.toLowerCase().includes(search.toLowerCase())) &&
        (channelFilter === 'all' || log.channel === channelFilter)
    );

    const stats = {
        total: logs.length,
        sms: logs.filter(l => l.channel === 'sms').length,
        whatsapp: logs.filter(l => l.channel === 'whatsapp').length,
        missed_trigger: logs.filter(l => l.triggered_by === 'missed_call').length
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-heading font-black text-indigo-900 tracking-tight text-left">Communication Logs</h1>
                    <p className="text-sm text-gray-500 mt-1">Multi-channel sequence history and audit</p>
                </div>
                <div className="flex gap-4">
                   <div className="h-11 px-6 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                       <CheckCircle2 size={18} /> Delivery Engine Live
                   </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Platform Dispatch', value: stats.total, icon: Send, color: 'indigo' },
                    { label: 'SMS Notifications', value: stats.sms, icon: MessageSquare, color: 'blue' },
                    { label: 'WhatsApp Flows', value: stats.whatsapp, icon: Send, color: 'green' },
                    { label: 'Missed Call Follow-ups', value: stats.missed_trigger, icon: Phone, color: 'emerald' }
                ].map((stat, i) => (
                    <div key={i} className="card p-6 bg-white border border-[#F0EEF8] shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">{stat.label}</p>
                                <h3 className="text-2xl font-heading font-black text-indigo-900">{stat.value}</h3>
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
                        placeholder="Search logs for phone or content..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <select className="input-field h-10 w-44 bg-gray-50 border-none appearance-none cursor-pointer" value={channelFilter} onChange={e => setChannelFilter(e.target.value)}>
                    <option value="all">All Channels</option>
                    <option value="sms">SMS Only</option>
                    <option value="whatsapp">WhatsApp Only</option>
                </select>
            </div>

            <div className="card !p-0 overflow-hidden bg-white border border-[#F0EEF8] shadow-xl shadow-indigo-900/5">
                <table className="w-full text-left">
                    <thead className="bg-[#F9F7F4] border-b border-[#F0EEF8]">
                        <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <th className="px-6 py-4">Phone identity</th>
                            <th className="px-6 py-4">Channel node</th>
                            <th className="px-6 py-4">Interaction content</th>
                            <th className="px-6 py-4 text-center">Trigger logic reason</th>
                            <th className="px-6 py-4 text-right">Dispatch status time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EEF8]">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-20 text-center text-gray-400 font-bold animate-pulse uppercase text-[10px] tracking-widest">Hydrating communication flow matrix...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-20 text-center text-gray-400 italic">No communication logs detected in the repository.</td></tr>
                        ) : filtered.map(log => (
                            <tr key={log.id} className="hover:bg-[#FAFAFA] transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-xl ${log.channel === 'sms' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'} flex items-center justify-center font-black group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm`}>
                                            {log.channel === 'sms' ? <MessageSquare size={16} /> : <Send size={16} />}
                                        </div>
                                        <span className="text-[13px] font-bold text-indigo-950 font-mono tracking-tighter">{log.phone_number}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                   <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${log.channel === 'sms' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                      {log.channel}
                                   </span>
                                </td>
                                <td className="px-6 py-5 min-w-[300px]">
                                   <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl relative overflow-hidden group">
                                      <p className="text-[12px] text-gray-600 line-clamp-2 leading-relaxed">{log.message_text}</p>
                                      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <button className="p-1.5 bg-white shadow-md rounded-lg text-indigo-600"><ExternalLink size={14} /></button>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{log.triggered_by?.replace('_', ' ')}</span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                   <div className="flex flex-col items-end gap-1">
                                      <div className="flex items-center gap-1.5">
                                         {log.status === 'sent' || log.status === 'delivered' ? <CheckCircle2 size={13} className="text-emerald-500" /> : <XCircle size={13} className="text-rose-500" />}
                                         <span className={`text-[10px] font-black uppercase tracking-widest ${log.status === 'sent' || log.status === 'delivered' ? 'text-emerald-600' : 'text-rose-600'}`}>{log.status}</span>
                                      </div>
                                      <span className="text-[10px] font-mono text-gray-400 italic">{new Date(log.sent_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
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

export default AdminCommunications;
