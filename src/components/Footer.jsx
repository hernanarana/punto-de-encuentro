export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container" style={{ padding: "24px 16px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {/* Columna 1: Ayuda */}
          <div>
            <h4 style={{ margin: "0 0 8px" }}>Ayuda</h4>
            <ul className="ul-clean" style={{ opacity: 0.9 }}>
              <li><a href="#">Centro de Ayuda</a></li>
              <li><a href="#">Política de Devoluciones</a></li>
              <li><a href="#">Términos y Condiciones</a></li>
              <li><a href="#">Privacidad</a></li>
            </ul>
          </div>

          {/* Columna 2: Categorías */}
          <div>
            <h4 style={{ margin: "0 0 8px" }}>Categorías</h4>
            <ul className="ul-clean" style={{ opacity: 0.9 }}>
              <li><a href="/categoria/indumentaria">Indumentaria</a></li>
              <li><a href="/categoria/ferreteria">Ferretería</a></li>
              <li><a href="/categoria/tecnologia">Tecnología</a></li>
              <li><a href="/categoria/hogar">Hogar</a></li>
              <li><a href="/categoria/electrodomesticos">Electrodomésticos</a></li>
              <li><a href="/categoria/herramientas">Herramientas</a></li>
              <li><a href="/categoria/jardineria">Jardinería</a></li>
              <li><a href="/categoria/ofertas">Ofertas</a></li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h4 style={{ margin: "0 0 8px" }}>Contacto</h4>
            <ul className="ul-clean" style={{ opacity: 0.9 }}>
              <li>📞 +54 9 11 1234-5678</li>
              <li>🟢 WhatsApp</li>
              <li>📍 Buenos Aires, Argentina</li>
              <li>🕘 Lun–Vie 9:00–18:00</li>
            </ul>
          </div>

          {/* Columna 4: Nosotros */}
          <div>
            <h4 style={{ margin: "0 0 8px" }}>Nosotros</h4>
            <p style={{ margin: 0, opacity: 0.9 }}>
              Tienda de confianza para productos de ferretería, hogar,
              electrodomésticos e indumentaria.
            </p>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,.12)",
            marginTop: 16,
            paddingTop: 12,
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            opacity: 0.85,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src="/logo-pe.png" alt="" width="22" height="22" style={{ borderRadius: 6 }} />
            <strong>PUNTO DE ENCUENTRO</strong>
          </div>
          <small>© {new Date().getFullYear()} Punto de Encuentro</small>
        </div>
      </div>
    </footer>
  );
}
