import { db } from "../firebaseConfig";
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs
} from "firebase/firestore";

// Escuchar cambios en proveedores de un producto
export function listenProductSuppliers(productId, cb) {
  const colRef = collection(db, "products", productId, "suppliers");
  return onSnapshot(colRef, (snap) => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    cb(items);
  });
}

// Agregar proveedor
export async function addSupplier(productId, data) {
  const colRef = collection(db, "products", productId, "suppliers");
  const base = {
    name: "",
    quotePrice: 0,
    currency: "ARS", // o "USD"
    leadTimeDays: 0,
    stock: 0,
    contact: { phone: "", email: "", note: "" },
    lastQuoteAt: new Date(),
  };
  await addDoc(colRef, { ...base, ...data });
}

// Editar proveedor
export async function updateSupplier(productId, supplierId, data) {
  const ref = doc(db, "products", productId, "suppliers", supplierId);
  await updateDoc(ref, data);
}

// Eliminar proveedor
export async function removeSupplier(productId, supplierId) {
  const ref = doc(db, "products", productId, "suppliers", supplierId);
  await deleteDoc(ref);
}

// Setear proveedor activo y actualizar precio/stock del producto
export async function setActiveSupplier(productId, supplier) {
  const productRef = doc(db, "products", productId);
  await updateDoc(productRef, {
    activeSupplierId: supplier.id,
    price: Number(supplier.quotePrice) || 0,
    stock: Number(supplier.stock) || 0,
  });
}

// ===== Opcional: completar ownerId en productos existentes =====
export async function backfillOwnerId(OWNER_UID) {
  if (!OWNER_UID) throw new Error("Falta OWNER_UID");
  const snap = await getDocs(collection(db, "products"));
  const tasks = snap.docs.map(d =>
    updateDoc(doc(db, "products", d.id), { ownerId: OWNER_UID })
  );
  await Promise.all(tasks);
}
