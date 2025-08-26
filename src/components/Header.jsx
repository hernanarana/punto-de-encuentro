// src/components/Header.jsx
import { Link, NavLink } from "react-router-dom";
import { asset } from "../utils/asset";

const CATEGORIES = [
  { label: "Indumentaria", slug: "indumentaria" },
  { label: "Ferretería", slug: "ferreteria" },
  { label: "Tecnología", slug: "tecnologia" },
  { label: "Hogar", slug: "hogar" },
  { label: "Electrodomésticos", slug: "electrodomesticos" },
  { label: "Herramientas", slug: "herramientas" },
  { label: "Jardinería", slug: "jardineria" },
  { label: "Ofertas", slug: "ofertas" },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Marca | al click va a la Home */}
        <Link to="/" className="brand" aria-label="Inicio">
          <img
            src={asset("logo-pe.png")}
            alt="Punto de Encuentro"
            width={32}
            height={32}
            style={{ borderRadius: 6, objectFit: "cover", marginRight: 8 }}
          />
          <div className="brand-block">
            <strong className="brand-title">PUNTO DE ENCUENTRO</strong>
            <small className="brand-subtitle">Todo para tu hogar y trabajo</small>
          </div>
        </Link>

        {/* Menú principal de categorías (en mobile suele ocultarse vía CSS) */}
        <nav className="main-nav" aria-label="Categorías">
          {CATEGORIES.map((c) => (
            <NavLink
              key={c.slug}
              to={`/categoria/${c.slug}`}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              end={false}
            >
              {c.label}
            </NavLink>
          ))}

          {/* Botón de soporte (podés cambiar a modal si usás <SupportModal />) */}
          <Link to="/soporte" className="support-btn" title="Soporte técnico">
            Soporte técnico
          </Link>
        </nav>
      </div>
    </header>
  );
}
