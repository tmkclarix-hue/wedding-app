import Link from 'next/link';

export default function Home() {
  const categories = [
    { id: 1, name: 'Hotels', icon: '🏨', desc: 'Luxury venues for your big day', color: 'hover:bg-blue-500/40' },
    { id: 2, name: 'Photography', icon: '📸', desc: 'Capture every precious moment', color: 'hover:bg-purple-500/40' },
    { id: 3, name: 'Wedding Cars', icon: '🚗', desc: 'Arrive in style and elegance', color: 'hover:bg-amber-500/40' },
    { id: 4, name: 'Jewelry', icon: '💍', desc: 'Exquisite designs for the bride', color: 'hover:bg-emerald-500/40' },
    { id: 5, name: 'Salon', icon: '💇‍♀️', desc: 'Look your best on your wedding', color: 'hover:bg-rose-500/40' }
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans">
      
      {/* 1. Background Video Section */}
      <div className="absolute inset-0 -z-10">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="h-full w-full object-cover brightness-[0.7]"
>
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
        {/* ලස්සනට පේන්න overlay එකක් */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/60 to-slate-950"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-8">
        
        {/* Hero Section */}
        <div className="text-center mt-20 mb-24 animate-in fade-in slide-in-from-top duration-1000">
          <h1 className="text-7xl font-serif italic text-white mb-6 drop-shadow-2xl">
            Dream Wedding
          </h1>
          <div className="h-[2px] w-40 bg-gradient-to-r from-transparent via-rose-500 to-transparent mx-auto mb-8"></div>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto font-light tracking-wide bg-black/20 backdrop-blur-sm inline-block px-6 py-2 rounded-full border border-white/10">
            Find and book everything you need for your perfect wedding in one place.
          </p>
        </div>

        {/* 2. Transparent & Popup Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 max-w-[90%] mx-auto px-4">
          {categories.map((cat) => (
            <Link href={`/category/${cat.name}`} key={cat.id}>
              <div className={`
                relative group cursor-pointer overflow-hidden
                bg-white/5 backdrop-blur-md border border-white/10 
                p-10 rounded-[40px] text-center 
                transition-all duration-500 ease-out
                hover:-translate-y-4 hover:shadow-[0_20px_50px_rgba(225,29,72,0.3)]
                ${cat.color}
              `}>
                {/* Popup animation for content */}
                <div className="relative z-20">
                  <div className="text-6xl mb-6 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6">
                    {cat.icon}
                  </div>
                  <h3 className="text-white font-bold uppercase tracking-[0.2em] text-sm mb-3 group-hover:text-white transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-gray-400 text-xs font-light leading-relaxed group-hover:text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {cat.desc}
                  </p>
                </div>
                
                {/* Background glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Admin Link */}
        <div className="mt-32 text-center pb-10">
          <Link href="/admin">
            <button className="text-gray-400 text-[10px] hover:text-rose-400 transition-all uppercase tracking-[0.4em] border border-white/10 bg-black/20 backdrop-blur-md px-10 py-4 rounded-full hover:border-rose-500/50">
              Service Provider Portal
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}