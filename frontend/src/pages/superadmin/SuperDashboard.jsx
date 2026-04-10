import React, { useState, useEffect } from 'react';
import { Building2, Users, Target, DollarSign, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { superApi } from '../../api';
import StatsCard from '../../components/shared/StatsCard';

const MOCK_STATS = {
  companies: { total: 2, active: 1, trial: 1, suspended: 0 },
  totalLeads: 1,
  revenueMRR: 2999,
};

const MOCK_COMPANIES = [
  { initials: 'ER', name: 'Elite Realty',    plan: 'GROWTH',  leads: '+45 leads' },
  { initials: 'AB', name: 'Alpha Builders',  plan: 'STARTER', leads: '+12 leads' },
  { initials: 'NS', name: 'Nexus Spaces',    plan: 'STARTER', leads: '+8 leads'  },
];

const SuperDashboard = () => {
  const [stats, setStats] = useState(MOCK_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const response = await superApi.getStats();
      if (response.data) setStats(response.data);
    } catch (err) {
      console.warn('Using mock platform stats (backend unavailable)');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-indigo-600 font-bold tracking-widest text-xs uppercase animate-pulse">Decrypting Global Intel...</p>
      </div>
    </div>
  );

  const s = stats || MOCK_STATS;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <div className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Tricity Verified Control Module</div>
        <h1 className="text-3xl font-heading font-black text-indigo-900 tracking-tight">Platform Master Overview</h1>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tenants"
          value={s.companies?.total ?? 0}
          icon={Building2}
          colorClass="bg-indigo-50 text-indigo-600 border border-indigo-100"
        />
        <StatsCard
          title="Active Subscriptions"
          value={s.companies?.active ?? 0}
          icon={Users}
          colorClass="bg-emerald-50 text-emerald-600 border border-emerald-100"
        />
        <StatsCard
          title="Global Leads"
          value={s.totalLeads ?? 0}
          icon={Target}
          colorClass="bg-amber-50 text-amber-600 border border-amber-100"
        />
        <StatsCard
          title="Conversion"
          value="12.4%"
          icon={TrendingUp}
          colorClass="bg-indigo-900 text-white shadow-xl shadow-indigo-200"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tenant Activity */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-heading font-bold text-gray-900">Recent Tenant Activity</h3>
            <Link to="/super/companies" className="text-indigo-600 text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:underline">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {MOCK_COMPANIES.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-white transition-all group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-md">
                    {c.initials}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{c.name}</div>
                    <div className="text-[11px] text-gray-500 uppercase font-bold tracking-widest">Plan: {c.plan}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-indigo-600">{c.leads}</div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Last 24h</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="card">
          <h3 className="text-lg font-heading font-bold text-gray-900 mb-6">Platform Distribution</h3>
          <div className="space-y-6">
            {[
              { label: 'Active Licenses', value: s.companies?.active ?? 0, total: s.companies?.total ?? 1, color: 'bg-indigo-600' },
              { label: 'Trial Accounts',  value: s.companies?.trial ?? 0,  total: s.companies?.total ?? 1, color: 'bg-amber-500' },
              { label: 'Suspended',       value: s.companies?.suspended ?? 0, total: s.companies?.total ?? 1, color: 'bg-rose-500' },
            ].map((item) => {
              const pct = item.total > 0 ? Math.round((item.value / item.total) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-gray-600">{item.label}</span>
                    <span className="font-black text-gray-800">{item.value} <span className="text-gray-400 font-medium">({pct}%)</span></span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <div className="text-[10px] text-indigo-400 uppercase font-black tracking-widest mb-1">Company Retention</div>
            <div className="text-2xl font-black text-indigo-900">98.4%</div>
            <div className="text-xs text-indigo-400 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 size={12} /> Healthy platform growth
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperDashboard;

