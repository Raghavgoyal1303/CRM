import React from 'react';
import { Target, Users, History, BarChart3, ShieldAlert } from 'lucide-react';

const GlobalStub = ({ title, desc, icon: Icon }) => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-700">
    <div className="w-24 h-24 bg-white rounded-[32px] border border-[#F0EEF8] flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-100 mb-8 group hover:scale-110 transition-transform">
       <Icon size={48} />
    </div>
    <h1 className="text-3xl font-heading font-black text-indigo-900 tracking-tight mb-2 underline decoration-indigo-200 decoration-4 underline-offset-8">{title}</h1>
    <p className="text-gray-500 max-w-md mx-auto leading-relaxed mt-4 font-medium">{desc}</p>
    
    <div className="mt-12 p-6 bg-indigo-50 border border-indigo-100 rounded-[24px] flex items-center gap-4 text-left max-w-lg">
       <ShieldAlert className="text-indigo-600 flex-shrink-0" size={24} />
       <div>
          <p className="text-xs font-black uppercase tracking-widest text-indigo-900 mb-1">Architecture Note</p>
          <p className="text-[11px] text-indigo-700 font-medium leading-relaxed">This data repository is currently being indexed. Global cross-tenant querying requires significant IOPS. v1.1 will enable full platform auditing with real-time replication.</p>
       </div>
    </div>
  </div>
);

export const AllLeads = () => <GlobalStub title="Global Lead Repository" desc="Unified access to every lead captured across the entire platform. Audit quality, trace sources, and monitor conversion velocity at scale." icon={Target} />;
export const AllEmployees = () => <GlobalStub title="Identity Console" desc="Manage every authenticated operative on the Tricity Verified network. Audit session history, activity logs, and performance metrics." icon={Users} />;
export const CallLogs = () => <GlobalStub title="Interception Logs" desc="Complete history of all voice data processed through Exotel gateways. Review recording quality and routing efficiency." icon={History} />;
export const Analytics = () => <GlobalStub title="Platform Intelligence" desc="Growth trends, MRR velocity, and retention metrics. High-level business intelligence for the Tricity Verified ecosystem." icon={BarChart3} />;

