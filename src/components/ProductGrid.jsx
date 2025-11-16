// src/components/ProductGrid.jsx
import React from "react";
import { Link } from "react-router-dom";

const PLACEHOLDER = "/productos/placeholder.jpg";

const fmt = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);

function pickImage(p) {
  return (
    p.image ||
    p.img ||
    p.thumbnail ||
    (Array.isArray(p.images) ? p.images[0] : null) ||
    PLACEHOLDER
  );
}

function stars(n = 0) {
  const s = Math.max(0, Math.min(5, Math.round(n)));
  return "★".repeat(s) + "☆".repeat(5 - s);
}

export default function ProductGrid({ products = [] }) {
  // 👉 Home ya aplica filtros; acá solo renderizamos lo recibido.
  if (!products || products.length === 0) {
    return (
      <div
        style={{
          color: "#fff",
          opacity: 0.9,
          padding: 12,
          border: "1px solid #334155",
          borderRadius: 8,
        }}
      >
        Sin productos para mostrar.
      </div>
    );
  }

  return (
    <div className="grid grid--products">
      {products.map((p, idx) => {
        const id = p.slug ?? p.id ?? idx;
        const href = `/producto/${id}`;
        const name = p.title || p.name || `Producto ${id}`;
        const priceNum = Number(p.price ?? p.precio ?? 0);
        const imgSrc = pickImage(p);
        const rating = Number(p.rating ?? p.stars ?? 0);

        return (
          <article key={id} className="card product-card">
            <Link to={href} className="card__thumb" aria-label={`Ver ${name}`}>
              <img
                src={imgSrc}
                alt={name}
                loading="lazy"
                onError={(e) => {
                  if (e.currentTarget.src !== window.location.origin + PLACEHOLDER) {
                    e.currentTarget.src = PLACEHOLDER;
                  }
                }}
              />
              {p.featured && <span className="badge--featured">Destacado</span>}
            </Link>

            <div className="card__body">
              <Link to={href} className="card__title">
                {name}
              </Link>

              <div className="card__rating" aria-label={`${rating} de 5`}>
                {stars(rating)}
              </div>

              <div className="card__price">{fmt(priceNum)}</div>

              <div style={{ marginTop: 8 }}>
                <Link to={href} className="btn btn--primary" style={{ width: "100%" }}>
                  Ver
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
