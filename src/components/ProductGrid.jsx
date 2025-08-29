// src/components/ProductGrid.jsx
import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products = [] }) {
  if (!products.length) return <p>No hay productos.</p>;

  return (
    <div className="grid grid--products">
      {products.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
}
