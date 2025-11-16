// src/components/MenuPanel.jsx
import { useMemo, useState } from "react";
import "../styles/mobile-menu.css";

const norm = (s = "") =>
  String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export default function MenuPanel({
  categories = [],
  activeCategory = "todos",     // slug activo (p.ej. "ofertas" | "tecnologia")
  onGoCategory,                 // (slugNext) => void
  onSearch,                     // (query) => void
  price = { min: "", max: "" },
  setPrice,                     // ({min, max}) => void
  rating = "",
  setRating,                    // (val) => void ("", "1".."5")
  minDiscount = "",
  setMinDiscount,               // (val) => void ("", "10","20","30","40")
  resultsCount = 0,
  isOffers = false,
  onApply,
  onClear,
}) {
  const [q, setQ] = useState("");

  const onSubmitSearch = () => {
    const v = q.trim();
    if (!v) return;
    onSearch?.(v);
  };

  const categoriesList = useMemo(() => {
    // Genera pares {name, slug} sin duplicados, en el orden recibido
    const seen = new Set();
    const list = [];
    for (const name of categories) {
      const slug = norm(name).replace(/\s+/g, "-");
      if (seen.has(slug)) continue;
      seen.add(slug);
      list.push({ name, slug });
    }
    // incluye "todos" al inicio
    return [{ name: "Todas", slug: "todos" }, ...list];
  }, [categories]);

  const isActive = (slug) => norm(slug) === norm(activeCategory);

  return (
    <div className="filter-panel">
      {/* Buscar */}
      <section className="fp-sec">
        <div className="fp-label">Buscar productos</div>
        <div className="fp-row">
          <input
            type="text"
            placeholder="¿Qué buscás?"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? onSubmitSearch() : null)}
          />
          <button type="button" className="fp-chip" onClick={onSubmitSearch} title="Buscar">
            🔎
          </button>
        </div>
      </section>

      {/* Categorías en 2 columnas */}
      <section className="fp-sec">
        <div className="fp-label">Categorías</div>
        <div className="fp-grid-2">
          {categoriesList.map(({ name, slug }) => (
            <button
              key={slug}
              className={`fp-chip ${isActive(slug) ? "is-active" : ""}`}
              onClick={() => onGoCategory?.(slug)}
              title={name}
            >
              {name}
            </button>
          ))}
        </div>
      </section>

      {/* Precio */}
      <section className="fp-sec">
        <div className="fp-label">Precio</div>
        <div className="fp-row">
          <input
            type="number"
            placeholder="Mín"
            value={price.min ?? ""}
            onChange={(e) => setPrice?.({ min: e.target.value, max: price.max })}
          />
          <input
            type="number"
            placeholder="Máx"
            value={price.max ?? ""}
            onChange={(e) => setPrice?.({ min: price.min, max: e.target.value })}
          />
        </div>
      </section>

      {/* Valoración mínima */}
      <section className="fp-sec">
        <div className="fp-label">Valoración mínima</div>
        <div className="rating-filter">
          {[5, 4, 3, 2, 1].map((n) => (
            <button
              key={n}
              type="button"
              className={`fp-chip ${Number(rating) >= n ? "is-active" : ""}`}
              onClick={() => setRating?.(Number(rating) === n ? "" : String(n))}
            >
              {"★".repeat(n)}
            </button>
          ))}
          <button
            type="button"
            className={`fp-chip ${!rating ? "is-active" : ""}`}
            onClick={() => setRating?.("")}
          >
            Todas
          </button>
        </div>
      </section>

      {/* Descuento mínimo (solo en Ofertas) */}
      {isOffers && (
        <section className="fp-sec">
          <div className="fp-label">Descuento mínimo</div>
          <div className="fp-chips">
            {[10, 20, 30, 40, 50].map((d) => (
              <button
                key={d}
                className={`fp-chip ${Number(minDiscount) === d ? "is-active" : ""}`}
                onClick={() =>
                  setMinDiscount?.(Number(minDiscount) === d ? "" : String(d))
                }
              >
                {d}%
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Footer fijo */}
      <div className="fp-actions">
        <button type="button" className="fp-apply" onClick={onApply}>
          Aplicar
        </button>
        <button
          type="button"
          className="fp-clear"
          onClick={() => {
            onClear?.();
            setQ("");
          }}
        >
          Limpiar
        </button>
        <div className="fp-count">
          {resultsCount === 0
            ? "Sin resultados con esos filtros"
            : `Ver ${resultsCount} producto${resultsCount > 1 ? "s" : ""}`}
        </div>
      </div>
    </div>
  );
}
