// Import Firebase services
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";

// Firebase configuration
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
const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Sign Up Form (signup.html)
const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                window.location.href = "../pages/capsule.html"; // Redirect to capsule page
            })
            .catch((error) => {
                const errorMessage = error.message;
                alert("Error: " + errorMessage);
            });
    });
}

// Google Sign Up Button (signup.html)
const googleSignupButton = document.getElementById("googleSignupButton");
if (googleSignupButton) {
    googleSignupButton.addEventListener("click", () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                window.location.href = "../pages/capsule.html"; // Redirect to capsule page
            })
            .catch((error) => {
                const errorMessage = error.message;
                alert("Error: " + errorMessage);
            });
    });
}

// Login Form (login.html)
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                window.location.href = "../pages/capsule.html"; // Redirect to capsule page
            })
            .catch((error) => {
                const errorMessage = error.message;
                alert("Error: " + errorMessage);
            });
    });
}

// Google Login Button (login.html)
const googleLoginButton = document.getElementById("googleLoginButton");
if (googleLoginButton) {
    googleLoginButton.addEventListener("click", () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                window.location.href = "../pages/capsule.html"; // Redirect to capsule page
            })
            .catch((error) => {
                const errorMessage = error.message;
                alert("Error: " + errorMessage);
            });
    });
}

// Forgot Password Form (forgotpw.html)
const forgotPasswordForm = document.getElementById("forgotPasswordForm");
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;

        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("Password reset email sent! Please check your inbox.");
                window.location.href = "../pages/login.html"; // Redirect to login page
            })
            .catch((error) => {
                const errorMessage = error.message;
                alert("Error: " + errorMessage);
            });
    });
}

// Check if user is logged in (capsule.html)
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is logged in:", user);
    } else {
        console.log("No user is logged in. Redirecting to login page.");
        window.location.href = "../pages/login.html"; // Redirect to login if not logged in
    }
});
