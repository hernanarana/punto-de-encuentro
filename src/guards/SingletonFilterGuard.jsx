// src/guards/SingletonFilterGuard.jsx
import { useEffect } from "react";

/**
 * En Android:
 * - Marca el FilterPanel del menú como "dueño".
 * - Oculta y neutraliza cualquier "filter-panel" que no esté dentro del menú.
 * - Hace fallback: si alguien navega a /buscar, redirige a / manteniendo los params.
 */
export default function SingletonFilterGuard() {
  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) return;

    // 1) Guard de único panel
    const aside = document.querySelector(".side-menu");
    const insideMenu = aside ? Array.from(aside.querySelectorAll(".filter-panel")) : [];
    const allPanels = Array.from(document.querySelectorAll(".filter-panel"));

    // Marcar el del menú
    insideMenu.forEach(el => el.setAttribute("data-origin", "sidemenu"));

    // Ocultar los que no están en el menú
    allPanels.forEach(el => {
      if (!el.closest(".side-menu")) {
        el.setAttribute("data-hidden-by-guard", "1");
        el.style.display = "none";
      }
    });

    // 2) Fallback: si alguien empuja /buscar en mobile, redirigimos a /
    const fixBuscar = () => {
      const { pathname, search } = window.location;
      if (pathname === "/buscar") {
        window.history.replaceState(null, "", `/${search}`);
      }
    };
    fixBuscar();

    // 3) Log de diagnóstico
    console.log("[FP-GUARD] mobile:", isMobile,
      "| panels total:", allPanels.length,
      "| en menu:", insideMenu.length,
      "| ocultados:", allPanels.length - insideMenu.length);

    // Limpieza opcional (restaurar displays ocultos)
    return () => {
      allPanels.forEach(el => {
        if (el.getAttribute("data-hidden-by-guard") === "1") {
          el.style.display = "";
          el.removeAttribute("data-hidden-by-guard");
        }
      });
    };
  }, []);

  return null;
}
