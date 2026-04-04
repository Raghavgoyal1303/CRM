import React, { useState, useEffect } from 'react';
import { 
  FileSearch, 
  Search, 
  Filter, 
  Download, 
  ShieldCheck, 
  Trash2, 
  UserPlus, 
  Edit3, 
  LogIn 
} from 'lucide-react';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ action: '', employee: '', search: '' });

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`/api/audit?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getActionStyle = (action) => {
    if (action.includes('create')) return { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: UserPlus };
    if (action.includes('update') || action.includes('change')) return { bg: 'bg-amber-50', text: 'text-amber-600', icon: Edit3 };
    if (action.includes('delete')) return { bg: 'bg-rose-50', text: 'text-rose-600', icon: Trash2 };
    if (action.includes('login')) return { bg: 'bg-blue-50', text: 'text-blue-600', icon: LogIn };
    return { bg: 'bg-gray-50', text: 'text-gray-600', icon: FileSearch };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-black text-indigo-900 tracking-tight">Audit Log</h1>
          <p className="text-gray-500 font-medium mt-1">Full transparency of every action taken within LeadFlow</p>
        </div>
        <button className="bg-white text-indigo-900 px-6 py-3 rounded-2xl flex items-center gap-2 font-black uppercase tracking-widest text-[10px] shadow-sm border border-gray-100 hover:shadow-lg transition-all">
          <Download size={18} /> Export Full History
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-[32px] border border-[#F0EEF8] shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex-1 relative min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by action, module, or IP address..."
            className="w-full bg-gray-50 border-none h-14 rounded-2xl pl-12 pr-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-indigo-100 transition-all"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>
        
        <select 
          className="bg-gray-50 border-none h-14 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-gray-600 focus:ring-2 focus:ring-indigo-100 cursor-pointer"
          onChange={(e) => setFilters({...filters, action: e.target.value})}
        >
          <option value="">All Actions</option>
          <option value="lead.status.changed">Lead Status</option>
          <option value="employee.created">New Employees</option>
          <option value="export.csv">Data Exports</option>
          <option value="login.success">Logins</option>
        </select>

        <button className="bg-gray-900 text-white h-14 w-14 rounded-2xl flex items-center justify-center hover:bg-black transition-all">
          <Filter size={20} />
        </button>
      </div>

      {/* Audit Timeline */}
      <div className="space-y-4">
        {logs.map((log) => {
          const style = getActionStyle(log.action);
          const Icon = style.icon;
          return (
            <div key={log.id} className="bg-white p-6 rounded-[28px] border border-[#F0EEF8] flex items-start gap-6 group hover:border-indigo-100 transition-all shadow-sm">
              <div className={`w-14 h-14 ${style.bg} ${style.text} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-black text-gray-900">
                    {log.employee_name} <span className="text-gray-400 font-medium lowercase tracking-normal mx-2">performed</span> {log.action.replace(/\./g, ' ')}
                  </h4>
                  <span className="text-[10px] font-bold text-gray-400 tabular-nums">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Entity</span>
                    <span className="text-xs font-bold text-indigo-600 leading-none">{log.entity_type}: {log.entity_id.substring(0, 8)}...</span>
                  </div>

                  {log.new_value && (
                    <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">Result</span>
                      <span className="text-xs font-mono font-bold text-emerald-700 leading-none truncate max-w-[200px]">
                        {Object.values(JSON.parse(log.new_value))[0]}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 ml-auto">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">IP</span>
                    <span className="text-[10px] font-mono font-bold text-gray-500 leading-none">{log.ip_address}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {loading && <div className="p-20 text-center font-bold text-gray-400 animate-pulse">Scanning Activity Records...</div>}
        {!loading && logs.length === 0 && (
          <div className="p-20 text-center">
             <div className="w-20 h-20 bg-indigo-50 text-indigo-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={40} />
             </div>
             <p className="font-bold text-gray-400 text-lg tracking-tight">No activity logs found for your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLog;
