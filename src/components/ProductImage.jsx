import React from "react";

export default function ProductImage({
  src,
  alt = "",
  height = 220,
  contain = false, // true en detalle, false en cards
}) {
  const fallback = "/productos/placeholder.jpg";

  return (
    <div className="card__thumb" style={{ height }}>
      <img
        src={src || fallback}
        alt={alt}
        loading="lazy"
        onError={(e) => {
          // evita loop
          const url = new URL(e.currentTarget.src);
          if (!url.pathname.endsWith("placeholder.jpg")) {
            e.currentTarget.src = fallback;
          }
        }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: contain ? "contain" : "cover",
          display: "block",
        }}
      />
    </div>
  );
}
