import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1yKcVrvOQ3Xl4FBZMR9RkdTKYwD2FbjQ",
  authDomain: "athlete-ai-5ca6c.firebaseapp.com",
  projectId: "athlete-ai-5ca6c",
  storageBucket: "athlete-ai-5ca6c.firebasestorage.app",
  messagingSenderId: "768757195090",
  appId: "1:768757195090:web:94f575b0dafc6347949a8b",
  measurementId: "G-EF3C2QNENY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
