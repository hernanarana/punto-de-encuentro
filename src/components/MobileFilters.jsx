// src/components/MobileFilters.jsx
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

const S = (v) => (v == null ? "" : String(v));

export default function MobileFilters({
  open,
  onClose,
  searchPath = "/buscar",
}) {
  const loc = useLocation();

  const [q, setQ] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  useEffect(() => {
    if (!open) return;
    const u = new URLSearchParams(loc.search);
    setQ(u.get("q") || "");
    setMin(u.get("min") || "");
    setMax(u.get("max") || "");
  }, [loc.search, open]);

  const canApply = useMemo(
    () => S(q).trim() || S(min).trim() || S(max).trim(),
    [q, min, max]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const sp = new URLSearchParams();
    if (S(q).trim())   sp.set("q", q.trim());
    if (S(min).trim()) sp.set("min", S(min).trim());
    if (S(max).trim()) sp.set("max", S(max).trim());

    // 🔥 Bypass React Router: navegación real del navegador
    const url = `${searchPath}?${sp.toString()}`;
    window.location.assign(url);

    onClose?.();
  };

  if (!open) return null;

  return (
    <>
      <div className="drawer drawer--open" aria-hidden={!open}>
        <div className="drawer__head">
          <strong>Filtrar productos</strong>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <form className="drawer__body" onSubmit={handleSubmit}>
          <label style={{ fontSize: 12, opacity: .8 }}>Buscar</label>
          <input
            name="q"
            placeholder="Ej: heladera"
            value={q}
            onChange={(e)=> setQ(e.target.value)}
            autoComplete="off"
            inputMode="search"
            style={{ marginTop: 6, marginBottom: 12 }}
          />

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: 8 }}>
            <div>
              <label style={{ fontSize: 12, opacity: .8 }}>Mín</label>
              <input
                name="min"
                type="number"
                inputMode="numeric"
                placeholder="0"
                value={min}
                onChange={(e)=> setMin(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, opacity: .8 }}>Máx</label>
              <input
                name="max"
                type="number"
                inputMode="numeric"
                placeholder="999999"
                value={max}
                onChange={(e)=> setMax(e.target.value)}
              />
            </div>
          </div>

          <div style={{ height: 12 }} />
          <button className="btn btn--primary" type="submit" disabled={!canApply}>
            Aplicar
          </button>
        </form>
      </div>

      <div className="overlay" onClick={onClose} />
    </>
  );
}

MobileFilters.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  searchPath: PropTypes.string,
};
