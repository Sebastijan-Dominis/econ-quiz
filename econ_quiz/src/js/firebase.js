// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAt5hGUfrjBwKfiBxijaeN4YZpjKLDkXgQ",
    authDomain: "econquiz-f39cc.firebaseapp.com",
    projectId: "econquiz-f39cc",
    storageBucket: "econquiz-f39cc.firebasestorage.app",
    messagingSenderId: "97889403428",
    appId: "1:97889403428:web:599e8fa5123d3bc9a04eb1",
    measurementId: "G-NTKF4XSG2F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export {
    db
}