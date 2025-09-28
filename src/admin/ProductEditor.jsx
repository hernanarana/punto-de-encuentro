import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ProductForm from "./pages/ProductForm";
import SuppliersTab from "./pages/SuppliersTab";

export default function ProductEditor(){
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const ref = doc(db, "products", id);
      const snap = await getDoc(ref);
      if (snap.exists()) setProduct({ id: snap.id, ...snap.data() });
    })();
  }, [id]);

  async function onSave(data){
    setSaving(true);
    await updateDoc(doc(db, "products", id), data);
    setSaving(false);
  }

  if (!product) return <div style={{ padding:24 }}>Cargando…</div>;

  return (
    <div>
      <h2>Editar producto</h2>
      <ProductForm initial={product} onSave={onSave} saving={saving} />
      <hr style={{ margin:"24px 0" }} />
      <SuppliersTab productId={product.id} />
    </div>
  );
}
