import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7P1txKNJdO5WF0mw6e0st4gx24W68SEk",
  authDomain: "timecapsule-5df93.firebaseapp.com",
  projectId: "timecapsule-5df93",
  storageBucket: "gs://timecapsule-5df93.firebasestorage.app",
  messagingSenderId: "613666356877",
  appId: "1:613666356877:web:f1710b831dbb79b2b9acc4",
  measurementId: "G-YEFXC4EGPK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore instance

export { auth, db }; 