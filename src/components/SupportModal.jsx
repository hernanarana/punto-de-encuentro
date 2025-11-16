// src/components/SupportModal.jsx
export default function SupportModal({ open, onClose }) {
  if (!open) return null;

  const wspHref =
    "https://wa.me/5491133619275?text=" +
    encodeURIComponent(
      "Hola Néstor, vengo desde la web de Punto de Encuentro y necesito soporte técnico."
    );

  return (
    <div className="sheet sheet--open" role="dialog" aria-modal="true">
      <div className="sheet__body" style={{ maxWidth: 560, position: "relative" }}>
        <div className="sheet__handle" />

        <button
          className="sheet__close"
          onClick={onClose}
          aria-label="Cerrar"
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            border: "none",
            borderRadius: 8,
            background: "rgba(15,23,42,.85)",
            color: "#e5e7eb",
            cursor: "pointer",
            padding: "4px 8px",
          }}
        >
          ✕
        </button>

        <h3 className="sheet__title">Soporte técnico</h3>

        <h4 style={{ margin: "6px 0 4px" }}>Néstor Raúl Verón Peralta</h4>
        <ul className="ul-clean" style={{ lineHeight: 1.6, fontSize: 14 }}>
          <li>• Colocación y reparación de aires acondicionados</li>
          <li>• Reparación de heladeras y lavarropas</li>
          <li>• Instalaciones eléctricas menores</li>
          <li>• Horarios: Lun a Sáb 9:00–19:00 · Urgencias 24 hs</li>
        </ul>

        <div className="modal-actions" style={{ marginTop: 12, gap: 8 }}>
          <a
            className="btn btn--whatsapp"
            href={wspHref}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp a Néstor
          </a>

          <a className="btn" href="tel:+5491133619275">
            Llamar +54 9 11 3361-9275
          </a>

          <button className="btn" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
