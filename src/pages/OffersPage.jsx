// src/pages/OffersPage.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Proxy seguro para /ofertas:
 * - Evita problemas de <Navigate/> en el primer render (prod).
 * - Conserva el querystring; si no hay, usa ?minDiscount=50.
 */
export default function OffersPage() {
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    const qs = loc.search && loc.search !== "?" ? loc.search : "?minDiscount=50";
    nav(`/categoria/ofertas${qs}`, { replace: true });
  }, []); // una sola vez

  return null; // no hace parpadeo
}
