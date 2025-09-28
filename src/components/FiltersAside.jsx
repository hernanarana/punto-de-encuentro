// src/components/FiltersAside.jsx
import { useState } from "react";

export default function FiltersAside({
  // --- props opcionales para enganchar la lógica desde afuera ---
  initialQuery = "",
  onQueryChange = () => {},
  onClear = () => {},
  onPriceChange = () => {},
  selectedPrice = null,             // 'low' | 'mid' | 'high' | null
  onRatingChange = () => {},
  selectedRating = null,            // 5 | 4 | 3 | null
  categories = [
    { id: "hogar", label: "Hogar" },
    { id: "herramientas", label: "Herramientas" },
    { id: "tecnologia", label: "Tecnología" },
  ],
  selectedCategories = [],
  onToggleCategory = () => {},
}) {
  const [q, setQ] = useState(initialQuery);

  const submit = (e) => {
    e.preventDefault();
    onQueryChange(q.trim());
  };

  const clearAll = () => {
    setQ("");
    onQueryChange("");
    onClear();
  };

  return (
    <aside className="filters-aside" aria-label="Filtros">
      {/* Buscar producto (compacto) */}
      <div className="filter-card">
        <h3>Buscar producto</h3>
        <form className="filter-search" onSubmit={submit}>
          <input
            type="search"
            className="search-input"
            placeholder="Nombre, marca, etc."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Buscar producto"
          />
          <button className="search-btn btn btn--primary" type="submit">
            Buscar
          </button>
        </form>
      </div>

      {/* Categorías */}
      <div className="filter-card">
        <h3>Categorías</h3>
        <div role="group" aria-label="Categorías">
          {categories.map((cat) => (
            <label key={cat.id} className="filter-row">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.id)}
                onChange={() => onToggleCategory(cat.id)}
              />
              <span>{cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Precio */}
      <div className="filter-card">
        <h3>Precio</h3>
        <div role="radiogroup" aria-label="Rango de precio">
          <label className="filter-row">
            <input
              type="radio"
              name="price"
              checked={selectedPrice === "low"}
              onChange={() => onPriceChange("low")}
            />
            <span>Hasta $5.000</span>
          </label>
          <label className="filter-row">
            <input
              type="radio"
              name="price"
              checked={selectedPrice === "mid"}
              onChange={() => onPriceChange("mid")}
            />
            <span>$5.000 – $15.000</span>
          </label>
          <label className="filter-row">
            <input
              type="radio"
              name="price"
              checked={selectedPrice === "high"}
              onChange={() => onPriceChange("high")}
            />
            <span>Más de $50.000</span>
          </label>
        </div>
      </div>

      {/* Calificación */}
      <div className="filter-card">
        <h3>Calificación</h3>
        <div role="radiogroup" aria-label="Calificación">
          {[5, 4, 3].map((stars) => (
            <label key={stars} className="filter-row">
              <input
                type="radio"
                name="rating"
                checked={selectedRating === stars}
                onChange={() => onRatingChange(stars)}
              />
              <span>{"★".repeat(stars) + "☆".repeat(5 - stars)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Limpiar */}
      <div className="filter-card">
        <button type="button" className="btn" onClick={clearAll}>
          Limpiar filtros
        </button>
      </div>
    </aside>
  );
}
