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
        <div className="min-h-screen bg-[#0f172a] text-slate-200 flex font-sans">
            
            {/* --- Sidebar --- */}
            <div className="w-64 bg-[#1e293b] border-r border-white/5 hidden md:block">
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
            <div className="flex-1 flex flex-col">
                
                {/* Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#0f172a]/50 backdrop-blur-xl sticky top-0 z-20">
                    <h1 className="text-xl font-serif italic text-white">Vendor Approval Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-white">Admin Access</p>
                            <p className="text-[10px] text-green-500 uppercase">Online</p>
                        </div>
                        <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center font-bold">A</div>
                    </div>
                </header>

                <main className="p-8 md:p-12 overflow-y-auto">
                    
                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                            <p className="text-slate-400 text-xs uppercase tracking-widest mb-2 font-bold">Total Requests</p>
                            <h3 className="text-4xl font-black text-white">{vendors.length}</h3>
                        </div>
                        <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                            <p className="text-slate-400 text-xs uppercase tracking-widest mb-2 font-bold">Pending Approval</p>
                            <h3 className="text-4xl font-black text-rose-500">{vendors.filter(v => v.status !== 'approved').length}</h3>
                        </div>
                        <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl border-green-500/20">
                            <p className="text-slate-400 text-xs uppercase tracking-widest mb-2 font-bold">Approved Stores</p>
                            <h3 className="text-4xl font-black text-green-500">{vendors.filter(v => v.status === 'approved').length}</h3>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-[#1e293b] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-white/5">
                            <h2 className="text-lg font-bold">Recent Applications</h2>
                        </div>
                        
                        <div className="overflow-x-auto">
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
                                    {loading ? (
                                        <tr><td colSpan="5" className="p-20 text-center italic text-slate-500">Loading Vendors...</td></tr>
                                    ) : vendors.map((vendor) => (
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
                                    {!loading && vendors.length === 0 && (
                                        <tr><td colSpan="5" className="p-20 text-center italic text-slate-500 uppercase tracking-widest text-[10px]">No New Applications</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}