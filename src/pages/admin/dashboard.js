import { useState, useEffect, useContext } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, updateDoc, doc, onSnapshot, orderBy } from 'firebase/firestore';
import { LanguageContext } from '../_app';

export default function AdminDashboard() {
  const { t } = useContext(LanguageContext);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // දත්ත Real-time ලබාගැනීම
    const q = query(
      collection(db, "pending_vendors"), 
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setVendors(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching vendors:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Status එක 'approved' කිරීම
  const approveVendor = async (id) => {
    if(!window.confirm("මෙම ව්‍යාපාරය Approve කිරීමට ඔබට විශ්වාසද?")) return;
    try {
      const docRef = doc(db, "pending_vendors", id);
      await updateDoc(docRef, { status: 'approved' });
      alert("Vendor Approved Successfully!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  }

  // Top Vendor Toggle Logic
  const toggleTopVendor = async (id, currentStatus) => {
    try {
      const docRef = doc(db, "pending_vendors", id);
      await updateDoc(docRef, { isTop: !currentStatus });
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 font-sans selection:bg-rose-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <h1 className="text-5xl font-serif italic text-white mb-2 leading-none">
              Control <span className="text-rose-500">Center</span>
            </h1>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.5em]">
              Directory Management & Verification
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-[2rem] text-center">
              <span className="block text-2xl font-black text-rose-500 leading-none">{vendors.length}</span>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Total Vendors</span>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-40">
            <div className="w-12 h-12 border-2 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-600">Accessing Database</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vendors.length === 0 ? (
              <div className="col-span-full py-40 text-center opacity-20">
                <span className="text-6xl block mb-4">📂</span>
                <p className="uppercase tracking-[1em] text-xs font-black">No Records Found</p>
              </div>
            ) : (
              vendors.map((vendor) => (
                <div key={vendor.id} className={`relative group bg-white/[0.02] border ${vendor.isTop ? 'border-amber-500/30' : 'border-white/5'} p-8 rounded-[3rem] transition-all duration-500 hover:bg-white/[0.04]`}>
                  
                  {/* Status Badges */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-black px-4 py-1.5 bg-rose-600 rounded-full uppercase tracking-widest w-fit">
                            {vendor.category}
                        </span>
                        <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest w-fit border ${vendor.status === 'approved' ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10' : 'border-amber-500 text-amber-500 bg-amber-400/10'}`}>
                            {vendor.status}
                        </span>
                    </div>
                    {vendor.isTop && (
                        <div className="bg-amber-500 p-2 rounded-full shadow-lg shadow-amber-500/20">
                            <span className="text-xs">⭐</span>
                        </div>
                    )}
                  </div>

                  <h3 className="text-2xl font-serif italic text-white mb-2">{vendor.businessName}</h3>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-6 italic">📍 {vendor.district}</p>

                  <div className="space-y-3 mb-10">
                    <div className="flex justify-between items-center text-xs p-3 bg-black/30 rounded-2xl border border-white/5">
                        <span className="text-gray-500 font-bold uppercase tracking-tighter">Contact</span>
                        <span className="text-emerald-400 font-mono font-bold tracking-widest">{vendor.phone}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {/* Approve Button */}
                    {vendor.status !== 'approved' ? (
                      <button 
                        onClick={() => approveVendor(vendor.id)}
                        className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-500 hover:text-white transition-all shadow-xl"
                      >
                        Approve Profile
                      </button>
                    ) : (
                      <button 
                        onClick={() => toggleTopVendor(vendor.id, vendor.isTop)}
                        className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                          vendor.isTop 
                          ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-black' 
                          : 'border-white/10 text-gray-500 hover:border-amber-500 hover:text-amber-500'
                        }`}
                      >
                        {vendor.isTop ? 'Remove from Top' : 'Promote to Top'}
                      </button>
                    )}
                    
                    {/* External Link to Portfolio */}
                    <a 
                      href={`/vendor/${vendor.id}`} 
                      target="_blank" 
                      className="text-center text-[9px] text-gray-600 font-black uppercase tracking-[0.3em] mt-2 hover:text-white transition-colors"
                    >
                      View Live Portfolio ↗
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}