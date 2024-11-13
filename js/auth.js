import { auth, provider } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

// Google Login
document.querySelector('.google-login').addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log('User signed in:', result.user);
            window.location.href = 'index.html'; // Redirect to index.html locally
        })
        .catch((error) => alert('Error during sign-in: ' + error.message));
});

// Email and Password Login
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('User logged in:', userCredential.user);
            window.location.href = 'index.html'; // Redirect to index.html locally
        })
        .catch((error) => alert('Error during login: ' + error.message));
});

// Email and Password Signup
document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('User signed up:', userCredential.user);
            window.location.href = 'index.html'; // Redirect to index.html locally
        })
        .catch((error) => alert('Error during signup: ' + error.message));
});
