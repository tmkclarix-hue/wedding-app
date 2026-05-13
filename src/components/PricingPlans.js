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
    <div className="py-12 px-4 animate-in fade-in duration-700">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl font-serif italic text-white mb-4">Select Your Reach</h2>
        <p className="text-gray-500 text-xs uppercase tracking-[0.3em] font-bold">
          Choose the best plan to showcase your premium services.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div 
            key={plan.name} 
            className={`relative p-10 rounded-[3rem] border-2 flex flex-col transition-all duration-500 group hover:-translate-y-3 ${plan.color}`}
          >
            {plan.popular && (
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-amber-500 text-black text-[9px] font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl">
                Best Choice
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-2xl font-serif italic text-white">{plan.name}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-black text-white">{plan.price}</span>
                <span className="text-gray-500 text-[10px] uppercase font-bold ml-2">/ LifeTime</span>
              </div>
            </div>
            
            <ul className="mb-10 flex-grow space-y-5">
              {plan.features.map((f) => (
                <li key={f} className="text-gray-400 flex items-center text-xs font-bold uppercase tracking-wider">
                  <span className="mr-3 text-emerald-500 bg-emerald-500/10 p-1.5 rounded-full text-[8px]">✔</span> 
                  {f}
                </li>
              ))}
            </ul>
            
            <button 
              onClick={() => onSelect && onSelect(plan.name)}
              className={`w-full ${plan.btnColor} text-white py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-2xl active:scale-95`}
            >
              Get Started with {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}