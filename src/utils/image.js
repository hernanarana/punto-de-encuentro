export function validateImage(file) {
  const ok = ["image/jpeg", "image/png", "image/webp"];
  const max = 2 * 1024 * 1024; // 2MB
  if (!ok.includes(file.type)) return "Solo JPG, PNG o WEBP.";
  if (file.size > max) return "La imagen no puede superar los 2MB.";
  return null;
}
