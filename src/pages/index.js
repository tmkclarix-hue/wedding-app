import { useState, useEffect, useContext, useRef } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, limit } from 'firebase/firestore';
import Link from 'next/link';
import { LanguageContext } from './_app';

// --- Dynamic Category Card Component ---
const CategoryCard = ({ cat }) => {
  const [mediaList, setMediaList] = useState({ images: [], videos: [] });
  const [imgIndex, setImgIndex] = useState(0);
  const [vidIndex, setVidIndex] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, "pending_vendors"),
      where("status", "==", "approved"),
      where("category", "==", cat.name),
      where("isTopList", "==", true),
      limit(3) 
    );

    const unsub = onSnapshot(q, (snap) => {
      let allImages = [];
      let allVideos = [];
      snap.forEach((doc) => {
        const data = doc.data();
        if (data.galleryImages) allImages = [...allImages, ...data.galleryImages.slice(0, 10)];
        if (data.promoVideo) allVideos.push(data.promoVideo);
      });
      setMediaList({ images: allImages, videos: allVideos });
    }, (error) => console.error("Firebase Error in Card:", error));
    return () => unsub();
  }, [cat.name]);

  useEffect(() => {
    if (mediaList.images.length > 0) {
      const interval = setInterval(() => {
        setImgIndex((prev) => (prev + 1) % mediaList.images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [mediaList.images]);

  const handleVideoEnd = () => {
    if (mediaList.videos.length > 0) {
      setVidIndex((prev) => (prev + 1) % mediaList.videos.length);
    }
  };

  return (
    <Link href={`/category/${cat.name.toLowerCase()}`}>
      <div className="relative h-[400px] md:h-[550px] group cursor-pointer overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] border border-white/10 transition-all duration-1000 hover:border-rose-500 shadow-3xl bg-slate-900">
        <div className="absolute inset-0 w-full h-full">
          {mediaList.images.length > 0 ? (
            mediaList.images.map((img, i) => (
              <img 
                key={i}
                src={img} 
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] brightness-[0.35] group-hover:brightness-[0.5] ${imgIndex === i ? 'opacity-100' : 'opacity-0'}`} 
                alt="Top Vendor Work" 
              />
            ))
          ) : (
            <img src={cat.image} className="absolute inset-0 h-full w-full object-cover brightness-[0.3]" alt="Default" />
          )}
        </div>

        {mediaList.videos.length > 0 && (
          <video 
            key={mediaList.videos[vidIndex]}
            autoPlay muted playsInline onEnded={handleVideoEnd}
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen group-hover:opacity-50 transition-opacity"
          >
            <source src={mediaList.videos[vidIndex]} type="video/mp4" />
          </video>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end items-center text-center">
           <div className="mb-4 md:mb-6 flex gap-2">
             {[...Array(3)].map((_, i) => (
               <span key={i} className={`h-1 rounded-full transition-all duration-700 ${Math.floor(imgIndex/10) === i ? 'bg-rose-500 w-10 md:w-12' : 'bg-white/20 w-4 md:w-6'}`}></span>
             ))}
           </div>
           <h3 className="text-white font-black uppercase tracking-tighter text-4xl md:text-7xl mb-4 transform group-hover:-translate-y-2 transition-transform duration-500 drop-shadow-2xl">
            {cat.name}
           </h3>
           <p className="text-rose-500 font-bold text-[8px] md:text-[10px] tracking-[0.4em] md:tracking-[0.5em] uppercase opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-500">
             Explore Collection
           </p>
        </div>
      </div>
    </Link>
  );
};

export default function Home() {
  const { t } = useContext(LanguageContext);
  const [approvedVendors, setApprovedVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoList = ["/wedding.mp4", "/v1.mp4"]; 

  const handleVideoEnd = () => {
    setIsVideoLoaded(false); 
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoList.length);
  };

  useEffect(() => {
    const q = query(collection(db, "pending_vendors"), where("status", "==", "approved"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const vendors = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApprovedVendors(vendors);
    }, (error) => console.error("Firebase Error:", error));
    return () => unsubscribe();
  }, []);

  const categories = [
    { id: 1, name: 'Hotels', icon: '🏨', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80' },
    { id: 2, name: 'Photography', icon: '📸', image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80' },
    { id: 3, name: 'Wedding Cars', icon: '🚗', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80' },
    { id: 4, name: 'Jewelry', icon: '💍', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80' },
    { id: 5, name: 'Salon', icon: '💇‍♀️', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80' }
  ];

  const events = [
    { name: 'Elegant Weddings', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80', desc: 'Crafting your forever story.' },
    { name: 'Birthday Bash', image: 'https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80', desc: 'Epic parties for all ages.' },
    { name: 'Corporate Events', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80', desc: 'Success in every detail.' },
    { name: 'Anniversaries', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80', desc: 'Reliving your magic.' },
  ];

  const districts = ["Colombo", "Gampaha", "Kandy", "Galle", "Matara", "Kalutara", "Kurunegala", "Anuradhapura"];

  const getFilteredVendors = (catName) => {
    return approvedVendors.filter(v => {
      return v.category?.toLowerCase() === catName.toLowerCase() && v.isTop === true &&
             v.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) &&
             (selectedDistrict === '' || v.district === selectedDistrict);
    }).slice(0, 3);
  };

  return (
    <div className="relative min-h-screen w-full font-sans bg-slate-950">
      
      {/* --- Video Hero Section --- */}
      <div className="relative h-[80vh] md:h-[90vh] w-full flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80" 
          className={`absolute inset-0 h-full w-full object-cover brightness-[0.4] transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-0' : 'opacity-100'}`} 
          alt="Wedding Background"
        />
        <video
          key={videoList[currentVideoIndex]}
          autoPlay muted playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          onEnded={handleVideoEnd}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 brightness-[0.4] ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src={videoList[currentVideoIndex]} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/60 to-slate-950"></div>

        <div className="relative z-10 text-center px-6 w-full max-w-5xl">
          <span className="text-rose-500 font-black text-[10px] md:text-xs tracking-[0.4em] md:tracking-[0.5em] uppercase mb-4 block animate-pulse">Premium Wedding Planner</span>
          <h1 className="text-4xl md:text-8xl lg:text-9xl font-serif italic text-white mb-8 drop-shadow-2xl tracking-tighter leading-tight">
            {t.heroTitle || 'Your Dream Wedding Starts Here'}
          </h1>
          
          <div className="flex flex-col md:flex-row gap-2 md:gap-0 p-2 bg-white/10 backdrop-blur-md rounded-2xl md:rounded-full border border-white/20 shadow-2xl overflow-hidden max-w-4xl mx-auto">
            <input 
                type="text" 
                placeholder="Search services..." 
                className="flex-grow bg-white/5 md:bg-transparent px-6 py-4 md:px-8 md:py-5 text-white outline-none text-sm placeholder:text-gray-400 rounded-xl md:rounded-none" 
                onChange={(e) => setSearchQuery(e.target.value)} 
            />
            <select 
                className="bg-white/5 md:bg-transparent px-6 py-4 md:px-8 md:py-5 text-white outline-none text-[10px] font-bold uppercase tracking-widest cursor-pointer rounded-xl md:rounded-none" 
                onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="" className="bg-slate-900">All Districts</option>
              {districts.map(d => <option key={d} value={d} className="bg-slate-900">{d}</option>)}
            </select>
            <button className="bg-rose-600 text-white px-8 py-4 md:px-12 md:py-5 rounded-xl md:rounded-full text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-rose-500 transition-all shadow-xl">Search</button>
          </div>
        </div>
      </div>

      {/* --- Categories Section --- */}
      <div className="relative z-10 -mt-16 md:-mt-32 px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-12 max-w-7xl mx-auto mb-24 md:mb-48">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} cat={cat} />
          ))}
        </div>

        {/* --- EVENT ORGANIZING VIDEO BAR --- */}
        <div className="relative w-full h-[400px] md:h-[600px] mb-24 md:mb-40 overflow-hidden flex items-center justify-center rounded-[3rem] md:rounded-[5rem]">
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover brightness-[0.3]">
            <source src="https://assets.mixkit.co/videos/preview/mixkit-fireworks-illuminating-the-night-sky-4152-large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950"></div>
          <div className="relative z-10 text-center px-6">
             <span className="text-rose-500 font-black text-[10px] md:text-xs tracking-[0.6em] uppercase mb-4 block">Event Management</span>
             <h2 className="text-4xl md:text-8xl font-serif italic text-white drop-shadow-2xl">Exquisite <span className="text-rose-600">Events</span></h2>
             <p className="text-gray-400 text-[9px] md:text-xs uppercase tracking-[0.4em] mt-6">Birthdays • Corporate • Anniversaries</p>
          </div>
        </div>

        {/* --- EVENT ORGANIZING CARDS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 max-w-[1600px] mx-auto mb-40">
          {events.map((event, index) => (
            <div key={index} className="group relative h-[500px] md:h-[650px] rounded-[3rem] overflow-hidden border border-white/5 bg-slate-900/40 hover:border-rose-500/30 transition-all duration-700 shadow-3xl">
              <div className="absolute inset-0">
                <img src={event.image} className="w-full h-full object-cover opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              </div>
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                <h3 className="text-3xl md:text-4xl font-serif italic text-white mb-2">{event.name}</h3>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">{event.desc}</p>
                <button className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 py-4 md:py-5 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 hover:border-rose-600 transition-all">Book Service</button>
              </div>
            </div>
          ))}
        </div>

        {/* --- Featured Vendors Sections --- */}
        {categories.map((cat) => {
          const topList = getFilteredVendors(cat.name);
          if (topList.length === 0) return null;
          return (
            <section key={cat.id} className="max-w-full md:max-w-[95%] mx-auto mb-24 md:mb-40 px-2 md:px-4">
              <div className="flex flex-col md:flex-row items-start md:items-baseline gap-2 md:gap-4 mb-10 md:mb-16 border-l-4 border-rose-500 pl-4 md:pl-6">
                <h2 className="text-3xl md:text-5xl font-serif italic text-white uppercase tracking-tighter">Top {cat.name}</h2>
                <span className="text-rose-500 font-black text-[8px] md:text-[10px] tracking-widest uppercase opacity-60">Handpicked Excellence</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-12">
                {topList.map((vendor) => (
                  <div key={vendor.id} className="group relative bg-slate-900/40 backdrop-blur-md rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-rose-500/30 transition-all duration-700 shadow-3xl">
                    <div className="h-64 md:h-80 w-full overflow-hidden bg-black relative">
                      <img src={vendor.imageUrl || cat.image} className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" alt={vendor.businessName} />
                      <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[7px] md:text-[8px] font-black px-3 py-1.5 md:px-4 md:py-2 rounded-full uppercase tracking-widest">⭐ PREMIUM</div>
                    </div>
                    <div className="p-6 md:p-10">
                      <h4 className="text-white text-2xl md:text-3xl font-serif italic group-hover:text-rose-400 transition-colors uppercase leading-none mb-4">{vendor.businessName}</h4>
                      <div className="flex items-center gap-2 mb-6 md:mb-8">
                        <span className="text-rose-500 text-xs">📍</span>
                        <p className="text-gray-400 text-[10px] uppercase tracking-[0.1em] font-bold">{vendor.district}</p>
                      </div>
                      <Link href={`/vendor/${vendor.id}`}>
                        <button className="w-full py-4 md:py-5 bg-gradient-to-r from-rose-600 to-rose-700 text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] rounded-xl md:rounded-2xl hover:from-rose-500 hover:to-rose-600 transition-all shadow-xl flex items-center justify-center gap-2">
                          View Portfolio <span className="text-lg">→</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        <div className="mt-10 md:mt-20 text-center pb-20">
          <Link href="/admin">
            <span className="text-gray-600 text-[8px] md:text-[9px] uppercase tracking-[0.3em] md:tracking-[0.4em] cursor-pointer hover:text-rose-500 transition-colors">Vendor Management Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}