// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCgAEuD8F41dH5nUeoVxMot4-rTp4olmr8",
    authDomain: "tausug-dictionary-online.firebaseapp.com",
    projectId: "tausug-dictionary-online",
    storageBucket: "tausug-dictionary-online.firebasestorage.app",
    messagingSenderId: "919499038754",
    appId: "1:919499038754:web:051037787db5a6123c2a7b",
    measurementId: "G-LBKT0624FT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

console.log("Firebase initialized successfully with version 10.7.1!");

// Make Firebase available globally
window.firebaseApp = app;
window.firebaseDb = db;
window.firebaseAuth = auth;