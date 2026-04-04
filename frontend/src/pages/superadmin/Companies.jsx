import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, Slash, ExternalLink, CheckCircle2, Trash2, ShieldAlert, X, Key, ShieldCheck, Mail, Phone, User, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { superApi } from '../../api';

const MOCK_COMPANIES = [
  { id: 'comp-1', name: 'Elite Realty',   owner: 'Priya Singh',   status: 'active',    employees: 3, leads: 12, created: 'Jan 2026' },
  { id: 'comp-2', name: 'Alpha Builders', owner: 'Ankit Kumar',   status: 'trial',     employees: 1, leads: 4,  created: 'Mar 2026' },
];

const STATUS_STYLES = {
  active:    'bg-emerald-50 text-emerald-600',
  trial:     'bg-amber-50 text-amber-600',
  suspended: 'bg-rose-50 text-rose-600',
  cancelled: 'bg-gray-100 text-gray-500',
};

const Companies = () => {
  const [companies, setCompanies] = useState(MOCK_COMPANIES);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('all');
  
  // Missing deletion state
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');

  useEffect(() => { fetchCompanies(); }, []);

  const fetchCompanies = async () => {
    try {
      const res = await superApi.getCompanies();
      if (res.data && res.data.length > 0) setCompanies(res.data);
    } catch {
      console.warn('Using mock companies (backend unavailable)');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (comp) => {
    const currentStatus = comp.subscription_status || comp.status;
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await superApi.updateStatus(comp.id, newStatus);
      setCompanies(prev => prev.map(c => c.id === comp.id ? { ...c, subscription_status: newStatus, status: newStatus } : c));
    } catch (err) {
      console.error('❌ [Companies] Update Status Failed:', err);
      // optimistic update on mock
      setCompanies(prev => prev.map(c => c.id === comp.id ? { ...c, subscription_status: newStatus, status: newStatus } : c));
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData]     = useState({ name: '', owner_name: '', email: '', phone: '', max_employees: 5, ownerPassword: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError]           = useState('');
  
    // Credentials Modal State
    const [credsModalId, setCredsModalId] = useState(null);
    const [copied, setCopied] = useState(false);
    const [provisionSuccess, setProvisionSuccess] = useState(null);

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    try {
      if (!formData.ownerPassword) throw new Error('Owner password is required for provisioning.');
      const res = await superApi.createCompany(formData);
      setCompanies(prev => [res.data, ...prev]);
      setProvisionSuccess({ ...formData });
      setFormData({ name: '', owner_name: '', email: '', phone: '', max_employees: 5, ownerPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to provision tenant.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCompany = async () => {
    const company = companies.find(c => c.id === deletingId);
    if (deleteConfirmName !== company.name) {
      setError('Company name does not match. Purge aborted.');
      return;
    }

    setIsDeleting(true);
    try {
      await superApi.deleteCompany(deletingId);
      setCompanies(prev => prev.filter(c => c.id !== deletingId));
      setDeletingId(null);
      setDeleteConfirmName('');
    } catch (err) {
      setError('Purge failed on server. Database lock or constraint issue.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = companies.filter(c => {
    const matchSearch = search === '' || c.name.toLowerCase().includes(search.toLowerCase()) || (c.owner || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-black text-indigo-900 tracking-tight">Tenant Repository</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and audit all business entities on LeadFlow</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary h-11 px-6 flex items-center gap-2 shadow-lg shadow-indigo-200"
        >
          <Plus size={18} /> Provision Tenant
        </button>
      </header>

      {/* Provision Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-indigo-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-[#F0EEF8] flex items-center justify-between">
              <h2 className="text-xl font-heading font-black text-indigo-900">Provision New Tenant</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-rose-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateCompany} className="p-8 space-y-5">
              {provisionSuccess ? (
                <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300 py-4">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[32px] flex items-center justify-center mx-auto shadow-xl shadow-emerald-50">
                    <CheckCircle2 size={40} />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-black text-indigo-900">Tenant Provisioned</h3>
                    <p className="text-sm text-gray-500 mt-1">{provisionSuccess.name} is now live.</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-left space-y-4">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Admin Email</p>
                      <p className="text-sm font-bold text-indigo-950 font-mono">{provisionSuccess.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Temporary Access Key</p>
                      <p className="text-sm font-bold text-indigo-950 font-mono">{provisionSuccess.ownerPassword}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setIsModalOpen(false); setProvisionSuccess(null); }}
                    className="w-full h-12 bg-indigo-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-950 transition-all shadow-xl shadow-indigo-100"
                  >
                    Enter Repository
                  </button>
                </div>
              ) : (
                <>
                  {error && <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold border border-rose-100">{error}</div>}
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-[#6B7280] mb-2">Company Name</label>
                    <input 
                      required
                      className="input-field" 
                      placeholder="e.g. Skyline Properties" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-widest text-[#6B7280] mb-2">Owner Name</label>
                      <input 
                        className="input-field" 
                        placeholder="Owner's Name" 
                        value={formData.owner_name}
                        onChange={e => setFormData({...formData, owner_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-widest text-[#6B7280] mb-2">Max Employees</label>
                      <input 
                        type="number"
                        className="input-field" 
                        value={formData.max_employees}
                        onChange={e => setFormData({...formData, max_employees: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-[#6B7280] mb-2">Admin/Owner Email</label>
                    <input 
                      required
                      type="email"
                      className="input-field" 
                      placeholder="admin@company.com" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-primary mb-2">Initial Owner Password</label>
                    <input 
                      required
                      type="password"
                      className="input-field border-primary/30 focus:border-primary" 
                      placeholder="••••••••" 
                      value={formData.ownerPassword}
                      onChange={e => setFormData({...formData, ownerPassword: e.target.value})}
                    />
                    <p className="text-[9px] text-[#6B7280] mt-1.5 font-medium italic">Passwords are hashed using BCRYPT (cost 12) before storage.</p>
                  </div>
                  <button 
                    type="submit" 
                    disabled={formLoading}
                    className="w-full btn-primary h-12 flex items-center justify-center gap-2 shadow-xl shadow-indigo-200"
                  >
                    {formLoading ? 'Provisioning...' : <><Building2 size={18}/> Establish Tenant</>}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="card !p-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by name or owner..."
            className="input-field pl-10 h-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="input-field h-10 w-44" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="trial">Trial</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="card !p-0 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-indigo-600 animate-pulse font-bold">Loading tenant repository...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[#F9F7F4] border-b border-[#F0EEF8]">
              <tr className="text-gray-500 text-[11px] uppercase tracking-widest font-black">
                <th className="px-6 py-4">Company Profile</th>
                <th className="px-6 py-4">Admin Email</th>
                <th className="px-6 py-4 text-center">Employees</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEF8]">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">No companies found.</td></tr>
              ) : filtered.map(comp => (
                <tr key={comp.id} className="hover:bg-[#FAFAFA] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg">
                        {comp.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{comp.name}</div>
                        <div className="text-[11px] text-gray-400 font-bold uppercase">
                          {comp.owner_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-mono text-gray-600">
                    {comp.email}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="text-sm font-black text-gray-700">{comp.employees ?? '—'}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Active</div>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500 font-medium">
                    {comp.created || (comp.created_at ? new Date(comp.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—')}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/super/companies/${comp.id}`}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <ExternalLink size={17} />
                      </Link>
                      <button
                        onClick={() => setCredsModalId(comp.id)}
                        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        title="View Credentials"
                      >
                        <Key size={17} />
                      </button>
                      <button
                        onClick={() => setDeletingId(comp.id)}
                        className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete Permanently"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-indigo-900/60 backdrop-blur-md z-[70] flex items-center justify-center p-6">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden border border-rose-100">
            <div className="p-8 bg-rose-50 flex items-center gap-4 text-rose-600">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <ShieldAlert size={28} />
              </div>
              <div>
                <h2 className="text-xl font-heading font-black">Dangerous Action</h2>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">Permanent Data Purge</p>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm text-gray-600 leading-relaxed">
                You are about to delete <span className="font-bold text-gray-900">{companies.find(c => c.id === deletingId)?.name}</span>. This will permanently destroy all leads, employees, call logs, and notes associated with this tenant. 
                <p className="mt-2 font-black text-rose-500 uppercase text-[10px]">This action cannot be undone.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-widest text-[#6B7280]">Type company name to confirm</label>
                <input 
                  className="input-field border-rose-200 focus:border-rose-500 focus:ring-rose-500/10" 
                  placeholder={companies.find(c => c.id === deletingId)?.name} 
                  value={deleteConfirmName}
                  onChange={e => setDeleteConfirmName(e.target.value)}
                />
              </div>

              {error && <div className="text-rose-500 text-xs font-bold text-center">{error}</div>}

              <div className="flex gap-4">
                <button 
                  onClick={() => { setDeletingId(null); setDeleteConfirmName(''); setError(''); }}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteCompany}
                  disabled={isDeleting || deleteConfirmName !== companies.find(c => c.id === deletingId)?.name}
                  className="flex-2 bg-rose-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isDeleting ? 'Purging...' : <><Trash2 size={18} /> Confirm Purge</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Credentials Modal */}
      {credsModalId && (
        <div className="fixed inset-0 bg-indigo-900/60 backdrop-blur-md z-[70] flex items-center justify-center p-6 text-left">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-indigo-100 animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-indigo-900 flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={28} className="text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-black">Credential Access</h2>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-60">Admin Governance Node</p>
                </div>
              </div>
              <button 
                onClick={() => setCredsModalId(null)}
                className="p-2 hover:bg-white/10 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-8 text-left">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-2xl">
                  {companies.find(c => c.id === credsModalId)?.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-black text-indigo-950">{companies.find(c => c.id === credsModalId)?.name}</h3>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Tenant Profile</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between group">
                   <div className="flex items-center gap-4">
                      <Mail size={18} className="text-gray-400" />
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Admin Email</p>
                         <p className="text-sm font-bold text-gray-900">{companies.find(c => c.id === credsModalId)?.email}</p>
                      </div>
                   </div>
                   <button 
                    onClick={() => {
                      navigator.clipboard.writeText(companies.find(c => c.id === credsModalId)?.email);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-indigo-600 transition-all shadow-sm"
                   >
                      {copied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
                   </button>
                </div>

                <div className="p-5 bg-amber-50/30 rounded-2xl border border-amber-100 flex items-center justify-between group shadow-sm shadow-amber-900/5">
                   <div className="flex items-center gap-4">
                      <User size={18} className="text-amber-600" />
                      <div>
                         <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest text-left">Identity Access</p>
                         <p className="text-sm font-bold text-indigo-900">Primary Admin Account</p>
                      </div>
                   </div>
                   <Link 
                    to={`/super/companies/${credsModalId}`}
                    onClick={() => setCredsModalId(null)}
                    className="px-4 py-2 bg-white border border-amber-100 text-amber-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                   >
                      Reset Password
                   </Link>
                </div>
              </div>

              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center gap-3">
                 <ShieldAlert size={16} className="text-indigo-400 shrink-0" />
                 <p className="text-[10px] text-indigo-900/60 font-medium leading-relaxed italic text-left">
                    For security protocols, plain-text passwords are never stored. Use the reset protocol if the tenant has lost access.
                 </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;
