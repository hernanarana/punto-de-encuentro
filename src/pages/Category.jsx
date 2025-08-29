// src/pages/Category.jsx
import { useParams } from "react-router-dom";
import PRODUCTS from "../data/products";
import ProductGrid from "../components/ProductGrid";

export default function Category() {
  const { slug } = useParams();
  const list = PRODUCTS.filter(p => (p.category || "").toLowerCase() === slug);

  return (
    <div className="container">
      <nav className="breadcrumb">
        <a href="/">Inicio</a> / <span style={{ textTransform: "capitalize" }}>{slug}</span>
      </nav>
      <h1 style={{ marginTop: 0, textTransform: "capitalize" }}>{slug}</h1>
      <ProductGrid products={list} />
    </div>
  );
}
