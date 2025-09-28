// src/firebaseConfig.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ✅ Valores correctos del proyecto (si querés fallback)
const HARD = {
  apiKey: "AIzaSyBcKizt_0TT_znc9Gl-Wcsf-Scn96lYZEg",
  authDomain: "punto-de-encuentro-ed245.firebaseapp.com",
  projectId: "punto-de-encuentro-ed245",
  // 👇 CORREGIDO
  storageBucket: "punto-de-encuentro-ed245.appspot.com",
  messagingSenderId: "142232060347",
  appId: "1:142232060347:web:f11a9cca6afbefa423849e",
};

// Usa ENV si existen (Vite), si no, cae a los hardcodeados
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || HARD.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || HARD.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || HARD.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || HARD.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || HARD.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || HARD.appId,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export { app };
