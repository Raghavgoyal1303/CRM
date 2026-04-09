import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Globe,
  Users,
  Building2,
  Calendar,
  ArrowUpRight,
  Activity
} from 'lucide-react';
import api from '../../api';

const SuperAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/super/analytics');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load global analytics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 italic font-black text-xl">
            A
          </div>
          <div>
            <h1 className="text-3xl font-heading font-black text-indigo-900 tracking-tight">Platform Intelligence</h1>
            <p className="text-gray-500 font-medium mt-1 uppercase text-[10px] tracking-widest font-black">Global Growth & Ingestion Velocity</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-center font-bold text-gray-400 animate-pulse">Computing platform-wide growth trends...</div>
      ) : (
        <>
          {/* Main Chart Card */}
          <div className="card p-10 group relative overflow-hidden bg-white border-none shadow-2xl shadow-indigo-900/5">
            <div className="absolute top-0 right-0 p-12 opacity-5">
               <Activity size={200} />
            </div>
            
            <div className="relative z-10 flex items-start justify-between mb-12">
               <div>
                  <h3 className="text-2xl font-black text-indigo-900 italic tracking-tight mb-2">Lead Ingestion Growth</h3>
                  <p className="text-gray-400 font-medium font-mono text-[10px] uppercase tracking-widest">Platform Volume over 12 Months</p>
               </div>
               <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black">
                  <TrendingUp size={16} /> +24% Acceleration
               </div>
            </div>

            <div className="flex items-end gap-3 h-64 px-4 overflow-hidden">
               {stats?.leadGrowth?.map((item, idx) => (
                 <div key={idx} className="flex-1 flex flex-col items-center gap-4 group/bar">
                    <div 
                      className="w-full bg-indigo-50 hover:bg-indigo-600 rounded-t-2xl transition-all duration-500 relative" 
                      style={{ height: `${(item.count / Math.max(...stats.leadGrowth.map(i => i.count))) * 100}%` }}
                    >
                       <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-indigo-900 text-white text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity">
                          {item.count}
                       </div>
                    </div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter whitespace-nowrap rotate-45 mt-2 origin-left">
                       {item.month}
                    </span>
                 </div>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
             <div className="card p-8 border-indigo-50">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <Globe size={20} />
                   </div>
                   <h4 className="text-sm font-black text-indigo-950 uppercase tracking-widest">Company Saturation</h4>
                </div>
                <div className="space-y-6">
                   {[
                     { label: 'Real Estate Builders', value: 65, color: 'bg-indigo-600' },
                     { label: 'Finance & Banking', value: 12, color: 'bg-emerald-500' },
                     { label: 'Education Hubs', value: 18, color: 'bg-amber-500' },
                     { label: 'Other SASS Nodes', value: 5, color: 'bg-rose-500' },
                   ].map((item, idx) => (
                     <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-tight">
                           <span className="text-gray-500">{item.label}</span>
                           <span className="text-indigo-900">{item.value}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                           <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="card p-8 border-emerald-50 bg-[#F9FEFA]">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                      <Building2 size={20} />
                   </div>
                   <h4 className="text-sm font-black text-emerald-950 uppercase tracking-widest">Platform Efficiency</h4>
                </div>
                <div className="flex flex-col items-center justify-center h-full pb-8">
                   <div className="w-32 h-32 rounded-full border-[10px] border-emerald-100 flex items-center justify-center relative">
                      <div className="text-center">
                         <p className="text-3xl font-black text-emerald-600">99.9</p>
                         <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Uptime</p>
                      </div>
                      <div className="absolute inset-0 border-[10px] border-emerald-500 rounded-full border-t-transparent animate-spin-slow" />
                   </div>
                   <p className="text-xs text-emerald-600/60 font-medium mt-6 text-center max-w-[200px]">Strategic heartbeat monitoring across all active company nodes.</p>
                </div>
             </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SuperAnalytics;
