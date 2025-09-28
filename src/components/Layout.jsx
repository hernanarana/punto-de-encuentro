import { useState } from "react";
import { Outlet } from "react-router-dom";
import useBreakpoint from "../hooks/useBreakpoint.js";

import HeaderDesktop from "./HeaderDesktop.jsx";
import HeaderMobile from "./HeaderMobile.jsx";
import PromoBar from "./PromoBar.jsx";
import Footer from "./Footer.jsx";
import SideMenu from "./SideMenu.jsx";
import FloatingWhatsApp from "./FloatingWhatsApp.jsx";

export default function Layout() {
  const isMobile = useBreakpoint("(max-width: 767px)");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site-wrapper">
      {isMobile ? (
        <HeaderMobile onOpenMenu={() => setMenuOpen(true)} />
      ) : (
        <HeaderDesktop />
      )}

      <PromoBar />

      <main className="site-content">
        <Outlet />
      </main>

      <FloatingWhatsApp />
      {Footer ? <Footer /> : null}

      {isMobile && (
        <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      )}
    </div>
  );
}
