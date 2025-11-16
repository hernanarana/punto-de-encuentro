// src/auth/AuthProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, getAuth } from "firebase/auth";
import { auth } from "../firebaseConfig"; // <-- tu getAuth(app) creado en firebaseConfig

const AuthCtx = createContext({ user: null, loading: true, login: async()=>{}, logout: async()=>{} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setLoading(false);
      console.log("[Auth] onAuthStateChanged:", u?.email); // debug
    });
    return () => unsub();
  }, []);

  const login = (email, password) => {
    console.log("[Auth] login()", email); // debug
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    console.log("[Auth] logout()"); // debug
    return signOut(auth);
  };

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
