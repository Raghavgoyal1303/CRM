import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Plus, 
  TrendingUp, 
  Users, 
  IndianRupee, 
  Calendar,
  ArrowRight,
  Download,
  Trophy
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LotteryManagement = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/lottery/campaigns', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setCampaigns(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeCampaign = campaigns.find(c => c.status === 'active');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-black text-indigo-900 tracking-tight">Lottery Campaigns</h1>
          <p className="text-gray-500 font-medium mt-1">Manage lucky draws and token distribution</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 hover:-translate-y-1 transition-all">
          <Plus size={18} /> New Campaign
        </button>
      </div>

      {/* Active Campaign Banner */}
      {activeCampaign && (
        <div className="bg-[#EEF2FF] rounded-[32px] p-8 border-l-[12px] border-indigo-600 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
            <Ticket size={120} className="text-indigo-900" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Active Now</span>
              <h2 className="text-2xl font-black text-indigo-900">{activeCampaign.name}</h2>
            </div>
            
            <div className="flex flex-wrap gap-8 items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Tokens Sold</p>
                  <p className="text-xl font-black text-indigo-900 leading-none">{activeCampaign.tokens_sold} / {activeCampaign.total_tokens}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-l border-indigo-100 pl-8">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
                  <IndianRupee size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Revenue</p>
                  <p className="text-xl font-black text-indigo-900 leading-none">₹{(activeCampaign.tokens_sold * activeCampaign.price_per_token).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-l border-indigo-100 pl-8">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Draw Date</p>
                  <p className="text-xl font-black text-indigo-900 leading-none">{new Date(activeCampaign.draw_date).toLocaleDateString()}</p>
                </div>
              </div>

              <Link 
                to={`/admin/lottery/${activeCampaign.id}`}
                className="ml-auto bg-white text-indigo-600 h-14 px-8 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-xs shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                View Campaign <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Sold', value: '1,247', icon: Ticket, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Revenue', value: '₹13.7L', icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Paid', value: '1,102', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Winning Tokens', value: '100', icon: Trophy, color: 'text-rose-500', bg: 'bg-rose-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[24px] border border-[#F0EEF8] shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-indigo-900 px-2 tracking-tight">Previous Campaigns</h3>
        <div className="grid grid-cols-1 gap-4">
          {campaigns.filter(c => c.status !== 'active').map((campaign) => (
            <div key={campaign.id} className="bg-white p-6 rounded-[28px] border border-[#F0EEF8] flex items-center justify-between group hover:border-indigo-100 transition-all shadow-sm">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                  <Ticket size={32} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-black text-gray-900">{campaign.name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      campaign.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium italic">{campaign.prize_description}</p>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tokens</p>
                  <p className="text-sm font-bold text-gray-900">{campaign.tokens_sold}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</p>
                  <p className="text-sm font-bold text-gray-900">{new Date(campaign.campaign_end_date).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                    <Download size={18} />
                  </button>
                  <Link 
                    to={`/admin/lottery/${campaign.id}`}
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-gray-200 hover:-translate-y-1 transition-all"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {loading && <div className="p-20 text-center font-bold text-gray-400 animate-pulse">Synchronizing Secure Server...</div>}
          {!loading && campaigns.length === 0 && <div className="p-20 text-center font-bold text-gray-400">No campaigns found. Start by creating one above.</div>}
        </div>
      </div>
    </div>
  );
};

export default LotteryManagement;
