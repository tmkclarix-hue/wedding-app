"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function UltimateAdminDashboard() {
    const [vendors, setVendors] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('vendors');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const vQuery = query(collection(db, "pending_vendors"));
        const unsubV = onSnapshot(vQuery, (snap) => {
            setVendors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        });

        const bQuery = query(collection(db, "bookings"));
        const unsubB = onSnapshot(bQuery, (snap) => {
            setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        return () => { unsubV(); unsubB(); };
    }, []);

    const handleApprove = async (id) => {
        await updateDoc(doc(db, "pending_vendors", id), { status: 'approved' });
        alert("Vendor Verified! ✅");
    };

    const toggleTopList = async (id, currentStatus) => {
        await updateDoc(doc(db, "pending_vendors", id), { isTopList: !currentStatus });
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 flex flex-col md:flex-row font-sans uppercase tracking-tighter">
            
            {/* --- SIDEBAR (Desktop Only) --- */}
            <div className="hidden md:flex w-80 bg-[#0a0f18] border-r border-white/5 flex-col sticky top-0 h-screen z-50">
                <div className="p-10 mb-6">
                    <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Wedding<span className="text-rose-600">Admin</span></h2>
                </div>

                <nav className="flex-1 px-6 space-y-4">
                    <button onClick={() => setActiveTab('vendors')} className={`w-full text-left p-5 rounded-3xl text-[10px] font-black transition-all ${activeTab === 'vendors' ? 'bg-rose-600 text-white shadow-xl shadow-rose-900/40' : 'text-slate-500 hover:bg-white/5'}`}>🏢 VENDOR DIRECTORY</button>
                    <button onClick={() => setActiveTab('bookings')} className={`w-full text-left p-5 rounded-3xl text-[10px] font-black transition-all ${activeTab === 'bookings' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-slate-500 hover:bg-white/5'}`}>📅 BOOKING CALENDAR</button>
                    <button onClick={() => setActiveTab('toplist')} className={`w-full text-left p-5 rounded-3xl text-[10px] font-black transition-all ${activeTab === 'toplist' ? 'bg-amber-500 text-white shadow-xl shadow-amber-900/40' : 'text-slate-500 hover:bg-white/5'}`}>🏆 PREMIUM PARTNERS</button>
                </nav>
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 flex flex-col min-w-0 pb-24 md:pb-0">
                <header className="h-20 md:h-28 px-6 md:px-12 flex items-center justify-between border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-40">
                    <h1 className="text-lg md:text-2xl font-black italic text-white uppercase tracking-tighter">
                        {activeTab === 'vendors' && "Directory Control"}
                        {activeTab === 'bookings' && "Live Bookings"}
                        {activeTab === 'toplist' && "Premium List"}
                    </h1>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-rose-600 rounded-full flex md:hidden items-center justify-center font-bold text-white text-xs">A</div>
                </header>

                <main className="p-6 md:p-12 overflow-y-auto">
                    
                    {/* --- VENDORS SECTION --- */}
                    {activeTab === 'vendors' && (
                        <div className="grid gap-4 md:gap-6">
                            {vendors.map(v => (
                                <div key={v.id} className="bg-[#0a0f18] p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/5 flex flex-col md:flex-row md:items-center justify-between group hover:border-rose-500/30 transition-all gap-4">
                                    <div>
                                        <h3 className="text-lg md:text-xl font-black text-white italic group-hover:text-rose-500">{v.businessName}</h3>
                                        <p className="text-[9px] md:text-[10px] text-slate-500 mt-1 font-bold tracking-widest">{v.category} | {v.district}</p>
                                    </div>
                                    <div className="flex gap-2 md:gap-4">
                                        <button onClick={() => toggleTopList(v.id, v.isTopList)} className={`flex-1 md:flex-none px-4 md:px-6 py-3 rounded-xl md:rounded-2xl text-[8px] md:text-[9px] font-black border ${v.isTopList ? 'bg-amber-600 text-white border-amber-400' : 'bg-white/5 text-slate-500'}`}>TOP LIST</button>
                                        {v.status !== 'approved' && <button onClick={() => handleApprove(v.id)} className="flex-1 md:flex-none bg-green-600 text-white px-4 md:px-6 py-3 rounded-xl md:rounded-2xl text-[8px] md:text-[9px] font-black uppercase">Verify</button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* --- BOOKING CALENDAR (Responsive Table/Cards) --- */}
                    {activeTab === 'bookings' && (
                        <div className="space-y-6 md:space-y-10">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                <div className="bg-blue-600/10 p-6 md:p-8 rounded-[2rem] border border-blue-600/20">
                                    <p className="text-[8px] md:text-[9px] text-blue-400 font-black mb-1">TOTAL BOOKINGS</p>
                                    <h2 className="text-3xl md:text-4xl font-black text-white italic">{bookings.length}</h2>
                                </div>
                            </div>

                            {/* Booking List */}
                            <div className="bg-[#0a0f18] rounded-[2rem] md:rounded-[3.5rem] border border-white/5 overflow-hidden">
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-white/5 text-[9px] text-slate-500 border-b border-white/5">
                                            <tr>
                                                <th className="p-8">DATE & EVENT</th>
                                                <th className="p-8">CLIENT</th>
                                                <th className="p-8">VENDOR</th>
                                                <th className="p-8 text-right">STATUS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {bookings.map(b => (
                                                <tr key={b.id} className="hover:bg-blue-600/[0.03] transition-all">
                                                    <td className="p-8">
                                                        <span className="text-blue-400 text-[10px] font-black">📅 {b.bookingDate}</span>
                                                        <p className="text-white font-bold text-sm mt-1">{b.eventDetails || 'Wedding'}</p>
                                                    </td>
                                                    <td className="p-8">
                                                        <p className="text-white font-black text-xs">{b.customerName}</p>
                                                        <p className="text-[10px] text-slate-500">📞 {b.customerPhone}</p>
                                                    </td>
                                                    <td className="p-8">
                                                        <p className="text-white font-bold text-sm">{b.vendorName}</p>
                                                    </td>
                                                    <td className="p-8 text-right">
                                                        <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[8px] font-black">CONFIRMED</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Booking Cards */}
                                <div className="md:hidden divide-y divide-white/5">
                                    {bookings.map(b => (
                                        <div key={b.id} className="p-6 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg text-[9px] font-black">📅 {b.bookingDate}</span>
                                                <span className="text-green-500 text-[8px] font-black uppercase tracking-widest">Confirmed</span>
                                            </div>
                                            <div>
                                                <p className="text-[8px] text-slate-500 font-bold uppercase">Client</p>
                                                <p className="text-white font-black text-xs">{b.customerName} - {b.customerPhone}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] text-rose-500 font-bold uppercase">Booked Vendor</p>
                                                <p className="text-white font-bold text-sm">{b.vendorName}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* --- BOTTOM NAVIGATION (Mobile Only) --- */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#0a0f18]/90 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around px-4 z-[100]">
                <button onClick={() => setActiveTab('vendors')} className={`flex flex-col items-center gap-1 ${activeTab === 'vendors' ? 'text-rose-500' : 'text-slate-500'}`}>
                    <span className="text-lg">🏢</span>
                    <span className="text-[8px] font-black uppercase">Directory</span>
                </button>
                <button onClick={() => setActiveTab('bookings')} className={`flex flex-col items-center gap-1 ${activeTab === 'bookings' ? 'text-blue-500' : 'text-slate-500'}`}>
                    <span className="text-lg">📅</span>
                    <span className="text-[8px] font-black uppercase">Bookings</span>
                </button>
                <button onClick={() => setActiveTab('toplist')} className={`flex flex-col items-center gap-1 ${activeTab === 'toplist' ? 'text-amber-500' : 'text-slate-500'}`}>
                    <span className="text-lg">🏆</span>
                    <span className="text-[8px] font-black uppercase">Premium</span>
                </button>
            </div>
        </div>
    );
}