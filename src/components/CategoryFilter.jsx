// src/components/CategoryFilter.jsx
import { useMemo } from "react";
import { useFilters } from "../filters/FiltersContext.jsx";

const S = (v) => (v == null ? "" : String(v));

export default function CategoryFilter({
  categories,
  products = [],
  value,
  onChange = () => {},
  title = "Categorías",
}) {
  let ctx = null; try { ctx = useFilters(); } catch {}
  const filters    = ctx?.filters || {};
  const setFilters = ctx?.setFilters;

  const derived = useMemo(() => {
    if (Array.isArray(categories)) return categories;
    const set = new Set();
    (Array.isArray(products) ? products : []).forEach((p) => {
      const c = S(p?.category || p?.categoryName);
      if (c) set.add(c);
    });
    return Array.from(set);
  }, [categories, products]);

  const options = useMemo(() => {
    const list = derived.map(S).filter(Boolean).sort((a,b)=>a.localeCompare(b,"es"));
    return ["Todas", ...list];
  }, [derived]);

  const selected =
    S(filters.cat ?? "") !== "" ? S(filters.cat)
    : S(value ?? "")           !== "" ? S(value)
    : "Todas";

  const handlePick = (opt) => {
    const next = opt === "Todas" ? "" : S(opt);
    setFilters?.(prev => ({ ...prev, cat: next }));
    onChange?.(opt);
  };

  return (
    <div className="filter-block">
      <div className="filter-block__head">{title}</div>
      <div className="filter-block__body">
        <input type="hidden" name="cat" data-filter="cat" value={selected === "Todas" ? "" : selected} />
        <div className="filter-list" role="group" aria-label={title}>
          {options.map((opt) => {
            const active = S(selected) === S(opt);
            return (
              <button
                type="button"
                key={opt}
                className={`chip ${active ? "is-active" : ""}`}
                onClick={() => handlePick(opt)}
                aria-pressed={active}
                title={opt}
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
