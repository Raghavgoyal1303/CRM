import React, { useEffect, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useNavigate } from 'react-router-dom';
import { Phone, User, X } from 'lucide-react';

const IncomingCallPopup = () => {
  const { incomingCall, clearCall } = useSocket();
  const navigate = useNavigate();
  const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/1359/1359-preview.mp3')); // Professional ringtone

  useEffect(() => {
    if (incomingCall) {
      audioRef.current.loop = true;
      audioRef.current.play().catch(e => console.log('[Audio] Playback blocked by browser:', e));
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    return () => {
      audioRef.current.pause();
    };
  }, [incomingCall]);

  if (!incomingCall) return null;

  const handleView = () => {
    navigate(`/leads/${incomingCall.leadId}`);
    clearCall();
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] animate-bounce-in">
      <div className="bg-white dark:bg-slate-800 border-2 border-emerald-500 rounded-xl shadow-2xl p-5 w-80 overflow-hidden relative">
        <button 
          onClick={clearCall}
          className="absolute top-2 right-2 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
        >
          <X size={18} className="text-slate-400" />
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center animate-pulse">
            <Phone size={28} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Incoming Call!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Assigned Call Center</p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 mb-4 flex items-center gap-3 border border-slate-100 dark:border-slate-800">
          <div className="p-2 bg-white dark:bg-slate-800 rounded-md shadow-sm">
            <User size={16} className="text-slate-400" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs text-slate-400 uppercase font-semibold">Customer Phone</p>
            <p className="text-slate-700 dark:text-slate-200 font-medium truncate">{incomingCall.phone}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleView}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95"
          >
            Open Lead Profile
          </button>
        </div>

        {/* Decorative background element */}
        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-emerald-500/5 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
};

export default IncomingCallPopup;
