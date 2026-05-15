import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
// වැදගත්: ආරක්ෂාව සඳහා මේ විස්තර ඔයාගේ .env.local ෆයිල් එකේ දාන්න.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBAOQEahdWfX9CV0X3Cl4NP7x50Bqp9aEM",
  authDomain: "wedding-app-d68f1.firebaseapp.com",
  projectId: "wedding-app-d68f1",
  storageBucket: "wedding-app-d68f1.firebasestorage.app",
  messagingSenderId: "1015029298195",
  appId: "1:1015029298195:web:564df345e02e2804207be6"
};

// App එක Initialize කිරීම (Server-side සහ Client-side ගැටලු නැතිවීමට)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Database සහ Storage Export කිරීම
const db = getFirestore(app);
const storage = getStorage(app); 

export { db, storage };