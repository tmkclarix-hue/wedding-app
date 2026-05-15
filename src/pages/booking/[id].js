import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function BookingPage() {
  const router = useRouter();
  const { id } = router.query;
  const [service, setService] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchService = async () => {
      try {
        const docRef = doc(db, "pending_vendors", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setService(data);
          
          // මිල රු. 100,000 ට වැඩි නම් 10% discount එකක්
          const priceNum = typeof data.price === 'string' 
            ? parseFloat(data.price.replace(/,/g, '')) 
            : parseFloat(data.price) || 0;

          if (priceNum > 100000) {
            setDiscount(priceNum * 0.1);
          }
        }
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };
    fetchService();
  }, [id]);

  const confirmBooking = async () => {
    setLoading(true);
    const priceNum = typeof service.price === 'string' 
        ? parseFloat(service.price.replace(/,/g, '')) 
        : parseFloat(service.price) || 0;

    try {
      await addDoc(collection(db, "bookings"), {
        vendorId: id,
        businessName: service.businessName,
        category: service.category,
        district: service.district,
        price: priceNum,
        discountApplied: discount,
        totalPaid: priceNum - discount,
        status: "New Booking",
        bookedAt: serverTimestamp(),
      });

      setBooked(true);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  if (!service) return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-center">
      <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-white font-black text-[10px] tracking-[0.3em] uppercase">Generating Your Invoice...</p>
    </div>
  );

  const priceNum = typeof service.price === 'string' 
    ? parseFloat(service.price.replace(/,/g, '')) 
    : parseFloat(service.price) || 0;
  const finalPrice = priceNum - discount;

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-10 flex flex-col items-center justify-start md:justify-center font-sans overflow-x-hidden">
      
      {/* --- INVOICE CARD --- */}
      <div id="invoice" className="bg-white text-slate-900 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] max-w-md w-full shadow-2xl border-t-[12px] border-rose-600 animate-in fade-in zoom-in duration-500 relative">
        {booked && (
            <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest no-print">
                Verified Quote
            </div>
        )}
        
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 uppercase">Quote</h2>
          <p className="text-[8px] md:text-[9px] bg-slate-100 px-3 py-1 rounded-full inline-block mt-2 font-black text-slate-500 uppercase tracking-widest">
            Wedding Directory Official
          </p>
        </div>

        <div className="space-y-4 border-b border-dashed border-slate-200 pb-6 mb-6">
          <div className="flex justify-between items-end">
            <span className="text-slate-400 text-[8px] md:text-[9px] uppercase font-black tracking-widest">Service Provider</span>
            <span className="font-black text-slate-800 text-sm md:text-base text-right">{service.businessName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-[8px] md:text-[9px] uppercase font-black tracking-widest">Category</span>
            <span className="text-slate-600 font-bold text-xs">{service.category}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-[8px] md:text-[9px] uppercase font-black tracking-widest">District</span>
            <span className="text-slate-600 font-bold text-xs">{service.district}</span>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 font-bold">Base Rate</span>
            <span className="font-bold text-slate-700">Rs. {priceNum.toLocaleString()}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-xs text-emerald-600 font-black">
              <span>Directory Discount (10%)</span>
              <span>- Rs. {discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between border-t-2 border-slate-900 pt-5 mt-4">
            <span className="text-xs font-black uppercase tracking-widest">Total Amount</span>
            <span className="text-xl md:text-2xl font-black text-rose-600">Rs. {finalPrice.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl text-center">
          <p className="text-[8px] text-slate-400 leading-normal font-bold uppercase tracking-tight">
            * Note: This is an estimated price. Please connect with the vendor for date availability and final confirmation.
          </p>
        </div>
      </div>

      {/* --- CONTROLS (Hidden during printing) --- */}
      <div className="mt-8 flex flex-col gap-3 w-full max-w-md no-print px-4">
        {!booked ? (
          <button 
            disabled={loading}
            onClick={confirmBooking}
            className="w-full bg-rose-600 text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-rose-700 transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm Booking Inquiry"}
          </button>
        ) : (
          <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-500">
             <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-center">
                <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">🎉 Success! Admin notified.</p>
             </div>
            <button 
              onClick={() => window.print()}
              className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gray-100 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              📥 Save Invoice (PDF)
            </button>
          </div>
        )}
        
        <button 
          onClick={() => router.back()}
          className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors py-3"
        >
          ← Back to Directory
        </button>
      </div>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0; padding: 0; }
          .min-h-screen { background: white !important; padding: 0 !important; display: block !important; }
          #invoice { 
            box-shadow: none !important; 
            border: 1px solid #eee !important; 
            margin: 20px auto !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}