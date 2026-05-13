import { useState, useEffect, useContext, useRef } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, limit } from 'firebase/firestore';
import Link from 'next/link';
import { LanguageContext } from './_app';

// --- Dynamic Category Card Component (Top List 3-Vendor Loop) ---
const CategoryCard = ({ cat }) => {
  const [mediaList, setMediaList] = useState({ images: [], videos: [] });
  const [imgIndex, setImgIndex] = useState(0);
  const [vidIndex, setVidIndex] = useState(0);

  useEffect(() => {
    // Admin Panel එකේ Star Mark (isTopList: true) කරපු Vendors ලා 3 දෙනෙක් ගන්නවා
    const q = query(
      collection(db, "pending_vendors"),
      where("status", "==", "approved"),
      where("category", "==", cat.name),
      where("isTopList", "==", true), // Admin panel එකේ star mark එක
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

  // Image Auto-Slider (Every 3 seconds)
  useEffect(() => {
    if (mediaList.images.length > 0) {
      const interval = setInterval(() => {
        setImgIndex((prev) => (prev + 1) % mediaList.images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [mediaList.images]);

  // Video End Logic
  const handleVideoEnd = () => {
    if (mediaList.videos.length > 0) {
      setVidIndex((prev) => (prev + 1) % mediaList.videos.length);
    }
  };

  return (
    <Link href={`/category/${cat.name.toLowerCase()}`}>
      <div className="relative h-[550px] group cursor-pointer overflow-hidden rounded-[3.5rem] border border-white/10 transition-all duration-1000 hover:border-rose-500 shadow-3xl bg-slate-900">
        
        {/* Background Images Loop */}
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

        {/* Video Overlay Loop */}
        {mediaList.videos.length > 0 && (
          <video 
            key={mediaList.videos[vidIndex]}
            autoPlay muted playsInline onEnded={handleVideoEnd}
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen group-hover:opacity-50 transition-opacity"
          >
            <source src={mediaList.videos[vidIndex]} type="video/mp4" />
          </video>
        )}

        {/* Luxury Aesthetics */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        
        <div className="absolute inset-0 p-12 flex flex-col justify-end items-center text-center">
           {/* Visual Indicators for 3 vendors */}
           <div className="mb-6 flex gap-2">
             {[...Array(3)].map((_, i) => (
               <span key={i} className={`h-1 rounded-full transition-all duration-700 ${Math.floor(imgIndex/10) === i ? 'bg-rose-500 w-12' : 'bg-white/20 w-6'}`}></span>
             ))}
           </div>
            
           <h3 className="text-white font-black uppercase tracking-tighter text-6xl md:text-7xl mb-4 transform group-hover:-translate-y-2 transition-transform duration-500 drop-shadow-2xl">
            {cat.name}
           </h3>
           
           <p className="text-rose-500 font-bold text-[10px] tracking-[0.5em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-500">
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
      <div className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
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
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 brightness-[0.5] ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src={videoList[currentVideoIndex]} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/60 to-slate-950"></div>

        <div className="relative z-10 text-center px-4 max-w-5xl">
          <span className="text-rose-500 font-black text-xs tracking-[0.5em] uppercase mb-4 block animate-pulse">Premium Wedding Planner</span>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif italic text-white mb-8 drop-shadow-2xl tracking-tighter">
            {t.heroTitle || 'Your Dream Wedding Starts Here'}
          </h1>
          <div className="flex flex-col md:flex-row gap-0 p-2 bg-white/10 backdrop-blur-md rounded-none md:rounded-full border border-white/20 shadow-2xl overflow-hidden max-w-4xl mx-auto">
            <input type="text" placeholder="Search services..." className="flex-grow bg-transparent px-8 py-5 text-white outline-none text-sm placeholder:text-gray-400" onChange={(e) => setSearchQuery(e.target.value)} />
            <select className="bg-transparent px-8 py-5 text-white outline-none text-xs font-bold uppercase tracking-widest cursor-pointer appearance-none" onChange={(e) => setSelectedDistrict(e.target.value)}>
              <option value="" className="bg-slate-900">All Districts</option>
              {districts.map(d => <option key={d} value={d} className="bg-slate-900">{d}</option>)}
            </select>
            <button className="bg-rose-600 text-white px-12 py-5 rounded-none md:rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-rose-500 transition-all shadow-xl">Search</button>
          </div>
        </div>
      </div>

      {/* --- Categories Section (Updated: 2 per row + Auto Slider) --- */}
      <div className="relative z-10 -mt-32 px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-7xl mx-auto mb-48">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} cat={cat} />
          ))}
        </div>

        {/* --- Featured Section --- */}
        {categories.map((cat) => {
          const topList = getFilteredVendors(cat.name);
          if (topList.length === 0) return null;
          return (
            <section key={cat.id} className="max-w-[95%] mx-auto mb-40 px-4">
              <div className="flex flex-col md:flex-row items-baseline gap-4 mb-16 border-l-4 border-rose-500 pl-6">
                <h2 className="text-5xl font-serif italic text-white uppercase tracking-tighter">Top {cat.name}</h2>
                <span className="text-rose-500 font-black text-[10px] tracking-widest uppercase opacity-60">Handpicked Excellence</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {topList.map((vendor) => (
                  <div key={vendor.id} className="group relative bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-rose-500/30 transition-all duration-700 shadow-3xl">
                    <div className="h-80 w-full overflow-hidden bg-black relative">
                      <img src={vendor.imageUrl || cat.image} className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" alt={vendor.businessName} />
                      <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[8px] font-black px-4 py-2 rounded-full uppercase tracking-widest">⭐ PREMIUM VENDOR</div>
                    </div>
                    <div className="p-10">
                      <h4 className="text-white text-3xl font-serif italic group-hover:text-rose-400 transition-colors uppercase leading-none mb-4">{vendor.businessName}</h4>
                      <div className="flex items-center gap-3 mb-8">
                        <span className="text-rose-500 text-xs">📍</span>
                        <p className="text-gray-400 text-[11px] uppercase tracking-[0.2em] font-bold">{vendor.district} , Sri Lanka</p>
                      </div>
                      <Link href={`/vendor/${vendor.id}`}>
                        <button className="w-full py-5 bg-gradient-to-r from-rose-600 to-rose-700 text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:from-rose-500 hover:to-rose-600 transition-all shadow-xl flex items-center justify-center gap-2">
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

        <div className="mt-20 text-center pb-20">
          <Link href="/admin">
            <span className="text-gray-600 text-[9px] uppercase tracking-[0.4em] cursor-pointer hover:text-rose-500 transition-colors">Vendor Management Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}