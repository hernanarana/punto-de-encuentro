// src/layout/HeaderMobile.jsx
import { Link } from "react-router-dom";

export default function HeaderMobile({ onOpenMenu }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Botón hamburguesa */}
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Abrir menú"
          style={{ background:"transparent", border:0, color:"#fff", fontSize:22, lineHeight:1 }}
        >
          ☰
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

        {/* placeholder para balancear la grilla */}
        <span aria-hidden />
      </div>
    </header>
  );
}
