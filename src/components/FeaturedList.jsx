import { Link } from "react-router-dom";
import PRODUCTS from "../data/products.js";

export default function FeaturedSidebar() {
  const destacados = PRODUCTS.filter(p => p.featured).slice(0, 5);

  return (
    <aside style={{display:"grid", gap:12}}>
      <h3 style={{margin:"0 0 8px"}}>⭐ DESTACADOS</h3>
      {destacados.map(p => (
        <Link key={p.id} to={`/producto/${p.id}`} style={{
          display:"grid", gridTemplateColumns:"80px 1fr", gap:12,
          padding:10, borderRadius:12, background:"#fff", textDecoration:"none", color:"#111",
          boxShadow:"0 6px 20px rgba(0,0,0,.06)"
        }}>
          <img src={p.image || p.images?.[0]} alt={p.title}
               style={{width:80, height:80, objectFit:"cover", borderRadius:8}}/>
          <div>
            <div style={{fontWeight:600, marginBottom:4}}>{p.title}</div>
            <div style={{color:"#ff4d4f", fontWeight:700}}>${p.price?.toLocaleString("es-AR")}</div>
          </div>
        </Link>
      ))}
    </aside>
  );
}
