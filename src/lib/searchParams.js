// src/lib/searchParams.js
export function buildSearchParams({ q = "", cat = "", min = "", max = "", rating = "" } = {}) {
  const p = new URLSearchParams();
  const qv = (q || "").trim();
  const cv = (cat || "").trim().toLowerCase();

  if (qv) p.set("q", qv);
  if (cv && cv !== "todas") p.set("cat", cv);
  if (min !== "" && !Number.isNaN(Number(min))) p.set("min", String(min));
  if (max !== "" && !Number.isNaN(Number(max))) p.set("max", String(max));
  if (rating !== "" && !Number.isNaN(Number(rating))) p.set("rating", String(rating));
  return p;
}

export function readSearchParams(search) {
  const sp = new URLSearchParams(search || "");
  return {
    q: sp.get("q") ?? "",
    cat: sp.get("cat") ?? "",
    min: sp.get("min") ?? "",
    max: sp.get("max") ?? "",
    rating: sp.get("rating") ?? "",
  };
}
