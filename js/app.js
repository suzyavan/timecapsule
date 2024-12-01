import { auth } from '../js/firebase.js';  // Import initialized auth
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    // Signup Elements
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const signUpBtn = document.getElementById("signup-btn");
    
    // Login Elements
    const loginBtn = document.getElementById("login-btn");
    
    // Google Sign-In Elements
    const googleSignUpBtn = document.getElementById("googleSignupButton");
    const googleLoginBtn = document.getElementById("googleLoginButton");

    // Forgot Password Elements
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");
    const forgotPasswordEmail = document.getElementById("email");

    // Initialize GoogleAuthProvider
    const provider = new GoogleAuthProvider();

    // Signup with Email/Password
    const signUpButtonPressed = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
            console.log('User signed up:', userCredential.user);
            // Redirect to login page after signup
            window.location.href = '../pages/login.html';
        } catch (error) {
            console.log('Error:', error.code, error.message);
        }
    }

    // Login with Email/Password
    const loginButtonPressed = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
            console.log('User logged in:', userCredential.user);
            // Redirect to capsule page after login
            window.location.href = '../pages/capsule.html';
        } catch (error) {
            console.log('Error:', error.code, error.message);
            alert('Login failed: ' + error.message);
        }
    }

    // Google Sign-Up (using Google Auth Provider)
    const googleSignUpButtonPressed = async (e) => {
        e.preventDefault();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log('User signed up with Google:', user);
            // Redirect to login page after signup
            window.location.href = '../pages/login.html';
        } catch (error) {
            console.log('Error:', error.code, error.message);
        }
    }

    // Google Login (using Google Auth Provider)
    const googleLoginButtonPressed = async (e) => {
        e.preventDefault();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log('User logged in with Google:', user);
            // Redirect to capsule page after login
            window.location.href = '../pages/capsule.html';
        } catch (error) {
            console.log('Error:', error.code, error.message);
            alert('Login failed: ' + error.message);
        }
    }

    // Forgot Password functionality
    const sendResetLink = async (e) => {
        e.preventDefault();

        const email = forgotPasswordEmail.value;

        if (!email) {
            alert("Please enter an email address.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            console.log('Password reset link sent to:', email);
            alert('Password reset link sent! Please check your email.');
        } catch (error) {
            console.log('Error:', error.code, error.message);
            alert('Error: ' + error.message);
        }
    }

    // Event Listeners
    if (signUpBtn) {
        signUpBtn.addEventListener("click", signUpButtonPressed);
    }
    if (loginBtn) {
        loginBtn.addEventListener("click", loginButtonPressed);
    }
    if (googleSignUpBtn) {
        googleSignUpBtn.addEventListener("click", googleSignUpButtonPressed);
    }
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener("click", googleLoginButtonPressed);
    }
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener("submit", sendResetLink);
    }
});
