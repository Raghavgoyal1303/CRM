import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Search, 
  Filter, 
  Download, 
  ShieldCheck, 
  Building2,
  Calendar,
  Phone,
  ArrowUpRight,
  TrendingUp,
  Globe
} from 'lucide-react';
import api from '../../api';

const SuperLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompany, setFilterCompany] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await api.get('/super/leads');
      setLeads(response.data || []);
    } catch (err) {
      console.error('Failed to load global leads');
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         lead.phone_number?.includes(searchTerm);
    const matchesCompany = filterCompany === '' || lead.company_name === filterCompany;
    return matchesSearch && matchesCompany;
  });

  const uniqueCompanies = [...new Set(leads.map(l => l.company_name))];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 italic font-black text-xl">
            L
          </div>
          <div>
            <h1 className="text-3xl font-heading font-black text-indigo-900 tracking-tight">Global Lead Repository</h1>
            <p className="text-gray-500 font-medium mt-1 uppercase text-[10px] tracking-widest font-black">Unified Cross-Tenant Oversight</p>
          </div>
        </div>
        <div className="flex gap-4">
           <button className="bg-white text-indigo-900 px-6 py-3 rounded-2xl flex items-center gap-2 font-black uppercase tracking-widest text-[10px] shadow-sm border border-gray-100 hover:shadow-lg transition-all">
              <Download size={18} /> Export Master List
           </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-8 group border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between mb-4">
             <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe size={24} />
             </div>
             <TrendingUp className="text-emerald-500" size={20} />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Network Leads</p>
          <h3 className="text-3xl font-heading font-black text-indigo-900">{leads.length.toLocaleString()}</h3>
        </div>
        <div className="card p-8 group border-l-4 border-l-emerald-500">
           <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building2 size={24} />
           </div>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Client Nodes</p>
           <h3 className="text-3xl font-heading font-black text-indigo-900">{uniqueCompanies.length}</h3>
        </div>
        <div className="card p-8 group border-l-4 border-l-amber-500">
           <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ArrowUpRight size={24} />
           </div>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Capture Velocity</p>
           <h3 className="text-3xl font-heading font-black text-indigo-900">High</h3>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-[32px] border border-[#F0EEF8] shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex-1 relative min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search leads by name or phone..."
            className="w-full bg-[#F9F7F4] border-none h-14 rounded-2xl pl-12 pr-4 text-sm font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-100 transition-all border border-transparent focus:border-indigo-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select 
          className="bg-[#F9F7F4] border-none h-14 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-[#6B7280] focus:ring-2 focus:ring-indigo-100 cursor-pointer min-w-[200px]"
          value={filterCompany}
          onChange={(e) => setFilterCompany(e.target.value)}
        >
          <option value="">All Companies</option>
          {uniqueCompanies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Leads Table */}
      <div className="card !p-0 overflow-hidden shadow-xl shadow-indigo-900/5 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9F7F4] border-b border-[#F0EEF8]">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Origin Node</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Captured</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEF8]">
              {loading ? (
                <tr><td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-bold animate-pulse">Syncing platform leads...</td></tr>
              ) : filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-[#FAFAFA] group transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-heading font-black text-xs group-hover:scale-110 transition-transform">
                        {lead.full_name?.[0] || 'L'}
                      </div>
                      <div className="flex flex-col">
                         <span className="text-sm font-bold text-indigo-900">{lead.full_name}</span>
                         <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
                           <Phone size={10} /> {lead.phone_number}
                         </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <Building2 size={14} className="text-indigo-400" />
                       <span className="text-xs font-bold text-gray-600">{lead.company_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      lead.status === 'closed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex flex-col items-end">
                       <span className="text-xs font-bold text-gray-900">{new Date(lead.created_at).toLocaleDateString()}</span>
                       <span className="text-[10px] text-gray-400 font-medium">{new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && !loading && (
                <tr>
                   <td colSpan="4" className="px-8 py-20 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <Target size={32} />
                      </div>
                      <p className="text-gray-400 font-bold">No leads found across the network.</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperLeads;
