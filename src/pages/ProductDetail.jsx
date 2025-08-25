import { useParams, Link } from "react-router-dom";
import PRODUCTS from "../data/products.js";
import { PHONE_E164, DEFAULT_MSG } from "../config";
import "./productDetail.css";

const toSlug = (s="") => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

export default function ProductDetail() {
  const { id: pid } = useParams();
  const product = PRODUCTS.find(p =>
    String(p.id) === String(pid) ||
    (p.slug && String(p.slug) === String(pid)) ||
    toSlug(p.title) === String(pid)
  );

  if (!product) {
    return (
      <main className="pd-wrap">
        <h2>Producto no encontrado</h2>
        <Link to="/">Volver al catálogo</Link>
      </main>
    );
  }

  const mainImg = product.image || product.images?.[0];
  const waMsg = `Hola! Consulto por "${product.title}" ${(product.category?`(${product.category}) `:"")}${product.price?`a $${Number(product.price).toLocaleString("es-AR")}. `:""}${DEFAULT_MSG||"¿Sigue disponible?"}`;
  const waHref = `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(waMsg)}`;
  const telHref = `tel:${PHONE_E164}`;

  const setMain = (src) => {
    const el = document.querySelector(".pd-mainimg");
    if (el) el.src = src;
  };

  return (
    <>
      <main className="pd-wrap" style={{paddingBottom:96}}>
        <nav className="pd-breadcrumb">
          <Link to="/">Inicio</Link> / {product.category ? <span>{product.category}</span> : null} / <strong>{product.title}</strong>
        </nav>

        <section className="pd-grid">
          <div>
            <img className="pd-mainimg" src={mainImg} alt={product.title} />
            {product.images?.length > 1 && (
              <div className="pd-thumbs">
                {product.images.slice(1).map((src, i) => (
                  <img key={i} src={src} alt={`${product.title} ${i+2}`} className="pd-thumb" onClick={() => setMain(src)} />
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="pd-title clamp-2">{product.title}</h1>

            {product.rating && (
              <p className="pd-rating">
                {"★".repeat(Math.round(product.rating))}
                <span style={{ color: "#64748b", marginLeft: 6 }}>({product.reviews || 0})</span>
              </p>
            )}

            <p className="pd-price">{product.price!==undefined?`$${Number(product.price).toLocaleString("es-AR")}`:"—"}</p>

            <div className="pd-actions">
              <button className="pd-btn">Agregar al carrito</button>
              <a href="#descripcion" className="pd-link">Ver descripción</a>
            </div>

            <a href={waHref} target="_blank" rel="noopener noreferrer" className="pd-wa">
              <svg width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="#25D366"/><path fill="#fff" d="M20.1 17.5c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.3.2-.7.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.7-1.7-2-.2-.3 0-.5.1-.6.1-.2.3-.4.5-.6.1-.2.2-.3.3-.5.1-.2 0-.4-.1-.6-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 .9-1 2.5 0 1.5 1.1 3 1.2 3.2.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.3.2 1.9.1.6-.1 1.8-.7 2.1-1.4.2-.7.2-1.3.1-1.4-.1-.1-.3-.2-.6-.4Z"/></svg>
              <span>Consultar por WhatsApp</span>
            </a>
          </div>
        </section>

        <section id="descripcion" className="pd-section">
          <h2>Descripción</h2>
          <p style={{ lineHeight: 1.6 }}>{product.description || "Sin descripción."}</p>
        </section>

        {product.features?.length ? (
          <section className="pd-section">
            <h3>Características</h3>
            <ul>{product.features.map((f,i)=><li key={i}>{f}</li>)}</ul>
          </section>
        ) : null}
      </main>

      {/* CTA fija inferior (solo móvil) */}
      <div className="pd-cta">
        <a href={telHref} className="btn btn--ghost" style={{textAlign:"center"}}>Llamar</a>
        <a href={waHref} className="btn btn--primary" style={{textAlign:"center"}}>WhatsApp</a>
      </div>
    </>
  );
}
