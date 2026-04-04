import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  CheckCircle2, 
  Phone, 
  Clock, 
  ChevronRight,
  MoreVertical,
  Plus,
  AlertCircle,
  Calendar,
  MessageCircle,
  History,
  Search,
  Filter,
  CheckCircle,
  X
} from 'lucide-react';
import { followUpApi, leadApi } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const EmployeeFollowUps = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState({ overdue: [], today: [], upcoming: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today');
  const [isProcessing, setIsProcessing] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await followUpApi.getFollowUps();
      const allTasks = res.data;
      
      const now = new Date();
      const today = new Date().setHours(0,0,0,0);
      
      const overdue = allTasks.filter(f => new Date(f.next_followup_date) < now);
      const dueToday = allTasks.filter(f => {
        const d = new Date(f.next_followup_date).setHours(0,0,0,0);
        return d === today && new Date(f.next_followup_date) >= now;
      });
      const upcoming = allTasks.filter(f => new Date(f.next_followup_date).setHours(0,0,0,0) > today);

      setTasks({ overdue, today: dueToday, upcoming });
      if (overdue.length > 0) setActiveTab('overdue');
      else if (dueToday.length === 0 && upcoming.length > 0) setActiveTab('upcoming');
    } catch (err) {
      console.error('Task sync failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDone = async (e, id) => {
    e.stopPropagation();
    setIsProcessing(id);
    try {
      await followUpApi.markAsDone(id);
      fetchTasks();
    } catch (err) {
      console.error('Completion failed');
    } finally {
      setIsProcessing(null);
    }
  };

  const tabs = [
    { id: 'overdue', label: 'Overdue', count: tasks.overdue.length, color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 'today', label: 'Today', count: tasks.today.length, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'upcoming', label: 'Upcoming', count: tasks.upcoming.length, color: 'text-indigo-600', bg: 'bg-indigo-50' }
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
       <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hydrating Timeline...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
         <div>
            <h1 className="text-2xl font-heading font-black text-indigo-900 tracking-tight">Active Interceptions</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Scheduled Deployment Timeline</p>
         </div>
         
         <div className="flex bg-white border border-[#F0EEF8] p-1.5 rounded-2xl shadow-sm overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-400 hover:text-indigo-600'}`}
               >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`w-5 h-5 flex items-center justify-center rounded-lg text-[9px] ${activeTab === tab.id ? 'bg-white/20 text-white' : `${tab.bg} ${tab.color}`}`}>
                       {tab.count}
                    </span>
                  )}
               </button>
            ))}
         </div>
      </header>

      <div className="max-w-4xl mx-auto space-y-4">
         {tasks[activeTab].length === 0 ? (
            <div className="card !p-20 text-center border-dashed border-[#F0EEF8]">
               <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
               </div>
               <h3 className="text-lg font-black text-indigo-950 mb-2">Sector Normalized</h3>
               <p className="text-sm font-medium text-gray-400 leading-relaxed max-w-xs mx-auto italic">
                  Zero pending {activeTab} interceptions detected. Great work, operative.
               </p>
            </div>
         ) : tasks[activeTab].map((task) => (
            <div 
              key={task.id} 
              onClick={() => navigate(`/dashboard/leads/${task.lead_id || task.id}`)}
              className={`card !p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all border-l-4 group hover:bg-gray-50/30 cursor-pointer ${
                activeTab === 'overdue' ? 'border-rose-500 bg-rose-50/10' : 
                activeTab === 'today' ? 'border-amber-500 bg-amber-50/10' : 
                'border-indigo-100'
              }`}
            >
               <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm transition-transform group-hover:scale-110 ${
                    activeTab === 'overdue' ? 'bg-rose-100 text-rose-600' : 
                    activeTab === 'today' ? 'bg-amber-100 text-amber-600' : 
                    'bg-indigo-50 text-indigo-600'
                  }`}>
                     {task.lead_name?.charAt(0) || '?'}
                  </div>
                  <div>
                     <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-black text-indigo-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{task.lead_name || 'Unnamed Lead'}</h3>
                        {activeTab === 'overdue' && <AlertCircle size={14} className="text-rose-500" />}
                     </div>
                     <div className="flex items-center gap-3">
                        <p className="text-xs font-mono font-bold text-gray-400 tracking-tighter">{task.phone_number}</p>
                        <span className="w-1 h-1 bg-gray-200 rounded-full" />
                        <p className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'overdue' ? 'text-rose-600' : 'text-indigo-600'}`}>
                           {activeTab === 'overdue' ? `${Math.floor((new Date() - new Date(task.next_followup_date))/3600000)}h OVERDUE` : new Date(task.next_followup_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <a href={`tel:${task.phone_number}`} onClick={e => e.stopPropagation()} className="flex-1 lg:flex-none px-6 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100 hover:-translate-y-1 transition-all">
                     <Phone size={16} fill="white" /> Intercept
                  </a>
                  <button 
                    onClick={(e) => handleMarkDone(e, task.id)}
                    disabled={isProcessing === task.id}
                    className="flex-1 lg:flex-none px-6 h-12 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all group/btn"
                  >
                     {isProcessing === task.id ? <Clock size={16} className="animate-spin" /> : <CheckCircle2 size={16} className="group-hover/btn:scale-110" />}
                     Resolve
                  </button>
                  <button className="hidden lg:flex w-12 h-12 border border-[#F0EEF8] text-gray-400 rounded-xl items-center justify-center hover:bg-white hover:text-indigo-600 transition-all shadow-sm">
                     <MoreVertical size={18} />
                  </button>
               </div>
            </div>
         ))}
      </div>

      {/* Floating Tactical Intelligence Map Simulation */}
      <div className="fixed bottom-24 lg:bottom-12 right-6 lg:right-12 z-[100]">
         <div className="group relative">
            <div className="absolute -inset-2 bg-indigo-600 rounded-[32px] blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <button className="relative w-16 h-16 bg-indigo-900 rounded-[28px] text-white flex items-center justify-center shadow-2xl border-t-2 border-indigo-700 active:scale-95 transition-transform">
               <Plus size={28} strokeWidth={3} />
            </button>
         </div>
      </div>
    </div>
  );
};

export default EmployeeFollowUps;
