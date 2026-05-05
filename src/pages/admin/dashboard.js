import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, orderBy, query, updateDoc, doc } from 'firebase/firestore';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Database එකෙන් bookings ටික අරගන්නවා
  const fetchBookings = async () => {
    try {
      const q = query(collection(db, "bookings"), orderBy("bookedAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Booking එකක status එක (Pending/Confirmed) වෙනස් කරන්න
  const updateStatus = async (id, newStatus) => {
    const docRef = doc(db, "bookings", id);
    await updateDoc(docRef, { status: newStatus });
    fetchBookings(); // Table එක refresh කරනවා
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-rose-500">ADMIN PANEL</h1>
            <p className="text-gray-400 text-sm">Manage your wedding bookings and invoices</p>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-full">
            <span className="text-rose-500 font-bold">{bookings.length} Total Bookings</span>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20">Loading Dashboard...</div>
        ) : (
          <div className="overflow-x-auto bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-6 text-xs uppercase tracking-widest text-gray-500">Service & Category</th>
                  <th className="p-6 text-xs uppercase tracking-widest text-gray-500">Location</th>
                  <th className="p-6 text-xs uppercase tracking-widest text-gray-500">Price (LKR)</th>
                  <th className="p-6 text-xs uppercase tracking-widest text-gray-500">Status</th>
                  <th className="p-6 text-xs uppercase tracking-widest text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-6">
                      <div className="font-bold text-white">{booking.serviceName}</div>
                      <div className="text-xs text-rose-400 font-medium">{booking.category}</div>
                    </td>
                    <td className="p-6 text-gray-400">{booking.customerLocation}</td>
                    <td className="p-6 font-mono text-emerald-400">
                      {booking.totalPaid?.toLocaleString()}
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        booking.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      {booking.status !== 'Confirmed' && (
                        <button 
                          onClick={() => updateStatus(booking.id, 'Confirmed')}
                          className="bg-white text-black text-[10px] font-bold px-4 py-2 rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                        >
                          Confirm
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}