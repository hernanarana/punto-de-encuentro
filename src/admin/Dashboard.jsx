import { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import "./admin.css";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    const col = collection(db, "products");
    const unsub = onSnapshot(col, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(rows);
    });
    return () => unsub();
  }, []);

  const remove = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;
    await deleteDoc(doc(db, "products", id));
  };

  return (
    <div className="admin-wrap">
      <div className="topbar">
        <h2>Panel • Productos</h2>
        <div className="actions">
          <Link to="/admin/productos/nuevo" className="primary">Nuevo</Link>
          <button onClick={() => { signOut(auth); nav("/admin/login"); }}>
            Salir
          </button>
        </div>
      </div>

      <div className="grid">
        {items.map((p) => (
          <div key={p.id} className="card">
            {p.images?.[0] && <img src={p.images[0]} alt={p.title} />}
            <h3>{p.title}</h3>
            <p>${p.price}</p>
            <div className="row">
              <Link to={`/admin/productos/${p.id}`}>Editar</Link>
              <button onClick={() => remove(p.id)} className="danger">
                Borrar
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p>No hay productos aún.</p>}
      </div>
    </div>
  );
}
