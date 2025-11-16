import { useEffect, useState } from "react";
import {
  collection, getDocs, onSnapshot,
  doc, setDoc, updateDoc, deleteDoc
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function SuppliersTab({ productId }) {
  const [allSuppliers, setAllSuppliers] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [selected, setSelected] = useState("");
  const [price, setPrice] = useState("");

  // lista maestra /suppliers (para el combo)
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "suppliers"));
        const rows = []; snap.forEach(d => rows.push({ id: d.id, ...d.data() }));
        setAllSuppliers(rows.filter(s => s.active !== false));
      } catch { setAllSuppliers([]); }
    })();
  }, []);

  // escuchar subcolección privada /products/{id}/suppliers
  useEffect(() => {
    const colRef = collection(db, "products", productId, "suppliers");
    const unsub = onSnapshot(colRef, (snap) => {
      const rows = []; snap.forEach(d => rows.push({ id: d.id, ...d.data() }));
      setAssigned(rows);
    });
    return unsub;
  }, [productId]);

  async function addOrUpdate() {
    if (!selected || !price) return;
    const sup = allSuppliers.find(s => s.id === selected);
    if (!sup) return;
    const ref = doc(db, "products", productId, "suppliers", sup.id);
    await setDoc(ref, { supplierName: sup.name, price: Number(price), preferred: false }, { merge: true });
    setPrice("");
  }
  async function setPreferred(supplierId) {
    await Promise.all(assigned.map(it =>
      updateDoc(doc(db, "products", productId, "suppliers", it.id), { preferred: it.id === supplierId })
    ));
  }
  async function removeSupplier(supplierId) {
    await deleteDoc(doc(db, "products", productId, "suppliers", supplierId));
  }

  return (
    <section>
      <h3>Proveedores (privado)</h3>
      <div style={{ display:"flex", gap:8, alignItems:"end", marginBottom:12 }}>
        <label>Proveedor
          <select value={selected} onChange={e=>setSelected(e.target.value)}>
            <option value="">Seleccionar…</option>
            {allSuppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
        <label>Precio
          <input type="number" value={price} onChange={e=>setPrice(e.target.value)} />
        </label>
        <button className="btn" onClick={addOrUpdate}>Agregar / Actualizar</button>
      </div>

      {!assigned.length ? (
        <div style={{ opacity:.75 }}>Sin proveedores asignados.</div>
      ) : (
        <div className="table">
          <div className="thead"><div>Proveedor</div><div>Precio</div><div>Preferido</div><div>Acciones</div></div>
          {assigned
            .sort((a,b)=> (a.preferred===b.preferred) ? a.price-b.price : (a.preferred?-1:1))
            .map(it => (
              <div className="trow" key={it.id}>
                <div>{it.supplierName}</div>
                <div>${Number(it.price||0).toLocaleString()}</div>
                <div>{it.preferred ? "✔" : "—"}</div>
                <div style={{ display:"flex", gap:8 }}>
                  {!it.preferred && <button className="btn btn--sm" onClick={()=>setPreferred(it.id)}>Preferido</button>}
                  <button className="btn btn--sm btn--danger" onClick={()=>removeSupplier(it.id)}>Quitar</button>
                </div>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}

