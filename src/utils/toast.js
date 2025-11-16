export function showToast(msg = "Listo!") {
  const div = document.createElement("div");
  div.textContent = msg;

  Object.assign(div.style, {
    position: "fixed",
    top: "85px",
    right: "20px",
    background: "#0f172a",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    zIndex: "99999",
    boxShadow: "0 8px 20px rgba(0,0,0,.35)",
    opacity: "0",
    transform: "translateY(-5px)",
    transition: "opacity .3s ease, transform .3s ease",
  });

  document.body.appendChild(div);

  setTimeout(() => {
    div.style.opacity = "1";
    div.style.transform = "translateY(0)";
  }, 10);

  setTimeout(() => {
    div.style.opacity = "0";
    div.style.transform = "translateY(-5px)";
    setTimeout(() => div.remove(), 300);
  }, 1700);
}
