import React from 'react';
import { Radio, Users, CheckCircle2, TrendingUp } from 'lucide-react';

const CampaignsOverview = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-2xl font-heading font-black text-indigo-900 tracking-tight">Campaigns Overview</h1>
                <p className="text-sm text-gray-500 mt-1">Platform-wide outbound campaign monitor</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Campaigns', value: '124', icon: Radio, color: 'indigo' },
                    { label: 'Running Now', value: '42', icon: Radio, color: 'emerald' },
                    { label: 'Total Numbers', value: '1.2M', icon: Users, color: 'blue' },
                    { label: 'Calls Today', value: '14.5k', icon: TrendingUp, color: 'amber' }
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

            <div className="card bg-white p-8 border border-[#F0EEF8] text-center">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                    <Radio size={40} className="animate-pulse" />
                </div>
                <h2 className="text-xl font-heading font-black text-indigo-900">Campaign Analytics Engine</h2>
                <p className="text-gray-400 text-sm max-w-sm mx-auto mt-2">
                    Real-time dialing metrics and conversion analysis will appear here as tenants launch outbound operations.
                </p>
            </div>
        </div>
    );
};

export default CampaignsOverview;
