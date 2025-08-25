// src/components/WhatsAppWidget.jsx
import { PHONE_E164, DEFAULT_MSG } from "../config";

export default function WhatsAppWidget() {
  const href = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(
    DEFAULT_MSG || "Hola, quiero hacer una consulta."
  )}`;

  return (
    <a
      className="wa-fab"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      title="Chatear por WhatsApp"
    >
      <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill="#25D366"/>
        <path fill="#fff" d="M20.1 17.5c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.3.2-.7.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.7-1.7-2-.2-.3 0-.5.1-.6.1-.2.3-.4.5-.6.1-.2.2-.3.3-.5.1-.2 0-.4-.1-.6-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 .9-1 2.5 0 1.5 1.1 3 1.2 3.2.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.3.2 1.9.1.6-.1 1.8-.7 2.1-1.4.2-.7.2-1.3.1-1.4-.1-.1-.3-.2-.6-.4Z"/>
      </svg>
    </a>
  );
}
