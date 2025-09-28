// src/admin/pages/Login.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/admin";

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulación de login: marcamos sesión OK
    localStorage.setItem("ADMIN_OK", "1");
    navigate(from, { replace: true });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0b1220",
        padding: 16,
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: "#ffffff",
          padding: 24,
          borderRadius: 12,
          width: 360,
          boxShadow: "0 10px 30px rgba(0,0,0,.25)",
        }}
      >
        {/* Branding */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <img
            src="/logo-pe.png" // archivo en /public
            alt="Punto de Encuentro"
            width={72}
            height={72}
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              objectFit: "cover",
              background: "#fff",
              padding: 6,
              boxShadow: "0 2px 12px rgba(0,0,0,.15)",
            }}
          />
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0b1220" }}>
            Panel • Punto de Encuentro
          </h1>
        </div>

        <h2 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600, color: "#111827" }}>
          Ingresar al panel
        </h2>

        <label style={{ display: "grid", gap: 6, marginBottom: 12 }}>
          <span style={{ fontSize: 14, color: "#374151" }}>Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            autoComplete="username"
            style={{
              padding: 10,
              border: "1px solid #d1d5db",
              borderRadius: 8,
              outline: "none",
            }}
          />
        </label>

        <label style={{ display: "grid", gap: 6, marginBottom: 16 }}>
          <span style={{ fontSize: 14, color: "#374151" }}>Contraseña</span>
          <input
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            type="password"
            required
            autoComplete="current-password"
            style={{
              padding: 10,
              border: "1px solid #d1d5db",
              borderRadius: 8,
              outline: "none",
            }}
          />
        </label>

        <button
          type="submit"
          style={{
            width: "100%",
            background: "#0ea5e9",
            color: "#fff",
            border: 0,
            padding: 12,
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
