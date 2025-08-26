// src/components/Header.jsx
import { Link, NavLink } from "react-router-dom";
import { asset } from "../utils/asset";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="Inicio">
          <img
            src={asset("logo-pe.png")}          // <-- ¡acá la magia!
            alt="Punto de Encuentro"
            width={32}
            height={32}
            style={{ borderRadius: 6, objectFit: "cover", marginRight: 8 }}
          />
          <span className="brand-title">PUNTO DE ENCUENTRO</span>
        </Link>

        {/* si ya tenés tu menú, dejá el tuyo; esto es de ejemplo */}
        <nav className="main-nav">
          <NavLink to="/categoria/indumentaria">Indumentaria</NavLink>
          <NavLink to="/categoria/ferreteria">Ferretería</NavLink>
          <NavLink to="/categoria/tecnologia">Tecnología</NavLink>
          <NavLink to="/categoria/hogar">Hogar</NavLink>
        </nav>
      </div>
    </header>
  );
}
