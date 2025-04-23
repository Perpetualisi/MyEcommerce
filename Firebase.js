// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Import Firebase services you want to use
import { getAuth } from "firebase/auth"; // For authentication
import { getFirestore } from "firebase/firestore"; // For Firestore
import { getStorage } from "firebase/storage"; // For Storage

const firebaseConfig = {
  apiKey: "AIzaSyAcyI06uCftBtCFq8e5kbQH14VxWHW4c7M",
  authDomain: "myecommerce-1cb52.firebaseapp.com",
  projectId: "myecommerce-1cb52",
  storageBucket: "myecommerce-1cb52.firebasestorage.app",
  messagingSenderId: "961416314151",
  appId: "1:961416314151:web:a5d33a345e1e90563fbd02",
  measurementId: "G-NKLWDFE6WE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
const auth = getAuth(app); // For user authentication
const firestore = getFirestore(app); // For Firestore database
const storage = getStorage(app); // For Firebase Storage

// Export services to use them in other parts of the app
export { app, auth, firestore, storage };
