// src/filters/FiltersContext.jsx
import {
  createContext, useContext, useMemo, useRef, useState, useEffect,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Ctx = createContext(null);

const norm = (s = "") =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

// Sinónimos para mejorar el recall
const SYNONYMS = {
  heladera:    ["heladera","helad","refrigerador","refrig","freezer","frio"],
  termotanque: ["termotanque","calentador de agua","tanque de agua","agua caliente"],
  calefon:     ["calefon","calentador instantaneo","instantaneo"],
  tv:          ["tv","tele","televisor","smart tv"],
  lavarropa:   ["lavarropa","lavadora"],
  notebook:    ["notebook","laptop","portatil"],
};

function textMatches(qn, ...fields) {
  if (!qn) return true;
  const bag = fields.map(norm).join(" ");
  if (bag.includes(qn)) return true;

  for (const [key, variants] of Object.entries(SYNONYMS)) {
    if (variants.some(v => qn.includes(v) || v.includes(qn))) {
      if (bag.includes(key)) return true;
    }
  }
  return false;
}

const parseSearch = (search) => {
  const u = new URLSearchParams(search);
  return {
    q: u.get("q") || "",
    min: u.get("min") || "",
    max: u.get("max") || "",
    brand: u.get("brand") || "",
    cat: u.get("cat") || "",
    rating: u.get("rating") || "",
  };
};

export function FiltersProvider({ children }) {
  const nav = useNavigate();
  const loc = useLocation();

  const [filters, setFilters] = useState(parseSearch(loc.search));
  const gridRef = useRef(null);
  const lastApplied = useRef(0);

  // Sync filtros → URL
  useEffect(() => {
    const sp = new URLSearchParams();
    Object.entries(filters || {}).forEach(([k, v]) => {
      const s = String(v ?? "").trim();
      if (s) sp.set(k, s);
    });
    nav({ search: sp.toString() }, { replace: true });
  }, [filters, nav]);

  const apply = (patch = {}) => {
    if (patch && Object.keys(patch).length) {
      setFilters(prev => ({ ...prev, ...patch }));
    }
    lastApplied.current = Date.now();
  };

  const value = useMemo(() => ({
    filters, setFilters, apply, gridRef, lastApplied,
  }), [filters]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useFilters = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFilters debe usarse dentro de <FiltersProvider>");
  return ctx;
};

export function filterItems(items = [], f = {}) {
  const qn     = norm(f.q);
  const min    = Number(f.min) || 0;
  const max    = Number(f.max) || Number.POSITIVE_INFINITY;
  const brandf = norm(f.brand);
  const catf   = norm(f.cat);
  const rating = Number(f.rating) || 0;

  return items.filter((p) => {
    const title = p?.title || "";
    const desc  = p?.description || "";
    const brand = p?.brand || "";
    const cat   = p?.category || p?.categoryName || "";

    const okQ   = textMatches(qn, title, desc, brand, cat);
    const okMin = (p.price ?? 0) >= min;
    const okMax = (p.price ?? 0) <= max;
    const okB   = brandf ? norm(brand).includes(brandf) : true;
    const okC   = catf   ? norm(cat).includes(catf)     : true;
    const okR   = (Number(p.rating) || 0) >= rating;

    return okQ && okMin && okMax && okB && okC && okR;
  });
}
