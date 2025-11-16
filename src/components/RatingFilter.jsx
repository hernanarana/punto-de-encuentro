// src/components/RatingFilter.jsx
import RatingStars from "./RatingStars.jsx";
import { useFilters } from "../filters/FiltersContext.jsx";

export default function RatingFilter({ value, onChange = () => {} }) {
  let ctx=null; try{ ctx=useFilters(); }catch{}
  const filters    = ctx?.filters || {};
  const setFilters = ctx?.setFilters;

  const selected = Number((filters.rating ?? value ?? 0));

  const set = (n) => {
    setFilters?.((prev) => ({ ...prev, rating: String(n) }));
    onChange?.(n);
  };

  return (
    <div className="filter-item">
      <label className="label">Calificación mínima</label>

      <input
        type="hidden"
        name="rating"
        data-filter="rating"
        value={String(selected || 0)}
      />

      <div className="rating-filter">
        {[0,1,2,3,4,5].map((n) => (
          <button
            key={n}
            className={`chip ${selected === n ? "chip--active" : ""}`}
            onClick={() => set(n)}
            type="button"
            title={n === 0 ? "Sin filtro" : `${n}+`}
          >
            {n === 0 ? "Todas" : `${n}+`}
          </button>
        ))}
      </div>

      <div className="rating-current">
        <small>Actual:</small> <RatingStars value={selected} />
      </div>
    </div>
  );
}
