import { useMemo, useState } from "react";
import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products, selectedPrice, pageSize=12 }) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(products.length / pageSize));
  const start = (page-1)*pageSize;
  const view = products.slice(start, start+pageSize);

  useMemo(()=>{ setPage(1); }, [selectedPrice, products.length]);

  return (
    <div>
      <div className="card-grid">
        {view.map(p => <ProductCard key={p.id ?? p.slug ?? p.title} product={p} />)}
        {view.length === 0 && <p>No hay productos para los filtros seleccionados.</p>}
      </div>

      {pages > 1 && (
        <div style={{display:"flex", gap:8, justifyContent:"center", marginTop:16}}>
          <button className="btn btn--ghost" disabled={page===1} onClick={()=>setPage(p=>p-1)}>&laquo;</button>
          {Array.from({length:pages}, (_,i)=>i+1).slice(0,6).map(n=>(
            <button key={n}
              className="btn"
              style={{background: n===page ? "var(--primary)" : "#fff", color: n===page ? "#fff" : "var(--text)"}}
              onClick={()=>setPage(n)}
            >{n}</button>
          ))}
          <button className="btn btn--ghost" disabled={page===pages} onClick={()=>setPage(p=>p+1)}>&raquo;</button>
        </div>
      )}
    </div>
  );
}
