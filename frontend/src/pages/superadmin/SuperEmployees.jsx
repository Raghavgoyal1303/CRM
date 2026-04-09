import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Building2,
  Phone,
  ShieldCheck,
  Globe,
  Download,
  CheckCircle2,
  Trash2,
  MoreVertical
} from 'lucide-react';
import api from '../../api';

const SuperEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/super/employees');
      setEmployees(response.data || []);
    } catch (err) {
      console.error('Failed to load global employees');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 italic font-black text-xl">
            I
          </div>
          <div>
            <h1 className="text-3xl font-heading font-black text-indigo-900 tracking-tight">Identity Console</h1>
            <p className="text-gray-500 font-medium mt-1 uppercase text-[10px] tracking-widest font-black">Platform-Wide Personnel Monitoring</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-8 group border-l-4 border-l-indigo-600">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <Users size={24} />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Auth Entities</p>
          <h3 className="text-3xl font-heading font-black text-indigo-900">{employees.length.toLocaleString()}</h3>
        </div>
        <div className="card p-8 group border-l-4 border-l-emerald-500">
           <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CheckCircle2 size={24} />
           </div>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Operatives</p>
           <h3 className="text-3xl font-heading font-black text-indigo-900">{employees.filter(e => e.role === 'employee').length}</h3>
        </div>
        <div className="card p-8 group border-l-4 border-l-amber-500">
           <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck size={24} />
           </div>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Client Admins</p>
           <h3 className="text-3xl font-heading font-black text-indigo-900">{employees.filter(e => e.role === 'admin').length}</h3>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-[32px] border border-[#F0EEF8] shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email, or company..."
            className="w-full bg-[#F9F7F4] border-none h-14 rounded-2xl pl-12 pr-4 text-sm font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-100 transition-all border border-transparent focus:border-indigo-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Employees Table */}
      <div className="card !p-0 overflow-hidden shadow-xl shadow-indigo-900/5 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9F7F4] border-b border-[#F0EEF8]">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Operative</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Assigned Node</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Access Role</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEF8]">
              {loading ? (
                <tr><td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-bold animate-pulse">Scanning identity registers...</td></tr>
              ) : filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-[#FAFAFA] group transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-heading font-black text-xs group-hover:scale-110 transition-transform shadow-lg shadow-indigo-100">
                        {emp.name?.[0] || '?'}
                      </div>
                      <div className="flex flex-col">
                         <span className="text-sm font-bold text-indigo-900">{emp.name}</span>
                         <span className="text-[11px] text-gray-400 font-medium">{emp.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <Building2 size={14} className="text-indigo-400" />
                       <span className="text-xs font-bold text-gray-600">{emp.company_name || 'SYSTEM (Super Admin)'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      emp.role === 'admin' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {emp.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right font-mono text-xs text-gray-400 tabular-nums">
                    {new Date(emp.created_at).toLocaleDateString()}
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

export default SuperEmployees;
