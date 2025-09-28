// src/components/SideMenu.jsx
import PropTypes from "prop-types";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

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
    { to: "/categoria/indumentaria", label: "Indumentaria" },
    { to: "/categoria/ferreteria", label: "Ferretería" },
    { to: "/categoria/tecnologia", label: "Tecnología" },
    { to: "/categoria/hogar", label: "Hogar" },
    { to: "/categoria/electrodomesticos", label: "Electrodomésticos" },
    { to: "/categoria/herramientas", label: "Herramientas" },
    { to: "/categoria/jardineria", label: "Jardinería" },
    { to: "/ofertas", label: "Ofertas" },
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
