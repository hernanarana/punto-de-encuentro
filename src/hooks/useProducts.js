import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit
} from "firebase/firestore";

/**
 * useProducts
 * @param {object} opts
 *  - category?: string
 *  - onlyActive?: bool  -> por defecto true
 *  - top?: number
 */
export function useProducts(opts = {}) {
  const {
    category,
    onlyActive = true,
    top,
  } = opts;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const col = collection(db, "products");
    let constraints = [];

    // 🔥 filtra por activo
    if (onlyActive) {
      constraints.push(where("active", "==", true));
    }

    // 🔥 filtra por categoría
    if (category) {
      constraints.push(where("category", "==", category));
    }

    // ⚠️ orderBy seguro (title siempre existe)
    constraints.push(orderBy("title", "asc"));

    // 🔥 límite si existe
    if (top) {
      constraints.push(limit(top));
    }

    const q = query(col, ...constraints);

    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({
        id: d.id,
        ...d.data()
      })));
      setLoading(false);
    });

    return () => unsub();
  }, [category, onlyActive, top]);

  return { items, loading };
}
