import React, { useState } from 'react';
// 1. Firebase සම්බන්ද කරන දේවල් අනිවාර්යයෙන්ම import කරන්න ඕනේ
import { db } from '../../lib/firebase'; 
import { collection, addDoc } from 'firebase/firestore';

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Hotels',
    price: '',
    discount: '',
    description: '',
    location: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Form එක submit කරද්දී වැඩ කරන function එක
  const handleSubmit = async (e) => {
    e.preventDefault(); // පේජ් එක refresh වීම නවත්වනවා
    
    try {
      // Firebase "services" collection එකට දත්ත යවනවා
      await addDoc(collection(db, "services"), formData);
      alert("සාර්ථකව Publish කළා!");
      
      // Form එක clear කරන්න අවශ්‍ය නම් (Optional)
      setFormData({
        name: '', category: 'Hotels', price: '',
        discount: '', description: '', location: ''
      });
    } catch (error) {
      console.error("Error: ", error);
      alert("වැරදීමක් වුණා: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="bg-slate-900 p-6 text-white text-center">
            <h1 className="text-2xl font-bold italic font-serif">Add New Wedding Service</h1>
            <p className="text-gray-400 text-sm">Enter the details of the service provider</p>
            <a href="/" className="text-gray-400 text-xs hover:text-white transition-all underline">
            ← Back to Main Website
            </a>
        </div>

        {/* 3. onSubmit={handleSubmit} එක මෙතනට දාන්න අමතක කරන්න එපා */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Service Name</label>
            <input 
              name="name"
              value={formData.name} // Input එක clear වෙන්න මේක උදව් වෙනවා
              onChange={handleChange}
              type="text" 
              required
              placeholder="e.g. Grand Ballroom"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none">
                <option value="Hotels">Hotels</option>
                <option value="Photography">Photography</option>
                <option value="Wedding Cars">Wedding Cars</option>
                <option value="Jewelry">Jewelry</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <input name="location" value={formData.location} onChange={handleChange} type="text" required placeholder="Colombo" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price (LKR)</label>
              <input name="price" value={formData.price} onChange={handleChange} type="number" required placeholder="200000" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Discount (%)</label>
              <input name="discount" value={formData.discount} onChange={handleChange} type="number" placeholder="10" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none" placeholder="Briefly describe the service..."></textarea>
          </div>

          <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-rose-600 transition-all shadow-lg uppercase tracking-widest">
            Publish Service
          </button>
        </form>
      </div>
    </div>
  );
}