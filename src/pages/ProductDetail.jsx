import { useParams } from "react-router-dom";
import PRODUCTS from "../data/products";
import { assetOrUrl } from "../utils/asset";

export default function ProductDetail() {
  const { id } = useParams();
  const product = PRODUCTS.find(p => String(p.id) === String(id));
  if (!product) return <p style={{padding:16}}>Producto no encontrado.</p>;

  const mainImg = assetOrUrl(product.image);
  const gallery = (product.gallery || []).map(assetOrUrl);

  return (
    <section className="product-detail">
      <div className="media">
        <img src={mainImg} alt={product.title} />
        {!!gallery.length && (
          <div className="thumbs">
            {gallery.map((g,i) => <img key={i} src={g} alt={`${product.title} ${i+1}`} />)}
          </div>
        )}
      </div>

      <div className="info">
        <h1>{product.title}</h1>
        {/* resto: precio, descripción, botón WhatsApp, etc. */}
      </div>
    </section>
  );
}
