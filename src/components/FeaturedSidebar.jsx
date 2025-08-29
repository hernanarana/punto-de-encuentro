import { Link } from "react-router-dom";
import PRODUCTS from "../data/products.js";
import ProductImage from "./ProductImage.jsx"; // si no lo tenés, reemplazá por <img .../>

export default function FeaturedSidebar() {
  const destacados = PRODUCTS.filter(p => p.featured).slice(0, 8);
  if (!destacados.length) return null;

  return (
    <aside className="featured-aside desktop-only" aria-labelledby="featured-title">
      <h3 id="featured-title" className="featured-title">⭐ DESTACADOS</h3>

      <ul className="featured-list">
        {destacados.map((p) => (
          <li key={p.id} className="featured-item">
            <Link to={`/producto/${p.id}`} className="featured-card">
              <div className="featured-thumb">
                {/* Si no tenés ProductImage, usá:
                  <img src={p.image || p.images?.[0] || "/productos/placeholder.jpg"} alt={p.title} loading="lazy" />
                */}
                <ProductImage product={p} alt={p.title} height={80} />
              </div>

              <div className="featured-info">
                <span className="featured-name">{p.title}</span>
                <span className="featured-price">
                  {typeof p.price === "number" ? `$${p.price.toLocaleString("es-AR")}` : p.price}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
