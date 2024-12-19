
// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBbN1BAveTTMVkByejlmczWXYg18z2osxg",
  authDomain: "chat-app-f309e.firebaseapp.com",
  projectId: "chat-app-f309e",
  storageBucket: "chat-app-f309e.firebasestorage.app",
  messagingSenderId: "315485624237",
  appId: "1:315485624237:web:d4a76ec1dcb80d3ec93324"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
