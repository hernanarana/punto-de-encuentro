import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { auth } from "../../firebaseConfig";   // 👈 importá auth
import ProductForm from "./ProductForm";
import { useNavigate } from "react-router-dom";

export default function ProductNew() {
  const [saving, setSaving] = useState(false);
  const nav = useNavigate();

  async function onSave(data) {
    setSaving(true);
    const uid = auth.currentUser?.uid;               // 👈 UID del admin
    const ref = await addDoc(collection(db, "products"), {
      ...data,
      ownerId: uid,                                  // 👈 clave para pasar las reglas
      createdAt: serverTimestamp()
    });
    setSaving(false);
    nav(`/admin/producto/${ref.id}`);
  }

  return (
    <div>
      <h2>Nuevo producto</h2>
      <ProductForm onSave={onSave} saving={saving} />
    </div>
  );
}
