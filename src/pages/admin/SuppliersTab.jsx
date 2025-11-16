// src/pages/admin/SuppliersTab.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";

/**
 * Props:
 * - product: objeto del producto (opcional). Si viene, NO vuelvo a pedirlo.
 * - productId: string (opcional). Si no viene, lo tomo de useParams().
 * - showBackLink: boolean (opcional, default true)
 */
export default function SuppliersTab({
  product: productProp,
  productId: productIdProp,
  showBackLink = true,
}) {
  const { id: idFromParams } = useParams();
  const productId = productIdProp || idFromParams;

  const [product, setProduct] = useState(productProp ?? null);
  const [loadingProduct, setLoadingProduct] = useState(!productProp);
  const [suppliers, setSuppliers] = useState([]);

  // Si viene por props, lo tomo; si no, lo leo 1 sola vez
  useEffect(() => {
    setProduct(productProp ?? null);
    setLoadingProduct(!productProp);
  }, [productProp]);

  useEffect(() => {
    if (product) return; // ya lo tengo por props
    if (!productId) return;

    (async () => {
      const ref = doc(db, "products", productId);
      const snap = await getDoc(ref);
      if (snap.exists()) setProduct({ id: snap.id, ...snap.data() });
      setLoadingProduct(false);
    })();
  }, [productId, product]);

  // Refs y listener de proveedores
  const productRef = useMemo(
    () => (productId ? doc(db, "products", productId) : null),
    [productId]
  );
  const suppliersRef = useMemo(
    () => (productRef ? collection(productRef, "suppliers") : null),
    [productRef]
  );

  useEffect(() => {
    if (!suppliersRef) return;
    const q = query(suppliersRef, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (ss) =>
      setSuppliers(ss.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, [suppliersRef]);

  if (loadingProduct) return <p>Cargando proveedores…</p>;
  if (!product) return <p>Producto no encontrado.</p>;

  // Solo el dueño puede ver/editar proveedores (seguridad real está en Reglas)
  const isOwner =
    auth.currentUser && product.ownerId === auth.currentUser.uid;

  if (!isOwner) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Proveedores</h2>
        <p>No tenés permiso para ver esta sección.</p>
        {showBackLink && productId && (
          <Link to={`/admin/products/${productId}`}>Volver</Link>
        )}
      </div>
    );
  }

  // Form
  const [form, setForm] = useState({
    name: "",
    contact: "",
    price: "",
    moq: "",
    leadTime: "",
    notes: "",
  });

  const addSupplier = async (e) => {
    e.preventDefault();
    if (!suppliersRef) return;

    const payload = {
      name: form.name.trim(),
      contact: form.contact.trim(),
      price: Number(form.price) || 0,
      moq: Number(form.moq) || 0,
      leadTime: form.leadTime.trim(),
      notes: form.notes.trim(),
      createdAt: serverTimestamp(),
    };
    await addDoc(suppliersRef, payload);
    setForm({ name: "", contact: "", price: "", moq: "", leadTime: "", notes: "" });
  };

  const removeSupplier = async (supplierId) => {
    if (!suppliersRef) return;
    await deleteDoc(doc(suppliersRef, supplierId));
  };

  return (
    <div style={{ padding: 16, maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <h2>Proveedores de “{product.title || productId}”</h2>
        {showBackLink && productId && (
          <Link to={`/admin/products/${productId}`}>⬅ Volver</Link>
        )}
      </div>

      <form
        onSubmit={addSupplier}
        style={{
          display: "grid",
          gap: 8,
          gridTemplateColumns: "repeat(6, 1fr)",
          margin: "12px 0",
        }}
      >
        <input
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Contacto"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
        />
        <input
          placeholder="Precio"
          type="number"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          placeholder="MOQ"
          type="number"
          value={form.moq}
          onChange={(e) => setForm({ ...form, moq: e.target.value })}
        />
        <input
          placeholder="Lead time"
          value={form.leadTime}
          onChange={(e) => setForm({ ...form, leadTime: e.target.value })}
        />
        <input
          placeholder="Notas"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <button type="submit" style={{ gridColumn: "span 6" }}>
          Agregar proveedor
        </button>
      </form>

      <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f3f3f3" }}>
            <th align="left">Nombre</th>
            <th align="left">Contacto</th>
            <th>Precio</th>
            <th>MOQ</th>
            <th align="left">Lead time</th>
            <th align="left">Notas</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s.id} style={{ borderTop: "1px solid #eee" }}>
              <td>{s.name}</td>
              <td>{s.contact}</td>
              <td align="center">{s.price}</td>
              <td align="center">{s.moq}</td>
              <td>{s.leadTime}</td>
              <td>{s.notes}</td>
              <td align="right">
                <button onClick={() => removeSupplier(s.id)}>Borrar</button>
              </td>
            </tr>
          ))}
          {suppliers.length === 0 && (
            <tr>
              <td colSpan={7} style={{ padding: 16, textAlign: "center", color: "#666" }}>
                No hay proveedores cargados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
