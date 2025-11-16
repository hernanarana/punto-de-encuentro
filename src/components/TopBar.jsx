// src/components/TopBar.jsx
import { PHONE_E164, PHONE_SHOWN, DEFAULT_MSG } from "../config";

export default function TopBar() {
  const waHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(
    DEFAULT_MSG || "Hola, quiero hacer una consulta."
  )}`;

  return (
    <div className="topbar only-desktop">
      <div className="container topbar-row">
        <span className="label">Atención personalizada por WhatsApp</span>
        <a className="tel" href={waHref} target="_blank" rel="noopener noreferrer">
          {/* ícono */}
          <svg width="16" height="16" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="16" fill="#fff" opacity=".2" />
            <path
              fill="#fff"
              d="M26.88 5.12A13.9 13.9 0 0 0 16 1.5C8.84 1.5 3 7.34 3 14.5c0 2.3.6 4.51 1.76 6.47L3 30.5l9.77-1.71A13.94 13.94 0 0 0 16 27.5c7.16 0 13-5.84 13-13s-2.1-7.77-2.12-7.88Z"
            />
          </svg>
          {PHONE_SHOWN}
        </a>
      </div>
    </div>
  );
}
