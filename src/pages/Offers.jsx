import { useEffect, useState } from "react";
import { fetchOffers } from "../data/firestoreProducts.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Offers() {
  const [items, setItems] = useState([]);
  useEffect(() => { fetchOffers().then(setItems); }, []);
  return (
    <section className="products-grid">
      {items.map(p => <ProductCard key={p.id} product={p} />)}
    </section>
  );
}
