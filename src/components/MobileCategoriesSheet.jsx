// src/components/MobileCategoriesSheet.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Bottom-sheet de categorías para MOBILE.
 * Se abre con: window.dispatchEvent(new CustomEvent("open-categories"))
 * Se cierra con: window.dispatchEvent(new CustomEvent("close-categories"))
 */
export default function MobileCategoriesSheet() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onClose = () => setOpen(false);
    window.addEventListener("open-categories", onOpen);
    window.addEventListener("close-categories", onClose);
    return () => {
      window.removeEventListener("open-categories", onOpen);
      window.removeEventListener("close-categories", onClose);
    };
  }, []);

  if (!open) return null;

  return (
    <div
      className="sheet sheet--open"
      role="dialog"
      aria-modal="true"
      aria-label="Categorías"
      onClick={() => setOpen(false)}
    >
      <div className="sheet__body" onClick={(e) => e.stopPropagation()}>
        <div className="sheet__handle" />
        <h3 className="sheet__title">Categorías</h3>

        {/* OJO: esta grilla usa las reglas .sheet__list de tu CSS */}
        <div className="sheet__list">
          <Link to="/categoria/indumentaria">Indumentaria</Link>
          <Link to="/categoria/ferreteria">Ferretería</Link>
          <Link to="/categoria/tecnologia">Tecnología</Link>
          <Link to="/categoria/hogar">Hogar</Link>
          <Link to="/categoria/electrodomesticos">Electrodomésticos</Link>
          <Link to="/categoria/herramientas">Herramientas</Link>
          <Link to="/categoria/jardineria">Jardinería</Link>
          <Link to="/categoria/ofertas">Ofertas</Link>
        </div>

        <button className="sheet__close" onClick={() => setOpen(false)}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
