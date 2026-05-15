"use client";

const plans = [
  {
    name: "Silver",
    price: "Rs. 5,000",
    features: ["5 Photos", "Basic Listing", "Contact Number", "District Search"],
    color: "border-slate-800 bg-slate-900/50",
    btnColor: "bg-slate-800 hover:bg-slate-700",
    popular: false,
  },
  {
    name: "Gold",
    price: "Rs. 10,000",
    features: ["15 Photos", "Priority Listing", "Video Link", "Customer Reviews", "Social Media Links"],
    color: "border-amber-500 bg-slate-900 shadow-[0_0_30px_-10px_rgba(245,158,11,0.3)]",
    btnColor: "bg-amber-500 hover:bg-amber-600 text-black font-black",
    popular: true,
  },
  {
    name: "Platinum",
    price: "Rs. 20,000",
    features: ["Unlimited Photos", "Top Search Results", "Featured Badge", "Full Gallery Access", "24/7 Support"],
    color: "border-rose-600 bg-slate-900 shadow-[0_0_30px_-10px_rgba(225,29,72,0.3)]",
    btnColor: "bg-rose-600 hover:bg-rose-700",
    popular: false,
  },
];

export default function PricingPlans({ onSelect }) {
  return (
    <div className="py-8 md:py-16 px-4 animate-in fade-in duration-700">
      <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
        <h2 className="text-3xl md:text-5xl font-serif italic text-white mb-4">Select Your Reach</h2>
        <p className="text-gray-500 text-[9px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold leading-relaxed px-4">
          Choose the best plan to showcase your premium services.
        </p>
      </div>
      
      {/* Grid: col-1 for mobile, col-3 for laptop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div 
            key={plan.name} 
            className={`relative p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] border-2 flex flex-col transition-all duration-500 group hover:md:-translate-y-3 ${plan.color}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-amber-500 text-black text-[8px] md:text-[9px] font-black px-4 py-1.5 md:px-6 md:py-2 rounded-full uppercase tracking-[0.1em] md:tracking-[0.2em] shadow-xl z-20 whitespace-nowrap">
                Best Choice
              </div>
            )}
            
            <div className="mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl font-serif italic text-white">{plan.name}</h3>
              <div className="mt-2 md:mt-4 flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-black text-white">{plan.price}</span>
                <span className="text-gray-500 text-[8px] md:text-[10px] uppercase font-bold">/ LifeTime</span>
              </div>
            </div>
            
            <ul className="mb-8 md:mb-10 flex-grow space-y-4 md:space-y-5">
              {plan.features.map((f) => (
                <li key={f} className="text-gray-400 flex items-center text-[10px] md:text-xs font-bold uppercase tracking-wider">
                  <span className="mr-3 text-emerald-500 bg-emerald-500/10 p-1 md:p-1.5 rounded-full text-[7px] md:text-[8px] shrink-0">✔</span> 
                  {f}
                </li>
              ))}
            </ul>
            
            <button 
              onClick={() => onSelect && onSelect(plan.name)}
              className={`w-full ${plan.btnColor} text-white py-4 md:py-5 rounded-xl md:rounded-[1.5rem] font-black uppercase text-[9px] md:text-[10px] tracking-[0.1em] md:tracking-[0.2em] transition-all shadow-2xl active:scale-95`}
            >
              Get Started with {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}