import { useEffect, useRef, useState } from "react";

export default function FABs({ whatsappNumber = "5491133619275" }) {
  const [open, setOpen] = useState(false);
  const bodyOverflowBefore = useRef("");

  // Cerrar con ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (open) {
      bodyOverflowBefore.current = document.body.style.overflow || "";
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = bodyOverflowBefore.current;
    }
    return () => {
      document.body.style.overflow = bodyOverflowBefore.current;
    };
  }, [open]);

  const waHref = `https://wa.me/${whatsappNumber}`;

  return (
    <>
     

      {/* FAB WhatsApp (logo original) */}
      <a
        className="fab"
        aria-label="WhatsApp"
        title="WhatsApp"
        href={waHref}
        target="_blank"
        rel="noreferrer noopener"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          width="28"
          height="28"
        />
      </a>

      {/* SHEET / MODAL */}
      <div
        className={`sheet ${open ? "sheet--open" : ""}`}
        aria-hidden={!open}
        // 👇 cerramos tocando el fondo (overlay)
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div
          className="sheet__body"
          role="dialog"
          aria-modal="true"
          aria-label="Soporte técnico"
        >
          <div className="sheet__handle" />
          <button
            className="sheet__close"
            aria-label="Cerrar"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>

          <h3 className="sheet__title">Soporte técnico</h3>

          <div style={{ display: "grid", gap: 8 }}>
            <strong>Néstor Raúl Verón</strong>
            <div>Colocación y reparación de aires acondicionados</div>
            <div>Reparación de heladeras / freezers</div>
            <div>Instalaciones eléctricas menores</div>
            <div>Horarios: Lun a Sáb 9:00–19:00 · Urgencias 24 hs</div>

            <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
              <a className="btn btn--whatsapp" href={waHref} target="_blank" rel="noreferrer noopener">
                WhatsApp
              </a>
              <a className="btn" href="tel:+5491166677788">
                Llamar +54 9 11 6667-7788
              </a>
              <a className="btn" href="mailto:soporte@puntoencuentro.com">
                Enviar email
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
