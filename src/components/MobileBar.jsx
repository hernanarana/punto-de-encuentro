// src/components/Layout.jsx
import { useState } from "react";
import Header from "./Header.jsx";       // usa el Header que hicimos con el botón hamburguesa
import Footer from "./Footer.jsx";       // si no lo tenés aún, podés comentarlo
import SideMenu from "./SideMenu.jsx";   // el menú hamburguesa lateral

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site-wrapper">
      {/* Header con onOpenMenu */}
      <Header onOpenMenu={() => setMenuOpen(true)} />

      {/* Contenido principal */}
      <main className="site-main">
        {children}
      </main>

      {/* Footer (opcional) */}
      {Footer ? <Footer /> : null}

      {/* Menú hamburguesa lateral */}
      <SideMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onApply={() => {
          // Si querés disparar lógica extra al aplicar filtros, metela acá
        }}
      />
    </div>
  );
}
