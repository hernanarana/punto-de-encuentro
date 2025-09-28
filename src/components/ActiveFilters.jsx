// src/components/ActiveFilters.jsx
import PropTypes from "prop-types";

const noop = () => {};
const safeStr  = (v) => (typeof v === "string" ? v : "");
const safeTrim = (v) => safeStr(v).trim();

export default function ActiveFilters({
  query = "",
  setQuery = noop,
  category = "Todas",
  setCategory = noop,
  minRating = 0,
  setMinRating = noop,
}) {
  const q = safeTrim(query);

  const tokens = q ? q.split(/\s+/).slice(0, 8) : [];

  const removeToken = (t) => {
    const parts = q.split(/\s+/).filter((w) => w.toLowerCase() !== safeStr(t).toLowerCase());
    setQuery(parts.join(" "));
  };

  const clearQuery = () => setQuery("");
  const clearCategory = () => setCategory("Todas");
  const clearRating = () => setMinRating(0);

  const hasSomething = tokens.length || category !== "Todas" || Number(minRating) > 0;

  return (
    <div className="summary-bar">
      <span className="summary-title">Filtros activos:</span>

      {!hasSomething && <span className="muted">Sin filtros</span>}

      {/* tokens de búsqueda */}
      {tokens.map((t, i) => (
        <button
          key={`${t}-${i}`}
          className="chip chip--clear"
          onClick={() => removeToken(t)}
          title={`Quitar "${t}"`}
        >
          “{t}” <span className="chip-x">×</span>
        </button>
      ))}

      {/* categoría */}
      {category !== "Todas" && (
        <button
          className="chip chip--clear"
          onClick={clearCategory}
          title="Quitar categoría"
        >
          Categoría: {category} <span className="chip-x">×</span>
        </button>
      )}

      {/* rating */}
      {Number(minRating) > 0 && (
        <button
          className="chip chip--clear"
          onClick={clearRating}
          title="Quitar calificación"
        >
          Calificación: {minRating}+ <span className="chip-x">×</span>
        </button>
      )}

      {/* botón limpiar todo */}
      {hasSomething && (
        <button
          className="chip chip--danger"
          onClick={() => {
            clearQuery();
            clearCategory();
            clearRating();
          }}
          title="Limpiar todos los filtros"
        >
          Limpiar todo
        </button>
      )}
    </div>
  );
}

ActiveFilters.propTypes = {
  query: PropTypes.string,
  setQuery: PropTypes.func,
  category: PropTypes.string,
  setCategory: PropTypes.func,
  minRating: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setMinRating: PropTypes.func,
};
