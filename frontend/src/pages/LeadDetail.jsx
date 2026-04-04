import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Phone, 
  MessageCircle, 
  Send,
  Clock,
  Calendar,
  History,
  PlayCircle,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Copy,
  Edit2,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { leadApi, followUpApi } from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchLead();
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lead?.notes_log]);

  const fetchLead = async () => {
    try {
      const response = await leadApi.getLead(id);
      setLead(response.data);
      setEditedName(response.data.name || '');
    } catch (err) {
      console.error('Failed to intercept lead intelligence');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      await leadApi.updateStatus(id, status);
      fetchLead();
    } catch (err) {
      console.error('Status shift failed');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setIsSubmittingNote(true);
    try {
      await leadApi.addNote(id, newNote);
      setNewNote('');
      fetchLead();
    } catch (err) {
      console.error('Failed to append intel');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  if (loading) return (
     <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Decrypting Profile...</p>
     </div>
  );
  
  if (!lead) return <div className="p-8 text-center text-rose-500 font-bold">Target coordinates lost. Intelligence unavailable.</div>;

  const statusMap = {
    new: { label: 'New', color: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-600' },
    contacted: { label: 'Contacted', color: 'bg-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-600' },
    interested: { label: 'Interested', color: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-600' },
    site_visit: { label: 'Site Visit', color: 'bg-purple-500', bg: 'bg-purple-50', text: 'text-purple-600' },
    closed: { label: 'Closed', color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    lost: { label: 'Lost', color: 'bg-rose-500', bg: 'bg-rose-50', text: 'text-rose-600' }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 lg:pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Navigation Header */}
      <div className="flex items-center justify-between px-2">
         <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest">
            <ChevronLeft size={18} /> Exit Intelligence
         </button>
         <button className="w-10 h-10 bg-white border border-[#F0EEF8] rounded-xl flex items-center justify-center text-gray-400 hover:text-rose-500 transition-all shadow-sm">
            <Trash2 size={18} />
         </button>
      </div>

      {/* Top Identity Card */}
      <div className="card !p-8 bg-white border border-[#F0EEF8] shadow-sm overflow-visible relative">
         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
               <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center font-black text-2xl shadow-inner ${statusMap[lead.status]?.bg} ${statusMap[lead.status]?.text}`}>
                  {lead.name?.charAt(0) || '?'}
               </div>
               <div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                     <h1 className="text-2xl font-heading font-black text-indigo-900 tracking-tight flex items-center gap-2">
                        {lead.name || 'Anonymous'}
                        <button onClick={() => setIsEditingName(true)} className="text-gray-300 hover:text-indigo-600 p-1">
                           <Edit2 size={16} />
                        </button>
                     </h1>
                     <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusMap[lead.status]?.bg} ${statusMap[lead.status]?.text}`}>
                        {lead.status}
                     </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono font-bold text-gray-400">
                     <span className="flex items-center gap-1.5 text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-md">
                        <Phone size={14} fill="currentColor" /> {lead.phone_number}
                     </span>
                     <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                        <ExternalLink size={14} /> Source: {lead.source || 'Direct'}
                     </span>
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <a href={`tel:${lead.phone_number}`} className="flex-1 lg:flex-none px-6 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:-translate-y-1 transition-all">
                  <Phone size={18} fill="white" /> Call Now
               </a>
               <a href={`https://wa.me/${lead.phone_number?.replace(/\D/g, '')}`} className="flex-1 lg:flex-none px-6 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-100 hover:-translate-y-1 transition-all">
                  <MessageCircle size={18} /> WhatsApp
               </a>
            </div>
         </div>

         {/* Sticky Status Bar (Mobile-first feel) */}
         <div className="flex bg-[#F9F7F4] p-1 rounded-2xl gap-1 mt-8 overflow-x-auto no-scrollbar border border-[#F0EEF8]">
            {Object.keys(statusMap).map(s => (
               <button
                  key={s}
                  onClick={() => handleUpdateStatus(s)}
                  className={`flex-1 min-w-[90px] py-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${lead.status === s ? 'bg-indigo-900 text-white shadow-md' : 'text-gray-400 hover:text-indigo-600 hover:bg-white'}`}
               >
                  {statusMap[s].label}
               </button>
            ))}
         </div>
      </div>

      {/* Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
         <div className="lg:col-span-3 space-y-8">
            {/* Notes Section - Chat UI */}
            <section className="card flex flex-col h-[600px] border-[#F0EEF8] shadow-sm">
               <header className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <h2 className="text-base font-heading font-black text-indigo-900">Intelligence Log</h2>
                     <span className="bg-indigo-50 text-indigo-600 text-[9px] font-black px-2 py-0.5 rounded-md uppercase">Case Repository</span>
                  </div>
                  <History size={20} className="text-indigo-200" />
               </header>

               <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
                  {lead.notes_log?.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                       <MessageCircle size={48} className="mb-4" />
                       <p className="text-xs font-black uppercase tracking-widest">Initial logs empty</p>
                    </div>
                  ) : lead.notes_log?.map((note, idx) => (
                    <div key={idx} className="flex gap-4 group">
                       <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center font-black text-[10px] text-gray-500 shrink-0">
                          {note.employee_name?.charAt(0)}
                       </div>
                       <div className="flex-1">
                          <div className="flex items-baseline gap-2 mb-2">
                             <span className="text-sm font-black text-indigo-950">{note.employee_name || 'Operative'}</span>
                             <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(note.created_at).toLocaleString()}</span>
                          </div>
                          <div className="bg-[#F9F7F4] p-4 rounded-2xl rounded-tl-none border border-gray-100 text-sm font-medium text-indigo-900 leading-relaxed shadow-sm group-hover:bg-white group-hover:border-indigo-100 transition-all">
                             {note.note}
                          </div>
                       </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
               </div>

               <form onSubmit={handleAddNote} className="p-4 bg-gray-50 border-t border-gray-100">
                  <div className="relative">
                     <textarea 
                        className="w-full bg-white border border-[#F0EEF8] rounded-2xl px-5 py-4 pr-16 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-300 min-h-[80px] resize-none shadow-sm"
                        placeholder="Append intelligence message..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                     />
                     <button 
                        type="submit"
                        disabled={isSubmittingNote || !newNote.trim()}
                        className="absolute right-3 bottom-3 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                     >
                        <Send size={18} />
                     </button>
                  </div>
               </form>
            </section>

            {/* Call History Timeline */}
            <section className="card">
               <h2 className="text-base font-heading font-black text-indigo-900 mb-8 px-2">Intercept History</h2>
               <div className="relative pl-8 space-y-12 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                  {lead.call_history?.length === 0 ? (
                    <p className="text-center py-10 text-xs font-bold text-gray-400 italic">No intercept signals recorded.</p>
                  ) : lead.call_history?.map((call, i) => (
                    <div key={i} className="relative">
                       <div className={`absolute -left-[32px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-md z-10 ${call.call_status === 'answered' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                       <div className="bg-white border border-[#F0EEF8] p-5 rounded-3xl flex items-center justify-between hover:border-indigo-200 transition-all shadow-sm">
                          <div className="flex items-center gap-4">
                             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${call.call_status === 'answered' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {call.recording_url ? <PlayCircle size={24} /> : <Phone size={24} />}
                             </div>
                             <div>
                                <p className="text-sm font-black text-indigo-950 capitalize">{call.call_status} Signal</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Duration: {call.duration || '0'}s</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-indigo-900 uppercase">{new Date(call.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                             <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">{new Date(call.timestamp).toLocaleDateString()}</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </section>
         </div>

         <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats Chips */}
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Capture Date', value: new Date(lead.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), icon: Calendar },
                 { label: 'Total Intercepts', value: lead.call_history?.length || 0, icon: Phone },
                 { label: 'Notes Count', value: lead.notes_log?.length || 0, icon: MessageCircle },
                 { label: 'Intelligence Level', value: 'Alpha', icon: AlertCircle },
               ].map((chip, i) => (
                  <div key={i} className="card !p-4 flex items-center gap-3 border-[#F0EEF8]">
                     <div className="w-9 h-9 bg-[#F9F7F4] text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                        <chip.icon size={18} />
                     </div>
                     <div className="min-w-0">
                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest truncate">{chip.label}</div>
                        <div className="text-xs font-black text-indigo-950 truncate">{chip.value}</div>
                     </div>
                  </div>
               ))}
            </div>

            {/* Follow-up Section */}
            <section className="card bg-indigo-900 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Calendar size={120} />
               </div>
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                     <h2 className="text-base font-heading font-black">Next Action Protocol</h2>
                     <Clock size={20} className="text-indigo-400" />
                  </div>
                  
                  <div className="space-y-4">
                     <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-2 block">Scheduled Deployment</label>
                        <div className="bg-white/10 rounded-xl px-4 py-3 flex justify-between items-center border border-white/10">
                           <span className="text-sm font-bold">Tomorrow, 14:00</span>
                           <Calendar size={16} className="text-indigo-300" />
                        </div>
                     </div>
                     <button className="w-full h-12 bg-white text-indigo-900 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg shadow-black/20">
                        Reschedule Signal
                     </button>
                  </div>
               </div>
            </section>

            {/* Target Details / Profile */}
            <section className="card space-y-6 border-[#F0EEF8]">
               <h2 className="text-base font-heading font-black text-indigo-900">Target Intel Profile</h2>
               
               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Identity Name</label>
                     <div className="relative flex items-center">
                        <User size={16} className="absolute left-4 text-gray-400" />
                        <input 
                           type="text" 
                           defaultValue={lead.name}
                           className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                     <input 
                        type="email" 
                        defaultValue={lead.email || 'None provided'}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                     />
                  </div>

                  <div className="pt-4 grid grid-cols-2 gap-3">
                     <button className="h-12 border-2 border-indigo-600 text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all">
                        Update Intel
                     </button>
                     <button className="h-12 bg-gray-100 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all">
                        Reset Data
                     </button>
                  </div>
               </div>
            </section>
         </div>
      </div>
    </div>
  );
};

export default LeadDetail;
