import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../auth/AuthProvider";

export default function useIsAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!user) { setIsAdmin(false); setLoading(false); return; }
      try {
        // ¡Ojo! leer settings/roles funciona para un admin (las reglas lo permiten)
        const snap = await getDoc(doc(db, "settings", "roles"));
        const emails = snap.exists() ? (snap.data().adminEmails || []) : [];
        if (alive) setIsAdmin(emails.includes(user.email));
      } catch {
        if (alive) setIsAdmin(false); // si no puede leer, no es admin (o reglas)
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [user]);

  return { isAdmin, loading };
}
