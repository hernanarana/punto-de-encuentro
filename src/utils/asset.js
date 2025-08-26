// src/utils/asset.js
/**
 * Devuelve la URL correcta para un archivo dentro de /public,
 * respetando el BASE_URL (GH Pages) o "/" (Vercel/Local).
 */
export function asset(path = "") {
  if (!path) return "";
  const base = (import.meta && import.meta.env && import.meta.env.BASE_URL) || "/";
  return (base + path).replace(/\/\/+/g, "/");
}

/**
 * Si "path" es una URL absoluta (http/https), la deja tal cual.
 * Si es relativo (dentro de /public), lo pasa por asset().
 */
export function assetOrUrl(path = "") {
  if (!path) return "";
  return /^https?:\/\/\//i.test(path) ? path : asset(path); // <- OJO: dos //
}
