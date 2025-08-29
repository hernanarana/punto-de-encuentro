import { Link } from "react-router-dom";
import PRODUCTS from "../data/products.js";
import ProductImage from "./ProductImage";

export default function FeaturedList() {
  const destacados = PRODUCTS.filter(p => p.featured).slice(0, 8); // lista más grande

  return (
    <section style={{ display: "grid", gap: 16 }}>
      <h3 style={{ margin: "0 0 8px" }}>⭐ DESTACADOS</h3>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 16
      }}>
        {destacados.map(p => (
          <Link
            key={p.id}
            to={`/producto/${p.id}`}
            style={{
              display: "grid",
              gap: 10,
              padding: 12,
              borderRadius: 12,
              background: "#fff",
              textDecoration: "none",
              color: "#111",
              boxShadow: "0 6px 20px rgba(0,0,0,.06)"
            }}
          >
            <ProductImage product={p} alt={p.title} height={160} />
            <div style={{ fontWeight: 600 }}>{p.title}</div>
            <div style={{ color: "#ff4d4f", fontWeight: 700 }}>
              ${p.price?.toLocaleString("es-AR")}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
