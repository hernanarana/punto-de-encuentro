// src/utils/asset.js
export function assetOrUrl(input) {
  if (!input) return "/productos/placeholder.jpg";
  if (typeof input !== "string") return "/productos/placeholder.jpg";
  if (/^https?:\/\//i.test(input)) return input;

  // normalizo: "productos/a.jpg" -> "/productos/a.jpg"
  const clean = input.replace(/^\.?\//, "");     // quita "./" o inicio con "/"
  return `/${clean}`;
}
