// src/components/PromoBar.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PromoBar() {
  const [open, setOpen] = useState(() => sessionStorage.getItem("promo-closed") !== "1");

  useEffect(() => {
    if (!open) sessionStorage.setItem("promo-closed", "1");
  }, [open]);

  if (!open) return null;

  return (
    <div className="promo-bar" role="region" aria-label="Promoción">
      <div className="promo-bar__inner">
        <Link to="/ofertas" className="promo-bar__link">
          <strong>50% DESCUENTO</strong>
          <span>¡Sólo por este mes en productos seleccionados!</span>
        </Link>
        <button className="promo-bar__close" onClick={() => setOpen(false)} aria-label="Cerrar promoción">✕</button>
      </div>
    </div>
  );
}
