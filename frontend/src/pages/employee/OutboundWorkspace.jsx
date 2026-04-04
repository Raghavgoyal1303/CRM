import React, { useState, useEffect } from 'react';
import { Phone, CheckCircle2, XCircle, Clock, Radio, UserCheck, MessageSquare, Send, Zap, ShieldAlert, ArrowRight, Star } from 'lucide-react';
import { campaignApi } from '../../api';

const OutboundWorkspace = () => {
    const [currentNumber, setCurrentNumber] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, called: 0, pending: 0 });
    const [showResultModal, setShowResultModal] = useState(false);
    const [isDialing, setIsDialing] = useState(false);

    useEffect(() => {
        fetchNextNumber();
    }, []);

    const fetchNextNumber = async () => {
        setLoading(true);
        // This would call a specialized endpoint for "get next available dialer number"
        // For now, mock a delay and a number
        setTimeout(() => {
            setCurrentNumber({
                id: '1',
                phone_number: '+91 98765 43210',
                campaign_name: 'Diwali Real Estate Drive',
                location: 'Navi Mumbai',
                attempts: 0
            });
            setStats({ total: 1000, called: 42, pending: 958 });
            setLoading(false);
        }, 1000);
    };

    const handleDial = () => {
        setIsDialing(true);
        // Step 1: Open external dialer or use WebRTC
        window.location.href = `tel:${currentNumber.phone_number}`;
        
        // Step 2: Show result recording modal after a short delay
        setTimeout(() => {
            setIsDialing(false);
            setShowResultModal(true);
        }, 3000);
    };

    const submitResult = async (status) => {
        setShowResultModal(false);
        // Update stats locally
        setStats(prev => ({ ...prev, called: prev.called + 1, pending: prev.pending - 1 }));
        // Fetch next
        fetchNextNumber();
    };

    if (loading && !currentNumber) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center animate-pulse">
                    <Radio size={32} className="text-indigo-600" />
                </div>
                <div className="text-center">
                   <h3 className="text-lg font-heading font-black text-indigo-900">Synchronizing Matrix...</h3>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Retrieving next strategic outreach node</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto space-y-6 animate-in slide-in-from-bottom duration-500 pb-10">
            {/* Mission Status Header */}
            <header className="card bg-indigo-900 p-6 rounded-[32px] text-white overflow-hidden relative shadow-2xl shadow-indigo-200 border-none">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="relative z-10 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34D399]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Session active</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                            <p className="text-[8px] font-black uppercase tracking-widest text-indigo-300">Daily Objective</p>
                            <p className="text-xl font-heading font-black mt-1">1,000</p>
                        </div>
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                            <p className="text-[8px] font-black uppercase tracking-widest text-indigo-300">Impact Made</p>
                            <p className="text-xl font-heading font-black mt-1 text-emerald-300">{stats.called}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Current Target Node */}
            <div className="card bg-white p-8 rounded-[40px] shadow-xl shadow-indigo-900/5 transition-all text-center space-y-8 border border-[#F0EEF8]">
                <div className="space-y-3">
                    <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest w-fit mx-auto border border-indigo-100">
                        {currentNumber?.campaign_name}
                    </div>
                    <h2 className="text-3xl font-heading font-black text-indigo-950 tracking-tight">{currentNumber?.phone_number}</h2>
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-[11px] font-bold uppercase tracking-widest">
                        <Zap size={14} className="text-amber-500" /> Lead Location: {currentNumber?.location}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <button 
                        onClick={handleDial}
                        disabled={isDialing}
                        className="w-full h-20 bg-indigo-600 text-white rounded-[28px] shadow-2xl shadow-indigo-200 flex items-center justify-center gap-4 group active:scale-95 transition-all"
                    >
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                            <Phone size={24} fill="currentColor" />
                        </div>
                        <span className="text-xl font-heading font-black tracking-tight">{isDialing ? 'Connecting...' : 'Initiate Outbound'}</span>
                    </button>
                    
                    <button 
                        onClick={fetchNextNumber}
                        className="w-full h-14 bg-gray-100 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                        Skip Node <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* Micro-Instructions */}
            <div className="grid grid-cols-2 gap-4">
               <div className="card bg-white p-4 rounded-3xl border border-[#F0EEF8] flex flex-col items-center gap-2 text-center">
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                     <Star size={18} />
                  </div>
                  <p className="text-[9px] font-black text-indigo-900 uppercase tracking-widest">Pro Tip</p>
                  <p className="text-[10px] text-gray-400 font-medium">Verify budget before marking 'Interested'</p>
               </div>
               <div className="card bg-white p-4 rounded-3xl border border-[#F0EEF8] flex flex-col items-center gap-2 text-center">
                  <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                     <ShieldAlert size={18} />
                  </div>
                  <p className="text-[9px] font-black text-indigo-900 uppercase tracking-widest">Protocol</p>
                  <p className="text-[10px] text-gray-400 font-medium">Blacklist any 'Wrong Numbers' immediately</p>
               </div>
            </div>

            {/* Call Result Modal */}
            {showResultModal && (
                <div className="fixed inset-0 bg-indigo-950/80 backdrop-blur-md z-[100] flex items-end justify-center">
                    <div className="bg-white w-full rounded-t-[40px] p-8 space-y-8 animate-in slide-in-from-bottom duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
                        <div className="text-center space-y-2">
                           <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
                           <h3 className="text-xl font-heading font-black text-indigo-900">Audit Disposition</h3>
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Classify result for {currentNumber?.phone_number}</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { status: 'interested', icon: UserCheck, color: 'emerald', label: 'Strategic Interest' },
                                { status: 'not_interested', icon: XCircle, color: 'gray', label: 'No Interest' },
                                { status: 'busy', icon: Clock, color: 'amber', label: 'Busy - Auto Retry' },
                                { status: 'blacklist', icon: ShieldAlert, color: 'rose', label: 'Blacklist - Wrong/DND' }
                            ].map(item => (
                                <button 
                                    key={item.status}
                                    onClick={() => submitResult(item.status)}
                                    className={`flex items-center gap-4 p-5 rounded-2xl border border-gray-100 hover:bg-${item.color}-50 hover:border-${item.color}-200 transition-all text-left group`}
                                >
                                    <div className={`w-12 h-12 bg-${item.color}-50 text-${item.color}-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm border border-${item.color}-100`}>
                                        <item.icon size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-indigo-900">{item.label}</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Final Disposition</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-300">
                                       <ArrowRight size={16} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OutboundWorkspace;
