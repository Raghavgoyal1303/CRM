import React, { useState, useEffect } from 'react';
import { 
  Award, 
  TrendingUp, 
  Target, 
  Zap, 
  Users, 
  Phone, 
  CheckCircle2, 
  BarChart3,
  Trophy,
  Star,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { analyticsApi } from '../api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

const PerformancePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    setLoading(true);
    try {
      const res = await analyticsApi.getMyPerformance();
      setData(res.data);
    } catch (err) {
      console.error('Performance sync failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
       <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Compiling Analytics...</p>
    </div>
  );

  const stats = [
    { label: 'Conversion Rate', value: `${data?.conversionRate || 0}%`, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50', sub: 'vs 18% avg' },
    { label: 'Personal Rank', value: `#${data?.rank || '-'}`, icon: Award, color: 'text-indigo-600', bg: 'bg-indigo-50', sub: 'In team' },
    { label: 'Total Closures', value: data?.closedLeads || 0, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', sub: 'This month' },
    { label: 'Contact Rate', value: '74%', icon: Phone, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'High effort' },
  ];

  const chartData = [
    { name: 'New', value: data?.statusCounts?.new || 0, color: '#6366f1' },
    { name: 'Contacted', value: data?.statusCounts?.contacted || 0, color: '#8b5cf6' },
    { name: 'Interested', value: data?.statusCounts?.interested || 0, color: '#f59e0b' },
    { name: 'Site Visit', value: data?.statusCounts?.site_visit || 0, color: '#ec4899' },
    { name: 'Closed', value: data?.statusCounts?.closed || 0, color: '#10b981' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header>
         <h1 className="text-2xl font-heading font-black text-indigo-900 tracking-tight">Performance Scorecard</h1>
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Real-time KPI Tracking</p>
      </header>

      {/* Hero Rank Card */}
      <div className="card !p-10 bg-indigo-900 text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
         <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Trophy size={180} />
         </div>
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
               <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-200">
                  <Star size={12} fill="currentColor" /> Top 10% Contributor
               </div>
               <h2 className="text-4xl font-heading font-black tracking-tight leading-tight">
                  You are ranked <span className="text-amber-400">#{data?.rank || '-'}</span> in the <br /> National Sales Team
               </h2>
               <div className="flex gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                     <p className="text-[10px] font-black text-indigo-300 uppercase mb-1">Efficiency</p>
                     <p className="text-2xl font-bold">A+</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                     <p className="text-[10px] font-black text-indigo-300 uppercase mb-1">Target</p>
                     <p className="text-2xl font-bold">82%</p>
                  </div>
               </div>
            </div>
            <div className="flex flex-col items-center lg:items-end">
               <div className="text-[10px] font-black text-indigo-300 uppercase mb-4 tracking-[0.2em]">Monthly Progress</div>
               <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                     <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,254,0.1)" strokeWidth="12" />
                     <circle cx="80" cy="80" r="70" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray={440} strokeDashoffset={440 - (440 * 82) / 100} strokeLinecap="round" className="transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-3xl font-black">82%</span>
                     <span className="text-[9px] font-bold text-indigo-300 uppercase">of goal</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* KPI Chips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         {stats.map((stat, i) => (
           <div key={i} className="card p-6 border-[#F0EEF8] hover:border-indigo-200 transition-all group">
              <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                 <stat.icon size={20} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-indigo-950 mt-1">{stat.value}</h3>
              <p className="text-[9px] font-bold text-emerald-500 mt-2 flex items-center gap-1">
                 <ChevronUp size={12} /> {stat.sub}
              </p>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Funnel Chart */}
         <section className="lg:col-span-2 card border-[#F0EEF8]">
            <header className="flex items-center justify-between mb-8">
               <div>
                  <h2 className="text-base font-heading font-black text-indigo-900">Conversion Pipeline</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Stage Distribution</p>
               </div>
               <BarChart3 size={20} className="text-indigo-200" />
            </header>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EEF8" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                        itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                        cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                     />
                     <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                        {chartData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </section>

         {/* Leaderboard Preview */}
         <section className="card border-[#F0EEF8]">
            <header className="flex items-center justify-between mb-8">
               <div>
                  <h2 className="text-base font-heading font-black text-indigo-900">Team Leaders</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Top Performers</p>
               </div>
               <Trophy size={18} className="text-amber-400" />
            </header>
            
            <div className="space-y-6">
               {(data?.leaderboard || []).map((user, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-gray-50 text-gray-400'}`}>
                        {i + 1}
                     </div>
                     <div className="flex-1">
                        <p className="text-sm font-black text-indigo-950 group-hover:text-indigo-600 transition-colors">Operative {i + 1}</p>
                        <div className="w-full bg-gray-50 h-1 rounded-full mt-1.5 overflow-hidden">
                           <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${user.conversion_rate}%` }} />
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-xs font-black text-indigo-900">{user.conversion_rate}%</p>
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Impact</p>
                     </div>
                  </div>
               ))}
               
               {(!data?.leaderboard || data.leaderboard.length === 0) && (
                 <p className="text-center py-10 text-xs text-gray-400 italic">Leaderboard syncing...</p>
               )}
            </div>

            <button className="w-full mt-10 py-3 rounded-xl bg-[#F9F7F4] text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 transition-all border border-[#F0EEF8]">
               Detailed Rankings
            </button>
         </section>
      </div>
    </div>
  );
};

export default PerformancePage;
