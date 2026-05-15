"use client";
import { useState, useContext } from "react";
import { db } from "@/lib/firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { LanguageContext } from "../pages/_app"; 

export default function VendorRegister({ onNext }) {
  const { t } = useContext(LanguageContext);

  const [formData, setFormData] = useState({
    businessName: "",
    category: "Hotel",
    district: "Colombo",
    phone: "",
    imageUrl: "", 
    videoUrl: "", 
    price: "",
    status: "pending", 
    isTop: false, 
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "pending_vendors"), {
        ...formData,
        price: parseFloat(formData.price) || 0,
        createdAt: serverTimestamp()
      });
      if (onNext) {
        onNext({ ...formData, id: docRef.id }); 
      }
    } catch (error) {
      console.error("Firebase Error: ", error);
      alert("Submission failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // max-w-md සහ පෑඩින් mobile වලදී වෙනස් කළා
    <div className="w-full max-w-md mx-auto p-6 md:p-8 bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-gray-50 my-4">
      <div className="text-center mb-8 md:mb-10">
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 tracking-tighter">
          {t.registerTitle || "Vendor Registration"}
        </h2>
        <p className="text-[9px] md:text-[10px] text-rose-500 font-black uppercase tracking-widest">Start your premium journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
        
        {/* Business Name */}
        <div className="space-y-1">
          <label className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Business Name</label>
          <input 
            type="text" placeholder="Ex: Grand Royal Hotel" required
            className="w-full p-3.5 md:p-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all text-gray-800 text-sm"
            onChange={(e) => setFormData({...formData, businessName: e.target.value})}
          />
        </div>

        {/* Category & Price - Mobile එකේදී එක යට එක වැටෙන්න හදල තියෙන්නේ (grid-cols-1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
            <select 
              className="w-full p-3.5 md:p-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-rose-500 text-gray-800 text-sm appearance-none"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Hotel">Hotel</option>
              <option value="Photography">Photography</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Salon">Salon</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Starting Price (LKR)</label>
            <input 
              type="number" placeholder="50000" required
              className="w-full p-3.5 md:p-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-rose-500 text-gray-800 text-sm"
              onChange={(e) => setFormData({...formData, price: e.target.value})}
            />
          </div>
        </div>

        {/* Media URLs Section */}
        <div className="space-y-4 p-4 md:p-5 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] border border-dashed border-slate-200">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">Main Image URL</label>
            <input 
              type="url" placeholder="https://link-to-your-image.jpg" required
              className="w-full p-3 bg-white border border-slate-100 rounded-xl outline-none text-[11px]"
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Promo Video URL (Optional)</label>
            <input 
              type="url" placeholder="Direct MP4 link"
              className="w-full p-3 bg-white border border-slate-100 rounded-xl outline-none text-[11px]"
              onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
            />
          </div>
        </div>

        {/* District & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">District</label>
            <input 
              type="text" placeholder="Ex: Kandy" required
              className="w-full p-3.5 md:p-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-rose-500 text-gray-800 text-sm"
              onChange={(e) => setFormData({...formData, district: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone</label>
            <input 
              type="tel" placeholder="0712345678" required
              className="w-full p-3.5 md:p-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-rose-500 text-gray-800 text-sm"
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-white transition-all shadow-xl uppercase tracking-[0.2em] text-[10px] mt-2 ${
            loading ? 'bg-gray-300' : 'bg-slate-900 hover:bg-rose-600 active:scale-95'
          }`}
        >
          {loading ? "Registering..." : "Continue to Pricing"}
        </button>
      </form>
    </div>
  );
}