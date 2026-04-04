import React, { useState, useEffect } from 'react';
import { History, Search, Filter, ArrowRight, User, Target, PhoneIncoming, MessageSquare } from 'lucide-react';
import { superApi } from '../../api';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await superApi.getActivity();
        setActivities(res.data || []);
      } catch (err) {
        console.error('Failed to fetch platform activity');
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'lead_created': return { icon: Target, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' };
      case 'status_changed': return { icon: MessageSquare, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
      case 'call_received': return { icon: PhoneIncoming, color: 'text-purple-600 bg-purple-50 border-purple-100' };
      default: return { icon: History, color: 'text-gray-600 bg-gray-50 border-gray-100' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-black text-indigo-900 tracking-tight">Global Activity Feed</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time event stream from all business clusters.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-[#F0EEF8] shadow-sm">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Live Stream</span>
        </div>
      </header>

      <div className="space-y-4">
        {loading ? (
          [1,2,3,4,5].map(i => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-[#F0EEF8]" />)
        ) : activities.length === 0 ? (
          <div className="card p-12 text-center text-gray-400 italic">No recent platform activity.</div>
        ) : activities.map((activity, idx) => {
          const { icon: Icon, color } = getIcon(activity.type);
          return (
            <div key={idx} className="bg-white border border-[#F0EEF8] p-5 rounded-[24px] shadow-sm hover:shadow-md transition-all flex items-center gap-6 group">
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${color}`}>
                 <Icon size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                   <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{activity.company_name}</span>
                   <div className="w-1 h-1 rounded-full bg-gray-300" />
                   <span className="text-xs font-bold text-gray-900">{activity.employee_name}</span>
                </div>
                <p className="text-sm font-medium text-gray-600 truncate">
                  {activity.type === 'lead_created' && `Captured new lead from incoming call for ${activity.company_name}`}
                  {activity.type === 'status_changed' && `Updated status for lead ${activity.lead_phone}`}
                  {activity.type === 'call_received' && `Connected inbound call from ${activity.lead_phone}`}
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                 <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                   {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </div>
                 <div className="text-[9px] font-bold text-indigo-300">
                    {new Date(activity.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFeed;
