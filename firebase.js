// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsNOkTZAdqB1PhrL1XDC0BTg6u0LMtU5Q",
    authDomain: "react-native-test-a6f67.firebaseapp.com",
    projectId: "react-native-test-a6f67",
    storageBucket: "react-native-test-a6f67.appspot.com",
    messagingSenderId: "987845762677",
    appId: "1:987845762677:web:514571b888bbed57d6e23c"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
// Export the auth object and any functions you need
export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, firestore };