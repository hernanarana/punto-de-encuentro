// src/components/MobileTabBar.jsx
import { Link } from "react-router-dom";
import { FiHome, FiList, FiHeadphones, FiMessageCircle } from "react-icons/fi";

export default function MobileTabBar() {
  return (
    <nav className="tabbar mobile-only" aria-label="Navegación inferior">
      <Link to="/" className="tabbar__btn" aria-label="Inicio">
        <FiHome size={20} />
        <span>Inicio</span>
      </Link>

      <button
        className="tabbar__btn"
        onClick={() => window.dispatchEvent(new Event("open-categories"))}
        aria-label="Categorías"
      >
        <FiList size={20} />
        <span>Categorías</span>
      </button>

      <button
        className="tabbar__btn"
        onClick={() => window.dispatchEvent(new Event("open-support"))}
        aria-label="Soporte"
      >
        <FiHeadphones size={20} />
        <span>Soporte</span>
      </button>

      <a
        className="tabbar__btn"
        href="https://wa.me/5491112345678"
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
      >
        <FiMessageCircle size={20} />
        <span>WhatsApp</span>
      </a>
    </nav>
  );
}
