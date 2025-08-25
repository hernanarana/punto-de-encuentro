// src/components/MobileCategoriesSheet.jsx
import { Link } from "react-router-dom";

const CATS = [
  "Indumentaria",
  "Ferretería",
  "Tecnología",
  "Hogar",
  "Electrodomésticos",
  "Herramientas",
  "Jardinería",
  "Ofertas",
];

const toSlug = (s="") =>
  s.toLowerCase()
   .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
   .replace(/[^a-z0-9]+/g,"-")
   .replace(/(^-|-$)/g,"");

export default function MobileCategoriesSheet({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <div style={{display:"flex", alignItems:"center", marginBottom:8}}>
          <h3 style={{margin:0}}>Categorías</h3>
          <button
            onClick={onClose}
            style={{marginLeft:"auto", border:"none", background:"transparent", fontSize:22, cursor:"pointer"}}
          >×</button>
        </div>

        <div className="cat-grid">
          {CATS.map(c => (
            <Link
              key={c}
              to={`/categoria/${toSlug(c)}`}
              onClick={onClose}
              className="cat-button"
            >
              {c}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
