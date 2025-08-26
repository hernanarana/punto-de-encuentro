// src/utils/asset.js
export const asset = (path = "") =>
  `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, "")}`;




<img src={asset("logo-pe.png")} alt="Punto de Encuentro" />
<img src={asset("productos/aspiradora.jpg")} alt="Aspiradora" />
