// src/pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useBreakpoint from "../hooks/useBreakpoint.js";
import ProductGrid from "../components/ProductGrid.jsx";
import { fetchAllProducts, toSlug } from "../data/firestoreProducts.js";
import { readSearchParams } from "../lib/searchParams.js";

/* norm */
const norm = (s = "") =>
  String(s).normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

/* price */
const toNumberPrice = (v) => {
  if (v == null) return 0;
  let s = String(v).trim().replace(/[^\d.,-]/g, "");
  if (s.includes(",") && s.includes(".")) s = s.replace(/,/g, "");
  else if (s.includes(",") && !s.includes(".")) {
    const [a, b] = s.split(",");
    s = b && b.length <= 2 ? a.replace(/\./g, "") + "." + b : s.replace(/,/g, "");
  } else if (!s.includes(",") && s.includes(".")) {
    const p = s.split(".");
    if (p.length > 2 || (p.length === 2 && p[1].length === 3)) s = s.replace(/\./g, "");
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
};

/* cats */
const CATEGORIES_NAV = [
  "Indumentaria","Ferretería","Tecnología","Hogar",
  "Electrodomésticos","Herramientas","Jardinería","Ofertas",
];

/* Star icon */
function Star({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        d="M12 17.3l-5.4 3.3 1.5-6.1-4.7-4.1 6.2-.5L12 4l2.4 5.9 6.2.5-4.7 4.1 1.5 6.1z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/* rating */
function StarFilterPro({ value, onChange }) {
  const current = Number(value) || 0;
  const set = (n) => onChange(current === n ? "" : String(n));
  const is = (n) => (current >= n ? "is-active" : "");

  return (
    <div className="rating-filter">
      {[5,4,3,2,1].map((n) => (
        <button
          key={n}
          className={`chip chip--rating ${is(n)}`}
          onClick={() => set(n)}
          aria-pressed={current >= n}
        >
          {Array.from({ length: n }).map((_, i) => <Star key={i} filled />)}
        </button>
      ))}
      <button className={`chip chip--ghost ${current === 0 ? "is-active" : ""}`} onClick={() => onChange("")}>
        Todas
      </button>
    </div>
  );
}

/* ===== Home ===== */
export default function Home() {
  const isDesktop = useBreakpoint("(min-width: 1024px)");
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  /* state */
  const [q, setQ]       = useState("");
  const [cat, setCat]   = useState("");
  const [min, setMin]   = useState("");
  const [max, setMax]   = useState("");
  const [rating, setRating] = useState("");

  /* sync URL */
  useEffect(() => {
    const s = readSearchParams(sp.toString());
    setQ(s.q || ""); setCat(s.cat || ""); setMin(s.min || ""); setMax(s.max || ""); setRating(s.rating || "");
  }, [sp]);

  /* data */
  const [items, setItems] = useState([]);
  const [categories] = useState(CATEGORIES_NAV);
  const [loading, setLoading] = useState(true);

  /* fetch */
  useEffect(() => {
    let alive = true;
    (async () => {
      const all = await fetchAllProducts();
      if (!alive) return;
      setItems((all || []).map((p) => ({
        id: p.id,
        title: p.title || "Producto",
        description: p.description || "",
        price: toNumberPrice(p.price),
        image: p.image || (Array.isArray(p.images) ? p.images[0] : "") || "/placeholder.jpg",
        category: p.category || "",
        brand: p.brand || "",
        rating: Number(p.rating || p.stars || 0),
        ...p,
      })));
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  /* filter */
  const list = useMemo(() => {
    let arr = items.slice();
    if (q) arr = arr.filter((p) => norm(p.title + p.description + p.brand + p.category).includes(norm(q)));
    if (min !== "" && Number(min)) arr = arr.filter((p) => p.price >= Number(min));
    if (max !== "" && Number(max)) arr = arr.filter((p) => p.price <= Number(max));
    if (rating) arr = arr.filter((p) => (Number(p.rating) || 0) >= Number(rating));
    if (cat) arr = arr.filter((p) => norm(p.category) === norm(cat));
    return arr;
  }, [items, q, min, max, rating, cat]);

  /* clear */
  const clear = () => {
    setQ(""); setCat(""); setMin(""); setMax(""); setRating("");
    navigate("/", { replace: false });
  };

  return (
    <div className="catalog-page home-fade">
      <div className="catalog-layout">
        
        {isDesktop && (
          <aside className="filters-card animated-card">
            {/* title */}
            <h3 className="filters-title">Filtros</h3>

            {/* search */}
            <div className="filters-field">
              <label>Buscar</label>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="nombre, marca…" />
            </div>

            {/* price */}
            <div className="filters-field">
              <label>Precio</label>
              <div className="filters-price">
                <input type="number" placeholder="Mín" value={min} onChange={(e) => setMin(e.target.value)} />
                <input type="number" placeholder="Máx" value={max} onChange={(e) => setMax(e.target.value)} />
              </div>
            </div>

            {/* stars */}
            <div className="filters-field">
              <label>Estrellas</label>
              <StarFilterPro value={rating} onChange={setRating} />
            </div>

            {/* categories */}
            <div className="filters-field">
              <label>Categorías</label>
              <div className="filters-cats">
                {categories.map((c) => (
                  <button key={c} className="chip chip--cat" onClick={() => navigate(`/categoria/${toSlug(c)}`)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* reset */}
            <div className="filters-actions">
              <button className="btn-ghost" onClick={clear}>Limpiar</button>
            </div>
          </aside>
        )}

        <div id="home-grid">
          {loading
            ? <p className="home-loading">Cargando productos…</p>
            : <ProductGrid products={list} />
          }
        </div>
      </div>
    </div>
  );
}
