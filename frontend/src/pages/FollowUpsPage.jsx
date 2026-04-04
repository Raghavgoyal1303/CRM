import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, 
  Phone, 
  Clock, 
  ChevronRight,
  MoreVertical,
  Plus,
  AlertCircle,
  Calendar,
  RefreshCcw
} from 'lucide-react';
import { followUpApi } from '../api';
import { useAuth } from '../context/AuthContext';

const FollowUpsPage = () => {
  const { user } = useAuth();
  const [todayTasks, setTodayTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const [todayRes, upcomingRes] = await Promise.all([
        followUpApi.getFollowUps({ today: true }),
        followUpApi.getFollowUps({ upcoming: true })
      ]);
      setTodayTasks(todayRes.data || []);
      setUpcomingTasks(upcomingRes.data || []);
    } catch (err) {
      console.error('Failed to fetch follow-ups');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDone = async (id) => {
    setIsProcessing(id);
    try {
      await followUpApi.markAsDone(id);
      await fetchTasks();
    } catch (err) {
      console.error('Completion action failed');
    } finally {
      setIsProcessing(null);
    }
  };

  const todayStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  // Group upcoming by date
  const groupedUpcoming = upcomingTasks.reduce((acc, task) => {
    const date = new Date(task.next_followup_date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {});

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Row */}
      <header className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-heading font-black text-indigo-900 tracking-tight flex items-center gap-3">
            Strategy Timeline
            {todayTasks.length > 0 && (
              <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-rose-100">
                {todayTasks.length} CRITICAL TODAY
              </span>
            )}
          </h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mt-1">
             <Calendar size={14} />
             {todayStr}
          </div>
        </div>
        <button className="btn-primary h-11 px-6 flex items-center gap-2 shadow-lg shadow-indigo-100 font-bold text-sm">
          <Plus size={18} />
          <span>Schedule New Strategy</span>
        </button>
      </header>

      {/* Today Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 ml-1">
           <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle size={18} />
           </div>
           <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest">Priority Area: Due Today</h3>
           <div className="flex-1 h-px bg-amber-100/50" />
        </div>

        <div className="card !p-0 overflow-hidden border-amber-100 shadow-xl shadow-amber-900/5 bg-white">
          <div className="bg-[#FFFBEB] px-6 py-3 border-b border-amber-100 flex items-center justify-between">
            <span className="text-[10px] font-black text-amber-700 uppercase tracking-[0.2em]">High Churn Risk Area</span>
            <span className="text-xs font-bold text-amber-600 bg-white px-3 py-1 rounded-full border border-amber-100 italic shadow-sm">Immediate Intel Needed</span>
          </div>
          
          <div className="divide-y divide-[#F0EEF8]">
            {loading ? (
              <div className="p-20 text-center text-gray-400 font-bold animate-pulse">Syncing prioritized timeline...</div>
            ) : todayTasks.length === 0 ? (
              <div className="p-20 text-center">
                 <CheckCircle2 size={48} className="mx-auto text-emerald-100 mb-4" />
                 <p className="text-sm font-bold text-gray-400">All prioritized interceptions for today have been cleared.</p>
              </div>
            ) : todayTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-6 hover:bg-[#FAFAFA] transition-all group">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 rounded-[20px] bg-indigo-600 text-white flex items-center justify-center font-heading font-black text-sm shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                      {task.lead_name?.charAt(0) || 'L'}
                   </div>
                   <div>
                      <div className="text-sm font-bold text-indigo-900">{task.lead_name}</div>
                      <div className="text-[11px] font-mono text-gray-400 tracking-tighter mt-1">{task.phone_number}</div>
                   </div>
                </div>

                <div className="flex items-center gap-12">
                   <div className="flex items-center gap-3 text-gray-400 group-hover:text-indigo-600 transition-colors">
                      <Clock size={16} />
                      <span className="text-xs font-black uppercase tracking-widest">
                        {new Date(task.next_followup_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                   </div>

                   <div className="flex items-center gap-3 pl-8 border-l border-[#F0EEF8]">
                      <button 
                        onClick={() => handleMarkDone(task.id)}
                        disabled={isProcessing === task.id}
                        className="btn-outline h-10 px-6 border-[#F0EEF8] text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                         {isProcessing === task.id ? <RefreshCcw size={14} className="animate-spin" /> : 'Mark Done'}
                      </button>
                      <button className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100 hover:scale-110 transition-all">
                         <Phone size={18} fill="currentColor" />
                      </button>
                      <button className="p-2 text-gray-300 hover:text-indigo-600 transition-colors">
                         <MoreVertical size={20} />
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Section */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-3 ml-1">
           <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar size={18} />
           </div>
           <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest">Grouped Timeline: Upcoming</h3>
           <div className="flex-1 h-px bg-indigo-100/50" />
        </div>

        {Object.keys(groupedUpcoming).length === 0 && !loading && (
          <div className="text-center py-12 text-gray-400 text-sm font-bold italic">No upcoming strategy assignments in the queue.</div>
        )}

        {Object.keys(groupedUpcoming).map((date, i) => (
          <div key={i} className="space-y-4">
            <div className="flex items-center gap-4 ml-1">
               <span className="text-[11px] font-black text-indigo-600 px-4 py-1.5 bg-indigo-50 rounded-full border border-indigo-100 uppercase tracking-wider shadow-sm">
                  {date === todayStr ? 'Today' : date}
               </span>
            </div>
            
            <div className="card !p-0 overflow-hidden shadow-xl shadow-indigo-900/5 bg-white">
               <div className="divide-y divide-[#F0EEF8]">
                  {groupedUpcoming[date].map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-5 hover:bg-[#FAFAFA] transition-all group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                             {task.lead_name?.charAt(0)}
                          </div>
                          <div>
                             <div className="text-sm font-bold text-indigo-900">{task.lead_name}</div>
                             <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{task.phone_number}</div>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="px-3 py-1.5 bg-white border border-[#F0EEF8] rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:border-indigo-200 group-hover:text-indigo-600 transition-all">
                             {new Date(task.next_followup_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-600 transition-all" />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowUpsPage;
