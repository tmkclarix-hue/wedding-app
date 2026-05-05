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
      const docRef = doc(db, "services", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setService(data);
        // රු. 100,000 ට වැඩි නම් 10% discount එකක් auto හදමු
        if (data.price > 100000) setDiscount(data.price * 0.1);
      }
    };
    fetchService();
  }, [id]);

  const confirmBooking = async () => {
    setLoading(true);
    try {
      // 1. Admin Panel එකට දත්ත යවනවා (bookings collection එකට)
      await addDoc(collection(db, "bookings"), {
        serviceId: id,
        serviceName: service.name,
        category: service.category,
        customerLocation: service.location,
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

  if (!service) return <div className="text-white p-10 text-center">Loading Invoice...</div>;

  const finalPrice = service.price - discount;

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex flex-col items-center justify-center font-sans">
      
      {/* --- INVOICE CARD START --- */}
      <div id="invoice" className="bg-white text-slate-900 p-10 rounded-[2rem] max-w-md w-full shadow-[0_35px_60px_-15px_rgba(255,255,255,0.1)] border-t-[12px] border-rose-600">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black tracking-tighter text-slate-800">INVOICE</h2>
          <div className="text-[10px] bg-slate-100 px-3 py-1 rounded-full inline-block mt-2 font-bold text-slate-500 uppercase tracking-widest">
            Dream Wedding Planner
          </div>
        </div>

        <div className="space-y-5 border-b border-dashed border-slate-200 pb-8 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs uppercase font-bold tracking-widest">Service</span>
            <span className="font-bold text-slate-800">{service.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs uppercase font-bold tracking-widest">Category</span>
            <span className="text-slate-600">{service.category}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs uppercase font-bold tracking-widest">Location</span>
            <span className="text-slate-600">{service.location}</span>
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Sub Total:</span>
            <span className="font-semibold text-slate-700">LKR {service.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-rose-600 font-bold italic">
            <span>Special Discount:</span>
            <span>- LKR {discount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t-2 border-slate-900 pt-6 mt-6">
            <span className="text-lg font-black uppercase">Final Amount</span>
            <span className="text-2xl font-black text-rose-600">LKR {finalPrice.toLocaleString()}</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[10px] text-gray-400 leading-relaxed">
            Thank you for choosing Dream Wedding. <br/>
            Please present this invoice to the service provider.
          </p>
        </div>
      </div>
      {/* --- INVOICE CARD END --- */}

      {/* --- CONTROL BUTTONS --- */}
      <div className="mt-10 flex flex-col gap-4 w-full max-w-md no-print">
        {!booked ? (
          <button 
            disabled={loading}
            onClick={confirmBooking}
            className="w-full bg-rose-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </button>
        ) : (
          <div className="flex flex-col gap-3 animate-bounce-short">
            <button 
              onClick={() => window.print()}
              className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl flex items-center justify-center gap-3"
            >
              <span>📥</span> Download Invoice (PDF)
            </button>
            <p className="text-emerald-500 text-center text-sm font-bold">✅ Booking Sent to Admin Successfully!</p>
          </div>
        )}
        
        <button 
          onClick={() => router.back()}
          className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em] hover:text-white transition-colors py-2"
        >
          ← Go Back
        </button>
      </div>

      {/* CSS for Printing */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0; padding: 0; }
          .min-h-screen { background: white !important; padding: 0 !important; }
          #invoice { 
            box-shadow: none !important; 
            border: 1px solid #eee !important;
            margin: 0 auto !important;
          }
        }
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-short { animation: bounce-short 2s infinite; }
      `}</style>

    </div>
  );
}