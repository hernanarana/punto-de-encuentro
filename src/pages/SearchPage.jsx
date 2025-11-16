// src/pages/SearchPage.jsx (test mínimo)
import { useLocation } from "react-router-dom";

export default function SearchPage() {
  const loc = useLocation();
  const q = new URLSearchParams(loc.search).get("q") || "";
  return (
    <div style={{ padding: 20 }}>
      <h1>/buscar OK</h1>
      <p>query: <code>{q}</code></p>
    </div>
  );
}
