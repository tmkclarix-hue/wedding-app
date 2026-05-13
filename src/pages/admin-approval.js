import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase'; // මෙතන තිතක් අයින් කළා (../lib)
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function AdminApproval() {
    const [vendors, setVendors] = useState([]);

    useEffect(() => {
        const q = query(collection(db, "pending_vendors"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const vendorList = [];
            querySnapshot.forEach((doc) => {
                vendorList.push({ id: doc.id, ...doc.data() });
            });
            setVendors(vendorList);
        });
        return () => unsubscribe();
    }, []);

    const handleApprove = async (id) => {
        const vendorRef = doc(db, "pending_vendors", id);
        await updateDoc(vendorRef, { status: 'approved' });
        alert("Vendor Approved!");
    };

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure?")) {
            await deleteDoc(doc(db, "pending_vendors", id));
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-10 font-sans">
            <h1 className="text-4xl font-serif italic mb-10 border-l-4 border-rose-600 pl-6">Vendor Approvals</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map((vendor) => (
                    <div key={vendor.id} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl">
                        <h3 className="text-xl font-bold mb-2">{vendor.businessName}</h3>
                        <p className="text-gray-400 text-sm mb-4">{vendor.category} | {vendor.district}</p>
                        <div className="flex gap-4">
                            <button onClick={() => handleApprove(vendor.id)} className="flex-1 py-3 bg-green-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-green-500 transition-all">Approve</button>
                            <button onClick={() => handleDelete(vendor.id)} className="flex-1 py-3 bg-rose-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-rose-500 transition-all">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            {vendors.length === 0 && <p className="text-gray-500 italic mt-10">No pending approvals found.</p>}
        </div>
    );
}