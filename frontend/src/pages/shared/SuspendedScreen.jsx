import React from 'react';
import { ShieldAlert, CreditCard, LogOut, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SuspendedScreen = () => {
  const { logout, user } = useAuth();

  return (
    <div className="fixed inset-0 bg-indigo-900 z-[100] flex items-center justify-center p-6 text-white overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-rose-500 rounded-[32px] flex items-center justify-center shadow-2xl shadow-rose-900/50 animate-pulse">
            <ShieldAlert size={48} />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-heading font-black tracking-tight">Access Locked</h1>
          <p className="text-indigo-200 font-medium leading-relaxed">
            The subscription for <span className="text-white font-bold">{user?.company_name || 'your company'}</span> has expired or been suspended by the platform administrator.
          </p>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-3xl p-6 space-y-4 backdrop-blur-md">
          <div className="flex items-center gap-4 text-left">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <CreditCard size={20} className="text-indigo-300" />
            </div>
            <div>
              <div className="text-[10px] text-indigo-300 font-black uppercase tracking-widest">Action Required</div>
              <div className="text-sm font-bold">Renewal Payment Pending</div>
            </div>
          </div>
          
          {user?.role === 'admin' ? (
             <button className="w-full h-12 bg-white text-indigo-900 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-950/20">
               Renew Subscription
             </button>
          ) : (
            <div className="p-4 bg-rose-500/20 rounded-2xl border border-rose-500/20 text-xs font-bold text-rose-200">
              Please contact your company administrator to restore terminal access.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
           <button 
             onClick={logout}
             className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
           >
             <LogOut size={16} /> Exit Terminal
           </button>
           <button className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
             <Phone size={14} /> Support
           </button>
        </div>
      </div>
    </div>
  );
};

export default SuspendedScreen;
