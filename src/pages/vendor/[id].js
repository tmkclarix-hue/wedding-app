import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function VendorDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [vendor, setVendor] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    event: 'Wedding',
    location: '',
    date: '',
    description: '',
    phone: ''
  });

  const packages = [
    { id: 1, name: 'Silver Package', price: 50000, discount: 5, details: 'Full day coverage, 1 Album' },
    { id: 2, name: 'Gold Package', price: 100000, discount: 10, details: 'Pre-shoot + Full day, 2 Albums' },
    { id: 3, name: 'Platinum Package', price: 150000, discount: 15, details: 'Drone + Full day, 3 Albums, Video' },
  ];

  useEffect(() => {
    if (id) {
      const getVendor = async () => {
        const docRef = doc(db, "pending_vendors", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setVendor(docSnap.data());
      };
      getVendor();
    }
  }, [id]);

  const calculateTotal = () => {
    if (!selectedPackage) return 0;
    const discountAmount = (selectedPackage.price * selectedPackage.discount) / 100;
    return selectedPackage.price - discountAmount;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    alert("Booking Sent Successfully! Total: Rs." + calculateTotal());
  };

  if (!vendor) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
      <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-serif italic animate-pulse">Loading Story...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden">
      
      {/* --- 1. LUXURY HERO SECTION --- */}
      <div className="relative h-[90vh] w-full overflow-hidden flex items-end">
        {/* Background Video/Image */}
        <div className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-50 scale-105">
            <source src={vendor.promoVideo || "/wedding.mp4"} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent"></div>
        </div>

        {/* --- GIANT TYPOGRAPHY (The Name) --- */}
        <div className="relative z-10 px-8 md:px-20 pb-20 max-w-7xl">
          <span className="text-rose-500 font-black text-xs tracking-[0.7em] uppercase mb-6 block animate-fade-in">
            {vendor.category} Specialist
          </span>
          <h1 className="text-7xl md:text-[10rem] font-black uppercase leading-[0.8] tracking-tighter mb-6 drop-shadow-2xl italic">
            {vendor.businessName}
          </h1>
          <div className="flex items-center gap-6">
            <div className="h-[2px] w-24 bg-rose-600"></div>
            <p className="text-gray-300 tracking-[0.4em] uppercase text-[10px] font-bold">
              📍 {vendor.district} | Excellence Certified
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-8 py-32 grid grid-cols-1 lg:grid-cols-12 gap-24">
        
        {/* --- LEFT SIDE: PORTFOLIO & INFO --- */}
        <div className="lg:col-span-7 space-y-32">
          
          {/* About Section */}
          <section>
            <h2 className="text-5xl font-serif italic mb-8 border-l-4 border-rose-600 pl-8 uppercase tracking-tighter">The Vision</h2>
            <p className="text-xl text-gray-400 leading-relaxed font-light">
              Crafting unforgettable memories in {vendor.district} for years. We specialize in turning your {vendor.category} dreams into high-definition reality.
            </p>
          </section>

          {/* Portfolio Showcase */}
          <section>
            <h2 className="text-5xl font-serif italic mb-12 border-l-4 border-rose-600 pl-8 uppercase tracking-tighter">Featured Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {(vendor.galleryImages || [1, 2, 3, 4]).slice(0, 4).map((img, i) => (
                <div key={i} className="group relative h-[450px] rounded-[3.5rem] overflow-hidden border border-white/10 hover:border-rose-500/50 transition-all duration-1000 shadow-3xl">
                  <img 
                    src={typeof img === 'string' ? img : `https://images.unsplash.com/photo-1519741497674-611481863552?q=80`} 
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-[2000ms] group-hover:scale-110" 
                    alt="Vendor Work" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                </div>
              ))}
            </div>
          </section>

          {/* Service Packages */}
          <section>
            <h2 className="text-5xl font-serif italic mb-12 border-l-4 border-rose-600 pl-8 uppercase tracking-tighter">Investment Plans</h2>
            <div className="space-y-8">
              {packages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  onClick={() => setSelectedPackage(pkg)}
                  className={`p-10 rounded-[3rem] border-2 cursor-pointer transition-all duration-500 ${selectedPackage?.id === pkg.id ? 'border-rose-500 bg-rose-500/10 scale-[1.02]' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-3xl font-bold mb-2">{pkg.name}</h3>
                      <p className="text-gray-400 text-sm tracking-wide">{pkg.details}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-rose-500 font-black text-3xl">Rs. {pkg.price.toLocaleString()}</p>
                      <span className="bg-rose-600/20 text-rose-500 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter">Save {pkg.discount}% Today</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* --- RIGHT SIDE: STICKY BOOKING FORM --- */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-20 bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-12 shadow-3xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-600 via-rose-400 to-rose-600"></div>
            
            <h3 className="text-4xl font-serif italic mb-10 text-center">Secure Your Date</h3>
            
            <form onSubmit={handleBooking} className="space-y-8">
              <div>
                <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-3 block font-bold">Client Name</label>
                <input required placeholder="Your Full Name" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-rose-500 transition-all text-sm" type="text" onChange={(e) => setBookingDetails({...bookingDetails, name: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-3 block font-bold">Event Type</label>
                  <select className="w-full bg-slate-800 border border-white/10 rounded-2xl p-5 outline-none text-sm cursor-pointer" onChange={(e) => setBookingDetails({...bookingDetails, event: e.target.value})}>
                    <option>Wedding</option>
                    <option>Engagement</option>
                    <option>Pre-Shoot</option>
                    <option>Birthday</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-3 block font-bold">Event Date</label>
                  <input required className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-rose-500 text-sm" type="date" onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-3 block font-bold">Contact Number</label>
                <input required placeholder="+94 7X XXX XXXX" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-rose-500 text-sm" type="tel" onChange={(e) => setBookingDetails({...bookingDetails, phone: e.target.value})} />
              </div>

              {/* Dynamic Price Summary */}
              {selectedPackage && (
                <div className="bg-rose-600/10 p-8 rounded-[2.5rem] border border-rose-500/20 animate-fade-in">
                  <div className="flex justify-between mb-3">
                    <span className="text-xs text-gray-400 uppercase tracking-widest">Selected: {selectedPackage.name}</span>
                    <span className="text-xs line-through text-gray-600">Rs. {selectedPackage.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold uppercase tracking-tighter">Final Investment</span>
                    <span className="text-3xl font-black text-rose-500">Rs. {calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              )}

              <button type="submit" className="w-full py-6 bg-rose-600 hover:bg-rose-500 text-white rounded-3xl font-black uppercase tracking-[0.4em] transition-all shadow-2xl shadow-rose-900/40 text-xs active:scale-95">
                Confirm Reservation
              </button>
              
              <p className="text-center text-[9px] text-gray-600 uppercase tracking-[0.2em] font-medium leading-loose">
                Instant Confirmation • Secure Payment • 24/7 Support
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* --- Footer Admin Link --- */}
      <div className="py-20 text-center border-t border-white/5">
        <Link href="/">
          <span className="text-[10px] uppercase tracking-[0.5em] text-gray-500 hover:text-rose-500 cursor-pointer transition-all">← Back to Collections</span>
        </Link>
      </div>
    </div>
  );
}