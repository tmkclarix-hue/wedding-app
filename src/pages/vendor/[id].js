import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';

export default function VendorDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [vendor, setVendor] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    event: 'Wedding',
    location: '',
    time: '',
    date: '',
    description: '',
    phone: ''
  });

  // Sample Packages (මේවා Firebase එකෙන් ගන්නත් පුළුවන්)
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
    alert("Booking Sent! Total: Rs." + calculateTotal());
    // මෙතනදී Firebase එකට හෝ Google Sheets එකට Data යවන්න පුළුවන්
  };

  if (!vendor) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-serif italic">Loading Story...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden">
      
      {/* --- 1. Video Hero Section --- */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        <video autoPlay muted loop className="absolute inset-0 w-full h-full object-cover opacity-60">
          <source src={vendor.workVideo || "/wedding.mp4"} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50"></div>
        <div className="absolute bottom-20 left-10 md:left-20 z-10">
          <span className="text-rose-500 font-black text-xs tracking-[0.5em] uppercase mb-4 block">Official Portfolio</span>
          <h1 className="text-7xl md:text-9xl font-serif italic tracking-tighter mb-4">{vendor.businessName}</h1>
          <p className="text-gray-300 tracking-[0.3em] uppercase text-xs">📍 {vendor.district} | {vendor.category}</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-20">
        
        {/* --- Left Side: Portfolio & Info --- */}
        <div className="lg:col-span-7">
          <h2 className="text-4xl font-serif italic mb-12 border-l-4 border-rose-600 pl-6">Portfolio Showcase</h2>
          
          {/* Scrolling Gallery Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group relative h-96 rounded-[2rem] overflow-hidden border border-white/10 hover:border-rose-500/50 transition-all duration-700 hover:-translate-y-2 shadow-2xl">
                <img src={vendor.imageUrl || `https://images.unsplash.com/photo-1519741497674-611481863552?q=80`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000" alt="Work" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                  <p className="text-rose-400 font-bold uppercase text-[10px] tracking-widest">Wedding Shoot</p>
                  <h3 className="text-xl font-serif">Captured Moments</h3>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-4xl font-serif italic mb-12 border-l-4 border-rose-600 pl-6">Service Packages</h2>
          <div className="space-y-6">
            {packages.map((pkg) => (
              <div 
                key={pkg.id} 
                onClick={() => setSelectedPackage(pkg)}
                className={`p-8 rounded-3xl border cursor-pointer transition-all ${selectedPackage?.id === pkg.id ? 'border-rose-500 bg-rose-500/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">{pkg.name}</h3>
                    <p className="text-gray-400 text-sm">{pkg.details}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-rose-500 font-bold text-xl">Rs. {pkg.price.toLocaleString()}</p>
                    <p className="text-green-500 text-[10px] font-black uppercase tracking-tighter">{pkg.discount}% OFF INCLUDED</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Right Side: Booking Form --- */}
        <div className="lg:col-span-5">
          <div className="sticky top-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 shadow-3xl">
            <h3 className="text-3xl font-serif italic mb-8 text-center">Secure Your Date</h3>
            
            <form onSubmit={handleBooking} className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 block">Full Name</label>
                <input required className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-rose-500 transition-all" type="text" onChange={(e) => setBookingDetails({...bookingDetails, name: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 block">Event Type</label>
                  <select className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 outline-none" onChange={(e) => setBookingDetails({...bookingDetails, event: e.target.value})}>
                    <option>Wedding</option>
                    <option>Birthday</option>
                    <option>Engagement</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 block">Event Date</label>
                  <input required className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none" type="date" onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 block">Location & Contact</label>
                <div className="grid grid-cols-2 gap-4">
                   <input required placeholder="Location" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none" type="text" onChange={(e) => setBookingDetails({...bookingDetails, location: e.target.value})} />
                   <input required placeholder="Phone" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none" type="tel" onChange={(e) => setBookingDetails({...bookingDetails, phone: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 block">Special Note (Optional)</label>
                <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 h-24 outline-none" onChange={(e) => setBookingDetails({...bookingDetails, description: e.target.value})}></textarea>
              </div>

              {/* Pricing Summary */}
              {selectedPackage && (
                <div className="bg-rose-600/20 p-6 rounded-2xl border border-rose-500/30">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-gray-300">Package Price:</span>
                    <span className="text-xs line-through text-gray-500">Rs. {selectedPackage.price}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total To Pay:</span>
                    <span className="text-rose-500">Rs. {calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              )}

              <button type="submit" className="w-full py-5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-rose-900/20">
                Confirm & Pay Advance
              </button>
              
              <p className="text-center text-[9px] text-gray-500 uppercase tracking-widest">
                Safe & Secure Card Payment Powered by WeddingApp
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}