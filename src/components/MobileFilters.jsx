// src/components/MobileFilters.jsx
import { useEffect, useRef } from "react";

/**
 * Modal de filtros para móvil (scrollable + accesible)
 *
 * Props:
 * - open: boolean
 * - title?: string (default "Filtros")
 * - onClose: () => void
 * - onApply?: () => void   (si no se pasa, usa onClose)
 * - onClear?: () => void   (opcional)
 * - children: contenido del panel de filtros
 *
 * Uso:
 * <MobileFilters
 *   open={showFilters}
 *   onClose={()=>setShowFilters(false)}
 *   onApply={()=>setShowFilters(false)}
 *   onClear={clearAll}
 * >
 *   <FilterSidebar ... />
 * </MobileFilters>
 */
export default function MobileFilters({
  open,
  title = "Filtros",
  onClose,
  onApply,
  onClear,
  children,
}) {
  const dialogRef = useRef(null);

  // Bloquea scroll del body y soporta Escape
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);

    // foco inicial
    const t = setTimeout(() => dialogRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mf-title"
        ref={dialogRef}
        tabIndex={-1}
      >
        {/* Header fijo dentro del modal */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            position: "sticky",
            top: 0,
            background: "#fff",
            paddingBottom: 8,
            zIndex: 1,
          }}
        >
          <h3 id="mf-title" style={{ margin: 0 }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              marginLeft: "auto",
              border: "none",
              background: "transparent",
              fontSize: 22,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div style={{ display: "grid", gap: 12 }}>{children}</div>

        {/* Footer fijo con acciones */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 12,
            position: "sticky",
            bottom: 0,
            background: "#fff",
            paddingTop: 8,
          }}
        >
          {onClear && (
            <button className="btn btn--ghost" style={{ flex: 1 }} onClick={onClear}>
              Limpiar
            </button>
          )}
          <button
            className="btn btn--primary"
            style={{ flex: 1 }}
            onClick={onApply ?? onClose}
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}
