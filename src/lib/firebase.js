import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Guard against a missing .env so the rest of the site keeps working
// (and doesn't crash on import) before Firebase credentials are wired up.
const isConfigured = Boolean(firebaseConfig.projectId && firebaseConfig.apiKey);

export const db = isConfigured
  ? getFirestore(initializeApp(firebaseConfig))
  : null;
