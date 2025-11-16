// src/pages/ProductDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, Link, useNavigate } from "react-router-dom";

// Hooks y componentes
import useBreakpoint from "../hooks/useBreakpoint.js";
import SearchBar from "../components/SearchBar.jsx";
import ProductGallery from "../components/ProductGallery.jsx";

// Firestore
import { toSlug } from "../data/firestoreProducts.js";
import { fetchProductBySlugOrId } from "../data/firestoreProducts.js";

// 🟢 Carrito por WhatsApp
import { addToWhatsappCart } from "../utils/whatsappCart.js";

// WhatsApp general (lo dejamos opcional)
import { DEFAULT_MSG, PHONE_E164 } from "../config.js";

// CSS
import "./ProductDetail.css";

// 🟢 Toast suave
import { showToast } from "../utils/toast.js";

/* === Categorías fijas para el menú mobile === */
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

/* ===== Lógica para portal del menú mobile ===== */
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

  const [q, setQ] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const [prod, setProd] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  /* === CARGAR PRODUCTO === */
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr("");
    setProd(null);

    fetchProductBySlugOrId(id)
      .then((p) => alive && setProd(p))
      .catch((e) => alive && setErr(e.message || "Producto no encontrado"))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [id]);

  /* === IMÁGENES === */
  const images = useMemo(() => {
    if (!prod) return [];
    const arr = [];
    if (prod.image) arr.push(prod.image);
    if (Array.isArray(prod.images)) arr.push(...prod.images);
    return Array.from(new Set(arr.filter(Boolean)));
  }, [prod]);

  const priceAR = (n) =>
    typeof n === "number"
      ? n.toLocaleString("es-AR", {
          style: "currency",
          currency: "ARS",
          maximumFractionDigits: 0,
        })
      : n;

  /* === CONSULTAR POR WHATSAPP (Directo) === */
  const handleConsult = () => {
    if (!prod) return;

    const url = window.location.href;

    const baseMsg =
      DEFAULT_MSG ||
      'Hola! Vengo desde "Punto de Encuentro" y quisiera hacer una consulta.';

    const text =
      `${baseMsg}\n\n` +
      `Producto: ${prod.title}\n` +
      (prod.price != null ? `Precio: ${priceAR(prod.price)}\n` : "") +
      `Enlace: ${url}`;

    const phone = PHONE_E164 || "5491133619275";

    const wa = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(wa, "_blank", "noopener");
  };

  /* === AGREGAR AL PEDIDO (NO NAVEGA) === */
  const handleAddToWhatsappOrder = () => {
    if (!prod) return;

    addToWhatsappCart(
      {
        id: prod.id || id,
        title: prod.title,
        price: prod.price || 0,
      },
      1
    );

    // Notificar al header / burbuja del carrito
    window.dispatchEvent(new Event("wspCart:updated"));

    // Toast suave (sin alert feo)
    if (typeof showToast === "function") {
      showToast("Producto agregado al pedido 🛒");
    }
  };

  /* === ESTADOS === */
  if (loading) return <main className="pd-wrap">Cargando…</main>;
  if (err) {
    return (
      <main className="pd-wrap" style={{ color: "#f87171" }}>
        Error: {err} — <Link to="/">Volver</Link>
      </main>
    );
  }
  if (!prod) return null;

  /* === RENDER === */
  return (
    <main className="pd-wrap">
      <div className="pd-grid">
        {/* Galería */}
        <section className="product-detail__gallery">
          <ProductGallery images={images} title={prod.title} />
        </section>

        {/* Info */}
        <section className="pd-info">
          <h1 className="pd-title">{prod.title}</h1>

          <div className="pd-badges">
            {prod.brand && <span className="pd-badge">{prod.brand}</span>}
            {prod.featured && (
              <span className="pd-badge pd-badge--feat">Destacado</span>
            )}
            {prod.freeShipping && (
              <span className="pd-badge pd-badge--ship">Envío gratis</span>
            )}
          </div>

          {prod.price != null && (
            <p className="pd-price">{priceAR(prod.price)}</p>
          )}

          {prod.category && (
            <p className="pd-meta">
              Categoría: <strong>{prod.category}</strong>
            </p>
          )}

          {/* === BOTONES === */}
          <div className="pd-actions">
            {/* Directo a WhatsApp */}
            <button
              className="pd-btn pd-btn--consult"
              onClick={handleConsult}
            >
              Consultar por WhatsApp
            </button>

            {/* Agregar al pedido */}
            <button
              className="pd-btn"
              style={{ backgroundColor: "#22c55e" }}
              onClick={handleAddToWhatsappOrder}
            >
              Agregar al pedido
            </button>

            {/* Link al pedido */}
            <Link className="pd-link" to="/pedido-whatsapp">
              Ver pedido
            </Link>

            {/* Volver */}
            <Link className="pd-link" to="/">
              Volver
            </Link>
          </div>

          {/* Descripción */}
          {prod.description && (
            <div className="pd-section">
              <h3>Descripción</h3>
              <p className="pd-desc">{prod.description}</p>
            </div>
          )}

          {/* Specs */}
          {Array.isArray(prod.specs) && prod.specs.length > 0 && (
            <div className="pd-section">
              <h3>Especificaciones</h3>
              <ul className="pd-specs">
                {prod.specs.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>

      {/* Panel filtrado mobile */}
      {isMobile && (
        <MenuPortalPD>
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
                  onSubmit={() =>
                    document.querySelector(".side-menu .close")?.click()
                  }
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
                className="fp-apply"
                onClick={() =>
                  document.querySelector(".side-menu .close")?.click()
                }
              >
                Aplicar
              </button>
              <button
                className="fp-clear"
                onClick={() => {
                  setQ("");
                  setMin("");
                  setMax("");
                }}
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
