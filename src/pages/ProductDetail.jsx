// src/pages/ProductDetail.jsx
import { useEffect, useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useParams, Link, useNavigate } from "react-router-dom";
import useBreakpoint from "../hooks/useBreakpoint.js";
import SearchBar from "../components/SearchBar.jsx";
import { toSlug } from "../data/firestoreProducts.js";
import { fetchProductBySlugOrId } from "../data/firestoreProducts.js";
import "./productDetail.css"; // asegúrate de tenerlo importado

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

  // estados del panel mobile (no alteran el producto; sirven para navegar/consistencia)
  const [q, setQ] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const [prod, setProd] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const mainRef = useRef(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr("");
    setProd(null);
    setActive(0);
    setZoom(false);

    fetchProductBySlugOrId(id)
      .then((p) => alive && setProd(p))
      .catch((e) => alive && setErr(e.message || "Producto no encontrado"))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [id]);

  const images = useMemo(() => {
    if (!prod) return [];
    const arr = Array.isArray(prod.images) && prod.images.length ? prod.images : [prod.image].filter(Boolean);
    return [...new Set(arr.filter(Boolean))];
  }, [prod]);

  const priceAR = (n) =>
    typeof n === "number"
      ? n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })
      : n;

  // —— Zoom handling (transform-origin hacia el cursor)
  const onMove = (e) => {
    if (!zoom || !mainRef.current) return;
    const rect = mainRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };

  const onKey = (e) => {
    if (!images.length) return;
    if (e.key === "ArrowRight") setActive((i) => (i + 1) % images.length);
    if (e.key === "ArrowLeft") setActive((i) => (i - 1 + images.length) % images.length);
    if (e.key === "Escape") { setZoom(false); setLightboxOpen(false); }
  };

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length]);

  if (loading) return <main className="pd-wrap">Cargando…</main>;
  if (err) {
    return (
      <main className="pd-wrap" style={{ color: "#f87171" }}>
        Error: {err} — <Link to="/" className="pd-link">Volver</Link>
      </main>
    );
  }
  if (!prod) return null;

  return (
    <main className="pd-wrap">
      <div className="pd-grid">
        {/* Galería */}
        <section>
          <div
            className={`pd-main ${zoom ? "is-zoomed" : ""}`}
            ref={mainRef}
            onMouseMove={onMove}
            onMouseLeave={() => setZoom(false)}
          >
            <img
              className="pd-mainimg"
              src={images[active]}
              alt={prod.title}
              loading="eager"
              style={{
                transform: zoom ? "scale(1.9)" : "scale(1)",
                transformOrigin: zoomOrigin,
              }}
              onClick={() => setZoom((z) => !z)}
            />
            {/* Botón lightbox */}
            <button className="pd-lightbox-btn" onClick={() => setLightboxOpen(true)} aria-label="Ver en grande">
              ⤢
            </button>
          </div>

          {images.length > 1 && (
            <div className="pd-thumbs" role="list">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  className={`pd-thumb ${i === active ? "is-active" : ""}`}
                  onClick={() => { setActive(i); setZoom(false); }}
                  role="listitem"
                  aria-label={`Ver imagen ${i + 1}`}
                  title={`Imagen ${i + 1}`}
                >
                  <img src={src} alt={`${prod.title} miniatura ${i + 1}`} loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Info */}
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
            <button className="pd-btn pd-btn--buy">Comprar</button>
            <button className="pd-btn">Agregar al carrito</button>
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

      {/* Lightbox a pantalla completa */}
      {lightboxOpen && (
        <div className="pd-lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="pd-lightbox-close" aria-label="Cerrar">✕</button>
          <img src={images[active]} alt={prod.title} />
          {images.length > 1 && (
            <>
              <button className="pd-lightbox-prev" onClick={(e) => { e.stopPropagation(); setActive((i) => (i - 1 + images.length) % images.length); }}>‹</button>
              <button className="pd-lightbox-next" onClick={(e) => { e.stopPropagation(); setActive((i) => (i + 1) % images.length); }}>›</button>
            </>
          )}
        </div>
      )}

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
                    // Si querés, podés navegar a una ruta de búsqueda:
                    // navigate(`/buscar?q=${encodeURIComponent(q)}`);
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
                  // En detalle no hay grid que actualizar; solo cerramos el menú.
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
