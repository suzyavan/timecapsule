// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7P1txKNJdO5WF0mw6e0st4gx24W68SEk",
  authDomain: "timecapsule-5df93.firebaseapp.com",
  projectId: "timecapsule-5df93",
  storageBucket: "timecapsule-5df93.firebasestorage.app",
  messagingSenderId: "613666356877",
  appId: "1:613666356877:web:f1710b831dbb79b2b9acc4",
  measurementId: "G-YEFXC4EGPK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Get the form elements
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Login Form Submission
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // User successfully logged in
                window.location.href = "../pages/capsule.html"; // Redirect to capsule.html
            })
            .catch((error) => {
                // Handle errors
                const errorCode = error.code;
                const errorMessage = error.message;
                alert("Error: " + errorMessage);
            });
    });
}

// Google Login Button Click
const googleLoginButton = document.getElementById("googleLoginButton");
if (googleLoginButton) {
    googleLoginButton.addEventListener("click", (e) => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                // User successfully signed in with Google
                window.location.href = "../pages/capsule.html"; // Redirect to capsule.html
            })
            .catch((error) => {
                // Handle errors
                const errorCode = error.code;
                const errorMessage = error.message;
                alert("Error: " + errorMessage);
            });
    });
}

// Google Sign-Up Button Click (added for sign-up functionality)
const googleSignupButton = document.getElementById("googleSignupButton");
if (googleSignupButton) {
    googleSignupButton.addEventListener("click", (e) => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                // User successfully signed up with Google
                window.location.href = "../pages/capsule.html"; // Redirect to capsule.html
            })
            .catch((error) => {
                // Handle errors
                const errorCode = error.code;
                const errorMessage = error.message;
                alert("Error: " + errorMessage);
            });
    });
}

// Sign Up Form Submission (same as before)
if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // User successfully signed up
                window.location.href = "../pages/capsule.html"; // Redirect to capsule.html
            })
            .catch((error) => {
                // Handle errors
                const errorCode = error.code;
                const errorMessage = error.message;
                alert("Error: " + errorMessage);
            });
    });
}
