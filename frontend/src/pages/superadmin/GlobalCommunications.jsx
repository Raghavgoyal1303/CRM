import React from 'react';
import { Send, CheckCircle2, X } from 'lucide-react';

const GlobalCommunications = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-2xl font-heading font-black text-indigo-900 tracking-tight">Communication Logs</h1>
                <p className="text-sm text-gray-500 mt-1">Platform-wide SMS and WhatsApp interaction audit</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'SMS Sent Today', value: '8,421', icon: Send, color: 'blue' },
                    { label: 'WA Sent Today', value: '6,102', icon: Send, color: 'green' },
                    { label: 'Failed Deliveries', value: '143', icon: X, color: 'rose' }
                ].map((stat, i) => (
                    <div key={i} className={`card p-6 bg-white border-l-4 border-l-${stat.color}-500 shadow-sm`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 bg-${stat.color}-50 text-${stat.color}-600 rounded-[16px] flex items-center justify-center`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
                                <h3 className="text-2xl font-heading font-black text-indigo-900">{stat.value}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card bg-white p-12 border border-[#F0EEF8] text-center">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                    <Send size={40} className="animate-bounce" />
                </div>
                <h2 className="text-xl font-heading font-black text-indigo-900">Platform-Wide Dispatch Audit</h2>
                <p className="text-gray-400 text-sm max-w-md mx-auto mt-2">
                    Every message triggered by missed calls, retry-logic, or manual agent actions will be archived here for global performance auditing.
                </p>
            </div>
        </div>
    );
};

export default GlobalCommunications;
