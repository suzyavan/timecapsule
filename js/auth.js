import { auth } from './firebase.js'; // Import the initialized Firebase auth object
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

// **Sign-Up Function**
const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    alert('Sign-Up Successful! Welcome, ' + userCredential.user.email);
    // Redirect or perform further actions after successful sign-up
    window.location.href = "index.html"; // Adjust the redirect as needed
  } catch (error) {
    alert('Error: ' + error.message);
  }
};

// **Login Function**
const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    alert('Login Successful! Welcome back, ' + userCredential.user.email);
    // Redirect or perform further actions after successful login
    window.location.href = "index.html"; // Adjust the redirect as needed
  } catch (error) {
    alert('Login Failed: ' + error.message);
  }
};

// **Google Sign-In Function**
const googleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    alert('Google Sign-In Successful!');
    // Redirect or perform further actions after successful Google login
    window.location.href = "index.html";
  } catch (error) {
    alert('Google Sign-In Failed: ' + error.message);
  }
};

// **Password Reset Function**
const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert('Password reset email sent! Check your inbox.');
  } catch (error) {
    alert('Error: ' + error.message);
  }
};

// **Event listeners for the forms and buttons**
document.getElementById('signupForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  signUp(email, password);
});

document.getElementById('loginForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});

document.getElementById('googleSignupButton')?.addEventListener('click', googleSignIn);
document.getElementById('googleLoginButton')?.addEventListener('click', googleSignIn);

document.getElementById('forgotPasswordForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  resetPassword(email);
});
