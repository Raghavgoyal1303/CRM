import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  X,
  Copy,
  Calendar,
  User,
  Users,
  MessageSquare,
  History,
  TrendingUp,
  Phone,
  Filter,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { leadApi, employeeApi } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import AddLeadModal from '../components/leads/AddLeadModal';

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    employee: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, empsRes] = await Promise.all([
        leadApi.getAll(),
        employeeApi.getAll()
      ]);
      setLeads(leadsRes.data);
      setEmployees(empsRes.data);
    } catch (err) {
      console.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDrawer = async (leadId) => {
    setSelectedLeadId(leadId);
    setDrawerLoading(true);
    try {
      const res = await leadApi.getOne(leadId);
      setSelectedLead(res.data);
    } catch (err) {
      console.error('Failed to load lead details');
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      await leadApi.updateStatus(selectedLeadId, status);
      const res = await leadApi.getOne(selectedLeadId);
      setSelectedLead(res.data);
      fetchData(); // Refresh list background
    } catch (err) {
      console.error('Status update failed');
    }
  };

  const handleAssignLead = async (employeeId) => {
    try {
      await leadApi.assignLead(selectedLeadId, employeeId);
      const res = await leadApi.getOne(selectedLeadId);
      setSelectedLead(res.data);
      fetchData(); // Refresh list background
    } catch (err) {
      console.error('Assignment failed');
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setIsSubmittingNote(true);
    try {
      await leadApi.addNote(selectedLeadId, newNote);
      setNewNote('');
      const res = await leadApi.getOne(selectedLeadId);
      setSelectedLead(res.data);
    } catch (err) {
      console.error('Failed to add note');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const filteredLeads = leads.filter(l => {
    const term = filters.search.toLowerCase();
    const matchesSearch = l.phone_number.includes(term) || (l.name || '').toLowerCase().includes(term);
    const matchesStatus = !filters.status || l.status === filters.status;
    const matchesEmployee = !filters.employee || l.assigned_to === filters.employee;
    return matchesSearch && matchesStatus && matchesEmployee;
  });

  const statusColors = {
    new: 'bg-blue-50 text-blue-600',
    contacted: 'bg-purple-50 text-purple-600',
    interested: 'bg-amber-50 text-amber-600',
    site_visit: 'bg-indigo-50 text-indigo-600',
    closed: 'bg-emerald-50 text-emerald-600',
    lost: 'bg-rose-50 text-rose-600',
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-heading font-black text-indigo-900 tracking-tight">Lead Repository</h1>
          <div className="px-3 py-1 bg-white border border-[#F0EEF8] rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest shadow-sm">
             {filteredLeads.length} Records Found
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary h-11 px-6 flex items-center gap-2 shadow-lg shadow-indigo-100 font-bold text-sm"
        >
          <Plus size={18} />
          <span>Add Lead Manually</span>
        </button>
      </div>

      <AddLeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData} 
      />

      {/* Filter Bar */}
      <div className="card !p-4 flex flex-wrap items-center gap-4 border-dashed bg-white/50">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by phone number or client name..."
            className="w-full bg-white border border-[#F0EEF8] rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-indigo-500"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Statuses</option>
            {Object.keys(statusColors).map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
          </select>
          <select 
            className="bg-white border border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-indigo-500"
            value={filters.employee}
            onChange={(e) => setFilters(prev => ({ ...prev, employee: e.target.value }))}
          >
            <option value="">All Operatives</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <button 
            onClick={() => setFilters({ search: '', status: '', employee: '' })}
            className="text-xs font-black text-indigo-600 hover:bg-indigo-50 px-4 py-3 rounded-xl transition-colors uppercase tracking-widest"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="card !p-0 overflow-hidden shadow-xl shadow-indigo-900/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9F7F4] border-b border-[#F0EEF8]">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Identity & Contact</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Source Channel</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Lead Owner</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status Brief</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Timestamp</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEF8]">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-20 text-center text-gray-400 font-bold animate-pulse italic">Establishing lead data tunnel...</td></tr>
              ) : filteredLeads.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-20 text-center text-gray-400 font-bold italic">No intelligence records match your parameters.</td></tr>
              ) : filteredLeads.map((lead) => (
                <tr 
                  key={lead.id} 
                  onClick={() => handleOpenDrawer(lead.id)}
                  className="hover:bg-[#FAFAFA] group cursor-pointer transition-colors"
                >
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-indigo-900">{lead.name || 'Anonymous Client'}</span>
                       <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xs font-mono text-gray-400 select-all">{lead.phone_number}</span>
                          <Copy size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 transition-colors">
                          <Filter size={12} />
                       </div>
                       <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{lead.source || 'Call'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-[10px]">
                          {lead.assigned_employee_name?.charAt(0) || 'U'}
                       </div>
                       <span className="text-xs font-medium text-gray-600">{lead.assigned_employee_name || 'Rotational Pool'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`badge ${statusColors[lead.status]} text-[10px] font-black uppercase tracking-widest`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 font-bold">
                       <Calendar size={14} className="text-gray-300" />
                       {lead?.created_at ? new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Pending'}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-gray-300 hover:text-indigo-600 transition-colors">
                       <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedLeadId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLeadId(null)}
              className="fixed inset-0 bg-indigo-900/20 backdrop-blur-[4px] z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-[520px] bg-white shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.1)] z-[70] flex flex-col"
            >
              <div className="p-8 border-b border-[#F0EEF8] flex items-center justify-between bg-[#F9F7F4]/50">
                <div>
                   <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-heading font-black text-indigo-900 tracking-tight">{selectedLead?.phone_number || 'Lead Details'}</h2>
                      {selectedLead && (
                        <span className={`badge ${statusColors[selectedLead.status]} text-[10px] font-black uppercase`}>
                          {selectedLead.status}
                        </span>
                      )}
                   </div>
                   <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest">Tactical Profile Intelligence</p>
                </div>
                <button 
                  onClick={() => setSelectedLeadId(null)}
                  className="w-10 h-10 rounded-full hover:bg-white hover:shadow-sm flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {drawerLoading ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                     <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                     <p className="text-sm font-bold text-gray-400 italic">Decrypting lead documentation...</p>
                  </div>
                ) : selectedLead && (
                  <>
                    {/* Identification */}
                    <div className="space-y-4">
                       <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <User size={14} className="text-indigo-600" /> Basic Identification
                       </h3>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-[#F9F7F4] rounded-[20px] border border-[#F0EEF8]">
                             <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Assigned Name</p>
                             <p className="text-sm font-bold text-indigo-900">{selectedLead.name || 'Anonymous'}</p>
                          </div>
                          <div className="p-4 bg-[#F9F7F4] rounded-[20px] border border-[#F0EEF8]">
                             <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Acquisition Source</p>
                             <p className="text-sm font-bold text-indigo-900 uppercase tracking-tighter">{selectedLead.source || 'Call Direct'}</p>
                          </div>
                       </div>
                    </div>

                    {/* Controls */}
                    <div className="space-y-6 pt-2">
                       <div className="space-y-4">
                          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                             <Users size={14} className="text-indigo-600" /> Administrative Controls
                          </h3>
                          <div className="space-y-3">
                             <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase block mb-2">Reassign Designated Operative</label>
                                <select 
                                  className="w-full bg-white border-2 border-dashed border-[#F0EEF8] hover:border-indigo-200 transition-colors rounded-[16px] px-4 py-3 text-sm font-bold text-indigo-900 outline-none"
                                  value={selectedLead.assigned_to || ''}
                                  onChange={(e) => handleAssignLead(e.target.value)}
                                >
                                  <option value="">Unassigned (Round Robin Pool)</option>
                                  {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.role})</option>)}
                                </select>
                             </div>
                             <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase block mb-2">Shift Tactical Status</label>
                                <div className="grid grid-cols-3 gap-2">
                                   {Object.keys(statusColors).map(s => (
                                     <button
                                      key={s}
                                      onClick={() => handleUpdateStatus(s)}
                                      className={`px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${selectedLead.status === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 ring-2 ring-indigo-200' : 'bg-white border border-[#F0EEF8] text-gray-400 hover:border-indigo-300 hover:text-indigo-600'}`}
                                     >
                                        {s}
                                     </button>
                                   ))}
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Intelligence Feed */}
                    <div className="space-y-4">
                       <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <MessageSquare size={14} className="text-indigo-600" /> Intelligence Feed
                       </h3>
                       <div className="space-y-4">
                          {selectedLead.notes_log?.map((note, idx) => (
                            <div key={idx} className="flex gap-4 items-start">
                               <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-[10px] flex-shrink-0">
                                  {note?.employee_name?.charAt(0) || '?'}
                               </div>
                               <div className="flex-1 bg-[#F9F7F4] rounded-[20px] p-4 border border-[#F0EEF8]">
                                  <div className="flex items-center justify-between mb-1">
                                     <span className="text-[10px] font-black text-indigo-600 uppercase">{note.employee_name}</span>
                                     <span className="text-[9px] text-gray-400 font-bold">{new Date(note.created_at).toLocaleString()}</span>
                                  </div>
                                  <p className="text-sm text-indigo-950 leading-relaxed font-medium">{note.note}</p>
                               </div>
                            </div>
                          ))}
                          {(!selectedLead.notes_log || selectedLead.notes_log.length === 0) && (
                            <div className="text-center py-6 border-2 border-dashed border-[#F0EEF8] rounded-[20px] text-gray-400 text-xs italic">
                               No entries in intelligence log.
                            </div>
                          )}
                       </div>
                       
                       <div className="pt-4">
                          <textarea 
                            className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-[20px] px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none min-h-[100px]"
                            placeholder="Append new intelligence entry..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                          />
                          <button 
                            onClick={handleAddNote}
                            disabled={isSubmittingNote || !newNote.trim()}
                            className="w-full mt-3 btn-primary py-4 rounded-[16px] text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-50 disabled:opacity-50"
                          >
                             {isSubmittingNote ? 'COMMITTING...' : 'Append Intelligence'}
                          </button>
                       </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-4 pb-10">
                       <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <History size={14} className="text-indigo-600" /> Capture Timeline
                       </h3>
                       <div className="space-y-0 relative border-l-2 border-[#F0EEF8] ml-2 pl-6">
                          {selectedLead.call_history?.map((call, idx) => (
                            <div key={idx} className="relative mb-6 last:mb-0">
                               <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-white border-2 border-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]" />
                               <div className="p-4 bg-white border border-[#F0EEF8] rounded-[20px] hover:border-indigo-200 transition-all group">
                                  <div className="flex items-center justify-between">
                                     <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${call.call_status === 'answered' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                           <Phone size={14} />
                                        </div>
                                        <div>
                                           <p className="text-xs font-black text-indigo-900 uppercase tracking-tighter">
                                              Incoming {call.call_status}
                                           </p>
                                           <p className="text-[10px] text-gray-400 font-bold">
                                              {new Date(call.timestamp).toLocaleString()} • {call.duration}s
                                           </p>
                                        </div>
                                     </div>
                                     {call.recording_url && (
                                       <button className="p-2 text-indigo-400 hover:text-indigo-600 bg-indigo-50/0 hover:bg-indigo-50 rounded-lg transition-all">
                                          <TrendingUp size={16} />
                                       </button>
                                     )}
                                  </div>
                               </div>
                            </div>
                          ))}
                          {(!selectedLead.call_history || selectedLead.call_history.length === 0) && (
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pl-2">
                               No captured communication events.
                            </div>
                          )}
                       </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeadsPage;
