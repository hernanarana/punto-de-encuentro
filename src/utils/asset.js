// Devuelve el path tal cual o desde /public si corresponde
export function assetOrUrl(src = "") {
  if (!src) return "/productos/placeholder.jpg";
  if (src.startsWith("http")) return src;
  return `/${src.replace(/^\/+/, "")}`;
}
