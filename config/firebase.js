// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCscvgW17XsqgoTSwvBO9ZPetnhPZHuH58",
  authDomain: "avi-pro-mobile.firebaseapp.com",
  projectId: "avi-pro-mobile",
  storageBucket: "avi-pro-mobile.appspot.com",
  messagingSenderId: "714379198452",
  appId: "1:714379198452:web:6fa537e74641a61f6403a1",
  measurementId: "G-B3QX0N2YZG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, app, auth };