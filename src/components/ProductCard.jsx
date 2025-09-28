// src/components/ProductCard.jsx
import { Link } from "react-router-dom";

function formatAR(v) {
  const n = Number(v || 0);
  return n.toLocaleString("es-AR");
}

export default function ProductCard(props) {
  const item = props.product ?? props.p ?? {};
  const {
    id,
    title = "Producto",
    price = 0,
    image,
    images,
    discountPercent = 0,
  } = item;

  const imgSrc = image || (Array.isArray(images) ? images[0] : "") || "/placeholder.jpg";
  const pct = Number(discountPercent || 0);
  const finalPrice = pct > 0 ? Math.round((price || 0) * (1 - pct / 100)) : price;

  return (
    <article
      className="card product-card"
      style={{
        borderRadius: 12,
        background: "#0f172a",
        color: "#fff",
        padding: 10,
        boxShadow: "0 8px 20px rgba(0,0,0,.25)",
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "4 / 3",
          borderRadius: 10,
          overflow: "hidden",
          position: "relative",
          background: "#111827",
        }}
      >
        {pct > 0 && (
          <span
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              padding: "4px 8px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              background: "#16a34a",
              color: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,.25)",
            }}
          >
            -{pct}%
          </span>
        )}

        <img
          src={imgSrc}
          alt={title}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>

      <h3
        title={title}
        style={{
          fontSize: 14,
          margin: "10px 6px 6px",
          lineHeight: 1.25,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {title}
      </h3>

      <div style={{ margin: "0 6px 8px" }}>
        {pct > 0 ? (
          <>
            <div style={{ textDecoration: "line-through", opacity: 0.65 }}>
              ${formatAR(price)}
            </div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>
              ${formatAR(finalPrice)}
            </div>
          </>
        ) : (
          <div style={{ fontWeight: 800, fontSize: 16 }}>
            ${formatAR(price)}
          </div>
        )}
      </div>

      <div style={{ margin: "0 6px 4px" }}>
        <Link
          className="btn"
          to={`/producto/${encodeURIComponent(id)}`}
          style={{
            display: "inline-block",
            width: "100%",
            textAlign: "center",
            padding: "10px 12px",
            borderRadius: 8,
            textDecoration: "none",
            background: "#0ea5e9",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          Ver
        </Link>
      </div>
    </article>
  );
}
