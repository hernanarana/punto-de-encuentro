// src/components/Header.jsx
import { NavLink, Link } from "react-router-dom";

export default function Header() {
  return (
    <>
      {/* Top bar (opcional) */}
      <div className="topbar">
        <div className="container topbar-row">
          <span className="label">Atención personalizada por WhatsApp</span>
          <a
            className="tel"
            href="https://wa.me/5491112345678?text=Hola%2C%20quisiera%20m%C3%A1s%20informaci%C3%B3n."
            target="_blank"
            rel="noreferrer"
          >
            +54 9 11 1234-5678
          </a>
        </div>
      </div>

      {/* Header */}
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/">
            <img
              src="/logo-pe.png"
              alt="Punto de Encuentro"
              width="28"
              height="28"
              style={{ borderRadius: 8, display: "block" }}
              onError={(e) => (e.currentTarget.src = "/placeholder-logo.png")}
            />
            <span className="brand-title" style={{ marginLeft: 8 }}>
              PUNTO DE ENCUENTRO
              <small className="brand-subtitle">Todo para tu hogar y trabajo</small>
            </span>
          </Link>

          {/* Menú principal (se oculta en mobile por CSS) */}
          <nav className="main-nav desktop-only">
            <NavLink to="/categoria/indumentaria" className="nav-link">Indumentaria</NavLink>
            <NavLink to="/categoria/ferreteria"    className="nav-link">Ferretería</NavLink>
            <NavLink to="/categoria/tecnologia"    className="nav-link">Tecnología</NavLink>
            <NavLink to="/categoria/hogar"         className="nav-link">Hogar</NavLink>
            <NavLink to="/categoria/electrodomesticos" className="nav-link">Electrodomésticos</NavLink>
            <NavLink to="/categoria/herramientas"  className="nav-link">Herramientas</NavLink>
            <NavLink to="/categoria/jardineria"    className="nav-link">Jardinería</NavLink>
            <NavLink to="/categoria/ofertas"       className="nav-link">Ofertas</NavLink>
          </nav>

          {/* Botón soporte (abre modal global) */}
          <button
            className="support-btn desktop-only"
            onClick={() => window.dispatchEvent(new CustomEvent("open-support"))}
          >
            Soporte técnico
          </button>
        </div>
      </header>
    </>
  );
}
