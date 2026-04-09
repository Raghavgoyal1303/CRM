import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Building2,
  Phone,
  Clock,
  Download,
  PhoneIncoming,
  PhoneOutgoing,
  Play,
  CheckCircle2,
  XCircle,
  Volume2
} from 'lucide-react';
import api from '../../api';

const SuperCallLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/super/call-logs');
      setLogs(response.data || []);
    } catch (err) {
      console.error('Failed to load global call logs');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.customer_phone?.includes(searchTerm) || 
    log.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 italic font-black text-xl">
            C
          </div>
          <div>
            <h1 className="text-3xl font-heading font-black text-indigo-900 tracking-tight">Interception Logs</h1>
            <p className="text-gray-500 font-medium mt-1 uppercase text-[10px] tracking-widest font-black">Global Telephony Session History</p>
          </div>
        </div>
        <button className="bg-white text-indigo-900 px-6 py-3 rounded-2xl flex items-center gap-2 font-black uppercase tracking-widest text-[10px] shadow-sm border border-gray-100 hover:shadow-lg transition-all">
           <Download size={18} /> Export Master CDR
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-[32px] border border-[#F0EEF8] shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by phone number or company node..."
            className="w-full bg-[#F9F7F4] border-none h-14 rounded-2xl pl-12 pr-4 text-sm font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-100 transition-all border border-transparent focus:border-indigo-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Call Logs Table */}
      <div className="card !p-0 overflow-hidden shadow-xl shadow-indigo-900/5 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9F7F4] border-b border-[#F0EEF8]">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Session</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Origin Node</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Duration</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Result</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Playback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEF8]">
              {loading ? (
                <tr><td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold animate-pulse">Synchronizing gateway session history...</td></tr>
              ) : filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAFAFA] group transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${log.direction === 'inbound' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'} group-hover:scale-110 transition-transform`}>
                        {log.direction === 'inbound' ? <PhoneIncoming size={18} /> : <PhoneOutgoing size={18} />}
                      </div>
                      <div className="flex flex-col">
                         <span className="text-sm font-bold text-indigo-900">{log.customer_phone}</span>
                         <span className="text-[10px] text-gray-400 font-medium font-mono lowercase tracking-normal">id: {log.id.substring(0, 8)}...</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <Building2 size={14} className="text-indigo-400" />
                       <span className="text-xs font-bold text-gray-600">{log.company_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-mono text-xs text-gray-500 tabular-nums">
                    {Math.floor(log.duration / 60)}m {log.duration % 60}s
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       {log.status === 'answered' ? (
                         <CheckCircle2 size={16} className="text-emerald-500" />
                       ) : (
                         <XCircle size={16} className="text-rose-400" />
                       )}
                       <span className={`text-[9px] font-black uppercase tracking-widest ${log.status === 'answered' ? 'text-emerald-600' : 'text-rose-400'}`}>
                          {log.status}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {log.recording_url ? (
                      <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all shadow-sm">
                        <Play size={16} className="ml-0.5" />
                      </button>
                    ) : (
                      <Volume2 size={16} className="text-gray-200 ml-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperCallLogs;
