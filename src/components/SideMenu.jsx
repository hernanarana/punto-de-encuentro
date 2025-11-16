// src/components/SideMenu.jsx
import PropTypes from "prop-types";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaHome, FaTshirt, FaTools, FaLaptop, FaHome as FaHouse, FaUtensils, FaHammer, FaLeaf, FaPercent } from "react-icons/fa";

/* Bloquea el scroll del body mientras el menú está abierto */
function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [locked]);
}

export default function SideMenu({ open, onClose }) {
  useLockBodyScroll(open);

  const navigate = useNavigate();
  const [sp, setSp] = useSearchParams();
  const inputRef = useRef(null);

  const links = useMemo(() => ([
    { to: "/categoria/indumentaria", label: "Indumentaria", icon: <FaTshirt /> },
    { to: "/categoria/ferreteria", label: "Ferretería", icon: <FaTools /> },
    { to: "/categoria/tecnologia", label: "Tecnología", icon: <FaLaptop /> },
    { to: "/categoria/hogar", label: "Hogar", icon: <FaHouse /> },
    { to: "/categoria/electrodomesticos", label: "Electrodomésticos", icon: <FaUtensils /> },
    { to: "/categoria/herramientas", label: "Herramientas", icon: <FaHammer /> },
    { to: "/categoria/jardineria", label: "Jardinería", icon: <FaLeaf /> },
    { to: "/ofertas", label: "Ofertas", icon: <FaPercent /> },
  ]), []);

  // valor del buscador sincronizado con ?q=
  const [q, setQ] = useState(sp.get("q") ?? "");
  useEffect(() => { setQ(sp.get("q") ?? ""); }, [sp]);

  // autofocus cuando abre
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  const applyQuery = (value) => {
    const next = new URLSearchParams(sp);
    if (value?.trim()) next.set("q", value.trim());
    else next.delete("q");
    setSp(next, { replace: true });
  };

  return (
    <>
      <aside className={`side-menu ${open ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Menú">
        <div className="side-menu__head">
          <strong>Punto de Encuentro</strong>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <div className="side-menu__body">
          {/* Buscador */}
          <div className="menu-search">
            <input
              ref={inputRef}
              type="search"
              placeholder="Buscar…"
              aria-label="Buscar productos"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { applyQuery(q); onClose(); } }}
            />
            {q && (
              <button className="clear-btn" onClick={() => { setQ(""); applyQuery(""); }}>
                ×
              </button>
            )}
            <button className="apply-btn" onClick={() => { applyQuery(q); onClose(); }}>
              Buscar
            </button>
          </div>

          {/* Categorías */}
          <nav className="menu-links" aria-label="Categorías">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="menu-link"
                onClick={(e) => { e.preventDefault(); navigate(l.to); onClose(); }}
              >
                <span className="menu-link-icon">{l.icon}</span>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {open && <div className="overlay overlay--menu" onClick={onClose} />}
    </>
  );
}

SideMenu.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
