// src/data/firestoreProducts.js
import { db } from "../firebaseConfig.js";

import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

/** Pequeña ayuda: mapea docs y filtra solo los activos */
function mapActive(snap) {
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    // ✅ solo productos activos (active !== false)
    .filter((p) => p.active !== false);
}

/** ===========================
 *  Listado
 *  =========================== */

/** Trae todos los productos (solo activos) */
export async function fetchAllProducts() {
  const colRef = collection(db, "products");
  let q;
  try {
    // si tenés createdAt, ordena por fecha
    q = query(colRef, orderBy("createdAt", "desc"));
  } catch {
    // si no existe índice o campo, usa sin orderBy
    q = colRef;
  }
  const snap = await getDocs(q);
  return mapActive(snap);
}

/** Trae productos por categoría (solo activos) */
export async function fetchProductsByCategory(category) {
  if (!category) return [];
  const colRef = collection(db, "products");
  const q = query(colRef, where("category", "==", category));
  const snap = await getDocs(q);
  return mapActive(snap);
}

/** Trae productos en oferta (solo activos) */
export async function fetchOffers() {
  const colRef = collection(db, "products");
  // si usás discountPercent para oferta:
  // const q = query(colRef, where("discountPercent", ">", 0));
  // pero como tenías `offer: true`, respetamos eso:
  const q = query(colRef, where("offer", "==", true));
  const snap = await getDocs(q);
  return mapActive(snap);
}

/** ===========================
 *  Detalle
 *  =========================== */

/**
 * Trae un producto por docID; si no existe, intenta por campo `slug`.
 * Soporta valores con encode (usa decodeURIComponent).
 * (Acá NO filtro active a propósito, para que en admin puedas abrirlo igual.)
 */
export async function fetchProductBySlugOrId(raw) {
  const id = decodeURIComponent(raw ?? "");

  // 1) Intento por doc ID exacto
  const ref = doc(db, "products", id);
  const snap = await getDoc(ref);
  if (snap.exists()) return { id: snap.id, ...snap.data() };

  // 2) Intento por campo `slug`
  const colRef = collection(db, "products");
  const q = query(colRef, where("slug", "==", id));
  const qs = await getDocs(q);
  if (!qs.empty) {
    const d = qs.docs[0];
    return { id: d.id, ...d.data() };
  }

  throw new Error("Producto no encontrado");
}

/** Alias si alguna parte del código todavía llama fetchProductById */
export const fetchProductById = fetchProductBySlugOrId;

/** ===========================
 *  Utilidad (para Admin)
 *  =========================== */

/** Genera un slug limpio desde un título (útil en formularios del dueño) */
export function toSlug(str) {
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // saca tildes
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // todo lo raro a guiones
    .replace(/(^-|-$)/g, ""); // sin guiones al inicio/fin
}
