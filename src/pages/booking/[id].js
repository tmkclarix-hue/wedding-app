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
        // වැදගත්: ඔයාගේ අනෙක් පේජ් වල වගේම 'pending_vendors' collection එකම පාවිච්චි කරන්න
        const docRef = doc(db, "pending_vendors", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setService(data);
          
          // මිල රු. 100,000 ට වැඩි නම් 10% discount එකක් (උදාහරණයක් ලෙස)
          const priceNum = parseFloat(data.price) || 0;
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
    try {
      await addDoc(collection(db, "bookings"), {
        vendorId: id,
        businessName: service.businessName,
        category: service.category,
        district: service.district,
        price: service.price,
        discountApplied: discount,
        totalPaid: service.price - discount,
        status: "New Booking",
        bookedAt: serverTimestamp(),
      });

      setBooked(true);
      alert("Booking successfully sent to Admin!");
    } catch (error) {
      console.error("Booking error:", error);
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  if (!service) return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center">
      <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-white mt-4 font-bold tracking-widest uppercase text-[10px]">Generating Invoice...</p>
    </div>
  );

  const priceNum = parseFloat(service.price) || 0;
  const finalPrice = priceNum - discount;

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex flex-col items-center justify-center font-sans">
      
      {/* --- INVOICE CARD --- */}
      <div id="invoice" className="bg-white text-slate-900 p-10 rounded-[2.5rem] max-w-md w-full shadow-2xl border-t-[15px] border-rose-600 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black tracking-tighter text-slate-800">INVOICE</h2>
          <div className="text-[9px] bg-slate-100 px-4 py-1.5 rounded-full inline-block mt-3 font-black text-slate-500 uppercase tracking-[0.2em]">
            Luxury Wedding Directory
          </div>
        </div>

        <div className="space-y-5 border-b border-dashed border-slate-200 pb-8 mb-8">
          <div className="flex justify-between items-baseline">
            <span className="text-gray-400 text-[10px] uppercase font-black tracking-widest">Provider</span>
            <span className="font-bold text-slate-800 text-lg">{service.businessName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-[10px] uppercase font-black tracking-widest">Service</span>
            <span className="text-slate-600 font-bold">{service.category}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-[10px] uppercase font-black tracking-widest">District</span>
            <span className="text-slate-600 font-bold">{service.district}</span>
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 font-medium">Standard Rate:</span>
            <span className="font-bold text-slate-700">LKR {priceNum.toLocaleString()}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-emerald-600 font-bold italic">
              <span>Directory Discount:</span>
              <span>- LKR {discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between border-t-2 border-slate-900 pt-6 mt-6">
            <span className="text-sm font-black uppercase tracking-tighter">Total Payable</span>
            <span className="text-2xl font-black text-rose-600">LKR {finalPrice.toLocaleString()}</span>
          </div>
        </div>

        <div className="text-center bg-slate-50 p-4 rounded-2xl">
          <p className="text-[9px] text-gray-400 leading-relaxed font-medium uppercase tracking-tight">
            This is a system-generated quote. <br/>
            Final pricing may vary based on specific requirements.
          </p>
        </div>
      </div>

      {/* --- CONTROLS --- */}
      <div className="mt-10 flex flex-col gap-4 w-full max-w-md no-print">
        {!booked ? (
          <button 
            disabled={loading}
            onClick={confirmBooking}
            className="w-full bg-rose-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-rose-700 transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? "Registering Request..." : "Confirm & Send to Admin"}
          </button>
        ) : (
          <div className="flex flex-col gap-4 animate-in slide-in-from-top-4 duration-500">
             <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-center">
                <p className="text-emerald-500 text-xs font-black uppercase tracking-widest">✅ Booking Confirmed!</p>
             </div>
            <button 
              onClick={() => window.print()}
              className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-100 transition-all shadow-xl flex items-center justify-center gap-3"
            >
              Print / Save as PDF
            </button>
          </div>
        )}
        
        <button 
          onClick={() => router.back()}
          className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] hover:text-rose-500 transition-colors py-4"
        >
          ← Cancel & Go Back
        </button>
      </div>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .min-h-screen { background: white !important; padding: 0 !important; }
          #invoice { box-shadow: none !important; border: 1px solid #000 !important; }
        }
      `}</style>
    </div>
  );
}