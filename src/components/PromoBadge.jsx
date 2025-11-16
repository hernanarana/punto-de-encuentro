// src/components/PromoBadge.jsx
import { useState } from "react";

export default function PromoBadge() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <aside className="promo-badge" role="status" aria-live="polite">
      <strong>¡Hasta 50% OFF este mes!</strong>
      <span className="promo-sub">En productos seleccionados</span>
      <button className="promo-close" onClick={()=>setVisible(false)} aria-label="Cerrar">×</button>
    </aside>
  );
}
