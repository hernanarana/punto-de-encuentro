// src/components/Header.jsx
import { Link } from "react-router-dom";

const CATS = [
  "Indumentaria",
  "Ferretería",
  "Tecnología",
  "Hogar",
  "Electrodomésticos",
  "Herramientas",
  "Jardinería",
  "Ofertas",
];

const toSlug = (s = "") =>
  s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function Header({ onOpenSupport }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "#0ea5e9",
        color: "#fff",
        boxShadow: "0 6px 20px rgba(0,0,0,.12)",
      }}
    >
      <div
        className="container"
        style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 0" }}
      >
        {/* Logo + marca → Home */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#fff",
            textDecoration: "none",
          }}
        >
          <img
            src="/logo-pe.png"
            alt="Punto de Encuentro"
            style={{ width: 40, height: 40, borderRadius: 8, objectFit: "contain", background: "#fff" }}
          />
          <div style={{ display: "grid" }}>
            <strong style={{ fontSize: 18, letterSpacing: 0.3 }}>PUNTO DE ENCUENTRO</strong>
            <small style={{ opacity: 0.9, color: "#f0f9ff" }}>Todo para tu hogar y trabajo</small>
          </div>
        </Link>

        {/* Ramas SOLO en escritorio */}
        <nav className="nav-scroll desktop-only" style={{ marginLeft: "auto" }}>
          {CATS.map((cat) => (
            <Link
              key={cat}
              to={`/categoria/${toSlug(cat)}`}
              style={{ color: "#fff", textDecoration: "none", whiteSpace: "nowrap" }}
            >
              {cat}
            </Link>
          ))}
          <button
            onClick={onOpenSupport}
            className="btn"
            style={{ background: "#fff", color: "#0ea5e9", marginLeft: 8 }}
          >
            Soporte técnico
          </button>
        </nav>
      </div>
    </header>
  );
}
