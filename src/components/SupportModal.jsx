import {
  SUPPORT_NAME, SUPPORT_TITLE, SUPPORT_SERVICES,
  SUPPORT_PHONE_E164, SUPPORT_PHONE_SHOWN,
  SUPPORT_WHATS_MSG, SUPPORT_LOCATION, SUPPORT_HOURS
} from "../config";

export default function SupportModal({ open, onClose }) {
  if (!open) return null;
  const wa = `https://wa.me/${SUPPORT_PHONE_E164}?text=${encodeURIComponent(SUPPORT_WHATS_MSG)}`;
  const tel = `tel:${SUPPORT_PHONE_E164}`;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,.45)",
        display: "grid", placeItems: "center", zIndex: 99999
      }}
    >
      <div
        onClick={(e)=>e.stopPropagation()}
        role="dialog" aria-modal="true"
        style={{
          width: "min(680px, 92vw)",
          background: "#fff",
          borderRadius: 16,
          padding: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,.25)"
        }}
      >
        <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:10}}>
          <img src="/logo-pe.png" alt="" style={{width:36, height:36, borderRadius:8, objectFit:"contain"}}/>
          <div>
            <h2 style={{margin:0}}>{SUPPORT_TITLE}</h2>
            <small style={{color:"#64748b"}}>{SUPPORT_LOCATION} · {SUPPORT_HOURS}</small>
          </div>
          <button onClick={onClose} aria-label="Cerrar" style={{marginLeft:"auto", border:"none", background:"transparent", fontSize:22, cursor:"pointer"}}>×</button>
        </div>

        <h3 style={{margin:"8px 0 4px"}}>{SUPPORT_NAME}</h3>
        <ul style={{margin:"8px 0 16px", paddingLeft:18, lineHeight:1.6}}>
          {SUPPORT_SERVICES.map((s,i)=><li key={i}>{s}</li>)}
        </ul>

        <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
          <a href={tel}
             style={{background:"#ef4444", color:"#fff", textDecoration:"none",
                     padding:"10px 14px", borderRadius:10, fontWeight:800}}>
            Llamar: {SUPPORT_PHONE_SHOWN}
          </a>
          <a href={wa} target="_blank" rel="noopener noreferrer"
             style={{display:"inline-flex", alignItems:"center", gap:10,
                     background:"#25D366", color:"#fff", textDecoration:"none",
                     padding:"10px 14px", borderRadius:10, fontWeight:800}}>
            <svg width="18" height="18" viewBox="0 0 32 32" aria-hidden="true">
              <circle cx="16" cy="16" r="16" fill="#fff" opacity=".15"/>
              <path fill="#fff" d="M26.88 5.12A13.9 13.9 0 0 0 16 1.5C8.84 1.5 3 7.34 3 14.5c0 2.3.6 4.51 1.76 6.47L3 30.5l9.77-1.71A13.94 13.94 0 0 0 16 27.5c7.16 0 13-5.84 13-13s-2.1-7.77-2.12-7.88Zm-10.88 20c-1.86 0-3.7-.5-5.3-1.46l-.38-.23-5.8 1.01 1.05-5.66-.25-.41A11.4 11.4 0 0 1 4.5 14.5c0-6.34 5.16-11.5 11.5-11.5s11.5 5.16 11.5 11.5-5.16 11.5-11.5 11.5Z"/>
              <path fill="#fff" d="M19.11 17.08c-.27-.14-1.6-.79-1.86-.88-.25-.09-.43-.14-.6.14-.18.27-.68.88-.83 1.06-.15.18-.31.2-.58.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.58-1.5-1.85-.15-.27-.02-.42.12-.56.12-.12.27-.31.4-.47.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.06-.14-.6-1.45-.82-1.99-.22-.53-.44-.46-.6-.46h-.51c-.18 0-.47.07-.72.34-.25.27-.94.92-.94 2.24 0 1.33.96 2.62 1.1 2.8.14.18 1.89 2.89 4.59 4.04.64.28 1.14.45 1.53.58.64.2 1.22.17 1.68.1.51-.08 1.6-.65 1.83-1.29.23-.64.23-1.19.16-1.3-.07-.11-.25-.18-.52-.32Z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
