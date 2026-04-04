import React, { useState, useEffect } from 'react';
import { 
  History, 
  PhoneIncoming, 
  PhoneMissed, 
  PlayCircle, 
  Search, 
  Calendar,
  Filter,
  User,
  Clock,
  Volume2,
  X,
  PauseCircle
} from 'lucide-react';
import axios from 'axios';
import { employeeApi } from '../api';

const CallLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    employeeId: '',
    status: ''
  });

  useEffect(() => {
    fetchEmployees();
    fetchLogs();
  }, [filters]);

  const fetchEmployees = async () => {
    try {
      const res = await employeeApi.getEmployees();
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees');
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/call-logs?${query}`, { withCredentials: true });
      setLogs(Array.isArray(res.data) ? res.data : (res.data.data && Array.isArray(res.data.data) ? res.data.data : []));
    } catch (err) {
      console.error('Failed to fetch call logs');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  const stats = {
    total: (logs || []).length,
    answered: (logs || []).filter(l => l?.call_status === 'answered').length,
    missed: (logs || []).filter(l => l?.call_status === 'missed').length
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header Row */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-black text-indigo-900 tracking-tight">Call Intelligence</h1>
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mt-1">
             <Calendar size={14} />
             {today}
          </div>
        </div>
        <div className="px-4 py-2 bg-white border border-[#F0EEF8] rounded-2xl shadow-sm text-xs font-bold text-gray-500 flex items-center gap-3">
           <div className="flex items-center gap-1.5 border-r pr-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{stats.answered} Answered</span>
           </div>
           <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <span>{stats.missed} Missed</span>
           </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 flex items-center gap-5 border-l-4 border-l-indigo-600 shadow-xl shadow-indigo-900/5">
           <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[20px] flex items-center justify-center">
              <History size={26} />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Communication Events</p>
              <h3 className="text-2xl font-heading font-black text-indigo-900">{stats.total}</h3>
           </div>
        </div>
        <div className="card p-6 flex items-center gap-5 border-l-4 border-l-emerald-500 shadow-xl shadow-emerald-900/5">
           <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-[20px] flex items-center justify-center">
              <PhoneIncoming size={26} />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Answered Intercepts</p>
              <h3 className="text-2xl font-heading font-black text-indigo-900">{stats.answered}</h3>
           </div>
        </div>
        <div className="card p-6 flex items-center gap-5 border-l-4 border-l-rose-500 shadow-xl shadow-rose-900/5">
           <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-[20px] flex items-center justify-center">
              <PhoneMissed size={26} />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Missed Opportunities</p>
              <h3 className="text-2xl font-heading font-black text-indigo-900">{stats.missed}</h3>
           </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card !p-4 flex flex-wrap items-center gap-4 border-dashed bg-white/50">
        <div className="flex-1 flex items-center gap-4 min-w-[400px]">
           <div className="flex-1 space-y-1.5 focus-within:text-indigo-600 transition-colors">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">From Date</label>
              <input 
                type="date"
                className="w-full bg-white border border-[#F0EEF8] rounded-[14px] px-4 py-3 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              />
           </div>
           <div className="flex-1 space-y-1.5 focus-within:text-indigo-600 transition-colors">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">To Date</label>
              <input 
                type="date"
                className="w-full bg-white border border-[#F0EEF8] rounded-[14px] px-4 py-3 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              />
           </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Operative</label>
              <select 
                className="bg-white border border-[#F0EEF8] rounded-[14px] px-4 py-3 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-indigo-500 min-w-[200px]"
                value={filters.employeeId}
                onChange={(e) => setFilters(prev => ({ ...prev, employeeId: e.target.value }))}
              >
                <option value="">All Operatives</option>
                {(employees || []).map(e => <option key={e?.id} value={e?.id}>{e?.name || 'Unknown'}</option>)}
              </select>
           </div>
           <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Intercept Status</label>
              <select 
                className="bg-white border border-[#F0EEF8] rounded-[14px] px-4 py-3 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-indigo-500 w-40"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">All Logs</option>
                <option value="answered">Answered</option>
                <option value="missed">Missed</option>
              </select>
           </div>
           <button 
              onClick={() => setFilters({ startDate: '', endDate: '', employeeId: '', status: '' })}
              className="mt-6 text-xs font-black text-indigo-600 hover:bg-indigo-50 px-4 py-3 rounded-xl transition-colors uppercase tracking-widest"
            >
              Reset
           </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card !p-0 overflow-hidden shadow-xl shadow-indigo-900/5 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9F7F4] border-b border-[#F0EEF8]">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Caller Identity</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Lead Profile</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Designated Operative</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Duration</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Timestamp</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Intercept Capture</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEF8]">
              {loading ? (
                <tr><td colSpan="7" className="px-6 py-20 text-center text-gray-400 font-bold animate-pulse">Syncing call history repository...</td></tr>
              ) : (logs || []).length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-20 text-center text-gray-400 font-bold italic">No call logs captured for this period.</td></tr>
              ) : (logs || []).map((log) => (
                <tr 
                  key={log?.id || Math.random()} 
                  className={`hover:bg-[#FAFAFA] group transition-colors ${log?.call_status === 'missed' ? 'bg-[#FFF9F9]' : ''}`}
                >
                  <td className="px-6 py-5 font-mono text-sm font-bold text-indigo-900 tracking-tighter">
                     {log?.lead_phone || 'Unknown'}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-indigo-900">{log?.lead_name || 'Anonymous Client'}</span>
                       <span className="text-[10px] text-gray-400 font-black uppercase mt-0.5">Profile Match</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-[10px]">
                          {log?.employee_name?.charAt(0) || 'U'}
                       </div>
                       <span className="text-xs font-bold text-gray-600">{log?.employee_name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`badge ${log?.call_status === 'answered' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} text-[10px] font-black uppercase tracking-widest`}>
                      {log?.call_status || 'UNKNOWN'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-mono text-gray-400">{log?.duration ?? 0}s</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-indigo-950">
                         {log?.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                       </span>
                       <span className="text-[9px] text-gray-400 font-black uppercase">
                         {log?.timestamp ? new Date(log.timestamp).toLocaleDateString() : '--/--/----'}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {log?.recording_url ? (
                      <div className="flex items-center justify-end">
                        {playingId === log.id ? (
                          <div className="flex items-center gap-3 bg-indigo-600 text-white px-4 py-2 rounded-xl scale-110 shadow-lg shadow-indigo-100 transition-all">
                             <div className="flex gap-1 h-3 items-end">
                                <div className="w-1 bg-white/40 h-full animate-[bounce_0.6s_ease-in-out_infinite]" />
                                <div className="w-1 bg-white/80 h-3/4 animate-[bounce_0.8s_ease-in-out_infinite]" />
                                <div className="w-1 bg-white h-2/4 animate-[bounce_1s_ease-in-out_infinite]" />
                             </div>
                             <button onClick={() => setPlayingId(null)}><PauseCircle size={20} /></button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setPlayingId(log.id)}
                            className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          >
                             <PlayCircle size={24} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic pr-3">No Audio</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Simulation player overlay */}
      {playingId && (
        <div className="fixed bottom-10 right-10 z-[100] animate-in slide-in-from-right-10">
           <div className="bg-indigo-900 text-white rounded-3xl p-6 shadow-2xl flex flex-col gap-4 border border-indigo-700 w-80">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-800 rounded-xl flex items-center justify-center text-white">
                       <Volume2 size={20} className="animate-pulse" />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Intercept Player</p>
                       <p className="text-sm font-black truncate">{logs.find(l => l.id === playingId)?.lead_phone}</p>
                    </div>
                 </div>
                 <button onClick={() => setPlayingId(null)} className="text-indigo-400 hover:text-white transition-colors">
                    <X size={20} />
                 </button>
              </div>
              <div className="space-y-2">
                 <div className="h-1 bg-indigo-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 animate-[progress_10s_linear]" style={{ width: '45%' }} />
                 </div>
                 <div className="flex justify-between text-[10px] font-black text-indigo-400">
                    <span>0:45</span>
                    <span>{logs.find(l => l.id === playingId)?.duration}s</span>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CallLogsPage;
