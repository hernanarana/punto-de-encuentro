export default function OfferBanner() {
  return (
    <div style={{
      background:"#ff7a00",
      color:"#fff",
      borderRadius:16,
      padding:"20px 24px",
      boxShadow:"0 10px 30px rgba(0,0,0,.08)"
    }}>
      <h2 style={{margin:"0 0 6px"}}>¡OFERTAS IMPERDIBLES!</h2>
      <p style={{margin:"0 0 12px"}}>
        Hasta 50% OFF en productos seleccionados<br/>Válido hasta fin de mes
      </p>
      <button style={{
        background:"#fff",
        color:"#ff7a00",
        border:"none",
        borderRadius:10,
        padding:"10px 14px",
        cursor:"pointer",
        fontWeight:700
      }}>
        Ver Ofertas
      </button>
    </div>
  );
}
