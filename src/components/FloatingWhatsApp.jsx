import { useState, useMemo } from "react";
import { BUSINESS } from "../config/business";

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);

  const waHref = useMemo(() => {
    const t = BUSINESS.whatsappMsg || "Hola, quiero hacer una consulta.";
    return `https://wa.me/${BUSINESS.phoneE164}?text=${encodeURIComponent(t)}`;
  }, []);

  const telHref = `tel:${BUSINESS.phoneE164.replace(/^\+?/, "+")}`;

  return (
    <>
      {/* FABs */}
      <div className="fab-stack" aria-label="Acciones rápidas">
        {/* Soporte técnico (abre sheet) */}
        <button
          className="fab fab--support"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open ? "true" : "false"}
          aria-controls="support-sheet"
          title="Soporte técnico"
        >
          {/* llave inglesa */}
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path fill="#fff" d="M22 19.59 19.59 22 12 14.41 14.41 12 22 19.59zM9 13a4 4 0 1 1 0-8 4 4 0 0 1 3.46 2.01l-2.83 2.83A2 2 0 1 1 9 9L6.17 6.17A4 4 0 0 1 9 13z"/>
          </svg>
        </button>

        {/* WhatsApp directo */}
        <a
          className="fab fab--whatsapp"
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`WhatsApp ${BUSINESS.phoneShown}`}
          title="Escribir por WhatsApp"
        >
          {/* Logo WhatsApp “oficial” (burbuja + teléfono) en blanco */}
          <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
            <path fill="#fff" d="M27.1 4.9A13.9 13.9 0 0 0 16 1.5 13 13 0 0 0 3 14.5c0 2.3.6 4.5 1.8 6.5L3 30.5l9.8-1.7c2 1.2 4.1 1.7 6.2 1.7a13 13 0 0 0 13-13c0-3.3-1.3-6.3-1.9-6.6ZM16 25.5a11 11 0 1 1 0-22 11 11 0 0 1 0 22Z"/>
            <path fill="#fff" d="M21.9 17.6c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1l-1 1.1c-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.5-1-.9-1.5-1.7-1.7-2-.2-.3 0-.5.1-.7l.4-.5c.1-.2.2-.3.3-.5.1-.2.1-.4 0-.5-.1-.2-.7-1.6-.9-2.1-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1.1-1 2.5.1 1.4 1 2.8 1.2 3.1.2.2 2 3.1 4.9 4.3 3 1.2 3 .8 3.5.8.5 0 1.7-.7 2-1.4.2-.7.2-1.3.1-1.5-.1-.1-.3-.2-.5-.3Z"/>
          </svg>
        </a>
      </div>

      {/* Overlay */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* Sheet con datos de Néstor */}
      <div
        id="support-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-title"
        className={`sheet ${open ? "sheet--open" : ""}`}
      >
        <div className="sheet__body">
          <button
            className="sheet__close"
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
          >
            ×
          </button>

          <div className="sheet__handle" />

          <h3 id="support-title" className="sheet__title">Soporte técnico</h3>

          <div style={{display:"grid", gap:10, padding:"0 8px"}}>
            <strong style={{fontSize:"1.05rem"}}>
              {BUSINESS.technician}
            </strong>
            <ul style={{margin:"6px 0 0 18px"}}>
              {BUSINESS.specialties.map((s, i) => <li key={i}>{s}</li>)}
            </ul>

            <div style={{display:"grid", gap:6, marginTop:8}}>
              <div><b>Teléfono:</b> {BUSINESS.phoneShown}</div>

              <div>
                <b>Horarios:</b>{" "}
                {BUSINESS.hours.map((h, i) => (
                  <span key={i}>
                    {i>0 && " · "}{h.days} {h.time}
                  </span>
                ))}
              </div>

              <div>
                <b>Zonas:</b> {BUSINESS.areas.join(" · ")}
              </div>
            </div>

            <div style={{display:"flex", gap:10, marginTop:12, flexWrap:"wrap"}}>
              <a className="btn btn--primary" href={waHref} target="_blank" rel="noopener noreferrer">
                Solicitar turno por WhatsApp
              </a>
              <a className="btn" href={telHref}>
                Llamar ahora
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
