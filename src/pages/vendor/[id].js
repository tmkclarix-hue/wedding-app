import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';

export default function VendorDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [vendor, setVendor] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    event: 'Wedding',
    date: '',
    phone: ''
  });

  // අද දිනය ලබා ගැනීම (අතීත දින වැළැක්වීමට)
  const today = new Date().toISOString().split('T')[0];

  const packages = [
    { id: 1, name: 'Silver Package', price: 50000, discount: 5, details: 'Full day coverage, 1 Premium Album' },
    { id: 2, name: 'Gold Package', price: 100000, discount: 10, details: 'Pre-shoot + Wedding Day, 2 Luxury Albums' },
    { id: 3, name: 'Platinum Package', price: 150000, discount: 15, details: 'Drone + Cinematic Video, 3 Albums, Canvas' },
  ];

  useEffect(() => {
    if (id) {
      const getVendor = async () => {
        try {
          const docRef = doc(db, "pending_vendors", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) setVendor(docSnap.data());
        } catch (err) {
          console.error("Fetch Error:", err);
        }
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
    if (!selectedPackage) return alert("Please select an Investment Plan first!");
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "bookings"), {
        ...bookingDetails,
        vendorId: id,
        vendorName: vendor.businessName,
        packageName: selectedPackage.name,
        packagePrice: selectedPackage.price,
        finalTotal: calculateTotal(),
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      setIsSuccess(true);
      setBookingDetails({ name: '', event: 'Wedding', date: '', phone: '' });
      setSelectedPackage(null);
      // තත්පර 5කට පසු success message එක අයින් කරන්න
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      alert("Registration failed. Check connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!vendor) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
      <div className="w-10 h-10 border-2 border-rose-600 border-t-transparent rounded-full animate-spin mb-6"></div>
      <p className="font-serif italic tracking-widest text-xs uppercase opacity-50">Curating the Experience...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-rose-500">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[80vh] md:h-[90vh] w-full overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0">
          <img 
             src={vendor.profileImage || vendor.imageUrl || "https://images.unsplash.com/photo-1519741497674-611481863552"} 
             className="w-full h-full object-cover animate-slow-zoom"
             alt="Vendor Backdrop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
        </div>

        <div className="relative z-10 px-6 md:px-20 pb-16 md:pb-24 max-w-7xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-rose-500"></div>
            <span className="text-rose-500 font-black text-[9px] md:text-xs tracking-[0.5em] uppercase">
                {vendor.category} Artisan
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-black uppercase leading-[0.9] tracking-tighter mb-6 italic animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {vendor.businessName}
          </h1>
          <div className="flex items-center gap-6 text-gray-400 tracking-[0.3em] uppercase text-[9px] md:text-[11px] font-black">
            <span>📍 {vendor.district}</span>
            <span className="h-1 w-1 bg-white/20 rounded-full"></span>
            <span>Est. Professional</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 md:py-40 grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32">
        
        {/* --- LEFT SIDE: INFO --- */}
        <div className="lg:col-span-7 space-y-24 md:space-y-40">
          <section className="animate-in fade-in slide-in-from-left duration-700">
            <h2 className="text-xs font-black tracking-[0.5em] text-rose-500 uppercase mb-8">The Philosophy</h2>
            <p className="text-2xl md:text-4xl text-white leading-tight font-serif italic">
              "We believe every wedding is a unique masterpiece. Based in {vendor.district}, we bring a touch of class and perfection to every {vendor.category} detail."
            </p>
          </section>

          <section>
            <h2 className="text-xs font-black tracking-[0.5em] text-rose-500 uppercase mb-12">Investment Plans</h2>
            <div className="grid grid-cols-1 gap-6">
              {packages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  onClick={() => setSelectedPackage(pkg)}
                  className={`group p-8 md:p-10 rounded-[2.5rem] border transition-all duration-700 relative overflow-hidden ${selectedPackage?.id === pkg.id ? 'border-rose-500 bg-rose-500/5' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 relative z-10">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tighter">{pkg.name}</h3>
                        {pkg.discount > 10 && <span className="bg-rose-600 text-white text-[8px] font-black px-2 py-1 rounded">POPULAR</span>}
                      </div>
                      <p className="text-gray-500 text-xs font-medium max-w-xs">{pkg.details}</p>
                    </div>
                    <div className="md:text-right">
                      <p className="text-white font-black text-2xl md:text-3xl tracking-tighter">Rs. {pkg.price.toLocaleString()}</p>
                      <span className="text-[10px] text-emerald-500 uppercase font-black tracking-widest block mt-1">
                        Exclusive {pkg.discount}% Off
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* --- RIGHT SIDE: BOOKING FORM --- */}
        <div className="lg:col-span-5 relative">
          <div className="lg:sticky lg:top-24 bg-slate-900/50 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
            <div className="text-center mb-10">
                <h3 className="text-2xl font-serif italic text-white mb-2">Reservation</h3>
                <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Inquiry for {vendor.businessName}</p>
            </div>
            
            {isSuccess ? (
                <div className="py-12 text-center animate-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">✓</div>
                    <h4 className="font-serif italic text-xl mb-2">Inquiry Received</h4>
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest">We will contact you shortly.</p>
                </div>
            ) : (
                <form onSubmit={handleBooking} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-500 uppercase ml-4 tracking-widest">Client Name</label>
                    <input 
                        required placeholder="Ex: Mr. & Mrs. Perera" 
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 outline-none focus:border-rose-500/50 text-sm transition-all" 
                        value={bookingDetails.name}
                        onChange={(e) => setBookingDetails({...bookingDetails, name: e.target.value})} 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-500 uppercase ml-4 tracking-widest">Event Type</label>
                        <select 
                            className="w-full bg-slate-800 border border-white/5 rounded-2xl p-5 text-sm outline-none cursor-pointer"
                            value={bookingDetails.event}
                            onChange={(e) => setBookingDetails({...bookingDetails, event: e.target.value})}
                        >
                            <option>Wedding</option>
                            <option>Engagement</option>
                            <option>Pre-Shoot</option>
                            <option>Home Coming</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-500 uppercase ml-4 tracking-widest">Select Date</label>
                        <input 
                            required type="date" 
                            min={today}
                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-rose-500/50 text-white" 
                            value={bookingDetails.date}
                            onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})} 
                        />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-500 uppercase ml-4 tracking-widest">Contact Number</label>
                    <input 
                        required type="tel" placeholder="+94 7X XXX XXXX" 
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-5 outline-none focus:border-rose-500/50 text-sm transition-all" 
                        value={bookingDetails.phone}
                        onChange={(e) => setBookingDetails({...bookingDetails, phone: e.target.value})} 
                    />
                  </div>

                  {selectedPackage && (
                    <div className="bg-rose-600/5 p-6 rounded-[2rem] border border-rose-500/20 mt-4 animate-in fade-in duration-500">
                      <div className="flex justify-between items-center">
                        <div className="text-left">
                            <span className="text-[9px] uppercase font-black tracking-widest text-rose-500 block">{selectedPackage.name}</span>
                            <span className="text-[8px] text-gray-500 uppercase">After {selectedPackage.discount}% Discount</span>
                        </div>
                        <span className="text-2xl font-black text-white">Rs. {calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] transition-all text-[10px] mt-4 ${isSubmitting ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-rose-600 text-white hover:bg-rose-500 hover:shadow-[0_20px_50px_rgba(225,29,72,0.3)] active:scale-95'}`}
                  >
                    {isSubmitting ? 'Authenticating...' : 'Confirm Reservation'}
                  </button>
                </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="py-20 text-center border-t border-white/5">
        <Link href={`/category/${vendor.category?.toLowerCase()}`}>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 hover:text-white cursor-pointer transition-all">← Discover More Specialists</span>
        </Link>
      </div>

      <style jsx global>{`
        @keyframes slow-zoom {
            0% { transform: scale(1); }
            100% { transform: scale(1.15); }
        }
        .animate-slow-zoom {
            animation: slow-zoom 20s ease-out infinite alternate;
        }
      `}</style>
    </div>
  );
}