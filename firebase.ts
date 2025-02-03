// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRCgyoae5SOOk4odguLYeGIt30GjzEzU0",
  authDomain: "notion-clone-44922.firebaseapp.com",
  projectId: "notion-clone-44922",
  storageBucket: "notion-clone-44922.firebasestorage.app",
  messagingSenderId: "78270130076",
  appId: "1:78270130076:web:04530caae6acd982660a59"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig); 
const db = getFirestore(app);

export { db };