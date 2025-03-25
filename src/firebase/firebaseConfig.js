// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBb2eG9MkViZBrmHCQXDTvmSMivZVT2TfQ",
  authDomain: "maiscultura-279ba.firebaseapp.com",
  projectId: "maiscultura-279ba",
  storageBucket: "maiscultura-279ba.firebasestorage.app",
  messagingSenderId: "818865571516",
  appId: "1:818865571516:web:5e4b61baec5a3b2bc3b2b9",
  measurementId: "G-Z1CQ0CBBKY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export const db = getFirestore(app);
