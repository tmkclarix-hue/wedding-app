const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// --- 1. Firebase Admin Setup ---
// සටහන: ඔයාගේ Firebase Console එකෙන් ගන්නා Service Account Key එක මෙතනට දාන්න ඕනේ (පහළ විස්තර කර ඇත).
const serviceAccount = require('./serviceAccountKey.json'); 

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// --- 2. Dummy Data Generation (100 Vendors) ---
const districts = ["Colombo"];
const categories = ["Hotels", "Photography", "Salon", "Wedding Cars", "Jewelry"];

const vendorsData = [];

// Hotels 20
for (let i = 1; i <= 20; i++) {
  vendorsData.push({
    businessName: `Colombo Grand Hotel ${i}`,
    category: "Hotels",
    district: "Colombo",
    phone: `07112345${String(i).padStart(2, '0')}`,
    description: `Experience luxury and elegance at Colombo Grand Hotel ${i}. Perfect venue for your dream wedding with premium catering and spaces.`,
    imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80",
    status: "approved",
    isTop: true,
    isTopList: true,
    createdAt: new Date()
  });
}

// Photography 20
for (let i = 1; i <= 20; i++) {
  vendorsData.push({
    businessName: `Clarix Capture Photography ${i}`,
    category: "Photography",
    district: "Colombo",
    phone: `07712345${String(i).padStart(2, '0')}`,
    description: `Capturing your precious moments forever. Clarix Capture ${i} specializes in luxury wedding photography and cinematic videography.`,
    imageUrl: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80",
    status: "approved",
    isTop: true,
    isTopList: true,
    createdAt: new Date()
  });
}

// Salon 20
for (let i = 1; i <= 20; i++) {
  vendorsData.push({
    businessName: `Royal Bride Bridal Salon ${i}`,
    category: "Salon",
    district: "Colombo",
    phone: `07612345${String(i).padStart(2, '0')}`,
    description: `Exquisite bridal dressing and makeovers. Royal Bride Salon ${i} ensures you look stunning on your most special day.`,
    imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80",
    status: "approved",
    isTop: true,
    isTopList: true,
    createdAt: new Date()
  });
}

// Wedding Cars 20
for (let i = 1; i <= 20; i++) {
  vendorsData.push({
    businessName: `Elite Wedding Rides ${i}`,
    category: "Wedding Cars",
    district: "Colombo",
    phone: `07212345${String(i).padStart(2, '0')}`,
    description: `Ride in luxury. Elite Wedding Rides ${i} provides premium luxury cars (Mercedes, BMW, Jaguar) for your special day with professional chauffeurs.`,
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80",
    status: "approved",
    isTop: true,
    isTopList: true,
    createdAt: new Date()
  });
}

// Jewelry 20
for (let i = 1; i <= 20; i++) {
  vendorsData.push({
    businessName: `Vogue & Shine Jewelers ${i}`,
    category: "Jewelry",
    district: "Colombo",
    phone: `07512345${String(i).padStart(2, '0')}`,
    description: `Crafting timeless elegance. Vogue & Shine Jewelers ${i} offers custom crafted gold wedding rings and necklaces with lifetime warranty.`,
    imageUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80",
    status: "approved",
    isTop: true,
    isTopList: true,
    createdAt: new Date()
  });
}

// --- 3. Function to Upload Data to Firestore ---
async function importData() {
  console.log(`Starting to upload ${vendorsData.length} vendors to Firestore...`);
  
  const collectionRef = db.collection('pending_vendors');
  
  for (const vendor of vendorsData) {
    try {
      await collectionRef.add(vendor);
      console.log(`Successfully added: ${vendor.businessName}`);
    } catch (error) {
      console.error(`Error adding ${vendor.businessName}:`, error);
    }
  }
  
  console.log("All 100 vendors imported successfully! 🎉");
  process.exit();
}

importData();