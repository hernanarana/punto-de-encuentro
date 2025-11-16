// src/components/ProductGallery.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import "./ProductGallery.css";

export default function ProductGallery({ images = [], title = "Producto" }) {
  const imgs = useMemo(
    () => Array.from(new Set((images || []).filter(Boolean))),
    [images]
  );

  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [lightbox, setLightbox] = useState(false);

  const boxRef = useRef(null);

  const onMove = (e) => {
    if (!zoom || !boxRef.current) return;
    const r = boxRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };

  useEffect(() => {
    const onKey = (ev) => {
      if (!imgs.length) return;
      if (ev.key === "ArrowRight") setActive((i) => (i + 1) % imgs.length);
      if (ev.key === "ArrowLeft") setActive((i) => (i - 1 + imgs.length) % imgs.length);
      if (ev.key === "Escape") { setZoom(false); setLightbox(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [imgs.length]);

  if (!imgs.length) return null;

  return (
    <div className="pg">
      {/* Thumbs (izquierda / vertical en desktop, horizontal en mobile) */}
      <div className="pg-thumbs" role="list">
        {imgs.map((src, i) => (
          <button
            key={src + i}
            className={`pg-thumb ${i === active ? "is-active" : ""}`}
            onClick={() => { setActive(i); setZoom(false); }}
            role="listitem"
            aria-label={`Ver imagen ${i + 1}`}
          >
            <img src={src} alt={`${title} miniatura ${i + 1}`} loading="lazy" />
          </button>
        ))}
      </div>

      {/* Imagen principal */}
      <div
        className={`pg-main ${zoom ? "is-zoomed" : ""}`}
        ref={boxRef}
        onMouseMove={onMove}
        onMouseLeave={() => setZoom(false)}
        onClick={() => setZoom((z) => !z)} // click: activar/desactivar zoom
        title={zoom ? "Clic para salir del zoom" : "Clic para hacer zoom"}
      >
        <img
          className="pg-img"
          src={imgs[active]}
          alt={title}
          loading="eager"
          style={{
            transform: zoom ? "scale(1.45)" : "scale(1)",   // zoom suave
            transformOrigin: zoomOrigin,
          }}
        />

        {/* Botón ampliar (abre lightbox) */}
        <button
          type="button"
          className="pg-expand"
          aria-label="Ver en grande"
          onClick={(e) => { e.stopPropagation(); setLightbox(true); }}
          title="Ver en grande"
        >
          ⤢
        </button>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="pg-lightbox" onClick={() => setLightbox(false)}>
          <button className="pg-close" aria-label="Cerrar">✕</button>
          <img src={imgs[active]} alt={title} />
          {imgs.length > 1 && (
            <>
              <button
                className="pg-prev"
                onClick={(e) => { e.stopPropagation(); setActive((i) => (i - 1 + imgs.length) % imgs.length); }}
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                className="pg-next"
                onClick={(e) => { e.stopPropagation(); setActive((i) => (i + 1) % imgs.length); }}
                aria-label="Siguiente"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
