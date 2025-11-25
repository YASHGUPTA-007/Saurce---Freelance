// lib/firebase.ts
'use client';

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCM8olotvgc3IhCcxW1vQYa6b9_znEYOQw",
  authDomain: "saurce-6e007.firebaseapp.com",
  projectId: "saurce-6e007",
  storageBucket: "saurce-6e007.firebasestorage.app",
  messagingSenderId: "141170643616",
  appId: "1:141170643616:web:7d0aa9f5650253e2caafc5",
  measurementId: "G-4TNHZXB5MP"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { app, db, storage };