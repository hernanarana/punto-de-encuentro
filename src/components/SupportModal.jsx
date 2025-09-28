export default function SupportModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="sheet sheet--open" role="dialog" aria-modal="true">
      <div className="sheet__body" style={{ maxWidth: 560 }}>
        <div className="sheet__handle" />
        <h3 className="sheet__title">Soporte técnico</h3>

        <h4 style={{ margin: "6px 0 4px" }}>Néstor Raúl Verón</h4>
        <ul className="ul-clean" style={{ lineHeight: 1.6 }}>
          <li>• Colocación y reparación de aires acondicionados</li>
          <li>• Reparación de heladeras / freezers</li>
          <li>• Instalaciones eléctricas menores</li>
          <li>• Horarios: Lun a Sáb 9:00–19:00 · Urgencias 24 hs</li>
        </ul>

        <div className="modal-actions">
          <a
            className="btn btn--whatsapp"
            href="https://wa.me/5491112345678?text=Hola%20Néstor,%20necesito%20soporte%20técnico"
            target="_blank"
            rel="noreferrer"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
              <path
                fill="#fff"
                d="M20.5 3.5A11.7 11.7 0 0 0 12 1C6.5 1 2 5.5 2 11c0 1.9.5 3.7 1.5 5.3L2 23l6-1.6A10.9 10.9 0 0 0 12 21c5.5 0 10-4.5 10-10 0-2.6-1-5-2.5-7.5zM12 19.5c-1.6 0-3.1-.5-4.4-1.3l-.3-.2-3.6 1 1-3.5-.2-.4A7.5 7.5 0 1 1 19.5 12 7.5 7.5 0 0 1 12 19.5zm4.3-5.6c-.2-.1-1.2-.6-1.3-.6-.2-.1-.4-.1-.6.1-.2.2-.7.7-.9.8-.2.1-.3.1-.5 0-.2-.1-.9-.3-1.7-1.1-.6-.6-1.1-1.3-1.2-1.5-.1-.2 0-.3.1-.5l.4-.5c.1-.2.1-.3 0-.5l-.6-1.4c-.2-.4-.4-.3-.6-.3h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.3s1 2.7 1.1 2.9c.1.2 2 3.1 4.8 4.2.7.3 1.2.4 1.6.5h.7c.2 0 .5 0 .8-.2.3-.2 1-1 1.1-1.3.1-.3.1-.6 0-.7-.1-.1-.2-.2-.4-.3z"
              />
            </svg>
            WhatsApp
          </a>
          <a className="btn" href="tel:+5491166677788">Llamar +54 9 11 6667-7788</a>
          <a className="btn" href="mailto:soporte@punto.com">Enviar email</a>
          <button className="btn" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
