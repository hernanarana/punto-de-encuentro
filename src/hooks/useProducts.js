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
 *  - category?: string  -> filtra por categoría
 *  - onlyActive?: bool  -> por defecto true
 *  - top?: number       -> límite opcional
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
    let q = query(collection(db, "products"));
    const wheres = [];
    if (onlyActive) wheres.push(where("active", "==", true));
    if (category) wheres.push(where("category", "==", category));

    // arma el query
    if (wheres.length) {
      q = query(collection(db, "products"), ...wheres, orderBy("createdAt", "desc"));
    } else {
      q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    }
    if (top) {
      q = query(q, limit(top));
    }

    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => unsub();
  }, [category, onlyActive, top]);

  return { items, loading };
}
