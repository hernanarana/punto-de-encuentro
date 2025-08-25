// src/components/Footer.jsx
import { Link } from "react-router-dom";
import PRODUCTS from "../data/products.js";
import { PHONE_SHOWN, PHONE_E164 } from "../config";

const toSlug = (s = "") =>
  s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function Footer() {
  // Categorías únicas desde tus productos (máx. 8 para no saturar)
  const categories = Array.from(
    new Set(PRODUCTS.map((p) => p.category).filter(Boolean))
  ).slice(0, 8);

  const waHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(
    "Hola, quisiera comunicarme con Punto de Encuentro."
  )}`;
  const telHref = `tel:${PHONE_E164}`;

  return (
    <footer className="site-footer">
      <div className="container">
        {/* Top: marca */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <img
            src="/logo-pe.png"
            alt="Punto de Encuentro"
            style={{
              width: 40,
              height: 40,
              objectFit: "contain",
              borderRadius: 8,
              background: "#fff",
            }}
          />
          <div>
            <strong style={{ letterSpacing: 0.3 }}>PUNTO DE ENCUENTRO</strong>
            <div style={{ opacity: 0.9, fontSize: 13 }}>
              Todo para tu hogar y trabajo
            </div>
          </div>
        </div>

        {/* Grid principal */}
        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {/* Columna 1 */}
          <div>
            <h4 style={{ marginTop: 0 }}>Ayuda</h4>
            <nav style={{ display: "grid", gap: 8 }}>
              <Link to="/" style={{ color: "#cdeafe", textDecoration: "none" }}>
                Centro de Ayuda
              </Link>
              <Link to="/" style={{ color: "#cdeafe", textDecoration: "none" }}>
                Política de Devoluciones
              </Link>
              <Link to="/" style={{ color: "#cdeafe", textDecoration: "none" }}>
                Términos y Condiciones
              </Link>
              <Link to="/" style={{ color: "#cdeafe", textDecoration: "none" }}>
                Privacidad
              </Link>
            </nav>
          </div>

          {/* Columna 2 */}
          <div>
            <h4 style={{ marginTop: 0 }}>Categorías</h4>
            <nav style={{ display: "grid", gap: 8 }}>
              {categories.length === 0 && (
                <span style={{ opacity: 0.7 }}>Sin categorías</span>
              )}
              {categories.map((c) => (
                <Link
                  key={c}
                  to={`/categoria/${toSlug(c)}`}
                  style={{ color: "#cdeafe", textDecoration: "none" }}
                >
                  {c}
                </Link>
              ))}
            </nav>
          </div>

          {/* Columna 3 */}
          <div>
            <h4 style={{ marginTop: 0 }}>Contacto</h4>
            <div style={{ display: "grid", gap: 8 }}>
              <a
                href={telHref}
                style={{ color: "#cdeafe", textDecoration: "none" }}
              >
                📞 {PHONE_SHOWN}
              </a>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#cdeafe", textDecoration: "none" }}
              >
                🟢 WhatsApp
              </a>
              <span style={{ opacity: 0.9 }}>📍 Buenos Aires, Argentina</span>
              <span style={{ opacity: 0.9 }}>🕘 Lun–Vie 9:00–18:00</span>
            </div>
          </div>

          {/* Columna 4 (opcional) */}
          <div>
            <h4 style={{ marginTop: 0 }}>Nosotros</h4>
            <p style={{ margin: 0, lineHeight: 1.6, opacity: 0.9 }}>
              Tienda de confianza para productos de ferretería, hogar,
              electrodomésticos e indumentaria.
            </p>
          </div>
        </div>

        {/* Línea y legal */}
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #1f2937",
            margin: "16px 0",
          }}
        />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            opacity: 0.85,
            fontSize: 13,
          }}
        >
          <small>
            © {new Date().getFullYear()} Punto de Encuentro — Todos los
            derechos reservados.
          </small>
          <small>Hecho con React + Vite</small>
        </div>
      </div>
    </footer>
  );
}
