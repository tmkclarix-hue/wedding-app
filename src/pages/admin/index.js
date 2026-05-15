import React, { useState, useEffect } from 'react';
import { db, storage } from '../../lib/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import VendorRegister from '../../components/VendorRegister';
import PricingPlans from '../../components/PricingPlans';

export default function AdminDashboard() {
  const [step, setStep] = useState(1); 
  const [selectedPlan, setSelectedPlan] = useState('');
  const [vendorData, setVendorData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // පියවර මාරු වෙද්දී screen එක උඩටම ගෙන යාම (Mobile Friendly)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const handleVendorDetails = (data) => {
    setVendorData(data);
    setStep(2);
  };

  const handlePlanSelect = (planName) => {
    setSelectedPlan(planName);
    setStep(3);
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    const file = e.target.slip.files[0];

    if (!file) return alert("කරුණාකර රිසිට් පතේ පින්තූරයක් තෝරන්න!");

    setIsUploading(true);

    try {
      // 1. Firebase Storage එකට Slip එක Upload කිරීම
      const storageRef = ref(storage, `payment_slips/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // 2. අලුත් Document ID එකක් කලින්ම සාදා ගැනීම (මේක වැදගත්)
      const newVendorRef = doc(collection(db, "pending_vendors"));
      const vendorId = newVendorRef.id;

      const finalData = {
        vendorId: vendorId,
        ...vendorData,
        plan: selectedPlan,
        slipUrl: downloadURL,
        status: 'pending',
        isApproved: false,
        createdAt: serverTimestamp(),
      };

      // 3. Collections දෙකටම එකම ID එකකින් දත්ත දැමීම
      // එවිට Admin ට Payment එක බලන ගමන්ම Vendor ව Approve කරන්න පුළුවන්
      await Promise.all([
        setDoc(newVendorRef, finalData),
        setDoc(doc(db, "payment_requests", vendorId), {
            ...finalData,
            paymentType: 'bank_transfer'
        })
      ]);

      setStep(4); 
    } catch (error) {
      console.error("Error: ", error);
      alert("වැරදීමක් වුණා: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 font-sans selection:bg-rose-500 text-white">
      <div className="max-w-2xl mx-auto bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden border border-white/5">
        
        {/* Header - පියවර අනුව වෙනස් වන Progress bar එකක් වගේ */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-rose-500 p-8 md:p-10 text-center relative">
            <div className="absolute top-0 left-0 h-1 bg-white/20 transition-all duration-500" style={{ width: `${(step/4)*100}%` }}></div>
            <h1 className="text-3xl md:text-4xl font-serif italic text-white mb-2">Partner with Us</h1>
            <p className="text-rose-100 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
                Step {step} of 4: {step === 1 ? "Identity" : step === 2 ? "Reach" : step === 3 ? "Verification" : "Done"}
            </p>
        </div>

        <div className="p-6 md:p-12">
            {step === 1 && <VendorRegister onNext={handleVendorDetails} />}

            {step === 2 && (
                <div className="animate-in fade-in zoom-in duration-500">
                    <PricingPlans onSelect={handlePlanSelect} />
                    <button onClick={() => setStep(1)} className="mt-8 text-gray-500 text-[10px] font-bold uppercase tracking-widest block mx-auto hover:text-white">
                        ← Edit Details
                    </button>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6 md:space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center">
                        <h2 className="text-xl md:text-2xl font-serif italic">Secure Payment</h2>
                        <p className="text-gray-500 text-[10px] uppercase mt-1 tracking-widest">Plan: <span className="text-rose-500">{selectedPlan}</span></p>
                    </div>

                    {/* Bank Details Card */}
                    <div className="bg-white/[0.03] p-6 md:p-8 rounded-[2rem] border border-white/5">
                        <h3 className="font-black text-rose-500 text-[10px] uppercase tracking-[0.2em] mb-4">🏦 Bank Details</h3>
                        <div className="space-y-3 text-xs md:text-sm text-gray-300">
                            <div className="flex justify-between border-b border-white/5 pb-2"><span>Bank</span><span className="text-white font-bold text-right">Bank of Ceylon</span></div>
                            <div className="flex justify-between border-b border-white/5 pb-2"><span>Account Name</span><span className="text-white font-bold text-right">Wedding App (PVT) LTD</span></div>
                            <div className="flex justify-between border-b border-white/5 pb-2"><span>Account Number</span><span className="text-white font-bold tracking-widest text-right">1234 5678 9012</span></div>
                            <div className="flex justify-between"><span>Branch</span><span className="text-white font-bold text-right">Colombo Main</span></div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitPayment} className="space-y-6">
                        <div className="group border-2 border-dashed border-white/10 p-8 md:p-10 rounded-[2.5rem] text-center hover:border-rose-500/40 transition-all bg-white/[0.01]">
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">Attach Receipt (Image/PDF)</p>
                            <input 
                                type="file" 
                                name="slip" 
                                accept="image/*"
                                required 
                                className="block w-full text-[10px] text-gray-400 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-[9px] file:font-black file:uppercase file:bg-rose-600 file:text-white"
                            />
                        </div>

                        <button 
                          type="submit" 
                          disabled={isUploading}
                          className={`w-full py-4 md:py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all ${isUploading ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-rose-600 hover:text-white active:scale-95'}`}
                        >
                            {isUploading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-gray-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Processing...
                                </span>
                            ) : "Confirm & Send Application"}
                        </button>
                    </form>
                </div>
            )}

            {step === 4 && (
                <div className="text-center py-10 md:py-16 space-y-6 animate-in fade-in duration-700">
                    <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center text-3xl mx-auto border border-green-500/20">✓</div>
                    <h2 className="text-2xl md:text-3xl font-serif italic">Done!</h2>
                    <p className="text-gray-500 text-[10px] leading-relaxed uppercase tracking-[0.15em] px-4 max-w-xs mx-auto">
                        Your application is under review. We will notify you once your business is live on the platform.
                    </p>
                    <button onClick={() => window.location.href = "/"} className="bg-white/5 text-white border border-white/10 px-10 py-4 rounded-full font-black uppercase tracking-widest text-[9px] hover:bg-white hover:text-black transition-all">
                        Back to Home
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}