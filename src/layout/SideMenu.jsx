// src/layout/SideMenu.jsx
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function SideMenu({ open, onClose }) {
  const asideRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle("menu-open", !!open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    if (!open || !asideRef.current) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

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
          <strong id="menu-title">Punto de Encuentro</strong>
          <button className="close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {/* 👇 Envolvemos TODO lo viejo en .legacy-menu (se ocultará cuando el panel nuevo esté montado) */}
        <div className="side-menu__body legacy-menu">
          <nav className="menu-links" aria-labelledby="menu-title">
            <Link className="menu-link" to="/categoria/indumentaria" onClick={onClose}>Indumentaria</Link>
            <Link className="menu-link" to="/categoria/ferreteria" onClick={onClose}>Ferretería</Link>
            <Link className="menu-link" to="/categoria/tecnologia" onClick={onClose}>Tecnología</Link>
            <Link className="menu-link" to="/categoria/hogar" onClick={onClose}>Hogar</Link>
            <Link className="menu-link" to="/categoria/electrodomesticos" onClick={onClose}>Electrodomésticos</Link>
            <Link className="menu-link" to="/categoria/herramientas" onClick={onClose}>Herramientas</Link>
            <Link className="menu-link" to="/categoria/jardineria" onClick={onClose}>Jardinería</Link>
            <Link className="menu-link" to="/ofertas" onClick={onClose}>Ofertas</Link>
          </nav>
        </div>
      </aside>

      {open && <div className="overlay" onClick={onClose} aria-label="Cerrar menú" />}
    </>
  );
}
