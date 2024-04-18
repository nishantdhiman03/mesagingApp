// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDiVCyLS45XY6Qcvy2MduNzcYE8toFqWVc",
  authDomain: "chatbuddy-e514c.firebaseapp.com",
  projectId: "chatbuddy-e514c",
  storageBucket: "chatbuddy-e514c.appspot.com",
  messagingSenderId: "340299201167",
  appId: "1:340299201167:web:6ae8e1b2e67dfa7ae14efa",
  measurementId: "G-1V2CQDMDJ8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
