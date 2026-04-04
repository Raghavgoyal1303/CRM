import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  Target,
  Zap,
  Activity,
  Award,
  Users,
  ChevronRight,
  Bell,
  X,
  AlertCircle
} from 'lucide-react';
import { leadApi, analyticsApi, followUpApi, activityApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [priorityItems, setPriorityItems] = useState({ overdue: [], today: [], upcoming: [] });
  const [activeTab, setActiveTab] = useState('today');
  const [activity, setActivity] = useState([]);
  const [newLeads, setNewLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewAlert, setShowNewAlert] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  if (!user) return null;

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [perfRes, followRes, activityRes, leadsRes] = await Promise.all([
        analyticsApi.getMyPerformance(),
        followUpApi.getFollowUps(),
        activityApi.getMyActivity(),
        leadApi.getLeads()
      ]);

      setStats(perfRes.data);
      setActivity(activityRes.data);
      
      // Categorize follow-ups
      const now = new Date();
      const today = new Date().setHours(0,0,0,0);
      
      const overdue = followRes.data?.filter(f => new Date(f.next_followup_date) < now) || [];
      const dueToday = followRes.data?.filter(f => {
        const d = new Date(f.next_followup_date).setHours(0,0,0,0);
        return d === today && new Date(f.next_followup_date) >= now;
      }) || [];
      const upcoming = followRes.data?.filter(f => new Date(f.next_followup_date).setHours(0,0,0,0) > today) || [];

      setPriorityItems({ overdue, today: dueToday, upcoming });

      // Check for new leads in last 1 hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const freshLeads = leadsRes.data?.filter(l => new Date(l.created_at) > oneHourAgo) || [];
      setNewLeads(freshLeads);

    } catch (err) {
      console.error('Tactical sync failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hydrating Dashboard...</p>
      </div>
    );
  }

  const statChips = [
    { label: 'My Leads', value: stats?.totalLeads || 0, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: 'Total assigned' },
    { label: 'Due Today', value: priorityItems.today.length + priorityItems.overdue.length, icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50', trend: 'Pending' },
    { label: 'Contacted', value: stats?.contactedLeads || 0, icon: Phone, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'This week' },
    { label: 'Closed', value: stats?.closedLeads || 0, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'This month' },
  ];

  const pipeline = [
    { label: 'New', count: stats?.statusCounts?.new || 0, color: 'bg-blue-500' },
    { label: 'Contacted', count: stats?.statusCounts?.contacted || 0, color: 'bg-purple-500' },
    { label: 'Interested', count: stats?.statusCounts?.interested || 0, color: 'bg-amber-500' },
    { label: 'Site Visit', count: stats?.statusCounts?.site_visit || 0, color: 'bg-indigo-500' },
    { label: 'Closed', count: stats?.statusCounts?.closed || 0, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* New Lead Alert Banner */}
      <AnimatePresence>
        {newLeads.length > 0 && showNewAlert && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-xl flex items-center justify-between shadow-lg shadow-indigo-900/5">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
                     <Bell size={20} className="animate-bounce" />
                  </div>
                  <div>
                     <p className="text-sm font-black text-indigo-900">
                        {newLeads.length === 1 
                          ? `New lead assigned — ${newLeads[0].phone_number || 'Unnamed'}` 
                          : `${newLeads.length} new leads assigned to you`}
                     </p>
                     <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-0.5 hover:underline decoration-2">
                        View Lead{newLeads.length > 1 ? 's' : ''} →
                     </button>
                  </div>
               </div>
               <button onClick={() => setShowNewAlert(false)} className="text-gray-400 hover:text-indigo-600 p-1">
                  <X size={18} />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* My Numbers Stat Chips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statChips.map((chip, i) => (
          <div key={i} className="card p-5 group hover:border-indigo-200 transition-all cursor-default">
             <div className={`w-10 h-10 ${chip.bg} ${chip.color} rounded-xl flex items-center justify-center mb-4`}>
                <chip.icon size={20} />
             </div>
             <div className="text-2xl font-heading font-black text-indigo-900 mb-1">{chip.value}</div>
             <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{chip.label}</div>
             <div className="text-[9px] font-bold text-gray-300 mt-2">{chip.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Priority List */}
          <section className="card !p-0 overflow-hidden">
             <header className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                   <h2 className="text-base font-heading font-black text-indigo-900">Today's Action Items</h2>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Critical Tasks</p>
                </div>
                <div className="flex bg-[#F9F7F4] p-1 rounded-xl gap-1">
                   {[
                     { id: 'overdue', label: 'Overdue', count: priorityItems.overdue.length, color: 'text-rose-600' },
                     { id: 'today', label: 'Due Today', count: priorityItems.today.length, color: 'text-amber-600' },
                     { id: 'upcoming', label: 'Upcoming', count: priorityItems.upcoming.length, color: 'text-gray-400' }
                   ].map(tab => (
                     <button
                       key={tab.id}
                       onClick={() => setActiveTab(tab.id)}
                       className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-white text-indigo-900 shadow-sm' : 'text-gray-400'}`}
                     >
                       {tab.label}
                       {tab.count > 0 && <span className={`w-1.5 h-1.5 rounded-full ${tab.color.replace('text', 'bg')}`} />}
                     </button>
                   ))}
                </div>
             </header>

             <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
                {priorityItems[activeTab].length === 0 ? (
                  <div className="p-20 text-center space-y-3">
                     <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto">
                        <CheckCircle2 size={32} />
                     </div>
                     <p className="text-xs font-bold text-gray-400 italic">No tasks in this category. Great work!</p>
                  </div>
                ) : priorityItems[activeTab].map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`p-6 border-l-4 transition-all hover:bg-gray-50/50 ${
                      activeTab === 'overdue' ? 'border-rose-500 bg-rose-50/30' : 
                      activeTab === 'today' ? 'border-amber-500 bg-amber-50/20' : 
                      'border-indigo-100 bg-white'
                    }`}
                  >
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              {activeTab === 'overdue' && <AlertCircle size={14} className="text-rose-500" />}
                              <h3 className="font-black text-indigo-900">{item.lead_name || 'Unnamed Lead'}</h3>
                           </div>
                           <p className="font-mono text-xs font-bold text-gray-400">{item.phone_number}</p>
                        </div>
                        <div className="text-right">
                           <p className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'overdue' ? 'text-rose-600' : 'text-amber-600'}`}>
                              {activeTab === 'overdue' ? `Due ${new Date(item.next_followup_date).getHours()}h ago` : `Today ${new Date(item.next_followup_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                           </p>
                           <p className="text-[10px] text-gray-400 font-bold mt-0.5 italic">"Wants 3BHK, budget 80L"</p>
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <a href={`tel:${item.phone_number}`} className="flex-1 bg-indigo-600 text-white h-10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:-translate-y-0.5 transition-all">
                           <Phone size={14} fill="white" /> Call Now
                        </a>
                        <a href={`https://wa.me/${item.phone_number?.replace(/\D/g, '')}`} target="_blank" className="flex-1 border-2 border-indigo-600 text-indigo-600 h-10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all">
                           <MessageCircle size={14} /> WhatsApp
                        </a>
                        <button className="px-4 border-2 border-emerald-500 text-emerald-600 h-10 rounded-xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all">
                           <CheckCircle2 size={16} />
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </section>

          {/* My Lead Pipeline Funnel */}
          <section className="card">
             <div className="flex items-center justify-between mb-8">
                <div>
                   <h2 className="text-base font-heading font-black text-indigo-900">My Pipeline</h2>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Distribution Visualization</p>
                </div>
                <TrendingUp size={24} className="text-indigo-200" />
             </div>
             
             <div className="flex h-12 w-full rounded-2xl overflow-hidden shadow-inner bg-gray-50 border border-gray-100">
                {pipeline.map((stage, i) => {
                  const pct = stats?.totalLeads > 0 ? (stage.count / stats.totalLeads) * 100 : 0;
                  return (
                    <div 
                      key={i} 
                      style={{ width: `${pct}%` }} 
                      className={`${stage.color} h-full transition-all duration-700 relative group`}
                    >
                       {stage.count > 0 && (
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 text-[9px] font-black text-white">
                            {stage.count}
                         </div>
                       )}
                    </div>
                  );
                })}
             </div>
             
             <div className="grid grid-cols-5 gap-2 mt-4">
                {pipeline.map((stage, i) => (
                  <div key={i} className="text-center">
                     <div className="text-[11px] font-black text-indigo-950">{stage.count}</div>
                     <div className="text-[8px] font-black text-gray-400 uppercase tracking-tighter truncate">{stage.label}</div>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* Side Column: Activity Feed */}
        <section className="card h-fit sticky top-24">
           <div className="flex items-center justify-between mb-8">
              <div>
                 <h2 className="text-base font-heading font-black text-indigo-900">Activity</h2>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Real-time Intel</p>
              </div>
              <Activity size={20} className="text-indigo-200" />
           </div>

           <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-50">
              {activity.length === 0 ? (
                <p className="text-center text-xs text-gray-400 italic">No recent activity detected.</p>
              ) : activity.map((item, i) => (
                <div key={i} className="flex gap-4 relative">
                   <div className={`w-3.5 h-3.5 rounded-full z-10 border-4 border-white mt-1 shadow-sm ${
                     item.type === 'call' ? 'bg-indigo-600' : 
                     item.type === 'note' ? 'bg-amber-500' : 'bg-emerald-500'
                   }`} />
                   <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-900 font-medium leading-relaxed">
                        <span className="font-black text-indigo-900">You</span> {item.type === 'call' ? 'called' : item.action} <span className="font-bold">{item.lead_name || 'a lead'}</span>
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                   </div>
                </div>
              ))}
           </div>
           
           <button className="w-full mt-10 py-3 rounded-xl bg-gray-50 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 transition-all">
              Full History
           </button>
        </section>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
