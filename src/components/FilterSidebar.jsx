// Sidebar de filtros simple (placeholder)
export default function FilterSidebar() {
  return (
    <aside style={{display:"grid", gap:12}}>
      <div style={{background:"#fff", border:"1px solid #e7ecf3", borderRadius:12, padding:12, boxShadow:"0 6px 20px rgba(0,0,0,.04)"}}>
        <h3 style={{margin:"0 0 8px"}}>Categorías</h3>
        <label style={{display:"block", marginBottom:6}}>
          <input type="checkbox" /> Hogar
        </label>
        <label style={{display:"block", marginBottom:6}}>
          <input type="checkbox" /> Herramientas
        </label>
        <label style={{display:"block"}}>
          <input type="checkbox" /> Tecnología
        </label>
      </div>

      <div style={{background:"#fff", border:"1px solid #e7ecf3", borderRadius:12, padding:12, boxShadow:"0 6px 20px rgba(0,0,0,.04)"}}>
        <h3 style={{margin:"0 0 8px"}}>Precio</h3>
        <label style={{display:"block", marginBottom:6}}>
          <input type="radio" name="p" /> Hasta $5.000
        </label>
        <label style={{display:"block", marginBottom:6}}>
          <input type="radio" name="p" /> $5.000 – $15.000
        </label>
        <label style={{display:"block"}}>
          <input type="radio" name="p" /> Más de $50.000
        </label>
      </div>

      <div style={{background:"#fff", border:"1px solid #e7ecf3", borderRadius:12, padding:12, boxShadow:"0 6px 20px rgba(0,0,0,.04)"}}>
        <h3 style={{margin:"0 0 8px"}}>Calificación</h3>
        <div>★★★★★</div>
        <div>★★★★☆</div>
        <div>★★★☆☆</div>
      </div>
    </aside>
  );
}
