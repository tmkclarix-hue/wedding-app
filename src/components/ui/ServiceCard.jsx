import React from 'react';

const ServiceCard = ({ item }) => {
  return (
    <div className="relative group overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl transition-all duration-500 hover:bg-white/20">
      
      {/* Image Section */}
      <div className="h-64 w-full overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-2 text-white">
          <h3 className="text-xl font-bold uppercase font-serif tracking-wide">{item.name}</h3>
          <span className="bg-rose-500 text-xs px-2 py-1 rounded-lg font-bold">
            {item.discount}% OFF
          </span>
        </div>
        
        <p className="text-gray-200 text-sm mb-4 opacity-80 font-light leading-relaxed">
          {item.description}
        </p>
        
        <div className="flex justify-between items-center pt-4 border-t border-white/10 text-white">
          <div>
             <p className="text-xs text-gray-400 line-through">LKR {item.price}</p>
             <p className="font-bold text-lg">LKR {item.finalPrice}</p>
          </div>
          <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-rose-600 hover:text-white transition-all duration-300 shadow-lg">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;