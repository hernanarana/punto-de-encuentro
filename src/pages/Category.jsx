// src/pages/Category.jsx
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate, useLocation, Navigate } from "react-router-dom";
import useBreakpoint from "../hooks/useBreakpoint.js";
import ProductGrid from "../components/ProductGrid.jsx";
import {
  fetchAllProducts,
  fetchProductsByCategory,
  toSlug,
} from "../data/firestoreProducts.js";
import SearchBar from "../components/SearchBar.jsx";

/* ===== utils ===== */
const norm = (s = "") =>
  String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

/* === Categorías fijas (ordenadas) === */
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

const SYNONYMS = {
  heladera: ["heladera", "helad", "refrigerador", "refrig", "freezer", "frio"],
  termotanque: ["termotanque", "calentador de agua", "tanque de agua", "agua caliente"],
  calefon: ["calefon", "calentador instantaneo", "instantaneo"],
  tv: ["tv", "tele", "televisor", "smart tv"],
  lavarropa: ["lavarropa", "lavadora"],
  notebook: ["notebook", "laptop", "portatil"],
};

const textMatches = (q, ...fields) => {
  const qn = norm(q);
  if (!qn) return true;
  const bag = fields.map(norm).join(" ");
  if (bag.includes(qn)) return true;
  for (const [key, variants] of Object.entries(SYNONYMS)) {
    if (variants.some((v) => qn.includes(v) || v.includes(qn))) {
      if (bag.includes(key)) return true;
    }
  }
  return false;
};

const slugToTitle = (slug = "") => {
  const clean = decodeURIComponent(slug).replace(/-/g, " ").trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
};

const toNumberPrice = (v) => {
  if (v == null) return 0;
  let s = String(v).trim().replace(/[^\d.,-]/g, "");
  if (s.includes(",") && s.includes(".")) {
    s = s.replace(/,/g, "");
  } else if (s.includes(",") && !s.includes(".")) {
    const parts = s.split(",");
    s =
      parts.length === 2 && parts[1].length <= 2
        ? parts[0].replace(/\./g, "") + "." + parts[1]
        : s.replace(/,/g, "");
  } else if (!s.includes(",") && s.includes(".")) {
    const parts = s.split(".");
    if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
      s = s.replace(/\./g, "");
    }
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
};

const normalizeRange = (minStr, maxStr) => {
  const hasMin = String(minStr ?? "").trim() !== "";
  const hasMax = String(maxStr ?? "").trim() !== "";
  let min = hasMin ? Number(minStr) : null;
  let max = hasMax ? Number(maxStr) : null;
  if (hasMin && !Number.isFinite(min)) min = null;
  if (hasMax && !Number.isFinite(max)) max = null;
  if (min != null && max != null && min > max) [min, max] = [max, min];
  return { min, max };
};

/* Detección de oferta flexible */
const isOnOfferRaw = (p = {}) => {
  const price = toNumberPrice(p.price);
  const sale = toNumberPrice(p.salePrice);
  const hasSalePrice = sale > 0 && sale < price;

  const text = [p.badge, p.label, Array.isArray(p.tags) ? p.tags.join(" ") : ""]
    .filter(Boolean)
    .join(" ");
  const m = String(text).match(/(\d{1,2})\s*%/);
  const percentFromText = m ? Number(m[1]) : 0;

  const percentFromNumbers =
    hasSalePrice && price > 0 ? Math.round((1 - sale / price) * 100) : 0;

  const discountPercent =
    Number.isFinite(p.discountPercent) && p.discountPercent > 0
      ? p.discountPercent
      : percentFromNumbers || percentFromText;

  return p.onSale === true || discountPercent > 0 || hasSalePrice;
};

/* ===== Estrellas ===== */
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
        data-size={compact ? "sm" : "md"}
      >
        Todas
      </button>
    </div>
  );
}

/* ====== Portal móvil ====== */
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

/* ===== page ===== */
export default function Category() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const title = slugToTitle(slug);
  const slugNorm = norm(title);

  // Permitir que /ofertas (sin slug) funcione igual que /categoria/ofertas
  const pathIsOffers = location.pathname.endsWith("/ofertas");
  const isOffers = pathIsOffers || slugNorm === "ofertas";

  const isDesktop = useBreakpoint("(min-width: 1024px)");
  const isMobile = useBreakpoint("(max-width: 767px)");

  // filtros
  const [q, setQ] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [brand, setBrand] = useState("");
  const [cat, setCat] = useState("");
  const [rating, setRating] = useState("");
  const [minDiscount, setMinDiscount] = useState("");

  // data
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Log mínimo para verificar montaje si hace falta (se puede borrar)
  useEffect(() => {
    console.log("[CATEGORY] mounted", { path: location.pathname, slug, isOffers });
  }, [location.pathname, slug, isOffers]);

  // URL → estado
  useEffect(() => {
    const u = new URLSearchParams(location.search);
    setQ(u.get("q") || "");
    setMin(u.get("min") || "");
    setMax(u.get("max") || "");
    setBrand(u.get("brand") || "");
    setCat(u.get("cat") || "");
    setRating(u.get("rating") || "");
    setMinDiscount(u.get("minDiscount") || "");
  }, [location.search]);

  // carga
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr("");
    (async () => {
      let rows = [];

      if (slugNorm === "" || slugNorm === "todos") {
        rows = await fetchAllProducts();
      } else if (isOffers) {
        const all = await fetchAllProducts();
        rows = (all || []).filter(isOnOfferRaw);
      } else {
        rows = await fetchProductsByCategory(title).catch(() => []);
        if (!rows || rows.length === 0) {
          const all = await fetchAllProducts();
          rows = all.filter((p) => norm(p.category) === slugNorm);
        }
      }

      const uniqueCats = CATEGORIES_NAV.slice();

      if (!alive) return;

      const normalized = (rows || []).map((p) => {
        const priceNum = toNumberPrice(p.price);
        const saleNum = toNumberPrice(p.salePrice);

        const text = [p.badge, p.label, Array.isArray(p.tags) ? p.tags.join(" ") : ""]
          .filter(Boolean)
          .join(" ");
        let percentFromText = 0;
        const m = String(text).match(/(\d{1,2})\s*%/);
        if (m) percentFromText = Number(m[1]);

        const percentFromNumbers =
          saleNum > 0 && priceNum > 0 && saleNum < priceNum
            ? Math.round((1 - saleNum / priceNum) * 100)
            : 0;

        const discountPercent =
          Number.isFinite(p.discountPercent) && p.discountPercent > 0
            ? p.discountPercent
            : percentFromNumbers || percentFromText;

        const onSale =
          p.onSale === true || discountPercent > 0 || (saleNum > 0 && saleNum < priceNum);
        const finalPrice = onSale && saleNum > 0 && saleNum < priceNum ? saleNum : priceNum;

        return {
          id: p.id,
          title: p.title || p.name || "Producto",
          price: priceNum,
          salePrice: saleNum || null,
          discountPercent,
          onSale,
          finalPrice,
          image:
            p.image || (Array.isArray(p.images) ? p.images[0] : "") || "/placeholder.jpg",
          category: p.category || "",
          brand: p.brand || "",
          rating: Number(p.rating || p.stars || 0),
          featured: Boolean(p.featured),
          description: p.description || "",
          ...p,
        };
      });

      setItems(normalized);
      setCategories(uniqueCats);
      setLoading(false);
    })().catch((e) => {
      if (!alive) return;
      setErr(e?.message || "Error al cargar la categoría");
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [slug, title, slugNorm, isOffers]);

  // filtrado
  const listFinal = useMemo(() => {
    let arr = items.slice();

    if (q || brand || cat) {
      arr = arr.filter(
        (p) =>
          textMatches(q, p.title, p.description, p.brand, p.category) &&
          (!brand || norm(p.brand).includes(norm(brand))) &&
          (!cat || norm(p.category).includes(norm(cat)))
      );
    }

    const { min: minN, max: maxN } = normalizeRange(min, max);
    if (minN != null) arr = arr.filter((p) => p.finalPrice >= minN);
    if (maxN != null) arr = arr.filter((p) => p.finalPrice <= maxN);

    const ratingN = Number(rating) || 0;
    if (ratingN > 0) arr = arr.filter((p) => (Number(p.rating) || 0) >= ratingN);

    if (isOffers) {
      const md = Number(minDiscount) || 0;
      arr = arr.filter((p) => p.onSale && (Number(p.discountPercent) || 0) >= md);
    }

    return arr;
  }, [items, q, brand, cat, min, max, rating, isOffers, minDiscount]);

  const clearFilters = () => {
    setQ("");
    setMin("");
    setMax("");
    setBrand("");
    setCat("");
    setRating("");
  };
  const goToCategory = (name) => {
    navigate(`/categoria/${toSlug(name)}`);
    document.querySelector(".side-menu .close")?.click();
  };

  // Permitimos /ofertas sin slug (si no es /ofertas, redirigimos)
  if (!slug && !pathIsOffers) return <Navigate to="/" replace />;

  return (
    <div className="catalog-page" style={{ paddingInline: isDesktop ? 12 : 0 }}>
      <div
        className="catalog-layout"
        style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "280px 1fr" : "1fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        {/* === SIDEBAR (DESKTOP) === */}
        {isDesktop && (
          <aside
            className="filters-card"
            style={{ position: "sticky", top: 84, alignSelf: "start", zIndex: 1, height: "fit-content" }}
          >
            <h3 className="filters-title">
              {slugNorm === "todos" ? "Todos los productos" : isOffers ? "Ofertas" : title}
            </h3>

            <div className="filters-field">
              <label>Buscar</label>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="nombre, marca…" />
            </div>

            <div className="filters-field">
              <label>Precio</label>
              <div className="filters-price">
                <input type="number" placeholder="Mín" value={min} onChange={(e) => setMin(e.target.value)} />
                <input type="number" placeholder="Máx" value={max} onChange={(e) => setMax(e.target.value)} />
              </div>
            </div>

            <div className="filters-field">
              <label>Estrellas</label>
              <StarFilterPro value={rating} onChange={setRating} />
            </div>

            <div className="filters-field">
              <label>Categorías</label>
              <div className="filters-cats">
                <button
                  onClick={() => goToCategory("todos")}
                  className={`chip chip--cat ${slugNorm === "todos" ? "is-active" : ""}`}
                >
                  Todas
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => goToCategory(c)}
                    className={`chip chip--cat ${norm(c) === slugNorm ? "is-active" : ""}`}
                    title={c}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="filters-actions">
              <button onClick={clearFilters} className="btn-ghost">Limpiar</button>
            </div>
          </aside>
        )}

        {/* === PANEL EN MENÚ (MOBILE) === */}
        {isMobile && (
          <MenuPortal>
            <div className="filter-panel">
              <div className="fp-head"><div className="fp-title">Filtros</div></div>

              <div className="fp-body">
                {/* 1) Buscar */}
                <section className="fp-sec">
                  <div className="fp-label">Buscar productos</div>
                  <SearchBar
                    value={q}
                    onChange={setQ}
                    onSubmit={() => {
                      document.querySelector(".side-menu .close")?.click();
                      document.querySelector("section[aria-live='polite']")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  />
                </section>

                {/* 2) Precio */}
                <section className="fp-sec">
                  <div className="fp-label">Precio</div>
                  <div className="fp-row">
                    <input type="number" placeholder="Mín" value={min} onChange={(e) => setMin(e.target.value)} />
                    <input type="number" placeholder="Máx" value={max} onChange={(e) => setMax(e.target.value)} />
                  </div>
                </section>

                {/* 3) Categorías */}
                <section className="fp-sec">
                  <div className="fp-label">Categorías</div>
                  <div className="fp-chips">
                    <button
                      className={`fp-chip ${slugNorm === "todos" ? "is-active" : ""}`}
                      onClick={() => {
                        navigate("/categoria/todos");
                        document.querySelector(".side-menu .close")?.click();
                      }}
                    >
                      Todas
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c}
                        className={`fp-chip ${norm(c) === slugNorm ? "is-active" : ""}`}
                        onClick={() => {
                          navigate(`/categoria/${toSlug(c)}`);
                          document.querySelector(".side-menu .close")?.click();
                        }}
                        title={c}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </section>

                {/* 4) Valoración mínima */}
                <section className="fp-sec">
                  <div className="fp-label">Valoración mínima</div>
                  <StarFilterPro value={rating} onChange={setRating} compact />
                </section>
              </div>

              <div className="fp-actions">
                <button
                  type="button"
                  className="fp-apply"
                  onClick={() => {
                    document.querySelector(".side-menu .close")?.click();
                    document.querySelector("section[aria-live='polite']")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Aplicar
                </button>
                <button type="button" className="fp-clear" onClick={clearFilters}>
                  Limpiar
                </button>
              </div>
            </div>
          </MenuPortal>
        )}

        {/* === CONTENIDO === */}
        <div>
          <h2 style={{ margin: "8px 12px" }}>
            {slugNorm === "todos" ? "Todos los productos" : isOffers ? "Ofertas" : title}
          </h2>

          {err && <p role="alert" style={{ color: "tomato", padding: 12 }}>{err}</p>}

          {loading ? (
            <section><p style={{ opacity: 0.7, padding: 12 }}>Cargando productos…</p></section>
          ) : listFinal.length === 0 ? (
            <section><p style={{ opacity: 0.7, padding: 12 }}>
              {isOffers
                ? "No hay productos en oferta por ahora."
                : `No hay productos para los filtros aplicados${q ? ` (“${q}”)` : ""}.`}
            </p></section>
          ) : (
            <section aria-live="polite">
              <ProductGrid products={listFinal} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
