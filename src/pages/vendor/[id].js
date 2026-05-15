import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function VendorDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [vendor, setVendor] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    event: 'Wedding',
    date: '',
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

  // --- BOOKING LOGIC ---
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedPackage) {
      alert("Please select an Investment Plan first!");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save to Firebase
      await addDoc(collection(db, "bookings"), {
        ...bookingDetails,
        vendorId: id,
        vendorName: vendor.businessName,
        packageName: selectedPackage.name,
        totalPrice: calculateTotal(),
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      alert("🎉 Reservation Sent Successfully! Our team will contact you shortly.");
      
      // Reset Form
      setBookingDetails({ name: '', event: 'Wedding', date: '', phone: '' });
      setSelectedPackage(null);

    } catch (error) {
      console.error("Booking Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!vendor) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
      <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-serif italic animate-pulse">Loading Story...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[90vh] w-full overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0">
          <img 
             src={vendor.profileImage || "https://images.unsplash.com/photo-1519741497674-611481863552"} 
             className="w-full h-full object-cover opacity-50 scale-105"
             alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        </div>

        <div className="relative z-10 px-8 md:px-20 pb-20 max-w-7xl">
          <span className="text-rose-500 font-black text-xs tracking-[0.7em] uppercase mb-6 block">
            {vendor.category} Specialist
          </span>
          <h1 className="text-5xl md:text-[8rem] font-black uppercase leading-[0.8] tracking-tighter mb-6 italic">
            {vendor.businessName}
          </h1>
          <p className="text-gray-300 tracking-[0.4em] uppercase text-[10px] font-bold">
            📍 {vendor.district} | Excellence Certified
          </p>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-8 py-32 grid grid-cols-1 lg:grid-cols-12 gap-24">
        
        {/* --- LEFT SIDE: INFO --- */}
        <div className="lg:col-span-7 space-y-32">
          <section>
            <h2 className="text-4xl font-serif italic mb-8 border-l-4 border-rose-600 pl-8 uppercase">The Vision</h2>
            <p className="text-xl text-gray-400 leading-relaxed font-light">
              Crafting unforgettable memories in {vendor.district}. We specialize in turning your {vendor.category} dreams into reality.
            </p>
          </section>

          {/* Investment Plans */}
          <section>
            <h2 className="text-4xl font-serif italic mb-12 border-l-4 border-rose-600 pl-8 uppercase">Investment Plans</h2>
            <div className="grid grid-cols-1 gap-6">
              {packages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  onClick={() => setSelectedPackage(pkg)}
                  className={`p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-500 ${selectedPackage?.id === pkg.id ? 'border-rose-500 bg-rose-500/10' : 'border-white/5 bg-white/5'}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold">{pkg.name}</h3>
                      <p className="text-gray-400 text-xs mt-1">{pkg.details}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-rose-500 font-black text-2xl">Rs. {pkg.price.toLocaleString()}</p>
                      <span className="text-[10px] text-rose-400 uppercase font-bold">Save {pkg.discount}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* --- RIGHT SIDE: BOOKING FORM --- */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-20 bg-slate-900 border border-white/10 rounded-[3rem] p-10 shadow-3xl">
            <h3 className="text-3xl font-serif italic mb-10 text-center">Secure Your Date</h3>
            
            <form onSubmit={handleBooking} className="space-y-6">
              <input 
                required placeholder="YOUR NAME" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-rose-500 text-sm" 
                value={bookingDetails.name}
                onChange={(e) => setBookingDetails({...bookingDetails, name: e.target.value})} 
              />

              <div className="grid grid-cols-2 gap-4">
                <select 
                  className="bg-slate-800 border border-white/10 rounded-2xl p-5 text-sm outline-none"
                  value={bookingDetails.event}
                  onChange={(e) => setBookingDetails({...bookingDetails, event: e.target.value})}
                >
                  <option>Wedding</option>
                  <option>Engagement</option>
                  <option>Pre-Shoot</option>
                </select>
                <input 
                  required type="date" 
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 text-sm outline-none focus:border-rose-500" 
                  value={bookingDetails.date}
                  onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})} 
                />
              </div>

              <input 
                required placeholder="PHONE NUMBER" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-rose-500 text-sm" 
                value={bookingDetails.phone}
                onChange={(e) => setBookingDetails({...bookingDetails, phone: e.target.value})} 
              />

              {selectedPackage && (
                <div className="bg-rose-600/10 p-6 rounded-2xl border border-rose-500/20">
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase font-bold tracking-tighter text-gray-400">Total Investment</span>
                    <span className="text-2xl font-black text-rose-500">Rs. {calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.3em] transition-all text-xs ${isSubmitting ? 'bg-gray-700 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-500 shadow-2xl shadow-rose-900/40'}`}
              >
                {isSubmitting ? 'Processing...' : 'Confirm Reservation'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="py-20 text-center border-t border-white/5">
        <Link href="/">
          <span className="text-[10px] uppercase tracking-[0.5em] text-gray-500 hover:text-rose-500 cursor-pointer transition-all">← Back to Collections</span>
        </Link>
      </div>
    </div>
  );
}