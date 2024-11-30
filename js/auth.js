// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyC7P1txKNJdO5WF0mw6e0st4gx24W68SEk",
  authDomain: "timecapsule-5df93.firebaseapp.com",
  projectId: "timecapsule-5df93",
  storageBucket: "timecapsule-5df93.firebasestorage.app",
  messagingSenderId: "613666356877",
  appId: "1:613666356877:web:f1710b831dbb79b2b9acc4",
  measurementId: "G-YEFXC4EGPK"
};

// Initialize Firebase app and services
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Get the form elements
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Helper function to redirect after successful login/signup
function redirectToCapsule() {
  window.location.href = "../pages/capsule.html"; // Redirect to the capsule page
}

// Login form submission
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Successfully logged in
        redirectToCapsule();
      })
      .catch((error) => {
        // Handle login errors
        alert("Error: " + error.message);
      });
  });
}

// Google Login button click
const googleLoginButton = document.getElementById("googleLoginButton");
if (googleLoginButton) {
  googleLoginButton.addEventListener("click", () => {
    signInWithPopup(auth, googleProvider)
      .then(() => {
        // Successfully logged in with Google
        redirectToCapsule();
      })
      .catch((error) => {
        // Handle errors
        alert("Error: " + error.message);
      });
  });
}

// Google Sign-Up button click
const googleSignupButton = document.getElementById("googleSignupButton");
if (googleSignupButton) {
  googleSignupButton.addEventListener("click", () => {
    signInWithPopup(auth, googleProvider)
      .then(() => {
        // Successfully signed up with Google
        redirectToCapsule();
      })
      .catch((error) => {
        // Handle errors
        alert("Error: " + error.message);
      });
  });
}

// Sign Up form submission
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Successfully signed up
        redirectToCapsule();
      })
      .catch((error) => {
        // Handle signup errors
        alert("Error: " + error.message);
      });
  });
}

// Forgot Password form submission
if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value;

    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Successfully sent reset email
        alert("Password reset email sent! Please check your inbox.");
        window.location.href = "../pages/login.html"; // Redirect to login page
      })
      .catch((error) => {
        // Handle errors
        alert("Error: " + error.message);
      });
  });
}
