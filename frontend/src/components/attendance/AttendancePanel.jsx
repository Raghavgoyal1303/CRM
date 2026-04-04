import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../api';
import { 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Camera
} from 'lucide-react';

const AttendancePanel = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    try {
      const response = await api.get('/attendance/all');
      setAttendance(response.data);
    } catch (error) {
      console.error('Fetch attendance error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
    const interval = setInterval(fetchAttendance, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Presence Data...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <Users size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Live Attendance</h3>
            <p className="text-xs text-slate-500 font-medium">Real-time staff presence & photo logs</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold ring-1 ring-green-100">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          {attendance.filter(a => !a.clock_out).length} ON-CLOCK
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Photo Proof</th>
              <th className="px-6 py-4">Clock In</th>
              <th className="px-6 py-4">Clock Out</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {attendance.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">
                  No attendance records for today yet.
                </td>
              </tr>
            ) : (
              attendance.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border-2 border-white shadow-sm ring-1 ring-slate-100 group-hover:scale-110 transition-transform">
                        {log.user_name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{log.user_name}</div>
                        <div className="text-[10px] uppercase font-heavy tracking-tighter text-slate-400">{log.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {log.photo_url ? (
                      <div className="relative group/img w-16 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                        <img 
                          src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${log.photo_url}`} 
                          className="w-full h-full object-cover cursor-zoom-in" 
                          alt="Verification"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera size={14} className="text-white" />
                        </div>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold px-2 py-1 bg-slate-50 rounded italic border border-dashed">Manual Entry</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <Clock size={14} className="text-indigo-500" />
                      {new Date(log.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-500">
                    {log.clock_out ? (
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-300" />
                        {new Date(log.clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    ) : (
                      <span className="text-[10px] text-indigo-500 font-black animate-pulse">ACTIVE NOW</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {log.clock_out ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold">
                        <CheckCircle2 size={12} />
                        CLOCKED OUT
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold ring-1 ring-indigo-100">
                        <div className="w-1 h-1 bg-indigo-500 rounded-full animate-ping" />
                        PRESENT
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendancePanel;
