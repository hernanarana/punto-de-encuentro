// src/pages/ProductDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, Link, useNavigate } from "react-router-dom";
import useBreakpoint from "../hooks/useBreakpoint.js";
import SearchBar from "../components/SearchBar.jsx";
import { toSlug } from "../data/firestoreProducts.js";
import { fetchProductBySlugOrId } from "../data/firestoreProducts.js";
import ProductGallery from "../components/ProductGallery.jsx";

import "./ProductDetail.css";

/* === Categorías fijas (ordenadas, para el panel mobile) === */
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

/* ===== Portal móvil dentro del menú hamburguesa ===== */
function useMenuTargetPD() {
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
function MenuPortalPD({ children }) {
  const target = useMenuTargetPD();
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

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useBreakpoint("(max-width: 767px)");

  // estados del panel mobile (navegación/consistencia)
  const [q, setQ] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const [prod, setProd] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr("");
    setProd(null);

    fetchProductBySlugOrId(id)
      .then((p) => alive && setProd(p))
      .catch((e) => alive && setErr(e.message || "Producto no encontrado"))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [id]);

  // construir array de imágenes (principal + extras) sin duplicados
  const images = useMemo(() => {
    if (!prod) return [];
    const arr = [];
    if (prod.image) arr.push(prod.image);
    if (Array.isArray(prod.images)) arr.push(...prod.images);
    return Array.from(new Set(arr.filter(Boolean)));
  }, [prod]);

  const priceAR = (n) =>
    typeof n === "number"
      ? n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })
      : n;

  /* === CONSULTAR POR WHATSAPP === */
  const handleConsult = () => {
    if (!prod) return;
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `¡Hola! Quiero consultar por: ${prod.title}\n${url}`;

    // Si querés setear un número fijo, creá VITE_WHATSAPP_PHONE en .env (solo dígitos, ej: 5491122334455)
    const phone = (import.meta.env.VITE_WHATSAPP_PHONE || "").replace(/[^\d]/g, "");

    const wa = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;

    window.open(wa, "_blank", "noopener");
  };

  if (loading) return <main className="pd-wrap">Cargando…</main>;
  if (err) {
    return (
      <main className="pd-wrap" style={{ color: "#f87171" }}>
        Error: {err} — <Link className="pd-link" to="/">Volver</Link>
      </main>
    );
  }
  if (!prod) return null;

  return (
    <main className="pd-wrap">
      <div className="pd-grid">
        {/* ===== Galería (con zoom, thumbs y lightbox) ===== */}
        <section className="product-detail__gallery">
          <ProductGallery images={images} title={prod.title || "Producto"} />
        </section>

        {/* ===== Info ===== */}
        <section className="pd-info">
          <h1 className="pd-title">{prod.title}</h1>

          <div className="pd-badges">
            {prod.brand && <span className="pd-badge">{prod.brand}</span>}
            {prod.featured && <span className="pd-badge pd-badge--feat">Destacado</span>}
            {prod.freeShipping && <span className="pd-badge pd-badge--ship">Envío gratis</span>}
          </div>

          {prod.price != null && <p className="pd-price">{priceAR(prod.price)}</p>}

          {prod.category && (
            <p className="pd-meta">
              Categoría: <strong>{prod.category}</strong>
            </p>
          )}

          <div className="pd-actions">
            <button className="pd-btn pd-btn--consult" onClick={handleConsult}>
              Consultar por WhatsApp
            </button>
            <Link className="pd-link" to="/">Volver</Link>
          </div>

          {prod.description && (
            <div className="pd-section">
              <h3>Descripción</h3>
              <p className="pd-desc">{prod.description}</p>
            </div>
          )}

          {Array.isArray(prod.specs) && prod.specs.length > 0 && (
            <div className="pd-section">
              <h3>Especificaciones</h3>
              <ul className="pd-specs">
                {prod.specs.map((s, idx) => <li key={idx}>{s}</li>)}
              </ul>
            </div>
          )}
        </section>
      </div>

      {/* ===== Panel de filtros en el menú hamburguesa (SOLO mobile) ===== */}
      {isMobile && (
        <MenuPortalPD>
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
                  }}
                />
              </section>

              {/* 2) Precio */}
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

              {/* 3) Categorías */}
              <section className="fp-sec">
                <div className="fp-label">Categorías</div>
                <div className="fp-chips">
                  <button
                    className="fp-chip"
                    onClick={() => {
                      navigate("/categoria/todos");
                      document.querySelector(".side-menu .close")?.click();
                    }}
                  >
                    Todas
                  </button>
                  {CATEGORIES_NAV.map((c) => (
                    <button
                      key={c}
                      className="fp-chip"
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
            </div>

            <div className="fp-actions">
              <button
                type="button"
                className="fp-apply"
                onClick={() => {
                  document.querySelector(".side-menu .close")?.click();
                }}
              >
                Aplicar
              </button>
              <button
                type="button"
                className="fp-clear"
                onClick={() => { setQ(""); setMin(""); setMax(""); }}
              >
                Limpiar
              </button>
            </div>
          </div>
        </MenuPortalPD>
      )}
    </main>
  );
}
