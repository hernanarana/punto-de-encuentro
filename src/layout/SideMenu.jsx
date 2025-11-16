// src/layout/SideMenu.jsx
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import FilterPanel from "../components/FilterPanel.jsx";
import "./filterpanel.mobile.css";
import SupportInline from "../components/SupportInline.jsx"; // 👈 NUEVO

export default function SideMenu({ open, onClose }) {
  const asideRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle("menu-open", !!open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    if (!open || !asideRef.current) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 768px)").matches;
    if (!open || !isMobile) return;

    const aside = asideRef.current;
    const all = Array.from(document.querySelectorAll(".filter-panel"));
    const out = all.filter((el) => !aside.contains(el));
    out.forEach((el) => {
      el.style.display = "none";
      el.setAttribute("data-hidden-by-sidemenu", "1");
    });

    return () => {
      out.forEach((el) => {
        if (el.getAttribute("data-hidden-by-sidemenu") === "1") {
          el.style.display = "";
          el.removeAttribute("data-hidden-by-sidemenu");
        }
      });
    };
  }, [open]);

  return (
    <>
      <aside
        ref={asideRef}
        className={`side-menu ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal"
        tabIndex={-1}
      >
        <div className="side-menu__head">
          <Link
            to="/"
            className="side-menu__brand"
            id="menu-title"
            onClick={onClose}
            aria-label="Ir al inicio"
          >
            Punto de Encuentro
          </Link>

          {/* 👉 grupo: llave chiquita + botón cerrar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <SupportInline /> {/* 🔧 esta es la que funciona */}
            <button className="close" onClick={onClose} aria-label="Cerrar">
              ✕
            </button>
          </div>
        </div>

        <div className="side-menu__body with-filter-panel">
          <FilterPanel onClosePanel={onClose} />

          <nav
            className="menu-links legacy-menu"
            aria-labelledby="menu-title"
            style={{ marginTop: 16 }}
          >
            <Link
              className="menu-link"
              to="/categoria/indumentaria"
              onClick={onClose}
            >
              Indumentaria
            </Link>
            <Link
              className="menu-link"
              to="/categoria/ferreteria"
              onClick={onClose}
            >
              Ferretería
            </Link>
            <Link
              className="menu-link"
              to="/categoria/tecnologia"
              onClick={onClose}
            >
              Tecnología
            </Link>
            <Link
              className="menu-link"
              to="/categoria/hogar"
              onClick={onClose}
            >
              Hogar
            </Link>
            <Link
              className="menu-link"
              to="/categoria/electrodomesticos"
              onClick={onClose}
            >
              Electrodomésticos
            </Link>
            <Link
              className="menu-link"
              to="/categoria/herramientas"
              onClick={onClose}
            >
              Herramientas
            </Link>
            <Link
              className="menu-link"
              to="/categoria/jardineria"
              onClick={onClose}
            >
              Jardinería
            </Link>
            <Link className="menu-link" to="/ofertas" onClick={onClose}>
              Ofertas
            </Link>
          </nav>
        </div>
      </aside>

      {open && (
        <div
          className="overlay"
          onClick={onClose}
          aria-label="Cerrar menú"
        />
      )}
    </>
  );
}
