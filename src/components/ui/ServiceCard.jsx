import React from 'react';
import Link from 'next/link';

const ServiceCard = ({ item }) => {
  // Discount එක ගණනය කිරීම (හදිසියේවත් item එකේ discount නැතිනම් 0 ලෙස ගනී)
  const discountAmount = item.discount || 0;

  return (
    <div className="relative group overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 backdrop-blur-md shadow-2xl transition-all duration-500 hover:border-rose-500/30 hover:bg-slate-900/60">
      
      {/* Image Section */}
      <div className="h-72 w-full overflow-hidden relative">
        <img 
          src={item.imageUrl || item.image || "https://via.placeholder.com/400x300?text=No+Image"} 
          alt={item.businessName || "Business"} 
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" 
        />
        
        {/* Category Tag */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/10">
          {item.category || "General"}
        </div>
        
        {/* Discount Badge */}
        {discountAmount > 0 && (
          <div className="absolute top-4 right-4 bg-rose-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl">
            {discountAmount}% OFF
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-8">
        <div className="mb-4">
          <h3 className="text-2xl font-serif italic text-white group-hover:text-rose-500 transition-colors">
            {item.businessName || item.name}
          </h3>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">
            📍 {item.district || "Sri Lanka"}
          </p>
        </div>
        
        <p className="text-gray-400 text-xs mb-6 line-clamp-2 leading-relaxed font-medium">
          {item.description || "Leading wedding services provider in Sri Lanka with premium facilities."}
        </p>
        
        <div className="flex justify-between items-end pt-6 border-t border-white/5">
          <div className="space-y-1">
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Starting From</p>
             <div className="flex items-baseline gap-2">
                <p className="font-black text-xl text-white">LKR {item.price || "N/A"}</p>
             </div>
          </div>
          
          {/* View Profile Link */}
          <Link href={`/vendor/${item.id}`}>
            <button className="bg-white text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all duration-500 shadow-xl active:scale-95">
              View Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;