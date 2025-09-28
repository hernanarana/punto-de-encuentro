import { useState } from "react";

export default function SupportFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="fab fab--top"
        aria-label="Soporte técnico"
        title="Soporte técnico"
        onClick={() => setOpen(true)}
      >
        {/* ícono llave inglesa */}
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#fff" d="M22 19.6L17.7 15.3a5 5 0 0 1-6.1-6.1L7.6 5.2L5.2 7.6l2 2l-1.8 1.8l-2-2L1 11.8l2.1 2.1l2 2L7 16l2 2l-1 .9l2 2L12 20l-2-2l1.8-1.8l2 2l2.4-2.4l1.8 1.8L22 19.6z"/>
        </svg>
      </button>

      <div className={`sheet ${open ? "sheet--open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="support-title">
        <div className="sheet__body" onClick={(e) => e.stopPropagation()}>
          <div className="sheet__handle" />
          <button className="sheet__close" aria-label="Cerrar" onClick={() => setOpen(false)}>✕</button>
          <h2 id="support-title" className="sheet__title">Soporte técnico</h2>

          <div style={{display:"grid", gap:10}}>
            <strong>Néstor Verón Peralta</strong>
            <div style={{opacity:.9}}>
              Reparación de <b>heladeras</b>, <b>aires acondicionados</b>, freezers, lavarropas y más.
              Servicio a domicilio. Presupuesto sin cargo.
            </div>

            <div style={{display:"grid", gap:8, marginTop:6}}>
              <a className="btn btn--primary" href="https://wa.me/5491112345678?text=Hola%20N%C3%A9stor%2C%20necesito%20soporte%20t%C3%A9cnico" target="_blank" rel="noopener noreferrer">
                Escribir por WhatsApp
              </a>
              <a className="btn" href="tel:+5491112345678">Llamar: +54 9 11 1234-5678</a>
            </div>

            <div style={{fontSize:13, opacity:.8}}>
              Horario de atención: Lun–Sáb 9 a 19 h
            </div>
          </div>
        </div>
      </div>

      {/* cierre al tocar fuera */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}
    </>
  );
}
