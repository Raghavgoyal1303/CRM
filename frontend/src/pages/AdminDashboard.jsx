import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { analyticsApi, leadApi, followUpApi } from '../api';
import { 
  Users, 
  PhoneIncoming, 
  Target, 
  PhoneMissed, 
  RefreshCcw,
  ArrowRight,
  Phone,
  Zap,
  Bell,
  Calendar,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Ticket,
  ExternalLink
} from 'lucide-react';
import axios from 'axios';
import AttendancePanel from '../components/attendance/AttendancePanel';

const AdminDashboard = () => {
  const auth = useAuth() || {};
  const { user } = auth;
  const [summary, setSummary] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (user?.company_id) {
      fetchData();
    }
  }, [user]);

  if (!user) return null;

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const [sumRes, perfRes, leadsRes, followRes] = await Promise.all([
        analyticsApi.getDashboard(),
        analyticsApi.getPipeline(),
        leadApi.getAll(),
        followUpApi.getAll({ today: true })
      ]);
      setSummary(sumRes.data || {});
      setPerformance(perfRes.data || []);
      setRecentLeads(leadsRes.data?.slice(0, 8) || []);
      setFollowUps(followRes.data || []);
    } catch (err) {
      console.error('Data sync failed');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSimulateCall = async () => {
    setIsSimulating(true);
    try {
      const randomPhone = `+91${Math.floor(6000000000 + Math.random() * 3999999999)}`;
      await axios.post(`${import.meta.env.VITE_API_URL}/webhook/exotel/${user.company_id}`, {
        CallFrom: randomPhone,
        Status: 'completed',
        Duration: Math.floor(Math.random() * 180) + 10
      });
      alert(`Simulation Complete: New lead created for ${randomPhone}`);
      fetchData();
    } catch (err) {
      alert('Simulation failed. Check bridge connectivity.');
    } finally {
      setIsSimulating(false);
    }
  };

  const stats = [
    { title: 'Total Leads', value: summary?.totalLeads || 0, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+12%' },
    { title: 'New Today', value: summary?.newLeadsToday || 0, icon: PhoneIncoming, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+3' },
    { title: 'Missed Calls', value: summary?.missedCalls || 0, icon: PhoneMissed, color: 'text-rose-600', bg: 'bg-rose-50', trend: '-4' },
    { title: 'Conversion', value: `${summary?.closedLeads || 0}%`, icon: Target, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+8%' },
  ];

  const chartData = summary ? [
    { name: 'new', value: summary.statusCounts?.new || 0, color: '#1D4ED8' },
    { name: 'contacted', value: summary.statusCounts?.contacted || 0, color: '#6D28D9' },
    { name: 'interested', value: summary.statusCounts?.interested || 0, color: '#B45309' },
    { name: 'site_visit', value: summary.statusCounts?.site_visit || 0, color: '#4338CA' },
    { name: 'closed', value: summary.statusCounts?.closed || 0, color: '#15803D' },
    { name: 'lost', value: summary.statusCounts?.lost || 0, color: '#BE123C' },
  ].filter(i => i.value > 0) : [];

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Topbar */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-black text-indigo-900 tracking-tight">
            Good morning, {user?.name?.split(' ')[0] || 'Admin'} 👋
          </h1>
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mt-1">
             <Calendar size={14} />
             {today}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-xl bg-white border border-[#F0EEF8] flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors relative">
             <Bell size={20} />
             <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>
          <button 
            onClick={handleSimulateCall}
            disabled={isSimulating}
            className="btn-primary h-11 px-6 flex items-center gap-2 shadow-lg shadow-indigo-100 font-bold text-sm"
          >
            <Zap size={18} className={isSimulating ? 'animate-pulse' : ''} />
            {isSimulating ? 'Processing...' : 'Simulate Incoming Call'}
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="card p-6 flex items-center gap-5 group hover:border-indigo-200 transition-all cursor-default">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-[20px] flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <stat.icon size={26} />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.title}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-heading font-black text-indigo-900">{stat.value}</h3>
                <span className={`text-[10px] font-black ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stat.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* NEW: Secondary Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-indigo-900 rounded-[32px] p-8 text-white relative overflow-hidden group shadow-xl">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Ticket size={120} />
           </div>
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                 <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Active Campaign</span>
              </div>
              <h3 className="text-2xl font-black mb-2 tracking-tight italic">Lucky Plot Scheme 2026</h3>
              <div className="flex items-end justify-between mt-8">
                 <div className="space-y-4">
                    <div className="flex items-center gap-8">
                       <div>
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Tokens Sold</p>
                          <p className="text-xl font-black">247 / 100,000</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Revenue</p>
                          <p className="text-xl font-black">₹2.71L</p>
                       </div>
                    </div>
                    <Link to="/admin/lottery" className="inline-flex items-center gap-2 bg-white text-indigo-900 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-50 transition-all">
                       Manage Campaign <ArrowRight size={14} />
                    </Link>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Draw Date</p>
                    <p className="text-lg font-black tabular-nums">15 MAR 2027</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-white rounded-[32px] border border-[#F0EEF8] p-8 shadow-sm group hover:border-indigo-100 transition-all">
           <div className="flex items-center justify-between mb-8">
              <h3 className="font-heading font-black text-indigo-900 tracking-tight text-lg">Developer Connectivity</h3>
              <Link to="/admin/developer" className="text-indigo-600 hover:scale-110 transition-transform">
                 <ExternalLink size={20} />
              </Link>
           </div>
           <div className="space-y-6">
              {[
                { name: 'Website Contact Form', status: 'Healthy', usage: '427 calls' },
                { name: 'Facebook Ads Bridge', status: 'Paused', usage: '0 calls' },
              ].map((service, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                   <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${service.status === 'Healthy' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                      <span className="text-sm font-bold text-gray-700">{service.name}</span>
                   </div>
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{service.usage}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* NEW: Live Presence Tracking */}
      <AttendancePanel />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Leads - 2/3 */}
        <div className="lg:col-span-2 card !p-0 overflow-hidden">
          <div className="p-6 border-b border-[#F0EEF8] flex items-center justify-between">
            <h3 className="text-lg font-heading font-black text-indigo-900">Recent Enterprise Leads</h3>
            <Link to="/admin/leads" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
              View full repository <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F9F7F4] text-[10px] uppercase font-black tracking-widest text-gray-400">
                  <th className="px-6 py-4">Lead Profile</th>
                  <th className="px-6 py-4">Designated Operative</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EEF8]">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#FAFAFA] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-indigo-900">{lead.name || 'Anonymous'}</div>
                      <div className="text-xs font-mono text-gray-400">{lead.phone_number}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[10px]">
                          {lead.assigned_employee_name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-xs font-medium text-gray-600">{lead.assigned_employee_name || 'Round Robin'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${
                         lead.status === 'new' ? 'bg-blue-50 text-blue-600' :
                         lead.status === 'contacted' ? 'bg-purple-50 text-purple-600' :
                         lead.status === 'interested' ? 'bg-amber-50 text-amber-600' :
                         lead.status === 'site_visit' ? 'bg-indigo-50 text-indigo-600' :
                         lead.status === 'closed' ? 'bg-emerald-50 text-emerald-600' :
                         'bg-rose-50 text-rose-600'
                      } text-[10px] font-black uppercase`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
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

        {/* Team Performance - 1/3 */}
        <div className="card">
          <h3 className="text-lg font-heading font-black text-indigo-900 mb-6">Operative Performance</h3>
          <div className="space-y-6">
            {performance.map((emp) => (
              <div key={emp.employee_id} className="group cursor-default">
                <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">
                         {emp?.employee_name?.charAt(0) || '?'}
                      </div>
                      <div>
                         <p className="text-sm font-bold text-indigo-900 leading-none">{emp?.employee_name || 'Operative'}</p>
                         <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{emp?.total_leads || 0} Leads</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-black text-indigo-600">{emp?.conversion_rate || 0}%</p>
                      <p className="text-[9px] text-gray-400 font-black uppercase">Conv. Rate</p>
                   </div>
                </div>
                <div className="w-full h-1.5 bg-[#EEF2FF] rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-700"
                    style={{ width: `${emp?.conversion_rate || 0}%` }}
                   />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Donut */}
        <div className="card">
           <h3 className="text-lg font-heading font-black text-indigo-900 mb-6">Status Composition</h3>
           <div className="flex items-center">
              <div className="h-64 flex-1 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip cursor={false} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="text-3xl font-heading font-black text-indigo-900">{summary?.totalLeads || 0}</span>
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Leads</span>
                </div>
              </div>
              <div className="flex-1 space-y-3 pl-8">
                 {chartData.map((item, idx) => (
                   <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                         <span className="text-xs font-bold text-gray-500 capitalize">{item.name}</span>
                      </div>
                      <span className="text-xs font-black text-indigo-900">{item.value}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Today's Follow-ups */}
        <div className="card">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-black text-indigo-900">Immediate Strategy</h3>
              <div className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                 {followUps.length} Pending
              </div>
           </div>
           <div className="space-y-4 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar">
              {followUps.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-center">
                   <CheckCircle2 size={40} className="text-emerald-200 mb-2" />
                   <p className="text-sm font-bold text-gray-400">Zero immediate churn risk.<br/>All follow-ups cleared.</p>
                </div>
              ) : followUps.map((item, idx) => (
                <div key={idx} className="p-4 bg-[#F9F7F4] rounded-[20px] border border-[#F0EEF8] hover:border-indigo-200 transition-all group">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-white border border-[#F0EEF8] flex items-center justify-center font-black text-indigo-600 shadow-sm">
                            {item.lead_name?.charAt(0) || 'L'}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-indigo-900 leading-none">{item.lead_name}</p>
                            <p className="text-[11px] font-mono text-gray-400 mt-1">{item.phone_number}</p>
                         </div>
                      </div>
                      <button className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                         <Phone size={18} fill="currentColor" />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
