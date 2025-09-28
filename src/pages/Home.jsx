// src/pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import useBreakpoint from "../hooks/useBreakpoint.js";
import ProductGrid from "../components/ProductGrid.jsx";
import { fetchAllProducts, toSlug } from "../data/firestoreProducts.js";
import SearchBar from "../components/SearchBar.jsx";

/* ===== utils breves ===== */
const norm = (s = "") =>
  String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
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

/* === Categorías fijas para los filtros (ordenadas) === */
const CATEGORIES_NAV = [
  "Indumentaria",
  "Ferretería",
  "Tecnología",
  "Hogar",
  "Electrodomésticos",
  "Herramientas",
  "Jardinería",
  "Ofertas",
];

/* ===== Estrellas (solo íconos) ===== */
function Star({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 17.3l-5.4 3.3 1.5-6.1-4.7-4.1 6.2-.5L12 4l2.4 5.9 6.2.5-4.7 4.1 1.5 6.1z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function StarFilterPro({ value, onChange, compact = false }) {
  const current = Number(value) || 0;
  const set = (n) => onChange(current === n ? "" : String(n));
  const cls = (n) => "chip chip--rating " + (current >= n ? "is-active" : "");
  return (
    <div className="rating-filter" role="group" aria-label="Filtrar por estrellas">
      {[5, 4, 3, 2, 1].map((n) => (
        <button
          key={n}
          type="button"
          className={cls(n)}
          aria-pressed={current >= n}
          onClick={() => set(n)}
          data-size={compact ? "sm" : "md"}
          title={`${n} estrellas o más`}
        >
          <span className="stars" aria-hidden="true">
            {Array.from({ length: n }).map((_, i) => (
              <Star key={i} filled />
            ))}
          </span>
        </button>
      ))}
      <button
        type="button"
        className={"chip chip--ghost " + (current === 0 ? "is-active" : "")}
        onClick={() => onChange("")}
      >
        Todas
      </button>
    </div>
  );
}

/* ===== Portal móvil dentro del menú hamburguesa ===== */
function useMenuTarget() {
  const [target, setTarget] = useState(null);
  useEffect(() => {
    const find = () => {
      const el =
        document.querySelector(".side-menu.is-open .side-menu__body") ||
        document.querySelector(".side-menu .side-menu__body");
      setTarget(el || null);
    };
    find();
    const mo = new MutationObserver(find);
    mo.observe(document.body, { childList: true, subtree: true });
    const iv = setInterval(find, 250);
    return () => {
      mo.disconnect();
      clearInterval(iv);
    };
  }, []);
  return target;
}
function MenuPortal({ children }) {
  const target = useMenuTarget();
  useEffect(() => {
    if (!target) return;
    document.body.setAttribute("data-filter-mounted", "1");
    target.classList.add("with-filter-panel");
    const side = target.closest(".side-menu");
    side?.classList.add("menu-has-filter");
    return () => {
      target.classList.remove("with-filter-panel");
      side?.classList.remove("menu-has-filter");
      document.body.removeAttribute("data-filter-mounted");
    };
  }, [target]);
  if (!target) return null;
  return createPortal(children, target);
}

/* ===== Home ===== */
export default function Home() {
  const isDesktop = useBreakpoint("(min-width: 1024px)");
  const isMobile = useBreakpoint("(max-width: 767px)");
  const navigate = useNavigate();

  // filtros
  const [q, setQ] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [rating, setRating] = useState("");

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const all = await fetchAllProducts();
      if (!alive) return;
      const normalized = (all || []).map((p) => ({
        id: p.id,
        title: p.title || p.name || "Producto",
        description: p.description || "",
        price: toNumberPrice(p.price),
        image:
          p.image || (Array.isArray(p.images) ? p.images[0] : "") || "/placeholder.jpg",
        category: p.category || "",
        brand: p.brand || "",
        rating: Number(p.rating || p.stars || 0),
        ...p,
      }));
      setItems(normalized);
      setCategories(CATEGORIES_NAV.slice()); // lista fija
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const list = useMemo(() => {
    let arr = items.slice();
    if (q) {
      const qn = norm(q);
      arr = arr.filter((p) =>
        (p.title + p.description + p.brand + p.category)
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(qn)
      );
    }
    const minN = min === "" ? null : Number(min);
    const maxN = max === "" ? null : Number(max);
    if (minN != null && Number.isFinite(minN)) arr = arr.filter((p) => p.price >= minN);
    if (maxN != null && Number.isFinite(maxN)) arr = arr.filter((p) => p.price <= maxN);
    const r = Number(rating) || 0;
    if (r > 0) arr = arr.filter((p) => (Number(p.rating) || 0) >= r);
    return arr;
  }, [items, q, min, max, rating]);

  const clear = () => {
    setQ("");
    setMin("");
    setMax("");
    setRating("");
  };
  const goToCategory = (name) => {
    navigate(`/categoria/${toSlug(name)}`);
    document.querySelector(".side-menu .close")?.click(); // cierra menú en mobile
  };
  const applyAndClose = () => {
    document.querySelector(".side-menu .close")?.click(); // cierra menú
    // opcional: scrollear al grid
    document.getElementById("home-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="catalog-page"
      style={{
        paddingInline: isDesktop ? 12 : 0,
        overflow: "visible", // evita romper sticky
      }}
    >
      <div
        className="catalog-layout"
        style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "280px 1fr" : "1fr",
          gap: 16,
          alignItems: "start", // requerido por sticky
          overflow: "visible",
        }}
      >
        {isDesktop && (
          <aside
            className="filters-card"
            style={{
              position: "sticky", // fija al hacer scroll
              top: 84,            // igual que Category
              alignSelf: "start",
              zIndex: 1,
              height: "fit-content",
            }}
          >
            <h3 className="filters-title">Filtros</h3>

            <div className="filters-field">
              <label>Buscar</label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="nombre, marca…"
              />
            </div>

            <div className="filters-field">
              <label>Precio</label>
              <div className="filters-price">
                <input
                  type="number"
                  placeholder="Mín"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Máx"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                />
              </div>
            </div>

            <div className="filters-field">
              <label>Estrellas</label>
              <StarFilterPro value={rating} onChange={setRating} />
            </div>

            <div className="filters-field">
              <label>Categorías</label>
              <div className="filters-cats">
                {/* si querés mostrar "Todas" también en Home, descomenta: */}
                {/* <button onClick={()=>navigate('/categoria/todos')} className="chip chip--cat">Todas</button> */}
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => navigate(`/categoria/${toSlug(c)}`)}
                    className="chip chip--cat"
                    title={c}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="filters-actions">
              <button className="btn-ghost" onClick={clear}>
                Limpiar
              </button>
            </div>
          </aside>
        )}

        {/* ===== Panel de filtros inyectado en el menú hamburguesa (solo mobile) ===== */}
        {isMobile && (
          <MenuPortal>
            <div className="filter-panel">
              <div className="fp-head">
                <div className="fp-title">Filtros</div>
              </div>
              <div className="fp-body">
                <section className="fp-sec">
                  <div className="fp-label">Buscar productos</div>
                  <SearchBar
                    value={q}
                    onChange={setQ}
                    onSubmit={applyAndClose}
                  />
                </section>

                <section className="fp-sec">
                  <div className="fp-label">Precio</div>
                  <div className="fp-row">
                    <input
                      type="number"
                      placeholder="Mín"
                      value={min}
                      onChange={(e) => setMin(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Máx"
                      value={max}
                      onChange={(e) => setMax(e.target.value)}
                    />
                  </div>
                </section>

                <section className="fp-sec">
                  <div className="fp-label">Valoración mínima</div>
                  <StarFilterPro value={rating} onChange={setRating} compact />
                </section>

                <section className="fp-sec">
                  <div className="fp-label">Categorías</div>
                  <div className="fp-chips">
                    {/* Ir a “Todas” desde menú móvil */}
                    <button
                      className="fp-chip"
                      onClick={() => goToCategory("todos")}
                    >
                      Todas
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c}
                        className="fp-chip"
                        onClick={() => goToCategory(c)}
                        title={c}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              <div className="fp-actions">
                <button type="button" className="fp-apply" onClick={applyAndClose}>
                  Aplicar
                </button>
                <button type="button" className="fp-clear" onClick={clear}>
                  Limpiar
                </button>
              </div>
            </div>
          </MenuPortal>
        )}

        <div id="home-grid">
          {loading ? (
            <p style={{ opacity: 0.7, padding: 12 }}>Cargando productos…</p>
          ) : (
            <ProductGrid products={list} />
          )}
        </div>
      </div>
    </div>
  );
}
