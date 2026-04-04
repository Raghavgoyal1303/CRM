import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MoreVertical, 
  X,
  Copy,
  Calendar,
  User,
  MessageSquare,
  History,
  Phone,
  Filter,
  CheckCircle2,
  ChevronRight,
  Plus,
  MessageCircle,
  LayoutGrid,
  List as ListIcon,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { leadApi } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const EmployeeLeads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(window.innerWidth > 1024 ? 'list' : 'card');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [expandingNoteId, setExpandingNoteId] = useState(null);
  const [quickNote, setQuickNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  useEffect(() => {
    fetchLeads();
    const handleResize = () => {
      if (window.innerWidth > 1024) setViewMode('list');
      else setViewMode('card');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await leadApi.getLeads();
      setLeads(res.data);
    } catch (err) {
      console.error('Lead sync failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e, leadId, status) => {
    e.stopPropagation();
    try {
      await leadApi.updateStatus(leadId, status);
      fetchLeads();
    } catch (err) {
      console.error('Status update failed');
    }
  };

  const handleAddQuickNote = async (leadId) => {
    if (!quickNote.trim()) return;
    setIsSubmittingNote(true);
    try {
      await leadApi.addNote(leadId, quickNote);
      setQuickNote('');
      setExpandingNoteId(null);
      fetchLeads();
    } catch (err) {
      console.error('Quick note failed');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const filteredLeads = leads
    .filter(l => {
      const matchSearch = (l.name || '').toLowerCase().includes(search.toLowerCase()) || l.phone_number.includes(search);
      const matchStatus = statusFilter === 'all' || l.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
      return 0;
    });

  const statusMap = {
    new: { label: 'New', color: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-600' },
    contacted: { label: 'Contacted', color: 'bg-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-600' },
    interested: { label: 'Interested', color: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-600' },
    site_visit: { label: 'Site Visit', color: 'bg-purple-500', bg: 'bg-purple-50', text: 'text-purple-600' },
    closed: { label: 'Closed', color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    lost: { label: 'Lost', color: 'bg-rose-500', bg: 'bg-rose-50', text: 'text-rose-600' }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
         <div className="flex items-center gap-3">
            <h1 className="text-2xl font-heading font-black text-indigo-900 tracking-tight">My Leads</h1>
            <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-1 rounded-full">{filteredLeads.length}</span>
         </div>
         
         <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 lg:w-64">
               <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                 type="text" 
                 placeholder="Search name or phone..."
                 className="w-full bg-white border border-[#F0EEF8] rounded-xl pl-11 pr-4 py-2.5 text-sm font-bold shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
            </div>
            
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              {Object.keys(statusMap).map(k => <option key={k} value={k}>{statusMap[k].label}</option>)}
            </select>

            <div className="hidden lg:flex bg-white border border-[#F0EEF8] rounded-xl p-1 shadow-sm">
               <button 
                 onClick={() => setViewMode('list')}
                 className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
               >
                 <ListIcon size={18} />
               </button>
               <button 
                 onClick={() => setViewMode('card')}
                 className={`p-1.5 rounded-lg transition-all ${viewMode === 'card' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
               >
                 <LayoutGrid size={18} />
               </button>
            </div>
         </div>
      </div>

      {loading ? (
        <div className="py-20 text-center animate-pulse">
           <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scanning Inventory...</p>
        </div>
      ) : viewMode === 'list' ? (
        /* DESKTOP LIST VIEW */
        <div className="card !p-0 overflow-hidden hidden lg:block border-[#F0EEF8] shadow-sm">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-[#FBFBFE] border-b border-[#F0EEF8]">
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Lead Identity</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Communications</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status Phase</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Timeline</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Operations</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                 {filteredLeads.map((lead) => (
                   <tr key={lead.id} onClick={() => navigate(`/dashboard/leads/${lead.id}`)} className="group hover:bg-indigo-50/30 transition-all cursor-pointer">
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${statusMap[lead.status]?.bg} ${statusMap[lead.status]?.text}`}>
                               {lead.name?.charAt(0) || '?'}
                            </div>
                            <div>
                               <p className="text-sm font-black text-indigo-950 group-hover:text-indigo-600 transition-colors">{lead.name || 'Anonymous'}</p>
                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Source: {lead.source || 'Organic'}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                         <p className="text-xs font-mono font-bold text-indigo-900">{lead.phone_number}</p>
                      </td>
                      <td className="px-6 py-5">
                         <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${statusMap[lead.status]?.bg} ${statusMap[lead.status]?.text}`}>
                            {lead.status}
                         </span>
                      </td>
                      <td className="px-6 py-5">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last: {new Date(lead.updated_at).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-5 text-right">
                         <div className="flex items-center justify-end gap-2">
                           <a href={`tel:${lead.phone_number}`} onClick={e => e.stopPropagation()} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all"><Phone size={16} /></a>
                           <a href={`https://wa.me/${lead.phone_number?.replace(/\D/g, '')}`} target="_blank" onClick={e => e.stopPropagation()} className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all"><MessageCircle size={16} /></a>
                           <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-all"><ChevronRight size={18} /></button>
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      ) : (
        /* MOBILE / CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {filteredLeads.map((lead) => (
             <div 
               key={lead.id} 
               onClick={() => navigate(`/dashboard/leads/${lead.id}`)}
               className="card !p-6 space-y-5 group relative overflow-hidden active:scale-[0.98] transition-all bg-white border border-[#F0EEF8]"
             >
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${statusMap[lead.status]?.bg} ${statusMap[lead.status]?.text}`}>
                         {lead.name?.charAt(0) || '?'}
                      </div>
                      <div>
                         <h3 className="text-base font-black text-indigo-950 group-hover:text-indigo-600 transition-colors leading-tight">{lead.name || 'Anonymous'}</h3>
                         <p className="text-xs font-mono font-bold text-gray-400 mt-0.5">{lead.phone_number}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">{new Date(lead.created_at).toLocaleDateString()}</p>
                      <span className={`inline-block mt-2 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${statusMap[lead.status]?.bg} ${statusMap[lead.status]?.text}`}>
                         ● {lead.status}
                      </span>
                   </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Last Note</p>
                   <p className="text-xs font-medium text-indigo-900 italic line-clamp-2">"Budget 80L, wants 3BHK, needs site visit on Sunday."</p>
                </div>

                <div className="flex gap-2">
                   <a href={`tel:${lead.phone_number}`} onClick={e => e.stopPropagation()} className="flex-1 bg-indigo-600 text-white h-12 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100">
                      <Phone size={14} fill="white" /> Call
                   </a>
                   <a href={`https://wa.me/${lead.phone_number?.replace(/\D/g, '')}`} target="_blank" onClick={e => e.stopPropagation()} className="flex-1 border-2 border-indigo-600 text-indigo-600 h-12 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                      <MessageCircle size={14} /> WhatsApp
                   </a>
                   <button 
                     onClick={(e) => { e.stopPropagation(); setExpandingNoteId(expandingNoteId === lead.id ? null : lead.id); }}
                     className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${expandingNoteId === lead.id ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'}`}
                   >
                      <MessageSquare size={18} />
                   </button>
                </div>

                {/* Inline Note Form */}
                <AnimatePresence>
                   {expandingNoteId === lead.id && (
                     <motion.div 
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       onClick={e => e.stopPropagation()}
                       className="overflow-hidden"
                     >
                        <div className="pt-2">
                           <textarea 
                             autoFocus
                             placeholder="Quick note (e.g. Budget 80L, wants 3BHK)..."
                             className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-300 min-h-[80px]"
                             value={quickNote}
                             onChange={(e) => setQuickNote(e.target.value)}
                           />
                           <button 
                             disabled={isSubmittingNote || !quickNote.trim()}
                             onClick={() => handleAddQuickNote(lead.id)}
                             className="w-full mt-2 bg-indigo-600 text-white h-11 rounded-xl text-xs font-black uppercase tracking-widest shadow-md disabled:opacity-50"
                           >
                              {isSubmittingNote ? 'Saving...' : 'Save Intel'}
                           </button>
                        </div>
                     </motion.div>
                   )}
                </AnimatePresence>

                {/* 1-Tap Status Strip */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-gray-100">
                   {Object.keys(statusMap).map(s => (
                     <button
                        key={s}
                        onClick={(e) => handleUpdateStatus(e, lead.id, s)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-tighter whitespace-nowrap transition-all border ${lead.status === s ? 'bg-indigo-900 text-white border-indigo-900 shadow-lg' : 'bg-white text-gray-400 border-[#F0EEF8] hover:border-indigo-200'}`}
                     >
                        {statusMap[s].label}
                     </button>
                   ))}
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeLeads;
