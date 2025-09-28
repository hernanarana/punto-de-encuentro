// src/components/DebugFiltersBar.jsx
import { useMemo } from "react";
import { useFilters, filterItems } from "../filters/FiltersContext.jsx";
import PRODUCTS from "../data/products.js";

export default function DebugFiltersBar(){
  let ctx;
  try { ctx = useFilters(); } catch { ctx = null; }

  if (!ctx) {
    return (
      <div style={{position:'sticky',top:0,zIndex:99999,background:'#fee2e2',color:'#991b1b',padding:'8px 12px',fontSize:12}}>
        ⚠️ <b>Debug:</b> <code>useFilters()</code> no encontró Provider en este árbol.
      </div>
    );
  }

  const { filters, setFilters, apply } = ctx;
  const results = useMemo(() => filterItems(PRODUCTS, filters||{}), [filters]);

  return (
    <div
      style={{
        position:'sticky', top:0, zIndex:99999,
        background:'#ecfeff', borderBottom:'1px solid #7dd3fc',
        padding:'8px 12px', display:'grid', gap:6, fontSize:12,
        // aseguramos que NO bloquee clics fuera de ella
        pointerEvents:'auto'
      }}
    >
      <div style={{display:'flex', gap:8, alignItems:'center'}}>
        <b>Buscar:</b>
        <input
          style={{flex:1, padding:'6px 8px'}}
          placeholder='Ej: "heladera" o "mesa"'
          value={filters.q || ""}
          onChange={(e)=> setFilters(p => ({ ...p, q: e.target.value }))}
        />
        <button onClick={()=> apply({})}>Aplicar</button>
        <button onClick={()=> { setFilters({}); apply({}); }}>Limpiar</button>
      </div>

      <div><b>filters</b>: <code>{JSON.stringify(filters)}</code></div>
      <div><b>resultados</b>: {results.length}</div>
    </div>
  );
}
