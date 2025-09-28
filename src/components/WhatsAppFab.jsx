// src/components/WhatsAppFab.jsx
export default function WhatsAppFab(){
  const tel = "5491166677788"; // el mismo de soporte
  return (
    <a
      className="wa-fab"
      href={`https://wa.me/${tel}?text=${encodeURIComponent("Hola, quisiera hacer una consulta 👋")}`}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
      title="Escribinos por WhatsApp"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="" style={{ width:26, height:26 }}
      />
    </a>
  );
}
