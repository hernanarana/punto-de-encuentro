// src/components/FeaturedList.jsx
import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import PRODUCTS from "../data/products.js";
import ProductImage from "./ProductImage";
import { useFilters, filterItems } from "../filters/FiltersContext.jsx";

const GO_TO_DETAIL_ON_SINGLE = false;

export default function FeaturedList() {
  // 🔔 Log de montaje para comprobar si este componente se está renderizando
  console.log("[FL] MONTADO");

  const { filters, gridRef } = useFilters();
  const nav = useNavigate();

  // ¿Hay algún filtro con valor no vacío?
  const hasFilters = useMemo(() => {
    if (!filters) return false;
    const KEYS = ["q", "min", "max", "brand", "cat", "rating"];
    return KEYS.some(k => String(filters[k] ?? "").trim() !== "");
  }, [filters]);

  // Destacados (sin filtros)
  const destacados = useMemo(
    () => PRODUCTS.filter(p => p.featured).slice(0, 8),
    []
  );

  // Resultados SIEMPRE calculados
  const resultados = useMemo(() => {
    return filterItems(PRODUCTS, filters || {});
  }, [filters]);

  // Logs de diagnóstico (podés borrarlos luego)
  console.log("[FL] filters:", filters);
  console.log("[FL] hasFilters:", hasFilters, "resultados:", resultados.length);

  // Scroll / highlight al cambiar filtros o resultados
  useEffect(() => {
    if (!hasFilters) return;

    if (GO_TO_DETAIL_ON_SINGLE && resultados.length === 1) {
      nav(`/producto/${resultados[0].id}`);
      return;
    }

    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    if (resultados.length) {
      const el = document.querySelector(`[data-prod-id="${resultados[0].id}"]`);
      el?.classList.add("hit");
      const t = setTimeout(() => el?.classList.remove("hit"), 1200);
      return () => clearTimeout(t);
    }
  }, [hasFilters, resultados, nav, gridRef]);

  // Con filtros → resultados; sin filtros → destacados
  if (hasFilters) {
    return (
      <section ref={gridRef} style={{ display: "grid", gap: 16 }}>
        <h3 style={{ margin: "0 0 8px" }}>
          🔎 Resultados {resultados.length ? `(${resultados.length})` : ""}
        </h3>

        {resultados.length ? (
          <div
            className="grid grid--products"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 16
            }}
          >
            {resultados.map(p => (
              <Link
                key={p.id}
                to={`/producto/${p.id}`}
                data-prod-id={p.id}
                style={{
                  display: "grid",
                  gap: 10,
                  padding: 12,
                  borderRadius: 12,
                  background: "#fff",
                  textDecoration: "none",
                  color: "#111",
                  boxShadow: "0 6px 20px rgba(0,0,0,.06)"
                }}
              >
                <ProductImage product={p} alt={p.title} height={160} />
                <div style={{ fontWeight: 600 }}>{p.title}</div>
                <div style={{ color: "#ff4d4f", fontWeight: 700 }}>
                  ${Number(p.price || 0).toLocaleString("es-AR")}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ padding: "12px 8px" }}>
            No encontramos resultados para “{filters?.q || ""}”.
          </p>
        )}
      </section>
    );
  }

  // Vista original de destacados (sin filtros)
  return (
    <section style={{ display: "grid", gap: 16 }}>
      <h3 style={{ margin: "0 0 8px" }}>⭐ DESTACADOS</h3>
      <div
        className="grid grid--products"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16
        }}
      >
        {destacados.map(p => (
          <Link
            key={p.id}
            to={`/producto/${p.id}`}
            data-prod-id={p.id}
            style={{
              display: "grid",
              gap: 10,
              padding: 12,
              borderRadius: 12,
              background: "#fff",
              textDecoration: "none",
              color: "#111",
              boxShadow: "0 6px 20px rgba(0,0,0,.06)"
            }}
          >
            <ProductImage product={p} alt={p.title} height={160} />
            <div style={{ fontWeight: 600 }}>{p.title}</div>
            <div style={{ color: "#ff4d4f", fontWeight: 700 }}>
              ${Number(p.price || 0).toLocaleString("es-AR")}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
