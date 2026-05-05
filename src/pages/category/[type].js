import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link'; // Capital 'L' වෙන්න ඕනේ

export default function CategoryPage() {
  const router = useRouter();
  const { type } = router.query;
  
  const [services, setServices] = useState([]);
  const [district, setDistrict] = useState('');

  useEffect(() => {
    if (!type) return;

    const fetchServices = async () => {
      const q = query(collection(db, "services"), where("category", "==", type));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServices(data);
    };

    fetchServices();
  }, [type]);

  const filteredServices = services.filter(s => 
    district === '' || s.location.toLowerCase() === district.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-slate-900 p-8 text-white">
      <h1 className="text-4xl font-bold capitalize mb-8">{type} Services</h1>

      {/* District Filter */}
      <div className="mb-10 bg-slate-800 p-4 rounded-xl flex gap-4 items-center">
        <span>Select District:</span>
        <select 
          className="bg-slate-700 p-2 rounded-lg outline-none text-white"
          onChange={(e) => setDistrict(e.target.value)}
        >
          <option value="">All Districts</option>
          <option value="Colombo">Colombo</option>
          <option value="Kandy">Kandy</option>
          <option value="Galle">Galle</option>
          <option value="Gampaha">Gampaha</option>
          <option value="Matara">Matara</option>
        </select>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredServices.map((service) => ( // මෙතන නම 'service'
          <div key={service.id} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold">{service.name}</h2>
              <p className="text-gray-400">{service.location}</p>
              <p className="text-gray-500 text-sm mt-2">{service.description}</p>
            </div>
            
            <div className="mt-6 border-t border-slate-700 pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-rose-500 font-bold text-lg">LKR {service.price}</span>
              </div>
              
              {/* මෙතන 'service.id' කියලා නිවැරදි කළා */}
              <Link href={`/booking/${service.id}`}>
                <button className="w-full bg-rose-600 py-3 rounded-xl font-bold hover:bg-rose-700 transition-all">
                  Book Now
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center mt-20 text-gray-500 italic">
          No services found in {district || 'this category'}.
        </div>
      )}
    </div>
  );
}