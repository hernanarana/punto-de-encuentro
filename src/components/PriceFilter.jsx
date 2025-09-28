// src/components/PriceFilter.jsx
import { useFilters } from "../filters/FiltersContext.jsx";

export default function PriceFilter({ title="Precio" }){
  const { filters, setFilters } = useFilters();
  const { min="", max="" } = filters;

  return (
    <div className="filter-block">
      <div className="filter-block__head">{title}</div>
      <div className="filter-block__body row">
        <input
          name="min"
          type="number"
          inputMode="numeric"
          min="0"
          placeholder="Mín"
          value={min}
          onChange={(e)=> setFilters(p => ({ ...p, min: e.target.value.trim() }))}
        />
        <input
          name="max"
          type="number"
          inputMode="numeric"
          min="0"
          placeholder="Máx"
          value={max}
          onChange={(e)=> setFilters(p => ({ ...p, max: e.target.value.trim() }))}
        />
      </div>
    </div>
  );
}
