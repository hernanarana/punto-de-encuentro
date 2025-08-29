import { Link } from "react-router-dom";
import ProductImage from "./ProductImage";

export default function ProductCard({ p }) {
  return (
    <article className="card product-card">
      <Link to={`/producto/${p.id}`} className="card__thumb" aria-label={p.title}>
        <ProductImage product={p} alt={p.title} />
      </Link>

      <div className="card__body">
        <Link to={`/producto/${p.id}`} className="card__title">{p.title}</Link>
        <div className="card__rating">{"★".repeat(p.rating || 0)}</div>
        <div className="card__price">${p.price}</div>
        <Link to={`/producto/${p.id}`} className="btn btn--primary">Ver</Link>
      </div>
    </article>
  );
}
