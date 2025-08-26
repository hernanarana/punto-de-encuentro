// src/utils/asset.js

/**
 * Devuelve la URL correcta para un archivo dentro de /public,
 * respetando el BASE_URL (GitHub Pages) o "/" (Vercel/Local).
 * Ejemplos:
 *   asset("logo-pe.png")           -> "/logo-pe.png" o "/punto-de-encuentro/logo-pe.png"
 *   asset("productos/foto1.jpg")   -> "/productos/foto1.jpg" o "/punto-de-encuentro/productos/foto1.jpg"
 */
export function asset(path = "") {
  if (!path) return "";
  const base = (import.meta && import.meta.env && import.meta.env.BASE_URL) || "/";
  // evita dobles barras
  return (base + path).replace(/\/\/+/g, "/");
}

/**
 * Si "path" es una URL absoluta (http/https), la deja tal cual.
 * Si es relativo (dentro de /public), lo pasa por asset().
 */
export function assetOrUrl(path = "") {
  if (!path) return "";
  // ¡IMPORTANTE!: dos barras tras el colon — ^https?:\/\/
  return /^https?:\/\//i.test(path) ? path : asset(path);
}
