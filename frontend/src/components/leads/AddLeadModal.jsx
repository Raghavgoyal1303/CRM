import React, { useState } from 'react';
import { X, User, Phone, Filter, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { leadApi } from '../../api';

const AddLeadModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    source: 'Website',
    status: 'new'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone_number) {
      setError('Phone number is mandatory for lead tracking.');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await leadApi.create(formData);
      onSuccess();
      onClose();
      // Reset form
      setFormData({ name: '', phone_number: '', source: 'Website', status: 'new' });
    } catch (err) {
      setError(err.response?.data?.message || 'Strategic capture failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-indigo-900/20 backdrop-blur-[4px] z-[80]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-[480px] bg-white shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.1)] z-[90] flex flex-col"
          >
            <div className="p-8 border-b border-[#F0EEF8] flex items-center justify-between bg-[#F9F7F4]/50">
              <div>
                <h2 className="text-2xl font-heading font-black text-indigo-900 tracking-tight italic">Manual Capture</h2>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Append Tactical Intelligence</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-white hover:shadow-sm flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold animate-pulse">
                  ⚠️ {error}
                </div>
              )}

              {/* Identity Section */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <User size={14} className="text-indigo-600" /> Identity Profile
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase block mb-2 px-1">Client Full Name</label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                       <input
                        type="text"
                        placeholder="e.g. Johnathan Smith"
                        className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-[20px] pl-12 pr-4 py-4 text-sm font-bold text-indigo-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase block mb-2 px-1">Primary Contact (Mobile)</label>
                    <div className="relative">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                       <input
                        type="text"
                        required
                        placeholder="e.g. 9876543210"
                        className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-[20px] pl-12 pr-4 py-4 text-sm font-bold text-indigo-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm font-mono"
                        value={formData.phone_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Categorization */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Filter size={14} className="text-indigo-600" /> Strategic Targeting
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase block mb-2 px-1">Source Channel</label>
                    <select
                      className="w-full bg-[#F9F7F4] border border-[#F0EEF8] rounded-[20px] px-4 py-4 text-sm font-bold text-indigo-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      value={formData.source}
                      onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                    >
                      <option value="Website">Website Direct</option>
                      <option value="Referral">Manual Referral</option>
                      <option value="Cold Call">Outbound Reach</option>
                      <option value="Facebook">Social Media</option>
                      <option value="Google Ads">PPC Campaign</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase block mb-2 px-1">Initial Status</label>
                    <select
                      className="w-full bg-indigo-50 border border-indigo-100 rounded-[20px] px-4 py-4 text-sm font-black text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500 transition-all uppercase tracking-tighter"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="new">🆕 NEW LEAD</option>
                      <option value="contacted">📞 CONTACTED</option>
                      <option value="interested">⭐ INTERESTED</option>
                      <option value="site_visit">🏠 SITE VISIT</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>

            <div className="p-8 border-t border-[#F0EEF8] bg-white">
               <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full btn-primary py-5 rounded-[24px] flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 group overflow-hidden relative"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span className="text-sm font-black uppercase tracking-[0.1em]">Commit Lead Record</span>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddLeadModal;
