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
  const [showEditModal, setShowEditModal] = useState(false);
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
      setFormData({ name: '', email: '', phone_number: '', password: '', role: 'employee', acefone_extension: '' });
      setEmailPrefix('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditEmployee = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    try {
      await employeeApi.updateEmployee(selectedEmp.id, formData);
      await fetchData();
      setShowEditModal(false);
      setSelectedEmp(null);
      setFormData({ name: '', email: '', phone_number: '', password: '', role: 'employee', acefone_extension: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update operative');
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
    if (window.confirm(`CAUTION: Are you sure you want to REVOKE ACCESS for ${name}?`)) {
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-heading font-black text-indigo-900 tracking-tight">Active Operatives</h1>
          <div className="px-3 py-1 bg-white border border-[#F0EEF8] rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-widest shadow-sm">
             {stats.active} / {stats.total} Online
          </div>
        </div>
        <button 
          onClick={() => {
            setFormData({ name: '', email: '', phone_number: '', password: '', role: 'employee', acefone_extension: '' });
            setShowAddModal(true);
          }}
          className="btn-primary h-11 px-6 flex items-center gap-2 shadow-lg shadow-indigo-100 font-bold text-sm"
        >
          <UserPlus size={18} />
          <span>Deploy New Operative</span>
        </button>
      </div>

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
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEF8]">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-20 text-center text-gray-400 font-bold animate-pulse">Establishing operative network...</td></tr>
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
                           <span className="text-[11px] text-gray-400 font-medium">Ext: {emp.acefone_extension || '—'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-mono text-xs text-gray-400">{emp.phone_number || '—'}</td>
                    <td className="px-6 py-5 uppercase text-[9px] font-black tracking-widest text-indigo-500">{emp.role}</td>
                    <td className="px-6 py-5">
                      <button 
                        onClick={() => handleToggleStatus(emp.id, emp.is_active)}
                        className={`w-10 h-5 rounded-full relative transition-colors ${emp.is_active ? 'bg-emerald-500' : 'bg-gray-300'}`}
                      >
                         <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${emp.is_active ? 'right-0.5' : 'left-0.5'}`} />
                      </button>
                    </td>
                    <td className="px-6 py-5 font-bold text-indigo-900">{perf.total_leads}</td>
                    <td className="px-6 py-5 text-right relative">
                       <button 
                        onClick={() => setOpenMenuId(openMenuId === emp.id ? null : emp.id)}
                        className="text-gray-300 hover:text-indigo-600"
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
                                  setFormData({ name: emp.name, phone_number: emp.phone_number || '', acefone_extension: emp.acefone_extension || '', role: emp.role });
                                  setShowEditModal(true);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-3 flex items-center gap-3 text-xs font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                               >
                                  <Pencil size={14} />
                                  <span>Edit Details</span>
                               </button>
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

      <AnimatePresence>
        {/* ADD MODAL */}
        {showAddModal && (
          <>
            <motion.div className="fixed inset-0 bg-indigo-900/20 backdrop-blur-[4px] z-[80]" onClick={() => !formLoading && setShowAddModal(false)} />
            <motion.div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[480px] bg-white rounded-[32px] shadow-2xl z-[90] p-8 border border-[#F0EEF8]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-heading font-black text-indigo-900">Deploy Operative</h2>
                <button onClick={() => setShowAddModal(false)}><X size={24} /></button>
              </div>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                 {error && <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold">{error}</div>}
                 <input className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                 <div className="flex gap-2">
                    <input className="flex-1 bg-[#F9F7F4] border border-[#F0EEF8] rounded-xl px-4 py-3 text-xs font-bold" placeholder="Login Prefix" value={emailPrefix} onChange={e => setEmailPrefix(e.target.value)} required />
                    <div className="p-3 text-[10px] font-black text-indigo-400">{companySuffix}</div>
                 </div>
                 <input className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold" placeholder="Phone" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} required />
                 <input className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold" placeholder="Acefone Extension" value={formData.acefone_extension} onChange={e => setFormData({...formData, acefone_extension: e.target.value})} />
                 <input className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold" type="password" placeholder="Initial Cipher" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                 <button type="submit" className="w-full btn-primary py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-100">Commit Deployment</button>
              </form>
            </motion.div>
          </>
        )}

        {/* EDIT MODAL */}
        {showEditModal && (
          <>
            <motion.div className="fixed inset-0 bg-indigo-900/20 backdrop-blur-[4px] z-[80]" onClick={() => !formLoading && setShowEditModal(false)} />
            <motion.div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[480px] bg-white rounded-[32px] shadow-2xl z-[90] p-8 border border-[#F0EEF8]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-heading font-black text-indigo-900">Modify Operative</h2>
                <button onClick={() => setShowEditModal(false)}><X size={24} /></button>
              </div>
              <form onSubmit={handleEditEmployee} className="space-y-4">
                 {error && <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold">{error}</div>}
                 <input className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                 <input className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold" placeholder="Phone" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} required />
                 <input className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold" placeholder="Acefone Extension" value={formData.acefone_extension} onChange={e => setFormData({...formData, acefone_extension: e.target.value})} />
                 <button type="submit" className="w-full btn-primary py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-100">Save Modifications</button>
              </form>
            </motion.div>
          </>
        )}

        {/* RESET PASSWORD MODAL */}
        {showResetModal && (
          <>
            <motion.div className="fixed inset-0 bg-indigo-900/20 backdrop-blur-[4px] z-[80]" onClick={() => setShowResetModal(false)} />
            <motion.div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[420px] bg-white rounded-[32px] shadow-2xl z-[90] p-8 border border-[#F0EEF8]">
              <h2 className="text-xl font-heading font-black text-indigo-900 mb-6">Recipher Operative</h2>
              <form onSubmit={handleResetPassword} className="space-y-6">
                <input required type={showPassword ? 'text' : 'password'} className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-xl px-4 py-3 text-sm font-bold" placeholder="New Cipher" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                <button type="submit" className="w-full btn-primary py-4 rounded-xl font-bold uppercase tracking-widest">Confirm New Cipher</button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployeesPage;
