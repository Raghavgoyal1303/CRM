import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  MoreVertical, 
  Pencil, 
  Slash,
  TrendingUp,
  Mail,
  Phone,
  ShieldCheck,
  X,
  RefreshCcw,
  CheckCircle2,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { employeeApi, analyticsApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const EmployeesPage = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone_number: '', 
    password: '', 
    role: 'employee',
    acefone_extension: ''
  });
  
  const [emailPrefix, setEmailPrefix] = useState('');
  
  const companySuffix = `@${user?.company_name?.replace(/\s+/g, '').toLowerCase()}.com`;

  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empRes, perfRes] = await Promise.all([
        employeeApi.getEmployees(),
        analyticsApi.getPerformance()
      ]);
      setEmployees(empRes.data || []);
      setPerformance(perfRes.data || []);
    } catch (err) {
      console.error('Failed to fetch employee data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    
    // Validate first name requirement
    const firstName = formData.name.trim().split(' ')[0];
    if (!emailPrefix.toLowerCase().startsWith(firstName.toLowerCase())) {
        setError(`Email prefix must start with the employee's first name ("${firstName}")`);
        return;
    }

    setFormLoading(true);
    setError('');
    
    const fullEmail = `${emailPrefix.toLowerCase()}${companySuffix}`;
    
    try {
      await employeeApi.createEmployee({ ...formData, email: fullEmail });
      await fetchData();
      setShowAddModal(false);
      setFormData({ name: '', email: '', phone_number: '', password: '', role: 'employee' });
      setEmailPrefix('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await employeeApi.updateEmployee(id, { is_active: currentStatus ? 0 : 1 });
      fetchData();
    } catch (err) {
      console.error('Status toggle failed');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!selectedEmp || !newPassword) return;
    setFormLoading(true);
    try {
      await employeeApi.resetPassword(selectedEmp.id, { newPassword });
      setShowResetModal(false);
      setNewPassword('');
      alert(`Success: Access cipher for ${selectedEmp.name} has been updated.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteEmployee = async (id, name) => {
    if (window.confirm(`CAUTION: Are you sure you want to REVOKE ACCESS for ${name}? This will perform a soft-delete.`)) {
      try {
        await employeeApi.deleteEmployee(id);
        fetchData();
        setOpenMenuId(null);
      } catch (err) {
        console.error('Failed to delete operative');
      }
    }
  };

  const getPerf = (id) => performance.find(p => p.employee_id === id) || { total_leads: 0, closed_leads: 0, conversion_rate: 0 };

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.is_online === 1).length,
    avgConv: performance.length > 0 
      ? Math.round(performance.reduce((acc, p) => acc + (p.conversion_rate || 0), 0) / performance.length) 
    : 0
  };

  const calculatePasswordStrength = (pass) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length > 6) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 25;
    return strength;
  };

  const strength = calculatePasswordStrength(formData.password);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-heading font-black text-indigo-900 tracking-tight">Active Operatives</h1>
          <div className="px-3 py-1 bg-white border border-[#F0EEF8] rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-widest shadow-sm">
             {stats.active} / {stats.total} Online
          </div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary h-11 px-6 flex items-center gap-2 shadow-lg shadow-indigo-100 font-bold text-sm"
        >
          <UserPlus size={18} />
          <span>Deploy New Operative</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-white border-l-4 border-l-indigo-600 shadow-xl shadow-indigo-900/5">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-[16px] flex items-center justify-center">
                 <Users size={24} />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Workforce</p>
                 <h3 className="text-2xl font-heading font-black text-indigo-900">{stats.total}</h3>
              </div>
           </div>
        </div>
        <div className="card p-6 bg-white border-l-4 border-l-emerald-500 shadow-xl shadow-emerald-900/5">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-[16px] flex items-center justify-center">
                 <CheckCircle2 size={24} />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Currently Active</p>
                 <h3 className="text-2xl font-heading font-black text-indigo-900">{stats.active}</h3>
              </div>
           </div>
        </div>
        <div className="card p-6 bg-white border-l-4 border-l-amber-500 shadow-xl shadow-amber-900/5">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-[16px] flex items-center justify-center">
                 <TrendingUp size={24} />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Team Conv. Rate</p>
                 <h3 className="text-2xl font-heading font-black text-indigo-900">{stats.avgConv}%</h3>
              </div>
           </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="card !p-0 overflow-hidden shadow-xl shadow-indigo-900/5 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9F7F4] border-b border-[#F0EEF8]">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Identity & Access</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Contact Line</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Role</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Total Leads</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Acefone Ext</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEF8]">
              {loading ? (
                <tr><td colSpan="7" className="px-6 py-20 text-center text-gray-400 font-bold animate-pulse">Establishing operative network...</td></tr>
              ) : employees.map((emp) => {
                const perf = getPerf(emp.id);
                return (
                  <tr key={emp.id} className="hover:bg-[#FAFAFA] group transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-heading font-black text-xs uppercase shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform relative">
                          {emp.name?.split(' ').map(n => n[0]).join('') || '?'}
                          {emp.is_online === 1 && (
                            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                          )}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm font-bold text-indigo-900">{emp.name}</span>
                           <span className="text-[11px] text-gray-400 font-medium">{emp.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-mono text-xs text-gray-400">{emp.phone_number || '—'}</td>
                    <td className="px-6 py-5">
                      <span className={`badge ${emp.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'} text-[9px] font-black uppercase tracking-widest`}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <button 
                        onClick={() => handleToggleStatus(emp.id, emp.is_active)}
                        className={`w-10 h-5 rounded-full relative transition-colors ${emp.is_active ? 'bg-emerald-500' : 'bg-gray-300'}`}
                      >
                         <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${emp.is_active ? 'right-0.5 shadow-[-2px_0_4px_rgba(0,0,0,0.1)]' : 'left-0.5 shadow-[2px_0_4px_rgba(0,0,0,0.1)]'}`} />
                      </button>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-sm font-bold text-indigo-900">{perf.total_leads}</span>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex flex-col gap-1.5">
                          <span className="text-xs font-black text-indigo-600">{perf.conversion_rate}%</span>
                          <div className="w-16 h-1 w-full max-w-[80px] bg-indigo-50 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${perf.conversion_rate}%` }} />
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-xs font-mono font-bold text-indigo-600">{emp.acefone_extension || '—'}</span>
                    </td>
                    <td className="px-6 py-5 text-right relative">
                       <button 
                        onClick={() => setOpenMenuId(openMenuId === emp.id ? null : emp.id)}
                        className={`p-2 rounded-lg transition-all ${openMenuId === emp.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-300 hover:text-indigo-600'}`}
                       >
                          <MoreVertical size={18} />
                       </button>

                       <AnimatePresence>
                        {openMenuId === emp.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-6 top-16 w-48 bg-white rounded-2xl shadow-2xl border border-[#F0EEF8] z-20 py-2 overflow-hidden"
                            >
                               <button 
                                onClick={() => {
                                  setSelectedEmp(emp);
                                  setShowResetModal(true);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-3 flex items-center gap-3 text-xs font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                               >
                                  <RefreshCcw size={14} />
                                  <span>Reset Cipher</span>
                               </button>
                               <div className="h-[1px] bg-[#F0EEF8] mx-2" />
                               <button 
                                onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                                className="w-full px-4 py-3 flex items-center gap-3 text-xs font-bold text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                               >
                                  <Trash2 size={14} />
                                  <span>Revoke Access</span>
                               </button>
                            </motion.div>
                          </>
                        )}
                       </AnimatePresence>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !formLoading && setShowAddModal(false)}
              className="fixed inset-0 bg-indigo-900/20 backdrop-blur-[4px] z-[80]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[480px] bg-white rounded-[32px] shadow-2xl z-[90] p-8 border border-[#F0EEF8]"
            >
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <h2 className="text-xl font-heading font-black text-indigo-900 tracking-tight">Deploy Operative</h2>
                    <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest mt-1">New Credential Provisioning</p>
                 </div>
                 <button 
                  onClick={() => !formLoading && setShowAddModal(false)}
                  className="w-10 h-10 rounded-full hover:bg-[#F9F7F4] flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-all"
                 >
                    <X size={24} />
                 </button>
              </div>

              <form onSubmit={handleAddEmployee} className="space-y-5">
                 {error && <div className="p-4 bg-rose-50 text-rose-600 rounded-[16px] text-xs font-bold border border-rose-100">{error}</div>}

                 <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                    <div className="relative">
                       <input 
                        required
                        type="text" 
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-[16px] px-4 py-3.5 text-sm font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Login Prefix</label>
                        <div className="flex items-center gap-0">
                           <input 
                            required
                            type="text" 
                            placeholder="firstname123"
                            className="flex-1 bg-[#F9F7F4] border border-[#F0EEF8] rounded-l-[16px] px-4 py-3.5 text-[11px] font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all border-r-0"
                            value={emailPrefix}
                            onChange={e => setEmailPrefix(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                           />
                           <div className="bg-indigo-50 border border-[#F0EEF8] rounded-r-[16px] px-3 py-3.5 text-[10px] font-black text-indigo-600 border-l-0 border-r border-[#f0eef8] whitespace-nowrap">
                              {companySuffix}
                           </div>
                        </div>
                        <p className="text-[9px] text-gray-400 mt-1 ml-1 italic font-medium">Must start with employee's first name</p>
                    </div>
                    <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Protocol</label>
                       <input 
                        required
                        type="text" 
                        placeholder="+91..."
                        className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-[16px] px-4 py-3.5 text-xs font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={formData.phone_number}
                        onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
                       />
                    </div>
                 </div>

                 <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Acefone Operative Extension</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 1001"
                      className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-[16px] px-4 py-3.5 text-xs font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={formData.acefone_extension}
                      onChange={e => setFormData({ ...formData, acefone_extension: e.target.value })}
                    />
                 </div>

                 <div className="space-y-1.5 focus-within:text-indigo-600 transition-colors">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Access Role Archetype</label>
                    <select 
                      className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-[16px] px-4 py-3.5 text-sm font-black text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="employee">Field Operative (Employee)</option>
                      <option value="admin">Platform Administrator (Admin)</option>
                    </select>
                 </div>

                 <div className="space-y-2 focus-within:text-indigo-600 transition-colors">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Initial Access Cipher</label>
                    <div className="relative">
                       <input 
                        required
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="••••••••"
                        className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-[16px] px-4 py-3.5 text-sm font-mono font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                       />
                       <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                       >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                       </button>
                    </div>
                    {/* Strength Bar */}
                    <div className="flex gap-1 h-1 px-1">
                       {[25, 50, 75, 100].map(step => (
                         <div key={step} className={`flex-1 rounded-full transition-all duration-500 ${strength >= step ? (strength <= 25 ? 'bg-rose-500' : strength <= 50 ? 'bg-amber-500' : strength <= 75 ? 'bg-blue-500' : 'bg-emerald-500') : 'bg-gray-100'}`} />
                       ))}
                    </div>
                 </div>

                 <div className="flex gap-4 pt-6">
                    <button 
                      type="button" 
                      disabled={formLoading}
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 hover:bg-[#F9F7F4] rounded-[16px] transition-all"
                    >
                      Abort
                    </button>
                    <button 
                      type="submit" 
                      disabled={formLoading}
                      className="flex-1 btn-primary py-4 rounded-[16px] text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-50 flex items-center justify-center"
                    >
                      {formLoading ? <RefreshCcw size={18} className="animate-spin" /> : 'Commit Deployment'}
                    </button>
                 </div>
              </form>
            </motion.div>
          </>
        )}
        {/* Reset Password Modal */}
        {showResetModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !formLoading && setShowResetModal(false)}
              className="fixed inset-0 bg-indigo-900/20 backdrop-blur-[4px] z-[80]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[420px] bg-white rounded-[32px] shadow-2xl z-[90] p-8 border border-[#F0EEF8]"
            >
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <h2 className="text-xl font-heading font-black text-indigo-900 tracking-tight">Recipher Operative</h2>
                    <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest mt-1">{selectedEmp?.name}</p>
                 </div>
                 <button 
                  onClick={() => !formLoading && setShowResetModal(false)}
                  className="w-10 h-10 rounded-full hover:bg-[#F9F7F4] flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-all"
                 >
                    <X size={24} />
                 </button>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6">
                 <div className="space-y-2 focus-within:text-indigo-600 transition-colors">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Access Cipher</label>
                    <div className="relative">
                       <input 
                        required
                        autoFocus
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="••••••••"
                        className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-[16px] px-4 py-3.5 text-sm font-mono font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                       />
                       <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                       >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                       </button>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <button 
                      type="button" 
                      disabled={formLoading}
                      onClick={() => setShowResetModal(false)}
                      className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 hover:bg-[#F9F7F4] rounded-[16px] transition-all"
                    >
                      Abort
                    </button>
                    <button 
                      type="submit" 
                      disabled={formLoading}
                      className="flex-1 btn-primary py-4 rounded-[16px] text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-50 flex items-center justify-center"
                    >
                      {formLoading ? <RefreshCcw size={18} className="animate-spin" /> : 'Confirm New Cipher'}
                    </button>
                 </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployeesPage;
