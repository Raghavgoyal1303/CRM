import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Target, 
  ShieldCheck, 
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  ExternalLink,
  LogOut,
  User,
  Lock,
  History
} from 'lucide-react';
import { superApi } from '../../api';

const CompanyDetail = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const response = await superApi.getCompany(id);
      setCompany(response.data);
    } catch (err) {
      console.error('Failed to intercept tenant deep-dive');
    } finally {
      setLoading(false);
    }
  };

  const [resetLoading, setResetLoading] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  const handleResetPassword = async () => {
    if (!newPass) return;
    setResetLoading(true);
    try {
      await superApi.resetPassword(id, newPass);
      setResetMsg('Password updated successfully!');
      setNewPass('');
      setTimeout(() => setResetMsg(''), 3000);
    } catch (err) {
      setResetMsg('Reset failed. Check logs.');
    } finally {
      setResetLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-indigo-600 animate-pulse font-black italic">SEARCHING TENANT ARCHIVES...</div>;
  if (!company) return <div className="p-8 text-rose-500 font-bold underline">TENANT ID NOT FOUND OR DECLASSIFIED.</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link to="/super/companies" className="inline-flex items-center gap-2 text-indigo-600 text-sm font-bold hover:underline mb-2">
        <ArrowLeft size={16} /> Back to Repository
      </Link>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
            <Building2 size={40} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-heading font-black text-indigo-900 tracking-tight">{company.name}</h1>
              <span className={`badge ${company.subscription_status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {company.subscription_status.toUpperCase()}
              </span>
            </div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px]">Tenant ID: {company.id}</p>
          </div>
        </div>
        <button className="btn-primary h-12 px-8 flex items-center gap-2 shadow-xl shadow-indigo-100">
          <ShieldCheck size={20} /> Impersonate Admin
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Metadata & Stats */}
        <div className="space-y-8">
          <div className="card space-y-6">
             <h3 className="text-lg font-heading font-bold text-gray-900">Tenant Intelligence</h3>
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="text-gray-400" size={18} />
                  <div>
                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Owner</div>
                    <div className="text-sm font-bold">{company.owner_name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-gray-400" size={18} />
                  <div>
                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Email</div>
                    <div className="text-sm font-bold">{company.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-gray-400" size={18} />
                  <div>
                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Phone</div>
                    <div className="text-sm font-bold">{company.phone}</div>
                  </div>
                </div>
             </div>
             <div className="pt-6 border-t border-gray-100 space-y-4">
                <div className="flex justify-between items-center">
                   <span className="text-gray-500 text-sm font-bold">Max Force Size</span>
                   <span className="text-indigo-600 font-black">{company.max_employees}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-gray-500 text-sm font-bold">Onboarded</span>
                   <span className="text-gray-900 font-black">{company.created_at}</span>
                </div>
             </div>
          </div>

          <div className="card bg-white border border-rose-100">
            <div className="flex items-center gap-3 mb-6 text-rose-600">
               <ShieldCheck size={20} />
               <h3 className="text-lg font-heading font-bold">Security Protocol</h3>
            </div>
            <div className="space-y-4">
               <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 tracking-widest">Reset Primary Admin Password</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="New password..."
                      className="input-field h-10 text-sm"
                      value={newPass}
                      onChange={e => setNewPass(e.target.value)}
                    />
                    <button 
                      onClick={handleResetPassword}
                      disabled={resetLoading || !newPass}
                      className="px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold hover:bg-rose-600 disabled:opacity-50"
                    >
                      {resetLoading ? '...' : 'Reset'}
                    </button>
                  </div>
                  {resetMsg && <p className="text-[10px] font-bold text-rose-500 mt-2">{resetMsg}</p>}
               </div>
               <p className="text-[10px] text-gray-400 font-medium italic leading-tight mt-2">
                 * This will update the first user with role 'admin' and ensure they are marked as active.
               </p>
            </div>
          </div>
        </div>

        {/* Right: Operative Roster */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card !p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-heading font-bold text-gray-900">Operative Roster</h3>
              <button className="text-indigo-600 text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:underline">
                View Full Logs <ExternalLink size={12} />
              </button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-[#F9F7F4] text-gray-500 text-[10px] uppercase font-black tracking-widest">
                <tr>
                  <th className="px-6 py-4">Identity</th>
                  <th className="px-6 py-4">Role Protocol</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {company.employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="text-sm font-bold text-gray-900">{emp.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${emp.role === 'admin' ? 'border-indigo-200 text-indigo-600 bg-indigo-50' : 'border-emerald-200 text-emerald-600 bg-emerald-50'}`}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> ON-POINT
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="p-2 text-gray-400 hover:text-indigo-600"><Lock size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h3 className="text-lg font-heading font-bold text-gray-900 mb-6">Recent Tactical Actions</h3>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
               {[1, 2].map((a) => (
                 <div key={a} className="relative">
                   <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-white border-2 border-indigo-600" />
                   <div>
                     <div className="text-sm font-bold text-gray-900">New Lead Intercepted via Exotel Webhook</div>
                     <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Today at 10:45 AM • Caller ID +91 91234XXXXX</div>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompanyDetail;
