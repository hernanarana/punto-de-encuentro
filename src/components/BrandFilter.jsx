// src/components/BrandFilter.jsx
import { useFilters } from "../filters/FiltersContext.jsx";

export default function BrandFilter({ brands=[], value, onChange=()=>{}, title="Marca" }){
  let ctx=null; try{ ctx=useFilters(); }catch{}
  const { filters={}, setFilters } = ctx || {};
  const selected = (filters.brand ?? value ?? "") || "";

  const pick = (opt) => {
    const next = opt === "Todas" ? "" : String(opt);
    setFilters?.(p => ({ ...p, brand: next }));
    onChange?.(opt);
  };

  const options = ["Todas", ...brands];

  return (
    <div className="filter-block">
      <div className="filter-block__head">{title}</div>
      <div className="filter-block__body">
        <input type="hidden" name="brand" data-filter="brand" value={selected} />
        <div className="filter-list" role="group" aria-label={title}>
          {options.map(opt=>{
            const active = (selected || "Todas") === opt;
            return (
              <button
                key={opt}
                type="button"
                className={`chip ${active ? "is-active":""}`}
                onClick={()=>pick(opt)}
                aria-pressed={active}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
