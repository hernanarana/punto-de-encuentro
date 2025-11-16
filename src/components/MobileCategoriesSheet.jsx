// src/components/MobileCategoriesSheet.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
    <div className={`sheet sheet--open`} onClick={() => setOpen(false)}>
      <div className="sheet__body" onClick={(e) => e.stopPropagation()}>
        <div className="sheet__handle" />
        <h3 className="sheet__title">Categorías</h3>

        <div className="sheet__list">
          <Link to="/categoria/indumentaria" onClick={() => setOpen(false)}>Indumentaria</Link>
          <Link to="/categoria/ferreteria"    onClick={() => setOpen(false)}>Ferretería</Link>
          <Link to="/categoria/tecnologia"    onClick={() => setOpen(false)}>Tecnología</Link>
          <Link to="/categoria/hogar"         onClick={() => setOpen(false)}>Hogar</Link>
          <Link to="/categoria/electrodomesticos" onClick={() => setOpen(false)}>Electrodomésticos</Link>
          <Link to="/categoria/herramientas"  onClick={() => setOpen(false)}>Herramientas</Link>
          <Link to="/categoria/jardineria"    onClick={() => setOpen(false)}>Jardinería</Link>
          <Link to="/categoria/ofertas"       onClick={() => setOpen(false)}>Ofertas</Link>
        </div>

        <button className="sheet__close" onClick={() => setOpen(false)}>Cerrar</button>
      </div>
    </div>
  );
}
