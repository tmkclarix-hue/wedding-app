import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';

export default function AdminApproval() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Pending Requests ලබාගැනීම
  useEffect(() => {
    const q = query(collection(db, "payment_requests"), where("status", "==", "pending"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Vendor ව Approve කිරීම (පියවර දෙකකින්)
  const handleApprove = async (req) => {
    try {
      // Step A: Payment Request එක Approve කිරීම
      const payRef = doc(db, "payment_requests", req.id);
      await updateDoc(payRef, { status: "approved" });

      // Step B: Vendor ගේ ප්‍රධාන දත්ත (pending_vendors) "approved" කිරීම
      // මෙතන req.vendorId කියලා field එකක් ඔයා registration එකේදී දානවා නම් ඒක පාවිච්චි කරන්න
      const vendorRef = doc(db, "pending_vendors", req.vendorId || req.id); 
      
      await updateDoc(vendorRef, { 
        status: "approved",
        approvedAt: new Date(),
        isTop: false // මුලින්ම Top list එකේ නැතිව සාමාන්‍ය විදියට දාමු
      });

      alert("Vendor & Payment Approved! Now visible on Home Page.");
    } catch (error) {
      console.error("Approval Error:", error);
      alert("Error: " + error.message);
    }
  };

  // 3. Request එක Reject කිරීම
  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this request?")) {
      try {
        await deleteDoc(doc(db, "payment_requests", id));
      } catch (error) {
        alert("Error: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Admin Panel</h1>
            <p className="text-slate-500 font-medium">Verify payments and authorize vendor listings</p>
          </div>
          <div className="bg-rose-100 text-rose-600 px-6 py-2 rounded-2xl font-black text-sm shadow-sm border border-rose-200">
            PENDING REQUESTS: {requests.length}
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20 italic text-slate-400">Loading secure data...</div>
        ) : requests.length === 0 ? (
          <div className="bg-white p-16 rounded-[2.5rem] shadow-xl text-center border border-slate-100">
            <p className="text-slate-300 text-xl font-semibold">Everything is up to date. No pending tasks!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {requests.map((req) => (
              <div key={req.id} className="bg-white rounded-[2.5rem] shadow-lg border border-slate-100 overflow-hidden flex flex-col transition-transform hover:scale-[1.02]">
                <div className="p-8 flex-grow">
                  <div className="flex justify-between items-center mb-6">
                    <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                      {req.plan || 'Standard'} Plan
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                      {req.createdAt?.toDate().toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">{req.businessName || 'New Vendor'}</h3>
                  <p className="text-slate-400 text-xs mb-6 uppercase tracking-widest font-bold">Bank Transfer Verification</p>
                  
                  <div className="relative group">
                    {req.slipUrl ? (
                      <a href={req.slipUrl} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-[1.5rem]">
                        <img 
                          src={req.slipUrl} 
                          alt="Bank Slip" 
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500 brightness-95 group-hover:brightness-100"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                      </a>
                    ) : (
                      <div className="bg-slate-100 rounded-[1.5rem] h-64 flex items-center justify-center border-2 border-dashed border-slate-200">
                         <span className="text-slate-400 font-bold uppercase text-[10px]">No slip uploaded</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex gap-3">
                  <button 
                    onClick={() => handleApprove(req)}
                    className="flex-[2] bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200 active:scale-95"
                  >
                    Approve Vendor
                  </button>
                  <button 
                    onClick={() => handleReject(req.id)}
                    className="flex-1 bg-white text-rose-500 border border-rose-100 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-50 transition-all active:scale-95"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}