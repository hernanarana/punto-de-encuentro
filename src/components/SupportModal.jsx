// src/components/SupportModal.jsx
import { useEffect, useState, useCallback } from "react";

export default function SupportModal({
  open: controlledOpen,
  onClose: controlledOnClose,
  whatsappNumber = "5491112345678",
  presetMessage = "Hola, necesito soporte técnico.",
  title = "Soporte técnico",
  subtitle = "CABA / GBA · Lun–Sáb 9:00–19:00",
}) {
  // Soporta controlado (props) o no-controlado (eventos custom)
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = typeof controlledOpen === "boolean";
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const close = useCallback(() => {
    if (isControlled) {
      controlledOnClose?.();
    } else {
      setUncontrolledOpen(false);
    }
  }, [isControlled, controlledOnClose]);

  // Eventos custom (compatibilidad con tu implementación actual)
  useEffect(() => {
    if (isControlled) return;
    const onOpen = () => setUncontrolledOpen(true);
    const onClose = () => setUncontrolledOpen(false);
    window.addEventListener("open-support", onOpen);
    window.addEventListener("close-support", onClose);
    return () => {
      window.removeEventListener("open-support", onOpen);
      window.removeEventListener("close-support", onClose);
    };
  }, [isControlled]);

  // ESC + scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  if (!open) return null;

  const waHref =
    "https://wa.me/" +
    whatsappNumber +
    "?text=" +
    encodeURIComponent(presetMessage);

  return (
    <div
      className="modal-backdrop"
      onClick={close}
      role="presentation"
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
          <img src="/logo-pe.png" alt="" width="28" height="28" style={{ borderRadius: 8 }} />
          <div>
            <h3 id="support-title" style={{ margin: 0 }}>{title}</h3>
            {subtitle && <small style={{ color: "#64748b" }}>{subtitle}</small>}
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar"
            style={{
              marginLeft: "auto",
              background: "transparent",
              border: 0,
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        <ul style={{ margin: "8px 0 16px" }}>
          <li>Colocación e instalación de aires acondicionados</li>
          <li>Mantenimiento y carga de gas</li>
          <li>Reparación de heladeras y freezers</li>
          <li>Diagnóstico a domicilio</li>
        </ul>

        <div className="modal-actions">
          <a
            className="btn btn--whatsapp"
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
          <a className="btn btn--primary" href={`tel:+${whatsappNumber}`}>
            Llamar: +{whatsappNumber}
          </a>
          <button type="button" className="btn" onClick={close}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
