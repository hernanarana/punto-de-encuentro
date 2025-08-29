// src/components/MobileTabBar.jsx
import { Link } from "react-router-dom";
import { FiHome, FiList, FiHeadphones, FiMessageCircle } from "react-icons/fi";

export default function MobileTabBar() {
  const openCategories = () => {
    window.dispatchEvent(new CustomEvent("open-categories"));
  };
  const openSupport = () => {
    window.dispatchEvent(new CustomEvent("open-support"));
  };

  return (
    <nav className="tabbar mobile-only" aria-label="Navegación inferior">
      <Link to="/" className="tabbar__btn" aria-label="Inicio">
        <FiHome size={20} />
        <span>Inicio</span>
      </Link>

      <button className="tabbar__btn" onClick={openCategories} aria-label="Categorías">
        <FiList size={20} />
        <span>Categorías</span>
      </button>

      <button className="tabbar__btn" onClick={openSupport} aria-label="Soporte">
        <FiHeadphones size={20} />
        <span>Soporte</span>
      </button>

      <a
        className="tabbar__btn"
        href="https://wa.me/5491112345678?text=Hola%20%F0%9F%91%8B"
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
