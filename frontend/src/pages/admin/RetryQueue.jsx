import React, { useState, useEffect } from 'react';
import { ListRestart, Search, SkipForward, Clock, Phone, Radio, Settings, CheckCircle2, TrendingUp } from 'lucide-react';
import { retryApi } from '../../api';

const RetryQueue = () => {
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchQueue();
    }, []);

    const fetchQueue = async () => {
        try {
            const res = await retryApi.getQueue();
            setQueue(res.data || []);
        } catch (err) {
            console.error('Failed to fetch retry queue');
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = async (id) => {
        try {
            await retryApi.skip(id);
            fetchQueue();
        } catch (err) {
            console.error('Skip failed');
        }
    };

    const filtered = queue.filter(q => q.phone_number?.includes(search));

    const stats = {
        total: queue.filter(q => q.status === 'waiting').length,
        busy: queue.filter(q => q.retry_reason === 'busy' && q.status === 'waiting').length,
        off: queue.filter(q => q.retry_reason === 'switched_off' && q.status === 'waiting').length,
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-heading font-black text-indigo-900 tracking-tight text-left">Retry Engine</h1>
                    <p className="text-sm text-gray-500 mt-1">Automatic callbacks for busy or unavailable numbers</p>
                </div>
                <div className="flex gap-4">
                    <button className="h-11 px-4 bg-white border border-[#F0EEF8] rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm">
                        <Settings size={18} /> Global Strategy
                    </button>
                    <div className="h-11 px-6 bg-indigo-900 text-white rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100">
                        <TrendingUp size={18} /> Engine Active
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Waiting in Queue', value: stats.total, icon: ListRestart, color: 'indigo' },
                    { label: 'Busy Numbers', value: stats.busy, icon: Radio, color: 'emerald' },
                    { label: 'Switched Off', value: stats.off, icon: Phone, color: 'amber' }
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

            <div className="card !p-4 flex items-center gap-4 bg-white border border-[#F0EEF8]">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        className="input-field pl-10 h-10 border-none bg-gray-50" 
                        placeholder="Search queue for phone..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="card !p-0 overflow-hidden bg-white border border-[#F0EEF8] shadow-xl shadow-indigo-900/5">
                <table className="w-full text-left">
                    <thead className="bg-[#F9F7F4] border-b border-[#F0EEF8]">
                        <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <th className="px-6 py-4">Phone identity</th>
                            <th className="px-6 py-4 text-center">Retry logic reason</th>
                            <th className="px-6 py-4 text-center">Retry Attempt frequency</th>
                            <th className="px-6 py-4 text-center text-left">Scheduled Callback time</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EEF8]">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-20 text-center text-gray-400 font-bold animate-pulse uppercase text-[10px] tracking-widest">Hydrating retry matrix...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-20 text-center text-gray-400 italic">No callbacks currently scheduled in the matrix.</td></tr>
                        ) : filtered.map(item => (
                            <tr key={item.id} className="hover:bg-indigo-50/20 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                            <Phone size={18} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 font-mono tracking-tighter">{item.phone_number}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                   <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${item.retry_reason === 'busy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                      {item.retry_reason}
                                   </span>
                                </td>
                                <td className="px-6 py-5 text-center">
                                   <div className="flex items-center justify-center gap-1">
                                      {[...Array(item.max_attempts || 2)].map((_, i) => (
                                         <div key={i} className={`h-1.5 w-1.5 rounded-full ${i < item.attempt_count ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                                      ))}
                                      <span className="text-[10px] font-black ml-2 text-indigo-900">{item.attempt_count}/{item.max_attempts}</span>
                                   </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                   <div className="flex items-center justify-center gap-2 text-indigo-600">
                                      <Clock size={14} />
                                      <span className="text-xs font-black font-mono tracking-tight">{new Date(item.next_retry_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                   </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                   <button 
                                    onClick={() => handleSkip(item.id)}
                                    className="px-4 py-2 bg-white border border-[#F0EEF8] text-gray-400 hover:text-rose-500 hover:border-rose-100 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                                   >
                                      <SkipForward size={14} className="inline mr-1" /> Skip
                                   </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RetryQueue;
