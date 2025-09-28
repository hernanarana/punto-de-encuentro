// src/layout/Layout.jsx
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useBreakpoint from "../hooks/useBreakpoint.js";

import Header from "./Header.jsx";
import PromoBar from "./PromoBar.jsx";
import Footer from "./Footer.jsx";
import SideMenu from "./SideMenu.jsx";
import FabStack from "../components/FabStack.jsx";
import { FiltersProvider } from "../filters/FiltersContext.jsx";

export default function Layout() {
  const isMobile = useBreakpoint("(max-width: 767px)");
  const [menuOpen, setMenuOpen] = useState(false);

  const loc = useLocation();
  const nav = useNavigate();

  // si la home recibe filtros en la URL => redirige al catálogo general
  useEffect(() => {
    const u = new URLSearchParams(loc.search);
    const hasFilter =
      u.get("q") || u.get("min") || u.get("max") || u.get("brand") || u.get("cat") || u.get("rating");
    if (loc.pathname === "/" && hasFilter) {
      nav(`/categoria/todos?${u.toString()}`, { replace: true });
    }
  }, [loc.pathname, loc.search, nav]);

  return (
    <FiltersProvider>
      <div className="site-wrapper">
        <Header onOpenMenu={() => setMenuOpen(true)} />
        <PromoBar />

        <main className="site-content">
          <Outlet />
        </main>

        <FabStack />
        <Footer />

        {isMobile && (
          <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        )}
      </div>
    </FiltersProvider>
  );
}
