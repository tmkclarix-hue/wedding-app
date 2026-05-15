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

  // ශ්‍රී ලංකාවේ ප්‍රධාන දිස්ත්‍රික්ක ලැයිස්තුව
  const districts = ["Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", "Galle", "Matara", "Hambantota", "Jaffna", "Kurunegala", "Anuradhapura", "Ratnapura", "Badulla"];

  useEffect(() => {
    if (!type) return;

    const fetchVendors = async () => {
      setLoading(true);
      try {
        // පළමු අකුර Capitalize කිරීම (Photography, Hotel, etc.)
        const formattedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
        
        const q = query(
          collection(db, "pending_vendors"), 
          where("category", "==", formattedType),
          where("status", "==", "approved")
        );
        
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVendors(data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
      setLoading(false);
    };

    fetchVendors();
  }, [type]);

  // District Filter Logic
  const filteredVendors = vendors.filter(v => 
    district === '' || v.district?.toLowerCase() === district.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-rose-500">
      
      {/* --- Header Section --- */}
      <div className="pt-24 pb-12 px-6 md:px-20 bg-gradient-to-b from-rose-500/10 via-slate-950/50 to-transparent">
        <nav className="text-[10px] uppercase tracking-[0.3em] text-rose-500 font-black mb-6 animate-pulse">
            <Link href="/" className="hover:text-white transition-colors">Home</Link> / {type}
        </nav>
        <h1 className="text-5xl md:text-8xl font-serif italic capitalize mb-4 tracking-tighter leading-tight">
          {type} <span className="text-rose-500 text-3xl md:text-5xl">.</span>
        </h1>
        <p className="text-gray-500 text-[10px] md:text-xs tracking-[0.4em] uppercase font-bold max-w-xl leading-relaxed">
          Curated collection of premier wedding specialists for your unforgettable day.
        </p>
      </div>

      {/* --- Sticky Filter Bar --- */}
      <div className="sticky top-4 z-40 px-6 md:px-20 mb-16">
        <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-3 md:p-4 rounded-[2rem] md:rounded-full flex flex-col md:flex-row gap-4 items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="bg-rose-500/20 p-2 rounded-full hidden md:block">
                <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
            </div>
            <select 
              className="bg-slate-800/80 border border-white/5 px-6 py-3 rounded-full outline-none text-[10px] font-black uppercase tracking-widest transition-all focus:ring-2 focus:ring-rose-500/50 w-full md:w-64 appearance-none cursor-pointer"
              onChange={(e) => setDistrict(e.target.value)}
            >
              <option value="">All Regions (Sri Lanka)</option>
              {districts.map(d => (
                <option key={d} value={d} className="bg-slate-900">{d}</option>
              ))}
            </select>
          </div>
          <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] pr-4">
            Showing <span className="text-white">{filteredVendors.length}</span> Masterpieces
          </div>
        </div>
      </div>

      {/* --- Grid Section --- */}
      <div className="px-6 md:px-20 pb-32">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <div className="w-12 h-12 border-2 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
            <div className="text-gray-600 animate-pulse uppercase tracking-[0.6em] text-[10px] font-black">Refining Results</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {filteredVendors.map((vendor) => (
              <div key={vendor.id} className="group bg-slate-900/40 rounded-[3.5rem] overflow-hidden border border-white/5 hover:border-rose-500/30 transition-all duration-1000 flex flex-col h-full hover:shadow-[0_30px_60px_-15px_rgba(225,29,72,0.1)]">
                
                {/* Image Container */}
                <div className="relative h-80 overflow-hidden cursor-pointer">
                  <img 
                    src={vendor.imageUrl || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc'} 
                    className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[2s] ease-out brightness-[0.8] group-hover:brightness-100"
                    alt={vendor.businessName}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-6 left-8">
                    <span className="bg-white/10 backdrop-blur-xl text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-white/20 text-white shadow-2xl">
                      {vendor.district}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-10 flex flex-col flex-grow">
                  <h2 className="text-2xl md:text-3xl font-serif italic mb-3 group-hover:text-rose-400 transition-colors duration-500">
                    {vendor.businessName}
                  </h2>
                  <p className="text-gray-500 text-[9px] uppercase tracking-[0.2em] mb-10 font-bold leading-relaxed">
                    Exquisite {vendor.category} services for modern weddings.
                  </p>
                  
                  <div className="mt-auto">
                    <Link href={`/vendor/${vendor.id}`}>
                        <button className="w-full bg-transparent border border-white/10 text-white py-5 rounded-[2rem] font-black text-[9px] uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all duration-500 group-hover:border-transparent group-hover:shadow-xl">
                        Discover Portfolio
                        </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredVendors.length === 0 && (
          <div className="text-center mt-32 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="w-24 h-24 bg-rose-500/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-rose-500/10">
                <span className="text-4xl grayscale opacity-40">💍</span>
            </div>
            <h3 className="text-white font-serif italic text-2xl mb-2">No Specialists Found</h3>
            <p className="text-gray-600 text-[10px] uppercase tracking-[0.4em] max-w-xs mx-auto leading-relaxed">
              We couldn't find any {type} in {district || 'this area'}. Try expanding your search island-wide.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}