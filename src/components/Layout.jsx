// src/layout/Layout.jsx
import { Outlet } from "react-router-dom";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

import MobileTabBar from "../components/MobileTabBar.jsx";
import SupportModal from "../components/SupportModal.jsx";
import MobileCategoriesSheet from "../components/MobileCategoriesSheet.jsx";

export default function Layout() {
  return (
    <>
      {/* Header superior */}
      <Header />

      {/* Contenido principal (le damos padding-bottom con .site-content en el CSS para que no lo tape la tabbar) */}
      <main className="site-content">
        <Outlet />
      </main>

      {/* Modales/Sheets globales: se montan UNA sola vez acá */}
      <SupportModal />
      <MobileCategoriesSheet />

      {/* Tab bar solo en mobile. Dispara eventos que escuchan los modales/sheets */}
      <MobileTabBar
        onCategories={() =>
          window.dispatchEvent(new CustomEvent("open-categories"))
        }
        onSupport={() =>
          window.dispatchEvent(new CustomEvent("open-support"))
        }
      />

      {/* (Opcional) botón flotante de WhatsApp en desktop; en mobile se oculta por CSS .wa-fab */}
      <a
        className="wa-fab"
        href="https://wa.me/5491112345678?text=Hola%2C%20quisiera%20m%C3%A1s%20informaci%C3%B3n."
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        title="Escribinos por WhatsApp"
      >
        {/* Podés reemplazar este símbolo por un svg o imagen /whatsapp.svg */}
        <span style={{ fontSize: 22, lineHeight: 1 }}>✆</span>
      </a>

      {/* Footer */}
      <Footer />
    </>
  );
}
