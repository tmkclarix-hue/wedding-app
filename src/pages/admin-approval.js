"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function AdminDashboard() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "pending_vendors"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const vendorList = [];
            querySnapshot.forEach((doc) => {
                vendorList.push({ id: doc.id, ...doc.data() });
            });
            setVendors(vendorList);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleApprove = async (id) => {
        const vendorRef = doc(db, "pending_vendors", id);
        await updateDoc(vendorRef, { status: 'approved' });
        alert("Vendor Approved Successfully! ✨");
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to remove this vendor?")) {
            await deleteDoc(doc(db, "pending_vendors", id));
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col md:flex-row font-sans">
            
            {/* --- Sidebar (Desktop only) --- */}
            <div className="w-64 bg-[#1e293b] border-r border-white/5 hidden md:block sticky top-0 h-screen">
                <div className="p-8">
                    <h2 className="text-xl font-black tracking-tighter text-rose-500 italic">WEDDING APP</h2>
                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em]">Control Panel</p>
                </div>
                <nav className="mt-10 px-4 space-y-2">
                    <div className="bg-rose-600/10 text-rose-500 p-4 rounded-2xl font-bold text-sm">Vendors Management</div>
                    <div className="text-slate-400 p-4 rounded-2xl text-sm hover:bg-white/5 cursor-not-allowed">Bookings (Soon)</div>
                    <div className="text-slate-400 p-4 rounded-2xl text-sm hover:bg-white/5 cursor-not-allowed">Analytics</div>
                </nav>
            </div>

            {/* --- Main Content --- */}
            <div className="flex-1 flex flex-col w-full">
                
                {/* Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-10 bg-[#0f172a]/50 backdrop-blur-xl sticky top-0 z-20">
                    <div>
                        <h1 className="text-lg md:text-xl font-serif italic text-white leading-tight">Admin Dashboard</h1>
                        <p className="text-[9px] text-rose-500 md:hidden uppercase font-bold tracking-widest">Vendors Management</p>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-white">Admin Access</p>
                            <p className="text-[10px] text-green-500 uppercase">Online</p>
                        </div>
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-rose-600 rounded-full flex items-center justify-center font-bold shadow-lg shadow-rose-600/20">A</div>
                    </div>
                </header>

                <main className="p-5 md:p-12 overflow-y-auto">
                    
                    {/* Stats Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
                        <div className="bg-[#1e293b] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                            <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-1 font-bold">Total</p>
                            <h3 className="text-3xl md:text-4xl font-black text-white">{vendors.length}</h3>
                        </div>
                        <div className="bg-[#1e293b] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                            <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-1 font-bold">Pending</p>
                            <h3 className="text-3xl md:text-4xl font-black text-rose-500">{vendors.filter(v => v.status !== 'approved').length}</h3>
                        </div>
                        <div className="bg-[#1e293b] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl border-green-500/20">
                            <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-1 font-bold">Approved</p>
                            <h3 className="text-3xl md:text-4xl font-black text-green-500">{vendors.filter(v => v.status === 'approved').length}</h3>
                        </div>
                    </div>

                    {/* Table / List Section */}
                    <div className="bg-[#1e293b] rounded-[2rem] md:rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
                        <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center">
                            <h2 className="text-md md:text-lg font-bold uppercase tracking-tight">Recent Applications</h2>
                        </div>
                        
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                                    <tr>
                                        <th className="p-6 font-bold">Business Details</th>
                                        <th className="p-6 font-bold">Category</th>
                                        <th className="p-6 font-bold">Location</th>
                                        <th className="p-6 font-bold">Status</th>
                                        <th className="p-6 font-bold text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {vendors.map((vendor) => (
                                        <tr key={vendor.id} className="hover:bg-white/[0.02] transition-all group">
                                            <td className="p-6">
                                                <p className="font-bold text-white group-hover:text-rose-500 transition-colors">{vendor.businessName}</p>
                                                <p className="text-xs text-slate-500 font-mono">{vendor.id}</p>
                                            </td>
                                            <td className="p-6 text-sm text-slate-300">{vendor.category}</td>
                                            <td className="p-6 text-sm text-slate-300">📍 {vendor.district}</td>
                                            <td className="p-6 text-sm">
                                                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${vendor.status === 'approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'}`}>
                                                    {vendor.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex justify-center gap-3">
                                                    {vendor.status !== 'approved' && (
                                                        <button onClick={() => handleApprove(vendor.id)} className="px-5 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Approve</button>
                                                    )}
                                                    <button onClick={() => handleDelete(vendor.id)} className="px-5 py-2 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-rose-600/20">Remove</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile List View (පෝන් එකේදී මේක පේන්නේ) */}
                        <div className="md:hidden divide-y divide-white/5">
                            {loading ? (
                                <div className="p-10 text-center italic text-slate-500 text-xs">Loading Vendors...</div>
                            ) : vendors.map((vendor) => (
                                <div key={vendor.id} className="p-5 flex flex-col gap-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-white text-md">{vendor.businessName}</p>
                                            <p className="text-[10px] text-slate-500">{vendor.category} • 📍 {vendor.district}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${vendor.status === 'approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'}`}>
                                            {vendor.status || 'Pending'}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        {vendor.status !== 'approved' && (
                                            <button onClick={() => handleApprove(vendor.id)} className="flex-1 py-3 bg-green-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Approve</button>
                                        )}
                                        <button onClick={() => handleDelete(vendor.id)} className="flex-1 py-3 bg-rose-600/10 text-rose-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-rose-600/20">Remove</button>
                                    </div>
                                </div>
                            ))}
                            {vendors.length === 0 && !loading && (
                                <div className="p-10 text-center text-slate-500 text-[10px] uppercase tracking-widest">No New Applications</div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}