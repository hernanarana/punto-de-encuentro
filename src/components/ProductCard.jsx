// src/components/ProductCard.jsx
import { Link } from "react-router-dom";
import { assetOrUrl } from "../utils/asset";

export default function ProductCard({ product = {} }) {
  const {
    id,
    title,
    name,
    price,
    rating,
    image,
    img,
    photo,
    picture,
    src,
  } = product;

  // intentamos detectar el campo de imagen
  let imgCandidate = image || img || photo || picture || src || "";
  // si viene solo el nombre (sin "/"), asumimos carpeta /public/productos
  if (imgCandidate && !imgCandidate.includes("/")) {
    imgCandidate = `productos/${imgCandidate}`;
  }
  const imgSrc = assetOrUrl(imgCandidate);

  const displayName = title || name || "Producto";
  const displayPrice = typeof price === "number" ? price : 0;
  const displayRating = rating || 0;

  return (
    <article className="product-card">
      <Link to={`/producto/${id ?? displayName.replace(/\s+/g, "-").toLowerCase()}`} className="product-thumb">
        <img
          src={imgSrc}
          alt={displayName}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = assetOrUrl("productos/placeholder.jpg"); }}
        />
      </Link>

      <h3 className="product-title">{displayName}</h3>

      <div className="product-meta">
        <div className="product-rating">{"★".repeat(displayRating)}{"☆".repeat(5 - displayRating)}</div>
        <div className="product-price">{displayPrice === 0 ? "$0" : `$${displayPrice.toLocaleString("es-AR")}`}</div>
      </div>

      <Link to={`/producto/${id ?? displayName}`} className="btn btn-primary">
        Ver
      </Link>
    </article>
  );
}
