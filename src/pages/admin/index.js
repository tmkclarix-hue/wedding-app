import React, { useState } from 'react';
import { db, storage } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import VendorRegister from '../../components/VendorRegister';
import PricingPlans from '../../components/PricingPlans';

export default function AdminDashboard() {
  const [step, setStep] = useState(1); 
  const [selectedPlan, setSelectedPlan] = useState('');
  const [vendorData, setVendorData] = useState(null); // Step 1 එකේ දත්ත තබා ගැනීමට
  const [isUploading, setIsUploading] = useState(false);

  // Step 1 ඉවර වුණාම දත්ත ටික save කරගෙන Step 2 ට යනවා
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

      // 2. වැදගත්: Vendor දත්ත + Payment විස්තර ඔක්කොම එකට Database එකට දානවා
      // එතකොටයි Admin Approval Dashboard එකේදී Vendor ගේ නම පේන්නේ
      await addDoc(collection(db, "payment_requests"), {
        ...vendorData, // Business Name, Phone, Category, District, etc.
        plan: selectedPlan,
        slipUrl: downloadURL,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      // 3. මේ වෙලාවේදීම 'pending_vendors' එකටත් දත්ත ටිකක් දාමු (පසුව පෙන්වීමට ලේසි වෙන්න)
      await addDoc(collection(db, "pending_vendors"), {
        ...vendorData,
        status: 'pending',
        isApproved: false,
        createdAt: serverTimestamp(),
      });

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
      <div className="max-w-2xl mx-auto bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-white/5">
        
        {/* Modern Header */}
        <div className="bg-gradient-to-r from-rose-600 to-rose-400 p-10 text-center">
            <h1 className="text-4xl font-serif italic text-white mb-2">Partner with Us</h1>
            <p className="text-rose-100 text-[10px] font-black uppercase tracking-[0.3em]">
                {step === 1 && "Step 1: Identity & Location"}
                {step === 2 && "Step 2: Choose Your Reach"}
                {step === 3 && "Step 3: Verification"}
                {step === 4 && "Application Received"}
            </p>
        </div>

        <div className="p-8 md:p-12">
            {step === 1 && (
                <VendorRegister onNext={handleVendorDetails} />
            )}

            {step === 2 && (
                <div className="animate-in fade-in zoom-in duration-500">
                    <PricingPlans onSelect={handlePlanSelect} />
                    <button onClick={() => setStep(1)} className="mt-8 text-gray-500 text-[10px] font-bold uppercase tracking-widest block mx-auto hover:text-white transition-colors">
                        ← Back to Details
                    </button>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-8 animate-in slide-in-from-right duration-500">
                    <div className="text-center">
                        <h2 className="text-2xl font-serif italic mb-2">Secure Payment</h2>
                        <p className="text-gray-400 text-xs uppercase tracking-widest">Plan: <span className="text-rose-500 font-black">{selectedPlan}</span></p>
                    </div>

                    <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
                        <h3 className="font-black text-rose-500 text-[10px] uppercase tracking-widest mb-4">🏦 Direct Bank Transfer</h3>
                        <div className="space-y-2 text-sm text-gray-300 font-medium">
                            <p className="flex justify-between">Bank: <span className="text-white">Sampath Bank / BOC</span></p>
                            <p className="flex justify-between">Account Name: <span className="text-white">Wedding App SL</span></p>
                            <p className="flex justify-between">Account Number: <span className="text-white">1234 5678 9012</span></p>
                            <p className="flex justify-between">Branch: <span className="text-white">Colombo Main</span></p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitPayment} className="space-y-8">
                        <div className="group border-2 border-dashed border-white/10 p-10 rounded-[2.5rem] text-center hover:border-rose-500/50 transition-all cursor-pointer bg-white/[0.02]">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 group-hover:text-rose-500">Upload Transaction Receipt</p>
                            <input 
                                type="file" 
                                name="slip" 
                                accept="image/*"
                                required 
                                className="block w-full text-xs text-gray-400 file:mr-4 file:py-3 file:px-8 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-rose-600 file:text-white hover:file:bg-rose-700 transition-all"
                            />
                        </div>

                        <button 
                          type="submit" 
                          disabled={isUploading}
                          className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all shadow-2xl ${isUploading ? 'bg-gray-800 text-gray-500' : 'bg-white text-black hover:bg-rose-600 hover:text-white'}`}
                        >
                            {isUploading ? "Uploading Data..." : "Confirm & Apply"}
                        </button>
                    </form>
                </div>
            )}

            {step === 4 && (
                <div className="text-center py-16 space-y-8 animate-in fade-in duration-1000">
                    <div className="w-24 h-24 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center text-5xl mx-auto shadow-inner">✔</div>
                    <h2 className="text-3xl font-serif italic">Application Received</h2>
                    <p className="text-gray-500 text-xs leading-relaxed uppercase tracking-widest px-6">
                        We are currently reviewing your payment and business details. 
                        Once verified, your profile will go live on our directory.
                    </p>
                    <button onClick={() => window.location.href = "/"} className="bg-white text-black px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:bg-rose-600 hover:text-white transition-all shadow-2xl">
                        Return to Home
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}