// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC8JavB_XVJ8kYwvctbSWeH69lavqzFDMY",
  authDomain: "dayhold-60d6f.firebaseapp.com",
  databaseURL: "https://dayhold-60d6f-default-rtdb.firebaseio.com",
  projectId: "dayhold-60d6f",
  storageBucket: "dayhold-60d6f.firebasestorage.app",
  messagingSenderId: "747223228069",
  appId: "1:747223228069:web:8cb587c6ac76853640b74c",
  measurementId: "G-0RBJTVVSB9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
