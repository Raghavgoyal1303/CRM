import React, { useState, useEffect } from 'react';
import { PhoneOff, Plus, Search, Trash2, ShieldAlert, Upload, X, CheckCircle2 } from 'lucide-react';
import { blacklistApi } from '../../api';

const Blacklist = () => {
    const [blacklist, setBlacklist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ phone_number: '', reason: 'not_interested' });
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        fetchBlacklist();
    }, []);

    const fetchBlacklist = async () => {
        try {
            const res = await blacklistApi.getBlacklist();
            setBlacklist(res.data || []);
        } catch (err) {
            console.error('Failed to fetch blacklist');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            await blacklistApi.add(formData);
            fetchBlacklist();
            setIsModalOpen(false);
            setFormData({ phone_number: '', reason: 'not_interested' });
        } catch (err) {
            console.error('Failed to add to blacklist');
        } finally {
            setFormLoading(false);
        }
    };

    const handleRemove = async (id) => {
        try {
            await blacklistApi.remove(id);
            fetchBlacklist();
        } catch (err) {
            console.error('Removal failed');
        }
    };

    const filtered = blacklist.filter(b => b.phone_number?.includes(search));

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <header className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-heading font-black text-indigo-900 tracking-tight">System Blacklist</h1>
                        <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100">
                           {blacklist.length} Restricted Nodes
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Global 'Do Not Call' enforcement for this company</p>
                </div>
                <div className="flex gap-4">
                    <button className="h-11 px-4 bg-white border border-[#F0EEF8] rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#6B7280] hover:bg-gray-50 transition-all shadow-sm">
                        <Upload size={18} /> Bulk Import DND
                    </button>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="h-11 px-6 bg-rose-500 text-white rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all"
                    >
                        <Plus size={18} /> Restrict Number
                    </button>
                </div>
            </header>

            <div className="card !p-4 flex items-center gap-4 bg-white border border-[#F0EEF8]">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        className="input-field pl-10 h-10 border-none bg-gray-50" 
                        placeholder="Search blacklisted digits..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="card !p-0 overflow-hidden bg-white border border-[#F0EEF8] shadow-xl shadow-rose-900/5">
                <table className="w-full text-left">
                    <thead className="bg-[#FFF8F8] border-b border-rose-100">
                        <tr className="text-[10px] font-black uppercase tracking-widest text-rose-400">
                            <th className="px-6 py-4">Restricted phone Number</th>
                            <th className="px-6 py-4">Reason for restriction</th>
                            <th className="px-6 py-4 text-center">Added on</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-rose-50">
                        {loading ? (
                            <tr><td colSpan="4" className="px-6 py-20 text-center text-rose-300 font-bold animate-pulse uppercase text-[10px] tracking-widest">Auditing restriction matrix...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan="4" className="px-6 py-20 text-center text-gray-400 italic">No restrictions currently active in this tenant.</td></tr>
                        ) : filtered.map(item => (
                            <tr key={item.id} className="hover:bg-rose-50/30 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-black group-hover:scale-110 transition-transform shadow-sm">
                                            <PhoneOff size={18} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 font-mono tracking-tight">{item.phone_number}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                   <span className="px-2.5 py-1 bg-white border border-rose-200 text-rose-500 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                      {item.reason}
                                   </span>
                                </td>
                                <td className="px-6 py-5 text-center text-xs font-medium text-gray-400 font-mono italic">
                                    {new Date(item.added_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-5 text-right">
                                   <button 
                                    onClick={() => handleRemove(item.id)}
                                    className="p-3 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                   >
                                      <Trash2 size={18} />
                                   </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Manual Blacklist Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-indigo-900/30 backdrop-blur-sm z-[80] flex items-center justify-center p-6 text-left">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-8 animate-in zoom-in duration-200 border border-rose-100">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                                  <ShieldAlert size={28} />
                               </div>
                               <div>
                                  <h2 className="text-xl font-heading font-black text-indigo-900">Restrict Number</h2>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">Manual Suppression</p>
                               </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-300"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleAdd} className="space-y-6">
                            <div className="space-y-1.5 font-bold">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Phone Number Protocol</label>
                                <input 
                                    required 
                                    className="input-field border-rose-50 focus:border-rose-500 font-mono" 
                                    placeholder="+91..." 
                                    value={formData.phone_number}
                                    onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5 font-bold">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Restriction Logic</label>
                                <select 
                                    className="input-field appearance-none cursor-pointer" 
                                    value={formData.reason}
                                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                >
                                    <option value="not_interested">Not Interested</option>
                                    <option value="do_not_call">Do Not Call (DND)</option>
                                    <option value="wrong_number">Wrong Number</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <button 
                                type="submit" 
                                disabled={formLoading}
                                className="w-full h-14 bg-rose-500 text-white rounded-2xl shadow-xl shadow-rose-100 uppercase tracking-[0.2em] font-black text-xs hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
                            >
                                {formLoading ? 'Applying Restriction...' : <><PhoneOff size={18} /> Apply Suppression</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Blacklist;
