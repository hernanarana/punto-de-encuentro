import { Link } from "react-router-dom";
const toSlug = (s="") => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

export default function ProductCard({ product }) {
  const img = product.image || product.images?.[0];
  const pid = product.slug || product.id || toSlug(product.title);

  return (
    <article className="card">
      <Link to={`/producto/${pid}`} style={{display:"block"}}>
        <img src={img} alt={product.title} className="card-img" loading="lazy" />
      </Link>
      <h4 className="clamp-2" style={{margin:"0 0 4px"}}>
        <Link to={`/producto/${pid}`} style={{textDecoration:"none", color:"inherit"}}>{product.title}</Link>
      </h4>
      {product.rating && <div style={{color:"#ffb400"}}>{"★".repeat(Math.round(product.rating))}</div>}
      <div style={{fontWeight:800}}>${Number(product.price||0).toLocaleString("es-AR")}</div>
      <Link to={`/producto/${pid}`} className="btn btn--primary" style={{textAlign:"center"}}>Ver</Link>
    </article>
  );
}
