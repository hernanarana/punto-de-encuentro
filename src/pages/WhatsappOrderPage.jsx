// src/pages/WhatsappOrderPage.jsx
import { useEffect, useState } from "react";
import { getWhatsappCart, clearWhatsappCart } from "../utils/whatsappCart.js";

const WHATSAPP_PHONE = "5491133619275"; // tu número
const WHATSAPP_BASE_MSG =
  'Hola! Vengo desde "Punto de Encuentro" y quisiera hacer una consulta.';

const STORAGE_KEY = "wspCart";

function formatAR(v) {
  return Number(v || 0).toLocaleString("es-AR");
}

export default function WhatsappOrderPage() {
  const [items, setItems] = useState([]);

  // Cargar carrito al entrar
  useEffect(() => {
    try {
      const cart = getWhatsappCart() || [];
      setItems(cart);
    } catch {
      setItems([]);
    }
  }, []);

  // Actualizar cantidad
    const handleQtyChange = (id, value) => {
    const qty = Math.max(1, parseInt(value, 10) || 1);

    const next = items.map((item) =>
      item.id === id ? { ...item, qty } : item
    );

    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    // 🔔 avisar cambio
    window.dispatchEvent(new Event("wspCart:updated"));
  };


  // Quitar producto
   const handleRemove = (id) => {
    const next = items.filter((item) => item.id !== id);
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    // 🔔 avisar cambio
    window.dispatchEvent(new Event("wspCart:updated"));
  };


  // Vaciar carrito
   const handleClear = () => {
    try {
      clearWhatsappCart?.();
    } catch {}
    localStorage.removeItem(STORAGE_KEY);
    setItems([]);

    // 🔔 avisar cambio
    window.dispatchEvent(new Event("wspCart:updated"));
  };


  const total = items.reduce(
    (acc, it) => acc + (it.price || 0) * (it.qty || 1),
    0
  );

  const handleSendWhatsapp = () => {
    if (!items.length) return;

    const lines = items.map(
      (it) =>
        `• ${it.title} — x${it.qty || 1} — $${formatAR(
          (it.price || 0) * (it.qty || 1)
        )}`
    );

    const msg =
      `${WHATSAPP_BASE_MSG}\n\n` +
      `Detalle del pedido:\n` +
      lines.join("\n") +
      `\n\nTotal aproximado: $${formatAR(total)}\n\n` +
      `¿Me podés confirmar stock y coordinar el pago/entrega?`;

    const url =
      "https://wa.me/" + WHATSAPP_PHONE + "?text=" + encodeURIComponent(msg);

    window.open(url, "_blank");
  };

  return (
    <div
      style={{
        color: "#fff",
        padding: "16px 16px 96px",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          background: "rgba(15,23,42,0.95)",
          borderRadius: 18,
          padding: 20,
          boxShadow: "0 18px 45px rgba(0,0,0,.45)",
          border: "1px solid rgba(148,163,184,0.3)",
        }}
      >
        <h1
          style={{
            marginBottom: 12,
            fontSize: 24,
            fontWeight: 800,
          }}
        >
          Pedido por WhatsApp
        </h1>

        {!items.length ? (
          <p style={{ color: "#e5e7eb", marginBottom: 0 }}>
            Todavía no agregaste productos al pedido.
          </p>
        ) : (
          <>
            <p
              style={{
                color: "#cbd5f5",
                fontSize: 14,
                marginBottom: 12,
              }}
            >
              Revisá los productos, ajustá cantidades y luego mandá el pedido
              por WhatsApp para coordinar con el local.
            </p>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 12px 0",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {items.map((it) => (
                <li
                  key={it.id}
                  style={{
                    borderRadius: 12,
                    background:
                      "linear-gradient(135deg,#020617,#020617 40%,#0f172a)",
                    padding: 10,
                    color: "#e5e7eb",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 15 }}>
                    {it.title}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      fontSize: 14,
                      flexWrap: "wrap",
                    }}
                  >
                    <span>
                      Precio unitario:{" "}
                      <strong>${formatAR(it.price || 0)}</strong>
                    </span>

                    <span>•</span>

                    <label>
                      Cantidad:{" "}
                      <input
                        type="number"
                        min="1"
                        value={it.qty || 1}
                        onChange={(e) =>
                          handleQtyChange(it.id, e.target.value)
                        }
                        style={{
                          width: 60,
                          padding: "3px 6px",
                          borderRadius: 8,
                          border: "1px solid #475569",
                          background: "#020617",
                          color: "#e5e7eb",
                          fontSize: 13,
                        }}
                      />
                    </label>

                    <button
                      onClick={() => handleRemove(it.id)}
                      style={{
                        marginLeft: "auto",
                        border: "none",
                        borderRadius: 999,
                        padding: "4px 10px",
                        background: "#ef4444",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div
              style={{
                marginTop: 4,
                marginBottom: 12,
                color: "#e5e7eb",
                fontSize: 15,
              }}
            >
              Total aproximado:{" "}
              <strong style={{ fontSize: 16 }}>
                ${formatAR(total)}
              </strong>
            </div>

            <button
              onClick={handleSendWhatsapp}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 999,
                border: "none",
                background:
                  "linear-gradient(135deg,#16a34a,#22c55e,#4ade80)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                marginBottom: 8,
                boxShadow: "0 12px 30px rgba(34,197,94,0.45)",
              }}
            >
              Enviar pedido por WhatsApp
            </button>

            <button
              onClick={handleClear}
              style={{
                width: "100%",
                padding: "10px 16px",
                borderRadius: 999,
                border: "1px solid #64748b",
                background: "transparent",
                color: "#cbd5f5",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Vaciar pedido
            </button>
          </>
        )}
      </div>
    </div>
  );
}
