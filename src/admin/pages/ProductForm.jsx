// src/admin/pages/ProductForm.jsx
import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../firebaseConfig";

// Categorías sugeridas (podés editar esta lista)
const CATEGORIES = [
  "Indumentaria",
  "Ferretería",
  "Tecnología",
  "Hogar",
  "Electrodomésticos",
  "Herramientas",
  "Jardinería",
  "Ofertas",
];

const EMPTY = {
  title: "",
  price: "",
  category: "",
  brand: "",
  rating: "",
  slug: "",
  image: "",
  images: "",            // CSV: "url1, url2, ..."

  // Contenido
  description: "",
  specsText: "",

  // Proveedor
  supplierId: "",
  supplierName: "",
  supplierContact: "",
  supplierPrice: "",

  // Destacados / descuentos
  featured: false,
  featuredRank: "",
  discountPercent: "",
};

const FALLBACK = "/placeholder.jpg";

function toSlug(str) {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toThumb(url, w = 320, h = 240) {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (!u.hostname.includes("res.cloudinary.com")) return url;
    u.pathname = u.pathname.replace(
      "/upload/",
      `/upload/c_fill,w_${w},h_${h},q_auto,f_auto/`
    );
    return u.toString();
  } catch {
    return url;
  }
}

export default function ProductForm({ initial, onSave, saving }) {
  const [form, setForm] = useState(EMPTY);
  const [suppliersRef, setSuppliersRef] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "suppliers"), orderBy("name", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setSuppliersRef(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Hidratar en modo edición
  useEffect(() => {
    setForm(
      initial
        ? {
            ...EMPTY,
            ...initial,
            images: Array.isArray(initial?.images)
              ? initial.images.join(", ")
              : initial?.images || "",
            description: initial?.description || "",
            specsText: Array.isArray(initial?.specs)
              ? initial.specs.join("\n")
              : (initial?.specs || ""),
            price: initial?.price ?? "",
            rating: initial?.rating ?? "",
            supplierPrice: initial?.supplierPrice ?? "",
            featured: Boolean(initial?.featured),
            featuredRank: initial?.featuredRank ?? "",
            discountPercent: initial?.discountPercent ?? "",
          }
        : EMPTY
    );
  }, [initial]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Previews
  const gallery = useMemo(
    () =>
      (form.images || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [form.images]
  );

  function handleSubmit(e) {
    e.preventDefault();

    const specs = (form.specsText || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: (form.title || "").trim(),
      price: Number(form.price || 0),
      category: (form.category || "").trim(),
      brand: (form.brand || "").trim(),
      rating: Number(form.rating || 0),
      slug: form.slug ? toSlug(form.slug) : toSlug(form.title),

      image: (form.image || "").trim() || (gallery[0] || ""),
      images: gallery,

      description: (form.description || "").trim(),
      specs,

      supplierId: form.supplierId || "",
      supplierName: (form.supplierName || "").trim(),
      supplierContact: (form.supplierContact || "").trim(),
      supplierPrice: Number(form.supplierPrice || 0),

      featured: Boolean(form.featured),
      featuredRank: form.featured ? Number(form.featuredRank || 999) : 999,
      discountPercent: Number(form.discountPercent || 0),
    };

    onSave(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="form" style={{ display: "grid", gap: 16 }}>
      <div
        className="grid"
        style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(4, minmax(0, 1fr))", alignItems: "start" }}
      >
        <label>
          Nombre
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            required
          />
        </label>

        <label>
          Precio (ARS)
          <input
            type="number"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            required
          />
        </label>

        {/* Categoría con datalist (puede escribir o elegir) */}
        <label>
          Categoría
          <input
            list="cats"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            placeholder="Elegí o escribí"
          />
          <datalist id="cats">
            {CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>

        <label>
          Marca
          <input value={form.brand} onChange={(e) => set("brand", e.target.value)} />
        </label>

        <label>
          Rating
          <input
            type="number"
            step="0.1"
            value={form.rating}
            onChange={(e) => set("rating", e.target.value)}
          />
        </label>

        <label>
          Slug
          <input
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="se-autogenera-si-lo-dejas-vacío"
          />
        </label>

        {/* Proveedor */}
        <label>
          Proveedor
          <select
            value={form.supplierId || ""}
            onChange={(e) => {
              const id = e.target.value;
              set("supplierId", id);
              const s = suppliersRef.find((x) => x.id === id);
              if (s && !form.supplierName) set("supplierName", s.name || "");
            }}
          >
            <option value="">— Elegir —</option>
            {suppliersRef.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} {s.phone ? `(${s.phone})` : ""}
              </option>
            ))}
          </select>
        </label>

        <label>
          Nombre proveedor (editable)
          <input
            value={form.supplierName || ""}
            onChange={(e) => set("supplierName", e.target.value)}
            placeholder="Proveedor B"
          />
        </label>

        <label>
          Contacto proveedor (tel/mail)
          <input
            value={form.supplierContact || ""}
            onChange={(e) => set("supplierContact", e.target.value)}
            placeholder="+54..."
          />
        </label>

        <label>
          Precio proveedor (ARS)
          <input
            type="number"
            value={form.supplierPrice || ""}
            onChange={(e) => set("supplierPrice", e.target.value)}
            placeholder="0"
          />
        </label>

        {/* Destacados / Descuentos */}
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={!!form.featured}
            onChange={(e) => set("featured", e.target.checked)}
          />
          Mostrar en página principal
        </label>

        <label>
          Orden en Home (1=primero)
          <input
            type="number"
            min="1"
            value={form.featuredRank || ""}
            onChange={(e) => set("featuredRank", e.target.value)}
            placeholder="1"
          />
        </label>

        <label>
          Descuento (%) – poné 50 para “50% OFF”
          <input
            type="number"
            min="0"
            max="90"
            value={form.discountPercent || ""}
            onChange={(e) => set("discountPercent", e.target.value)}
            placeholder="0"
          />
        </label>

        <label style={{ gridColumn: "span 2" }}>
          Imagen principal (URL)
          <input
            value={form.image}
            onChange={(e) => set("image", e.target.value)}
            placeholder="https://..."
          />
        </label>

        <label style={{ gridColumn: "span 2" }}>
          Imágenes (coma separadas)
          <input
            value={form.images}
            onChange={(e) => set("images", e.target.value)}
            placeholder="https://url1.jpg, https://url2.jpg"
          />
        </label>

        {/* Contenido (ancho completo, ordenado) */}
        <label style={{ gridColumn: "1 / -1" }}>
          Descripción
          <textarea
            rows={5}
            placeholder="Detalles del producto, garantías, usos, etc."
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </label>

        <label style={{ gridColumn: "1 / -1" }}>
          Especificaciones (una por línea)
          <textarea
            rows={5}
            placeholder={"Ej:\nPotencia 100A\nIncluye máscara\nCompatibilidad 220V"}
            value={form.specsText}
            onChange={(e) => set("specsText", e.target.value)}
          />
        </label>
      </div>

      {/* Preview principal */}
      <div>
        <p style={{ margin: "8px 0 6px" }}>
          <strong>Vista previa (principal)</strong>
        </p>
        <div
          style={{
            width: 320,
            aspectRatio: "4 / 3",
            overflow: "hidden",
            borderRadius: 12,
            background: "#0f172a1a",
          }}
        >
          {form.image ? (
            <img
              src={toThumb(form.image, 320, 240)}
              alt="preview"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={(e) => (e.currentTarget.src = FALLBACK)}
            />
          ) : (
            <div style={{ padding: 12, opacity: 0.6 }}>
              Pegá una URL para ver la vista previa
            </div>
          )}
        </div>
      </div>

      {/* Previews galería */}
      <div>
        <p style={{ margin: "8px 0 6px" }}>
          <strong>Vista previa (galería)</strong>
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {gallery.map((u, i) => (
            <div
              key={i}
              style={{
                width: 120,
                aspectRatio: "4/3",
                overflow: "hidden",
                borderRadius: 8,
                background: "#0f172a1a",
              }}
              title={u}
            >
              <img
                src={toThumb(u, 160, 120)}
                alt={`img ${i + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={(e) => (e.currentTarget.src = FALLBACK)}
              />
            </div>
          ))}
          {gallery.length === 0 && (
            <div style={{ padding: 12, opacity: 0.6 }}>
              Agregá URLs separadas por coma para ver miniaturas
            </div>
          )}
        </div>
      </div>

      <button className="btn" disabled={saving}>
        {saving ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
