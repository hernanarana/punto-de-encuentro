// src/components/CartBubble.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const STORAGE_KEY = "wspCart";

function readCartCount() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const cart = JSON.parse(raw);
    return cart.reduce((acc, it) => acc + (it.qty || 1), 0);
  } catch {
    return 0;
  }
}

export default function CartBubble() {
  const [count, setCount] = useState(readCartCount());

  useEffect(() => {
    const update = () => setCount(readCartCount());

    // leer al inicio
    update();

    // escuchar cambios del carrito (si ya disparás este evento)
    window.addEventListener("wspCart:updated", update);
    // y cambios de localStorage (por las dudas)
    window.addEventListener("storage", update);

    return () => {
      window.removeEventListener("wspCart:updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <Link
      to="/pedido-whatsapp"
      aria-label="Ver pedido por WhatsApp"
      title="Ver pedido por WhatsApp"
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 12,
      }}
    >
      {/* ICONO DE CARRITO (NO TOCA TU LOGO DE WHATSAPP) */}
      <img
        src="/cart_white.svg"
        alt="Carrito"
        width={26}
        height={26}
        style={{ filter: "drop-shadow(0 0 3px rgba(0,0,0,.5))" }}
      />

      {/* BURBUJA CON CANTIDAD */}
      {count > 0 && (
        <span
          style={{
            position: "absolute",
            top: -6,
            right: -10,
            padding: "1px 6px",
            minWidth: 18,
            borderRadius: 999,
            background: "#16a34a",
            border: "2px solid rgba(15,23,42,0.95)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
