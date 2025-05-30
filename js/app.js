import { auth } from '../js/firebase.js';
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,signInWithPopup,GoogleAuthProvider,sendPasswordResetEmail, signOut,onAuthStateChanged, sendEmailVerification} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const loginSection = document.getElementById("loginSection");
    const signupSection = document.getElementById("signupSection");

    if (loginSection && signupSection) {
        const params = new URLSearchParams(window.location.search);
        const mode = params.get('mode');
        if (mode === 'signup') {
            loginSection.style.display = "none";
            signupSection.style.display = "block";
        } else {
            loginSection.style.display = "block";
            signupSection.style.display = "none";
        }

        const email = document.getElementById("email");
        const password = document.getElementById("password");
        const signupEmail = document.getElementById("signupEmail");
        const signupPassword = document.getElementById("signupPassword");
        const signUpBtn = document.getElementById("signup-btn");
        const loginBtn = document.getElementById("login-btn");
        const googleSignUpBtn = document.getElementById("googleSignupButton");
        const googleLoginBtn = document.getElementById("googleLoginButton");
        const forgotPasswordForm = document.getElementById("forgotPasswordForm");
        const forgotPasswordEmail = document.getElementById("forgotPasswordEmail");
        const provider = new GoogleAuthProvider();
        const humanCheck = document.getElementById("humanCheck");
        const checkboxError = document.getElementById("checkboxError");

        if (humanCheck && loginBtn) {
            humanCheck.addEventListener("change", () => {
                loginBtn.disabled = !humanCheck.checked;
                if (checkboxError) {
                    checkboxError.style.display = "none"; 
                }
            });
        }

        const signUpButtonPressed = async (e) => {
            e.preventDefault();
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, signupEmail.value, signupPassword.value);
                const user = userCredential.user;
        
                await sendEmailVerification(user);
                console.log('Verification email sent to:', user.email);
        
                alert("Account created! A verification link has been sent to your email. Please verify before logging in.");
                window.location.href = "auth.html?mode=login";
            } catch (error) {
                console.log('Error:', error.code, error.message);
                alert('Sign-up failed: ' + error.message);
            }
        };
        

        const loginButtonPressed = async (e) => {
            e.preventDefault();
            if (!humanCheck.checked) {
                if (checkboxError) checkboxError.style.display = "block";
                return;
            } else {
                if (checkboxError) checkboxError.style.display = "none";
            }
        
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
                const user = userCredential.user;
        
                if (!user.emailVerified) {
                    alert("Please verify your email before logging in. Check your inbox or spam folder.");
                    await signOut(auth);
                    return;
                }
        
                console.log('User logged in:', user);
                localStorage.setItem("loggedInViaLoginForm", "true");
                window.location.href = '../index.html';
            } catch (error) {
                console.log('Error:', error.code, error.message);
                alert('Login failed: ' + error.message);
            }
        };
        

        const googleSignUpButtonPressed = async (e) => {
            e.preventDefault();
            try {
                const result = await signInWithPopup(auth, provider);
                console.log('User signed up with Google:', result.user);
                alert("Sign-up successful with Google! You can now log in.");
                window.location.href = "auth.html?mode=login";
            } catch (error) {
                console.log('Error:', error.code, error.message);
                alert('Google sign-up failed: ' + error.message);
            }
        };

        const googleLoginButtonPressed = async (e) => {
            e.preventDefault();
            try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                console.log('User logged in with Google:', user);
                localStorage.setItem("loggedInViaLoginForm", "true");
                window.location.href = '../index.html';
            } catch (error) {
                console.log('Error:', error.code, error.message);
                alert('Login failed: ' + error.message);
            }
        };

        const sendResetLink = async (e) => {
            e.preventDefault();
            const emailVal = forgotPasswordEmail.value;
            if (!emailVal) {
                alert("Please enter an email address.");
                return;
            }
            try {
                await sendPasswordResetEmail(auth, emailVal);
                console.log('Password reset link sent to:', emailVal);
                alert('Password reset link sent! Please check your email.');
            } catch (error) {
                console.log('Error:', error.code, error.message);
                alert('Error: ' + error.message);
            }
        };

        const switchToSignup = () => {
            loginSection.style.display = "none";
            signupSection.style.display = "block";
        };

        const switchToLogin = () => {
            signupSection.style.display = "none";
            loginSection.style.display = "block";
        };

        const switchToForgotPassword = () => {
            loginSection.style.display = "none";
            document.getElementById("forgotPasswordSection").style.display = "block";
        };

        const switchToLoginFromForgot = () => {
            document.getElementById("forgotPasswordSection").style.display = "none";
            loginSection.style.display = "block";
        };

        if (signUpBtn) signUpBtn.addEventListener("click", signUpButtonPressed);
        if (loginBtn) loginBtn.addEventListener("click", loginButtonPressed);
        if (googleSignUpBtn) googleSignUpBtn.addEventListener("click", googleSignUpButtonPressed);
        if (googleLoginBtn) googleLoginBtn.addEventListener("click", googleLoginButtonPressed);
        if (forgotPasswordForm) forgotPasswordForm.addEventListener("submit", sendResetLink);

        document.getElementById("switchToSignup").addEventListener("click", switchToSignup);
        document.getElementById("switchToLogin").addEventListener("click", switchToLogin);
        document.getElementById("forgotPasswordLink").addEventListener("click", switchToForgotPassword);
        document.getElementById("backToLogin").addEventListener("click", switchToLoginFromForgot);
    }

    const authButtons = document.getElementById("authButtons");
    const signOutBtn = document.getElementById("signOutBtn");
    const userEmailElement = document.getElementById("userEmail");
    const userInfo = document.getElementById("userInfo");

    if (authButtons && signOutBtn) {
        onAuthStateChanged(auth, (user) => {
            const cameFromLogin = localStorage.getItem("loggedInViaLoginForm") === "true";
            if (user && cameFromLogin) {
                authButtons.style.display = "none";
                userInfo.style.display = "inline-block";
                userEmailElement.textContent = user.email;
                signOutBtn.style.display = "inline-block";
            } else {
                authButtons.style.display = "flex";
                userInfo.style.display = "none";
                signOutBtn.style.display = "none";
            }
        });

        signOutBtn.addEventListener("click", async () => {
            try {
                await signOut(auth);
                localStorage.removeItem("loggedInViaLoginForm");
                window.location.reload();
            } catch (error) {
                console.error("Error signing out:", error);
            }
        });
    }
});