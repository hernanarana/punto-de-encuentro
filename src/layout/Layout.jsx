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

  // ✅ SOLO DESKTOP: si Home recibe filtros, redirige al catálogo general
  // (En MOBILE NO redirigimos: dejamos Home en "/" para que aplique filtros)
  useEffect(() => {
    const u = new URLSearchParams(loc.search);
    const hasFilter =
      u.get("q") || u.get("min") || u.get("max") || u.get("brand") || u.get("cat") || u.get("rating");

    if (!isMobile && loc.pathname === "/" && hasFilter) {
      nav(`/categoria/todos?${u.toString()}`, { replace: true });
    }
  }, [isMobile, loc.pathname, loc.search, nav]);

  // ✅ SOLO MOBILE: normaliza /buscar → / (mantiene parámetros)
  useEffect(() => {
    if (!isMobile) return;
    if (loc.pathname === "/buscar") {
      nav({ pathname: "/", search: loc.search }, { replace: true });
    }
  }, [isMobile, loc.pathname, loc.search, nav]);

  // ✅ SOLO MOBILE: cuando el menú está abierto, oculta cualquier .filter-panel que NO esté dentro del menú
  // (evita duplicados si alguna página inyecta su propio panel)
  useEffect(() => {
    if (!isMobile || !menuOpen) return;

    const aside = document.querySelector(".side-menu");
    const all = Array.from(document.querySelectorAll(".filter-panel"));
    const toHide = all.filter((el) => !aside || !aside.contains(el));

    toHide.forEach((el) => {
      el.setAttribute("data-hidden-by-layout", "1");
      el.style.display = "none";
    });

    // log de diagnóstico (opcional)
    // console.log("[LAYOUT] ocultados fuera del menú:", toHide.length);

    return () => {
      toHide.forEach((el) => {
        if (el.getAttribute("data-hidden-by-layout") === "1") {
          el.style.display = "";
          el.removeAttribute("data-hidden-by-layout");
        }
      });
    };
  }, [isMobile, menuOpen, loc.pathname]); // si cambiás de ruta con menú abierto, re-aplica

  return (
    <FiltersProvider>
      <div className="site-wrapper">
        <Header onOpenMenu={() => setMenuOpen(true)} />
        <PromoBar />

        <main className="site-content">
          <Outlet />
        </main>

        <Footer />

        <FabStack />

        {isMobile && (
          <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        )}
      </div>
    </FiltersProvider>
  );
}
