import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Oyaage screenshot eke thibba config eka mama methanata damma
const firebaseConfig = {
  apiKey: "AIzaSyBA0QEahdWfX9CV0X3Cl4NP7x50Bqp9aEM",
  authDomain: "wedding-app-d68f1.firebaseapp.com",
  projectId: "wedding-app-d68f1",
  storageBucket: "wedding-app-d68f1.firebasestorage.app",
  messagingSenderId: "1015029298195",
  appId: "1:1015029298195:web:564df345e02e2804207be6"
};

// Firebase initialize karanawa
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };