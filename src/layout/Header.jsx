// src/layout/Header.jsx
import { Link, NavLink } from "react-router-dom";
import PromoBar from "../components/PromoBar.jsx";
import CartBubble from "../components/CartBubble.jsx";
import SupportInline from "../components/SupportInline.jsx";

export default function Header({ onOpenMenu }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Botón hamburguesa (solo mobile) */}
        <button
          className="icon-btn only-mobile"
          onClick={onOpenMenu}
          aria-label="Abrir menú"
          style={{ marginRight: 8 }}
        >
          <span aria-hidden>≡</span>
        </button>

        {/* Marca */}
        <Link to="/" className="brand" aria-label="Ir al inicio">
          <span className="brand-logo">
            <img src="/logo-pe.png" alt="" width="28" height="28" />
          </span>
          <span className="brand-text">
            <span className="brand-title">PUNTO DE ENCUENTRO</span>
            <span className="brand-subtitle">Todo para tu hogar y trabajo</span>
          </span>
        </Link>

        {/* Nav de escritorio */}
        <nav className="main-nav only-desktop" aria-label="Categorías">
          <NavLink className="nav-link" to="/categoria/indumentaria">
            Indumentaria
          </NavLink>
          <NavLink className="nav-link" to="/categoria/ferreteria">
            Ferretería
          </NavLink>
          <NavLink className="nav-link" to="/categoria/tecnologia">
            Tecnología
          </NavLink>
          <NavLink className="nav-link" to="/categoria/hogar">
            Hogar
          </NavLink>
          <NavLink className="nav-link" to="/categoria/electrodomesticos">
            Electrodomésticos
          </NavLink>
          <NavLink className="nav-link" to="/categoria/herramientas">
            Herramientas
          </NavLink>
          <NavLink className="nav-link" to="/categoria/jardineria">
            Jardinería
          </NavLink>
          <NavLink className="nav-link" to="/ofertas">
            Ofertas
          </NavLink>
        </nav>

        {/* 👉 Acciones de la derecha: soporte + carrito */}
        <div className="header-actions">
          {/* Llavecita siempre visible (mobile + desktop) */}
          <SupportInline />

          {/* Burbuja de carrito */}
          <CartBubble />
        </div>
      </div>

      {/* Barra promo */}
      <PromoBar />
    </header>
  );
}
