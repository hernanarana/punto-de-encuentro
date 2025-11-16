import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebaseConfig";
import { collection, onSnapshot, deleteDoc, doc, orderBy, query } from "firebase/firestore";

export default function Dashboard(){
  const [items, setItems] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const rows = []; snap.forEach(d => rows.push({ id: d.id, ...d.data() }));
      setItems(rows);
    });
    return unsub;
  }, []);

  async function onDelete(id){
    if (!confirm("¿Eliminar este producto?")) return;
    await deleteDoc(doc(db, "products", id));
  }

  return (
    <div>
      {!items.length ? (
        <div style={{ padding: 24, opacity:.8 }}>
          No hay productos. Creá el primero con “+ Nuevo producto”.
        </div>
      ) : (
        <div className="table">
          <div className="thead">
            <div>Nombre</div><div>Precio</div><div>Categoría</div><div>Acciones</div>
          </div>
          {items.map(p => (
            <div className="trow" key={p.id}>
              <div style={{ minWidth:220 }}>{p.title}</div>
              <div>${Number(p.price||0).toLocaleString()}</div>
              <div>{p.category || "—"}</div>
              <div style={{ display:"flex", gap:8 }}>
                <Link className="btn btn--sm" to={`/admin/producto/${p.id}`}>Editar</Link>
                <button className="btn btn--sm btn--danger" onClick={()=>onDelete(p.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
