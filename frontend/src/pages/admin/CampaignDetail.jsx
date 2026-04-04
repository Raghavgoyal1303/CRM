import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  Users, 
  Download, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  IndianRupee
} from 'lucide-react';

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const campRes = await fetch(`/api/lottery/campaigns/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const campData = await campRes.json();
      setCampaign(campData);

      const partRes = await fetch(`/api/lottery/campaigns/${id}/participants`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const partData = await partRes.json();
      setParticipants(partData.participants || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setImporting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/lottery/campaigns/${id}/import`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      const result = await response.json();
      alert(`Import complete! Success: ${result.success}, Errors: ${result.errors.length}`);
      fetchData();
    } catch (err) {
      alert('Import failed: ' + err.message);
    } finally {
      setImporting(false);
      setFile(null);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-gray-400 animate-pulse">Decrypting Campaign Data...</div>;
  if (!campaign) return <div className="p-20 text-center font-bold text-rose-500">Campaign Not Found</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Breadcrumbs & Header */}
      <div>
        <Link to="/admin/lottery" className="text-indigo-600 flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:gap-3 transition-all mb-4">
          <ArrowLeft size={16} /> Back to Campaigns
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-heading font-black text-indigo-900 tracking-tight">{campaign.name}</h1>
          <div className="flex gap-3">
             <button className="bg-white text-gray-600 px-6 py-3 rounded-2xl border border-gray-100 flex items-center gap-2 font-black uppercase tracking-widest text-[10px] shadow-sm hover:shadow-md transition-all">
                <Download size={16} /> Export CSV
             </button>
             <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-100 hover:-translate-y-1 transition-all">
                Run Lucky Draw
             </button>
          </div>
        </div>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          {/* Main Stats Card */}
          <div className="bg-white rounded-[32px] border border-[#F0EEF8] p-8 shadow-sm">
             <div className="grid grid-cols-3 gap-8">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Collection Status</p>
                   <p className="text-3xl font-black text-indigo-900">₹{(campaign.stats?.total_revenue || 0).toLocaleString()}</p>
                   <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full" 
                        style={{ width: `${(campaign.tokens_sold / campaign.total_tokens) * 100}%` }} 
                      />
                   </div>
                </div>
                <div className="space-y-1 border-l border-gray-100 pl-8">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tokens Sold</p>
                   <p className="text-3xl font-black text-indigo-900">{campaign.tokens_sold}</p>
                   <p className="text-[10px] font-bold text-gray-400 mt-4 italic">Target: {campaign.total_tokens}</p>
                </div>
                <div className="space-y-1 border-l border-gray-100 pl-8">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Paid Rate</p>
                   <p className="text-3xl font-black text-indigo-900">
                     {campaign.tokens_sold > 0 ? Math.round((campaign.stats?.paid_count / campaign.tokens_sold) * 100) : 0}%
                   </p>
                   <p className="text-[10px] font-bold text-emerald-500 mt-4 uppercase tracking-widest">{campaign.stats?.paid_count} Verified</p>
                </div>
             </div>
          </div>

          {/* Participants Table */}
          <div className="bg-white rounded-[32px] border border-[#F0EEF8] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#F0EEF8] flex items-center justify-between bg-gray-50/50">
               <h3 className="font-black text-indigo-900 tracking-tight flex items-center gap-2">
                 <Users size={18} /> Participant List
               </h3>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search tokens..."
                    className="bg-white border border-gray-200 h-10 rounded-xl pl-9 pr-4 text-xs font-bold w-64 focus:ring-2 focus:ring-indigo-100"
                  />
               </div>
            </div>
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-white border-b border-[#F0EEF8]">
                     <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Token</th>
                     <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Participant</th>
                     <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Aadhar</th>
                     <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                     <th className="px-6 py-4"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-[#F0EEF8]">
                  {participants.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                       <td className="px-6 py-4">
                          <span className="font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg text-[11px]">{p.token_number}</span>
                       </td>
                       <td className="px-6 py-4">
                          <p className="text-sm font-black text-gray-900">{p.full_name}</p>
                          <p className="text-[10px] text-gray-500 font-medium">+{p.phone_number}</p>
                       </td>
                       <td className="px-6 py-4">
                          <p className="text-[11px] font-bold text-gray-600 tabular-nums">xxxx-xxxx-{p.aadhar_number?.slice(-4)}</p>
                       </td>
                       <td className="px-6 py-4">
                          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg w-fit ${
                            p.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                             {p.payment_status === 'paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                             <span className="text-[9px] font-black uppercase tracking-widest">{p.payment_status}</span>
                          </div>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <button className="text-indigo-600 hover:scale-110 transition-transform"><AlertCircle size={16} /></button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8">
          {/* Import Card */}
          <div className="bg-indigo-900 rounded-[32px] p-8 text-white shadow-xl">
             <h3 className="text-lg font-black mb-2 tracking-tight">Bulk Import</h3>
             <p className="text-indigo-200 text-xs font-medium leading-relaxed mb-6">
                Download the template, fill in your lead details, and re-upload here to bulk-generate tokens.
             </p>
             
             <form onSubmit={handleFileUpload} className="space-y-4">
                <div className="border-2 border-dashed border-indigo-700 rounded-2xl p-6 text-center hover:bg-indigo-800 transition-colors cursor-pointer group">
                   <input 
                     type="file" 
                     className="hidden" 
                     id="excel-upload" 
                     accept=".xlsx, .xls"
                     onChange={(e) => setFile(e.target.files[0])}
                   />
                   <label htmlFor="excel-upload" className="cursor-pointer">
                      <Upload className="mx-auto text-indigo-400 group-hover:scale-110 transition-transform mb-3" size={32} />
                      <p className="text-[10px] font-black uppercase tracking-widest mb-1">
                        {file ? file.name : 'Drag & Drop Excel'}
                      </p>
                      <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-tighter">Support .xlsx, .xls</p>
                   </label>
                </div>

                <div className="flex gap-2">
                   <button 
                     type="submit"
                     disabled={!file || importing}
                     className="flex-1 bg-white text-indigo-900 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:-translate-y-1 transition-all disabled:opacity-50"
                   >
                      {importing ? 'Syncing...' : 'Start Import'}
                   </button>
                   <button className="w-12 h-12 bg-indigo-800 rounded-xl flex items-center justify-center text-indigo-300 hover:bg-indigo-700 transition-all">
                      <Download size={18} />
                   </button>
                </div>
             </form>
          </div>

          {/* Campaign Details Side */}
          <div className="bg-white rounded-[32px] border border-[#F0EEF8] p-8 shadow-sm">
             <h3 className="font-black text-indigo-900 tracking-tight mb-6">Rules & Prize</h3>
             <div className="space-y-6">
                <div className="flex gap-4">
                   <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <IndianRupee size={20} />
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Prize Value</p>
                      <p className="text-sm font-black text-gray-900">₹{(campaign.prize_value || 0).toLocaleString()}</p>
                   </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                   <p className="text-[10px] font-bold text-gray-600 leading-relaxed italic line-clamp-3">
                      "{campaign.prize_description}"
                   </p>
                </div>
                <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                   <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Refund Amt</p>
                      <p className="text-xs font-bold text-gray-900">₹{campaign.refund_amount}</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Winners</p>
                      <p className="text-xs font-bold text-gray-900">{campaign.winners_count} Draw Slots</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
