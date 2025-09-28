import { Link } from "react-router-dom";

export default function HeaderMobile({ onOpenMenu }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <button
          className="icon-btn"
          aria-label="Abrir menú"
          onClick={onOpenMenu}
          style={{ marginRight: 8 }}
        >
          <span aria-hidden>≡</span>
        </button>

        <Link to="/" className="brand" aria-label="Ir al inicio">
          <span className="brand-logo">
            <img src="/logo-pe.png" alt="" width="28" height="28" />
          </span>
          <span className="brand-text">
            <span className="brand-title">PUNTO DE ENCUENTRO</span>
            <span className="brand-subtitle">Todo para tu hogar y trabajo</span>
          </span>
        </Link>

        {/* espacio a la derecha para alinear */}
        <span style={{ width: 28 }} />
      </div>
    </header>
  );
}
