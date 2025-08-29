// src/components/ProductImage.jsx
import { useState, useMemo } from "react";
import { assetOrUrl } from "../utils/asset";

export default function ProductImage({ product, src, alt = "", ...imgProps }) {
  const [err, setErr] = useState(false);

  const computed = useMemo(() => {
    const s =
      src ||
      product?.image ||
      (Array.isArray(product?.images) ? product.images[0] : null) ||
      "productos/placeholder.jpg";
    return assetOrUrl(s);
  }, [src, product]);

  const finalSrc = err ? "/productos/placeholder.jpg" : computed;

  return (
    <img
      src={finalSrc}
      alt={alt}
      loading="lazy"
      onError={() => setErr(true)}
      {...imgProps}
    />
  );
}
