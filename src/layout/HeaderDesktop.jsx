// src/layout/HeaderDesktop.jsx
import { Link, NavLink } from "react-router-dom";

export default function HeaderDesktop() {
  return (
    <header className="site-header">
      <div className="header-inner">
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

        {/* Navegación desktop */}
        <nav className="main-nav" aria-label="Categorías">
          <NavLink className="nav-link" to="/categoria/indumentaria">Indumentaria</NavLink>
          <NavLink className="nav-link" to="/categoria/ferreteria">Ferretería</NavLink>
          <NavLink className="nav-link" to="/categoria/tecnologia">Tecnología</NavLink>
          <NavLink className="nav-link" to="/categoria/hogar">Hogar</NavLink>
          <NavLink className="nav-link" to="/categoria/electrodomesticos">Electrodomésticos</NavLink>
          <NavLink className="nav-link" to="/categoria/herramientas">Herramientas</NavLink>
          <NavLink className="nav-link" to="/categoria/jardineria">Jardinería</NavLink>
          <NavLink className="nav-link" to="/ofertas">Ofertas</NavLink>
        </nav>

        {/* Carrito */}
        <Link to="/carrito" className="cart-btn" aria-label="Carrito">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 6h14l-2 9H8L6 3H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="21" r="1.8" fill="currentColor"/>
            <circle cx="18" cy="21" r="1.8" fill="currentColor"/>
          </svg>
          <span className="cart-dot" />
        </Link>
      </div>
    </header>
  );
}
