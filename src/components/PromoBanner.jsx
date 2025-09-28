// src/components/PromoBanner.jsx
import { Link } from "react-router-dom";
import "./promo.css";

export default function PromoBanner(){
  return (
    <Link
      to="/categoria/ofertas"
      className="promo-banner"
      role="button"
      aria-label="Ver productos con descuento"
      title="Ver productos con descuento"
    >
      <div className="promo-title">50% DESCUENTO</div>
      <div className="promo-sub">¡Sólo por este mes en productos seleccionados!</div>
    </Link>
  );
}
