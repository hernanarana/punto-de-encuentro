// src/components/FilterPanel.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildSearchParams } from "../lib/searchParams.js";
// 👇 OJO: ya NO usamos SupportInline acá
// import SupportInline from "./SupportInline.jsx";

/* === Estrellitas compactas === */
function Star({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 17.3l-5.4 3.3 1.5-6.1-4.7-4.1 6.2-.5L12 4l2.4 5.9 6.2.5-4.7 4.1 1.5 6.1z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function StarFilterCompact({ value, onChange }) {
  const current = Number(value) || 0;
  const set = (n) => onChange(current === n ? "" : String(n));
  const btn = (n) =>
    "fp-chip fp-chip--rating " + (current >= n ? "is-active" : "");
  return (
    <div className="fp-stars" role="group" aria-label="Valoración mínima">
      {[5, 4, 3].map((n) => (
        <button
          key={n}
          type="button"
          className={btn(n)}
          aria-pressed={current >= n}
          onClick={() => set(n)}
          title={`${n}★ o más`}
        >
          {Array.from({ length: n }).map((_, i) => (
            <Star key={i} filled />
          ))}
        </button>
      ))}
      <button
        type="button"
        className={`fp-chip ${current === 0 ? "is-active" : ""}`}
        onClick={() => onChange("")}
      >
        Todas
      </button>
    </div>
  );
}

export default function FilterPanel({ defaultValues = {}, onClosePanel }) {
  const [q, setQ] = useState(defaultValues.q ?? "");
  const [cat, setCat] = useState(defaultValues.cat ?? "");
  const [min, setMin] = useState(defaultValues.min ?? "");
  const [max, setMax] = useState(defaultValues.max ?? "");
  const [rating, setRating] = useState(defaultValues.rating ?? "");

  const navigate = useNavigate();

  const apply = (overrides = {}) => {
    const params = buildSearchParams({ q, cat, min, max, rating, ...overrides });
    const search = params.toString();
    const target = "/" + (search ? "?" + search : "");
    const isMobile =
      window.matchMedia?.("(max-width: 767px)").matches ?? false;

    if (isMobile) {
      window.location.replace(target);
    } else {
      navigate({ pathname: "/", search }, { replace: false });
    }

    onClosePanel?.();
  };

  const submit = (e) => {
    e?.preventDefault();
    apply();
  };
  const clear = () =>
    apply({ q: "", cat: "", min: "", max: "", rating: "" });

  return (
    <form className="filter-panel" onSubmit={submit}>
      {/* Header liviano */}
      <div className="fp-head">
        <div className="fp-title">Filtros</div>
      </div>

      <div className="fp-body">
        {/* Buscar */}
        <section className="fp-sec">
          <label className="fp-label">Buscar productos</label>
          <div className="fp-row">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ej: heladera, valija, taladro…"
              className="fp-input"
              inputMode="search"
              enterKeyHint="search"
              onKeyDown={(e) => e.key === "Enter" && submit(e)}
            />
            <button type="submit" className="fp-btn fp-btn--primary">
              Buscar
            </button>
          </div>
        </section>

        {/* Categorías */}
        <section className="fp-sec">
          <div className="fp-label">Categorías</div>

          <div className="fp-chips">
            <button
              type="button"
              className={`fp-chip ${!cat ? "is-active" : ""}`}
              onClick={() => {
                setCat("");
                apply({ cat: "" });
              }}
            >
              Todas
            </button>

            {[
              ["indumentaria", "Indumentaria"],
              ["ferreteria", "Ferretería"],
              ["tecnologia", "Tecnología"],
              ["hogar", "Hogar"],
              ["electrodomesticos", "Electrodomésticos"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`fp-chip ${cat === value ? "is-active" : ""}`}
                onClick={() => {
                  setCat(value);
                  apply({ cat: value });
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Valoración por estrellas */}
        <section className="fp-sec">
          <div className="fp-label">Valoración mínima</div>
          <StarFilterCompact value={rating} onChange={setRating} />
        </section>
      </div>

      {/* Footer sticky con acciones */}
      <div className="fp-actions">
        <button type="submit" className="fp-btn fp-btn--primary">
          Aplicar
        </button>
        <button
          type="button"
          className="fp-btn fp-btn--ghost"
          onClick={clear}
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}
