// src/admin/pages/Products.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebaseConfig"; // ✅ ruta correcta (sube 2 niveles)
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

/* ===== Miniatura (56x56) con fallback embebido ===== */
const FALLBACK_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56'>
      <rect width='100%' height='100%' fill='#101a2f'/>
      <text x='50%' y='54%' text-anchor='middle' font-size='10' fill='#94a3b8' font-family='sans-serif'>sin foto</text>
    </svg>`
  );

const getThumb = (p) => {
  const src =
    p?.thumbnail ||
    p?.image ||
    p?.imageUrl ||
    p?.img ||
    p?.photo ||
    p?.picture ||
    (Array.isArray(p?.images) && p.images[0]) ||
    FALLBACK_SVG;

  // Cloudinary: soporta /image/upload/ y /upload/
  return /res\.cloudinary\.com/.test(src)
    ? src
        .replace("/image/upload/", "/image/upload/c_fill,w_56,h_56,q_auto,f_auto/")
        .replace("/upload/", "/upload/c_fill,w_56,h_56,q_auto,f_auto/")
    : src;
};

const money = (n) =>
  Number(n || 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

export default function Products() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const toggleActive = async (p) =>
    updateDoc(doc(db, "products", p.id), { active: !p.active });

  const toggleFeatured = async (p) =>
    updateDoc(doc(db, "products", p.id), {
      featured: !p.featured,
      featuredRank: !p.featured ? Number(p.featuredRank || 999) : 999,
    });

  const toggle50 = async (p, is50) =>
    updateDoc(doc(db, "products", p.id), { discountPercent: is50 ? 0 : 50 });

  const remove = async (p) => {
    if (!confirm(`¿Borrar ${p.title}?`)) return;
    await deleteDoc(doc(db, "products", p.id));
  };

  return (
    <div style={{ padding: 16 }}>
      {/* Encabezados como en tu UI */}
      <div style={{ opacity: 0.75, marginBottom: 12, lineHeight: 1.1 }}>
        <div>Nombre</div>
        <div>Precio</div>
        <div>Categoría</div>
        <div>Acciones</div>
      </div>

      {items.map((p) => {
        const thumb = getThumb(p);
        const is50 = Number(p.discountPercent || 0) >= 50;

        return (
          <div key={p.id} style={{ marginBottom: 22 }}>
            {/* Nombre + miniatura */}
            <div
              style={{
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <img
                src={thumb}
                alt=""
                width={56}
                height={56}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 8,
                  objectFit: "cover",
                  background: "#0f172a1a",
                  border: "1px solid rgba(255,255,255,.08)",
                  flex: "0 0 56px",
                }}
                onError={(e) => (e.currentTarget.src = FALLBACK_SVG)}
              />
              <span>{p.title}</span>
              {p.featured && (
                <span
                  style={{
                    fontSize: 11,
                    padding: "2px 6px",
                    borderRadius: 999,
                    background: "#3b82f622",
                    color: "#2563eb",
                  }}
                >
                  Home
                </span>
              )}
              {is50 && (
                <span
                  style={{
                    fontSize: 11,
                    padding: "2px 6px",
                    borderRadius: 999,
                    background: "#16a34a22",
                    color: "#16a34a",
                  }}
                >
                  50% OFF
                </span>
              )}
            </div>

            <div style={{ marginBottom: 4 }}>{money(p.price)}</div>
            <div style={{ marginBottom: 8, opacity: 0.85 }}>
              {p.category || "—"}
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to={`/admin/editar/${p.id}`} className="btn">
                Editar
              </Link>
              <button className="btn" onClick={() => remove(p)}>
                Eliminar
              </button>
              <button className="btn" onClick={() => toggleFeatured(p)}>
                {p.featured ? "Sacar de Home" : "Poner en Home"}
              </button>
              <button className="btn" onClick={() => toggle50(p, is50)}>
                {is50 ? "Quitar 50%" : "Poner 50%"}
              </button>
              <button className="btn" onClick={() => toggleActive(p)}>
                {p.active ? "Desactivar" : "Activar"}
              </button>
            </div>
          </div>
        );
      })}

      {items.length === 0 && (
        <div style={{ padding: 16, opacity: 0.7 }}>No hay productos.</div>
      )}
    </div>
  );
}
