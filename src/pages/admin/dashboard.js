import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function UltimateAdminDashboard() {
    const [vendors, setVendors] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('vendors');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Vendors ලබාගැනීම
        const vQuery = query(collection(db, "pending_vendors"));
        const unsubV = onSnapshot(vQuery, (snap) => {
            setVendors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        });

        // Bookings ලබාගැනීම
        const bQuery = query(collection(db, "bookings"));
        const unsubB = onSnapshot(bQuery, (snap) => {
            setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        return () => { unsubV(); unsubB(); };
    }, []);

    // --- Actions ---
    const handleApprove = async (id) => {
        await updateDoc(doc(db, "pending_vendors", id), { status: 'approved' });
        alert("Vendor Verified! ✅");
    };

    const toggleTopList = async (id, currentStatus) => {
        await updateDoc(doc(db, "pending_vendors", id), { isTopList: !currentStatus });
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 flex font-sans uppercase tracking-tighter">
            
            {/* --- SIDEBAR --- */}
            <div className="w-80 bg-[#0a0f18] border-r border-white/5 flex flex-col sticky top-0 h-screen z-50">
                <div className="p-10 mb-6">
                    <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Wedding<span className="text-rose-600">Admin</span></h2>
                </div>

                <nav className="flex-1 px-6 space-y-4">
                    <button onClick={() => setActiveTab('vendors')} className={`w-full text-left p-5 rounded-3xl text-[10px] font-black transition-all ${activeTab === 'vendors' ? 'bg-rose-600 text-white shadow-xl shadow-rose-900/40' : 'text-slate-500 hover:bg-white/5'}`}>
                        🏢 VENDOR DIRECTORY
                    </button>
                    <button onClick={() => setActiveTab('bookings')} className={`w-full text-left p-5 rounded-3xl text-[10px] font-black transition-all ${activeTab === 'bookings' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-slate-500 hover:bg-white/5'}`}>
                        📅 BOOKING CALENDAR
                    </button>
                    <button onClick={() => setActiveTab('toplist')} className={`w-full text-left p-5 rounded-3xl text-[10px] font-black transition-all ${activeTab === 'toplist' ? 'bg-amber-500 text-white shadow-xl shadow-amber-900/40' : 'text-slate-500 hover:bg-white/5'}`}>
                        🏆 PREMIUM PARTNERS
                    </button>
                </nav>
            </div>

            {/* --- MAIN --- */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-28 px-12 flex items-center justify-between border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-40">
                    <h1 className="text-2xl font-black italic text-white uppercase tracking-tighter">
                        {activeTab === 'vendors' && "Directory Control"}
                        {activeTab === 'bookings' && "Live Booking Calendar"}
                        {activeTab === 'toplist' && "Premium Top List"}
                    </h1>
                </header>

                <main className="p-12 overflow-y-auto">
                    
                    {/* --- VENDORS SECTION --- */}
                    {activeTab === 'vendors' && (
                        <div className="grid gap-6">
                            {vendors.map(v => (
                                <div key={v.id} className="bg-[#0a0f18] p-8 rounded-[3rem] border border-white/5 flex items-center justify-between group hover:border-rose-500/30 transition-all">
                                    <div>
                                        <h3 className="text-xl font-black text-white italic group-hover:text-rose-500">{v.businessName}</h3>
                                        <p className="text-[10px] text-slate-500 mt-2 font-bold tracking-widest">{v.category} | {v.district}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={() => toggleTopList(v.id, v.isTopList)} className={`px-6 py-3 rounded-2xl text-[9px] font-black border ${v.isTopList ? 'bg-amber-600 text-white border-amber-400' : 'bg-white/5 text-slate-500'}`}>TOP LIST</button>
                                        {v.status !== 'approved' && <button onClick={() => handleApprove(v.id)} className="bg-green-600 text-white px-6 py-3 rounded-2xl text-[9px] font-black uppercase">Verify</button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* --- BOOKING CALENDAR SECTION --- */}
                    {activeTab === 'bookings' && (
                        <div className="space-y-10 animate-in fade-in duration-700">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-3 gap-6">
                                <div className="bg-blue-600/10 p-8 rounded-[2.5rem] border border-blue-600/20">
                                    <p className="text-[9px] text-blue-400 font-black mb-2">UPCOMING BOOKINGS</p>
                                    <h2 className="text-4xl font-black text-white italic">{bookings.length}</h2>
                                </div>
                            </div>

                            {/* Booking List with Details */}
                            <div className="bg-[#0a0f18] rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl">
                                <div className="p-8 border-b border-white/5 bg-white/[0.01]">
                                    <h2 className="text-sm font-black text-white tracking-widest">MASTER BOOKING SCHEDULE</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-white/5 text-[9px] text-slate-500 border-b border-white/5">
                                            <tr>
                                                <th className="p-8">DATE & EVENT</th>
                                                <th className="p-8">CLIENT DETAILS</th>
                                                <th className="p-8">BOOKED FOR (VENDOR)</th>
                                                <th className="p-8 text-right">STATUS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {bookings.map(b => (
                                                <tr key={b.id} className="hover:bg-blue-600/[0.03] transition-all">
                                                    <td className="p-8">
                                                        <div className="bg-blue-600/20 text-blue-400 w-fit px-3 py-1 rounded-lg text-[10px] font-black mb-2 border border-blue-600/20">
                                                            📅 {b.bookingDate}
                                                        </div>
                                                        <p className="text-white font-bold text-sm tracking-normal">{b.eventDetails || 'Wedding Event'}</p>
                                                    </td>
                                                    <td className="p-8">
                                                        <p className="text-white font-black text-xs uppercase tracking-tight">{b.customerName}</p>
                                                        <p className="text-[10px] text-slate-500 mt-1 font-bold">📞 {b.customerPhone}</p>
                                                    </td>
                                                    <td className="p-8">
                                                        <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest">Store/Hotel:</p>
                                                        <p className="text-white font-bold text-sm mt-1">{b.vendorName}</p>
                                                    </td>
                                                    <td className="p-8 text-right">
                                                        <span className="bg-green-500/10 text-green-500 px-4 py-2 rounded-full text-[8px] font-black border border-green-500/20">CONFIRMED</span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {bookings.length === 0 && (
                                                <tr><td colSpan="4" className="p-32 text-center text-[10px] font-black text-slate-600 tracking-[0.5em]">No Bookings Recorded Yet</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}