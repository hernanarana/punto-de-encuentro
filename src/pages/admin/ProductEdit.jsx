// src/pages/admin/ProductEdit.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import SuppliersTab from "./SuppliersTab";

export default function ProductEdit() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const ref = doc(db, "products", id);
      const snap = await getDoc(ref);
      if (snap.exists()) setProduct({ id: snap.id, ...snap.data() });
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (!product) return <p>Producto no encontrado</p>;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h2>Editar producto: {product.title}</h2>
      <SuppliersTab product={product} />
    </div>
  );
}
