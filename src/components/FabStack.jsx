// src/components/FabStack.jsx
import { useEffect, useState } from "react";
import { getWhatsappCart } from "../utils/whatsappCart.js";

// 🔢 lee la cantidad total del carrito (sumando qty)
function readCartCount() {
  try {
    const items = getWhatsappCart?.() || [];
    return items.reduce((acc, it) => acc + (it.qty || 1), 0);
  } catch {
    return 0;
  }
}

export default function FabStack() {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [cartCount, setCartCount] = useState(0); // 👈 NUEVO

  // Teléfono del dueño
  const OWNER_PHONE = "+54 9 11 3361 9275";
  const OWNER_PHONE_DISPLAY = "+54 9 11 3361 9275"; // como querés mostrarlo

  // Normalizaciones y enlaces
  const phoneForWa = OWNER_PHONE.replace(/[^\d]/g, "");
  const waHrefGeneral =
    "https://wa.me/" +
    phoneForWa +
    "?text=" +
    encodeURIComponent(
      'Hola! Vengo desde "Punto de Encuentro" y quisiera hacer una consulta.'
    );
  const waHrefMant =
    "https://wa.me/" +
    phoneForWa +
    "?text=" +
    encodeURIComponent(
      "Hola Néstor, vengo desde la web. Consulto por mantenimiento/reparación."
    );
  const telHref = `tel:+${phoneForWa}`;

  // Detección simple de móvil (para decidir Llamar vs Copiar)
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(
    navigator.userAgent
  );

  // Mini toast para feedback
  const copy = async (txt) => {
    try {
      await navigator.clipboard.writeText(txt);
      setToast("Número copiado");
    } catch {
      setToast("Copiá este número: " + txt);
    } finally {
      setTimeout(() => setToast(""), 1800);
    }
  };

  // ESC para cerrar modal
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // 🔢 Escuchar cambios del carrito y actualizar badge
  useEffect(() => {
    const update = () => {
      setCartCount(readCartCount());
    };

    update(); // leer al inicio

    window.addEventListener("storage", update);
    window.addEventListener("wspCart:updated", update);

    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("wspCart:updated", update);
    };
  }, []);

  return (
    <>
      <div className="fab-stack" aria-label="Accesos rápidos">
        {/* WhatsApp arriba */}
        <a
          className="fab"
          href={waHrefGeneral}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
          title="WhatsApp"
          style={{ position: "relative" }} // para posicionar el badge
        >
          <img src="/wa_orange_pro.svg" alt="WhatsApp" width={56} height={56} />

          {/* 🔢 Badge de carrito */}
          {cartCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                minWidth: 22,
                height: 22,
                padding: "0 6px",
                borderRadius: 999,
                background: "#f97316",
                border: "2px solid #0f172a",
                color: "#fff",
                fontSize: 12,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </a>

        {/* Soporte abajo (lo dejamos como lo tenías, comentado) */}
        {/*
        <button
          className="fab"
          onClick={() => setOpen(true)}
          aria-label="Mantenimiento / Soporte"
          title="Mantenimiento / Soporte"
        >
          <img
            src="/wrench_orange_pro.svg"
            alt="Soporte"
            width={56}
            height={56}
          />
        </button>
        */}
      </div>

      {/* Modal mantenimiento */}
      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              aria-label="Cerrar"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
            <h3 style={{ marginTop: 0 }}>Mantenimiento y Reparaciones</h3>
            <p>
              <strong>Néstor Verón Peralta</strong>
              <br />
              Mantenimiento, reparación y colocación de{" "}
              <strong>aires acondicionados</strong>.
              <br />
              Reparación de <strong>heladeras</strong> y{" "}
              <strong>lavarropas</strong>.
              <br />
              <small>
                Horarios: Lun a Sáb 9:00–19:00 · Dom/Feriados 10:00–16:00
              </small>
            </p>

            {/* Acciones: WhatsApp + Llamar (móvil) / Copiar (desktop) + Cerrar */}
            <div className="modal-actions">
              <a
                className="btn btn--whatsapp"
                href={waHrefMant}
                target="_blank"
                rel="noreferrer"
              >
                Enviar WhatsApp
              </a>

              {isMobile ? (
                <a className="btn" href={telHref}>
                  Llamar
                </a>
              ) : (
                <button
                  className="btn"
                  onClick={() => copy(OWNER_PHONE_DISPLAY)}
                >
                  Copiar número
                </button>
              )}

              <button className="btn" onClick={() => setOpen(false)}>
                Cerrar
              </button>
            </div>

            {/* Número siempre visible */}
            <p style={{ marginTop: 8, fontSize: 14, color: "#475569" }}>
              Teléfono: <strong>{OWNER_PHONE_DISPLAY}</strong>
            </p>
          </div>
        </div>
      )}

      {/* Toast simple */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "#0f172a",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: 8,
            boxShadow: "0 10px 26px rgba(0,0,0,.35)",
            zIndex: 10001,
          }}
        >
          {toast}
        </div>
      )}
    </>
  );
}
