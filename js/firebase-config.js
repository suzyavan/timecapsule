// Import the necessary functions
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";  // Import auth services
import { getFirestore } from "firebase/firestore";  // Firestore services if you need it

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7P1txKNJdO5WF0mw6e0st4gx24W68SEk",  // Ensure this is correct
  authDomain: "timecapsule-5df93.firebaseapp.com",
  projectId: "timecapsule-5df93",
  storageBucket: "timecapsule-5df93.firebasestorage.app",
  messagingSenderId: "613666356877",
  appId: "1:613666356877:web:f1710b831dbb79b2b9acc4",
  measurementId: "G-YEFXC4EGPK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize auth and Firestore
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };  // Export for use in your app
