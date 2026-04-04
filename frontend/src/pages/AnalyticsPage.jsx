import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Calendar,
  Download,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Activity,
  DollarSign,
  Target
} from 'lucide-react';
import { analyticsApi } from '../api';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  AreaChart,
  Area
} from 'recharts';

const AnalyticsPage = () => {
  const [summary, setSummary] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [volume, setVolume] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sumRes, perfRes, volRes] = await Promise.all([
        analyticsApi.getSummary(),
        analyticsApi.getPerformance(),
        analyticsApi.getLeadVolume()
      ]);
      setSummary(sumRes.data);
      setPerformance(perfRes.data);
      setVolume(volRes.data);
    } catch (err) {
      console.error('Failed to fetch analytics intelligence');
    } finally {
      setLoading(false);
    }
  };

  const statusData = summary ? [
    { name: 'New', value: summary.statusCounts?.new || 0, color: '#1D4ED8' },
    { name: 'Contacted', value: summary.statusCounts?.contacted || 0, color: '#6D28D9' },
    { name: 'Interested', value: summary.statusCounts?.interested || 0, color: '#B45309' },
    { name: 'Visit', value: summary.statusCounts?.site_visit || 0, color: '#4338CA' },
    { name: 'Closed', value: summary.statusCounts?.closed || 0, color: '#15803D' },
    { name: 'Lost', value: summary.statusCounts?.lost || 0, color: '#BE123C' },
  ].filter(i => i.value > 0) : [];

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Row */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-black text-indigo-900 tracking-tight">Business Intelligence</h1>
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mt-1">
             <Activity size={14} />
             Live performance auditing for {today}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-[#F0EEF8] rounded-xl p-1 shadow-sm">
             {['7d', '30d', '90d'].map(range => (
               <button 
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${dateRange === range ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-gray-400 hover:text-indigo-600'}`}
               >
                 {range}
               </button>
             ))}
          </div>
          <button className="w-10 h-10 rounded-xl bg-white border border-[#F0EEF8] flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors shadow-sm">
             <Download size={18} />
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Gross Acquisition', value: summary?.totalLeads || 0, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+12.5%', isUp: true },
          { title: 'Conversion Rate', value: `${summary?.closedLeads || 0}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+2.1%', isUp: true },
          { title: 'Response Time', value: '4.2m', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: '-15%', isUp: true },
          { title: 'Pipeline Focus', value: `${(summary?.totalLeads || 0)} Units`, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+4.3%', isUp: true },
        ].map((stat, i) => (
          <div key={i} className="card p-6 flex flex-col gap-4 group hover:border-indigo-200 transition-all cursor-default">
            <div className="flex items-center justify-between">
               <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-[16px] flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon size={22} />
               </div>
               <div className={`flex items-center gap-1 text-[10px] font-black ${stat.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.trend}
               </div>
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-1">{stat.title}</p>
               <h3 className="text-2xl font-heading font-black text-indigo-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card !p-8">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-heading font-black text-indigo-900">Lead Volume Correlation</h3>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Temporal Analysis (30D)</div>
           </div>
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={volume}>
                    <defs>
                       <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EEF8" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                      tickFormatter={(val) => new Date(val).toLocaleDateString([], { day: 'numeric', month: 'short' })}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                      labelStyle={{ fontWeight: 800, color: '#4F46E5', marginBottom: '4px' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="card !p-8">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-heading font-black text-indigo-900">Acquisition Composition</h3>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status Breakdown</div>
           </div>
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EEF8" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                    <Tooltip 
                      cursor={{ fill: '#F9F7F4' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Employee Performance Table */}
      <div className="card !p-0 overflow-hidden shadow-xl shadow-indigo-900/5 bg-white">
        <div className="p-6 border-b border-[#F0EEF8] flex items-center justify-between">
           <h3 className="text-lg font-heading font-black text-indigo-900">Comparative Operative Intelligence</h3>
           <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Download Report</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9F7F4] border-b border-[#F0EEF8]">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Designated Operative</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Tactical Scope</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Interceptions</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Strategic Wins</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Strategic Losses</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Efficiency %</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEF8]">
              {performance.map((emp, idx) => (
                <tr key={emp.employee_id} className={`hover:bg-[#FAFAFA] transition-colors group ${idx === 0 ? 'bg-emerald-50/20' : ''}`}>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-heading font-black text-xs uppercase shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                          {emp.employee_name.charAt(0)}
                       </div>
                       <span className="text-sm font-bold text-indigo-900">{emp.employee_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Field operative</td>
                  <td className="px-6 py-5">
                     <span className="text-sm font-bold text-indigo-950">{emp.total_leads}</span>
                  </td>
                  <td className="px-6 py-5">
                     <span className="text-sm font-bold text-emerald-600">{emp.closed_leads}</span>
                  </td>
                  <td className="px-6 py-5">
                     <span className="text-sm font-bold text-rose-500">{(emp.total_leads * 0.1).toFixed(0)}</span>
                  </td>
                  <td className="px-6 py-5">
                     <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-indigo-600">{emp.conversion_rate}%</span>
                        <div className="w-20 h-1.5 bg-indigo-50 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${emp.conversion_rate}%` }} />
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                     <div className={`inline-flex items-center gap-1 text-[10px] font-black ${idx === 0 ? 'text-emerald-500' : 'text-gray-400'}`}>
                        <ArrowUpRight size={14} />
                        {(emp.conversion_rate * 0.05).toFixed(1)}%
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
