// src/pages/ProductDetail.jsx
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PRODUCTS from "../data/products.js";
import { assetOrUrl } from "../utils/asset.js";

export default function ProductDetail() {
  const { id } = useParams();

  // Busca por id o por slug (por si más adelante usás slugs)
  const product = useMemo(() => {
    return PRODUCTS.find(
      (p) => String(p.id) === String(id) || String(p.slug) === String(id)
    );
  }, [id]);

  if (!product) {
    return (
      <div className="container">
        <p style={{ margin: "24px 0" }}>
          Producto no encontrado.{" "}
          <Link to="/" className="btn btn--link">
            Volver al inicio
          </Link>
        </p>
      </div>
    );
  }

  // Normalizo imágenes: si hay array uso ese; si no, uso image; si no, placeholder
  const images = (product.images && product.images.length
    ? product.images
    : [product.image || "productos/placeholder.jpg"]
  ).map((src) => assetOrUrl(src));

  const [idx, setIdx] = useState(0);
  const mainImg = images[Math.min(idx, images.length - 1)];

  const price = Number(product.price || 0).toLocaleString("es-AR");
  const rating = Number(product.rating || 0);
  const reviews = Number(product.reviews || 0);

  return (
    <div className="container">
      {/* ---------- Breadcrumb ---------- */}
      <nav className="breadcrumb" aria-label="breadcrumb">
        <Link to="/">Inicio</Link> /{" "}
        <Link to={`/categoria/${product.category || "categoria"}`}>
          {product.category || "Categoría"}
        </Link>{" "}
        / <strong>{product.title}</strong>
      </nav>

      {/* ---------- Hero (media | info | aside) ---------- */}
      <section className="product-hero">
        {/* MEDIA */}
        <div className="product-hero__media">
          <div className="product-detail__image">
            <img
              src={mainImg}
              alt={product.title}
              onError={(e) => {
                e.currentTarget.src = "/productos/placeholder.jpg";
              }}
            />
          </div>

          {/* Miniaturas si hay más de una */}
          {images.length > 1 && (
            <div className="pd-thumbs">
              {images.map((src, i) => (
                <button
                  key={i}
                  className="pd-thumb"
                  onClick={() => setIdx(i)}
                  style={{
                    outline: i === idx ? "2px solid #0aa1dd" : "none",
                    padding: 0,
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  aria-label={`Imagen ${i + 1}`}
                >
                  <img src={src} alt={`Vista ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="product-hero__info">
          <h1 className="product-hero__title">{product.title}</h1>
          <p className="product-hero__meta">
            {"★".repeat(rating)}{" "}
            <span style={{ color: "#64748b" }}>({reviews})</span>
          </p>

          <div className="product-hero__price">${price}</div>

          <div className="product-hero__actions">
            <button className="btn btn--primary">Agregar al carrito</button>
            <a
              className="btn btn--whatsapp"
              href={`https://wa.me/5491112345678?text=${encodeURIComponent(
                `Hola, quisiera más info sobre "${product.title}".`
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              Consultar por WhatsApp
            </a>
          </div>

          <button
            className="btn btn--link"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("pd-desc");
              el?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            Ver descripción
          </button>

          {/* Descripción y características */}
          <section id="pd-desc" className="product-detail__body">
            <div>
              <h2>Descripción</h2>
              <p>{product.description || "Descripción no disponible."}</p>
            </div>

            <div>
              <h2>Características</h2>
              <ul className="ul-clean">
                {(product.features && product.features.length
                  ? product.features
                  : ["Beneficio 1", "Beneficio 2"]
                ).map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* ASIDE (beneficios/descuentos) - solo desktop (el CSS lo esconde en mobile) */}
        <aside className="pd-aside">
          <div className="pd-card">
            <h4>Descuentos</h4>
            <div className="pd-badge pd-badge--off">10% OFF · Transferencia</div>
            <p style={{ margin: "8px 0 0", color: "#475569" }}>
              Pagando con transferencia bancaria.
            </p>
          </div>

          <div className="pd-card">
            <h4>Medios de pago</h4>
            <div className="pd-badge pd-badge--cuotas">3 y 6 cuotas</div>
            <p style={{ margin: "8px 0 0", color: "#475569" }}>
              Con tarjetas seleccionadas.
            </p>
          </div>

          <div className="pd-card">
            <h4>Envíos</h4>
            <div className="pd-badge pd-badge--envio">¡Envío gratis!</div>
            <p style={{ margin: "8px 0 0", color: "#475569" }}>
              A partir de $50.000 en CABA/GBA.
            </p>
          </div>
        </aside>
      </section>

      {/* CTA fija inferior para mobile */}
      <div className="pd-cta">
        <button className="btn btn--primary">Agregar al carrito</button>
        <a
          className="btn btn--whatsapp"
          href={`https://wa.me/5491112345678?text=${encodeURIComponent(
            `Hola, quisiera más info sobre "${product.title}".`
          )}`}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
