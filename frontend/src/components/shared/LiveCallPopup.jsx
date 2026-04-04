import React, { useState, useEffect } from 'react';
import { Phone, ExternalLink, X, PhoneIncoming, PhoneOutgoing } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api';

const LiveCallPopup = () => {
  const [calls, setCalls] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchLiveCalls = async () => {
      try {
        const response = await api.get('/live-calls');
        const data = response.data;
        setCalls(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch live calls:', err);
      }
    };

    fetchLiveCalls();
    const interval = setInterval(fetchLiveCalls, 5000);
    return () => clearInterval(interval);
  }, []);

  if (calls.length === 0 || !isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] w-80 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-[24px] shadow-2xl border border-rose-100 overflow-hidden">
        <div className="bg-rose-500 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Live Call in Progress</span>
          </div>
          <button onClick={() => setIsVisible(false)} className="hover:rotate-90 transition-transform">
            <X size={16} />
          </button>
        </div>
        
        <div className="p-5">
          {calls.map((call, idx) => (
            <div key={call.id} className={idx > 0 ? 'mt-4 pt-4 border-t border-gray-100' : ''}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${call.direction === 'inbound' ? 'bg-blue-50 text-blue-500' : 'bg-indigo-50 text-indigo-500'}`}>
                    {call.direction === 'inbound' ? <PhoneIncoming size={20} /> : <PhoneOutgoing size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">{call.caller_number}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{call.direction} · {call.employee_name || 'Assigned'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-black text-rose-500 bg-rose-50 px-2 py-1 rounded-lg">LIVE</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-3 mb-4 border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Lead</p>
                <p className="text-xs font-bold text-gray-800">{call.lead_name || 'Unknown Lead'}</p>
              </div>

              <div className="flex gap-2">
                <Link 
                  to={call.lead_id ? `/admin/leads?id=${call.lead_id}` : '/admin/leads'}
                  className="flex-1 bg-indigo-600 text-white h-10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:-translate-y-0.5 transition-all"
                >
                  <ExternalLink size={12} /> View Lead
                </Link>
              </div>
            </div>
          ))}
          
          {calls.length > 1 && (
            <p className="mt-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              + {calls.length - 1} more active call(s)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveCallPopup;
