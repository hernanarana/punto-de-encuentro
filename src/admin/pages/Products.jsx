// src/admin/pages/Products.jsx
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Link } from "react-router-dom";

const FALLBACK = "/placeholder.jpg"; // asegurate de tener public/placeholder.jpg

// Si la imagen es de Cloudinary, generamos thumb 160x120 (4:3) solo para la tabla
function toThumb(url) {
  if (!url) return FALLBACK;
  try {
    const u = new URL(url);
    if (!u.hostname.includes("res.cloudinary.com")) return url;
    u.pathname = u.pathname.replace(
      "/upload/",
      "/upload/c_fill,w_160,h_120,q_auto,f_auto/"
    );
    return u.toString();
  } catch {
    return url;
  }
}

function money(n) {
  const v = Number(n || 0);
  return v.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

export default function Products() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  async function toggleActive(p) {
    await updateDoc(doc(db, "products", p.id), { active: !p.active });
  }

  async function remove(p) {
    if (!confirm(`¿Borrar ${p.title}?`)) return;
    await deleteDoc(doc(db, "products", p.id));
  }

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>Productos</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link to="/admin/proveedores">Proveedores</Link>
          <Link to="/admin/nuevo">+ Nuevo producto</Link>
        </div>
      </div>

      <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #333" }}>
            <th style={{ width: 110 }}>Imagen</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Proveedor</th>
            <th>Costo</th>
            <th>Margen</th>
            <th style={{ width: 110 }}>Estado</th>
            <th style={{ width: 280 }}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {items.map((p) => {
            const src =
              p.image || (Array.isArray(p.images) && p.images[0]) || FALLBACK;
            const thumb = toThumb(src);

            const supName = p.supplierName || p.supplierId || "-";
            const supContact = p.supplierContact || "";
            const supPrice = Number(p.supplierPrice || 0);
            const price = Number(p.price || 0);
            const margin = price - supPrice;
            const marginPct = price ? Math.round((margin / price) * 100) : 0;
            const is50 = Number(p.discountPercent || 0) >= 50;

            return (
              <tr key={p.id} style={{ borderBottom: "1px solid #222" }}>
                {/* Miniatura */}
                <td>
                  <div
                    style={{
                      width: 96,
                      aspectRatio: "4 / 3",
                      overflow: "hidden",
                      borderRadius: 8,
                      background: "#0f172a1a",
                    }}
                  >
                    <img
                      src={thumb}
                      alt={p.title || "producto"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={(e) => (e.currentTarget.src = FALLBACK)}
                    />
                  </div>
                </td>

                {/* Datos */}
                <td>
                  <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    {p.title}
                    {p.featured && (
                      <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 999, background: "#3b82f622", color: "#2563eb" }}>
                        Home
                      </span>
                    )}
                    {is50 && (
                      <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 999, background: "#16a34a22", color: "#16a34a" }}>
                        50% OFF
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>{p.slug}</div>
                </td>

                <td>{p.category || "-"}</td>
                <td>{money(price)}</td>
                <td>
                  <div><strong>{supName}</strong></div>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>{supContact}</div>
                </td>
                <td>{money(supPrice)}</td>
                <td>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      background: margin >= 0 ? "#10b98122" : "#ef444422",
                      color: margin >= 0 ? "#059669" : "#b91c1c",
                    }}
                  >
                    {money(margin)} ({marginPct}%)
                  </span>
                </td>

                {/* Estado + acciones */}
                <td>
                  <button
                    onClick={() => toggleActive(p)}
                    style={{ padding: "4px 8px" }}
                  >
                    {p.active ? "Desactivar" : "Activar"}
                  </button>
                </td>

                <td style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Link to={`/admin/editar/${p.id}`} style={{ padding: "4px 8px" }}>
                    Editar
                  </Link>

                  {/* Botón Home */}
                  <button
                    onClick={() =>
                      updateDoc(doc(db, "products", p.id), {
                        featured: !p.featured,
                        featuredRank: !p.featured
                          ? Number(p.featuredRank || 999)
                          : 999,
                      })
                    }
                    style={{ padding: "4px 8px" }}
                  >
                    {p.featured ? "Sacar de Home" : "Poner en Home"}
                  </button>

                  {/* Botón 50% */}
                  <button
                    onClick={() =>
                      updateDoc(doc(db, "products", p.id), {
                        discountPercent: is50 ? 0 : 50,
                      })
                    }
                    style={{ padding: "4px 8px" }}
                  >
                    {is50 ? "Quitar 50%" : "Poner 50%"}
                  </button>

                  <button
                    onClick={() => remove(p)}
                    style={{ padding: "4px 8px", color: "#f33" }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}

          {items.length === 0 && (
            <tr>
              <td colSpan={9} style={{ padding: 16, opacity: 0.7 }}>
                No hay productos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
