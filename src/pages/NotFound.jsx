// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="container" style={{ padding: "48px 0" }}>
      <h1 style={{ marginBottom: 8 }}>Página no encontrada</h1>
      <p style={{ marginBottom: 16 }}>
        La ruta que intentaste abrir no existe.
      </p>
      <Link to="/" className="btn btn--primary">Volver al inicio</Link>
    </main>
  );
}
