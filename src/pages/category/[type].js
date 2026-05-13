import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';

export default function CategoryPage() {
  const router = useRouter();
  const { type } = router.query;
  
  const [vendors, setVendors] = useState([]);
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!type) return;

    const fetchVendors = async () => {
      setLoading(true);
      try {
        // Home Page එකේ වගේම 'pending_vendors' එකෙන් 'approved' අය විතරක් ගමු
        const q = query(
          collection(db, "pending_vendors"), 
          where("category", "==", type.charAt(0).toUpperCase() + type.slice(1)), // Capitalize category
          where("status", "==", "approved")
        );
        
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVendors(data);
      } catch (error) {
        console.error("Error:", error);
      }
      setLoading(false);
    };

    fetchVendors();
  }, [type]);

  // District filter logic
  const filteredVendors = vendors.filter(v => 
    district === '' || v.district?.toLowerCase() === district.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      
      {/* --- Header Section --- */}
      <div className="pt-20 pb-16 px-8 md:px-20 bg-gradient-to-b from-rose-500/10 to-transparent">
        <h1 className="text-5xl md:text-7xl font-serif italic capitalize mb-4 tracking-tighter">
          Exquisite {type}
        </h1>
        <p className="text-gray-500 text-xs md:text-sm tracking-[0.4em] uppercase font-bold">
          Discover the finest wedding professionals in Sri Lanka
        </p>
      </div>

      {/* --- Filter Bar --- */}
      <div className="sticky top-20 z-30 px-8 md:px-20 mb-12">
        <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/5 p-4 rounded-[2rem] flex flex-wrap gap-6 items-center justify-between shadow-2xl">
          <div className="flex items-center gap-4 ml-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">Filter By District:</span>
            <select 
              className="bg-slate-800 border border-white/10 px-6 py-2 rounded-full outline-none text-xs font-bold transition-all focus:border-rose-500"
              onChange={(e) => setDistrict(e.target.value)}
            >
              <option value="">All Island</option>
              {["Colombo", "Kandy", "Galle", "Gampaha", "Matara", "Kurunegala", "Negombo"].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="mr-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            {filteredVendors.length} Results Found
          </div>
        </div>
      </div>

      {/* --- Grid Section --- */}
      <div className="px-8 md:px-20 pb-32">
        {loading ? (
          <div className="text-center py-20 text-gray-600 animate-pulse uppercase tracking-[0.5em] text-xs">Seeking Excellence...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredVendors.map((vendor) => (
              <div key={vendor.id} className="group bg-slate-900/40 rounded-[3rem] overflow-hidden border border-white/5 hover:border-rose-500/20 transition-all duration-700 shadow-2xl">
                
                {/* Image Container */}
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={vendor.imageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552'} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 brightness-75 group-hover:brightness-100"
                    alt={vendor.businessName}
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-black/50 backdrop-blur-md text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/10">
                      📍 {vendor.district}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-10">
                  <h2 className="text-2xl font-serif italic mb-2 group-hover:text-rose-400 transition-colors">
                    {vendor.businessName}
                  </h2>
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-8 font-bold">
                    Professional {vendor.category} Service
                  </p>
                  
                  <Link href={`/vendor/${vendor.id}`}>
                    <button className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-500 hover:text-white transition-all transform active:scale-95 shadow-xl">
                      View Portfolio
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredVendors.length === 0 && (
          <div className="text-center mt-32">
            <span className="text-5xl block mb-6 opacity-20">💍</span>
            <div className="text-gray-500 text-xs uppercase tracking-[0.4em] italic font-medium">
              No master craftsmen found in {district || 'this selection'}.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}