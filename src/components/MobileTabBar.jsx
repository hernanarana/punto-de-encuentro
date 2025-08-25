// src/components/MobileTabBar.jsx
import { Link } from "react-router-dom";
import { PHONE_E164, DEFAULT_MSG } from "../config";

export default function MobileTabBar({ onOpenCategories, onOpenSupport }) {
  const wa = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(DEFAULT_MSG || "Hola, quiero hacer una consulta.")}`;

  return (
    <nav className="bottom-tab">
      <Link to="/" className="is-primary" aria-label="Inicio">
        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 3 3 10h2v10h6v-6h2v6h6V10h2L12 3z" fill="currentColor"/></svg>
        <span>Inicio</span>
      </Link>

      <button onClick={onOpenCategories} aria-label="Categorías">
        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 10h16v2H4v-2zm0 6h10v2H4v-2zM4 6h16v2H4V6z" fill="currentColor"/></svg>
        <span>Categorías</span>
      </button>

      <button onClick={onOpenSupport} aria-label="Soporte" className="is-primary">
        <svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 3a7 7 0 0 0-7 7v4a3 3 0 0 0 3 3h1v-6H6v-1a6 6 0 1 1 12 0v1h-3v6h1a3 3 0 0 0 3-3v-4a7 7 0 0 0-7-7z" fill="currentColor"/></svg>
        <span>Soporte</span>
      </button>

      <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <svg width="22" height="22" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="currentColor" opacity=".2"/><path d="M26.88 5.12A13.9 13.9 0 0 0 16 1.5C8.84 1.5 3 7.34 3 14.5c0 2.3.6 4.51 1.76 6.47L3 30.5l9.77-1.71A13.94 13.94 0 0 0 16 27.5c7.16 0 13-5.84 13-13s-2.1-7.77-2.12-7.88Z" fill="currentColor"/></svg>
        <span>WhatsApp</span>
      </a>
    </nav>
  );
}
